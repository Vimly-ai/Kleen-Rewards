import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAdminStore } from '../../stores/adminStore'
import { useWebSocket } from '../../services/websocket'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { MetricCard } from './charts/MetricCard'
import { LineChart } from './charts/LineChart'
import { BarChart } from './charts/BarChart'
import { PieChart } from './charts/PieChart'
import { SystemHealth } from './SystemHealth'
import { 
  TrendingUp, 
  Users, 
  Award, 
  Target,
  Calendar,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  RefreshCw,
  Download,
  Eye,
  Zap
} from 'lucide-react'
import { clsx } from 'clsx'

interface ExecutiveKPIs {
  businessMetrics: {
    totalRevenue: number
    costPerEmployee: number
    roi: number
    budgetUtilization: number
  }
  engagementMetrics: {
    participationRate: number
    dailyActiveUsers: number
    retentionRate: number
    nps: number
  }
  operationalMetrics: {
    systemUptime: number
    avgResponseTime: number
    errorRate: number
    dataAccuracy: number
  }
  trends: {
    revenue: Array<{ name: string, value: number }>
    engagement: Array<{ name: string, participation: number, satisfaction: number }>
    costs: Array<{ name: string, operational: number, rewards: number }>
  }
}

interface AlertSummary {
  critical: number
  warning: number
  info: number
  resolved24h: number
}

