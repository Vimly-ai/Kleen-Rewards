import { useUser } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import SupabaseService from '../services/supabase'
import { withErrorHandling } from '../utils/errorHandler'
import { StatsCards } from '../components/dashboard/StatsCards'
import { CheckInSection } from '../components/dashboard/CheckInSection'
import { RecentActivity } from '../components/dashboard/RecentActivity'
import type { CheckIn } from '../services/supabase'

export function DashboardPage() {
  const { user: clerkUser } = useUser()
  const { user: dbUser, loading } = useData()
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false)
  const [recentCheckIns, setRecentCheckIns] = useState<CheckIn[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (dbUser?.id) {
      loadDashboardData()
    }
  }, [dbUser])

  const loadDashboardData = async () => {
    if (!dbUser?.id) return
    
    setDataLoading(true)
    
    await withErrorHandling(async () => {
      // Load data in parallel for better performance
      const [todayCheckIn, checkIns] = await Promise.all([
        SupabaseService.getTodaysCheckIn(dbUser.id),
        SupabaseService.getUserCheckIns(dbUser.id, 5)
      ])
      
      setHasCheckedInToday(!!todayCheckIn)
      setRecentCheckIns(checkIns)
    }, {
      showToast: false,
      errorMessage: 'Failed to load dashboard data'
    })
    
    setDataLoading(false)
  }

  const handleCheckInSuccess = () => {
    // Refresh dashboard data after successful check-in
    loadDashboardData()
  }

  if (loading || dataLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-24" />
            ))}
          </div>
          <div className="bg-gray-200 rounded-lg h-48 mb-8" />
          <div className="bg-gray-200 rounded-lg h-64" />
        </div>
      </div>
    )
  }

  if (!dbUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Setting up your profile...
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare your dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {clerkUser?.firstName || dbUser.name}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Ready to make today count? Let's keep your streak going!
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards user={dbUser} />

      {/* Check-in Section */}
      <CheckInSection 
        hasCheckedInToday={hasCheckedInToday}
        onCheckInSuccess={handleCheckInSuccess}
      />

      {/* Recent Activity */}
      <RecentActivity checkIns={recentCheckIns} />
    </div>
  )
}