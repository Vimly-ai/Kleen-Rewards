import { ReactNode } from 'react'
import { Card } from '../../../components/ui/Card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { clsx } from 'clsx'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'stable'
  }
  icon?: ReactNode
  iconColor?: string
  className?: string
  onClick?: () => void
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconColor = 'bg-primary-100 text-primary-600',
  className,
  onClick
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null
    
    const icons = {
      up: <TrendingUp className="w-4 h-4" />,
      down: <TrendingDown className="w-4 h-4" />,
      stable: <Minus className="w-4 h-4" />
    }
    
    return icons[trend.direction]
  }
  
  const getTrendColor = () => {
    if (!trend) return ''
    
    const colors = {
      up: 'text-green-600',
      down: 'text-red-600',
      stable: 'text-gray-600'
    }
    
    return colors[trend.direction]
  }
  
  return (
    <Card 
      className={clsx(
        'p-6 transition-all',
        onClick && 'cursor-pointer hover:shadow-lg',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          
          {trend && (
            <div className={clsx('flex items-center gap-1 mt-2', getTrendColor())}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500">
                vs last period
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={clsx(
            'h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0',
            iconColor
          )}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}