import { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Zap, 
  Star,
  Trophy,
  CheckCircle,
  Clock
} from 'lucide-react'
import { clsx } from 'clsx'

interface LiveUpdate {
  id: string
  type: 'check_in' | 'achievement' | 'points' | 'level_up' | 'streak'
  user: {
    id: string
    name: string
    avatar?: string
    department?: string
  }
  action: string
  details?: string
  points?: number
  timestamp: Date
  isNew?: boolean
}

interface LiveUpdatesProps {
  updates: LiveUpdate[]
  currentUserId?: string
  maxItems?: number
  showUserActivity?: boolean
  className?: string
}

const UPDATE_CONFIG = {
  check_in: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'checked in'
  },
  achievement: {
    icon: Trophy,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    label: 'unlocked achievement'
  },
  points: {
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'earned points'
  },
  level_up: {
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'leveled up'
  },
  streak: {
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'streak milestone'
  }
}

export function LiveUpdates({
  updates,
  currentUserId,
  maxItems = 10,
  showUserActivity = true,
  className
}: LiveUpdatesProps) {
  const [recentUpdates, setRecentUpdates] = useState<LiveUpdate[]>([])
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())
  
  // Filter and sort updates
  const filteredUpdates = updates
    .filter(update => showUserActivity || update.user.id !== currentUserId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, maxItems)
  
  // Handle new updates with animation
  useEffect(() => {
    const newUpdates = filteredUpdates.filter(update => 
      !recentUpdates.find(existing => existing.id === update.id)
    )
    
    if (newUpdates.length > 0) {
      // Add animation class to new items
      const newIds = new Set(newUpdates.map(u => u.id))
      setAnimatingItems(newIds)
      
      // Remove animation after delay
      setTimeout(() => {
        setAnimatingItems(new Set())
      }, 1000)
    }
    
    setRecentUpdates(filteredUpdates)
  }, [filteredUpdates, recentUpdates])
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }
  
  const getUpdateText = (update: LiveUpdate) => {
    const config = UPDATE_CONFIG[update.type]
    const isCurrentUser = update.user.id === currentUserId
    const userName = isCurrentUser ? 'You' : update.user.name
    
    switch (update.type) {
      case 'check_in':
        return `${userName} ${config.label}${update.details ? ` ${update.details}` : ''}`
      case 'achievement':
        return `${userName} ${config.label}${update.details ? `: \"${update.details}\"` : ''}`
      case 'points':
        return `${userName} ${config.label}${update.points ? ` (${update.points} pts)` : ''}`
      case 'level_up':
        return `${userName} ${config.label}${update.details ? ` to ${update.details}` : ''}`
      case 'streak':
        return `${userName} reached ${update.details || 'streak milestone'}`
      default:
        return `${userName} ${update.action}`
    }
  }
  
  const getOnlineUsers = () => {
    const uniqueUsers = new Map()
    const recentThreshold = Date.now() - 5 * 60 * 1000 // 5 minutes
    
    recentUpdates.forEach(update => {
      if (update.timestamp.getTime() > recentThreshold) {
        uniqueUsers.set(update.user.id, update.user)
      }
    })
    
    return Array.from(uniqueUsers.values())
  }
  
  const onlineUsers = getOnlineUsers()

  return (
    <Card className={className}>
      <div className=\"p-4\">
        {/* Header */}
        <div className=\"flex items-center justify-between mb-4\">
          <div className=\"flex items-center gap-2\">
            <Activity className=\"w-5 h-5 text-primary-600\" />
            <h3 className=\"font-medium text-gray-900\">Live Activity</h3>
            {recentUpdates.length > 0 && (
              <Badge variant=\"success\" className=\"text-xs\">
                {recentUpdates.length} recent
              </Badge>
            )}
          </div>
          
          {/* Online Users Count */}
          <div className=\"flex items-center gap-2 text-sm text-gray-600\">
            <div className=\"flex items-center gap-1\">
              <div className=\"w-2 h-2 bg-green-500 rounded-full animate-pulse\" />
              <Users className=\"w-4 h-4\" />
              <span>{onlineUsers.length} active</span>
            </div>
          </div>
        </div>
        
        {/* Online Users Avatars */}
        {onlineUsers.length > 0 && (
          <div className=\"flex items-center gap-2 mb-4 pb-4 border-b border-gray-100\">
            <span className=\"text-sm text-gray-600\">Recently active:</span>
            <div className=\"flex items-center -space-x-2\">
              {onlineUsers.slice(0, 5).map(user => (
                <Avatar
                  key={user.id}
                  src={user.avatar}
                  alt={user.name}
                  size=\"sm\"
                  className=\"ring-2 ring-white\"
                />
              ))}
              {onlineUsers.length > 5 && (
                <div className=\"w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white\">
                  +{onlineUsers.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Activity Feed */}
        <div className=\"space-y-3 max-h-64 overflow-y-auto\">
          {recentUpdates.length > 0 ? (
            recentUpdates.map(update => {
              const config = UPDATE_CONFIG[update.type]
              const Icon = config.icon
              const isAnimating = animatingItems.has(update.id)
              const isCurrentUser = update.user.id === currentUserId
              
              return (
                <div
                  key={update.id}
                  className={clsx(
                    'flex items-start gap-3 p-2 rounded-lg transition-all duration-500',
                    isAnimating && 'animate-pulse bg-primary-50 border border-primary-200',
                    isCurrentUser && 'bg-blue-50 border border-blue-200',
                    !isAnimating && !isCurrentUser && 'hover:bg-gray-50'
                  )}
                >
                  {/* User Avatar */}
                  <Avatar
                    src={update.user.avatar}
                    alt={update.user.name}
                    size=\"sm\"
                    className=\"flex-shrink-0\"
                  />
                  
                  {/* Activity Content */}
                  <div className=\"flex-1 min-w-0\">
                    <div className=\"flex items-start justify-between\">
                      <div className=\"flex-1\">
                        <p className=\"text-sm text-gray-900\">
                          {getUpdateText(update)}
                        </p>
                        
                        {update.user.department && (
                          <p className=\"text-xs text-gray-500\">
                            {update.user.department}
                          </p>
                        )}
                      </div>
                      
                      {/* Activity Icon */}
                      <div className={clsx(
                        'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ml-2',
                        config.bgColor
                      )}>
                        <Icon className={clsx('w-3 h-3', config.color)} />
                      </div>
                    </div>
                    
                    {/* Timestamp and Points */}
                    <div className=\"flex items-center justify-between mt-1\">
                      <span className=\"text-xs text-gray-500\">
                        {formatTimeAgo(update.timestamp)}
                      </span>
                      
                      {update.points && (
                        <Badge variant=\"success\" className=\"text-xs\">
                          +{update.points} pts
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className=\"text-center py-6\">
              <Clock className=\"w-8 h-8 text-gray-400 mx-auto mb-2\" />
              <p className=\"text-sm text-gray-600\">
                No recent activity
              </p>
              <p className=\"text-xs text-gray-500\">
                Activity will appear here as it happens
              </p>
            </div>
          )}
        </div>
        
        {/* Real-time Indicator */}
        <div className=\"mt-4 pt-3 border-t border-gray-100\">
          <div className=\"flex items-center justify-center gap-2 text-xs text-gray-500\">
            <div className=\"w-2 h-2 bg-green-500 rounded-full animate-pulse\" />
            <span>Updates in real-time</span>
          </div>
        </div>
      </div>
    </Card>
  )
}