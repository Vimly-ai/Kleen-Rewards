import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryClient'
import SupabaseService from '../services/supabase'
import { useNotifications } from '../stores/notificationStore'
import type { Reward, RewardRedemption } from '../types'

// Get available rewards
export function useRewards(category?: string) {
  return useQuery({
    queryKey: queryKeys.rewards.list(category),
    queryFn: async () => {
      const rewards = await SupabaseService.getAvailableRewards(category)
      return rewards
    },
    staleTime: 10 * 60 * 1000 // 10 minutes
  })
}

// Get reward details
export function useReward(rewardId: string) {
  return useQuery({
    queryKey: queryKeys.rewards.detail(rewardId),
    queryFn: async () => {
      const reward = await SupabaseService.getRewardById(rewardId)
      return reward
    },
    enabled: !!rewardId,
    staleTime: 15 * 60 * 1000 // 15 minutes
  })
}

// Get user's reward redemptions
export function useUserRedemptions(userId: string) {
  return useQuery({
    queryKey: queryKeys.rewards.redemptions(userId),
    queryFn: async () => {
      const redemptions = await SupabaseService.getUserRedemptions(userId)
      return redemptions
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000 // 2 minutes
  })
}

// Redeem reward mutation
export function useRedeemReward() {
  const queryClient = useQueryClient()
  const { success, error } = useNotifications()
  
  return useMutation({
    mutationFn: async (data: {
      userId: string
      rewardId: string
    }) => {
      console.log('Starting reward redemption:', data)
      const redemption = await SupabaseService.redeemReward(data.userId, data.rewardId)
      console.log('Redemption completed:', redemption)
      return redemption
    },
    onSuccess: (redemption, variables) => {
      console.log('Redemption success, invalidating queries...')
      
      // Invalidate user's redemptions
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.rewards.redemptions(variables.userId) 
      })
      
      // Invalidate user stats to reflect updated points
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.user.stats(variables.userId) 
      })
      
      // Invalidate user data to refresh points balance
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.user.detail(variables.userId) 
      })
      
      // Optionally invalidate reward details if stock is limited
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.rewards.detail(variables.rewardId) 
      })
      
      success(
        'Reward Redeemed! 🎁',
        'Your redemption request has been submitted and is pending approval.'
      )
    },
    onError: (err: any) => {
      console.error('Reward redemption failed:', err)
      
      if (err.message?.includes('insufficient points')) {
        error('Insufficient Points', 'You don\'t have enough points to redeem this reward.')
      } else if (err.message?.includes('not available')) {
        error('Reward Unavailable', 'This reward is currently not available.')
      } else {
        error('Redemption Failed', 'Failed to redeem reward. Please try again.')
      }
    }
  })
}

// Create reward mutation (admin only)
export function useCreateReward() {
  const queryClient = useQueryClient()
  const { success, error } = useNotifications()
  
  return useMutation({
    mutationFn: async (data: Omit<Reward, 'id' | 'created' | 'updated'>) => {
      const reward = await SupabaseService.createReward(data)
      return reward
    },
    onSuccess: () => {
      // Invalidate all reward queries
      queryClient.invalidateQueries({ queryKey: queryKeys.rewards.all })
      
      success('Reward Created', 'New reward has been successfully created.')
    },
    onError: (err) => {
      console.error('Failed to create reward:', err)
      error('Creation Failed', 'Failed to create reward. Please try again.')
    }
  })
}

// Update reward mutation (admin only)
export function useUpdateReward() {
  const queryClient = useQueryClient()
  const { success, error } = useNotifications()
  
  return useMutation({
    mutationFn: async (data: Partial<Reward> & { id: string }) => {
      const updatedReward = await SupabaseService.updateReward(data.id, data)
      return updatedReward
    },
    onSuccess: (updatedReward) => {
      // Update specific reward cache
      queryClient.setQueryData(
        queryKeys.rewards.detail(updatedReward.id), 
        updatedReward
      )
      
      // Invalidate reward lists
      queryClient.invalidateQueries({ queryKey: queryKeys.rewards.list })
      
      success('Reward Updated', 'Reward has been successfully updated.')
    },
    onError: (err) => {
      console.error('Failed to update reward:', err)
      error('Update Failed', 'Failed to update reward. Please try again.')
    }
  })
}

// Approve/reject redemption mutation (admin only)
export function useUpdateRedemption() {
  const queryClient = useQueryClient()
  const { success, error } = useNotifications()
  
  return useMutation({
    mutationFn: async (data: {
      redemptionId: string
      status: 'approved' | 'rejected' | 'completed'
      notes?: string
      adminId: string
    }) => {
      const updatedRedemption = await SupabaseService.updateRedemption(
        data.redemptionId,
        data.status,
        data.adminId,
        data.notes
      )
      return updatedRedemption
    },
    onSuccess: (redemption, variables) => {
      // Invalidate redemption queries for the user
      if (redemption.user) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.rewards.redemptions(redemption.user) 
        })
      }
      
      // Invalidate admin queries
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all })
      
      const statusText = variables.status === 'approved' ? 'approved' : 
                        variables.status === 'rejected' ? 'rejected' : 'completed'
      
      success('Redemption Updated', `Redemption has been ${statusText}.`)
    },
    onError: (err) => {
      console.error('Failed to update redemption:', err)
      error('Update Failed', 'Failed to update redemption status. Please try again.')
    }
  })
}