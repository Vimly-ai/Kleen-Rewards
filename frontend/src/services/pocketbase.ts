import PocketBase from 'pocketbase'

// PocketBase client setup (data storage only, auth via Clerk)
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090')

// Disable PocketBase auth since we use Clerk
pb.authStore.clear()

// Types for our data models
export interface User {
  id: string
  email: string
  name: string
  employee_id: string
  department: string
  hire_date: string
  role: 'employee' | 'admin'
  status: 'active' | 'inactive' | 'pending'
  points_balance: number
  total_points_earned: number
  current_streak: number
  longest_streak: number
  created: string
  updated: string
}

export interface CheckIn {
  id: string
  user_id: string
  check_in_time: string
  points_earned: number
  check_in_type: 'early' | 'ontime' | 'late'
  location?: string
  streak_day: number
  created: string
  updated: string
  expand?: {
    user_id: User
  }
}

export interface Reward {
  id: string
  name: string
  description: string
  category: 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'special'
  points_cost: number
  quantity_available: number
  is_active: boolean
  image_url?: string
  terms?: string
  created: string
  updated: string
}

export interface Redemption {
  id: string
  user_id: string
  reward_id: string
  points_spent: number
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  requested_date: string
  processed_date?: string
  processed_by?: string
  rejection_reason?: string
  fulfillment_notes?: string
  created: string
  updated: string
  expand?: {
    user_id: User
    reward_id: Reward
    processed_by: User
  }
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  criteria_type: 'streak' | 'points' | 'checkins' | 'special'
  criteria_value: number
  is_active: boolean
  created: string
  updated: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_date: string
  created: string
  expand?: {
    badge_id: Badge
  }
}

export interface MotivationalQuote {
  id: string
  quote_text: string
  author?: string
  category: 'motivation' | 'success' | 'teamwork' | 'general'
  is_active: boolean
  created: string
  updated: string
}

export interface SystemSetting {
  id: string
  setting_key: string
  setting_value: string
  description: string
  category: 'points' | 'timing' | 'general' | 'company'
  created: string
  updated: string
}

export interface PointTransaction {
  id: string
  user_id: string
  transaction_type: 'earned' | 'spent' | 'adjusted' | 'refunded'
  points_amount: number
  reference_type: 'checkin' | 'redemption' | 'admin_adjustment' | 'bonus'
  reference_id: string
  description: string
  created_by?: string
  created: string
  updated: string
  expand?: {
    user_id: User
    created_by: User
  }
}

// API Service Class
export class PocketBaseService {
  // Note: Authentication is handled by Clerk, not PocketBase
  // PocketBase is used only for data storage and retrieval
  
  // Set auth token from Clerk for PocketBase requests (if needed)
  static setAuthToken(token: string) {
    pb.authStore.save(token, null)
  }

  // Clear auth token
  static clearAuth() {
    pb.authStore.clear()
  }

  // Users (synced from Clerk)
  static async getOrCreateUser(clerkUserId: string, userData: Partial<User>): Promise<User> {
    try {
      // Try to get existing user
      return await pb.collection('employees').getOne(clerkUserId)
    } catch (error) {
      // Create new user if doesn't exist
      return await pb.collection('employees').create({
        id: clerkUserId,
        ...userData,
        points_balance: 0,
        total_points_earned: 0,
        current_streak: 0,
        longest_streak: 0,
        status: 'active'
      })
    }
  }

  static async getUser(userId: string): Promise<User> {
    return await pb.collection('employees').getOne(userId)
  }

  static async updateUser(userId: string, data: Partial<User>): Promise<User> {
    return await pb.collection('employees').update(userId, data)
  }

  static async getAllEmployees(): Promise<User[]> {
    return await pb.collection('employees').getFullList({
      filter: 'role = "employee"',
      sort: '-points_balance'
    })
  }

  // Check-ins
  static async createCheckIn(userId: string, checkInData: Omit<CheckIn, 'id' | 'created' | 'updated'>): Promise<CheckIn> {
    return await pb.collection('check_ins').create({
      ...checkInData,
      user_id: userId
    })
  }

  static async getUserCheckIns(userId: string, limit?: number): Promise<CheckIn[]> {
    return await pb.collection('check_ins').getList(1, limit || 50, {
      filter: `user_id = "${userId}"`,
      sort: '-check_in_time',
      expand: 'user_id'
    }).then(result => result.items)
  }

  static async getTodaysCheckIn(userId: string): Promise<CheckIn | null> {
    const today = new Date().toISOString().split('T')[0]
    try {
      const result = await pb.collection('check_ins').getFirstListItem(
        `user_id = "${userId}" && check_in_time >= "${today} 00:00:00"`
      )
      return result
    } catch (error) {
      return null // No check-in today
    }
  }

  static async getAllCheckInsToday(): Promise<CheckIn[]> {
    const today = new Date().toISOString().split('T')[0]
    return await pb.collection('check_ins').getFullList({
      filter: `check_in_time >= "${today} 00:00:00"`,
      expand: 'user_id'
    })
  }

