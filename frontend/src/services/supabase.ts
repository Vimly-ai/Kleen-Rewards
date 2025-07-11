import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://widztbcqvrpijjcpczwl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZHp0YmNxdnJwaWpqY3BjendpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1MDg4MDAsImV4cCI6MjA1MzA4NDgwMH0.xStBmf7YsQ0e4iRvEJPwCo0Ql_Vg8-jYGIBZ9-8PjOo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  created_at: string
  updated_at: string
}

export interface CheckIn {
  id: string
  user_id: string
  check_in_time: string
  points_earned: number
  check_in_type: 'early' | 'ontime' | 'late'
  location?: string
  streak_day: number
  created_at: string
  updated_at: string
  user?: User
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
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
  user?: User
  reward?: Reward
  processed_by_user?: User
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  criteria_type: 'streak' | 'points' | 'checkins' | 'special'
  criteria_value: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_date: string
  created_at: string
  badge?: Badge
}

export interface MotivationalQuote {
  id: string
  quote_text: string
  author?: string
  category: 'motivation' | 'success' | 'teamwork' | 'general'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SystemSetting {
  id: string
  setting_key: string
  setting_value: string
  description: string
  category: 'points' | 'timing' | 'general' | 'company'
  created_at: string
  updated_at: string
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
  created_at: string
  updated_at: string
  user?: User
  created_by_user?: User
}

// API Service Class
export class SupabaseService {
  // Users (synced from Clerk)
  static async getOrCreateUser(clerkUserId: string, userData: Partial<User>): Promise<User> {
    try {
      // Try to get existing user
      const { data: existingUser, error: fetchError } = await supabase
        .from('employees')
        .select('*')
        .eq('id', clerkUserId)
        .single()

      if (existingUser && !fetchError) {
        return existingUser
      }

      // Create new user if doesn't exist
      const { data: newUser, error: createError } = await supabase
        .from('employees')
        .insert([{
          id: clerkUserId,
          ...userData,
          points_balance: 0,
          total_points_earned: 0,
          current_streak: 0,
          longest_streak: 0,
          status: 'active'
        }])
        .select()
        .single()

      if (createError) {
        throw createError
      }

      return newUser
    } catch (error) {
      console.error('Error in getOrCreateUser:', error)
      throw error
    }
  }

