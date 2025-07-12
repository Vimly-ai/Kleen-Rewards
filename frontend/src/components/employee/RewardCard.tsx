import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Tooltip } from '../ui/Tooltip'
import { 
  Heart, 
  Star, 
  Clock, 
  Gift, 
  ExternalLink, 
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { clsx } from 'clsx'

interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
  category: string
  image?: string
  availability: 'available' | 'limited' | 'sold_out'
  popularity?: number
  expiresAt?: Date
  vendor?: string
  tags?: string[]
  discount?: number
  originalPrice?: number
  isWishlisted?: boolean
}

interface RewardCardProps {
  reward: Reward
  userPoints: number
  onRedeem: (reward: Reward) => void
  onWishlist: (reward: Reward) => void
  onViewDetails: (reward: Reward) => void
  className?: string
  compact?: boolean
}

const AVAILABILITY_CONFIG = {
  available: {
    badge: { variant: 'success' as const, label: 'Available' },
    canRedeem: true
  },
  limited: {
    badge: { variant: 'warning' as const, label: 'Limited Time' },
    canRedeem: true
  },
  sold_out: {
    badge: { variant: 'error' as const, label: 'Sold Out' },
    canRedeem: false
  }
}

export function RewardCard({
  reward,
  userPoints,
  onRedeem,
  onWishlist,
  onViewDetails,
  className,
  compact = false
}: RewardCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const canAfford = userPoints >= reward.pointsCost
  const availabilityConfig = AVAILABILITY_CONFIG[reward.availability]
  const canRedeem = availabilityConfig.canRedeem && canAfford
  
  const getPopularityStars = (popularity: number = 0) => {
    const stars = Math.round(popularity * 5)
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={clsx(
          'w-3 h-3',
          i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
        )}
      />
    ))
  }
  
  const formatTimeLeft = (expiresAt: Date) => {
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d left`
    if (hours > 0) return `${hours}h left`
    return 'Expires soon'
  }

  return (
    <Card 
      className={clsx(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-lg',
        reward.availability === 'sold_out' && 'opacity-75',
        className
      )}
    >
      {/* Image */}
      <div className={clsx(
        'relative overflow-hidden bg-gray-100',
        compact ? 'h-32' : 'h-48'
      )}>
        {reward.image && !imageError ? (
          <img
            src={reward.image}
            alt={reward.name}
            className={clsx(
              'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
              !imageLoaded && 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Gift className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge 
            variant={availabilityConfig.badge.variant}
            className="text-xs"
          >
            {availabilityConfig.badge.label}
          </Badge>
          
          {reward.discount && (
            <Badge variant="error" className="text-xs">
              {reward.discount}% OFF
            </Badge>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onWishlist(reward)
          }}
          className={clsx(
            'absolute top-2 right-2 p-2 rounded-full transition-all',
            'bg-white/80 hover:bg-white shadow-sm',
            reward.isWishlisted && 'text-red-500'
          )}
        >
          <Heart 
            className={clsx(
              'w-4 h-4',
              reward.isWishlisted && 'fill-current'
            )} 
          />
        </button>
        
        {/* Time Remaining */}
        {reward.expiresAt && reward.availability === 'limited' && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="warning" className="text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeLeft(reward.expiresAt)}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={clsx(
              'font-semibold text-gray-900 line-clamp-2',
              compact ? 'text-sm' : 'text-base'
            )}>
              {reward.name}
            </h3>
            
            {reward.popularity && (
              <Tooltip content={`${(reward.popularity * 100).toFixed(0)}% popularity`}>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {getPopularityStars(reward.popularity)}
                </div>
              </Tooltip>
            )}
          </div>
          
          <p className={clsx(
            'text-gray-600 line-clamp-2',
            compact ? 'text-xs' : 'text-sm'
          )}>
            {reward.description}
          </p>
          
          {reward.vendor && (
            <p className="text-xs text-gray-500">
              by {reward.vendor}
            </p>
          )}
        </div>
        
        {/* Tags */}
        {reward.tags && reward.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {reward.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {reward.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{reward.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {/* Price and Actions */}
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className={clsx(
                'font-bold text-primary-600',
                compact ? 'text-lg' : 'text-xl'
              )}>
                {reward.pointsCost.toLocaleString()} pts
              </div>
              {reward.originalPrice && reward.discount && (
                <div className="text-xs text-gray-500 line-through">
                  ${reward.originalPrice}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {canAfford ? (
                <>
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-green-600">Can afford</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-orange-500" />
                  <span className="text-orange-600">
                    Need {(reward.pointsCost - userPoints).toLocaleString()} more
                  </span>
                </>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className={clsx(
            'flex gap-2',
            compact ? 'flex-col' : 'flex-row'
          )}>
            <Button
              onClick={() => onRedeem(reward)}
              disabled={!canRedeem}
              className="flex-1"
              size={compact ? 'small' : 'medium'}
            >
              {reward.availability === 'sold_out' ? 'Sold Out' : 'Redeem'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onViewDetails(reward)}
              className={compact ? 'w-full' : 'px-3'}
              size={compact ? 'small' : 'medium'}
            >
              {compact ? (
                'View Details'
              ) : (
                <>
                  <Info className="w-4 h-4" />
                  <span className="sr-only">View Details</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}