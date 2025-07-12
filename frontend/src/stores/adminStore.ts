import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
  cpu: number
  memory: number
  activeConnections: number
  requestsPerMinute: number
  errorRate: number
  lastChecked: string
}

interface AdminMetrics {
  kpis: {
    engagementRate: number
    retentionRate: number
    participationRate: number
    satisfactionScore: number
    trend: 'up' | 'down' | 'stable'
  }
  performance: {
    avgResponseTime: number
    successRate: number
    activeUsers: number
    peakUsers: number
  }
  financial: {
    totalPointsIssued: number
    totalPointsRedeemed: number
    averagePointsPerUser: number
    redemptionRate: number
    budgetUtilization: number
  }
}

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  category: 'user' | 'system' | 'points' | 'security' | 'config'
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  severity: 'info' | 'warning' | 'error' | 'critical'
}

interface SystemSettings {
  general: {
    companyName: string
    timezone: string
    language: string
    dateFormat: string
    currency: string
  }
  checkIn: {
    enabled: boolean
    startTime: string
    endTime: string
    earlyBonusMinutes: number
    earlyBonusPoints: number
    latePenaltyMinutes: number
    weekendEnabled: boolean
    holidayEnabled: boolean
  }
  points: {
    checkInPoints: number
    referralPoints: number
    birthdayPoints: number
    anniversaryPoints: number
    maxDailyPoints: number
    pointsExpiration: boolean
    expirationDays: number
  }
  notifications: {
    emailEnabled: boolean
    smsEnabled: boolean
    pushEnabled: boolean
    adminAlerts: boolean
    userReminders: boolean
    systemAnnouncements: boolean
  }
  security: {
    twoFactorRequired: boolean
    sessionTimeout: number
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireNumbers: boolean
      requireSpecialChars: boolean
      expirationDays: number
    }
    ipWhitelist: string[]
    maxLoginAttempts: number
  }
  features: {
    achievements: boolean
    leaderboard: boolean
    rewards: boolean
    socialSharing: boolean
    gamification: boolean
    analytics: boolean
    exportData: boolean
  }
}

interface AdminAlert {
  id: string
  type: 'system' | 'security' | 'performance' | 'user' | 'financial'
  severity: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  timestamp: string
  acknowledged: boolean
  actionRequired: boolean
  actions?: {
    label: string
    action: string
  }[]
}

interface AdminState {
  // System Health
  systemHealth: SystemHealth | null
  isMonitoring: boolean
  
  // Metrics & KPIs
  metrics: AdminMetrics | null
  metricsLoading: boolean
  
  // Audit Logs
  auditLogs: AuditLog[]
  auditFilter: {
    category: string | null
    userId: string | null
    dateFrom: string | null
    dateTo: string | null
    severity: string | null
  }
  
  // System Settings
  settings: SystemSettings
  settingsLoading: boolean
  pendingChanges: Partial<SystemSettings>
  
  // Alerts & Notifications
  alerts: AdminAlert[]
  unreadAlertCount: number
  
  // Real-time Data
  realtimeMetrics: {
    activeUsers: number
    checkInsToday: number
    pointsDistributedToday: number
    recentActivities: Array<{
      id: string
      type: string
      user: string
      timestamp: string
      details: string
    }>
  }
  
  // Export & Reporting
  exportQueue: Array<{
    id: string
    type: 'users' | 'analytics' | 'audit' | 'financial'
    status: 'pending' | 'processing' | 'completed' | 'failed'
    progress: number
    downloadUrl?: string
  }>
  
  // Actions
  updateSystemHealth: (health: SystemHealth) => void
  updateMetrics: (metrics: AdminMetrics) => void
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void
  setAuditFilter: (filter: Partial<AdminState['auditFilter']>) => void
  updateSettings: (settings: Partial<SystemSettings>) => void
  savePendingChanges: () => Promise<void>
  discardPendingChanges: () => void
  addAlert: (alert: Omit<AdminAlert, 'id' | 'timestamp'>) => void
  acknowledgeAlert: (alertId: string) => void
  dismissAlert: (alertId: string) => void
  updateRealtimeMetrics: (metrics: Partial<AdminState['realtimeMetrics']>) => void
  startExport: (type: AdminState['exportQueue'][0]['type']) => void
  updateExportStatus: (id: string, status: AdminState['exportQueue'][0]['status'], progress?: number, downloadUrl?: string) => void
  toggleMonitoring: () => void
  resetAdminState: () => void
}

const defaultSettings: SystemSettings = {
  general: {
    companyName: 'Tech Corp',
    timezone: 'America/New_York',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  },
  checkIn: {
    enabled: true,
    startTime: '08:00',
    endTime: '10:00',
    earlyBonusMinutes: 30,
    earlyBonusPoints: 50,
    latePenaltyMinutes: 15,
    weekendEnabled: false,
    holidayEnabled: false
  },
  points: {
    checkInPoints: 100,
    referralPoints: 500,
    birthdayPoints: 1000,
    anniversaryPoints: 2000,
    maxDailyPoints: 500,
    pointsExpiration: true,
    expirationDays: 365
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    adminAlerts: true,
    userReminders: true,
    systemAnnouncements: true
  },
  security: {
    twoFactorRequired: false,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expirationDays: 90
    },
    ipWhitelist: [],
    maxLoginAttempts: 5
  },
  features: {
    achievements: true,
    leaderboard: true,
    rewards: true,
    socialSharing: false,
    gamification: true,
    analytics: true,
    exportData: true
  }
}