  static async getUser(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('employees')
      .update(userData)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async getAllEmployees(): Promise<User[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('role', 'employee')
      .order('points_balance', { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  }

  // Check-ins
  static async createCheckIn(userId: string, checkInData: Omit<CheckIn, 'id' | 'created_at' | 'updated_at'>): Promise<CheckIn> {
    const { data, error } = await supabase
      .from('check_ins')
      .insert([{
        ...checkInData,
        user_id: userId
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async getUserCheckIns(userId: string, limit?: number): Promise<CheckIn[]> {
    let query = supabase
      .from('check_ins')
      .select(`
        *,
        user:employees(*)
      `)
      .eq('user_id', userId)
      .order('check_in_time', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data || []
  }

  static async getTodaysCheckIn(userId: string): Promise<CheckIn | null> {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('check_ins')
      .select('*')
      .eq('user_id', userId)
      .gte('check_in_time', `${today}T00:00:00`)
      .lt('check_in_time', `${today}T23:59:59`)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error
    }

    return data || null
  }

  static async getAllCheckInsToday(): Promise<CheckIn[]> {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('check_ins')
      .select(`
        *,
        user:employees(*)
      `)
      .gte('check_in_time', `${today}T00:00:00`)
      .lt('check_in_time', `${today}T23:59:59`)

    if (error) {
      throw error
    }

    return data || []
  }

  // Rewards
  static async getRewards(category?: string): Promise<Reward[]> {
    let query = supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .order('points_cost', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data || []
  }

  static async createReward(rewardData: Omit<Reward, 'id' | 'created_at' | 'updated_at'>): Promise<Reward> {
    const { data, error } = await supabase
      .from('rewards')
      .insert([rewardData])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async updateReward(rewardId: string, rewardData: Partial<Reward>): Promise<Reward> {
    const { data, error } = await supabase
      .from('rewards')
      .update(rewardData)
      .eq('id', rewardId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  // Redemptions
  static async createRedemption(userId: string, rewardId: string, pointsCost: number): Promise<Redemption> {
    const { data, error } = await supabase
      .from('redemptions')
      .insert([{
        user_id: userId,
        reward_id: rewardId,
        points_spent: pointsCost,
        status: 'pending',
        requested_date: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async getUserRedemptions(userId: string): Promise<Redemption[]> {
    const { data, error } = await supabase
      .from('redemptions')
      .select(`
        *,
        reward:rewards(*)
      `)
      .eq('user_id', userId)
      .order('requested_date', { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  }

  static async getPendingRedemptions(): Promise<Redemption[]> {
    const { data, error } = await supabase
      .from('redemptions')
      .select(`
        *,
        user:employees(*),
        reward:rewards(*)
      `)
      .eq('status', 'pending')
      .order('requested_date', { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  }

  static async getAllRedemptions(): Promise<Redemption[]> {
    const { data, error } = await supabase
      .from('redemptions')
      .select(`
        *,
        user:employees(*),
        reward:rewards(*),
        processed_by_user:employees!redemptions_processed_by_fkey(*)
      `)
      .order('requested_date', { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  }

  static async updateRedemptionStatus(
    redemptionId: string,
    status: 'approved' | 'rejected' | 'fulfilled',
    processedBy: string,
    rejectionReason?: string,
    fulfillmentNotes?: string
  ): Promise<Redemption> {
    const { data, error } = await supabase
      .from('redemptions')
      .update({
        status,
        processed_date: new Date().toISOString(),
        processed_by: processedBy,
        rejection_reason: rejectionReason,
        fulfillment_notes: fulfillmentNotes
      })
      .eq('id', redemptionId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  // Badges
  static async getUserBadges(userId: string): Promise<UserBadge[]> {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    return data || []
  }

  static async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
    const { data, error } = await supabase
      .from('user_badges')
      .insert([{
        user_id: userId,
        badge_id: badgeId,
        earned_date: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  // Motivational Quotes
  static async getRandomQuote(): Promise<MotivationalQuote> {
    const { data, error } = await supabase
      .from('motivational_quotes')
      .select('*')
      .eq('is_active', true)

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      // Return a default quote if none found
      return {
        id: 'default',
        quote_text: 'Every great journey begins with a single step. Keep going!',
        author: 'System Kleen',
        category: 'motivation',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    const randomIndex = Math.floor(Math.random() * data.length)
    return data[randomIndex]
  }

  // System Settings
  static async getSettings(): Promise<SystemSetting[]> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')

    if (error) {
      throw error
    }

    return data || []
  }

  static async getSetting(key: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return data?.setting_value || null
  }

  static async updateSetting(key: string, value: string): Promise<SystemSetting> {
    // Try to update existing setting
    const { data: existing, error: fetchError } = await supabase
      .from('system_settings')
      .select('id')
      .eq('setting_key', key)
      .single()

    if (existing && !fetchError) {
      // Update existing
      const { data, error } = await supabase
        .from('system_settings')
        .update({ setting_value: value })
        .eq('setting_key', key)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } else {
      // Create new
      const { data, error } = await supabase
        .from('system_settings')
        .insert([{
          setting_key: key,
          setting_value: value,
          description: `Auto-created setting: ${key}`,
          category: 'general'
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    }
  }

  // Point Transactions
  static async createPointTransaction(transactionData: Omit<PointTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<PointTransaction> {
    const { data, error } = await supabase
      .from('point_transactions')
      .insert([transactionData])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async getUserPointHistory(userId: string): Promise<PointTransaction[]> {
    const { data, error } = await supabase
      .from('point_transactions')
      .select(`
        *,
        created_by_user:employees!point_transactions_created_by_fkey(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    return data || []
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
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('role', 'employee')
      .order('points_balance', { ascending: false })
      .order('current_streak', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return data || []
  }
}

export default SupabaseService