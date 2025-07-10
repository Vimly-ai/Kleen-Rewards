/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  const dao = Dao(db);
  
  // Create default company
  const company = new Record(dao.findCollectionByNameOrId("companies"));
  company.set("name", "Demo Company");
  company.set("settings", JSON.stringify({
    checkInWindow: {
      start: "06:00",
      end: "09:00",
      timezone: "America/Denver"
    },
    pointsConfig: {
      early: 2,
      onTime: 1,
      late: 0
    },
    streakBonuses: {
      7: 5,
      10: 10,
      30: 25
    }
  }));
  dao.saveRecord(company);
  
  // Create departments
  const departments = ["Engineering", "Marketing", "HR", "Sales", "Management"];
  const deptRecords = {};
  
  departments.forEach(name => {
    const dept = new Record(dao.findCollectionByNameOrId("departments"));
    dept.set("name", name);
    dept.set("company", company.get("id"));
    dao.saveRecord(dept);
    deptRecords[name] = dept;
  });
  
  // Create badges
  const badgesData = [
    { id: "early_bird", name: "Early Bird", description: "Checked in early 5 times", icon: "sunrise", color: "#F59E0B" },
    { id: "streak_master", name: "Streak Master", description: "Maintained a 7-day streak", icon: "flame", color: "#EF4444" },
    { id: "perfect_week", name: "Perfect Week", description: "Perfect attendance for a week", icon: "trophy", color: "#10B981" },
    { id: "point_collector", name: "Point Collector", description: "Earned 100 total points", icon: "medal", color: "#8B5CF6" },
    { id: "consistency_king", name: "Consistency King", description: "Checked in on time 20 times", icon: "clock", color: "#06B6D4" }
  ];
  
  const badgeRecords = {};
  badgesData.forEach(data => {
    const badge = new Record(dao.findCollectionByNameOrId("badges"));
    badge.set("name", data.name);
    badge.set("description", data.description);
    badge.set("icon", data.icon);
    badge.set("color", data.color);
    badge.set("criteria", JSON.stringify({}));
    dao.saveRecord(badge);
    badgeRecords[data.id] = badge;
  });
  
  // Create rewards
  const rewardsData = [
    { name: "$5 Maverick Card", description: "Fuel up with a $5 Maverick gift card", pointsCost: 5, category: "weekly", icon: "card" },
    { name: "Coffee Voucher", description: "Free coffee from the company cafe", pointsCost: 3, category: "weekly", icon: "cafe" },
    { name: "$25 Gift Card", description: "Choose from popular retailers", pointsCost: 25, category: "monthly", icon: "gift" },
    { name: "$100 Gift Card", description: "High-value gift card of your choice", pointsCost: 75, category: "quarterly", icon: "gift" },
    { name: "Half-Day Off", description: "Take a half day off with pay", pointsCost: 100, category: "quarterly", icon: "calendar" },
    { name: "Tech Gadget", description: "Choose from latest tech accessories", pointsCost: 120, category: "quarterly", icon: "phone-portrait" },
    { name: "Paid Trip", description: "Paid trip to a destination of your choice", pointsCost: 300, category: "annual", icon: "airplane" },
    { name: "Vacation Day", description: "Additional paid vacation day", pointsCost: 350, category: "annual", icon: "calendar" },
    { name: "Professional Course", description: "Enroll in any professional development course", pointsCost: 400, category: "annual", icon: "school" }
  ];
  
  rewardsData.forEach(data => {
    const reward = new Record(dao.findCollectionByNameOrId("rewards"));
    reward.set("name", data.name);
    reward.set("description", data.description);
    reward.set("pointsCost", data.pointsCost);
    reward.set("category", data.category);
    reward.set("icon", data.icon);
    reward.set("available", true);
    reward.set("company", company.get("id"));
    dao.saveRecord(reward);
  });
  
  // Note: Users will be created through the registration process
  // The admin account is created via docker-compose environment variables
  
  return dao;
});