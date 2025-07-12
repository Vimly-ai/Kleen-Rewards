import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import { Avatar } from '../ui/Avatar'
import { 
  User, 
  Camera, 
  Upload, 
  Shuffle, 
  Check,
  Star,
  Crown,
  Sparkles
} from 'lucide-react'
import { clsx } from 'clsx'

interface AvatarOption {
  id: string
  type: 'default' | 'premium' | 'achievement' | 'custom'
  src?: string
  emoji?: string
  name: string
  description?: string
  unlocked: boolean
  requiresPoints?: number
  requiresAchievement?: string
}

interface AvatarSelectorProps {
  currentAvatar: string
  onAvatarChange: (avatarId: string) => void
  userPoints: number
  unlockedAchievements: string[]
  className?: string
}

const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'default-1',
    type: 'default',
    emoji: '👤',
    name: 'Default Avatar',
    unlocked: true
  },
  {
    id: 'default-2', 
    type: 'default',
    emoji: '😊',
    name: 'Happy Face',
    unlocked: true
  },
  {
    id: 'default-3',
    type: 'default', 
    emoji: '🤓',
    name: 'Nerd Face',
    unlocked: true
  },
  {
    id: 'default-4',
    type: 'default',
    emoji: '😎',
    name: 'Cool Face',
    unlocked: true
  },
  {
    id: 'premium-1',
    type: 'premium',
    emoji: '🚀',
    name: 'Rocket Enthusiast',
    description: 'For the ambitious ones',
    unlocked: false,
    requiresPoints: 500
  },
  {
    id: 'premium-2',
    type: 'premium',
    emoji: '🏆',
    name: 'Trophy Collector',
    description: 'Show off your achievements',
    unlocked: false,
    requiresPoints: 1000
  },
  {
    id: 'premium-3',
    type: 'premium',
    emoji: '🎯',
    name: 'Goal Getter',
    description: 'Always hitting targets',
    unlocked: false,
    requiresPoints: 750
  },
  {
    id: 'achievement-1',
    type: 'achievement',
    emoji: '👑',
    name: 'The Crown',
    description: 'Unlock with "Streak Master" achievement',
    unlocked: false,
    requiresAchievement: 'streak-master'
  },
  {
    id: 'achievement-2',
    type: 'achievement',
    emoji: '⭐',
    name: 'Rising Star',
    description: 'Unlock with "Point Collector" achievement',
    unlocked: false,
    requiresAchievement: 'point-collector'
  }
]

const TYPE_CONFIG = {
  default: {
    badge: { variant: 'secondary' as const, label: 'Default' },
    icon: User,
    color: 'text-gray-600'
  },
  premium: {
    badge: { variant: 'warning' as const, label: 'Premium' },
    icon: Star,
    color: 'text-yellow-600'
  },
  achievement: {
    badge: { variant: 'success' as const, label: 'Achievement' },
    icon: Crown,
    color: 'text-purple-600'
  },
  custom: {
    badge: { variant: 'primary' as const, label: 'Custom' },
    icon: Camera,
    color: 'text-blue-600'
  }
}

