/**
 * Check-In Service - Enterprise Employee Rewards System
 * 
 * Handles check-in logic and point calculations based on:
 * - On time (8:00 AM): +1 point
 * - Early (before 7:45 AM): +2 points
 * - Perfect week: +5 bonus
 * - 10-day streak: +10 bonus
 */

import { SupabaseService } from './supabase'
import { CheckIn } from '../types'

export interface CheckInResult {
  success: boolean
  points: number
  bonusPoints: number
  totalPoints: number
  message: string
  isEarly: boolean
  streakDay: number
  bonuses: {
    perfectWeek: boolean
    streakBonus: boolean
  }
}

export class CheckInService {
  // Time constants
  static readonly EARLY_CUTOFF_HOUR = 7
  static readonly EARLY_CUTOFF_MINUTE = 45
  static readonly ON_TIME_HOUR = 8
  static readonly ON_TIME_MINUTE = 0
  
  // Point values
  static readonly EARLY_POINTS = 2
  static readonly ON_TIME_POINTS = 1
  static readonly PERFECT_WEEK_BONUS = 5
  static readonly STREAK_BONUS = 10
  static readonly STREAK_BONUS_INTERVAL = 10

  /**
   * Process a check-in for a user
   */
  static async processCheckIn(userId: string): Promise<CheckInResult> {
    try {
      // Check if already checked in today
      const todayCheckIn = await SupabaseService.getTodaysCheckIn(userId)
      if (todayCheckIn) {
        return {
          success: false,
          points: 0,
          bonusPoints: 0,
          totalPoints: 0,
          message: 'You have already checked in today',
          isEarly: false,
          streakDay: 0,
          bonuses: { perfectWeek: false, streakBonus: false }
        }
      }

      // Get current time
      const now = new Date()
      const hour = now.getHours()
      const minute = now.getMinutes()
      
      // Determine if early or on-time
      const isEarly = hour < this.EARLY_CUTOFF_HOUR || 
                     (hour === this.EARLY_CUTOFF_HOUR && minute < this.EARLY_CUTOFF_MINUTE)
      const basePoints = isEarly ? this.EARLY_POINTS : this.ON_TIME_POINTS
      
      // Get user's current streak and check-in history
      const user = await SupabaseService.getUser(userId)
      const userCheckIns = await SupabaseService.getUserCheckIns(userId, 30)
      
      // Calculate streak
      const { currentStreak, isPerfectWeek } = await this.calculateStreak(userId, userCheckIns)
      const newStreakDay = currentStreak + 1
      
      // Calculate bonuses
      let bonusPoints = 0
      const bonuses = {
        perfectWeek: false,
        streakBonus: false
      }
      
      // Perfect week bonus (every 7 days)
      if (isPerfectWeek && newStreakDay % 7 === 0) {
        bonusPoints += this.PERFECT_WEEK_BONUS
        bonuses.perfectWeek = true
      }
      
      // 10-day streak bonus (every 10 days)
      if (newStreakDay % this.STREAK_BONUS_INTERVAL === 0) {
        bonusPoints += this.STREAK_BONUS
        bonuses.streakBonus = true
      }
      
      // Create check-in record
      const checkIn = await SupabaseService.createCheckIn({
        userId,
        checkInTime: now,
        points: basePoints,
        bonusPoints,
        isEarly,
        streakDay: newStreakDay
      })
      
      // Update user's points and streak
      await SupabaseService.updateUserPoints(userId, basePoints + bonusPoints)
      await SupabaseService.updateUserStreak(userId, newStreakDay)
      
      // Generate success message
      let message = `Check-in successful! You earned ${basePoints} point${basePoints > 1 ? 's' : ''}`
      if (isEarly) {
        message += ' for checking in early'
      }
      if (bonusPoints > 0) {
        message += ` plus ${bonusPoints} bonus points`
        if (bonuses.perfectWeek) {
          message += ' for a perfect week'
        }
        if (bonuses.streakBonus) {
          message += bonuses.perfectWeek ? ' and' : ' for'
          message += ` your ${newStreakDay}-day streak`
        }
      }
      message += '!'
      
      return {
        success: true,
        points: basePoints,
        bonusPoints,
        totalPoints: basePoints + bonusPoints,
        message,
        isEarly,
        streakDay: newStreakDay,
        bonuses
      }
    } catch (error) {
      console.error('Check-in error:', error)
      return {
        success: false,
        points: 0,
        bonusPoints: 0,
        totalPoints: 0,
        message: 'An error occurred during check-in. Please try again.',
        isEarly: false,
        streakDay: 0,
        bonuses: { perfectWeek: false, streakBonus: false }
      }
    }
  }

