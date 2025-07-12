import { useState } from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ProgressRing } from '../ui/ProgressRing'
import { Tooltip } from '../ui/Tooltip'
import { 
  Trophy, 
  Star, 
  Share2, 
  Lock, 
  CheckCircle, 
  Eye,
  Sparkles,
  Calendar,
  Target
} from 'lucide-react'
import { clsx } from 'clsx'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'attendance' | 'points' | 'streak' | 'social' | 'special'
  criteria: {
    type: 'check_ins' | 'points' | 'streak' | 'referrals' | 'custom'
    target: number
    period?: 'daily' | 'weekly' | 'monthly' | 'all_time'
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  unlocked: boolean
  unlockedAt?: string
  isSecret?: boolean
  progress?: {
    current: number
    target: number
    percentage: number
  }
}

interface AchievementCardProps {
  achievement: Achievement
  onShare?: (achievement: Achievement) => void
  onViewDetails?: (achievement: Achievement) => void
  className?: string
  size?: 'small' | 'medium' | 'large'
  showProgress?: boolean
  interactive?: boolean
}

const RARITY_CONFIG = {
  common: {
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    gradient: 'from-gray-50 to-gray-100',
    label: 'Common',
    glow: 'shadow-gray-200'
  },
  rare: {
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    gradient: 'from-blue-50 to-blue-100',
    label: 'Rare',
    glow: 'shadow-blue-200'
  },
  epic: {
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-200',
    gradient: 'from-purple-50 to-purple-100',
    label: 'Epic',
    glow: 'shadow-purple-200'
  },
  legendary: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
    gradient: 'from-yellow-50 to-yellow-100',
    label: 'Legendary',
    glow: 'shadow-yellow-200'
  }
}

const CATEGORY_CONFIG = {
  attendance: { icon: Calendar, color: 'text-green-600' },
  points: { icon: Star, color: 'text-blue-600' },
  streak: { icon: Trophy, color: 'text-orange-600' },
  social: { icon: Share2, color: 'text-purple-600' },
  special: { icon: Sparkles, color: 'text-pink-600' }
}

export function AchievementCard({
  achievement,
  onShare,
  onViewDetails,
  className,
  size = 'medium',
  showProgress = true,
  interactive = true
}: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false)
  
  const rarityConfig = RARITY_CONFIG[achievement.rarity]
  const CategoryIcon = CATEGORY_CONFIG[achievement.category].icon
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return date.toLocaleDateString()
  }
  
  const handleShare = () => {
    if (onShare) {
      onShare(achievement)
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          title: `I unlocked ${achievement.name}!`,
          text: achievement.description,
          url: window.location.href
        })
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(
          `I just unlocked the "${achievement.name}" achievement! ${achievement.description}`
        )
      }
    }
  }
  
  const cardSizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }
  
  const iconSizeClasses = {
    small: 'text-3xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  }

  return (
    <Card
      className={clsx(
        'relative overflow-hidden transition-all duration-300',
        interactive && 'cursor-pointer hover:shadow-lg transform hover:-translate-y-1',
        achievement.unlocked
          ? clsx(
              'bg-gradient-to-br',
              rarityConfig.gradient,
              rarityConfig.border,
              isHovered && rarityConfig.glow + ' shadow-lg'
            )
          : 'bg-gray-50 border-gray-200 opacity-75',
        achievement.isSecret && !achievement.unlocked && 'bg-gray-900 text-white',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => interactive && onViewDetails?.(achievement)}
    >
      {/* Glow effect for legendary achievements */}
      {achievement.rarity === 'legendary' && achievement.unlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 opacity-20 animate-pulse" />
      )}
      
      <div className={cardSizeClasses[size]}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Category and Rarity */}
          <div className="flex items-center gap-2">
            <div className={clsx(
              'p-2 rounded-lg',
              achievement.unlocked ? rarityConfig.bg : 'bg-gray-200'
            )}>
              <CategoryIcon className={clsx(
                'w-4 h-4',
                achievement.unlocked 
                  ? CATEGORY_CONFIG[achievement.category].color 
                  : 'text-gray-500'
              )} />
            </div>
            
            <Badge 
              className={clsx(
                'text-xs',
                achievement.unlocked 
                  ? clsx(rarityConfig.bg, rarityConfig.color)
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {rarityConfig.label}
            </Badge>
          </div>
          
          {/* Actions */}
          {achievement.unlocked && (
            <div className="flex items-center gap-1">
              {onShare && (
                <Tooltip content="Share achievement">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare()
                    }}
                    className="p-1 h-auto"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </Tooltip>
              )}
              
              <div className={clsx(
                'p-1 rounded-full',
                'bg-green-100 text-green-600'
              )}>
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
          )}
          
          {!achievement.unlocked && achievement.isSecret && (
            <div className="p-1 rounded-full bg-gray-700 text-gray-300">
              <Lock className="w-4 h-4" />
            </div>
          )}
        </div>
        
        {/* Icon */}
        <div className="text-center mb-4">
          <div className={clsx(
            iconSizeClasses[size],
            !achievement.unlocked && 'opacity-50 grayscale',
            achievement.isSecret && !achievement.unlocked && 'blur-sm'
          )}>
            {achievement.isSecret && !achievement.unlocked ? '❓' : achievement.icon}
          </div>
        </div>
        
        {/* Content */}
        <div className="text-center space-y-2">
          <h3 className={clsx(
            'font-bold',
            size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg',
            achievement.unlocked ? 'text-gray-900' : 'text-gray-600',
            achievement.isSecret && !achievement.unlocked && 'text-gray-300'
          )}>
            {achievement.isSecret && !achievement.unlocked ? 'Secret Achievement' : achievement.name}
          </h3>
          
          <p className={clsx(
            'text-sm',
            achievement.unlocked ? 'text-gray-600' : 'text-gray-500',
            achievement.isSecret && !achievement.unlocked && 'text-gray-400'
          )}>
            {achievement.isSecret && !achievement.unlocked 
              ? 'Complete special challenges to unlock this achievement' 
              : achievement.description}
          </p>
          
          {/* Points */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <Star className={clsx(
              'w-4 h-4',
              achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'
            )} />
            <span className={clsx(
              'font-medium',
              achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
            )}>
              {achievement.points} points
            </span>
          </div>
        </div>
        
        {/* Progress */}
        {showProgress && achievement.progress && !achievement.unlocked && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Progress</span>
              <span>
                {achievement.progress.current.toLocaleString()} / {achievement.progress.target.toLocaleString()}
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(achievement.progress.percentage, 100)}%` }}
                />
              </div>
              
              {achievement.progress.percentage >= 90 && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse flex items-center justify-center">
                    <Sparkles className="w-2 h-2 text-yellow-700" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center text-xs text-gray-500">
              {Math.round(achievement.progress.percentage)}% complete
            </div>
          </div>
        )}
        
        {/* Unlock Date */}
        {achievement.unlocked && achievement.unlockedAt && (
          <div className="mt-4 text-center text-xs text-gray-500">
            Unlocked {formatTimeAgo(achievement.unlockedAt)}
          </div>
        )}
        
        {/* View Details Button */}
        {interactive && onViewDetails && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onViewDetails(achievement)
              }}
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        )}
      </div>
      
      {/* Unlock Animation Overlay */}
      {showUnlockAnimation && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 animate-pulse opacity-80 flex items-center justify-center">
          <div className="text-white text-center">
            <Trophy className="w-12 h-12 mx-auto mb-2" />
            <div className="font-bold text-lg">UNLOCKED!</div>
          </div>
        </div>
      )}
    </Card>
  )
}