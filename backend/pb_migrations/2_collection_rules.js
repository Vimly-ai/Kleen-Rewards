/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  // Users collection rules
  const users = Dao(db).findCollectionByNameOrId("users");
  users.listRule = "@request.auth.id != '' && (@request.auth.company = company || @request.auth.role = 'super_admin')";
  users.viewRule = "@request.auth.id != '' && (@request.auth.id = id || @request.auth.company = company || @request.auth.role ~ 'admin')";
  users.createRule = null; // Only through registration
  users.updateRule = "@request.auth.id = id || @request.auth.role ~ 'admin'";
  users.deleteRule = "@request.auth.role = 'super_admin'";
  
  // Check-ins collection rules
  const checkIns = Dao(db).findCollectionByNameOrId("checkIns");
  checkIns.listRule = "@request.auth.id != '' && (@request.auth.id = user || @request.auth.role ~ 'admin')";
  checkIns.viewRule = "@request.auth.id != '' && (@request.auth.id = user || @request.auth.role ~ 'admin')";
  checkIns.createRule = "@request.auth.id != '' && @request.auth.status = 'approved'";
  checkIns.updateRule = "@request.auth.role = 'admin'";
  checkIns.deleteRule = "@request.auth.role = 'super_admin'";
  
  // Bonus points collection rules
  const bonusPoints = Dao(db).findCollectionByNameOrId("bonusPoints");
  bonusPoints.listRule = "@request.auth.id != '' && (@request.auth.id = user || @request.auth.role ~ 'admin')";
  bonusPoints.viewRule = "@request.auth.id != '' && (@request.auth.id = user || @request.auth.role ~ 'admin')";
  bonusPoints.createRule = "@request.auth.role ~ 'admin'";
  bonusPoints.updateRule = "@request.auth.role = 'super_admin'";
  bonusPoints.deleteRule = "@request.auth.role = 'super_admin'";
  
  // Rewards collection rules
  const rewards = Dao(db).findCollectionByNameOrId("rewards");
  rewards.listRule = "@request.auth.id != '' && @request.auth.company = company";
  rewards.viewRule = "@request.auth.id != '' && @request.auth.company = company";
  rewards.createRule = "@request.auth.role ~ 'admin'";
  rewards.updateRule = "@request.auth.role ~ 'admin'";
  rewards.deleteRule = "@request.auth.role = 'super_admin'";
  
  // Reward redemptions collection rules
  const redemptions = Dao(db).findCollectionByNameOrId("rewardRedemptions");
  redemptions.listRule = "@request.auth.id != '' && (@request.auth.id = user || @request.auth.role ~ 'admin')";
  redemptions.viewRule = "@request.auth.id != '' && (@request.auth.id = user || @request.auth.role ~ 'admin')";
  redemptions.createRule = "@request.auth.id = user && @request.auth.status = 'approved'";
  redemptions.updateRule = "@request.auth.role ~ 'admin'";
  redemptions.deleteRule = "@request.auth.role = 'super_admin'";
  
  // QR Codes collection rules
  const qrCodes = Dao(db).findCollectionByNameOrId("qrCodes");
  qrCodes.listRule = "@request.auth.role ~ 'admin'";
  qrCodes.viewRule = "@request.auth.id != ''"; // Anyone authenticated can validate QR codes
  qrCodes.createRule = "@request.auth.role ~ 'admin'";
  qrCodes.updateRule = "@request.auth.role ~ 'admin'";
  qrCodes.deleteRule = "@request.auth.role = 'super_admin'";
  
  // Companies collection rules
  const companies = Dao(db).findCollectionByNameOrId("companies");
  companies.listRule = "@request.auth.role = 'super_admin'";
  companies.viewRule = "@request.auth.company = id || @request.auth.role = 'super_admin'";
  companies.createRule = "@request.auth.role = 'super_admin'";
  companies.updateRule = "@request.auth.role = 'super_admin'";
  companies.deleteRule = "@request.auth.role = 'super_admin'";
  
  // Departments collection rules
  const departments = Dao(db).findCollectionByNameOrId("departments");
  departments.listRule = "@request.auth.company = company";
  departments.viewRule = "@request.auth.company = company";
  departments.createRule = "@request.auth.role ~ 'admin'";
  departments.updateRule = "@request.auth.role ~ 'admin'";
  departments.deleteRule = "@request.auth.role = 'super_admin'";
  
  // Badges collection rules
  const badges = Dao(db).findCollectionByNameOrId("badges");
  badges.listRule = "@request.auth.id != ''";
  badges.viewRule = "@request.auth.id != ''";
  badges.createRule = "@request.auth.role = 'super_admin'";
  badges.updateRule = "@request.auth.role = 'super_admin'";
  badges.deleteRule = "@request.auth.role = 'super_admin'";
  
  // User badges collection rules
  const userBadges = Dao(db).findCollectionByNameOrId("userBadges");
  userBadges.listRule = "@request.auth.id != '' && (@request.auth.id = user || @request.auth.role ~ 'admin')";
  userBadges.viewRule = "@request.auth.id != '' && (@request.auth.id = user || @request.auth.role ~ 'admin')";
  userBadges.createRule = null; // Only through system hooks
  userBadges.updateRule = null;
  userBadges.deleteRule = "@request.auth.role = 'super_admin'";
  
  // Save all collections
  return Promise.all([
    Dao(db).saveCollection(users),
    Dao(db).saveCollection(checkIns),
    Dao(db).saveCollection(bonusPoints),
    Dao(db).saveCollection(rewards),
    Dao(db).saveCollection(redemptions),
    Dao(db).saveCollection(qrCodes),
    Dao(db).saveCollection(companies),
    Dao(db).saveCollection(departments),
    Dao(db).saveCollection(badges),
    Dao(db).saveCollection(userBadges),
  ]);
});