import { QueryClient } from '@tanstack/react-query'
import { useNotifications } from '../stores/notificationStore'

// Create a stable query client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default
      refetchOnReconnect: false
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Global error handler for mutations
      onError: (error) => {
        console.error('Mutation error:', error)
        // Note: We can't use hooks here, so error handling is done in individual mutations
      }
    }
  }
})

// Query keys factory for consistency
export const queryKeys = {
  // User queries
  user: {
    all: ['user'] as const,
    current: () => [...queryKeys.user.all, 'current'] as const,
    profile: (id: string) => [...queryKeys.user.all, 'profile', id] as const,
    stats: (id: string) => [...queryKeys.user.all, 'stats', id] as const
  },
  
  // Check-in queries
  checkIns: {
    all: ['checkIns'] as const,
    list: (userId: string, limit?: number) => [...queryKeys.checkIns.all, 'list', userId, limit] as const,
    today: (userId: string) => [...queryKeys.checkIns.all, 'today', userId] as const,
    history: (userId: string, page: number) => [...queryKeys.checkIns.all, 'history', userId, page] as const
  },
  
  // Rewards queries
  rewards: {
    all: ['rewards'] as const,
    list: (category?: string) => [...queryKeys.rewards.all, 'list', category] as const,
    detail: (id: string) => [...queryKeys.rewards.all, 'detail', id] as const,
    redemptions: (userId: string) => [...queryKeys.rewards.all, 'redemptions', userId] as const
  },
  
  // Leaderboard queries
  leaderboard: {
    all: ['leaderboard'] as const,
    list: (period: string) => [...queryKeys.leaderboard.all, 'list', period] as const
  },
  
  // Admin queries
  admin: {
    all: ['admin'] as const,
    users: (page: number, search?: string, status?: string) => [...queryKeys.admin.all, 'users', page, search, status] as const,
    analytics: (period: string) => [...queryKeys.admin.all, 'analytics', period] as const,
    settings: () => [...queryKeys.admin.all, 'settings'] as const,
    redemptions: (status?: string) => [...queryKeys.admin.all, 'redemptions', status] as const
  },
  
  // Company queries
  company: {
    all: ['company'] as const,
    current: () => [...queryKeys.company.all, 'current'] as const,
    qrCode: () => [...queryKeys.company.all, 'qrCode'] as const
  }
} as const