  /**
   * Calculate current streak and check for perfect week
   */
  static async calculateStreak(userId: string, recentCheckIns: CheckIn[]): Promise<{ 
    currentStreak: number
    isPerfectWeek: boolean 
  }> {
    // Sort check-ins by date (most recent first)
    const sortedCheckIns = recentCheckIns.sort((a, b) => 
      new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
    )
    
    // Calculate current streak
    let currentStreak = 0
    let lastCheckInDate: Date | null = null
    
    for (const checkIn of sortedCheckIns) {
      const checkInDate = new Date(checkIn.checkInTime)
      checkInDate.setHours(0, 0, 0, 0) // Normalize to start of day
      
      if (!lastCheckInDate) {
        // First check-in
        currentStreak = 1
        lastCheckInDate = checkInDate
      } else {
        // Check if consecutive weekday
        const dayDiff = this.getWeekdayDifference(checkInDate, lastCheckInDate)
        
        if (dayDiff === 1) {
          // Consecutive weekday
          currentStreak++
          lastCheckInDate = checkInDate
        } else {
          // Streak broken
          break
        }
      }
    }
    
    // Check for perfect week (last 7 weekdays)
    const isPerfectWeek = currentStreak >= 5 // At least 5 consecutive weekdays
    
    return { currentStreak, isPerfectWeek }
  }

  /**
   * Calculate difference in weekdays between two dates
   */
  static getWeekdayDifference(date1: Date, date2: Date): number {
    let count = 0
    const current = new Date(date2)
    
    while (current < date1) {
      current.setDate(current.getDate() + 1)
      // Skip weekends
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        count++
      }
    }
    
    return count
  }

  /**
   * Get check-in statistics for a user
   */
  static async getCheckInStats(userId: string): Promise<{
    totalCheckIns: number
    currentStreak: number
    longestStreak: number
    perfectWeeks: number
    totalPoints: number
    averageCheckInTime: string
  }> {
    const user = await SupabaseService.getUser(userId)
    const allCheckIns = await SupabaseService.getUserCheckIns(userId)
    
    // Calculate average check-in time
    let totalMinutes = 0
    allCheckIns.forEach(checkIn => {
      const time = new Date(checkIn.checkInTime)
      totalMinutes += time.getHours() * 60 + time.getMinutes()
    })
    
    const avgMinutes = Math.round(totalMinutes / allCheckIns.length)
    const avgHour = Math.floor(avgMinutes / 60)
    const avgMin = avgMinutes % 60
    const averageCheckInTime = `${avgHour.toString().padStart(2, '0')}:${avgMin.toString().padStart(2, '0')}`
    
    // Count perfect weeks
    const perfectWeeks = Math.floor(user.longestStreak / 7)
    
    return {
      totalCheckIns: user.totalCheckIns,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      perfectWeeks,
      totalPoints: user.totalPointsEarned,
      averageCheckInTime
    }
  }
}

// Mock check-in for demo mode
export async function mockCheckIn(userId: string): Promise<CheckInResult> {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
  
  const isEarly = hour < 7 || (hour === 7 && minute < 45)
  const basePoints = isEarly ? 2 : 1
  
  // Simulate streak and bonuses
  const currentStreak = Math.floor(Math.random() * 20) + 1
  const newStreakDay = currentStreak + 1
  
  let bonusPoints = 0
  const bonuses = {
    perfectWeek: false,
    streakBonus: false
  }
  
  if (newStreakDay % 7 === 0) {
    bonusPoints += 5
    bonuses.perfectWeek = true
  }
  
  if (newStreakDay % 10 === 0) {
    bonusPoints += 10
    bonuses.streakBonus = true
  }
  
  let message = `Check-in successful! You earned ${basePoints} point${basePoints > 1 ? 's' : ''}`
  if (isEarly) {
    message += ' for checking in early'
  }
  if (bonusPoints > 0) {
    message += ` plus ${bonusPoints} bonus points`
  }
  message += '!'
  
  return {
    success: true,
    points: basePoints,
    bonusPoints,
    totalPoints: basePoints + bonusPoints,
    message,
    isEarly,
    streakDay: newStreakDay,
    bonuses
  }
}