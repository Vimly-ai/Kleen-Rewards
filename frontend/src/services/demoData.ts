/**
 * Demo Data Service - Enterprise Employee Rewards System
 * 
 * Provides comprehensive demo data for testing all system functionality
 * including admin/user accounts, points, achievements, rewards, etc.
 */

import { 
  User, 
  Badge, 
  UserBadge, 
  CheckIn, 
  Reward, 
  Transaction,
  Notification,
  Activity
} from '../types'

// Demo user accounts with different roles and states
export const DEMO_USERS: User[] = [
  {
    id: 'demo-admin-1',
    clerkId: 'demo_admin_clerk_id',
    email: 'admin@demo.com',
    name: 'Sarah Johnson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'admin',
    department: 'Human Resources',
    points: 187, // Current available points
    currentStreak: 45,
    longestStreak: 120,
    totalCheckIns: 342,
    totalPointsEarned: 487, // Total earned with new point system
    totalPointsRedeemed: 300, // Redeemed 2 extra days off
    level: 12,
    achievements: 28,
    joinedAt: new Date('2023-01-15'),
    lastActiveAt: new Date(),
    status: 'online',
    approvalStatus: 'approved', // Admin approval status
    bio: 'HR Director passionate about employee engagement and recognition.',
    preferences: {
      notifications: true,
      emailUpdates: true,
      theme: 'light'
    }
  },
  {
    id: 'demo-user-1',
    clerkId: 'demo_user_clerk_id',
    email: 'john@demo.com', 
    name: 'John Smith',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'employee',
    department: 'Engineering',
    points: 78, // Current available points
    currentStreak: 15,
    longestStreak: 30,
    totalCheckIns: 156,
    totalPointsEarned: 238, // Total earned with new point system
    totalPointsRedeemed: 160, // Redeemed various rewards
    level: 8,
    achievements: 15,
    joinedAt: new Date('2023-06-20'),
    lastActiveAt: new Date(),
    status: 'online',
    approvalStatus: 'approved', // Employee approval status
    bio: 'Senior Software Engineer | Coffee enthusiast | Team player',
    preferences: {
      notifications: true,
      emailUpdates: false,
      theme: 'system'
    }
  },
  {
    id: 'demo-user-2',
    clerkId: 'demo_user_2_clerk_id',
    email: 'emily@demo.com',
    name: 'Emily Chen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    role: 'employee',
    department: 'Marketing',
    points: 142, // Current available points
    currentStreak: 89,
    longestStreak: 89,
    totalCheckIns: 245,
    totalPointsEarned: 392, // Total earned with new point system (lots of bonuses)
    totalPointsRedeemed: 250, // Redeemed gift cards and day off
    level: 10,
    achievements: 22,
    joinedAt: new Date('2023-03-10'),
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 30),
    status: 'away',
    approvalStatus: 'approved', // Employee approval status
    bio: 'Marketing Manager | Creative thinker | Wellness advocate',
    preferences: {
      notifications: true,
      emailUpdates: true,
      theme: 'dark'
    }
  },
  {
    id: 'demo-user-3',
    clerkId: 'demo_user_3_clerk_id',
    email: 'michael@demo.com',
    name: 'Michael Rodriguez',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    role: 'employee',
    department: 'Sales',
    points: 32, // Current available points
    currentStreak: 7,
    longestStreak: 42,
    totalCheckIns: 98,
    totalPointsEarned: 152, // Total earned with new point system
    totalPointsRedeemed: 120, // Redeemed multiple gift cards
    level: 6,
    achievements: 11,
    joinedAt: new Date('2023-09-01'),
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'busy',
    approvalStatus: 'pending', // Pending approval
    bio: 'Sales Representative | Goal crusher | Basketball fan',
    preferences: {
      notifications: true,
      emailUpdates: true,
      theme: 'light'
    }
  },
  {
    id: 'demo-user-4',
    clerkId: 'demo_user_4_clerk_id',
    email: 'lisa@demo.com',
    name: 'Lisa Thompson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    role: 'employee',
    department: 'Design',
    points: 95, // Current available points
    currentStreak: 0,
    longestStreak: 65,
    totalCheckIns: 189,
    totalPointsEarned: 295, // Total earned with new point system
    totalPointsRedeemed: 200, // Redeemed day off and gift cards
    level: 9,
    achievements: 18,
    joinedAt: new Date('2023-04-22'),
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'offline',
    approvalStatus: 'suspended', // Suspended account
    bio: 'UX Designer | Innovation lover | Yoga practitioner',
    preferences: {
      notifications: false,
      emailUpdates: true,
      theme: 'light'
    }
  },
  {
    id: 'demo-user-5',
    clerkId: 'demo_user_5_clerk_id',
    email: 'david@demo.com',
    name: 'David Kim',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    role: 'employee',
    department: 'Operations',
    points: 45,
    currentStreak: 3,
    longestStreak: 25,
    totalCheckIns: 67,
    totalPointsEarned: 115,
    totalPointsRedeemed: 70,
    level: 5,
    achievements: 8,
    joinedAt: new Date('2023-11-15'),
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 45),
    status: 'away',
    approvalStatus: 'rejected', // Rejected account
    bio: 'Operations Specialist | Process improvement enthusiast',
    preferences: {
      notifications: true,
      emailUpdates: false,
      theme: 'light'
    }
  },
  {
    id: 'demo-user-6',
    clerkId: 'demo_user_6_clerk_id',
    email: 'jennifer@demo.com',
    name: 'Jennifer Martinez',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    role: 'employee',
    department: 'Finance',
    points: 120,
    currentStreak: 22,
    longestStreak: 60,
    totalCheckIns: 145,
    totalPointsEarned: 280,
    totalPointsRedeemed: 160,
    level: 8,
    achievements: 16,
    joinedAt: new Date('2023-05-10'),
    lastActiveAt: new Date(),
    status: 'online',
    approvalStatus: 'pending', // Another pending user
    bio: 'Financial Analyst | Numbers wizard | Marathon runner',
    preferences: {
      notifications: true,
      emailUpdates: true,
      theme: 'system'
    }
  }
]