  // Rewards
  static async getRewards(category?: string): Promise<Reward[]> {
    const filter = category ? `is_active = true && category = "${category}"` : 'is_active = true'
    return await pb.collection('rewards').getFullList({
      filter,
      sort: 'points_cost'
    })
  }

  static async createReward(rewardData: Omit<Reward, 'id' | 'created' | 'updated'>): Promise<Reward> {
    return await pb.collection('rewards').create(rewardData)
  }

  static async updateReward(rewardId: string, data: Partial<Reward>): Promise<Reward> {
    return await pb.collection('rewards').update(rewardId, data)
  }

  // Redemptions
  static async createRedemption(userId: string, rewardId: string, pointsCost: number): Promise<Redemption> {
    return await pb.collection('redemptions').create({
      user_id: userId,
      reward_id: rewardId,
      points_spent: pointsCost,
      status: 'pending',
      requested_date: new Date().toISOString()
    })
  }

  static async getUserRedemptions(userId: string): Promise<Redemption[]> {
    return await pb.collection('redemptions').getList(1, 50, {
      filter: `user_id = "${userId}"`,
      sort: '-requested_date',
      expand: 'reward_id'
    }).then(result => result.items)
  }

  static async getPendingRedemptions(): Promise<Redemption[]> {
    return await pb.collection('redemptions').getFullList({
      filter: 'status = "pending"',
      sort: '-requested_date',
      expand: 'user_id,reward_id'
    })
  }

  static async getAllRedemptions(): Promise<Redemption[]> {
    return await pb.collection('redemptions').getFullList({
      sort: '-requested_date',
      expand: 'user_id,reward_id,processed_by'
    })
  }

  static async updateRedemptionStatus(
    redemptionId: string, 
    status: 'approved' | 'rejected' | 'fulfilled',
    processedBy: string,
    rejectionReason?: string,
    fulfillmentNotes?: string
  ): Promise<Redemption> {
    return await pb.collection('redemptions').update(redemptionId, {
      status,
      processed_date: new Date().toISOString(),
      processed_by: processedBy,
      rejection_reason: rejectionReason,
      fulfillment_notes: fulfillmentNotes
    })
  }

  // Badges
  static async getUserBadges(userId: string): Promise<UserBadge[]> {
    return await pb.collection('user_badges').getFullList({
      filter: `user_id = "${userId}"`,
      expand: 'badge_id'
    })
  }

  static async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
    return await pb.collection('user_badges').create({
      user_id: userId,
      badge_id: badgeId,
      earned_date: new Date().toISOString()
    })
  }

  // Motivational Quotes
  static async getRandomQuote(): Promise<MotivationalQuote> {
    const quotes = await pb.collection('motivational_quotes').getFullList({
      filter: 'is_active = true'
    })
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  // System Settings
  static async getSettings(): Promise<SystemSetting[]> {
    return await pb.collection('system_settings').getFullList()
  }

  static async getSetting(key: string): Promise<string | null> {
    try {
      const setting = await pb.collection('system_settings').getFirstListItem(`setting_key = "${key}"`)
      return setting.setting_value
    } catch (error) {
      return null
    }
  }

  static async updateSetting(key: string, value: string): Promise<SystemSetting> {
    try {
      const existing = await pb.collection('system_settings').getFirstListItem(`setting_key = "${key}"`)
      return await pb.collection('system_settings').update(existing.id, { setting_value: value })
    } catch (error) {
      // Create if doesn't exist
      return await pb.collection('system_settings').create({
        setting_key: key,
        setting_value: value,
        description: `Auto-created setting: ${key}`,
        category: 'general'
      })
    }
  }

  // Point Transactions
  static async createPointTransaction(data: Omit<PointTransaction, 'id' | 'created' | 'updated'>): Promise<PointTransaction> {
    return await pb.collection('point_transactions').create(data)
  }

  static async getUserPointHistory(userId: string): Promise<PointTransaction[]> {
    return await pb.collection('point_transactions').getList(1, 50, {
      filter: `user_id = "${userId}"`,
      sort: '-created',
      expand: 'created_by'
    }).then(result => result.items)
  }

  // Analytics
  static async getAnalyticsData() {
    const [users, checkIns, redemptions] = await Promise.all([
      this.getAllEmployees(),
      this.getAllCheckInsToday(),
      this.getAllRedemptions()
    ])

    return {
      totalEmployees: users.length,
      todayCheckIns: checkIns.length,
      pendingRedemptions: redemptions.filter(r => r.status === 'pending').length,
      totalPointsAwarded: checkIns.reduce((sum, c) => sum + c.points_earned, 0)
    }
  }

  // Leaderboard
  static async getLeaderboard(limit: number = 10): Promise<User[]> {
    return await pb.collection('employees').getList(1, limit, {
      filter: 'role = "employee"',
      sort: '-points_balance,-current_streak'
    }).then(result => result.items)
  }
}

export default PocketBaseService