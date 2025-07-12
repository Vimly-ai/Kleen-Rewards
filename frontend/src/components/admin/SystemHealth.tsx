import { useEffect } from 'react'
import { useAdminStore } from '../../stores/adminStore'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ProgressRing } from '../ui/ProgressRing'
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import { clsx } from 'clsx'

export function SystemHealth() {
  const { systemHealth, isMonitoring, updateSystemHealth, toggleMonitoring } = useAdminStore()
  
  useEffect(() => {
    if (!isMonitoring) return
    
    // Simulate system health monitoring
    const interval = setInterval(() => {
      const mockHealth = {
        status: Math.random() > 0.9 ? 'warning' : 'healthy' as const,
        uptime: Date.now() - 86400000 * 7, // 7 days
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        activeConnections: Math.floor(Math.random() * 1000),
        requestsPerMinute: Math.floor(Math.random() * 5000),
        errorRate: Math.random() * 5,
        lastChecked: new Date().toISOString()
      }
      updateSystemHealth(mockHealth)
    }, 5000) // Update every 5 seconds
    
    return () => clearInterval(interval)
  }, [isMonitoring, updateSystemHealth])
  
  const getStatusIcon = () => {
    if (!systemHealth) return <Activity className="w-5 h-5 text-gray-400" />
    
    const icons = {
      healthy: <CheckCircle className="w-5 h-5 text-green-600" />,
      warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      critical: <XCircle className="w-5 h-5 text-red-600" />
    }
    
    return icons[systemHealth.status]
  }
  
  const getStatusColor = () => {
    if (!systemHealth) return 'bg-gray-100 text-gray-800'
    
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800'
    }
    
    return colors[systemHealth.status]
  }
  
  const formatUptime = (startTime: number) => {
    const uptime = Date.now() - startTime
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24))
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${days}d ${hours}h ${minutes}m`
  }
  
  const getMetricStatus = (value: number, thresholds: { warning: number, critical: number }) => {
    if (value >= thresholds.critical) return 'critical'
    if (value >= thresholds.warning) return 'warning'
    return 'healthy'
  }
  
  const getMetricColor = (status: string) => {
    const colors: Record<string, string> = {
      healthy: 'text-green-600',
      warning: 'text-yellow-600',
      critical: 'text-red-600'
    }
    return colors[status] || 'text-gray-600'
  }
  
  if (!systemHealth && isMonitoring) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Initializing system monitoring...</p>
          </div>
        </div>
      </Card>
    )
  }
  
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            {systemHealth && (
              <Badge className={getStatusColor()}>
                {getStatusIcon()}
                <span className="ml-1 capitalize">{systemHealth.status}</span>
              </Badge>
            )}
          </div>
          
          <button
            onClick={toggleMonitoring}
            className={clsx(
              'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
              isMonitoring
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
          </button>
        </div>
        
        {systemHealth ? (
          <div className="space-y-6">
            {/* Uptime */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Uptime</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {formatUptime(systemHealth.uptime)}
              </span>
            </div>
            
            {/* CPU Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">CPU Usage</span>
                </div>
                <span className={clsx(
                  'text-sm font-semibold',
                  getMetricColor(getMetricStatus(systemHealth.cpu, { warning: 70, critical: 90 }))
                )}>
                  {systemHealth.cpu.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={clsx(
                    'h-2 rounded-full transition-all duration-500',
                    systemHealth.cpu >= 90 ? 'bg-red-600' :
                    systemHealth.cpu >= 70 ? 'bg-yellow-600' : 'bg-green-600'
                  )}
                  style={{ width: `${Math.min(systemHealth.cpu, 100)}%` }}
                />
              </div>
            </div>
            
            {/* Memory Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Memory Usage</span>
                </div>
                <span className={clsx(
                  'text-sm font-semibold',
                  getMetricColor(getMetricStatus(systemHealth.memory, { warning: 80, critical: 95 }))
                )}>
                  {systemHealth.memory.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={clsx(
                    'h-2 rounded-full transition-all duration-500',
                    systemHealth.memory >= 95 ? 'bg-red-600' :
                    systemHealth.memory >= 80 ? 'bg-yellow-600' : 'bg-green-600'
                  )}
                  style={{ width: `${Math.min(systemHealth.memory, 100)}%` }}
                />
              </div>
            </div>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-600">Active Connections</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {systemHealth.activeConnections.toLocaleString()}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Activity className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-600">Requests/min</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {systemHealth.requestsPerMinute.toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* Error Rate */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Error Rate</span>
                <span className={clsx(
                  'text-sm font-semibold',
                  systemHealth.errorRate > 5 ? 'text-red-600' :
                  systemHealth.errorRate > 2 ? 'text-yellow-600' : 'text-green-600'
                )}>
                  {systemHealth.errorRate.toFixed(2)}%
                </span>
              </div>
            </div>
            
            {/* Last Checked */}
            <div className="text-center text-xs text-gray-500 pt-2">
              Last checked: {new Date(systemHealth.lastChecked).toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500">Monitoring is paused</p>
          </div>
        )}
      </div>
    </Card>
  )
}