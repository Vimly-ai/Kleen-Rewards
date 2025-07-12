import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { Card } from './Card'
import { AnimatedCounter } from './AnimatedCounter'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  previousValue?: number
  icon?: ReactNode
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral'
  format?: (value: number) => string
  subtitle?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    isPositive?: boolean
  }
  loading?: boolean
  onClick?: () => void
  className?: string
}

const colorConfig = {
  primary: {
    bg: 'bg-primary-50',
    text: 'text-primary-700',
    icon: 'text-primary-600',
    border: 'border-primary-200'
  },
  success: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: 'text-green-600',
    border: 'border-green-200'
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: 'text-yellow-600',
    border: 'border-yellow-200'
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: 'text-red-600',
    border: 'border-red-200'
  },
  neutral: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    icon: 'text-gray-600',
    border: 'border-gray-200'
  }
}

export function StatCard({
  title,
  value,
  previousValue,
  icon,
  color = 'neutral',
  format = (val) => val.toLocaleString(),
  subtitle,
  trend,
  loading = false,
  onClick,
  className
}: StatCardProps) {
  const colorClasses = colorConfig[color]
  
  // Calculate trend if not provided but previousValue exists
  const calculatedTrend = trend || (previousValue !== undefined ? {
    value: ((value - previousValue) / previousValue) * 100,
    direction: value > previousValue ? 'up' : value < previousValue ? 'down' : 'neutral',
    isPositive: value >= previousValue
  } : undefined)

  const TrendIcon = calculatedTrend?.direction === 'up' ? TrendingUp : 
                   calculatedTrend?.direction === 'down' ? TrendingDown : Minus

  return (
    <Card
      className={clsx(
        'relative overflow-hidden transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-lg',
        colorClasses.border,
        className
      )}
      onClick={onClick}
    >
      <div className={clsx('absolute inset-0 opacity-20', colorClasses.bg)} />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 truncate">
              {title}
            </p>
            
            <div className="mt-2">
              {loading ? (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              ) : (
                <AnimatedCounter
                  value={value}
                  format={format}
                  size="xl"
                  className={colorClasses.text}
                />
              )}
            </div>
            
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">
                {subtitle}
              </p>
            )}
            
            {calculatedTrend && (
              <div className="flex items-center mt-2">
                <TrendIcon className={clsx(
                  'w-4 h-4 mr-1',
                  calculatedTrend.isPositive !== false 
                    ? 'text-green-500' 
                    : 'text-red-500'
                )} />
                <span className={clsx(
                  'text-sm font-medium',
                  calculatedTrend.isPositive !== false 
                    ? 'text-green-600' 
                    : 'text-red-600'
                )}>
                  {Math.abs(calculatedTrend.value).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  vs last period
                </span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={clsx(
              'flex-shrink-0 p-3 rounded-lg',
              colorClasses.bg,
              colorClasses.icon
            )}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}