import { createClient } from '@supabase/supabase-js'
import * as demoData from './demoData'

// Supabase configuration - MUST be set via environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we're in development mode and can use mock data
const USE_MOCK_DATA = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true' || !supabaseUrl || !supabaseAnonKey

if (!USE_MOCK_DATA && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Supabase configuration missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
}

// Only create Supabase client if we have valid credentials and not using mock data
export const supabase = USE_MOCK_DATA 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey)

console.log('Supabase config:', { 
  url: supabaseUrl, 
  hasKey: !!supabaseAnonKey, 
  keyLength: supabaseAnonKey?.length,
  useMock: USE_MOCK_DATA 
})

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

// Mock data for when Supabase is not available
const MOCK_USER = (clerkUserId: string, userData: Partial<User>): User => {
  // Only return demo user data if it's actually a demo account
  const isDemoEmail = userData.email && (
    userData.email === 'admin@demo.com' ||
    userData.email === 'john@demo.com' ||
    userData.email === 'emily@demo.com' ||
    userData.email === 'michael@demo.com' ||
    userData.email === 'lisa@demo.com'
  )
  
  if (isDemoEmail) {
    const demoUser = demoData.getDemoUserByEmail(userData.email)
    if (demoUser) {
      return {
        id: clerkUserId,
        email: demoUser.email,
        name: demoUser.name,
        employee_id: demoUser.id,
        department: demoUser.department,
        hire_date: demoUser.joinedAt.toISOString().split('T')[0],
        role: demoUser.role,
        status: 'active',
        points_balance: demoUser.points,
        total_points_earned: demoUser.totalPointsEarned,
        current_streak: demoUser.currentStreak,
        longest_streak: demoUser.longestStreak,
        last_check_in: demoData.getTodayCheckIn(demoUser.id)?.checkInTime.toISOString() || new Date().toISOString(),
        first_name: demoUser.name.split(' ')[0],
        last_name: demoUser.name.split(' ')[1] || '',
        phone: null,
        created_at: demoUser.joinedAt.toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  }
  
  // For real users, create a fresh profile with starting points
  return {
    id: clerkUserId,
    email: userData.email || '',
    name: userData.name || 'New User',
    employee_id: userData.employee_id || clerkUserId,
    department: userData.department || 'General',
    hire_date: userData.hire_date || new Date().toISOString().split('T')[0],
    role: userData.role || 'employee',
    status: 'active',
    points_balance: 0, // Start with 0 points
    total_points_earned: 0,
    current_streak: 0,
    longest_streak: 0,
    last_check_in: null,
    first_name: userData.name?.split(' ')[0] || '',
    last_name: userData.name?.split(' ')[1] || '',
    phone: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

const MOCK_REWARDS = (): Reward[] => demoData.DEMO_REWARDS.map(reward => ({
  id: reward.id,
  name: reward.name,
  description: reward.description,
  points_cost: reward.pointCost,
  pointsCost: reward.pointCost, // Add camelCase for TypeScript interface
  category: reward.category as any,
  icon: reward.icon || '🎁',
  available: reward.inventoryCount > 0,
  company: 'System Kleen',
  availability: reward.availability === 'in_stock' ? 'available' : reward.availability as any,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  is_active: true,
  stock_quantity: reward.stock || 100,
  inventory_count: reward.inventoryCount,
  image_url: reward.imageUrl,
  terms_conditions: reward.terms
}))

const MOCK_LEADERBOARD = (): User[] => {
  const leaderboard = demoData.getLeaderboard()
  return leaderboard.map((user, index) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    employee_id: user.id,
    department: user.department,
    hire_date: user.joinedAt.toISOString().split('T')[0],
    role: user.role,
    status: 'active' as const,
    points_balance: user.points,
    total_points_earned: user.totalPointsEarned,
    current_streak: user.currentStreak,
    longest_streak: user.longestStreak,
    last_check_in: demoData.getTodayCheckIn(user.id)?.checkInTime.toISOString() || new Date().toISOString(),
    first_name: user.name.split(' ')[0],
    last_name: user.name.split(' ')[1] || '',
    phone: null,
    created_at: user.joinedAt.toISOString(),
    updated_at: new Date().toISOString()
  }))
}

// API Service Class
export class SupabaseService {
  // Users (synced from Clerk)
  static async getOrCreateUser(clerkUserId: string, userData: Partial<User>): Promise<User> {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for user:', clerkUserId)
      return MOCK_USER(clerkUserId, userData)
    }

    try {
      console.log('Attempting to get/create user:', clerkUserId, userData)
      
      // Try to get existing user
      const { data: existingUser, error: fetchError } = await supabase
        .from('employees')
        .select('*')
        .eq('id', clerkUserId)
        .single()

      console.log('Fetch result:', { existingUser, fetchError })

      if (existingUser && !fetchError) {
        return existingUser
      }

      // Create new user if doesn't exist (ignore "not found" errors)
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Database fetch error:', fetchError)
        console.warn('Database error, falling back to mock data')
        return MOCK_USER(clerkUserId, userData)
      }

      console.log('Creating new user...')
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

      console.log('Create result:', { newUser, createError })

      if (createError) {
        console.error('Database create error:', createError)
        console.warn('Database error, falling back to mock data')
        return MOCK_USER(clerkUserId, userData)
      }

      return newUser
    } catch (error: any) {
      console.error('Error in getOrCreateUser:', error)
      console.warn('Database connection failed, using mock data')
      return MOCK_USER(clerkUserId, userData)
    }
  }

  static async getUser(userId: string): Promise<User> {
    if (USE_MOCK_DATA || !supabase) {
      return MOCK_USER(userId, {})
    }

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
    if (USE_MOCK_DATA || !supabase) {
      console.log('Mock: updateUser called for', userId, userData)
      return MOCK_USER(userId, userData)
    }

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
    if (USE_MOCK_DATA || !supabase) {
      console.log('Mock: getUserCheckIns called for', userId)
      // Return some mock check-ins
      const mockCheckIns: CheckIn[] = [
        {
          id: '1',
          user_id: userId,
          check_in_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          points_earned: 10,
          check_in_type: 'ontime',
          streak_day: 4,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: userId,
          check_in_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          points_earned: 15,
          check_in_type: 'early',
          streak_day: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      return limit ? mockCheckIns.slice(0, limit) : mockCheckIns
    }

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
    if (USE_MOCK_DATA || !supabase) {
      console.log('Mock: getTodaysCheckIn called for', userId)
      const checkIn = demoData.getTodayCheckIn(userId)
      if (!checkIn) return null
      
      return {
        id: checkIn.id,
        user_id: checkIn.userId,
        check_in_time: checkIn.checkInTime.toISOString(),
        points_earned: checkIn.points + (checkIn.bonusPoints || 0),
        check_in_type: checkIn.isEarly ? 'early' : 'ontime',
        location: 'Office',
        notes: checkIn.mood ? `Feeling ${checkIn.mood}` : undefined,
        created_at: checkIn.checkInTime.toISOString(),
        updated_at: checkIn.checkInTime.toISOString()
      }
    }

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
    if (USE_MOCK_DATA) {
      console.log('Using mock data for rewards')
      let rewards = MOCK_REWARDS()
      if (category) {
        rewards = rewards.filter(r => r.category === category)
      }
      return rewards
    }

    try {
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
        console.warn('Database error, falling back to mock rewards:', error)
        let rewards = MOCK_REWARDS()
        if (category) {
          rewards = rewards.filter(r => r.category === category)
        }
        return rewards
      }

      return data || []
    } catch (error) {
      console.warn('Database connection failed, using mock rewards')
      let rewards = MOCK_REWARDS()
      if (category) {
        rewards = rewards.filter(r => r.category === category)
      }
      return rewards
    }
  }

  static async getAvailableRewards(category?: string): Promise<Reward[]> {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for available rewards')
      return demoData.getDemoRewards().filter(r => 
        (!category || r.category === category) && r.inventory_count > 0
      )
    }
    
    const query = supabase
      .from('rewards')
      .select('*')
      .gt('inventory_count', 0)
      .eq('is_active', true)
    
    if (category) {
      query.eq('category', category)
    }
    
    const { data, error } = await query.order('points_cost', { ascending: true })
    
    if (error) {
      throw error
    }
    
    return data || []
  }

  static async getRewardById(rewardId: string): Promise<Reward | null> {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for reward by id')
      return demoData.getDemoRewards().find(r => r.id === rewardId) || null
    }
    
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .single()
    
    if (error) {
      throw error
    }
    
    return data
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
    if (USE_MOCK_DATA || !supabase) {
      console.log('Mock: getUserBadges called for', userId)
      const userBadges = demoData.getUserBadges(userId)
      const badges = demoData.DEMO_BADGES
      
      return userBadges.map(ub => {
        const badge = badges.find(b => b.id === ub.badgeId)
        return {
          id: ub.id,
          user_id: userId,
          badge_id: ub.badgeId,
          earned_date: ub.unlockedAt.toISOString(),
          badge: badge ? {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            points_value: badge.points,
            icon_url: badge.icon,
            criteria: JSON.stringify(badge.criteria),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } : undefined
        }
      })
    }
    
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

  // Additional user methods for enhanced queries
  static async getCurrentUser(): Promise<User | null> {
    if (USE_MOCK_DATA || !supabase) {
      console.log('Mock: getCurrentUser called')
      // In demo mode, this should be handled by DataContext
      // Return null here as the actual user will be set via getOrCreateUser
      return null
    }
    // In a real app, you'd get the current user ID from auth context
    return null
  }

  static async getUserById(userId: string): Promise<User | null> {
    if (USE_MOCK_DATA || !supabase) {
      console.log('Mock: getUserById called for', userId)
      const user = demoData.DEMO_USERS.find(u => u.id === userId || u.clerkId === userId)
      if (user) {
        return MOCK_USER(userId, { email: user.email })
      }
      return MOCK_USER(userId, {})
    }
    return this.getUser(userId)
  }

  static async getUserStats(userId: string): Promise<any> {
    if (USE_MOCK_DATA || !supabase) {
      console.log('Mock: getUserStats called for', userId)
      const user = demoData.DEMO_USERS.find(u => u.id === userId || u.clerkId === userId)
      const userBadges = demoData.getUserBadges(userId)
      const leaderboard = demoData.getLeaderboard()
      const userRank = leaderboard.findIndex(u => u.id === userId || u.clerkId === userId) + 1
      
      if (user) {
        return {
          totalCheckIns: user.totalCheckIns,
          totalPoints: user.totalPointsEarned,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          averageCheckInTime: '08:45 AM',
          recentAchievements: userBadges.length,
          rank: userRank > 0 ? userRank : 5,
          weeklyProgress: 85,
          badges: userBadges,
          level: user.level,
          pointsBalance: user.points
        }
      }
      
      return {
        totalCheckIns: 25,
        totalPoints: 300,
        currentStreak: 5,
        longestStreak: 12,
        averageCheckInTime: '08:45 AM',
        recentAchievements: 3,
        rank: 2,
        weeklyProgress: 85,
        badges: [],
        level: 1,
        pointsBalance: 150
      }
    }
    // Return mock stats for now
    return {
      totalCheckIns: 25,
      totalPoints: 300,
      currentStreak: 5,
      longestStreak: 12,
      averageCheckInTime: '08:45 AM',
      recentAchievements: 3,
      rank: 2,
      weeklyProgress: 85
    }
  }

  // Leaderboard
  static async getLeaderboard(limit: number = 10): Promise<User[]> {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for leaderboard')
      return MOCK_LEADERBOARD().slice(0, limit)
    }

    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('role', 'employee')
        .order('points_balance', { ascending: false })
        .order('current_streak', { ascending: false })
        .limit(limit)

      if (error) {
        console.warn('Database error, falling back to mock leaderboard:', error)
        return MOCK_LEADERBOARD().slice(0, limit)
      }

      return data || []
    } catch (error) {
      console.warn('Database connection failed, using mock leaderboard')
      return MOCK_LEADERBOARD().slice(0, limit)
    }
  }

  // Additional Reward Management Methods
  static async deleteReward(id: string): Promise<void> {
    const { error } = await supabase
      .from('rewards')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  }

  // Badge Management Methods
  static async createBadge(badgeData: Omit<Badge, 'id' | 'created_at' | 'updated_at'>): Promise<Badge> {
    const { data, error } = await supabase
      .from('badges')
      .insert([badgeData])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async updateBadge(id: string, updates: Partial<Badge>): Promise<Badge> {
    const { data, error } = await supabase
      .from('badges')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async deleteBadge(id: string): Promise<void> {
    const { error } = await supabase
      .from('badges')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  }

  // Motivational Quote Management
  static async getMotivationalQuotes(): Promise<any[]> {
    const { data, error } = await supabase
      .from('motivational_quotes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data || []
  }

  static async createMotivationalQuote(quoteData: { text: string; author: string; category?: string }): Promise<any> {
    const { data, error } = await supabase
      .from('motivational_quotes')
      .insert([quoteData])
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async updateMotivationalQuote(id: string, updates: Partial<{ text: string; author: string; category: string }>): Promise<any> {
    const { data, error } = await supabase
      .from('motivational_quotes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async deleteMotivationalQuote(id: string): Promise<void> {
    const { error } = await supabase
      .from('motivational_quotes')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  }
}

export default SupabaseService