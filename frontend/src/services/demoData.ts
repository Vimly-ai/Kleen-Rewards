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
    points: 15750,
    currentStreak: 45,
    longestStreak: 120,
    totalCheckIns: 342,
    totalPointsEarned: 45650,
    totalPointsRedeemed: 29900,
    level: 12,
    achievements: 28,
    joinedAt: new Date('2023-01-15'),
    lastActiveAt: new Date(),
    status: 'online',
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
    points: 8500,
    currentStreak: 15,
    longestStreak: 30,
    totalCheckIns: 156,
    totalPointsEarned: 22500,
    totalPointsRedeemed: 14000,
    level: 8,
    achievements: 15,
    joinedAt: new Date('2023-06-20'),
    lastActiveAt: new Date(),
    status: 'online',
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
    points: 12300,
    currentStreak: 89,
    longestStreak: 89,
    totalCheckIns: 245,
    totalPointsEarned: 35400,
    totalPointsRedeemed: 23100,
    level: 10,
    achievements: 22,
    joinedAt: new Date('2023-03-10'),
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 30),
    status: 'away',
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
    points: 5200,
    currentStreak: 7,
    longestStreak: 42,
    totalCheckIns: 98,
    totalPointsEarned: 15600,
    totalPointsRedeemed: 10400,
    level: 6,
    achievements: 11,
    joinedAt: new Date('2023-09-01'),
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'busy',
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
    points: 9800,
    currentStreak: 0,
    longestStreak: 65,
    totalCheckIns: 189,
    totalPointsEarned: 28400,
    totalPointsRedeemed: 18600,
    level: 9,
    achievements: 18,
    joinedAt: new Date('2023-04-22'),
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'offline',
    bio: 'UX Designer | Innovation lover | Yoga practitioner',
    preferences: {
      notifications: false,
      emailUpdates: true,
      theme: 'light'
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
    checkInTime: new Date(new Date().setHours(8, 30, 0)), 
    points: 50,
    bonusPoints: 10,
    isEarly: true,
    streakDay: 15,
    mood: 'great'
  },
  { 
    id: 'ci-2', 
    userId: 'demo-user-2', 
    checkInTime: new Date(new Date().setHours(7, 45, 0)), 
    points: 50,
    bonusPoints: 25,
    isEarly: true,
    streakDay: 89,
    mood: 'excellent'
  },
  { 
    id: 'ci-3', 
    userId: 'demo-admin-1', 
    checkInTime: new Date(new Date().setHours(8, 0, 0)), 
    points: 50,
    bonusPoints: 20,
    isEarly: true,
    streakDay: 45,
    mood: 'good'
  },
  { 
    id: 'ci-4', 
    userId: 'demo-user-3', 
    checkInTime: new Date(new Date().setHours(9, 15, 0)), 
    points: 50,
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
      date.setHours(7 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0)
      
      historicalCheckIns.push({
        id: `ci-${checkInId++}`,
        userId: user.id,
        checkInTime: date,
        points: 50,
        bonusPoints: Math.random() > 0.7 ? Math.floor(Math.random() * 25) : 0,
        isEarly: date.getHours() < 8,
        streakDay: Math.max(1, user.currentStreak - i),
        mood: ['great', 'good', 'okay', 'tired'][Math.floor(Math.random() * 4)] as any
      })
    }
  })
  
  return historicalCheckIns
}

