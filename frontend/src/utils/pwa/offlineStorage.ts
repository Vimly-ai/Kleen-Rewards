/**
 * Offline Storage Management for PWA
 * Handles offline data storage, synchronization, and queuing
 */

export interface OfflineAction {
  id: string
  type: 'check_in' | 'points_update' | 'profile_update' | 'reward_claim' | 'custom'
  data: any
  timestamp: number
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  retryCount: number
  maxRetries: number
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'syncing' | 'completed' | 'failed'
}

export interface CachedData {
  key: string
  data: any
  timestamp: number
  expiresAt: number
  version: number
}

export interface SyncStats {
  pendingActions: number
  completedActions: number
  failedActions: number
  lastSyncTime: number
  isOnline: boolean
}

class OfflineStorageManager {
  private dbName = 'employee-rewards-offline'
  private dbVersion = 1
  private db: IDBDatabase | null = null
  private syncInProgress = false
  private syncCallbacks: Array<(stats: SyncStats) => void> = []

  constructor() {
    this.initializeDB()
    this.setupNetworkListeners()
  }

  /**
   * Initialize IndexedDB
   */
  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('IndexedDB initialized successfully')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Actions store for offline actions
        if (!db.objectStoreNames.contains('actions')) {
          const actionsStore = db.createObjectStore('actions', { keyPath: 'id' })
          actionsStore.createIndex('type', 'type', { unique: false })
          actionsStore.createIndex('status', 'status', { unique: false })
          actionsStore.createIndex('timestamp', 'timestamp', { unique: false })
          actionsStore.createIndex('priority', 'priority', { unique: false })
        }

