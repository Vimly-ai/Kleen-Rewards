import { clsx } from 'clsx'

interface ProgressRingProps {
  progress: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  children?: React.ReactNode
  color?: 'primary' | 'success' | 'warning' | 'error'
  showPercentage?: boolean
  thickness?: number
}

const sizeConfig = {
  sm: { size: 60, strokeWidth: 4, fontSize: 'text-xs' },
  md: { size: 80, strokeWidth: 6, fontSize: 'text-sm' },
  lg: { size:120, strokeWidth: 8, fontSize: 'text-base' },
  xl: { size: 160, strokeWidth: 10, fontSize: 'text-lg' }
}

const colorConfig = {
  primary: 'text-primary-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600'
}

export function ProgressRing({
  progress,
  size = 'md',
  className,
  children,
  color = 'primary',
  showPercentage = true,
  thickness
}: ProgressRingProps) {
  const config = sizeConfig[size]
  const strokeWidth = thickness || config.strokeWidth
  const radius = (config.size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg
        width={config.size}
        height={config.size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={clsx(
            colorConfig[color],
            'transition-all duration-300 ease-in-out'
          )}
        />
      </svg>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          showPercentage && (
            <span className={clsx('font-semibold', config.fontSize, colorConfig[color])}>
              {Math.round(progress)}%
            </span>
          )
        )}
      </div>
    </div>
  )
}