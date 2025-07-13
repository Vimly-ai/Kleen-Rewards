import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { LineChart } from './charts/LineChart'
import { BarChart } from './charts/BarChart'
import { PieChart } from './charts/PieChart'
import { MetricCard } from './charts/MetricCard'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Award,
  Clock,
  DollarSign
} from 'lucide-react'
import { clsx } from 'clsx'
import { isDemoMode, getDemoAnalytics, generateLeaderboard } from '../../services/demoService'

interface ReportData {
  engagementTrends: Array<{
    name: string
    checkIns: number
    uniqueUsers: number
    pointsDistributed: number
  }>
  departmentPerformance: Array<{
    name: string
    value: number
    color?: string
  }>
  checkInPatterns: Array<{
    name: string
    early: number
    onTime: number
    late: number
  }>
  pointsDistribution: Array<{
    name: string
    earned: number
    redeemed: number
  }>
  topPerformers: Array<{
    name: string
    points: number
    checkIns: number
    department: string
  }>
  kpis: {
    participationRate: number
    averagePointsPerUser: number
    retentionRate: number
    engagementScore: number
  }
}

const TIME_RANGES = [
  { key: 'week', label: 'Last 7 Days' },
  { key: 'month', label: 'Last 30 Days' },
  { key: 'quarter', label: 'Last Quarter' },
  { key: 'year', label: 'Last Year' }
]

const REPORT_TYPES = [
  { key: 'engagement', label: 'Engagement Report', icon: Users },
  { key: 'performance', label: 'Performance Report', icon: Target },
  { key: 'points', label: 'Points & Rewards Report', icon: Award },
  { key: 'attendance', label: 'Attendance Report', icon: Calendar }
]

