import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  fullScreen?: boolean
  className?: string
}

export function LoadingSpinner({ 
  size = 'medium', 
  text, 
  fullScreen = false,
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  const containerClasses = clsx(
    'flex items-center justify-center',
    fullScreen && 'min-h-screen',
    !fullScreen && 'p-4',
    className
  )

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-3">
        <div 
          className={clsx(
            'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600',
            sizeClasses[size]
          )}
        />
        {text && (
          <p className="text-sm text-gray-600 text-center max-w-xs">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}