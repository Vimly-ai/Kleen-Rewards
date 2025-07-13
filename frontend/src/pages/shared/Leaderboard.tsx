import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Card } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { isDemoMode, generateLeaderboard } from '../../services/demoService'

interface LeaderboardEntry {
  id: string
  name: string
  avatar?: string
  totalPoints: number
  weeklyPoints: number
  monthlyPoints: number
  currentStreak: number
  rank: number
  department?: string
}

type LeaderboardPeriod = 'weekly' | 'monthly' | 'allTime'

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>('weekly')

  const { data: leaderboard, isLoading, error } = useQuery({
    queryKey: ['leaderboard', selectedPeriod],
    queryFn: async () => {
      // Check if we're in demo mode
      if (isDemoMode()) {
        const demoLeaderboard = generateLeaderboard()
        
        // Map demo data to expected format
        return demoLeaderboard.map((entry, index) => ({
          id: `user-${index + 1}`,
          name: entry.name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`,
          totalPoints: entry.points,
          weeklyPoints: Math.floor(entry.points * 0.15), // Estimate weekly as 15% of total
          monthlyPoints: Math.floor(entry.points * 0.35), // Estimate monthly as 35% of total
          currentStreak: entry.streak,
          rank: entry.rank,
          department: entry.department
        }))
      }
      
      // TODO: Replace with actual API call for real data
      const mockData: LeaderboardEntry[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          totalPoints: 2850,
          weeklyPoints: 480,
          monthlyPoints: 1920,
          currentStreak: 15,
          rank: 1,
          department: 'Engineering'
        },
        {
          id: '2',
          name: 'Mike Chen',
          totalPoints: 2720,
          weeklyPoints: 450,
          monthlyPoints: 1800,
          currentStreak: 12,
          rank: 2,
          department: 'Design'
        },
        {
          id: '3',
          name: 'Emily Davis',
          totalPoints: 2580,
          weeklyPoints: 420,
          monthlyPoints: 1680,
          currentStreak: 8,
          rank: 3,
          department: 'Marketing'
        }
      ]
      
      return mockData
    }
  })

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  const getPointsForPeriod = (entry: LeaderboardEntry) => {
    switch (selectedPeriod) {
      case 'weekly':
        return entry.weeklyPoints
      case 'monthly':
        return entry.monthlyPoints
      case 'allTime':
        return entry.totalPoints
      default:
        return entry.weeklyPoints
    }
  }

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading leaderboard..." />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load leaderboard</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary-600" />
          Leaderboard
        </h1>
        <p className="text-gray-600">
          See how you rank against your colleagues
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1 inline-flex">
          {([
            { key: 'weekly', label: 'This Week' },
            { key: 'monthly', label: 'This Month' },
            { key: 'allTime', label: 'All Time' }
          ] as const).map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedPeriod === period.key
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {leaderboard && leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Second Place */}
          <div className="text-center order-1">
            <Card className="p-6 bg-gradient-to-b from-gray-50 to-white">
              <div className="space-y-3">
                {getRankIcon(2)}
                <Avatar 
                  src={leaderboard[1]?.avatar} 
                  alt={leaderboard[1]?.name}
                  size="large"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{leaderboard[1]?.name}</h3>
                  <p className="text-sm text-gray-600">{leaderboard[1]?.department}</p>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-primary-600">
                      {getPointsForPeriod(leaderboard[1])}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* First Place */}
          <div className="text-center order-2">
            <Card className="p-6 bg-gradient-to-b from-yellow-50 to-white border-yellow-200 transform scale-105">
              <div className="space-y-3">
                {getRankIcon(1)}
                <Avatar 
                  src={leaderboard[0]?.avatar} 
                  alt={leaderboard[0]?.name}
                  size="large"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{leaderboard[0]?.name}</h3>
                  <p className="text-sm text-gray-600">{leaderboard[0]?.department}</p>
                  <div className="mt-2">
                    <div className="text-3xl font-bold text-yellow-600">
                      {getPointsForPeriod(leaderboard[0])}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">
                  🔥 {leaderboard[0]?.currentStreak} day streak
                </Badge>
              </div>
            </Card>
          </div>

          {/* Third Place */}
          <div className="text-center order-3">
            <Card className="p-6 bg-gradient-to-b from-amber-50 to-white">
              <div className="space-y-3">
                {getRankIcon(3)}
                <Avatar 
                  src={leaderboard[2]?.avatar} 
                  alt={leaderboard[2]?.name}
                  size="large"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{leaderboard[2]?.name}</h3>
                  <p className="text-sm text-gray-600">{leaderboard[2]?.department}</p>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-primary-600">
                      {getPointsForPeriod(leaderboard[2])}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Complete Rankings
          </h2>
          <div className="space-y-3">
            {leaderboard?.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getRankIcon(entry.rank)}
                  <Avatar 
                    src={entry.avatar} 
                    alt={entry.name}
                    size="medium"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{entry.name}</h3>
                    <p className="text-sm text-gray-600">{entry.department}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">
                    {getPointsForPeriod(entry)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {entry.currentStreak} day streak
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}