export function AdvancedReporting() {
  const [selectedRange, setSelectedRange] = useState('month')
  const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>('line')
  const [activeTab, setActiveTab] = useState('overview')
  
  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ['admin-reports', selectedRange],
    queryFn: async (): Promise<ReportData> => {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (isDemoMode()) {
        const demoAnalytics = getDemoAnalytics()
        const leaderboard = generateLeaderboard()
        
        return {
          engagementTrends: demoAnalytics.trends.daily.map((day, idx) => ({
            name: day.date,
            checkIns: day.checkIns,
            uniqueUsers: Math.floor(day.checkIns * 0.9),
            pointsDistributed: day.checkIns * 65 // avg 65 points per check-in
          })),
          departmentPerformance: demoAnalytics.departments.map(dept => ({
            name: dept.name,
            value: dept.avgPoints,
            color: dept.name === 'Operations' ? '#3b82f6' : 
                   dept.name === 'Sales' ? '#10b981' :
                   dept.name === 'Marketing' ? '#f59e0b' :
                   dept.name === 'IT' ? '#ef4444' : '#8b5cf6'
          })),
          checkInPatterns: [
            { name: 'Monday', early: 45, onTime: 78, late: 12 },
            { name: 'Tuesday', early: 52, onTime: 71, late: 8 },
            { name: 'Wednesday', early: 48, onTime: 75, late: 10 },
            { name: 'Thursday', early: 41, onTime: 80, late: 14 },
            { name: 'Friday', early: 38, onTime: 69, late: 18 }
          ],
          pointsDistribution: demoAnalytics.trends.monthly.slice(0, 4).map(month => ({
            name: month.month,
            earned: month.totalPoints,
            redeemed: Math.floor(month.totalPoints * 0.55) // 55% redemption rate
          })),
          topPerformers: leaderboard.slice(0, 5).map(emp => ({
            name: emp.name,
            points: emp.points,
            checkIns: Math.floor(emp.points / 65), // estimate based on avg points
            department: emp.department
          })),
          kpis: {
            participationRate: demoAnalytics.overview.onTimeRate,
            averagePointsPerUser: Math.floor(demoAnalytics.trends.monthly[0].totalPoints / demoAnalytics.overview.totalEmployees),
            retentionRate: 92.1,
            engagementScore: 87.5
          }
        }
      }
      
      return {
        engagementTrends: [
          { name: 'Week 1', checkIns: 245, uniqueUsers: 89, pointsDistributed: 12500 },
          { name: 'Week 2', checkIns: 268, uniqueUsers: 92, pointsDistributed: 13600 },
          { name: 'Week 3', checkIns: 234, uniqueUsers: 85, pointsDistributed: 11800 },
          { name: 'Week 4', checkIns: 289, uniqueUsers: 98, pointsDistributed: 14700 }
        ],
        departmentPerformance: [
          { name: 'Engineering', value: 850, color: '#3b82f6' },
          { name: 'Design', value: 650, color: '#10b981' },
          { name: 'Marketing', value: 720, color: '#f59e0b' },
          { name: 'Sales', value: 580, color: '#ef4444' },
          { name: 'HR', value: 420, color: '#8b5cf6' }
        ],
        checkInPatterns: [
          { name: 'Monday', early: 45, onTime: 78, late: 12 },
          { name: 'Tuesday', early: 52, onTime: 71, late: 8 },
          { name: 'Wednesday', early: 48, onTime: 75, late: 10 },
          { name: 'Thursday', early: 41, onTime: 80, late: 14 },
          { name: 'Friday', early: 38, onTime: 69, late: 18 }
        ],
        pointsDistribution: [
          { name: 'Jan', earned: 15600, redeemed: 8200 },
          { name: 'Feb', earned: 17200, redeemed: 9100 },
          { name: 'Mar', earned: 16800, redeemed: 8800 },
          { name: 'Apr', earned: 18400, redeemed: 9600 }
        ],
        topPerformers: [
          { name: 'Sarah Johnson', points: 2850, checkIns: 28, department: 'Engineering' },
          { name: 'Mike Chen', points: 2720, checkIns: 27, department: 'Design' },
          { name: 'Emma Davis', points: 2650, checkIns: 26, department: 'Marketing' },
          { name: 'James Wilson', points: 2580, checkIns: 25, department: 'Engineering' },
          { name: 'Lisa Anderson', points: 2520, checkIns: 24, department: 'Sales' }
        ],
        kpis: {
          participationRate: 84.2,
          averagePointsPerUser: 1850,
          retentionRate: 92.1,
          engagementScore: 87.5
        }
      }
    },
    refetchInterval: isDemoMode() ? false : 60000 // No refresh in demo mode
  })
  
  const chartLines = useMemo(() => [
    { dataKey: 'checkIns', name: 'Check-ins', color: '#3b82f6', strokeWidth: 3 },
    { dataKey: 'uniqueUsers', name: 'Unique Users', color: '#10b981', strokeWidth: 2 },
    { dataKey: 'pointsDistributed', name: 'Points (÷100)', color: '#f59e0b', strokeWidth: 2 }
  ], [])
  
  const processedEngagementData = useMemo(() => {
    if (!reportData) return []
    return reportData.engagementTrends.map(item => ({
      ...item,
      pointsDistributed: Math.round(item.pointsDistributed / 100) // Scale for chart readability
    }))
  }, [reportData])
  
  const handleExportReport = (type: string) => {
    // Simulate report generation and download
    const blob = new Blob(
      [`Report data for ${type} (${selectedRange})
Generated on: ${new Date().toISOString()}`],
      { type: 'text/csv' }
    )
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${type}-report-${selectedRange}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  
  if (isLoading || !reportData) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Generating reports...</p>
          </div>
        </div>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary-600" />
            Advanced Reporting
          </h2>
          <p className="text-gray-600 mt-1">
            Comprehensive analytics and insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            {TIME_RANGES.map((range) => (
              <button
                key={range.key}
                onClick={() => setSelectedRange(range.key)}
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium transition-all',
                  selectedRange === range.key
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
          
          <Button
            variant="secondary"
            size="small"
            onClick={() => refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Participation Rate"
          value={`${reportData.kpis.participationRate}%`}
          trend={{ value: 2.3, direction: 'up' }}
          icon={<Users className="w-6 h-6" />}
          iconColor="bg-blue-100 text-blue-600"
        />
        
        <MetricCard
          title="Avg Points/User"
          value={reportData.kpis.averagePointsPerUser.toLocaleString()}
          trend={{ value: 5.7, direction: 'up' }}
          icon={<Award className="w-6 h-6" />}
          iconColor="bg-green-100 text-green-600"
        />
        
        <MetricCard
          title="Retention Rate"
          value={`${reportData.kpis.retentionRate}%`}
          trend={{ value: 1.2, direction: 'up' }}
          icon={<Target className="w-6 h-6" />}
          iconColor="bg-purple-100 text-purple-600"
        />
        
        <MetricCard
          title="Engagement Score"
          value={`${reportData.kpis.engagementScore}%`}
          trend={{ value: 3.1, direction: 'up' }}
          icon={<TrendingUp className="w-6 h-6" />}
          iconColor="bg-yellow-100 text-yellow-600"
        />
      </div>
      
      {/* Chart Controls */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Engagement Trends</h3>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Chart Type:</span>
              <div className="flex rounded-lg bg-gray-100 p-1">
                {[
                  { key: 'line', label: 'Line' },
                  { key: 'bar', label: 'Bar' },
                  { key: 'area', label: 'Area' }
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setSelectedChart(type.key as any)}
                    className={clsx(
                      'px-3 py-1 rounded-md text-sm font-medium transition-all',
                      selectedChart === type.key
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {selectedChart === 'line' && (
            <LineChart
              data={processedEngagementData}
              lines={chartLines}
              height={400}
              showArea={false}
              xAxisFormatter={(value) => value}
              yAxisFormatter={(value) => value.toLocaleString()}
            />
          )}
          
          {selectedChart === 'area' && (
            <LineChart
              data={processedEngagementData}
              lines={chartLines}
              height={400}
              showArea={true}
              xAxisFormatter={(value) => value}
              yAxisFormatter={(value) => value.toLocaleString()}
            />
          )}
          
          {selectedChart === 'bar' && (
            <BarChart
              data={processedEngagementData}
              bars={[
                { dataKey: 'checkIns', name: 'Check-ins', color: '#3b82f6' },
                { dataKey: 'uniqueUsers', name: 'Unique Users', color: '#10b981' }
              ]}
              height={400}
              yAxisFormatter={(value) => value.toLocaleString()}
            />
          )}
        </div>
      </Card>
      
      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleExportReport('department-performance')}
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Export
              </Button>
            </div>
            
            <PieChart
              data={reportData.departmentPerformance}
              height={300}
              showLabels={true}
              tooltipFormatter={(value) => `${value} points`}
            />
          </div>
        </Card>
        
        {/* Check-in Patterns */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Daily Check-in Patterns</h3>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleExportReport('checkin-patterns')}
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Export
              </Button>
            </div>
            
            <BarChart
              data={reportData.checkInPatterns}
              bars={[
                { dataKey: 'early', name: 'Early', color: '#10b981', stackId: 'checkins' },
                { dataKey: 'onTime', name: 'On Time', color: '#3b82f6', stackId: 'checkins' },
                { dataKey: 'late', name: 'Late', color: '#ef4444', stackId: 'checkins' }
              ]}
              height={300}
              showValues={false}
            />
          </div>
        </Card>
      </div>
      
      {/* Points Distribution & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Points Distribution */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Points Distribution</h3>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleExportReport('points-distribution')}
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Export
              </Button>
            </div>
            
            <BarChart
              data={reportData.pointsDistribution}
              bars={[
                { dataKey: 'earned', name: 'Earned', color: '#10b981' },
                { dataKey: 'redeemed', name: 'Redeemed', color: '#f59e0b' }
              ]}
              height={300}
              yAxisFormatter={(value) => value.toLocaleString()}
            />
          </div>
        </Card>
        
        {/* Top Performers */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performers</h3>
            
            <div className="space-y-4">
              {reportData.topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                      <p className="text-xs text-gray-500">{performer.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {performer.points.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {performer.checkIns} check-ins
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleExportReport('top-performers')}
                className="w-full flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Full Report
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}