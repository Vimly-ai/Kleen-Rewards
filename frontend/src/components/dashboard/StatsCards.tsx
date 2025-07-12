import { Clock, Flame, Calendar, Star } from 'lucide-react'
import { User } from '../../services/supabase'

interface StatsCardsProps {
  user: User
}

export function StatsCards({ user }: StatsCardsProps) {
  const getNextRewardTier = (currentPoints: number) => {
    const tiers = [
      { threshold: 50, reward: 'Coffee Card' },
      { threshold: 100, reward: 'Lunch Voucher' },
      { threshold: 200, reward: 'Half Day Off' },
      { threshold: 500, reward: 'Full Day Off' },
      { threshold: 1000, reward: 'Company Swag Package' }
    ]

    for (const tier of tiers) {
      if (currentPoints < tier.threshold) {
        return {
          pointsNeeded: tier.threshold - currentPoints,
          reward: tier.reward,
          progress: (currentPoints / tier.threshold) * 100
        }
      }
    }

    return {
      pointsNeeded: 0,
      reward: 'Maximum Level Achieved!',
      progress: 100
    }
  }

  const nextTier = getNextRewardTier(user.points_balance)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Points Balance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Points Balance</dt>
              <dd className="text-lg font-medium text-gray-900">{user.points_balance}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Current Streak */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Flame className="h-8 w-8 text-orange-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Current Streak</dt>
              <dd className="text-lg font-medium text-gray-900">{user.current_streak} days</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Longest Streak */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Calendar className="h-8 w-8 text-green-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Longest Streak</dt>
              <dd className="text-lg font-medium text-gray-900">{user.longest_streak} days</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Next Reward */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Next Reward</dt>
              <dd className="text-sm font-medium text-gray-900 truncate">{nextTier.reward}</dd>
              <dd className="text-xs text-gray-500">
                {nextTier.pointsNeeded > 0 ? `${nextTier.pointsNeeded} points needed` : '🎉 Max level!'}
              </dd>
            </dl>
          </div>
        </div>
        {nextTier.pointsNeeded > 0 && (
          <div className="mt-3">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${nextTier.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}