import { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import { 
  Bell, 
  X, 
  CheckCircle, 
  Trophy, 
  Gift, 
  Star, 
  Zap,
  Settings,
  MoreHorizontal,
  BellOff,
  Volume2,
  VolumeX
} from 'lucide-react'
import { clsx } from 'clsx'

interface Notification {
  id: string
  type: 'achievement' | 'points' | 'reward' | 'streak' | 'system' | 'social'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: {
    points?: number
    achievement?: string
    reward?: string
    icon?: string
  }
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDeleteNotification: (id: string) => void
  onToggleSound: () => void
  soundEnabled: boolean
  className?: string
}

const NOTIFICATION_CONFIG = {
  achievement: {
    icon: Trophy,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
    label: 'Achievement'
  },
  points: {
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    label: 'Points'
  },
  reward: {
    icon: Gift,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
    label: 'Reward'
  },
  streak: {
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    label: 'Streak'
  },
  system: {
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    label: 'System'
  },
  social: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    label: 'Social'
  }
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onToggleSound,
  soundEnabled,
  className
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [showSettings, setShowSettings] = useState(false)
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })
  
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    const notificationDate = notification.timestamp.toDateString()
    
    let group = 'Older'
    if (notificationDate === today) group = 'Today'
    else if (notificationDate === yesterday) group = 'Yesterday'
    
    if (!groups[group]) groups[group] = []
    groups[group].push(notification)
    return groups
  }, {} as Record<string, Notification[]>)
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }
  
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }
  
  const filterOptions = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'achievement', label: 'Achievements', count: notifications.filter(n => n.type === 'achievement').length },
    { key: 'points', label: 'Points', count: notifications.filter(n => n.type === 'points').length },
    { key: 'reward', label: 'Rewards', count: notifications.filter(n => n.type === 'reward').length }
  ]

  return (
    <>
      {/* Notification Bell */}
      <div className={clsx('relative', className)}>
        <button
          onClick={() => setIsOpen(true)}
          className={clsx(
            'relative p-2 rounded-lg transition-colors',
            'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500',
            unreadCount > 0 && 'text-primary-600'
          )}
        >
          <Bell className="w-5 h-5" />
          
          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
          
          {/* Sound Indicator */}
          {!soundEnabled && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
              <VolumeX className="w-2 h-2 text-white" />
            </div>
          )}
        </button>
      </div>
      
      {/* Notification Panel Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Notifications"
        size="lg"
      >
        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {unreadCount} unread
              </span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="small"
                  onClick={onMarkAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="small"
                onClick={onToggleSound}
                className="p-2"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="small"
                onClick={() => setShowSettings(true)}
                className="p-2"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  filter === option.key
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {option.label}
                {option.count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {option.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
          
          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto space-y-4">
            {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
              <div key={group}>
                <h4 className="text-sm font-medium text-gray-900 mb-2 sticky top-0 bg-white py-1">
                  {group}
                </h4>
                
                <div className="space-y-2">
                  {groupNotifications.map(notification => {
                    const config = NOTIFICATION_CONFIG[notification.type]
                    const Icon = config.icon
                    
                    return (
                      <div
                        key={notification.id}
                        className={clsx(
                          'relative p-3 rounded-lg border transition-all cursor-pointer group',
                          notification.read
                            ? 'bg-white border-gray-200 hover:bg-gray-50'
                            : clsx('bg-gradient-to-r from-white to-primary-50', config.borderColor, 'border-l-4')
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={clsx(
                            'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                            config.bgColor
                          )}>
                            <Icon className={clsx('w-4 h-4', config.color)} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className={clsx(
                                  'text-sm font-medium truncate',
                                  notification.read ? 'text-gray-700' : 'text-gray-900'
                                )}>
                                  {notification.title}
                                </h5>
                                <p className={clsx(
                                  'text-sm mt-1',
                                  notification.read ? 'text-gray-500' : 'text-gray-600'
                                )}>
                                  {notification.message}
                                </p>
                                
                                {/* Metadata */}
                                {notification.metadata && (
                                  <div className="flex items-center gap-2 mt-2">
                                    {notification.metadata.points && (
                                      <Badge variant="success" className="text-xs">
                                        +{notification.metadata.points} pts
                                      </Badge>
                                    )}
                                    {notification.metadata.icon && (
                                      <span className="text-lg">
                                        {notification.metadata.icon}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 ml-2">
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                
                                <Button
                                  variant="ghost"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteNotification(notification.id)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 h-auto"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Unread Indicator */}
                          {!notification.read && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-8">
                <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'You\\'re all caught up!' 
                    : `No ${filter} notifications found.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
      
      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Notification Settings"
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Notification Preferences</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Sound notifications</span>
                  <p className="text-xs text-gray-500">Play sound when new notifications arrive</p>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={onToggleSound}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Achievement notifications</span>
                  <p className="text-xs text-gray-500">Get notified when you unlock achievements</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Points notifications</span>
                  <p className="text-xs text-gray-500">Get notified when you earn points</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Streak reminders</span>
                  <p className="text-xs text-gray-500">Remind me to maintain my check-in streak</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}