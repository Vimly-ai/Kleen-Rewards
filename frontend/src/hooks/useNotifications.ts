import { useEffect } from 'react'
import { useNotificationStore } from '../stores/notificationStore'

interface NotificationOptions {
  permission?: boolean
  autoSubscribe?: boolean
}

export function useNotifications(options: NotificationOptions = {}) {
  const { permission = true, autoSubscribe = false } = options
  const { addNotification } = useNotificationStore()

  useEffect(() => {
    if (!permission) return

    // Request notification permission on mount
    const requestPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        try {
          await Notification.requestPermission()
        } catch (error) {
          console.warn('Failed to request notification permission:', error)
        }
      }
    }

    requestPermission()

    // Auto-subscribe to service worker push notifications
    if (autoSubscribe && 'serviceWorker' in navigator && 'PushManager' in window) {
      const subscribeToNotifications = async () => {
        try {
          const registration = await navigator.serviceWorker.ready
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
          })
          
          // Send subscription to server
        } catch (error) {
          console.warn('Failed to subscribe to push notifications:', error)
        }
      }

      subscribeToNotifications()
    }
  }, [permission, autoSubscribe])

  const showBrowserNotification = (title: string, options?: NotificationOptions & {
    body?: string
    icon?: string
    badge?: string
    tag?: string
    data?: any
  }) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: options?.body,
        icon: options?.icon || '/icon-192.png',
        badge: options?.badge || '/icon-192.png',
        tag: options?.tag,
        data: options?.data,
        requireInteraction: false
      })

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000)

      return notification
    }
    return null
  }

  const showAppNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string
  ) => {
    return addNotification({
      type,
      title,
      message,
      duration: 5000
    })
  }

  return {
    showBrowserNotification,
    showAppNotification,
    canShowNotifications: 'Notification' in window && Notification.permission === 'granted',
    permission: 'Notification' in window ? Notification.permission : 'denied'
  }
}