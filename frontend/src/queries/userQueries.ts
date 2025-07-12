import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryClient'
import SupabaseService from '../services/supabase'
import { useNotifications } from '../stores/notificationStore'
import type { User, UserStats } from '../types'

// Get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.current(),
    queryFn: async () => {
      const user = await SupabaseService.getCurrentUser()
      return user
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  })
}

// Get user profile
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.user.profile(userId),
    queryFn: async () => {
      const user = await SupabaseService.getUserById(userId)
      return user
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

// Get user statistics
export function useUserStats(userId: string) {
  return useQuery({
    queryKey: queryKeys.user.stats(userId),
    queryFn: async () => {
      const stats = await SupabaseService.getUserStats(userId)
      return stats
    },
    enabled: !!userId,
    refetchInterval: 2 * 60 * 1000 // Refetch every 2 minutes
  })
}

// Update user profile mutation
export function useUpdateUserProfile() {
  const queryClient = useQueryClient()
  const { success, error } = useNotifications()
  
  return useMutation({
    mutationFn: async (data: Partial<User> & { id: string }) => {
      const updatedUser = await SupabaseService.updateUser(data.id, data)
      return updatedUser
    },
    onSuccess: (updatedUser) => {
      // Update the user cache
      queryClient.setQueryData(queryKeys.user.profile(updatedUser.id), updatedUser)
      queryClient.setQueryData(queryKeys.user.current(), updatedUser)
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all })
      
      success('Profile Updated', 'Your profile has been successfully updated.')
    },
    onError: (err) => {
      console.error('Failed to update profile:', err)
      error('Update Failed', 'Failed to update your profile. Please try again.')
    }
  })
}

// Award bonus points mutation (admin only)
export function useAwardBonusPoints() {
  const queryClient = useQueryClient()
  const { success, error } = useNotifications()
  
  return useMutation({
    mutationFn: async (data: {
      userId: string
      points: number
      reason: string
      awardedBy: string
    }) => {
      const bonusPoint = await SupabaseService.awardBonusPoints(
        data.userId,
        data.points,
        data.reason,
        data.awardedBy
      )
      return bonusPoint
    },
    onSuccess: (_, variables) => {
      // Invalidate user stats to show updated points
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.user.stats(variables.userId) 
      })
      
      // Invalidate leaderboard to reflect changes
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.leaderboard.all 
      })
      
      success('Bonus Points Awarded', `Successfully awarded ${variables.points} points!`)
    },
    onError: (err) => {
      console.error('Failed to award bonus points:', err)
      error('Award Failed', 'Failed to award bonus points. Please try again.')
    }
  })
}

// Bulk user operations for admin
export function useBulkUserUpdate() {
  const queryClient = useQueryClient()
  const { success, error } = useNotifications()
  
  return useMutation({
    mutationFn: async (data: {
      userIds: string[]
      updates: Partial<User>
    }) => {
      const results = await Promise.allSettled(
        data.userIds.map(id => 
          SupabaseService.updateUser(id, data.updates)
        )
      )
      
      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length
      
      return { successful, failed, total: data.userIds.length }
    },
    onSuccess: (result) => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users })
      
      if (result.failed === 0) {
        success('Bulk Update Complete', `Successfully updated ${result.successful} users.`)
      } else {
        error(
          'Partial Update', 
          `Updated ${result.successful} users, ${result.failed} failed.`
        )
      }
    },
    onError: (err) => {
      console.error('Bulk update failed:', err)
      error('Bulk Update Failed', 'Failed to update users. Please try again.')
    }
  })
}