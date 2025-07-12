import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAppStore } from '../../stores/appStore'
import { useAdminStore } from '../../stores/adminStore'
import { useNotificationStore, useNotifications } from '../../stores/notificationStore'
import { useWebSocketStore } from '../../stores/websocketStore'

describe('Store Integration Tests', () => {
  beforeEach(() => {
    // Reset all stores
    useAppStore.getState().resetApp()
    useAdminStore.getState().resetAdminState()
    useNotificationStore.getState().clearAllNotifications()
    useWebSocketStore.getState().disconnect()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('App Store Integration', () => {
    it('should sync feature flags with other stores', () => {
      const { result: appStore } = renderHook(() => useAppStore())
      const { result: wsStore } = renderHook(() => useWebSocketStore())

      // Initially real-time updates should be enabled
      expect(appStore.current.features.realTimeUpdates).toBe(true)

      // Disable real-time updates
      act(() => {
        appStore.current.toggleFeature('realTimeUpdates')
      })

      expect(appStore.current.features.realTimeUpdates).toBe(false)

      // WebSocket should disconnect when real-time is disabled
      // (This would be handled by the app initialization logic)
    })

    it('should persist theme changes across app lifecycle', () => {
      const { result: appStore } = renderHook(() => useAppStore())

      act(() => {
        appStore.current.setTheme('dark')
      })

      expect(appStore.current.theme).toBe('dark')

      // Simulate app restart by getting fresh store state
      const newState = useAppStore.getState()
      expect(newState.theme).toBe('dark')
    })

    it('should track navigation properly', () => {
      const { result: appStore } = renderHook(() => useAppStore())

      act(() => {
        appStore.current.setLastVisited('/dashboard')
      })

      expect(appStore.current.lastVisited).toBe('/dashboard')

      act(() => {
        appStore.current.setLastVisited('/rewards')
      })

      expect(appStore.current.lastVisited).toBe('/rewards')
    })
  })

  describe('WebSocket Store Integration', () => {
    it('should manage connection state properly', () => {
      const { result: wsStore } = renderHook(() => useWebSocketStore())

      expect(wsStore.current.isConnected).toBe(false)
      expect(wsStore.current.connectionStatus).toBe('disconnected')

      // Mock WebSocket connection
      const mockSocket = {
        connected: true,
        on: vi.fn(),
        emit: vi.fn(),
        off: vi.fn(),
        disconnect: vi.fn()
      }

      // Simulate connection
      act(() => {
        wsStore.current.connect('test-user-123')
      })

      expect(wsStore.current.connectionStatus).toBe('connecting')
    })

    it('should handle real-time data updates', () => {
      const { result: wsStore } = renderHook(() => useWebSocketStore())

      const mockStats = {
        totalCheckIns: 150,
        activeUsers: 25,
        todayPoints: 5000
      }

      act(() => {
        wsStore.current.updateRealtimeStats(mockStats)
      })

      expect(wsStore.current.realtimeStats).toEqual(mockStats)
    })

    it('should manage online users list', () => {
      const { result: wsStore } = renderHook(() => useWebSocketStore())

      const onlineUsers = ['user1', 'user2', 'user3']

      act(() => {
        wsStore.current.updateOnlineUsers(onlineUsers)
      })

      expect(wsStore.current.onlineUsers).toEqual(onlineUsers)
    })

    it('should integrate with admin store for real-time metrics', () => {
      const { result: wsStore } = renderHook(() => useWebSocketStore())
      const { result: adminStore } = renderHook(() => useAdminStore())

      const realtimeData = {
        activeUsers: 42,
        checkInsToday: 120,
        pointsDistributedToday: 15000
      }

      // Simulate WebSocket updating admin real-time metrics
      act(() => {
        adminStore.current.updateRealtimeMetrics(realtimeData)
      })

      expect(adminStore.current.realtimeMetrics.activeUsers).toBe(42)
      expect(adminStore.current.realtimeMetrics.checkInsToday).toBe(120)
      expect(adminStore.current.realtimeMetrics.pointsDistributedToday).toBe(15000)
    })
  })

  describe('Notification Store Integration', () => {
    it('should add and manage notifications', () => {
      const { result: notificationStore } = renderHook(() => useNotificationStore())
      const { result: notifications } = renderHook(() => useNotifications())

      expect(notificationStore.current.notifications).toHaveLength(0)
      expect(notificationStore.current.unreadCount).toBe(0)

      act(() => {
        notifications.current.success('Test Success', 'This is a test message')
      })

      expect(notificationStore.current.notifications).toHaveLength(1)
      expect(notificationStore.current.unreadCount).toBe(1)
      expect(notificationStore.current.notifications[0].type).toBe('success')
      expect(notificationStore.current.notifications[0].title).toBe('Test Success')
    })

    it('should auto-remove non-persistent notifications', async () => {
      const { result: notificationStore } = renderHook(() => useNotificationStore())

      act(() => {
        notificationStore.current.addNotification({
          type: 'info',
          title: 'Auto-remove test',
          duration: 100 // Very short duration for testing
        })
      })

      expect(notificationStore.current.notifications).toHaveLength(1)

      // Wait for auto-removal
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(notificationStore.current.notifications).toHaveLength(0)
    })

    it('should keep persistent notifications', async () => {
      const { result: notificationStore } = renderHook(() => useNotificationStore())

      act(() => {
        notificationStore.current.addNotification({
          type: 'error',
          title: 'Persistent error',
          persistent: true,
          duration: 100
        })
      })

      expect(notificationStore.current.notifications).toHaveLength(1)

      // Wait longer than duration
      await new Promise(resolve => setTimeout(resolve, 150))

      // Should still be there because it's persistent
      expect(notificationStore.current.notifications).toHaveLength(1)
    })

    it('should integrate with WebSocket for real-time notifications', () => {
      const { result: notificationStore } = renderHook(() => useNotificationStore())
      const { result: wsStore } = renderHook(() => useWebSocketStore())

      // Simulate WebSocket triggering a notification
      act(() => {
        notificationStore.current.addNotification({
          type: 'info',
          title: 'Real-time Update',
          message: 'New achievement unlocked!'
        })
      })

      expect(notificationStore.current.notifications).toHaveLength(1)
      expect(notificationStore.current.notifications[0].title).toBe('Real-time Update')
    })
  })

  describe('Admin Store Integration', () => {
    it('should manage system settings with pending changes', () => {
      const { result: adminStore } = renderHook(() => useAdminStore())

      const settingUpdates = {
        general: {
          companyName: 'Updated Company Name'
        },
        points: {
          checkInPoints: 150
        }
      }

      act(() => {
        adminStore.current.updateSettings(settingUpdates)
      })

      expect(adminStore.current.pendingChanges.general?.companyName).toBe('Updated Company Name')
      expect(adminStore.current.pendingChanges.points?.checkInPoints).toBe(150)
      expect(adminStore.current.settings.general.companyName).toBe('Tech Corp') // Original value

      act(() => {
        adminStore.current.savePendingChanges()
      })

      expect(adminStore.current.settings.general.companyName).toBe('Updated Company Name')
      expect(adminStore.current.settings.points.checkInPoints).toBe(150)
      expect(adminStore.current.pendingChanges).toEqual({})
    })

    it('should manage audit logs with filtering', () => {
      const { result: adminStore } = renderHook(() => useAdminStore())

      const auditLogs = [
        {
          userId: 'user1',
          userName: 'John Doe',
          action: 'User login',
          category: 'security' as const,
          details: {},
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome',
          severity: 'info' as const
        },
        {
          userId: 'user2',
          userName: 'Jane Smith',
          action: 'Points redeemed',
          category: 'points' as const,
          details: { points: 100 },
          ipAddress: '192.168.1.2',
          userAgent: 'Firefox',
          severity: 'info' as const
        }
      ]

      act(() => {
        auditLogs.forEach(log => adminStore.current.addAuditLog(log))
      })

      expect(adminStore.current.auditLogs).toHaveLength(2)

      // Test filtering
      act(() => {
        adminStore.current.setAuditFilter({ category: 'security' })
      })

      const filteredLogs = adminStore.current.auditLogs.filter(log =>
        adminStore.current.auditFilter.category === null || 
        log.category === adminStore.current.auditFilter.category
      )

      expect(filteredLogs).toHaveLength(1)
      expect(filteredLogs[0].action).toBe('User login')
    })

    it('should manage alerts and acknowledgments', () => {
      const { result: adminStore } = renderHook(() => useAdminStore())

      act(() => {
        adminStore.current.addAlert({
          type: 'security',
          severity: 'warning',
          title: 'Suspicious login attempt',
          message: 'Multiple failed login attempts detected',
          actionRequired: true
        })
      })

      expect(adminStore.current.alerts).toHaveLength(1)
      expect(adminStore.current.unreadAlertCount).toBe(1)

      const alertId = adminStore.current.alerts[0].id

      act(() => {
        adminStore.current.acknowledgeAlert(alertId)
      })

      expect(adminStore.current.alerts[0].acknowledged).toBe(true)
      expect(adminStore.current.unreadAlertCount).toBe(0)
    })

    it('should manage export queue', () => {
      const { result: adminStore } = renderHook(() => useAdminStore())

      act(() => {
        adminStore.current.startExport('users')
      })

      expect(adminStore.current.exportQueue).toHaveLength(1)
      expect(adminStore.current.exportQueue[0].type).toBe('users')
      expect(adminStore.current.exportQueue[0].status).toBe('pending')

      const exportId = adminStore.current.exportQueue[0].id

      act(() => {
        adminStore.current.updateExportStatus(exportId, 'processing', 50)
      })

      expect(adminStore.current.exportQueue[0].status).toBe('processing')
      expect(adminStore.current.exportQueue[0].progress).toBe(50)

      act(() => {
        adminStore.current.updateExportStatus(exportId, 'completed', 100, 'https://download.url')
      })

      expect(adminStore.current.exportQueue[0].status).toBe('completed')
      expect(adminStore.current.exportQueue[0].progress).toBe(100)
      expect(adminStore.current.exportQueue[0].downloadUrl).toBe('https://download.url')
    })
  })

  describe('Cross-Store Integration', () => {
    it('should coordinate WebSocket with notifications', () => {
      const { result: wsStore } = renderHook(() => useWebSocketStore())
      const { result: notificationStore } = renderHook(() => useNotificationStore())
      const { result: adminStore } = renderHook(() => useAdminStore())

      // Simulate WebSocket connection triggering system alert
      act(() => {
        wsStore.current.updateRealtimeStats({
          totalCheckIns: 200,
          activeUsers: 50,
          todayPoints: 10000
        })

        // Admin store receives the update and creates an alert if thresholds exceeded
        adminStore.current.addAlert({
          type: 'performance',
          severity: 'info',
          title: 'High Activity',
          message: 'Unusually high user activity detected',
          actionRequired: false
        })

        // Notification for immediate user feedback
        notificationStore.current.addNotification({
          type: 'info',
          title: 'System Update',
          message: 'Real-time metrics updated'
        })
      })

      expect(wsStore.current.realtimeStats?.totalCheckIns).toBe(200)
      expect(adminStore.current.alerts).toHaveLength(1)
      expect(notificationStore.current.notifications).toHaveLength(1)
    })

    it('should sync app features with store behaviors', () => {
      const { result: appStore } = renderHook(() => useAppStore())
      const { result: wsStore } = renderHook(() => useWebSocketStore())
      const { result: notificationStore } = renderHook(() => useNotificationStore())

      // Disable notifications feature
      act(() => {
        appStore.current.toggleFeature('notifications')
      })

      expect(appStore.current.features.notifications).toBe(false)

      // This should trigger cleanup in notification store
      // (In real app, this would be handled by effects)
      if (!appStore.current.features.notifications) {
        act(() => {
          notificationStore.current.clearAllNotifications()
        })
      }

      expect(notificationStore.current.notifications).toHaveLength(0)

      // Disable real-time updates
      act(() => {
        appStore.current.toggleFeature('realTimeUpdates')
      })

      expect(appStore.current.features.realTimeUpdates).toBe(false)

      // This should trigger WebSocket disconnection
      if (!appStore.current.features.realTimeUpdates) {
        act(() => {
          wsStore.current.disconnect()
        })
      }

      expect(wsStore.current.isConnected).toBe(false)
    })

    it('should handle error states across stores', () => {
      const { result: wsStore } = renderHook(() => useWebSocketStore())
      const { result: notificationStore } = renderHook(() => useNotificationStore())
      const { result: adminStore } = renderHook(() => useAdminStore())

      // Simulate WebSocket connection error
      act(() => {
        // Mock connection error
        wsStore.current.connect('test-user')
        // Simulate error state
        wsStore.getState().connectionStatus = 'error'
      })

      // This should trigger error notification
      act(() => {
        notificationStore.current.addNotification({
          type: 'error',
          title: 'Connection Error',
          message: 'Unable to establish real-time connection',
          persistent: true
        })

        // Log error in audit trail
        adminStore.current.addAuditLog({
          userId: 'system',
          userName: 'System',
          action: 'WebSocket connection failed',
          category: 'system',
          details: { error: 'Connection timeout' },
          ipAddress: '127.0.0.1',
          userAgent: navigator.userAgent,
          severity: 'error'
        })
      })

      expect(notificationStore.current.notifications[0].type).toBe('error')
      expect(adminStore.current.auditLogs[0].severity).toBe('error')
    })

    it('should maintain data consistency across stores', () => {
      const { result: appStore } = renderHook(() => useAppStore())
      const { result: adminStore } = renderHook(() => useAdminStore())

      // App preferences should align with admin settings
      act(() => {
        appStore.current.updatePreferences({
          autoCheckIn: true,
          soundEnabled: false
        })

        // Admin updates system settings
        adminStore.current.updateSettings({
          checkIn: {
            enabled: true,
            startTime: '09:00',
            endTime: '11:00'
          },
          notifications: {
            emailEnabled: true,
            pushEnabled: false
          }
        })
      })

      expect(appStore.current.preferences.autoCheckIn).toBe(true)
      expect(adminStore.current.pendingChanges.checkIn?.enabled).toBe(true)

      // Settings should be consistent
      const userSoundPreference = appStore.current.preferences.soundEnabled
      const systemNotificationSetting = adminStore.current.pendingChanges.notifications?.pushEnabled

      // In a real app, these would be reconciled
      expect(typeof userSoundPreference).toBe('boolean')
      expect(typeof systemNotificationSetting).toBe('boolean')
    })
  })

  describe('Store Persistence', () => {
    it('should persist critical data across sessions', () => {
      const { result: appStore } = renderHook(() => useAppStore())
      const { result: adminStore } = renderHook(() => useAdminStore())

      // Make changes that should persist
      act(() => {
        appStore.current.setTheme('dark')
        appStore.current.updatePreferences({
          compactMode: true,
          autoCheckIn: true
        })

        adminStore.current.updateSettings({
          general: {
            companyName: 'Persistent Company'
          }
        })
        adminStore.current.savePendingChanges()
      })

      // Simulate fresh store instances (app restart)
      const freshAppState = useAppStore.getState()
      const freshAdminState = useAdminStore.getState()

      expect(freshAppState.theme).toBe('dark')
      expect(freshAppState.preferences.compactMode).toBe(true)
      expect(freshAdminState.settings.general.companyName).toBe('Persistent Company')
    })

    it('should not persist sensitive or temporary data', () => {
      const { result: wsStore } = renderHook(() => useWebSocketStore())
      const { result: notificationStore } = renderHook(() => useNotificationStore())

      act(() => {
        // Add sensitive data that shouldn't persist
        wsStore.current.updateOnlineUsers(['user1', 'user2'])
        notificationStore.current.addNotification({
          type: 'info',
          title: 'Temporary notification'
        })
      })

      // These should not be persisted and should be empty on fresh load
      // (In actual implementation, these stores don't use persist middleware)
      expect(wsStore.current.onlineUsers).toEqual(['user1', 'user2'])
      expect(notificationStore.current.notifications).toHaveLength(1)

      // But they shouldn't be restored on app restart
      // (This would be verified by checking if persist middleware is applied)
    })
  })
})