// Demo badges/achievements
export const DEMO_BADGES: Badge[] = [
  {
    id: 'badge-1',
    name: 'Early Bird',
    description: 'Check in before 8 AM for 5 consecutive days',
    icon: '🌅',
    points: 100,
    category: 'punctuality',
    tier: 'bronze',
    criteria: { type: 'early_checkin', count: 5 },
    rarity: 'common'
  },
  {
    id: 'badge-2',
    name: 'Streak Master',
    description: 'Maintain a 30-day check-in streak',
    icon: '🔥',
    points: 250,
    category: 'consistency',
    tier: 'silver',
    criteria: { type: 'streak', count: 30 },
    rarity: 'uncommon'
  },
  {
    id: 'badge-3',
    name: 'Centurion',
    description: 'Complete 100 check-ins',
    icon: '💯',
    points: 500,
    category: 'milestone',
    tier: 'gold',
    criteria: { type: 'total_checkins', count: 100 },
    rarity: 'rare'
  },
  {
    id: 'badge-4',
    name: 'Team Player',
    description: 'Participate in 10 team activities',
    icon: '🤝',
    points: 150,
    category: 'teamwork',
    tier: 'bronze',
    criteria: { type: 'team_activities', count: 10 },
    rarity: 'common'
  },
  {
    id: 'badge-5',
    name: 'Wellness Warrior',
    description: 'Complete wellness challenges for 30 days',
    icon: '💪',
    points: 200,
    category: 'wellness',
    tier: 'silver',
    criteria: { type: 'wellness_activities', count: 30 },
    rarity: 'uncommon'
  },
  {
    id: 'badge-6',
    name: 'Learning Champion',
    description: 'Complete 5 professional development courses',
    icon: '🎓',
    points: 300,
    category: 'growth',
    tier: 'gold',
    criteria: { type: 'courses_completed', count: 5 },
    rarity: 'rare'
  },
  {
    id: 'badge-7',
    name: 'Innovation Star',
    description: 'Submit 3 improvement suggestions that get implemented',
    icon: '💡',
    points: 400,
    category: 'innovation',
    tier: 'platinum',
    criteria: { type: 'suggestions_implemented', count: 3 },
    rarity: 'epic'
  },
  {
    id: 'badge-8',
    name: 'Perfect Month',
    description: 'Check in every workday for an entire month',
    icon: '📅',
    points: 350,
    category: 'consistency',
    tier: 'gold',
    criteria: { type: 'perfect_month', count: 1 },
    rarity: 'rare'
  }
]

