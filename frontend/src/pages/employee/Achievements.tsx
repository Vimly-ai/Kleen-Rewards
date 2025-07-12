import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCurrentUser, useUserStats } from '../../queries/userQueries'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { AchievementBadge } from '../../components/ui/AchievementBadge'
import { Trophy, Star, Target, Calendar, Zap, Users, Gift, TrendingUp } from 'lucide-react'
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
  progress?: {
    current: number
    target: number
    percentage: number
  }
}

const ACHIEVEMENT_CATEGORIES = [
  { key: 'all', label: 'All', icon: Trophy },
  { key: 'attendance', label: 'Attendance', icon: Calendar },
  { key: 'points', label: 'Points', icon: Star },
  { key: 'streak', label: 'Streaks', icon: Zap },
  { key: 'social', label: 'Social', icon: Users },
  { key: 'special', label: 'Special', icon: Gift }
]

const RARITY_CONFIG = {
  common: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Common' },
  rare: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Rare' },
  epic: { color: 'text-purple-600', bg: 'bg-purple-100', label: 'Epic' },
  legendary: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Legendary' }
}

export default function EmployeeAchievements() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false)

  const { data: user } = useCurrentUser()
  const { data: userStats } = useUserStats(user?.id || '')

  // Mock achievements data - in real app, this would come from API
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async (): Promise<Achievement[]> => {
      // Mock data - replace with actual API call
      const mockAchievements: Achievement[] = [
        {
          id: '1',
          name: 'Early Bird',
          description: 'Check in early 5 times',
          icon: '🌅',
          category: 'attendance',
          criteria: { type: 'check_ins', target: 5, period: 'all_time' },
          rarity: 'common',
          points: 50,
          unlocked: true,
          unlockedAt: '2024-01-15T08:00:00Z'
        },
        {
          id: '2',
          name: 'Point Collector',
          description: 'Earn 1000 total points',
          icon: '⭐',
          category: 'points',
          criteria: { type: 'points', target: 1000, period: 'all_time' },
          rarity: 'rare',
          points: 100,
          unlocked: userStats ? userStats.totalPoints >= 1000 : false,
          progress: userStats ? {
            current: userStats.totalPoints,
            target: 1000,
            percentage: Math.min((userStats.totalPoints / 1000) * 100, 100)
          } : undefined
        },
        {
          id: '3',
          name: 'Streak Master',
          description: 'Maintain a 30-day check-in streak',
          icon: '🔥',
          category: 'streak',
          criteria: { type: 'streak', target: 30 },
          rarity: 'epic',
          points: 200,
          unlocked: userStats ? userStats.currentStreak >= 30 : false,
          progress: userStats ? {
            current: userStats.currentStreak,
            target: 30,
            percentage: Math.min((userStats.currentStreak / 30) * 100, 100)
          } : undefined
        },
        {
          id: '4',
          name: 'Dedication Legend',
          description: 'Check in every day for 100 days',
          icon: '👑',
          category: 'streak',
          criteria: { type: 'streak', target: 100 },
          rarity: 'legendary',
          points: 500,
          unlocked: false,
          progress: userStats ? {
            current: userStats.longestStreak,
            target: 100,
            percentage: Math.min((userStats.longestStreak / 100) * 100, 100)
          } : undefined
        },
        {
          id: '5',
          name: 'Monthly Champion',
          description: 'Top 3 on monthly leaderboard',
          icon: '🏆',
          category: 'special',
          criteria: { type: 'custom', target: 1 },
          rarity: 'epic',
          points: 300,
          unlocked: false
        }
      ]
      
      return mockAchievements
    },
    enabled: !!user
  })

  const filteredAchievements = achievements?.filter(achievement => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
      return false
    }
    if (showOnlyUnlocked && !achievement.unlocked) {
      return false
    }
    return true
  }) || []

  const unlockedCount = achievements?.filter(a => a.unlocked).length || 0
  const totalCount = achievements?.length || 0
  const totalAchievementPoints = achievements?.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0) || 0

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading achievements..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Achievements
          </h1>
          <p className="text-gray-600 mt-2">
            Track your progress and unlock special rewards
          </p>
        </div>
        
        {/* Achievement Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">
              {unlockedCount}
            </div>
            <div className="text-sm text-gray-600">
              Unlocked ({totalCount} total)
            </div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {totalAchievementPoints}
            </div>
            <div className="text-sm text-gray-600">
              Achievement Points
            </div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
            <div className="text-sm text-gray-600">
              Completion Rate
            </div>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {ACHIEVEMENT_CATEGORIES.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={clsx(
                'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all',
                selectedCategory === category.key
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
              )}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showOnlyUnlocked}
              onChange={(e) => setShowOnlyUnlocked(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Show only unlocked
          </label>
        </div>
      </div>

      {/* Achievements Grid */}
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={clsx(
                'relative overflow-hidden transition-all hover:shadow-lg',
                achievement.unlocked
                  ? 'bg-gradient-to-br from-white to-primary-50 border-primary-200'
                  : 'bg-gray-50 border-gray-200'
              )}
            >
              <div className="p-6">
                {/* Rarity Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className={clsx(
                    'text-xs',
                    RARITY_CONFIG[achievement.rarity].bg,
                    RARITY_CONFIG[achievement.rarity].color
                  )}>
                    {RARITY_CONFIG[achievement.rarity].label}
                  </Badge>
                </div>

                {/* Icon and Status */}
                <div className="text-center mb-4">
                  <div className={clsx(
                    'text-4xl mb-2',
                    !achievement.unlocked && 'opacity-50 grayscale'
                  )}>
                    {achievement.icon}
                  </div>
                  {achievement.unlocked && (
                    <div className="text-green-600 text-xs font-medium flex items-center justify-center gap-1">
                      <Trophy className="w-3 h-3" />
                      UNLOCKED
                    </div>
                  )}
                </div>

                {/* Achievement Info */}
                <div className="text-center space-y-2">
                  <h3 className={clsx(
                    'font-semibold',
                    achievement.unlocked ? 'text-gray-900' : 'text-gray-600'
                  )}>
                    {achievement.name}
                  </h3>
                  <p className={clsx(
                    'text-sm',
                    achievement.unlocked ? 'text-gray-600' : 'text-gray-500'
                  )}>
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Star className="w-3 h-3" />
                    <span>{achievement.points} points</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {achievement.progress && !achievement.unlocked && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progress</span>
                      <span>
                        {achievement.progress.current.toLocaleString()} / {achievement.progress.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(achievement.progress.percentage, 100)}%` }}
                      />
                    </div>
                    <div className="text-center text-xs text-gray-500">
                      {Math.round(achievement.progress.percentage)}% complete
                    </div>
                  </div>
                )}

                {/* Unlock Date */}
                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="mt-4 text-center text-xs text-gray-500">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No achievements found
            </h3>
            <p className="text-gray-600">
              {showOnlyUnlocked 
                ? 'You haven\'t unlocked any achievements in this category yet.' 
                : 'No achievements available in this category.'}
            </p>
            {showOnlyUnlocked && (
              <button
                onClick={() => setShowOnlyUnlocked(false)}
                className="mt-4 text-primary-600 text-sm font-medium hover:text-primary-700"
              >
                Show all achievements
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Achievement Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false)
          setSelectedAchievement(null)
        }}
        title="Achievement Details"
        size="lg"
      >
        {selectedAchievement && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="text-6xl">
                {selectedAchievement.isSecret && !selectedAchievement.unlocked 
                  ? '❓' 
                  : selectedAchievement.icon}
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedAchievement.isSecret && !selectedAchievement.unlocked 
                    ? 'Secret Achievement' 
                    : selectedAchievement.name}
                </h3>
                <p className="text-gray-600 mt-2">
                  {selectedAchievement.isSecret && !selectedAchievement.unlocked
                    ? 'Complete special challenges to unlock this achievement'
                    : selectedAchievement.description}
                </p>
              </div>
              
              {selectedAchievement.unlocked && (
                <Badge variant="success" className="flex items-center gap-1 mx-auto w-fit">
                  <Trophy className="w-4 h-4" />
                  UNLOCKED
                </Badge>
              )}
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Rarity</div>
                <Badge className={clsx(
                  RARITY_CONFIG[selectedAchievement.rarity].bg,
                  RARITY_CONFIG[selectedAchievement.rarity].color
                )}>
                  {RARITY_CONFIG[selectedAchievement.rarity].label}
                </Badge>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Points</div>
                <div className="text-xl font-bold text-yellow-600">
                  {selectedAchievement.points}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Category</div>
                <div className="font-medium text-gray-900 capitalize">
                  {selectedAchievement.category}
                </div>
              </div>
              
              {selectedAchievement.unlocked && selectedAchievement.unlockedAt && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Unlocked</div>
                  <div className="font-medium text-gray-900">
                    {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
            
            {/* Progress */}
            {selectedAchievement.progress && !selectedAchievement.unlocked && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current</span>
                    <span>{selectedAchievement.progress.current.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target</span>
                    <span>{selectedAchievement.progress.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(selectedAchievement.progress.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {Math.round(selectedAchievement.progress.percentage)}% complete
                  </div>
                </div>
              </div>
            )}
            
            {/* Actions */}
            {selectedAchievement.unlocked && (
              <div className="flex gap-3">
                <Button
                  onClick={() => handleShare(selectedAchievement)}
                  className="flex-1 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Achievement
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}