import { io, Socket } from 'socket.io-client'
import { useWebSocketStore } from '../stores/websocketStore'
import { useNotifications } from '../stores/notificationStore'

export interface WebSocketService {
  connect: (userId: string) => void
  disconnect: () => void
  emit: (event: string, data: any) => void
  subscribe: (event: string, callback: (data: any) => void) => () => void
  isConnected: () => boolean
}

class WebSocketServiceImpl implements WebSocketService {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect(userId: string) {
    if (this.socket?.connected) {
      return
    }

    const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001'
    
    this.socket = io(websocketUrl, {
      auth: { userId },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      timeout: 20000,
      transports: ['websocket', 'polling']
    })

    this.setupEventHandlers()
    useWebSocketStore.getState().connect(userId)
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.reconnectAttempts = 0
    }
    useWebSocketStore.getState().disconnect()
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
      useWebSocketStore.getState().emit(event, data)
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback)
      return () => this.socket?.off(event, callback)
    }
    return () => {}
  }

  isConnected() {
    return this.socket?.connected || false
  }

  private setupEventHandlers() {
    if (!this.socket) return

    const store = useWebSocketStore.getState()
    const notifications = useNotifications()

    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
      store.updateRealtimeStats({ 
        totalCheckIns: 0, 
        activeUsers: 0, 
        todayPoints: 0 
      })
    })

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        this.socket?.connect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.reconnectAttempts++
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        notifications.error(
          'Connection Failed',
          'Unable to connect to real-time updates. Some features may not work.'
        )
      }
    })

    // Real-time data events
    this.socket.on('user_checked_in', (data: {
      userId: string
      userName: string
      points: number
      streak: number
    }) => {
      notifications.info(
        'New Check-in! 🎉',
        `${data.userName} just checked in and earned ${data.points} points!`
      )
      
      // Update real-time stats
      const currentStats = store.realtimeStats
      if (currentStats) {
        store.updateRealtimeStats({
          ...currentStats,
          totalCheckIns: currentStats.totalCheckIns + 1,
          todayPoints: currentStats.todayPoints + data.points
        })
      }
    })

    this.socket.on('reward_redeemed', (data: {
      userId: string
      userName: string
      rewardName: string
      pointsCost: number
    }) => {
      notifications.info(
        'Reward Redeemed! 🎁',
        `${data.userName} redeemed ${data.rewardName} for ${data.pointsCost} points!`
      )
    })

    this.socket.on('achievement_unlocked', (data: {
      userId: string
      userName: string
      badgeName: string
      badgeIcon: string
    }) => {
      notifications.success(
        'Achievement Unlocked! 🏆',
        `${data.userName} unlocked the ${data.badgeName} badge!`
      )
    })

    this.socket.on('leaderboard_update', (data: {
      topUsers: Array<{
        id: string
        name: string
        points: number
        rank: number
      }>
    }) => {
      // Could update leaderboard cache here
      console.log('Leaderboard updated:', data)
    })

    this.socket.on('admin_announcement', (data: {
      title: string
      message: string
      type: 'info' | 'warning' | 'success'
      persistent?: boolean
    }) => {
      notifications.custom({
        type: data.type,
        title: data.title,
        message: data.message,
        persistent: data.persistent,
        duration: data.persistent ? 0 : 10000
      })
    })

    this.socket.on('users_online', (users: string[]) => {
      store.updateOnlineUsers(users)
    })

    this.socket.on('realtime_stats', (stats: {
      totalCheckIns: number
      activeUsers: number
      todayPoints: number
    }) => {
      store.updateRealtimeStats(stats)
    })

    // System events
    this.socket.on('system_maintenance', (data: {
      message: string
      scheduledTime?: string
    }) => {
      notifications.custom({
        type: 'warning',
        title: 'System Maintenance',
        message: data.message,
        persistent: true,
        actions: [
          {
            label: 'Dismiss',
            action: () => {},
            variant: 'secondary'
          }
        ]
      })
    })

    this.socket.on('force_refresh', () => {
      notifications.custom({
        type: 'info',
        title: 'Update Available',
        message: 'A new version is available. Please refresh to get the latest features.',
        persistent: true,
        actions: [
          {
            label: 'Refresh Now',
            action: () => window.location.reload(),
            variant: 'primary'
          },
          {
            label: 'Later',
            action: () => {},
            variant: 'secondary'
          }
        ]
      })
    })
  }

  // Admin-specific methods
  broadcastAnnouncement(announcement: {
    title: string
    message: string
    type: 'info' | 'warning' | 'success'
    persistent?: boolean
  }) {
    this.emit('admin_announcement', announcement)
  }

  requestRealtimeStats() {
    this.emit('request_realtime_stats', {})
  }

  joinAdminRoom() {
    this.emit('join_admin_room', {})
  }

  leaveAdminRoom() {
    this.emit('leave_admin_room', {})
  }
}

// Singleton instance
export const websocketService = new WebSocketServiceImpl()

// React hook for easier use in components
export function useWebSocket() {
  const store = useWebSocketStore()
  
  return {
    ...store,
    service: websocketService,
    connect: websocketService.connect.bind(websocketService),
    disconnect: websocketService.disconnect.bind(websocketService),
    emit: websocketService.emit.bind(websocketService),
    subscribe: websocketService.subscribe.bind(websocketService)
  }
}

// Auto-connect hook for authenticated users
export function useAutoConnectWebSocket() {
  const { isConnected, connect } = useWebSocket()
  
  // This would typically be called from your main app component
  // when the user is authenticated
  const autoConnect = (userId: string) => {
    if (!isConnected && userId) {
      connect(userId)
    }
  }
  
  return { autoConnect }
}