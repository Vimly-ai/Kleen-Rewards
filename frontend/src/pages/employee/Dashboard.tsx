import { useUser } from '@clerk/clerk-react'
import { useData } from '../../contexts/DataContext'
import { useUserStats } from '../../queries/userQueries'
import { useTodaysCheckIn } from '../../queries/checkInQueries'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { StatsCards } from '../../components/dashboard/StatsCards'
import { CheckInSection } from '../../components/dashboard/CheckInSection'
import { RecentActivity } from '../../components/dashboard/RecentActivity'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useWebSocket } from '../../services/websocket'
import { DashboardWidget } from '../../components/employee/DashboardWidget'
import { QuickStats } from '../../components/employee/QuickStats'
import { ActivityFeed } from '../../components/employee/ActivityFeed'
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Calendar,
  Star,
  Trophy,
  Gift,
  Target,
  Clock,
  Bell,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EmployeeDashboard() {
  const navigate = useNavigate()
  const { user: clerkUser } = useUser()
  const { user: dbUser, loading: userLoading } = useData()
  const { data: userStats, isLoading: statsLoading } = useUserStats(dbUser?.id || '')
  const { data: todayCheckIn, isLoading: checkInLoading } = useTodaysCheckIn(dbUser?.id || '')
  const { realtimeStats, onlineUsers, autoConnect } = useWebSocket()
  const [refreshKey, setRefreshKey] = useState(0)

  // Auto-connect to WebSocket for real-time updates
  useEffect(() => {
    if (dbUser?.id && autoConnect && typeof autoConnect === 'function') {
      try {
        autoConnect(dbUser.id)
      } catch (error) {
        console.warn('Failed to auto-connect WebSocket:', error)
      }
    }
  }, [dbUser?.id, autoConnect])

  const isLoading = userLoading || statsLoading || checkInLoading

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading your dashboard..." />
  }

  if (!dbUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Setting up your profile...
        </h2>
        <p className="text-gray-600">
          Please wait while we prepare your dashboard.
        </p>
      </div>
    )
  }

  const hasCheckedInToday = !!todayCheckIn

  // Mock activity data - in real app this would come from API
  const mockActivities = [
    {
      id: '1',
      type: 'check_in' as const,
      title: 'Daily Check-in',
      description: 'Checked in at 9:15 AM',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      points: 50
    },
    {
      id: '2', 
      type: 'achievement' as const,
      title: 'Early Bird',
      description: 'Unlocked for checking in early 5 times',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      points: 100
    },
    {
      id: '3',
      type: 'points_earned' as const,
      title: 'Bonus Points',
      description: 'Earned bonus points for perfect attendance',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      points: 75
    }
  ]

  const quickStatsData = userStats ? {
    totalPoints: userStats.totalPoints,
    todayPoints: 50, // Mock today's points
    currentStreak: userStats.currentStreak,
    longestStreak: userStats.longestStreak || userStats.currentStreak,
    totalCheckIns: userStats.totalCheckIns || 0,
    thisMonthCheckIns: 15, // Mock this month's check-ins
    achievementsUnlocked: userStats.badges?.length || 0,
    nextLevelPoints: 1000,
    currentLevelProgress: (userStats.totalPoints % 1000) / 10
  } : {
    totalPoints: 0,
    todayPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCheckIns: 0,
    thisMonthCheckIns: 0,
    achievementsUnlocked: 0,
    nextLevelPoints: 1000,
    currentLevelProgress: 0
  }

  const handleRefreshStats = () => {
    setRefreshKey(prev => prev + 1)
    // Trigger refetch of data
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {clerkUser?.firstName || dbUser.name}!
                </h1>
                <p className="text-gray-600">
                  Ready to make today count? Let's keep your streak going!
                </p>
              </div>
            </div>
            
            {/* Achievement Highlights */}
            {userStats && userStats.currentStreak > 0 && (
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="success" className="flex items-center gap-1 px-3 py-1">
                  <Zap className="w-4 h-4" />
                  {userStats.currentStreak} day streak!
                </Badge>
                {!hasCheckedInToday && (
                  <Badge variant="warning" className="flex items-center gap-1 px-3 py-1">
                    <Clock className="w-4 h-4" />
                    Check in to continue streak
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {/* Real-time indicators */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            {realtimeStats && (
              <div className="flex items-center gap-4 text-sm bg-white/50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>{onlineUsers.length} online</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{realtimeStats.totalCheckIns} check-ins today</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <DashboardWidget
        title="Performance Overview"
        icon={<TrendingUp className="w-5 h-5" />}
        refreshable
        onRefresh={handleRefreshStats}
        loading={statsLoading}
      >
        <QuickStats stats={quickStatsData} loading={statsLoading} />
      </DashboardWidget>

      {/* Check-in Section */}
      <DashboardWidget
        title="Daily Check-in"
        subtitle={hasCheckedInToday ? 'You\'ve checked in today!' : 'Don\'t forget to check in'}
        icon={<CheckCircle className="w-5 h-5" />}
        headerClassName={hasCheckedInToday ? 'bg-green-50' : 'bg-yellow-50'}
      >
        <CheckInSection 
          hasCheckedInToday={hasCheckedInToday}
          todayCheckIn={todayCheckIn}
        />
      </DashboardWidget>

      {/* Activity and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <DashboardWidget
          title="Recent Activity"
          subtitle="Your latest actions and achievements"
          icon={<Clock className="w-5 h-5" />}
          collapsible
        >
          <ActivityFeed 
            activities={mockActivities}
            loading={false}
          />
        </DashboardWidget>
        
        {/* Achievements Preview */}
        <DashboardWidget
          title="Recent Achievements"
          subtitle="Your latest unlocks and progress"
          icon={<Trophy className="w-5 h-5" />}
          actions={(
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate('/employee/achievements')}
              className="text-sm"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        >
          {userStats?.badges && userStats.badges.length > 0 ? (
            <div className="space-y-3">
              {userStats.badges.slice(0, 3).map((userBadge) => (
                <div
                  key={userBadge.id}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                >
                  <div className="text-2xl">🏆</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Achievement Unlocked
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(userBadge.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="success" className="text-xs">
                    +100 XP
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">
                No achievements yet
              </h4>
              <p className="text-gray-600 text-sm">
                Keep checking in to unlock your first achievement!
              </p>
              <Button
                variant="outline"
                size="small"
                className="mt-3"
                onClick={() => navigate('/employee/achievements')}
              >
                Explore Achievements
              </Button>
            </div>
          )}
        </DashboardWidget>
      </div>

      {/* Quick Actions */}
      <DashboardWidget
        title="Quick Actions"
        subtitle="Navigate to your favorite features"
        icon={<Target className="w-5 h-5" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto p-4 flex-col items-start space-y-2 hover:bg-primary-50 hover:border-primary-200 group"
            onClick={() => navigate('/employee/rewards')}
          >
            <div className="flex items-center space-x-2 w-full">
              <Gift className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-900 group-hover:text-primary-700">
                Rewards Store
              </span>
            </div>
            <p className="text-sm text-gray-600 text-left">
              {userStats?.totalPoints || 0} points available
            </p>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto p-4 flex-col items-start space-y-2 hover:bg-yellow-50 hover:border-yellow-200 group"
            onClick={() => navigate('/employee/leaderboard')}
          >
            <div className="flex items-center space-x-2 w-full">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-900 group-hover:text-yellow-700">
                Leaderboard
              </span>
            </div>
            <p className="text-sm text-gray-600 text-left">
              See your ranking
            </p>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto p-4 flex-col items-start space-y-2 hover:bg-green-50 hover:border-green-200 group"
            onClick={() => navigate('/employee/achievements')}
          >
            <div className="flex items-center space-x-2 w-full">
              <Star className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900 group-hover:text-green-700">
                Achievements
              </span>
            </div>
            <p className="text-sm text-gray-600 text-left">
              {userStats?.badges?.length || 0} unlocked
            </p>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto p-4 flex-col items-start space-y-2 hover:bg-purple-50 hover:border-purple-200 group"
            onClick={() => navigate('/employee/profile')}
          >
            <div className="flex items-center space-x-2 w-full">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900 group-hover:text-purple-700">
                Profile
              </span>
            </div>
            <p className="text-sm text-gray-600 text-left">
              Manage settings
            </p>
          </Button>
        </div>
      </DashboardWidget>
    </div>
  )
}