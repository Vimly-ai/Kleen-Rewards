import { useState } from 'react'
import { Button } from '../ui/Button'
import { Heart, Plus, Check } from 'lucide-react'
import { clsx } from 'clsx'

interface WishlistButtonProps {
  isWishlisted: boolean
  onToggle: () => Promise<void> | void
  size?: 'small' | 'medium' | 'large'
  variant?: 'button' | 'icon'
  disabled?: boolean
  className?: string
}

export function WishlistButton({
  isWishlisted,
  onToggle,
  size = 'medium',
  variant = 'button',
  disabled = false,
  className
}: WishlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  
  const handleClick = async () => {
    if (disabled || isLoading) return
    
    setIsLoading(true)
    try {
      await onToggle()
      if (!isWishlisted) {
        setShowAnimation(true)
        setTimeout(() => setShowAnimation(false), 600)
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={clsx(
          'relative p-2 rounded-full transition-all duration-200',
          'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500',
          isWishlisted 
            ? 'text-red-500 bg-red-50' 
            : 'text-gray-400 hover:text-red-500',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <Heart 
          className={clsx(
            'transition-all duration-200',
            size === 'small' && 'w-4 h-4',
            size === 'medium' && 'w-5 h-5',
            size === 'large' && 'w-6 h-6',
            isWishlisted && 'fill-current scale-110',
            showAnimation && 'animate-pulse'
          )} 
        />
        
        {/* Animation overlay */}
        {showAnimation && (
          <div className=\"absolute inset-0 flex items-center justify-center\">
            <div className=\"w-8 h-8 bg-red-500 rounded-full animate-ping opacity-75\" />
          </div>
        )}
      </button>
    )
  }
  
  return (
    <Button
      variant={isWishlisted ? 'primary' : 'outline'}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      isLoading={isLoading}
      className={clsx(
        'relative overflow-hidden transition-all duration-200',
        isWishlisted && 'bg-red-500 hover:bg-red-600 border-red-500',
        showAnimation && 'animate-pulse',
        className
      )}
    >
      <div className=\"flex items-center gap-2\">
        {isWishlisted ? (
          <>
            <Check className=\"w-4 h-4\" />
            <span>Wishlisted</span>
          </>
        ) : (
          <>
            <Plus className=\"w-4 h-4\" />
            <span>Add to Wishlist</span>
          </>
        )}
      </div>
      
      {/* Success animation */}
      {showAnimation && (
        <div className=\"absolute inset-0 bg-green-500 flex items-center justify-center animate-pulse\">
          <Check className=\"w-4 h-4 text-white\" />
        </div>
      )}
    </Button>
  )
}