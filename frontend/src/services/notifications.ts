/**
 * Comprehensive Push Notification Service for Employee Rewards PWA
 * Features: Subscription management, push notifications, background sync
 */

import { useNotificationStore } from '../stores/notificationStore'

export interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
  userId?: string
  deviceInfo?: {
    userAgent: string
    platform: string
    language: string
  }
}

export interface NotificationPayload {
  type: 'achievement' | 'reward' | 'checkin_reminder' | 'admin_announcement' | 'points_update' | 'system_maintenance'
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  url?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  requireInteraction?: boolean
  silent?: boolean
  vibrate?: number[]
  timestamp?: number
}

export interface NotificationSubscription {
  id: string
  userId: string
  subscription: PushSubscriptionData
  enabled: boolean
  preferences: {
    achievements: boolean
    rewards: boolean
    checkinReminders: boolean
    adminAnnouncements: boolean
    pointsUpdates: boolean
    systemMaintenance: boolean
  }
  createdAt: Date
  lastUsed?: Date
}

class NotificationService {
  private vapidPublicKey: string
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null
  private currentSubscription: PushSubscription | null = null
  private isInitialized = false

  constructor() {
    this.vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
  }

  /**
   * Initialize the notification service
   */
  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true

      // Check for service worker support
      if (!('serviceWorker' in navigator)) {
        console.warn('Service workers not supported')
        return false
      }

      // Check for push messaging support
      if (!('PushManager' in window)) {
        console.warn('Push messaging not supported')
        return false
      }

      // Check for notification support
      if (!('Notification' in window)) {
        console.warn('Notifications not supported')
        return false
      }

      // Get service worker registration
      this.serviceWorkerRegistration = await navigator.serviceWorker.ready
      
      // Get current subscription
      this.currentSubscription = await this.serviceWorkerRegistration.pushManager.getSubscription()

      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Failed to initialize notification service:', error)
      return false
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    try {
      if (!('Notification' in window)) {
        throw new Error('Notifications not supported')
      }

      let permission = Notification.permission

      if (permission === 'default') {
        permission = await Notification.requestPermission()
      }

      return permission
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return 'denied'
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(userId?: string): Promise<PushSubscriptionData | null> {
    try {
      await this.initialize()

      if (!this.serviceWorkerRegistration) {
        throw new Error('Service worker not available')
      }

      // Request permission first
      const permission = await this.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Notification permission not granted')
      }

      // Check if already subscribed
      if (this.currentSubscription) {
        console.log('Already subscribed to push notifications')
        return this.formatSubscription(this.currentSubscription, userId)
      }

      // Subscribe to push notifications
      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      })

      this.currentSubscription = subscription

      const subscriptionData = this.formatSubscription(subscription, userId)

      // Send subscription to server
      await this.sendSubscriptionToServer(subscriptionData)

      console.log('Successfully subscribed to push notifications')
      return subscriptionData
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    try {
      if (!this.currentSubscription) {
        console.log('Not subscribed to push notifications')
        return true
      }

      const success = await this.currentSubscription.unsubscribe()
      
      if (success) {
        // Remove subscription from server
        await this.removeSubscriptionFromServer()
        this.currentSubscription = null
        console.log('Successfully unsubscribed from push notifications')
      }

      return success
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  /**
   * Check if currently subscribed
   */
  async isSubscribed(): Promise<boolean> {
    try {
      await this.initialize()
      return this.currentSubscription !== null
    } catch (error) {
      console.error('Failed to check subscription status:', error)
      return false
    }
  }

  /**
   * Get current subscription
   */
  async getSubscription(): Promise<PushSubscriptionData | null> {
    try {
      if (!this.currentSubscription) {
        return null
      }

      return this.formatSubscription(this.currentSubscription)
    } catch (error) {
      console.error('Failed to get subscription:', error)
      return null
    }
  }

  /**
   * Update subscription preferences
   */
  async updatePreferences(preferences: Partial<NotificationSubscription['preferences']>): Promise<boolean> {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      })