export function AvatarSelector({
  currentAvatar,
  onAvatarChange,
  userPoints,
  unlockedAchievements,
  className
}: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption | null>(null)
  
  // Update unlock status based on user data
  const avatarOptions = AVATAR_OPTIONS.map(avatar => {
    if (avatar.type === 'default') {
      return { ...avatar, unlocked: true }
    }
    if (avatar.type === 'premium' && avatar.requiresPoints) {
      return { ...avatar, unlocked: userPoints >= avatar.requiresPoints }
    }
    if (avatar.type === 'achievement' && avatar.requiresAchievement) {
      return { ...avatar, unlocked: unlockedAchievements.includes(avatar.requiresAchievement) }
    }
    return avatar
  })
  
  const categories = [
    { key: 'all', label: 'All Avatars', count: avatarOptions.length },
    { key: 'default', label: 'Default', count: avatarOptions.filter(a => a.type === 'default').length },
    { key: 'premium', label: 'Premium', count: avatarOptions.filter(a => a.type === 'premium').length },
    { key: 'achievement', label: 'Achievement', count: avatarOptions.filter(a => a.type === 'achievement').length }
  ]
  
  const filteredAvatars = selectedCategory === 'all' 
    ? avatarOptions 
    : avatarOptions.filter(avatar => avatar.type === selectedCategory)
  
  const currentAvatarOption = avatarOptions.find(a => a.id === currentAvatar)
  
  const handleAvatarSelect = (avatar: AvatarOption) => {
    if (!avatar.unlocked) {
      setSelectedAvatar(avatar)
      setShowUnlockModal(true)
      return
    }
    
    onAvatarChange(avatar.id)
    setIsOpen(false)
  }
  
  const handleUnlock = async () => {
    if (!selectedAvatar) return
    
    // In a real app, this would make an API call to purchase/unlock the avatar
    if (selectedAvatar.requiresPoints && userPoints >= selectedAvatar.requiresPoints) {
      // Deduct points and unlock avatar
      onAvatarChange(selectedAvatar.id)
      setShowUnlockModal(false)
      setIsOpen(false)
    }
  }
  
  const renderAvatar = (avatar: AvatarOption) => {
    if (avatar.emoji) {
      return (
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
          {avatar.emoji}
        </div>
      )
    }
    return <Avatar src={avatar.src} alt={avatar.name} size="md" />
  }

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Current Avatar Display */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {currentAvatarOption ? renderAvatar(currentAvatarOption) : (
            <Avatar src="" alt="Current Avatar" size="lg" />
          )}
          
          {currentAvatarOption?.type !== 'default' && (
            <div className="absolute -top-1 -right-1">
              <div className={clsx(
                'w-6 h-6 rounded-full flex items-center justify-center',
                TYPE_CONFIG[currentAvatarOption.type].color.replace('text-', 'bg-').replace('600', '100')
              )}>
                <div className={TYPE_CONFIG[currentAvatarOption.type].color}>
                  {(() => {
                    const Icon = TYPE_CONFIG[currentAvatarOption.type].icon;
                    return <Icon className="w-3 h-3" />;
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">
            {currentAvatarOption?.name || 'Default Avatar'}
          </h4>
          {currentAvatarOption?.description && (
            <p className="text-sm text-gray-600">
              {currentAvatarOption.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={TYPE_CONFIG[currentAvatarOption?.type || 'default'].badge.variant}>
              {TYPE_CONFIG[currentAvatarOption?.type || 'default'].badge.label}
            </Badge>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Change Avatar
        </Button>
      </div>
      
      {/* Avatar Selection Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Choose Your Avatar"
        size="lg"
      >
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedCategory === category.key
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </button>
            ))}
          </div>
          
          {/* Avatar Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {filteredAvatars.map(avatar => {
              const TypeIcon = TYPE_CONFIG[avatar.type].icon
              const isSelected = avatar.id === currentAvatar
              
              return (
                <button
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar)}
                  className={clsx(
                    'relative p-3 rounded-lg border transition-all group',
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : avatar.unlocked
                      ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      : 'border-gray-200 bg-gray-100 opacity-75',
                    !avatar.unlocked && 'cursor-not-allowed'
                  )}
                  disabled={!avatar.unlocked && !avatar.requiresPoints}
                >
                  {/* Avatar */}
                  <div className={clsx(
                    'mb-2',
                    !avatar.unlocked && 'opacity-50 grayscale'
                  )}>
                    {renderAvatar(avatar)}
                  </div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-1 right-1">
                    <div className={clsx(
                      'w-5 h-5 rounded-full flex items-center justify-center text-xs',
                      TYPE_CONFIG[avatar.type].color.replace('text-', 'bg-').replace('600', '100')
                    )}>
                      <TypeIcon className={clsx('w-3 h-3', TYPE_CONFIG[avatar.type].color)} />
                    </div>
                  </div>
                  
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute -top-1 -left-1">
                      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Lock Indicator */}
                  {!avatar.unlocked && (
                    <div className="absolute inset-0 bg-gray-900/20 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🔒</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Name */}
                  <div className="text-xs text-center font-medium text-gray-900 truncate">
                    {avatar.name}
                  </div>
                  
                  {/* Requirements */}
                  {!avatar.unlocked && avatar.requiresPoints && (
                    <div className="text-xs text-center text-gray-600 mt-1">
                      {avatar.requiresPoints} pts
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          
          {/* Custom Upload Option */}
          <div className="border-t pt-4">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              disabled
            >
              <Upload className="w-4 h-4" />
              Upload Custom Avatar (Coming Soon)
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Unlock Confirmation Modal */}
      <Modal
        isOpen={showUnlockModal}
        onClose={() => {
          setShowUnlockModal(false)
          setSelectedAvatar(null)
        }}
        title="Unlock Avatar"
      >
        {selectedAvatar && (
          <div className="space-y-4">
            <div className="text-center">
              {renderAvatar(selectedAvatar)}
              <h3 className="text-lg font-medium text-gray-900 mt-3">
                {selectedAvatar.name}
              </h3>
              {selectedAvatar.description && (
                <p className="text-gray-600">
                  {selectedAvatar.description}
                </p>
              )}
            </div>
            
            {selectedAvatar.requiresPoints && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Cost:</span>
                  <span className="font-bold text-yellow-600">
                    {selectedAvatar.requiresPoints} points
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-700">Your Balance:</span>
                  <span className="font-medium">
                    {userPoints} points
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t">
                  <span className="text-gray-700">After Purchase:</span>
                  <span className={clsx(
                    'font-medium',
                    userPoints >= selectedAvatar.requiresPoints
                      ? 'text-green-600'
                      : 'text-red-600'
                  )}>
                    {userPoints - selectedAvatar.requiresPoints} points
                  </span>
                </div>
              </div>
            )}
            
            {selectedAvatar.requiresAchievement && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-purple-800 text-sm">
                  This avatar requires the "{selectedAvatar.requiresAchievement}" achievement.
                  Complete the required challenges to unlock it!
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowUnlockModal(false)
                  setSelectedAvatar(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              
              {selectedAvatar.requiresPoints && (
                <Button
                  onClick={handleUnlock}
                  disabled={userPoints < selectedAvatar.requiresPoints}
                  className="flex-1"
                >
                  {userPoints >= selectedAvatar.requiresPoints ? 'Unlock' : 'Insufficient Points'}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}