const initialState = {
  systemHealth: null,
  isMonitoring: true,
  metrics: null,
  metricsLoading: false,
  auditLogs: [],
  auditFilter: {
    category: null,
    userId: null,
    dateFrom: null,
    dateTo: null,
    severity: null
  },
  settings: defaultSettings,
  settingsLoading: false,
  pendingChanges: {},
  alerts: [],
  unreadAlertCount: 0,
  realtimeMetrics: {
    activeUsers: 0,
    checkInsToday: 0,
    pointsDistributedToday: 0,
    recentActivities: []
  },
  exportQueue: []
}

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        updateSystemHealth: (health) => set({ 
          systemHealth: health,
          isMonitoring: true 
        }),
        
        updateMetrics: (metrics) => set({ 
          metrics,
          metricsLoading: false 
        }),
        
        addAuditLog: (log) => set((state) => ({
          auditLogs: [
            {
              id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date().toISOString(),
              ...log
            },
            ...state.auditLogs
          ].slice(0, 1000) // Keep last 1000 logs in memory
        })),
        
        setAuditFilter: (filter) => set((state) => ({
          auditFilter: { ...state.auditFilter, ...filter }
        })),
        
        updateSettings: (settings) => set((state) => ({
          pendingChanges: { ...state.pendingChanges, ...settings }
        })),
        
        savePendingChanges: async () => {
          const { settings, pendingChanges } = get()
          // Merge pending changes with current settings
          const newSettings = {
            general: { ...settings.general, ...pendingChanges.general },
            checkIn: { ...settings.checkIn, ...pendingChanges.checkIn },
            points: { ...settings.points, ...pendingChanges.points },
            notifications: { ...settings.notifications, ...pendingChanges.notifications },
            security: { ...settings.security, ...pendingChanges.security },
            features: { ...settings.features, ...pendingChanges.features }
          }
          
          // Here you would make an API call to save settings
          // await api.saveAdminSettings(newSettings)
          
          set({ 
            settings: newSettings,
            pendingChanges: {},
            settingsLoading: false
          })
          
          // Add audit log for settings change
          get().addAuditLog({
            userId: 'current-admin-id',
            userName: 'Admin User',
            action: 'Updated system settings',
            category: 'config',
            details: pendingChanges,
            ipAddress: '127.0.0.1',
            userAgent: navigator.userAgent,
            severity: 'info'
          })
        },
        
        discardPendingChanges: () => set({ pendingChanges: {} }),
        
        addAlert: (alert) => set((state) => ({
          alerts: [
            {
              id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date().toISOString(),
              acknowledged: false,
              ...alert
            },
            ...state.alerts
          ],
          unreadAlertCount: state.unreadAlertCount + 1
        })),
        
        acknowledgeAlert: (alertId) => set((state) => ({
          alerts: state.alerts.map(alert =>
            alert.id === alertId ? { ...alert, acknowledged: true } : alert
          ),
          unreadAlertCount: Math.max(0, state.unreadAlertCount - 1)
        })),
        
        dismissAlert: (alertId) => set((state) => ({
          alerts: state.alerts.filter(alert => alert.id !== alertId),
          unreadAlertCount: state.alerts.find(a => a.id === alertId && !a.acknowledged)
            ? Math.max(0, state.unreadAlertCount - 1)
            : state.unreadAlertCount
        })),
        
        updateRealtimeMetrics: (metrics) => set((state) => ({
          realtimeMetrics: { ...state.realtimeMetrics, ...metrics }
        })),
        
        startExport: (type) => set((state) => ({
          exportQueue: [
            ...state.exportQueue,
            {
              id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type,
              status: 'pending',
              progress: 0
            }
          ]
        })),
        
        updateExportStatus: (id, status, progress, downloadUrl) => set((state) => ({
          exportQueue: state.exportQueue.map(item =>
            item.id === id
              ? { ...item, status, progress: progress ?? item.progress, downloadUrl }
              : item
          )
        })),
        
        toggleMonitoring: () => set((state) => ({ 
          isMonitoring: !state.isMonitoring 
        })),
        
        resetAdminState: () => set(initialState)
      }),
      {
        name: 'admin-store',
        partialize: (state) => ({
          settings: state.settings,
          alerts: state.alerts.filter(a => !a.acknowledged).slice(0, 10), // Keep last 10 unread alerts
          auditFilter: state.auditFilter
        })
      }
    ),
    {
      name: 'admin-store'
    }
  )
)

// Selectors
export const selectFilteredAuditLogs = (state: AdminState) => {
  let logs = state.auditLogs
  const { category, userId, dateFrom, dateTo, severity } = state.auditFilter
  
  if (category) {
    logs = logs.filter(log => log.category === category)
  }
  if (userId) {
    logs = logs.filter(log => log.userId === userId)
  }
  if (severity) {
    logs = logs.filter(log => log.severity === severity)
  }
  if (dateFrom) {
    logs = logs.filter(log => new Date(log.timestamp) >= new Date(dateFrom))
  }
  if (dateTo) {
    logs = logs.filter(log => new Date(log.timestamp) <= new Date(dateTo))
  }
  
  return logs
}

export const selectUnacknowledgedAlerts = (state: AdminState) => {
  return state.alerts.filter(alert => !alert.acknowledged)
}

export const selectCriticalAlerts = (state: AdminState) => {
  return state.alerts.filter(alert => alert.severity === 'critical' && !alert.acknowledged)
}

export const selectActiveExports = (state: AdminState) => {
  return state.exportQueue.filter(item => item.status === 'pending' || item.status === 'processing')
}