        // Cache store for cached data
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' })
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false })
          cacheStore.createIndex('expiresAt', 'expiresAt', { unique: false })
        }

        // Settings store for offline settings
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
      }
    })
  }

  /**
   * Set up network event listeners
   */
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('Network connection restored')
      this.syncPendingActions()
    })

    window.addEventListener('offline', () => {
      console.log('Network connection lost')
    })
  }

  /**
   * Store data in cache
   */
  async cacheData(key: string, data: any, ttl: number = 24 * 60 * 60 * 1000): Promise<boolean> {
    if (!this.db) {
      await this.initializeDB()
    }

    if (!this.db) return false

    try {
      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')

      const cachedData: CachedData = {
        key,
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
        version: 1
      }

      await new Promise<void>((resolve, reject) => {
        const request = store.put(cachedData)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      console.log('Data cached successfully:', key)
      return true
    } catch (error) {
      console.error('Failed to cache data:', error)
      return false
    }
  }

  /**
   * Retrieve data from cache
   */
  async getCachedData<T = any>(key: string): Promise<T | null> {
    if (!this.db) {
      await this.initializeDB()
    }

    if (!this.db) return null

    try {
      const transaction = this.db.transaction(['cache'], 'readonly')
      const store = transaction.objectStore('cache')

      const cachedData = await new Promise<CachedData | null>((resolve) => {
        const request = store.get(key)
        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => resolve(null)
      })

      if (!cachedData) {
        return null
      }

      // Check if data has expired
      if (Date.now() > cachedData.expiresAt) {
        this.removeCachedData(key)
        return null
      }

      return cachedData.data as T
    } catch (error) {
      console.error('Failed to retrieve cached data:', error)
      return null
    }
  }

  /**
   * Remove cached data
   */
  async removeCachedData(key: string): Promise<boolean> {
    if (!this.db) return false

    try {
      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(key)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      return true
    } catch (error) {
      console.error('Failed to remove cached data:', error)
      return false
    }
  }

  /**
   * Clear expired cache entries
   */
  async clearExpiredCache(): Promise<number> {
    if (!this.db) return 0

    try {
      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const index = store.index('expiresAt')

      const expiredEntries = await new Promise<CachedData[]>((resolve) => {
        const request = index.getAll(IDBKeyRange.upperBound(Date.now()))
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => resolve([])
      })

      for (const entry of expiredEntries) {
        store.delete(entry.key)
      }

      console.log(`Cleared ${expiredEntries.length} expired cache entries`)
      return expiredEntries.length
    } catch (error) {
      console.error('Failed to clear expired cache:', error)
      return 0
    }
  }

  /**
   * Queue an action for offline execution
   */
  async queueAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount' | 'status'>): Promise<string> {
    if (!this.db) {
      await this.initializeDB()
    }

    if (!this.db) throw new Error('IndexedDB not available')

    const actionId = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const offlineAction: OfflineAction = {
      ...action,
      id: actionId,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending'
    }

    try {
      const transaction = this.db.transaction(['actions'], 'readwrite')
      const store = transaction.objectStore('actions')

      await new Promise<void>((resolve, reject) => {
        const request = store.add(offlineAction)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      console.log('Action queued for offline sync:', actionId)

      // Try to sync immediately if online
      if (navigator.onLine) {
        this.syncPendingActions()
      }

      return actionId
    } catch (error) {
      console.error('Failed to queue action:', error)
      throw error
    }
  }

  /**
   * Sync pending actions when online
   */
  async syncPendingActions(): Promise<SyncStats> {
    if (!this.db || this.syncInProgress || !navigator.onLine) {
      return this.getSyncStats()
    }

    this.syncInProgress = true
    console.log('Starting sync of pending actions...')

    try {
      const transaction = this.db.transaction(['actions'], 'readwrite')
      const store = transaction.objectStore('actions')
      const index = store.index('status')

      // Get all pending actions
      const pendingActions = await new Promise<OfflineAction[]>((resolve) => {
        const request = index.getAll('pending')
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => resolve([])
      })

      // Sort by priority and timestamp
      pendingActions.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        return priorityDiff !== 0 ? priorityDiff : a.timestamp - b.timestamp
      })

      let completed = 0
      let failed = 0

      for (const action of pendingActions) {
        try {
          // Update status to syncing
          action.status = 'syncing'
          store.put(action)

          // Execute the action
          const success = await this.executeAction(action)

          if (success) {
            action.status = 'completed'
            completed++
          } else {
            action.retryCount++
            if (action.retryCount >= action.maxRetries) {
              action.status = 'failed'
              failed++
            } else {
              action.status = 'pending'
            }
          }

          store.put(action)
        } catch (error) {
          console.error('Failed to sync action:', action.id, error)
          action.retryCount++
          action.status = action.retryCount >= action.maxRetries ? 'failed' : 'pending'
          store.put(action)
          failed++
        }
      }

      console.log(`Sync completed: ${completed} successful, ${failed} failed`)

      // Update last sync time if any actions were processed
      if (pendingActions.length > 0) {
        await this.setLastSyncTime(Date.now())
      }

      const stats = await this.getSyncStats()
      this.notifySyncCallbacks(stats)
      return stats
    } catch (error) {
      console.error('Failed to sync pending actions:', error)
      return this.getSyncStats()
    } finally {
      this.syncInProgress = false
    }
  }

  /**
   * Execute a single action
   */
  private async executeAction(action: OfflineAction): Promise<boolean> {
    try {
      const response = await fetch(action.endpoint, {
        method: action.method,
        headers: {
          'Content-Type': 'application/json',
          ...action.headers
        },
        body: action.method !== 'GET' ? JSON.stringify(action.data) : undefined
      })

      return response.ok
    } catch (error) {
      console.error('Failed to execute action:', error)
      return false
    }
  }

  /**
   * Get sync statistics
   */
  async getSyncStats(): Promise<SyncStats> {
    if (!this.db) {
      return {
        pendingActions: 0,
        completedActions: 0,
        failedActions: 0,
        lastSyncTime: 0,
        isOnline: navigator.onLine
      }
    }

    try {
      const transaction = this.db.transaction(['actions'], 'readonly')
      const store = transaction.objectStore('actions')

      const [pending, completed, failed] = await Promise.all([
        this.countByStatus('pending'),
        this.countByStatus('completed'),
        this.countByStatus('failed')
      ])

      const lastSyncTime = await this.getLastSyncTime()

      return {
        pendingActions: pending,
        completedActions: completed,
        failedActions: failed,
        lastSyncTime,
        isOnline: navigator.onLine
      }
    } catch (error) {
      console.error('Failed to get sync stats:', error)
      return {
        pendingActions: 0,
        completedActions: 0,
        failedActions: 0,
        lastSyncTime: 0,
        isOnline: navigator.onLine
      }
    }
  }

  /**
   * Count actions by status
   */
  private async countByStatus(status: string): Promise<number> {
    if (!this.db) return 0

    try {
      const transaction = this.db.transaction(['actions'], 'readonly')
      const store = transaction.objectStore('actions')
      const index = store.index('status')

      return new Promise<number>((resolve) => {
        const request = index.count(status)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => resolve(0)
      })
    } catch (error) {
      return 0
    }
  }

  /**
   * Get last sync time
   */
  private async getLastSyncTime(): Promise<number> {
    try {
      const transaction = this.db!.transaction(['settings'], 'readonly')
      const store = transaction.objectStore('settings')

      return new Promise<number>((resolve) => {
        const request = store.get('lastSyncTime')
        request.onsuccess = () => resolve(request.result?.value || 0)
        request.onerror = () => resolve(0)
      })
    } catch (error) {
      return 0
    }
  }

  /**
   * Set last sync time
   */
  private async setLastSyncTime(timestamp: number): Promise<void> {
    try {
      const transaction = this.db!.transaction(['settings'], 'readwrite')
      const store = transaction.objectStore('settings')

      store.put({ key: 'lastSyncTime', value: timestamp })
    } catch (error) {
      console.error('Failed to set last sync time:', error)
    }
  }

  /**
   * Add sync callback
   */
  onSync(callback: (stats: SyncStats) => void): () => void {
    this.syncCallbacks.push(callback)
    return () => {
      const index = this.syncCallbacks.indexOf(callback)
      if (index > -1) {
        this.syncCallbacks.splice(index, 1)
      }
    }
  }

  /**
   * Notify sync callbacks
   */
  private notifySyncCallbacks(stats: SyncStats): void {
    this.syncCallbacks.forEach(callback => {
      try {
        callback(stats)
      } catch (error) {
        console.error('Sync callback error:', error)
      }
    })
  }

  /**
   * Clear all offline data
   */
  async clearAllData(): Promise<boolean> {
    if (!this.db) return false

    try {
      const transaction = this.db.transaction(['actions', 'cache', 'settings'], 'readwrite')
      
      await Promise.all([
        new Promise<void>((resolve) => {
          const request = transaction.objectStore('actions').clear()
          request.onsuccess = () => resolve()
        }),
        new Promise<void>((resolve) => {
          const request = transaction.objectStore('cache').clear()
          request.onsuccess = () => resolve()
        }),
        new Promise<void>((resolve) => {
          const request = transaction.objectStore('settings').clear()
          request.onsuccess = () => resolve()
        })
      ])

      console.log('All offline data cleared')
      return true
    } catch (error) {
      console.error('Failed to clear offline data:', error)
      return false
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{
    actionsCount: number
    cacheCount: number
    estimatedSize: number
  }> {
    if (!this.db) {
      return { actionsCount: 0, cacheCount: 0, estimatedSize: 0 }
    }

    try {
      const transaction = this.db.transaction(['actions', 'cache'], 'readonly')
      
      const [actionsCount, cacheCount] = await Promise.all([
        new Promise<number>((resolve) => {
          const request = transaction.objectStore('actions').count()
          request.onsuccess = () => resolve(request.result)
          request.onerror = () => resolve(0)
        }),
        new Promise<number>((resolve) => {
          const request = transaction.objectStore('cache').count()
          request.onsuccess = () => resolve(request.result)
          request.onerror = () => resolve(0)
        })
      ])

      // Estimate storage size (rough calculation)
      const estimatedSize = (actionsCount * 1024) + (cacheCount * 2048) // Rough estimates

      return { actionsCount, cacheCount, estimatedSize }
    } catch (error) {
      console.error('Failed to get storage stats:', error)
      return { actionsCount: 0, cacheCount: 0, estimatedSize: 0 }
    }
  }
}

// Singleton instance
export const offlineStorage = new OfflineStorageManager()

// Utility functions for common operations
export const offlineUtils = {
  /**
   * Cache API response data
   */
  cacheApiResponse: (endpoint: string, data: any, ttl?: number) => 
    offlineStorage.cacheData(`api:${endpoint}`, data, ttl),

  /**
   * Get cached API response
   */
  getCachedApiResponse: <T = any>(endpoint: string): Promise<T | null> => 
    offlineStorage.getCachedData<T>(`api:${endpoint}`),

  /**
   * Queue a check-in action
   */
  queueCheckIn: (checkInData: any) => 
    offlineStorage.queueAction({
      type: 'check_in',
      data: checkInData,
      endpoint: '/api/checkins',
      method: 'POST',
      maxRetries: 3,
      priority: 'high'
    }),

  /**
   * Queue a points update
   */
  queuePointsUpdate: (pointsData: any) => 
    offlineStorage.queueAction({
      type: 'points_update',
      data: pointsData,
      endpoint: '/api/points',
      method: 'POST',
      maxRetries: 3,
      priority: 'medium'
    }),

  /**
   * Queue a profile update
   */
  queueProfileUpdate: (profileData: any) => 
    offlineStorage.queueAction({
      type: 'profile_update',
      data: profileData,
      endpoint: '/api/profile',
      method: 'PUT',
      maxRetries: 2,
      priority: 'low'
    }),

  /**
   * Queue a reward claim
   */
  queueRewardClaim: (rewardData: any) => 
    offlineStorage.queueAction({
      type: 'reward_claim',
      data: rewardData,
      endpoint: '/api/rewards/claim',
      method: 'POST',
      maxRetries: 5,
      priority: 'high'
    }),

  /**
   * Sync all pending actions
   */
  sync: () => offlineStorage.syncPendingActions(),

  /**
   * Get sync statistics
   */
  getStats: () => offlineStorage.getSyncStats(),

  /**
   * Listen for sync updates
   */
  onSync: (callback: (stats: SyncStats) => void) => offlineStorage.onSync(callback),

  /**
   * Clear all offline data
   */
  clearAll: () => offlineStorage.clearAllData(),

  /**
   * Get storage usage
   */
  getUsage: () => offlineStorage.getStorageStats(),

  /**
   * Clear expired cache
   */
  clearExpired: () => offlineStorage.clearExpiredCache()
}

export default offlineUtils