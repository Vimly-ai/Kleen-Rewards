import { ReactNode, useState } from 'react'
import { clsx } from 'clsx'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { ChevronDown, ChevronUp, MoreHorizontal, RefreshCw } from 'lucide-react'

interface DashboardWidgetProps {
  title: string
  children: ReactNode
  subtitle?: string
  icon?: ReactNode
  actions?: ReactNode
  collapsible?: boolean
  defaultCollapsed?: boolean
  refreshable?: boolean
  onRefresh?: () => void
  loading?: boolean
  className?: string
  contentClassName?: string
  headerClassName?: string
}

export function DashboardWidget({
  title,
  children,
  subtitle,
  icon,
  actions,
  collapsible = false,
  defaultCollapsed = false,
  refreshable = false,
  onRefresh,
  loading = false,
  className,
  contentClassName,
  headerClassName
}: DashboardWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <Card className={clsx('overflow-hidden', className)}>
      {/* Header */}
      <div className={clsx(
        'flex items-center justify-between p-4 border-b border-gray-100',
        headerClassName
      )}>
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {icon && (
            <div className="flex-shrink-0 p-2 bg-primary-50 rounded-lg">
              <div className="text-primary-600">
                {icon}
              </div>
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {title}
              </h3>
              {loading && (
                <div className="animate-spin">
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-600 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {refreshable && onRefresh && (
            <Button
              variant="ghost"
              size="small"
              onClick={onRefresh}
              disabled={loading}
              className="p-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
          
          {actions}
          
          {collapsible && (
            <Button
              variant="ghost"
              size="small"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2"
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Content */}
      {!isCollapsed && (
        <div className={clsx('p-4', contentClassName)}>
          {children}
        </div>
      )}
    </Card>
  )
}