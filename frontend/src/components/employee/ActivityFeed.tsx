import { useState } from 'react'
import { Timeline } from '../ui/Timeline'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { 
  Calendar, 
  Star, 
  Trophy, 
  Gift, 
  Users, 
  Zap,
  CheckCircle,
  Award,
  Target
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'check_in' | 'points_earned' | 'achievement' | 'achievement_unlocked' | 'bonus_points' | 'reward_redeemed' | 'streak_milestone' | 'level_up' | 'admin_action'
  title: string
  description: string
  timestamp: Date
  points?: number
  metadata?: Record<string, any>
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  loading?: boolean
  showAll?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

const activityConfig = {
  check_in: {
    icon: <CheckCircle className="w-4 h-4" />,
    type: 'success' as const,
    color: 'text-green-600'
  },
  points_earned: {
    icon: <Star className="w-4 h-4" />,
    type: 'info' as const,
    color: 'text-blue-600'
  },
  achievement: {
    icon: <Trophy className="w-4 h-4" />,
    type: 'warning' as const,
    color: 'text-yellow-600'
  },
  achievement_unlocked: {
    icon: <Trophy className="w-4 h-4" />,
    type: 'warning' as const,
    color: 'text-yellow-600'
  },
  bonus_points: {
    icon: <Star className="w-4 h-4" />,
    type: 'info' as const,
    color: 'text-blue-600'
  },
  reward_redeemed: {
    icon: <Gift className="w-4 h-4" />,
    type: 'default' as const,
    color: 'text-purple-600'
  },
  streak_milestone: {
    icon: <Zap className="w-4 h-4" />,
    type: 'warning' as const,
    color: 'text-orange-600'
  },
  level_up: {
    icon: <Award className="w-4 h-4" />,
    type: 'success' as const,
    color: 'text-emerald-600'
  },
  admin_action: {
    icon: <Users className="w-4 h-4" />,
    type: 'default' as const,
    color: 'text-gray-600'
  }
}

export function ActivityFeed({ 
  activities, 
  loading = false, 
  showAll = false,
  onLoadMore,
  hasMore = false
}: ActivityFeedProps) {
  const [filter, setFilter] = useState<string>('all')
  
  const displayActivities = showAll ? activities : activities.slice(0, 5)
  
  const filteredActivities = filter === 'all' 
    ? displayActivities 
    : displayActivities.filter(activity => {
        if (filter === 'achievement') {
          return activity.type === 'achievement' || activity.type === 'achievement_unlocked'
        }
        if (filter === 'points') {
          return activity.type === 'points_earned' || activity.type === 'bonus_points'
        }
        return activity.type === filter
      })

  const filters = [
    { key: 'all', label: 'All Activities', count: activities.length },
    { key: 'check_in', label: 'Check-ins', count: activities.filter(a => a.type === 'check_in').length },
    { key: 'achievement', label: 'Achievements', count: activities.filter(a => a.type === 'achievement' || a.type === 'achievement_unlocked').length },
    { key: 'points', label: 'Points', count: activities.filter(a => a.type === 'points_earned' || a.type === 'bonus_points').length }
  ]

  const timelineItems = filteredActivities.map(activity => {
    const config = activityConfig[activity.type] || activityConfig.check_in // Fallback to check_in if type not found
    
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      timestamp: activity.timestamp,
      icon: config.icon,
      type: config.type,
      actions: activity.points ? (
        <Badge variant="secondary" className="text-xs">
          +{activity.points} points
        </Badge>
      ) : null
    }
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(filterOption => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === filterOption.key
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
            }`}
          >
            {filterOption.label}
            {filterOption.count > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 text-xs"
              >
                {filterOption.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {timelineItems.length > 0 ? (
        <Timeline items={timelineItems} compact />
      ) : (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No activities yet
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'Start checking in to see your activity timeline!'
              : `No ${filter.replace('_', ' ')} activities found.`}
          </p>
        </div>
      )}

      {/* Load More */}
      {!showAll && activities.length > 5 && (
        <div className="text-center pt-4">
          <Button
            variant="ghost"
            onClick={onLoadMore}
            disabled={loading}
          >
            {hasMore ? 'Load More Activities' : 'View All Activities'}
          </Button>
        </div>
      )}
    </div>
  )
}