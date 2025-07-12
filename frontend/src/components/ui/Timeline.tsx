import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: Date
  icon?: ReactNode
  type?: 'default' | 'success' | 'warning' | 'error' | 'info'
  actions?: ReactNode
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
  compact?: boolean
}

const typeConfig = {
  default: {
    dot: 'bg-gray-400',
    line: 'bg-gray-200'
  },
  success: {
    dot: 'bg-green-500',
    line: 'bg-green-200'
  },
  warning: {
    dot: 'bg-yellow-500',
    line: 'bg-yellow-200'
  },
  error: {
    dot: 'bg-red-500',
    line: 'bg-red-200'
  },
  info: {
    dot: 'bg-blue-500',
    line: 'bg-blue-200'
  }
}

export function Timeline({ items, className, compact = false }: TimelineProps) {
  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={clsx('relative', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const typeClasses = typeConfig[item.type || 'default']

        return (
          <div key={item.id} className="relative flex items-start space-x-3">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-4 top-8 w-0.5 h-full">
                <div className={clsx('w-full h-full', typeClasses.line)} />
              </div>
            )}

            {/* Timeline dot */}
            <div className="relative flex items-center justify-center">
              <div className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center',
                typeClasses.dot
              )}>
                {item.icon ? (
                  <div className="text-white text-sm">
                    {item.icon}
                  </div>
                ) : (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className={clsx(
              'flex-1 min-w-0',
              compact ? 'pb-4' : 'pb-6'
            )}>
              <div className="flex items-center justify-between">
                <h4 className={clsx(
                  'font-medium text-gray-900',
                  compact ? 'text-sm' : 'text-base'
                )}>
                  {item.title}
                </h4>
                <time className={clsx(
                  'text-gray-500 flex-shrink-0',
                  compact ? 'text-xs' : 'text-sm'
                )}>
                  {formatTimestamp(item.timestamp)}
                </time>
              </div>

              {item.description && (
                <p className={clsx(
                  'text-gray-600 mt-1',
                  compact ? 'text-xs' : 'text-sm'
                )}>
                  {item.description}
                </p>
              )}

              {item.actions && (
                <div className="mt-2">
                  {item.actions}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}