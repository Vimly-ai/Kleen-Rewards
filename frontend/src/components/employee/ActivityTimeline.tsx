import { useState } from 'react'
import { Timeline } from '../ui/Timeline'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { 
  Calendar,
  Star,
  Trophy,
  Gift,
  Zap,
  Target,
  Users,
  TrendingUp,
  Clock,
  Filter,
  ChevronDown,
  CheckCircle,
  Award
} from 'lucide-react'
import { clsx } from 'clsx'

interface ActivityTimelineProps {
  activities: Array<{
    id: string
    type: 'check_in' | 'points_earned' | 'achievement_unlocked' | 'reward_redeemed' | 'level_up' | 'streak_milestone' | 'bonus_earned'
    title: string
    description: string
    timestamp: Date
    points?: number
    metadata?: Record<string, any>
  }>
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

const ACTIVITY_CONFIG = {
  check_in: {
    icon: CheckCircle,
    type: 'success' as const,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Check-in'
  },
  points_earned: {
    icon: Star,
    type: 'info' as const,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Points Earned'
  },
  achievement_unlocked: {
    icon: Trophy,
    type: 'warning' as const,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'Achievement'
  },
  reward_redeemed: {
    icon: Gift,
    type: 'default' as const,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Reward'
  },
  level_up: {
    icon: TrendingUp,
    type: 'success' as const,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    label: 'Level Up'
  },
  streak_milestone: {
    icon: Zap,
    type: 'warning' as const,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Streak'
  },
  bonus_earned: {
    icon: Award,
    type: 'info' as const,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    label: 'Bonus'
  }
}

const FILTER_OPTIONS = [
  { key: 'all', label: 'All Activities', icon: Target },
  { key: 'check_in', label: 'Check-ins', icon: CheckCircle },
  { key: 'points_earned', label: 'Points', icon: Star },
  { key: 'achievement_unlocked', label: 'Achievements', icon: Trophy },
  { key: 'reward_redeemed', label: 'Rewards', icon: Gift }
]

export function ActivityTimeline({ 
  activities, 
  loading = false,
  onLoadMore,
  hasMore = false
}: ActivityTimelineProps) {
  const [filter, setFilter] = useState('all')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter activities
  const filteredActivities = activities.filter(activity => {
    if (filter !== 'all' && activity.type !== filter) {
      return false
    }
    
    if (timeRange !== 'all') {
      const now = new Date()
      const activityDate = new Date(activity.timestamp)
      const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (timeRange === 'week' && daysDiff > 7) return false
      if (timeRange === 'month' && daysDiff > 30) return false
    }
    
    return true
  })
  
  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.timestamp.toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {} as Record<string, typeof activities>)
  
  // Convert to timeline format
  const timelineItems = Object.entries(groupedActivities)
    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
    .flatMap(([date, dayActivities]) => {
      const isToday = new Date().toDateString() === date
      const isYesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString() === date
      
      let dateLabel = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      if (isToday) dateLabel = 'Today'
      else if (isYesterday) dateLabel = 'Yesterday'
      
      return dayActivities.map((activity, index) => {
        const config = ACTIVITY_CONFIG[activity.type]
        const Icon = config.icon
        
        return {
          id: `${activity.id}-${index}`,
          title: activity.title,
          description: activity.description,
          timestamp: activity.timestamp,
          icon: <Icon className="w-4 h-4" />,
          type: config.type,
          actions: (
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={clsx('text-xs', config.bgColor, config.color)}
              >
                {config.label}
              </Badge>
              {activity.points && (
                <Badge variant="success" className="text-xs">
                  +{activity.points} pts
                </Badge>
              )}
            </div>
          )
        }
      })
    })
  
  const getActivityStats = () => {
    const stats = {
      total: filteredActivities.length,
      checkIns: filteredActivities.filter(a => a.type === 'check_in').length,
      achievements: filteredActivities.filter(a => a.type === 'achievement_unlocked').length,
      points: filteredActivities.reduce((sum, a) => sum + (a.points || 0), 0)
    }
    return stats
  }
  
  const stats = getActivityStats()

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Activity Timeline
          </h3>
          <p className="text-sm text-gray-600">
            {stats.total} activities • {stats.points} points earned
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={clsx(
              'w-4 h-4 transition-transform',
              showFilters && 'rotate-180'
            )} />
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <Card>
          <div className="p-4 space-y-4">
            {/* Activity Type Filter */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Activity Type</h4>
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map(option => {
                  const Icon = option.icon
                  const count = option.key === 'all' 
                    ? activities.length 
                    : activities.filter(a => a.type === option.key).length
                  
                  return (
                    <button
                      key={option.key}
                      onClick={() => setFilter(option.key)}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                        filter === option.key
                          ? 'bg-primary-100 text-primary-700 border border-primary-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Time Range Filter */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Time Range</h4>
              <div className="flex gap-2">
                {[
                  { key: 'week', label: 'Past Week' },
                  { key: 'month', label: 'Past Month' },
                  { key: 'all', label: 'All Time' }
                ].map(option => (
                  <button
                    key={option.key}
                    onClick={() => setTimeRange(option.key as any)}
                    className={clsx(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      timeRange === option.key
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-600">
            {stats.checkIns}
          </div>
          <div className="text-xs text-green-700">Check-ins</div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-yellow-600">
            {stats.achievements}
          </div>
          <div className="text-xs text-yellow-700">Achievements</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-600">
            {stats.points}
          </div>
          <div className="text-xs text-blue-700">Points</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-purple-600">
            {Math.round(stats.points / Math.max(stats.checkIns, 1))}
          </div>
          <div className="text-xs text-purple-700">Avg/Day</div>
        </div>
      </div>
      
      {/* Timeline */}
      <Card>
        <div className="p-6">
          {timelineItems.length > 0 ? (
            <>
              <Timeline items={timelineItems} compact />
              
              {/* Load More */}
              {hasMore && onLoadMore && (
                <div className="text-center mt-6">
                  <Button
                    variant="outline"
                    onClick={onLoadMore}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load More Activities'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No activities found
              </h3>
              <p className="text-gray-600">
                {filter === 'all' && timeRange === 'all'
                  ? 'Start using the platform to see your activity timeline!'
                  : 'No activities match your current filters. Try adjusting them.'}
              </p>
              {(filter !== 'all' || timeRange !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilter('all')
                    setTimeRange('all')
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}