export function ExecutiveDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'quarter'>('month')
  const [autoRefresh, setAutoRefresh] = useState(false) // Disable auto-refresh by default
  
  const { realtimeMetrics, updateRealtimeMetrics, alerts } = useAdminStore()
  const { isConnected, service } = useWebSocket()
  
  // Real-time data updates
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      // Simulate real-time metrics updates
      updateRealtimeMetrics({
        activeUsers: Math.floor(Math.random() * 200) + 50,
        checkInsToday: Math.floor(Math.random() * 500) + 100,
        pointsDistributedToday: Math.floor(Math.random() * 10000) + 5000,
        recentActivities: [
          {
            id: Date.now().toString(),
            type: 'check_in',
            user: `User ${Math.floor(Math.random() * 100)}`,
            timestamp: new Date().toISOString(),
            details: 'Checked in early'
          }
        ]
      })
    }, 3000) // Update every 3 seconds
    
    return () => clearInterval(interval)
  }, [autoRefresh, updateRealtimeMetrics])
  
  const { data: kpiData, isLoading } = useQuery({
    queryKey: ['executive-kpis', selectedPeriod],
    queryFn: async (): Promise<ExecutiveKPIs> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        businessMetrics: {
          totalRevenue: 2850000,
          costPerEmployee: 1250,
          roi: 340,
          budgetUtilization: 78.5
        },
        engagementMetrics: {
          participationRate: 89.2,
          dailyActiveUsers: 156,
          retentionRate: 94.1,
          nps: 8.7
        },
        operationalMetrics: {
          systemUptime: 99.97,
          avgResponseTime: 245,
          errorRate: 0.12,
          dataAccuracy: 99.8
        },
        trends: {
          revenue: [
            { name: 'Q1', value: 650000 },
            { name: 'Q2', value: 720000 },
            { name: 'Q3', value: 680000 },
            { name: 'Q4', value: 800000 }
          ],
          engagement: [
            { name: 'Week 1', participation: 85, satisfaction: 8.2 },
            { name: 'Week 2', participation: 87, satisfaction: 8.1 },
            { name: 'Week 3', participation: 89, satisfaction: 8.4 },
            { name: 'Week 4', participation: 91, satisfaction: 8.6 }
          ],
          costs: [
            { name: 'Jan', operational: 45000, rewards: 12000 },
            { name: 'Feb', operational: 47000, rewards: 13500 },
            { name: 'Mar', operational: 46000, rewards: 11800 },
            { name: 'Apr', operational: 48000, rewards: 14200 }
          ]
        }
      }
    },
    refetchInterval: autoRefresh ? 30000 : false
  })
  
  const alertSummary: AlertSummary = {
    critical: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length,
    warning: alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length,
    info: alerts.filter(a => a.severity === 'info' && !a.acknowledged).length,
    resolved24h: alerts.filter(a => a.acknowledged && 
      new Date(a.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length
  }
  
  const getStatusBadge = (value: number, thresholds: { good: number, warning: number }) => {
    if (value >= thresholds.good) {
      return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    } else if (value >= thresholds.warning) {
      return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800">Needs Attention</Badge>
    }
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time insights and key performance indicators
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className={clsx(
            'flex items-center gap-2 px-3 py-1 rounded-full text-sm',
            isConnected 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          )}>
            <div className={clsx(
              'w-2 h-2 rounded-full',
              isConnected ? 'bg-green-500' : 'bg-red-500'
            )} />
            {isConnected ? 'Live Data' : 'Offline'}
          </div>
          
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={clsx(
              'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
              autoRefresh
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <RefreshCw className={clsx('w-4 h-4 inline mr-1', autoRefresh && 'animate-spin')} />
            Auto Refresh
          </button>
          
          {/* Period Selector */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            {[
              { key: 'day', label: 'Today' },
              { key: 'week', label: 'Week' },
              { key: 'month', label: 'Month' },
              { key: 'quarter', label: 'Quarter' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium transition-all',
                  selectedPeriod === period.key
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Alert Summary Bar */}
      {(alertSummary.critical > 0 || alertSummary.warning > 0) && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div className="flex items-center gap-6">
                  {alertSummary.critical > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-red-900">Critical:</span>
                      <Badge className="bg-red-600 text-white">{alertSummary.critical}</Badge>
                    </div>
                  )}
                  {alertSummary.warning > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-yellow-900">Warning:</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{alertSummary.warning}</Badge>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="secondary" size="small">
                View All Alerts
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Active Users Now"
          value={realtimeMetrics.activeUsers}
          subtitle="online users"
          icon={<Users className="w-6 h-6" />}
          iconColor="bg-blue-100 text-blue-600"
          trend={{ value: 12, direction: 'up' }}
        />
        
        <MetricCard
          title="Today's Check-ins"
          value={realtimeMetrics.checkInsToday}
          subtitle="vs yesterday"
          icon={<Calendar className="w-6 h-6" />}
          iconColor="bg-green-100 text-green-600"
          trend={{ value: 8, direction: 'up' }}
        />
        
        <MetricCard
          title="Points Distributed"
          value={realtimeMetrics.pointsDistributedToday.toLocaleString()}
          subtitle="today"
          icon={<Award className="w-6 h-6" />}
          iconColor="bg-purple-100 text-purple-600"
          trend={{ value: 15, direction: 'up' }}
        />
      </div>
      
      {/* Business KPIs */}
      {kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total ROI"
            value={`${kpiData.businessMetrics.roi}%`}
            subtitle="return on investment"
            icon={<TrendingUp className="w-6 h-6" />}
            iconColor="bg-green-100 text-green-600"
            trend={{ value: 23, direction: 'up' }}
          />
          
          <MetricCard
            title="Cost Per Employee"
            value={formatCurrency(kpiData.businessMetrics.costPerEmployee)}
            subtitle="monthly average"
            icon={<DollarSign className="w-6 h-6" />}
            iconColor="bg-yellow-100 text-yellow-600"
            trend={{ value: 5, direction: 'down' }}
          />
          
          <MetricCard
            title="Participation Rate"
            value={`${kpiData.engagementMetrics.participationRate}%`}
            subtitle="of all employees"
            icon={<Target className="w-6 h-6" />}
            iconColor="bg-blue-100 text-blue-600"
            trend={{ value: 7, direction: 'up' }}
          />
          
          <MetricCard
            title="NPS Score"
            value={kpiData.engagementMetrics.nps.toFixed(1)}
            subtitle="net promoter score"
            icon={<Activity className="w-6 h-6" />}
            iconColor="bg-purple-100 text-purple-600"
            trend={{ value: 12, direction: 'up' }}
          />
        </div>
      )}
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trends */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Engagement Trends</h3>
              {kpiData && getStatusBadge(kpiData.engagementMetrics.participationRate, { good: 85, warning: 70 })}
            </div>
            
            {kpiData && (
              <LineChart
                data={kpiData.trends.engagement}
                lines={[
                  { dataKey: 'participation', name: 'Participation %', color: '#3b82f6' },
                  { dataKey: 'satisfaction', name: 'Satisfaction', color: '#10b981' }
                ]}
                height={300}
                yAxisFormatter={(value) => value.toString()}
              />
            )}
          </div>
        </Card>
        
        {/* Cost Analysis */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Cost Analysis</h3>
              {kpiData && getStatusBadge(kpiData.businessMetrics.budgetUtilization, { good: 85, warning: 95 })}
            </div>
            
            {kpiData && (
              <BarChart
                data={kpiData.trends.costs}
                bars={[
                  { dataKey: 'operational', name: 'Operational', color: '#6b7280' },
                  { dataKey: 'rewards', name: 'Rewards', color: '#f59e0b' }
                ]}
                height={300}
                yAxisFormatter={(value) => formatCurrency(value)}
              />
            )}
          </div>
        </Card>
      </div>
      
      {/* System Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="lg:col-span-2">
          <SystemHealth />
        </div>
        
        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Live Activity Feed</h3>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {realtimeMetrics.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.details}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                size="small"
                className="w-full flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View All Activity
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Performance Summary */}
      {kpiData && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">System Performance Summary</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Uptime</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {kpiData.operationalMetrics.systemUptime}%
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Response Time</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {kpiData.operationalMetrics.avgResponseTime}ms
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Error Rate</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {kpiData.operationalMetrics.errorRate}%
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Data Accuracy</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {kpiData.operationalMetrics.dataAccuracy}%
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}