// Demo rewards catalog
export const DEMO_REWARDS: Reward[] = [
  {
    id: 'reward-1',
    name: 'Extra Day Off',
    description: 'Enjoy an additional paid day off to recharge and relax',
    pointCost: 5000,
    category: 'time-off',
    imageUrl: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3',
    availability: 'in_stock',
    stock: 10,
    expiresAt: new Date('2024-12-31'),
    terms: 'Must be approved by manager. Cannot be used during blackout periods.',
    featured: true,
    popularity: 95
  },
  {
    id: 'reward-2',
    name: 'Amazon Gift Card - $50',
    description: 'Shop for anything you want on Amazon',
    pointCost: 2500,
    category: 'gift-cards',
    imageUrl: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf',
    availability: 'in_stock',
    stock: 50,
    expiresAt: null,
    terms: 'Digital delivery within 24 hours',
    featured: true,
    popularity: 88
  },
  {
    id: 'reward-3',
    name: 'Premium Parking Spot - 1 Month',
    description: 'Reserved parking spot close to the entrance for one month',
    pointCost: 1500,
    category: 'perks',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a',
    availability: 'in_stock',
    stock: 5,
    expiresAt: new Date('2024-12-31'),
    terms: 'Subject to availability. First come, first served.',
    featured: false,
    popularity: 72
  },
  {
    id: 'reward-4',
    name: 'Team Lunch with CEO',
    description: 'Join the CEO for an exclusive team lunch and discussion',
    pointCost: 3000,
    category: 'experiences',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    availability: 'limited',
    stock: 2,
    expiresAt: new Date('2024-08-31'),
    terms: 'Date to be scheduled based on CEO availability',
    featured: true,
    popularity: 85
  },
  {
    id: 'reward-5',
    name: 'Fitness Tracker',
    description: 'Latest model fitness tracker to help you stay healthy',
    pointCost: 4000,
    category: 'merchandise',
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6',
    availability: 'in_stock',
    stock: 15,
    expiresAt: null,
    terms: 'Choice of Fitbit or Apple Watch SE',
    featured: false,
    popularity: 78
  },
  {
    id: 'reward-6',
    name: 'Professional Development Course',
    description: 'Access to any online course up to $500 value',
    pointCost: 3500,
    category: 'learning',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    availability: 'in_stock',
    stock: 20,
    expiresAt: new Date('2024-12-31'),
    terms: 'Course must be job-related and pre-approved',
    featured: true,
    popularity: 82
  },
  {
    id: 'reward-7',
    name: 'Work From Home Day',
    description: 'Enjoy the flexibility of working from home for one day',
    pointCost: 1000,
    category: 'flexibility',
    imageUrl: 'https://images.unsplash.com/photo-1565843708714-52ecf69ab81f',
    availability: 'in_stock',
    stock: 100,
    expiresAt: null,
    terms: 'Subject to manager approval and team schedule',
    featured: false,
    popularity: 90
  },
  {
    id: 'reward-8',
    name: 'Company Swag Bundle',
    description: 'Premium company merchandise bundle including hoodie, mug, and backpack',
    pointCost: 1200,
    category: 'merchandise',
    imageUrl: 'https://images.unsplash.com/photo-1588414734732-660b07304ddb',
    availability: 'in_stock',
    stock: 30,
    expiresAt: null,
    terms: 'Available in multiple sizes and colors',
    featured: false,
    popularity: 65
  }
]

// Demo redemption history
export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'trans-1',
    userId: 'demo-user-1',
    type: 'redemption',
    amount: -2500,
    description: 'Redeemed: Amazon Gift Card - $50',
    rewardId: 'reward-2',
    status: 'completed',
    createdAt: new Date('2024-04-15T10:30:00')
  },
  {
    id: 'trans-2',
    userId: 'demo-user-1',
    type: 'earned',
    amount: 50,
    description: 'Daily check-in points',
    status: 'completed',
    createdAt: new Date('2024-05-01T08:30:00')
  },
  {
    id: 'trans-3',
    userId: 'demo-user-2',
    type: 'redemption',
    amount: -5000,
    description: 'Redeemed: Extra Day Off',
    rewardId: 'reward-1',
    status: 'pending',
    createdAt: new Date('2024-04-28T14:20:00')
  },
  {
    id: 'trans-4',
    userId: 'demo-user-2',
    type: 'bonus',
    amount: 500,
    description: 'Perfect Month achievement bonus',
    status: 'completed',
    createdAt: new Date('2024-04-30T17:00:00')
  },
  {
    id: 'trans-5',
    userId: 'demo-user-3',
    type: 'redemption',
    amount: -1000,
    description: 'Redeemed: Work From Home Day',
    rewardId: 'reward-7',
    status: 'completed',
    createdAt: new Date('2024-04-20T11:45:00')
  },
  {
    id: 'trans-6',
    userId: 'demo-admin-1',
    type: 'redemption',
    amount: -3500,
    description: 'Redeemed: Professional Development Course',
    rewardId: 'reward-6',
    status: 'completed',
    createdAt: new Date('2024-03-10T09:15:00')
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