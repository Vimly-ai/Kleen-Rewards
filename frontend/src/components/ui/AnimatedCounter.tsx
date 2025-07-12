import { useEffect, useState } from 'react'
import { clsx } from 'clsx'

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  format?: (value: number) => string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base', 
  lg: 'text-xl',
  xl: 'text-3xl'
}

export function AnimatedCounter({
  value,
  duration = 1000,
  className,
  prefix = '',
  suffix = '',
  format = (val) => val.toLocaleString(),
  size = 'md'
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    let startValue = displayValue

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp
        startValue = displayValue
      }

      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (value - startValue) * easeOutQuart

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span className={clsx('font-mono font-bold tabular-nums', sizeClasses[size], className)}>
      {prefix}{format(Math.floor(displayValue))}{suffix}
    </span>
  )
}