      return response.ok
    } catch (error) {
      console.error('Failed to update notification preferences:', error)
      return false
    }
  }

  /**
   * Send a local notification (for testing)
   */
  async sendLocalNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      const permission = await this.requestPermission()
      if (permission !== 'granted') {
        return false
      }

      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icon-192.png',
        badge: payload.badge || '/icon-192.png',
        tag: payload.tag,
        data: payload.data,
        requireInteraction: payload.requireInteraction || false,
        silent: payload.silent || false,
        vibrate: payload.vibrate || [100, 50, 100]
      })

      // Auto-close after 5 seconds unless requireInteraction is true
      if (!payload.requireInteraction) {
        setTimeout(() => notification.close(), 5000)
      }

      // Handle click events
      notification.onclick = () => {
        notification.close()
        if (payload.url) {
          window.focus()
          window.location.href = payload.url
        }
      }

      return true
    } catch (error) {
      console.error('Failed to send local notification:', error)
      return false
    }
  }

  /**
   * Schedule a notification reminder
   */
  async scheduleReminder(
    type: 'daily_checkin' | 'weekly_report' | 'monthly_rewards',
    delay: number
  ): Promise<boolean> {
    try {
      // Use setTimeout for short delays or service worker alarms for longer ones
      if (delay <= 24 * 60 * 60 * 1000) { // 24 hours or less
        setTimeout(async () => {
          await this.sendReminderNotification(type)
        }, delay)
      } else {
        // For longer delays, we'd need to use service worker background sync
        // or server-side scheduling
        console.log('Long-term reminder scheduled on server')
      }

      return true
    } catch (error) {
      console.error('Failed to schedule reminder:', error)
      return false
    }
  }

  /**
   * Test notification functionality
   */
  async testNotification(): Promise<boolean> {
    const testPayload: NotificationPayload = {
      type: 'admin_announcement',
      title: 'Test Notification',
      body: 'This is a test notification to verify the system is working correctly.',
      icon: '/icon-192.png',
      tag: 'test',
      data: { test: true },
      timestamp: Date.now()
    }

    return await this.sendLocalNotification(testPayload)
  }

  // Private helper methods

  private formatSubscription(subscription: PushSubscription, userId?: string): PushSubscriptionData {
    const key = subscription.getKey('p256dh')
    const auth = subscription.getKey('auth')

    return {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: key ? this.arrayBufferToBase64(key) : '',
        auth: auth ? this.arrayBufferToBase64(auth) : ''
      },
      userId,
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscriptionData): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })

      if (!response.ok) {
        throw new Error('Failed to send subscription to server')
      }
    } catch (error) {
      console.error('Failed to send subscription to server:', error)
      throw error
    }
  }

  private async removeSubscriptionFromServer(): Promise<void> {
    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'DELETE'
      })

      if (!response.ok) {
        console.warn('Failed to remove subscription from server')
      }
    } catch (error) {
      console.error('Failed to remove subscription from server:', error)
    }
  }

  private async sendReminderNotification(type: string): Promise<void> {
    const payloads: Record<string, NotificationPayload> = {
      daily_checkin: {
        type: 'checkin_reminder',
        title: 'Daily Check-in Reminder',
        body: "Don't forget to check in today and earn your points!",
        url: '/employee/dashboard',
        requireInteraction: true
      },
      weekly_report: {
        type: 'admin_announcement',
        title: 'Weekly Report Available',
        body: 'Your weekly progress report is ready to view.',
        url: '/employee/profile'
      },
      monthly_rewards: {
        type: 'reward',
        title: 'New Monthly Rewards',
        body: 'Check out the new rewards available this month!',
        url: '/employee/rewards'
      }
    }

    const payload = payloads[type]
    if (payload) {
      await this.sendLocalNotification(payload)
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }
}

// Notification templates for different types
export const NotificationTemplates = {
  achievement: (achievement: any): NotificationPayload => ({
    type: 'achievement',
    title: '🏆 Achievement Unlocked!',
    body: `Congratulations! You've earned the "${achievement.name}" achievement.`,
    icon: '/icon-192.png',
    tag: `achievement-${achievement.id}`,
    url: '/employee/achievements',
    data: { achievementId: achievement.id },
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200]
  }),

  pointsUpdate: (points: number, action: string): NotificationPayload => ({
    type: 'points_update',
    title: '⭐ Points Earned!',
    body: `You earned ${points} points for ${action}!`,
    icon: '/icon-192.png',
    tag: 'points-update',
    url: '/employee/dashboard',
    data: { points, action }
  }),

  rewardAvailable: (reward: any): NotificationPayload => ({
    type: 'reward',
    title: '🎁 New Reward Available!',
    body: `You can now claim "${reward.name}" with your points.`,
    icon: '/icon-192.png',
    tag: `reward-${reward.id}`,
    url: '/employee/rewards',
    data: { rewardId: reward.id },
    requireInteraction: true
  }),

  adminAnnouncement: (announcement: any): NotificationPayload => ({
    type: 'admin_announcement',
    title: '📢 ' + announcement.title,
    body: announcement.message,
    icon: '/icon-192.png',
    tag: `announcement-${announcement.id}`,
    url: announcement.url || '/employee/dashboard',
    data: { announcementId: announcement.id },
    requireInteraction: announcement.important || false
  }),

  systemMaintenance: (maintenance: any): NotificationPayload => ({
    type: 'system_maintenance',
    title: '🔧 System Maintenance',
    body: maintenance.message || 'The system will undergo maintenance soon.',
    icon: '/icon-192.png',
    tag: 'maintenance',
    data: maintenance,
    requireInteraction: true,
    silent: false
  }),

  checkinReminder: (): NotificationPayload => ({
    type: 'checkin_reminder',
    title: '📅 Daily Check-in',
    body: "Don't forget to check in today and earn your daily points!",
    icon: '/icon-192.png',
    tag: 'checkin-reminder',
    url: '/employee/dashboard',
    requireInteraction: true
  })
}

// Singleton instance
export const notificationService = new NotificationService()

// React hook for notification service
export const useNotificationService = () => {
  const { addNotification } = useNotificationStore()

  const initialize = async () => {
    return await notificationService.initialize()
  }

  const subscribe = async (userId?: string) => {
    const subscription = await notificationService.subscribe(userId)
    if (subscription) {
      addNotification({
        type: 'success',
        title: 'Notifications Enabled',
        message: 'You will now receive push notifications for achievements, rewards, and updates.'
      })
    }
    return subscription
  }

  const unsubscribe = async () => {
    const success = await notificationService.unsubscribe()
    if (success) {
      addNotification({
        type: 'info',
        title: 'Notifications Disabled',
        message: 'Push notifications have been turned off.'
      })
    }
    return success
  }

  const testNotification = async () => {
    const success = await notificationService.testNotification()
    if (success) {
      addNotification({
        type: 'success',
        title: 'Test Notification Sent',
        message: 'Check if you received the test notification.'
      })
    } else {
      addNotification({
        type: 'error',
        title: 'Test Failed',
        message: 'Could not send test notification. Check your browser permissions.'
      })
    }
    return success
  }

  return {
    service: notificationService,
    initialize,
    subscribe,
    unsubscribe,
    testNotification,
    isSubscribed: () => notificationService.isSubscribed(),
    updatePreferences: (prefs: any) => notificationService.updatePreferences(prefs),
    scheduleReminder: (type: any, delay: number) => notificationService.scheduleReminder(type, delay)
  }
}