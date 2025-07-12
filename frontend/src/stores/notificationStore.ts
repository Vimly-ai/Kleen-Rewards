import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  actions?: Array<{
    label: string
    action: () => void
    variant?: 'primary' | 'secondary'
  }>
  persistent?: boolean
  createdAt: Date
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      
      addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newNotification: Notification = {
          ...notification,
          id,
          createdAt: new Date(),
          duration: notification.duration ?? 5000
        }
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }))
        
        // Auto remove non-persistent notifications
        if (!notification.persistent && newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id)
          }, newNotification.duration)
        }
        
        return id
      },
      
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }))
      },
      
      clearAllNotifications: () => {
        set({ notifications: [], unreadCount: 0 })
      },
      
      markAsRead: (id) => {
        const notification = get().notifications.find(n => n.id === id)
        if (notification) {
          set((state) => ({
            unreadCount: Math.max(0, state.unreadCount - 1)
          }))
        }
      },
      
      markAllAsRead: () => {
        set({ unreadCount: 0 })
      }
    }),
    {
      name: 'notification-store'
    }
  )
)

// Helper functions for common notification types
export const useNotifications = () => {
  const { addNotification } = useNotificationStore()
  
  return {
    success: (title: string, message?: string) => 
      addNotification({ type: 'success', title, message }),
    
    error: (title: string, message?: string) => 
      addNotification({ type: 'error', title, message, persistent: true }),
    
    warning: (title: string, message?: string) => 
      addNotification({ type: 'warning', title, message }),
    
    info: (title: string, message?: string) => 
      addNotification({ type: 'info', title, message }),
    
    custom: (notification: Omit<Notification, 'id' | 'createdAt'>) => 
      addNotification(notification)
  }
}