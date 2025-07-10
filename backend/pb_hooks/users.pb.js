/// <reference path="../pb_data/types.d.ts" />

// Hook to handle user registration with approval workflow
onRecordBeforeCreateRequest((e) => {
  if (e.collection.name !== "users") return;
  
  // Set default values for new users
  e.record.set("status", "pending");
  e.record.set("role", "employee");
}, "users");

// Hook to calculate user points on demand
routerAdd("GET", "/api/custom/users/:id/stats", (c) => {
  const userId = c.pathParam("id");
  const authRecord = c.get("authRecord");
  
  if (!authRecord) {
    return c.json(401, { error: "Unauthorized" });
  }
  
  // Check if user can view these stats
  if (authRecord.id !== userId && !authRecord.get("role").includes("admin")) {
    return c.json(403, { error: "Forbidden" });
  }
  
  const dao = $app.dao();
  
  try {
    // Get all check-ins
    const checkIns = dao.findRecordsByFilter(
      "checkIns",
      `user = {:userId}`,
      { userId: userId },
      100,
      0,
      { checkInTime: -1 }
    );
    
    // Get all bonus points
    const bonusPoints = dao.findRecordsByFilter(
      "bonusPoints",
      `user = {:userId}`,
      { userId: userId },
      100,
      0,
      { created: -1 }
    );
    
    // Get all redemptions
    const redemptions = dao.findRecordsByFilter(
      "rewardRedemptions",
      `user = {:userId}`,
      { userId: userId },
      100,
      0,
      { created: -1 }
    );
    
    // Calculate points
    let totalPoints = 0;
    let weeklyPoints = 0;
    let monthlyPoints = 0;
    let quarterlyPoints = 0;
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    // Add check-in points
    checkIns.forEach(checkIn => {
      const points = checkIn.get("pointsEarned");
      const date = new Date(checkIn.get("checkInTime"));
      
      totalPoints += points;
      if (date >= weekAgo) weeklyPoints += points;
      if (date >= monthAgo) monthlyPoints += points;
      if (date >= quarterAgo) quarterlyPoints += points;
    });
    
    // Add bonus points
    bonusPoints.forEach(bonus => {
      const points = bonus.get("points");
      const date = new Date(bonus.get("created"));
      
      totalPoints += points;
      if (date >= weekAgo) weeklyPoints += points;
      if (date >= monthAgo) monthlyPoints += points;
      if (date >= quarterAgo) quarterlyPoints += points;
    });
    
    // Subtract redeemed points
    redemptions.forEach(redemption => {
      if (redemption.get("status") !== "rejected") {
        totalPoints -= redemption.get("pointsCost");
      }
    });
    
    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;
    
    // Sort check-ins by date (newest first)
    const sortedCheckIns = checkIns.sort((a, b) => {
      return new Date(b.get("checkInTime")) - new Date(a.get("checkInTime"));
    });
    
    sortedCheckIns.forEach((checkIn, index) => {
      const checkInDate = new Date(checkIn.get("checkInTime"));
      checkInDate.setHours(0, 0, 0, 0);
      
      if (index === 0) {
        // Check if the most recent check-in is today or yesterday
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (checkInDate.getTime() === today.getTime() || checkInDate.getTime() === yesterday.getTime()) {
          currentStreak = 1;
          tempStreak = 1;
          lastDate = checkInDate;
        }
      } else if (lastDate) {
        const dayDiff = (lastDate - checkInDate) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          tempStreak++;
          if (currentStreak > 0) currentStreak++;
          lastDate = checkInDate;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          if (currentStreak > 0) currentStreak = 0; // Reset current streak if gap found
          lastDate = checkInDate;
        }
      }
    });
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Get user badges
    const userBadges = dao.findRecordsByFilter(
      "userBadges",
      `user = {:userId}`,
      { userId: userId }
    );
    
    return c.json(200, {
      totalPoints,
      weeklyPoints,
      monthlyPoints,
      quarterlyPoints,
      currentStreak,
      longestStreak,
      totalCheckIns: checkIns.length,
      recentCheckIns: checkIns.slice(0, 10),
      recentBonusPoints: bonusPoints.slice(0, 10),
      badges: userBadges,
      redemptions: redemptions
    });
    
  } catch (err) {
    return c.json(500, { error: "Failed to get stats", details: err.message });
  }
});