// Demo user badges (achievements earned)
export const DEMO_USER_BADGES: UserBadge[] = [
  // John's achievements
  { id: 'ub-1', userId: 'demo-user-1', badgeId: 'badge-1', unlockedAt: new Date('2024-01-15'), progress: 100 },
  { id: 'ub-2', userId: 'demo-user-1', badgeId: 'badge-2', unlockedAt: new Date('2024-02-20'), progress: 100 },
  { id: 'ub-3', userId: 'demo-user-1', badgeId: 'badge-3', unlockedAt: new Date('2024-03-10'), progress: 100 },
  { id: 'ub-4', userId: 'demo-user-1', badgeId: 'badge-4', unlockedAt: new Date('2024-04-05'), progress: 100 },
  
  // Emily's achievements (top performer)
  { id: 'ub-5', userId: 'demo-user-2', badgeId: 'badge-1', unlockedAt: new Date('2023-12-01'), progress: 100 },
  { id: 'ub-6', userId: 'demo-user-2', badgeId: 'badge-2', unlockedAt: new Date('2024-01-10'), progress: 100 },
  { id: 'ub-7', userId: 'demo-user-2', badgeId: 'badge-3', unlockedAt: new Date('2024-02-15'), progress: 100 },
  { id: 'ub-8', userId: 'demo-user-2', badgeId: 'badge-5', unlockedAt: new Date('2024-03-20'), progress: 100 },
  { id: 'ub-9', userId: 'demo-user-2', badgeId: 'badge-8', unlockedAt: new Date('2024-04-30'), progress: 100 },
  
  // Michael's achievements
  { id: 'ub-10', userId: 'demo-user-3', badgeId: 'badge-1', unlockedAt: new Date('2024-02-10'), progress: 100 },
  { id: 'ub-11', userId: 'demo-user-3', badgeId: 'badge-4', unlockedAt: new Date('2024-03-15'), progress: 100 },
  
  // Lisa's achievements
  { id: 'ub-12', userId: 'demo-user-4', badgeId: 'badge-1', unlockedAt: new Date('2023-11-20'), progress: 100 },
  { id: 'ub-13', userId: 'demo-user-4', badgeId: 'badge-2', unlockedAt: new Date('2024-01-05'), progress: 100 },
  { id: 'ub-14', userId: 'demo-user-4', badgeId: 'badge-6', unlockedAt: new Date('2024-03-01'), progress: 100 },
  { id: 'ub-15', userId: 'demo-user-4', badgeId: 'badge-7', unlockedAt: new Date('2024-04-15'), progress: 100 },
  
  // Admin's achievements
  { id: 'ub-16', userId: 'demo-admin-1', badgeId: 'badge-1', unlockedAt: new Date('2023-02-01'), progress: 100 },
  { id: 'ub-17', userId: 'demo-admin-1', badgeId: 'badge-2', unlockedAt: new Date('2023-03-15'), progress: 100 },
  { id: 'ub-18', userId: 'demo-admin-1', badgeId: 'badge-3', unlockedAt: new Date('2023-06-20'), progress: 100 },
  { id: 'ub-19', userId: 'demo-admin-1', badgeId: 'badge-8', unlockedAt: new Date('2023-09-30'), progress: 100 }
]

