/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
  // Companies collection
  const companies = new Collection({
    id: "companies",
    name: "companies",
    type: "base",
    system: false,
    schema: [
      {
        id: "name",
        name: "name",
        type: "text",
        required: true,
        unique: true,
        options: {
          min: 2,
          max: 100,
        },
      },
      {
        id: "logo",
        name: "logo",
        type: "file",
        required: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/webp"],
        },
      },
      {
        id: "settings",
        name: "settings",
        type: "json",
        required: false,
      },
    ],
  });

  // Departments collection
  const departments = new Collection({
    id: "departments",
    name: "departments",
    type: "base",
    system: false,
    schema: [
      {
        id: "name",
        name: "name",
        type: "text",
        required: true,
        options: {
          min: 2,
          max: 50,
        },
      },
      {
        id: "company",
        name: "company",
        type: "relation",
        required: true,
        options: {
          collectionId: "companies",
          cascadeDelete: true,
          maxSelect: 1,
        },
      },
    ],
  });

  // Custom users extension
  const users = new Collection({
    id: "users",
    name: "users",
    type: "auth",
    system: false,
    schema: [
      {
        id: "name",
        name: "name",
        type: "text",
        required: true,
        options: {
          min: 2,
          max: 100,
        },
      },
      {
        id: "role",
        name: "role",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["employee", "admin", "super_admin"],
        },
      },
      {
        id: "company",
        name: "company",
        type: "relation",
        required: true,
        options: {
          collectionId: "companies",
          cascadeDelete: false,
          maxSelect: 1,
        },
      },
      {
        id: "department",
        name: "department",
        type: "relation",
        required: false,
        options: {
          collectionId: "departments",
          cascadeDelete: false,
          maxSelect: 1,
        },
      },
      {
        id: "status",
        name: "status",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["pending", "approved", "rejected", "suspended"],
        },
      },
      {
        id: "approvedBy",
        name: "approvedBy",
        type: "relation",
        required: false,
        options: {
          collectionId: "users",
          cascadeDelete: false,
          maxSelect: 1,
        },
      },
      {
        id: "approvedAt",
        name: "approvedAt",
        type: "date",
        required: false,
      },
    ],
  });

  // Check-ins collection
  const checkIns = new Collection({
    id: "checkIns",
    name: "checkIns",
    type: "base",
    system: false,
    schema: [
      {
        id: "user",
        name: "user",
        type: "relation",
        required: true,
        options: {
          collectionId: "users",
          cascadeDelete: true,
          maxSelect: 1,
        },
      },
      {
        id: "checkInTime",
        name: "checkInTime",
        type: "date",
        required: true,
      },
      {
        id: "type",
        name: "type",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["early", "ontime", "late"],
        },
      },
      {
        id: "pointsEarned",
        name: "pointsEarned",
        type: "number",
        required: true,
        options: {
          min: 0,
          max: 10,
        },
      },
      {
        id: "qrCodeData",
        name: "qrCodeData",
        type: "text",
        required: true,
      },
      {
        id: "location",
        name: "location",
        type: "json",
        required: false,
      },
      {
        id: "bonusReason",
        name: "bonusReason",
        type: "text",
        required: false,
      },
    ],
  });

  // Bonus Points collection
  const bonusPoints = new Collection({
    id: "bonusPoints",
    name: "bonusPoints",
    type: "base",
    system: false,
    schema: [
      {
        id: "user",
        name: "user",
        type: "relation",
        required: true,
        options: {
          collectionId: "users",
          cascadeDelete: true,
          maxSelect: 1,
        },
      },
      {
        id: "points",
        name: "points",
        type: "number",
        required: true,
        options: {
          min: 1,
          max: 100,
        },
      },
      {
        id: "reason",
        name: "reason",
        type: "text",
        required: true,
      },
      {
        id: "awardedBy",
        name: "awardedBy",
        type: "relation",
        required: true,
        options: {
          collectionId: "users",
          cascadeDelete: false,
          maxSelect: 1,
        },
      },
    ],
  });

  // Badges collection
  const badges = new Collection({
    id: "badges",
    name: "badges",
    type: "base",
    system: false,
    schema: [
      {
        id: "name",
        name: "name",
        type: "text",
        required: true,
        unique: true,
      },
      {
        id: "description",
        name: "description",
        type: "text",
        required: true,
      },
      {
        id: "icon",
        name: "icon",
        type: "text",
        required: true,
      },
      {
        id: "color",
        name: "color",
        type: "text",
        required: true,
      },
      {
        id: "criteria",
        name: "criteria",
        type: "json",
        required: true,
      },
    ],
  });

  // User Badges collection
  const userBadges = new Collection({
    id: "userBadges",
    name: "userBadges",
    type: "base",
    system: false,
    schema: [
      {
        id: "user",
        name: "user",
        type: "relation",
        required: true,
        options: {
          collectionId: "users",
          cascadeDelete: true,
          maxSelect: 1,
        },
      },
      {
        id: "badge",
        name: "badge",
        type: "relation",
        required: true,
        options: {
          collectionId: "badges",
          cascadeDelete: true,
          maxSelect: 1,
        },
      },
      {
        id: "unlockedAt",
        name: "unlockedAt",
        type: "date",
        required: true,
      },
    ],
  });

  // Rewards collection
  const rewards = new Collection({
    id: "rewards",
    name: "rewards",
    type: "base",
    system: false,
    schema: [
      {
        id: "name",
        name: "name",
        type: "text",
        required: true,
      },
      {
        id: "description",
        name: "description",
        type: "text",
        required: true,
      },
      {
        id: "pointsCost",
        name: "pointsCost",
        type: "number",
        required: true,
        options: {
          min: 1,
          max: 1000,
        },
      },
      {
        id: "category",
        name: "category",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["weekly", "monthly", "quarterly", "annual"],
        },
      },
      {
        id: "icon",
        name: "icon",
        type: "text",
        required: true,
      },
      {
        id: "available",
        name: "available",
        type: "bool",
        required: true,
      },
      {
        id: "company",
        name: "company",
        type: "relation",
        required: true,
        options: {
          collectionId: "companies",
          cascadeDelete: true,
          maxSelect: 1,
        },
      },
    ],
  });

  // Reward Redemptions collection
  const rewardRedemptions = new Collection({
    id: "rewardRedemptions",
    name: "rewardRedemptions",
    type: "base",
    system: false,
    schema: [
      {
        id: "user",
        name: "user",
        type: "relation",
        required: true,
        options: {
          collectionId: "users",
          cascadeDelete: true,
          maxSelect: 1,
        },
      },
      {
        id: "reward",
        name: "reward",
        type: "relation",
        required: true,
        options: {
          collectionId: "rewards",
          cascadeDelete: false,
          maxSelect: 1,
        },
      },
      {
        id: "pointsCost",
        name: "pointsCost",
        type: "number",
        required: true,
      },
      {
        id: "status",
        name: "status",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["pending", "approved", "completed", "rejected"],
        },
      },
      {
        id: "approvedBy",
        name: "approvedBy",
        type: "relation",
        required: false,
        options: {
          collectionId: "users",
          cascadeDelete: false,
          maxSelect: 1,
        },
      },
      {
        id: "approvedAt",
        name: "approvedAt",
        type: "date",
        required: false,
      },
      {
        id: "completedAt",
        name: "completedAt",
        type: "date",
        required: false,
      },
      {
        id: "notes",
        name: "notes",
        type: "text",
        required: false,
      },
    ],
  });

  // QR Codes collection
  const qrCodes = new Collection({
    id: "qrCodes",
    name: "qrCodes",
    type: "base",
    system: false,
    schema: [
      {
        id: "code",
        name: "code",
        type: "text",
        required: true,
        unique: true,
      },
      {
        id: "validFrom",
        name: "validFrom",
        type: "date",
        required: true,
      },
      {
        id: "validUntil",
        name: "validUntil",
        type: "date",
        required: true,
      },
      {
        id: "company",
        name: "company",
        type: "relation",
        required: true,
        options: {
          collectionId: "companies",
          cascadeDelete: true,
          maxSelect: 1,
        },
      },
      {
        id: "createdBy",
        name: "createdBy",
        type: "relation",
        required: true,
        options: {
          collectionId: "users",
          cascadeDelete: false,
          maxSelect: 1,
        },
      },
      {
        id: "rotationStrategy",
        name: "rotationStrategy",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["daily", "weekly", "monthly", "manual"],
        },
      },
    ],
  });

  return Dao(db).saveCollection(companies)
    .then(() => Dao(db).saveCollection(departments))
    .then(() => Dao(db).saveCollection(users))
    .then(() => Dao(db).saveCollection(checkIns))
    .then(() => Dao(db).saveCollection(bonusPoints))
    .then(() => Dao(db).saveCollection(badges))
    .then(() => Dao(db).saveCollection(userBadges))
    .then(() => Dao(db).saveCollection(rewards))
    .then(() => Dao(db).saveCollection(rewardRedemptions))
    .then(() => Dao(db).saveCollection(qrCodes));
}, (db) => {
  // Rollback
  const collections = [
    "qrCodes",
    "rewardRedemptions",
    "rewards",
    "userBadges",
    "badges",
    "bonusPoints",
    "checkIns",
    "users",
    "departments",
    "companies",
  ];

  collections.forEach(name => {
    try {
      const collection = Dao(db).findCollectionByNameOrId(name);
      if (collection) {
        Dao(db).deleteCollection(collection);
      }
    } catch (e) {
      // Collection might not exist
    }
  });
});