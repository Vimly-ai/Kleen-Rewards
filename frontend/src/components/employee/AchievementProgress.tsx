import { ProgressRing } from '../ui/ProgressRing'
import { Badge } from '../ui/Badge'
import { Tooltip } from '../ui/Tooltip'
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react'
import { clsx } from 'clsx'

interface AchievementProgressProps {
  totalAchievements: number
  unlockedAchievements: number
  totalPoints: number
  recentUnlocks: Array<{
    id: string
    name: string
    icon: string
    rarity: string
    unlockedAt: string
  }>
  categoryProgress: Array<{
    category: string
    total: number
    unlocked: number
    icon: React.ComponentType<any>
    color: string
  }>
}

export function AchievementProgress({
  totalAchievements,
  unlockedAchievements,
  totalPoints,
  recentUnlocks,
  categoryProgress
}: AchievementProgressProps) {
  const completionPercentage = (unlockedAchievements / totalAchievements) * 100
  const nextMilestone = Math.ceil(unlockedAchievements / 10) * 10
  const progressToNextMilestone = ((unlockedAchievements % 10) / 10) * 100
  
  return (
    <div className=\"space-y-6\">
      {/* Overall Progress */}
      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6\">
        {/* Completion Ring */}
        <div className=\"text-center space-y-3\">
          <ProgressRing
            progress={completionPercentage}
            size=\"lg\"
            color=\"primary\"
            showPercentage={false}
          >
            <div className=\"text-center\">
              <div className=\"text-2xl font-bold text-primary-600\">
                {unlockedAchievements}
              </div>
              <div className=\"text-xs text-gray-500\">
                of {totalAchievements}
              </div>
            </div>
          </ProgressRing>
          <div>
            <h4 className=\"font-medium text-gray-900\">Achievements</h4>
            <p className=\"text-sm text-gray-600\">
              {Math.round(completionPercentage)}% complete
            </p>
          </div>
        </div>
        
        {/* Next Milestone */}
        <div className=\"text-center space-y-3\">
          <ProgressRing
            progress={progressToNextMilestone}
            size=\"lg\"
            color=\"warning\"
            showPercentage={false}
          >
            <div className=\"text-center\">
              <div className=\"text-2xl font-bold text-orange-600\">
                {nextMilestone}
              </div>
              <div className=\"text-xs text-gray-500\">
                next
              </div>
            </div>
          </ProgressRing>
          <div>
            <h4 className=\"font-medium text-gray-900\">Next Milestone</h4>
            <p className=\"text-sm text-gray-600\">
              {nextMilestone - unlockedAchievements} more to go
            </p>
          </div>
        </div>
        
        {/* Achievement Points */}
        <div className=\"text-center space-y-3\">
          <div className=\"w-24 h-24 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center\">
            <div className=\"text-center\">
              <Star className=\"w-8 h-8 text-yellow-600 mx-auto mb-1\" />
              <div className=\"text-lg font-bold text-yellow-700\">
                {totalPoints}
              </div>
            </div>
          </div>
          <div>
            <h4 className=\"font-medium text-gray-900\">Achievement Points</h4>
            <p className=\"text-sm text-gray-600\">
              Earned from unlocks
            </p>
          </div>
        </div>
      </div>
      
      {/* Category Progress */}
      <div>
        <h3 className=\"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2\">
          <Target className=\"w-5 h-5\" />
          Progress by Category
        </h3>
        
        <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4\">
          {categoryProgress.map((category) => {
            const percentage = (category.unlocked / category.total) * 100
            const Icon = category.icon
            
            return (
              <div
                key={category.category}
                className=\"bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow\"
              >
                <div className=\"flex items-center justify-between mb-3\">
                  <div className=\"flex items-center gap-2\">
                    <div className={clsx(
                      'p-2 rounded-lg',
                      category.color.replace('text-', 'bg-').replace('600', '100')
                    )}>
                      <Icon className={clsx('w-4 h-4', category.color)} />
                    </div>
                    <span className=\"font-medium text-gray-900 capitalize\">
                      {category.category}
                    </span>
                  </div>
                  
                  <Badge variant=\"secondary\" className=\"text-xs\">
                    {category.unlocked}/{category.total}
                  </Badge>
                </div>
                
                <div className=\"space-y-2\">
                  <div className=\"w-full bg-gray-200 rounded-full h-2\">
                    <div
                      className={clsx(
                        'h-2 rounded-full transition-all duration-500',
                        category.color.replace('text-', 'bg-')
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  <div className=\"flex justify-between text-xs text-gray-600\">
                    <span>{Math.round(percentage)}% complete</span>
                    <span>{category.total - category.unlocked} remaining</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Recent Unlocks */}
      {recentUnlocks.length > 0 && (
        <div>
          <h3 className=\"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2\">
            <Zap className=\"w-5 h-5\" />
            Recent Unlocks
          </h3>
          
          <div className=\"space-y-3\">
            {recentUnlocks.slice(0, 3).map((achievement) => {
              const timeAgo = (() => {
                const date = new Date(achievement.unlockedAt)
                const now = new Date()
                const diff = now.getTime() - date.getTime()
                const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                const hours = Math.floor(diff / (1000 * 60 * 60))
                
                if (days > 0) return `${days}d ago`
                if (hours > 0) return `${hours}h ago`
                return 'Just now'
              })()
              
              return (
                <div
                  key={achievement.id}
                  className=\"flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg\"
                >
                  <div className=\"text-2xl\">
                    {achievement.icon}
                  </div>
                  
                  <div className=\"flex-1\">
                    <div className=\"flex items-center gap-2\">
                      <h4 className=\"font-medium text-gray-900\">
                        {achievement.name}
                      </h4>
                      <Badge 
                        variant=\"success\"
                        className=\"text-xs\"
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className=\"text-sm text-green-700\">
                      Unlocked {timeAgo}
                    </p>
                  </div>
                  
                  <div className=\"text-green-600\">
                    <Trophy className=\"w-5 h-5\" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Achievement Tips */}
      <div className=\"bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6\">
        <h3 className=\"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2\">
          <TrendingUp className=\"w-5 h-5 text-blue-600\" />
          Tips to Unlock More Achievements
        </h3>
        
        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-sm\">
          <div className=\"space-y-2\">
            <div className=\"flex items-center gap-2\">
              <Calendar className=\"w-4 h-4 text-blue-600\" />
              <span className=\"font-medium text-gray-900\">Daily Consistency</span>
            </div>
            <ul className=\"space-y-1 text-gray-600 list-disc list-inside ml-6\">
              <li>Check in every day to build streaks</li>
              <li>Aim for early check-ins for bonus points</li>
              <li>Complete weekly and monthly challenges</li>
            </ul>
          </div>
          
          <div className=\"space-y-2\">
            <div className=\"flex items-center gap-2\">
              <Award className=\"w-4 h-4 text-blue-600\" />
              <span className=\"font-medium text-gray-900\">Special Activities</span>
            </div>
            <ul className=\"space-y-1 text-gray-600 list-disc list-inside ml-6\">
              <li>Participate in company events</li>
              <li>Refer colleagues to the platform</li>
              <li>Engage with team activities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}