// Demo check-in history
export const DEMO_CHECKINS: CheckIn[] = [
  // Today's check-ins
  { 
    id: 'ci-1', 
    userId: 'demo-user-1', 
    checkInTime: new Date(new Date().setHours(8, 0, 0)), 
    points: 1, // On-time check-in
    bonusPoints: 10, // 10-day streak bonus (hit on day 10)
    isEarly: false,
    streakDay: 15,
    mood: 'great'
  },
  { 
    id: 'ci-2', 
    userId: 'demo-user-2', 
    checkInTime: new Date(new Date().setHours(7, 30, 0)), 
    points: 2, // Early check-in (before 7:45 AM)
    bonusPoints: 5, // Perfect week bonus
    isEarly: true,
    streakDay: 89,
    mood: 'excellent'
  },
  { 
    id: 'ci-3', 
    userId: 'demo-admin-1', 
    checkInTime: new Date(new Date().setHours(7, 40, 0)), 
    points: 2, // Early check-in (before 7:45 AM)
    bonusPoints: 0,
    isEarly: true,
    streakDay: 45,
    mood: 'good'
  },
  { 
    id: 'ci-4', 
    userId: 'demo-user-3', 
    checkInTime: new Date(new Date().setHours(8, 15, 0)), 
    points: 1, // On-time check-in (after 8:00 AM is still on-time)
    bonusPoints: 0,
    isEarly: false,
    streakDay: 7,
    mood: 'okay'
  }
]

// Generate historical check-ins for leaderboard and statistics
function generateHistoricalCheckIns(): CheckIn[] {
  const historicalCheckIns: CheckIn[] = []
  let checkInId = 100
  
  DEMO_USERS.forEach(user => {
    const daysToGenerate = Math.min(user.totalCheckIns, 90) // Last 90 days max
    
    for (let i = 1; i <= daysToGenerate; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const hour = 7 + Math.floor(Math.random() * 2)
      const minute = Math.floor(Math.random() * 60)
      date.setHours(hour, minute, 0)
      
      const isEarly = hour < 8 || (hour === 7 && minute < 45)
      const basePoints = isEarly ? 2 : 1
      
      // Calculate bonuses
      let bonusPoints = 0
      const streakDay = Math.max(1, user.currentStreak - i)
      
      // 10-day streak bonus
      if (streakDay === 10 || streakDay === 20 || streakDay === 30 || 
          streakDay === 40 || streakDay === 50 || streakDay === 60 ||
          streakDay === 70 || streakDay === 80 || streakDay === 90) {
        bonusPoints += 10
      }
      
      // Perfect week bonus (every 7th day)
      if (streakDay % 7 === 0 && streakDay > 0) {
        bonusPoints += 5
      }
      
      historicalCheckIns.push({
        id: `ci-${checkInId++}`,
        userId: user.id,
        checkInTime: date,
        points: basePoints,
        bonusPoints: bonusPoints,
        isEarly: isEarly,
        streakDay: streakDay,
        mood: ['great', 'good', 'okay', 'tired'][Math.floor(Math.random() * 4)] as any
      })
    }
  })
  
  return historicalCheckIns
}

