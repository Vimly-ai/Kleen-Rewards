import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryClient'
import SupabaseService from '../services/supabase'
import { useNotifications } from '../stores/notificationStore'
import type { CheckIn, CheckInResult } from '../types'
import { isDemoMode, getCurrentDemoUser, getDemoCheckIns } from '../services/demoService'

// Get user's check-ins
export function useUserCheckIns(userId: string, limit?: number) {
  return useQuery({
    queryKey: queryKeys.checkIns.list(userId, limit),
    queryFn: async () => {
      // Check if we're in demo mode
      if (isDemoMode()) {
        const demoUser = getCurrentDemoUser()
        if (demoUser) {
          const checkIns = getDemoCheckIns(demoUser.id)
          return limit ? checkIns.slice(0, limit) : checkIns
        }
      }
      
      const checkIns = await SupabaseService.getUserCheckIns(userId, limit)
      return checkIns
    },
    enabled: !!userId,
    staleTime: isDemoMode() ? Infinity : 2 * 60 * 1000
  })
}

// Get today's check-in
export function useTodaysCheckIn(userId: string) {
  return useQuery({
    queryKey: queryKeys.checkIns.today(userId),
    queryFn: async () => {
      // Check if we're in demo mode
      if (isDemoMode()) {
        const demoUser = getCurrentDemoUser()
        if (demoUser) {
          const checkIns = getDemoCheckIns(demoUser.id)
          // Return today's check-in if exists
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          return checkIns.find(c => {
            const checkInDate = new Date(c.checkInTime)
            checkInDate.setHours(0, 0, 0, 0)
            return checkInDate.getTime() === today.getTime()
          }) || null
        }
      }
      
      const checkIn = await SupabaseService.getTodaysCheckIn(userId)
      return checkIn
    },
    enabled: !!userId,
    staleTime: isDemoMode() ? Infinity : 1 * 60 * 1000,
    refetchInterval: isDemoMode() ? false : 5 * 60 * 1000
  })
}

// Get check-in history with pagination
export function useCheckInHistory(userId: string, page: number = 1) {
  return useQuery({
    queryKey: queryKeys.checkIns.history(userId, page),
    queryFn: async () => {
      const pageSize = 20
      const offset = (page - 1) * pageSize
      const checkIns = await SupabaseService.getUserCheckIns(userId, pageSize, offset)
      return {
        checkIns,
        page,
        hasMore: checkIns.length === pageSize
      }
    },
    enabled: !!userId,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

// Check-in mutation
export function useCheckIn() {
  const queryClient = useQueryClient()
  const { success, error } = useNotifications()
  
  return useMutation({
    mutationFn: async (data: {
      userId: string
      qrCodeData: string
      location?: { latitude: number; longitude: number }
    }): Promise<CheckInResult> => {
      const result = await SupabaseService.checkIn(
        data.userId,
        data.qrCodeData,
        data.location
      )
      return result
    },
    onSuccess: (result, variables) => {
      if (result.success) {
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.checkIns.list(variables.userId) 
        })
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.checkIns.today(variables.userId) 
        })
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.user.stats(variables.userId) 
        })
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.leaderboard.all 
        })
        
        // Show success notification with details
        success(
          'Check-in Successful! 🎉',
          `You earned ${result.pointsEarned} points! Current streak: ${result.currentStreak} days`
        )
      } else {
        error('Check-in Failed', result.message)
      }
    },
    onError: (err) => {
      console.error('Check-in failed:', err)
      error('Check-in Error', 'Something went wrong during check-in. Please try again.')
    }
  })
}

// Bulk check-in analysis for admin
export function useCheckInAnalytics(period: 'week' | 'month' | 'quarter' = 'week') {
  return useQuery({
    queryKey: ['checkInAnalytics', period],
    queryFn: async () => {
      // Calculate date range based on period
      const now = new Date()
      const startDate = new Date()
      
      switch (period) {
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3)
          break
      }
      
      const analytics = await SupabaseService.getCheckInAnalytics(startDate, now)
      return analytics
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000 // Refetch every 15 minutes
  })
}

// Manual check-in for admin (emergency/makeup)
export function useManualCheckIn() {
  const queryClient = useQueryClient()
  const { success, error } = useNotifications()
  
  return useMutation({
    mutationFn: async (data: {
      userId: string
      checkInTime: string
      points: number
      reason: string
      adminId: string
    }) => {
      const checkIn = await SupabaseService.createManualCheckIn(data)
      return checkIn
    },
    onSuccess: (_, variables) => {
      // Invalidate user's check-in data
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.checkIns.list(variables.userId) 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.user.stats(variables.userId) 
      })
      
      success('Manual Check-in Created', 'Successfully created manual check-in record.')
    },
    onError: (err) => {
      console.error('Manual check-in failed:', err)
      error('Manual Check-in Failed', 'Failed to create manual check-in. Please try again.')
    }
  })
}