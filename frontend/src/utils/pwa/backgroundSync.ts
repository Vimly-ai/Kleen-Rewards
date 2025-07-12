/**
 * Background Sync Utilities
 * Handles background synchronization for offline actions
 */

import { offlineUtils } from './offlineStorage'

export interface BackgroundSyncOptions {
  tag: string
  data: any
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  maxRetries?: number
  priority?: 'high' | 'medium' | 'low'
}

class BackgroundSyncManager {
  private registration: ServiceWorkerRegistration | null = null

  constructor() {
    this.initializeRegistration()
  }

  private async initializeRegistration(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.ready
      } catch (error) {
        console.warn('Service worker not available for background sync:', error)
      }
    }
  }

  /**
   * Register a background sync
   */
  async registerSync(tag: string): Promise<boolean> {
    if (!this.registration) {
      await this.initializeRegistration()
    }

    if (!this.registration || !('sync' in this.registration)) {
      console.warn('Background sync not supported')
      return false
    }

    try {
      await this.registration.sync.register(tag)
      console.log('Background sync registered:', tag)
      return true
    } catch (error) {
      console.error('Failed to register background sync:', error)
      return false
    }
  }

  /**
   * Check if background sync is supported
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype
  }

  /**
   * Queue an action for background sync
   */
  async queueForSync(options: BackgroundSyncOptions): Promise<string> {
    const {
      tag,
      data,
      endpoint,
      method,
      headers = {},
      maxRetries = 3,
      priority = 'medium'
    } = options

    try {
      // Store the action for offline execution
      const actionId = await offlineUtils.queueAction({
        type: 'custom',
        data,
        endpoint,
        method,
        headers,
        maxRetries,
        priority
      })

      // Register background sync if supported
      if (this.isSupported()) {
        await this.registerSync(tag)
      }

      return actionId
    } catch (error) {
      console.error('Failed to queue action for sync:', error)
      throw error
    }
  }

  /**
   * Manual sync trigger (fallback for unsupported browsers)
   */
  async manualSync(): Promise<void> {
    try {
      await offlineUtils.sync()
    } catch (error) {
      console.error('Manual sync failed:', error)
      throw error
    }
  }
}

// Singleton instance
export const backgroundSync = new BackgroundSyncManager()

// Utility functions for common sync operations
export const syncUtils = {
  /**
   * Queue a check-in for background sync
   */
  queueCheckIn: async (checkInData: any) => {
    return await backgroundSync.queueForSync({
      tag: 'check-in-sync',
      data: checkInData,
      endpoint: '/api/checkins',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      maxRetries: 5,
      priority: 'high'
    })
  },

  /**
   * Queue a points update for background sync
   */
  queuePointsUpdate: async (pointsData: any) => {
    return await backgroundSync.queueForSync({
      tag: 'points-update-sync',
      data: pointsData,
      endpoint: '/api/points',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      maxRetries: 3,
      priority: 'medium'
    })
  },

  /**
   * Queue a profile update for background sync
   */
  queueProfileUpdate: async (profileData: any) => {
    return await backgroundSync.queueForSync({
      tag: 'profile-update-sync',
      data: profileData,
      endpoint: '/api/profile',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      maxRetries: 2,
      priority: 'low'
    })
  },

  /**
   * Queue a reward claim for background sync
   */
  queueRewardClaim: async (rewardData: any) => {
    return await backgroundSync.queueForSync({
      tag: 'reward-claim-sync',
      data: rewardData,
      endpoint: '/api/rewards/claim',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      maxRetries: 5,
      priority: 'high'
    })
  },

  /**
   * Check if background sync is supported
   */
  isSupported: () => backgroundSync.isSupported(),

  /**
   * Manually trigger sync
   */
  manualSync: () => backgroundSync.manualSync(),

  /**
   * Register a custom sync
   */
  registerCustomSync: (tag: string) => backgroundSync.registerSync(tag)
}

// React hook for background sync
export const useBackgroundSync = () => {
  const queueAction = async (options: BackgroundSyncOptions) => {
    try {
      const actionId = await backgroundSync.queueForSync(options)
      return { success: true, actionId }
    } catch (error) {
      console.error('Failed to queue action:', error)
      return { success: false, error }
    }
  }

  const triggerSync = async () => {
    try {
      await backgroundSync.manualSync()
      return { success: true }
    } catch (error) {
      console.error('Sync failed:', error)
      return { success: false, error }
    }
  }

  return {
    queueAction,
    triggerSync,
    isSupported: backgroundSync.isSupported(),
    
    // Convenience methods
    queueCheckIn: syncUtils.queueCheckIn,
    queuePointsUpdate: syncUtils.queuePointsUpdate,
    queueProfileUpdate: syncUtils.queueProfileUpdate,
    queueRewardClaim: syncUtils.queueRewardClaim
  }
}

export default syncUtils