// Demo rewards catalog
export const DEMO_REWARDS: Reward[] = [
  // Weekly Tier (5-15 points)
  {
    id: 'reward-1',
    name: '$5 Maverick Card',
    description: 'Gas up with a $5 Maverick gift card',
    pointsCost: 5,
    category: 'weekly',
    icon: '⛽',
    available: true,
    company: 'System Kleen',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  {
    id: 'reward-2',
    name: '$10 Dutch Bros Gift Card',
    description: 'Enjoy your favorite Dutch Bros drinks',
    pointsCost: 10,
    category: 'weekly',
    icon: '☕',
    available: true,
    company: 'System Kleen',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  {
    id: 'reward-3',
    name: '$15 Starbucks Gift Card',
    description: 'Treat yourself to Starbucks coffee and snacks',
    pointsCost: 15,
    category: 'weekly',
    icon: '☕',
    available: true,
    company: 'System Kleen',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  
  // Monthly Tier (25-50 points)
  {
    id: 'reward-4',
    name: '$25 Amazon Gift Card',
    description: 'Shop for anything you want on Amazon',
    pointsCost: 25,
    category: 'monthly',
    icon: '🛒',
    available: true,
    company: 'System Kleen',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  {
    id: 'reward-5',
    name: '$50 Scheels Gift Card',
    description: 'Get your outdoor and sports gear at Scheels',
    pointsCost: 50,
    category: 'monthly',
    icon: '🏔️',
    available: true,
    company: 'System Kleen',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  {
    id: 'reward-6',
    name: '$50 Amazon Gift Card',
    description: 'More shopping power on Amazon',
    pointsCost: 50,
    category: 'monthly',
    icon: '🛒',
    available: true,
    company: 'System Kleen',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  
  // Quarterly Tier (75-150 points)
  {
    id: 'reward-7',
    name: '$75 Gift Card (Your Choice)',
    description: 'Choose from Amazon, Scheels, Target, or Best Buy',
    pointsCost: 75,
    category: 'quarterly',
    icon: '🎁',
    available: true,
    company: 'System Kleen',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  {
    id: 'reward-8',
    name: '$100 Gift Card (Your Choice)',
    description: 'Choose from premium retailers including Amazon, Scheels, or dining',
    pointsCost: 100,
    category: 'quarterly',
    icon: '🎁',
    available: true,
    company: 'System Kleen',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  {
    id: 'reward-9',
    name: '$150 Gift Card (Premium Selection)',
    description: 'Premium gift card selection including travel, electronics, or experiences',
    pointsCost: 150,
    category: 'quarterly',
    icon: '🎁',
    available: true,
    company: 'System Kleen',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  
  // Annual Tier (175+ points)
  {
    id: 'reward-10',
    name: 'Extra Paid Day Off',
    description: 'Enjoy an additional paid vacation day to recharge and relax',
    pointsCost: 175,
    category: 'annual',
    icon: '🏖️',
    available: true,
    company: 'System Kleen',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  },
  {
    id: 'reward-11',
    name: 'Two Extra Paid Days Off',
    description: 'Take a long weekend with two additional paid vacation days',
    pointsCost: 300,
    category: 'annual',
    icon: '🏖️',
    available: true,
    company: 'System Kleen',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  }
]

// Demo redemption history
export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'trans-1',
    userId: 'demo-user-1',
    type: 'redemption',
    amount: -50,
    description: 'Redeemed: $50 Amazon Gift Card',
    rewardId: 'reward-6',
    status: 'completed',
    createdAt: new Date('2024-04-15T10:30:00')
  },
  {
    id: 'trans-2',
    userId: 'demo-user-1',
    type: 'earned',
    amount: 2,
    description: 'Daily check-in points (early)',
    status: 'completed',
    createdAt: new Date('2024-05-01T08:00:00')
  },
  {
    id: 'trans-3',
    userId: 'demo-user-2',
    type: 'redemption',
    amount: -175,
    description: 'Redeemed: Extra Paid Day Off',
    rewardId: 'reward-10',
    status: 'approved',
    createdAt: new Date('2024-04-28T14:20:00')
  },
  {
    id: 'trans-4',
    userId: 'demo-user-2',
    type: 'bonus',
    amount: 10,
    description: '10-day streak bonus',
    status: 'completed',
    createdAt: new Date('2024-04-30T17:00:00')
  },
  {
    id: 'trans-5',
    userId: 'demo-user-3',
    type: 'redemption',
    amount: -15,
    description: 'Redeemed: $15 Starbucks Gift Card',
    rewardId: 'reward-3',
    status: 'completed',
    createdAt: new Date('2024-04-20T11:45:00')
  },
  {
    id: 'trans-6',
    userId: 'demo-admin-1',
    type: 'redemption',
    amount: -100,
    description: 'Redeemed: $100 Gift Card (Amazon)',
    rewardId: 'reward-8',
    status: 'completed',
    createdAt: new Date('2024-03-10T09:15:00')
  },
  {
    id: 'trans-7',
    userId: 'demo-user-2',
    type: 'earned',
    amount: 1,
    description: 'Daily check-in points (on-time)',
    status: 'completed',
    createdAt: new Date('2024-05-01T08:00:00')
  },
  {
    id: 'trans-8',
    userId: 'demo-user-2',
    type: 'bonus',
    amount: 5,
    description: 'Perfect week bonus',
    status: 'completed',
    createdAt: new Date('2024-05-01T07:30:00')
  },
  {
    id: 'trans-9',
    userId: 'demo-user-4',
    type: 'redemption',
    amount: -25,
    description: 'Redeemed: $25 Amazon Gift Card',
    rewardId: 'reward-4',
    status: 'completed',
    createdAt: new Date('2024-04-01T09:00:00')
  },
  {
    id: 'trans-10',
    userId: 'demo-admin-1',
    type: 'redemption',
    amount: -175,
    description: 'Redeemed: Extra Paid Day Off',
    rewardId: 'reward-10',
    status: 'completed',
    createdAt: new Date('2024-02-15T10:00:00')
  }
]

// Demo notifications
export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'demo-user-1',
    type: 'achievement',
    title: 'New Achievement Unlocked!',
    message: 'Congratulations! You\'ve unlocked the "Streak Master" badge for maintaining a 30-day streak!',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 'notif-2',
    userId: 'demo-user-1',
    type: 'reward',
    title: 'Reward Redeemed Successfully',
    message: 'Your Amazon Gift Card has been processed and will be delivered within 24 hours.',
    read: true,
    createdAt: new Date('2024-04-15T10:35:00')
  },
  {
    id: 'notif-3',
    userId: 'demo-user-2',
    type: 'reminder',
    title: 'Don\'t Break Your Streak!',
    message: 'You haven\'t checked in yet today. Check in now to maintain your 89-day streak!',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: 'notif-4',
    userId: 'demo-admin-1',
    type: 'system',
    title: 'New Rewards Added',
    message: '5 new rewards have been added to the catalog. Check them out!',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  }
]

// Demo activities
export const DEMO_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    userId: 'demo-user-1',
    type: 'check_in',
    title: 'Daily Check-in',
    description: 'Checked in at 8:30 AM',
    points: 60,
    timestamp: new Date(new Date().setHours(8, 30, 0))
  },
  {
    id: 'act-2',
    userId: 'demo-user-2',
    type: 'achievement',
    title: 'Perfect Month',
    description: 'Unlocked for checking in every workday in April',
    points: 350,
    timestamp: new Date('2024-04-30T17:00:00')
  },
  {
    id: 'act-3',
    userId: 'demo-user-1',
    type: 'redemption',
    title: 'Reward Redeemed',
    description: 'Redeemed Amazon Gift Card - $50',
    points: -2500,
    timestamp: new Date('2024-04-15T10:30:00')
  },
  {
    id: 'act-4',
    userId: 'demo-user-3',
    type: 'bonus',
    title: 'Team Activity Bonus',
    description: 'Participated in team building event',
    points: 100,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
  }
]

// Helper function to get demo user by email
export function getDemoUserByEmail(email: string): User | undefined {
  return DEMO_USERS.find(user => user.email === email)
}

// Helper function to get user's badges
export function getUserBadges(userId: string): UserBadge[] {
  return DEMO_USER_BADGES.filter(ub => ub.userId === userId)
}

// Helper function to get user's transactions
export function getUserTransactions(userId: string): Transaction[] {
  return DEMO_TRANSACTIONS.filter(t => t.userId === userId)
}

// Helper function to get user's notifications
export function getUserNotifications(userId: string): Notification[] {
  return DEMO_NOTIFICATIONS.filter(n => n.userId === userId)
}

// Helper function to get user's activities
export function getUserActivities(userId: string): Activity[] {
  return DEMO_ACTIVITIES.filter(a => a.userId === userId)
}

// Helper function to get today's check-in for user
export function getTodayCheckIn(userId: string): CheckIn | undefined {
  const today = new Date()
  return DEMO_CHECKINS.find(ci => 
    ci.userId === userId && 
    ci.checkInTime.toDateString() === today.toDateString()
  )
}

// Helper function to get demo rewards
export function getDemoRewards(): Reward[] {
  return DEMO_REWARDS
}

// Helper function to calculate leaderboard
export function getLeaderboard(): Array<User & { rank: number, trend: 'up' | 'down' | 'same' }> {
  const sorted = [...DEMO_USERS]
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
      trend: index === 0 ? 'same' : index < 2 ? 'up' : 'down' as const
    }))
  
  return sorted
}

// Export all historical check-ins
export const ALL_CHECKINS = [...DEMO_CHECKINS, ...generateHistoricalCheckIns()]

// Demo credentials for display
export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@demo.com',
    password: 'demo123',
    description: 'Admin account with full access to analytics and management features'
  },
  user: {
    email: 'john@demo.com',
    password: 'demo123',
    description: 'Employee account with standard features and sample data'
  }
}