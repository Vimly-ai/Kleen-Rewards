/// <reference path="../pb_data/types.d.ts" />

// Hooks for check-in business logic
routerAdd("POST", "/api/custom/checkin", (c) => {
  const data = c.requestData;
  const authRecord = c.get("authRecord");
  
  if (!authRecord) {
    return c.json(401, { error: "Unauthorized" });
  }
  
  const dao = $app.dao();
  
  try {
    // Validate QR code
    const qrCode = data.qrCode;
    if (!qrCode) {
      return c.json(400, { error: "QR code is required" });
    }
    
    // Get current time in MST
    const now = new Date();
    const mstOffset = -7 * 60; // MST is UTC-7
    const mstTime = new Date(now.getTime() + (now.getTimezoneOffset() + mstOffset) * 60000);
    const currentHour = mstTime.getHours();
    const currentMinute = mstTime.getMinutes();
    
    // Check if within valid time window (6:00 AM - 9:00 AM MST)
    if (currentHour < 6 || currentHour >= 9) {
      return c.json(400, { 
        error: "Check-in outside valid hours",
        message: "Check-in is only available between 6:00 AM and 9:00 AM MST"
      });
    }
    
    // Check if already checked in today
    const startOfDay = new Date(mstTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(mstTime);
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingCheckIn = dao.findFirstRecordByFilter(
      "checkIns",
      `user = {:userId} && checkInTime >= {:start} && checkInTime <= {:end}`,
      {
        userId: authRecord.id,
        start: startOfDay.toISOString(),
        end: endOfDay.toISOString()
      }
    );
    
    if (existingCheckIn) {
      return c.json(400, { 
        error: "Already checked in",
        message: "You have already checked in today"
      });
    }
    
    // Validate QR code from database
    const qrRecord = dao.findFirstRecordByFilter(
      "qrCodes",
      `code = {:code} && validFrom <= {:now} && validUntil >= {:now} && company = {:company}`,
      {
        code: qrCode,
        now: now.toISOString(),
        company: authRecord.get("company")
      }
    );
    
    if (!qrRecord) {
      return c.json(400, { 
        error: "Invalid QR code",
        message: "This QR code is not valid or has expired"
      });
    }
    
    // Calculate points based on check-in time
    let type = "late";
    let pointsEarned = 0;
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    
    if (currentTimeMinutes <= 465) { // 7:45 AM
      type = "early";
      pointsEarned = 2;
    } else if (currentTimeMinutes <= 480) { // 8:00 AM
      type = "ontime";
      pointsEarned = 1;
    }
    
    // Create check-in record
    const checkIn = new Record(dao.findCollectionByNameOrId("checkIns"));
    checkIn.set("user", authRecord.id);
    checkIn.set("checkInTime", now.toISOString());
    checkIn.set("type", type);
    checkIn.set("pointsEarned", pointsEarned);
    checkIn.set("qrCodeData", qrCode);
    checkIn.set("location", data.location || null);
    
    dao.saveRecord(checkIn);
    
    // Check for streak bonuses
    const checkStreakBonus = () => {
      // Get check-ins for the last 30 days
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentCheckIns = dao.findRecordsByFilter(
        "checkIns",
        `user = {:userId} && checkInTime >= {:since}`,
        {
          userId: authRecord.id,
          since: thirtyDaysAgo.toISOString()
        },
        30,
        0,
        { checkInTime: -1 }
      );
      
      // Calculate current streak
      let currentStreak = 1;
      let lastDate = new Date(mstTime);
      lastDate.setHours(0, 0, 0, 0);
      
      for (let i = 1; i < recentCheckIns.length; i++) {
        const checkInDate = new Date(recentCheckIns[i].get("checkInTime"));
        checkInDate.setHours(0, 0, 0, 0);
        
        const dayDiff = (lastDate - checkInDate) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          currentStreak++;
          lastDate = checkInDate;
        } else {
          break;
        }
      }
      
      // Award streak bonuses
      if (currentStreak === 7) {
        const bonus = new Record(dao.findCollectionByNameOrId("bonusPoints"));
        bonus.set("user", authRecord.id);
        bonus.set("points", 5);
        bonus.set("reason", "7-day streak bonus!");
        bonus.set("awardedBy", authRecord.id); // Self-awarded by system
        dao.saveRecord(bonus);
        pointsEarned += 5;
      } else if (currentStreak === 10) {
        const bonus = new Record(dao.findCollectionByNameOrId("bonusPoints"));
        bonus.set("user", authRecord.id);
        bonus.set("points", 10);
        bonus.set("reason", "10-day streak bonus!");
        bonus.set("awardedBy", authRecord.id);
        dao.saveRecord(bonus);
        pointsEarned += 10;
      } else if (currentStreak === 30) {
        const bonus = new Record(dao.findCollectionByNameOrId("bonusPoints"));
        bonus.set("user", authRecord.id);
        bonus.set("points", 25);
        bonus.set("reason", "30-day streak bonus! Amazing consistency!");
        bonus.set("awardedBy", authRecord.id);
        dao.saveRecord(bonus);
        pointsEarned += 25;
      }
      
      return currentStreak;
    };
    
    const currentStreak = checkStreakBonus();
    
    // Get motivational quote based on check-in type
    const quotes = {
      early: [
        { text: "The early bird catches the worm!", author: "William Camden" },
        { text: "Well begun is half done.", author: "Aristotle" },
        { text: "Early to bed and early to rise makes a man healthy, wealthy, and wise.", author: "Benjamin Franklin" }
      ],
      ontime: [
        { text: "Punctuality is the politeness of kings.", author: "Louis XVIII" },
        { text: "Better three hours too soon than a minute too late.", author: "William Shakespeare" },
        { text: "Time is the most valuable thing a man can spend.", author: "Theophrastus" }
      ],
      late: [
        { text: "It's never too late to be what you might have been.", author: "George Eliot" },
        { text: "Tomorrow is the first day of the rest of your life.", author: "Abbie Hoffman" },
        { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" }
      ]
    };
    
    const quoteList = quotes[type];
    const quote = quoteList[Math.floor(Math.random() * quoteList.length)];
    
    return c.json(200, {
      success: true,
      message: type === "early" ? "Early bird! +2 points" : 
               type === "ontime" ? "Perfect timing! +1 point" : 
               "You made it! Keep improving",
      pointsEarned: pointsEarned,
      type: type,
      currentStreak: currentStreak,
      quote: quote
    });
    
  } catch (err) {
    return c.json(500, { error: "Check-in failed", details: err.message });
  }
});