import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { io, Socket } from 'socket.io-client'

interface WebSocketState {
  socket: Socket | null
  isConnected: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  lastActivity: Date | null
  
  // Real-time data
  onlineUsers: string[]
  realtimeStats: {
    totalCheckIns: number
    activeUsers: number
    todayPoints: number
  } | null
  
  // Actions
  initialize: () => void
  connect: (userId: string) => void
  disconnect: () => void
  emit: (event: string, data: any) => void
  subscribe: (event: string, callback: (data: any) => void) => () => void
  updateOnlineUsers: (users: string[]) => void
  updateRealtimeStats: (stats: WebSocketState['realtimeStats']) => void
}

export const useWebSocketStore = create<WebSocketState>()(
  devtools(
    (set, get) => ({
      socket: null,
      isConnected: false,
      connectionStatus: 'disconnected',
      lastActivity: null,
      onlineUsers: [],
      realtimeStats: null,
      
      initialize: () => {
        // In demo mode, just set some mock data
        if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'true') {
          set({
            isConnected: true,
            connectionStatus: 'connected',
            realtimeStats: {
              totalCheckIns: 25,
              activeUsers: 15,
              todayPoints: 1250
            },
            onlineUsers: ['user1', 'user2', 'user3']
          })
        }
      },
      
      connect: (userId) => {
        const state = get()
        if (state.socket?.connected) {
          return
        }
        
        set({ connectionStatus: 'connecting' })
        
        const socket = io(import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001', {
          auth: { userId },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 20000
        })
        
        socket.on('connect', () => {
          set({
            socket,
            isConnected: true,
            connectionStatus: 'connected',
            lastActivity: new Date()
          })
        })
        
        socket.on('disconnect', () => {
          set({
            isConnected: false,
            connectionStatus: 'disconnected'
          })
        })
        
        socket.on('connect_error', () => {
          set({
            connectionStatus: 'error',
            isConnected: false
          })
        })
        
        socket.on('users_online', (users: string[]) => {
          get().updateOnlineUsers(users)
        })
        
        socket.on('realtime_stats', (stats: any) => {
          get().updateRealtimeStats(stats)
        })
        
        socket.on('activity', () => {
          set({ lastActivity: new Date() })
        })
        
        set({ socket })
      },
      
      disconnect: () => {
        const { socket } = get()
        if (socket) {
          socket.disconnect()
          set({
            socket: null,
            isConnected: false,
            connectionStatus: 'disconnected',
            onlineUsers: [],
            realtimeStats: null
          })
        }
      },
      
      emit: (event, data) => {
        const { socket, isConnected } = get()
        if (socket && isConnected) {
          socket.emit(event, data)
          set({ lastActivity: new Date() })
        }
      },
      
      subscribe: (event, callback) => {
        const { socket } = get()
        if (socket) {
          socket.on(event, callback)
          return () => socket.off(event, callback)
        }
        return () => {}
      },
      
      updateOnlineUsers: (users) => {
        set({ onlineUsers: users })
      },
      
      updateRealtimeStats: (stats) => {
        set({ realtimeStats: stats })
      }
    }),
    {
      name: 'websocket-store'
    }
  )
)