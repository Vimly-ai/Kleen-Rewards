import { StatCard } from '../ui/StatCard'
import { ProgressRing } from '../ui/ProgressRing'
import { 
  Calendar, 
  Star, 
  Zap, 
  Trophy, 
  Target,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react'

interface UserStats {
  totalPoints: number
  todayPoints: number
  currentStreak: number
  longestStreak: number
  totalCheckIns: number
  thisMonthCheckIns: number
  achievementsUnlocked: number
  nextLevelPoints: number
  currentLevelProgress: number
}

interface QuickStatsProps {
  stats: UserStats
  loading?: boolean
}

export function QuickStats({ stats, loading = false }: QuickStatsProps) {
  const level = Math.floor(stats.totalPoints / 1000) + 1
  const progressToNextLevel = (stats.totalPoints % 1000) / 10
  
  const streakProgress = Math.min((stats.currentStreak / 30) * 100, 100)
  const monthlyProgress = (stats.thisMonthCheckIns / 22) * 100 // Assuming ~22 work days per month

  const quickStatsData = [
    {
      title: 'Total Points',
      value: stats.totalPoints,
      icon: <Star className="w-6 h-6" />,
      color: 'primary' as const,
      trend: stats.todayPoints > 0 ? {
        value: 15.2,
        direction: 'up' as const,
        isPositive: true
      } : undefined
    },
    {
      title: 'Current Streak',
      value: stats.currentStreak,
      subtitle: `Best: ${stats.longestStreak} days`,
      icon: <Zap className="w-6 h-6" />,
      color: 'warning' as const,
      format: (val: number) => `${val} days`
    },
    {
      title: 'Monthly Check-ins',
      value: stats.thisMonthCheckIns,
      subtitle: `${stats.totalCheckIns} total`,
      icon: <Calendar className="w-6 h-6" />,
      color: 'success' as const,
      format: (val: number) => `${val}/22`
    },
    {
      title: 'Achievements',
      value: stats.achievementsUnlocked,
      icon: <Trophy className="w-6 h-6" />,
      color: 'neutral' as const,
      subtitle: 'Unlocked'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStatsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            format={stat.format}
            subtitle={stat.subtitle}
            trend={stat.trend}
            loading={loading}
          />
        ))}
      </div>

      {/* Progress Rings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level Progress */}
        <div className="text-center space-y-3">
          <ProgressRing
            progress={progressToNextLevel}
            size="lg"
            color="primary"
            showPercentage={false}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {level}
              </div>
              <div className="text-xs text-gray-500">
                Level
              </div>
            </div>
          </ProgressRing>
          <div>
            <h4 className="font-medium text-gray-900">Current Level</h4>
            <p className="text-sm text-gray-600">
              {1000 - (stats.totalPoints % 1000)} points to next level
            </p>
          </div>
        </div>

        {/* Streak Progress */}
        <div className="text-center space-y-3">
          <ProgressRing
            progress={streakProgress}
            size="lg"
            color="warning"
            showPercentage={false}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.currentStreak}
              </div>
              <div className="text-xs text-gray-500">
                Days
              </div>
            </div>
          </ProgressRing>
          <div>
            <h4 className="font-medium text-gray-900">Streak Progress</h4>
            <p className="text-sm text-gray-600">
              {30 - stats.currentStreak} days to milestone
            </p>
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="text-center space-y-3">
          <ProgressRing
            progress={monthlyProgress}
            size="lg"
            color="success"
            showPercentage={false}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.thisMonthCheckIns}
              </div>
              <div className="text-xs text-gray-500">
                Days
              </div>
            </div>
          </ProgressRing>
          <div>
            <h4 className="font-medium text-gray-900">Monthly Target</h4>
            <p className="text-sm text-gray-600">
              {22 - stats.thisMonthCheckIns} check-ins remaining
            </p>
          </div>
        </div>
      </div>

      {/* Today's Achievements */}
      {stats.todayPoints > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900">
                Great job today! 🎉
              </h4>
              <p className="text-green-700">
                You've earned <span className="font-bold">{stats.todayPoints} points</span> today. 
                Keep up the momentum!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}