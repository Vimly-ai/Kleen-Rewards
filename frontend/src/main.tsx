import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, UserButton, useUser } from '@clerk/clerk-react'
import { DataProvider, useData } from './contexts/DataContext'
import SupabaseService from './services/supabase'
import './index.css'

// Icons (using SVG for simplicity)
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const TrophyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" />
  </svg>
)

const GiftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
)

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const QrIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const ClipboardListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
)

const ChartBarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const CogIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
  </svg>
)

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Z29sZGVuLWdyYWNrbGUtODguY2xlcmsuYWNjb3VudHMuZGV2JA'

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

// User role management
type UserRole = 'employee' | 'admin'

const getUserRole = (user: any): UserRole => {
  // Check user metadata for role, default to employee
  return user?.publicMetadata?.role === 'admin' ? 'admin' : 'employee'
}

// Role-based route protection
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: UserRole }) {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  if (!user) {
    return <RedirectToSignIn />
  }
  
  const userRole = getUserRole(user)
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/'} replace />
  }
  
  return <>{children}</>
}

// Navigation component
function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useUser()
  const userRole = user ? getUserRole(user) : 'employee'

  const employeeNavItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/check-in', icon: QrIcon, label: 'Check In' },
    { path: '/leaderboard', icon: TrophyIcon, label: 'Leaderboard' },
    { path: '/rewards', icon: GiftIcon, label: 'Rewards' },
    { path: '/profile', icon: UserIcon, label: 'Profile' }
  ]

  const adminNavItems = [
    { path: '/admin', icon: HomeIcon, label: 'Dashboard' },
    { path: '/admin/employees', icon: UsersIcon, label: 'Employees' },
    { path: '/admin/redemptions', icon: ClipboardListIcon, label: 'Redemptions' },
    { path: '/admin/analytics', icon: ChartBarIcon, label: 'Analytics' },
    { path: '/admin/settings', icon: CogIcon, label: 'Settings' }
  ]

  const navItems = userRole === 'admin' ? adminNavItems : employeeNavItems

  return (
    <>
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SK</span>
                </div>
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  {userRole === 'admin' ? 'Admin Portal' : 'Employee Rewards'}
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              {userRole === 'admin' && (
                <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Admin
                </span>
              )}
              <UserButton />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-1 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <item.icon />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}

// Layout wrapper
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pb-20 md:pb-8">
        {children}
      </main>
    </div>
  )
}

// Dashboard page
function Dashboard() {
  const { user, loading } = useData()
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="bg-gray-300 rounded-xl h-32 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-300 rounded-lg h-24"></div>
            <div className="bg-gray-300 rounded-lg h-24"></div>
            <div className="bg-gray-300 rounded-lg h-24"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-6 mb-6">
        <h2 className="text-2xl font-bold">Welcome to System Kleen{user?.name ? `, ${user.name}` : ''}!</h2>
        <p className="mt-2">Your Employee Rewards Dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Total Points</h3>
          <p className="text-3xl font-bold text-blue-600">{user?.points_balance || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
          <p className="text-3xl font-bold text-green-600">{user?.current_streak || 0} days</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Total Earned</h3>
          <p className="text-3xl font-bold text-purple-600">{user?.total_points_earned || 0}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
              <span className="text-gray-600">Welcome to the Employee Rewards System!</span>
            </div>
            <span className="text-sm text-gray-500">Today</span>
          </div>
          {user?.current_streak > 0 && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-orange-400 rounded-full mr-3"></div>
                <span className="text-gray-600">{user.current_streak}-day streak maintained!</span>
              </div>
              <span className="text-sm text-gray-500">Current</span>
            </div>
          )}
          {user?.total_points_earned > 0 && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-blue-400 rounded-full mr-3"></div>
                <span className="text-gray-600">Total points earned: {user.total_points_earned}</span>
              </div>
              <span className="text-sm text-gray-500">Lifetime</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Check-in page
function CheckIn() {
  const { user, updateUserPoints, refreshUser } = useData()
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [checkInStatus, setCheckInStatus] = useState<string | null>(null)
  const [todaysCheckIn, setTodaysCheckIn] = useState<any>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [showQrScanner, setShowQrScanner] = useState(false)
  const [motivationalQuote, setMotivationalQuote] = useState<any>(null)

  // Check if user already checked in today
  useEffect(() => {
    const checkTodaysCheckIn = async () => {
      if (!user) return
      
      try {
        const checkIn = await SupabaseService.getTodaysCheckIn(user.id)
        setTodaysCheckIn(checkIn)
      } catch (error) {
        console.error('Error checking today\'s check-in:', error)
      }
    }

    checkTodaysCheckIn()
  }, [user])

  // Generate QR code for check-in
  useEffect(() => {
    const generateQrCode = async () => {
      if (!user) return
      
      try {
        const QRCode = await import('qrcode')
        const qrData = JSON.stringify({
          userId: user.id,
          timestamp: new Date().toISOString(),
          type: 'checkin'
        })
        const qrCodeUrl = await QRCode.toDataURL(qrData)
        setQrCode(qrCodeUrl)
      } catch (error) {
        console.error('Error generating QR code:', error)
      }
    }

    generateQrCode()
  }, [user])

  const calculatePoints = () => {
    const now = new Date()
    const hour = now.getHours()
    
    if (hour >= 6 && hour < 7) {
      return { points: 2, type: 'early', message: 'Early check-in! You earned 2 points.' }
    } else if (hour >= 7 && hour < 9) {
      return { points: 1, type: 'ontime', message: 'On-time check-in! You earned 1 point.' }
    } else {
      return { points: 0, type: 'late', message: 'Late check-in. No points earned, but thanks for checking in!' }
    }
  }

  const calculateStreakDay = () => {
    // Simple streak calculation - in production, this would be more sophisticated
    return (user?.current_streak || 0) + 1
  }

  const handleCheckIn = async () => {
    if (!user || todaysCheckIn) return

    setIsCheckingIn(true)
    setCheckInStatus(null)
    
    try {
      const pointsInfo = calculatePoints()
      const streakDay = calculateStreakDay()
      
      // Create check-in record
      await SupabaseService.createCheckIn(user.id, {
        user_id: user.id,
        check_in_time: new Date().toISOString(),
        points_earned: pointsInfo.points,
        check_in_type: pointsInfo.type as 'early' | 'ontime' | 'late',
        location: 'Web App',
        streak_day: streakDay
      })

      // Create point transaction
      if (pointsInfo.points > 0) {
        await SupabaseService.createPointTransaction({
          user_id: user.id,
          transaction_type: 'earned',
          points_amount: pointsInfo.points,
          reference_type: 'checkin',
          reference_id: user.id,
          description: `Check-in points: ${pointsInfo.type}`
        })
      }

      // Update user points and streak
      await SupabaseService.updateUser(user.id, {
        points_balance: user.points_balance + pointsInfo.points,
        total_points_earned: user.total_points_earned + pointsInfo.points,
        current_streak: streakDay,
        longest_streak: Math.max(user.longest_streak, streakDay)
      })

      // Get motivational quote
      const quote = await SupabaseService.getRandomQuote()
      setMotivationalQuote(quote)

      setCheckInStatus(pointsInfo.message)
      setTodaysCheckIn({ points_earned: pointsInfo.points, check_in_type: pointsInfo.type })
      
      // Refresh user data
      await refreshUser()
      
    } catch (error) {
      console.error('Check-in failed:', error)
      setCheckInStatus('Check-in failed. Please try again.')
    } finally {
      setIsCheckingIn(false)
    }
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <QrIcon />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Check-In</h2>
          <p className="text-gray-600 mb-6">Check in to earn points and maintain your streak!</p>
          
          {todaysCheckIn ? (
            <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-800 text-lg font-semibold">✅ Already Checked In Today!</div>
              <p className="text-green-600 mt-2">You earned {todaysCheckIn.points_earned} points</p>
              <p className="text-sm text-green-600 mt-1">
                Current streak: {user.current_streak} days
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Current Time</p>
                <p className="text-lg font-semibold">{getCurrentTime()}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Point System</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-semibold text-green-800">Early (6:00-7:00 AM)</div>
                    <div className="text-green-600">2 Points</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-semibold text-blue-800">On Time (7:00-9:00 AM)</div>
                    <div className="text-blue-600">1 Point</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-semibold text-gray-800">Late (After 9:00 AM)</div>
                    <div className="text-gray-600">0 Points</div>
                  </div>
                </div>
              </div>

              {/* QR Code Display */}
              {qrCode && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Your Check-in QR Code</h3>
                  <div className="bg-white p-4 rounded-lg border">
                    <img src={qrCode} alt="Check-in QR Code" className="mx-auto w-32 h-32" />
                    <p className="text-xs text-gray-500 mt-2">
                      Scan this code or click the button below to check in
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg mb-4"
              >
                {isCheckingIn ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Checking In...
                  </div>
                ) : (
                  'Check In Now'
                )}
              </button>

              <p className="text-sm text-gray-500">
                Check-in window: 6:00 AM - 9:00 AM MST
              </p>
            </>
          )}

          {checkInStatus && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">{checkInStatus}</p>
            </div>
          )}

          {motivationalQuote && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Daily Inspiration</h4>
              <p className="text-blue-700 italic">"{motivationalQuote.quote_text}"</p>
              {motivationalQuote.author && (
                <p className="text-blue-600 text-sm mt-2">— {motivationalQuote.author}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Leaderboard page
function Leaderboard() {
  const { user } = useData()
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const leaders = await SupabaseService.getLeaderboard(10)
        
        // Add rank and format data
        const formattedData = leaders.map((leader, index) => ({
          rank: index + 1,
          id: leader.id,
          name: leader.name,
          points: leader.points_balance,
          streak: leader.current_streak,
          isCurrentUser: user?.id === leader.id
        }))
        
        setLeaderboardData(formattedData)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [user])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
          <p className="text-gray-600">Top performers by points and streaks</p>
        </div>
        
        <div className="p-6">
          {leaderboardData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No employees found. Be the first to check in!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboardData.map((employee) => (
                <div
                  key={employee.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    employee.isCurrentUser
                      ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                      employee.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      employee.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      employee.rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {employee.rank === 1 ? '🥇' : 
                       employee.rank === 2 ? '🥈' : 
                       employee.rank === 3 ? '🥉' : 
                       `#${employee.rank}`}
                    </div>
                    <div>
                      <div className={`font-semibold ${employee.isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                        {employee.isCurrentUser ? `${employee.name} (You)` : employee.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {employee.streak > 0 ? `${employee.streak} day streak` : 'No current streak'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-blue-600">{employee.points}</div>
                    <div className="text-sm text-gray-500">points</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Rewards page
function Rewards() {
  const { user, refreshUser } = useData()
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [redeemStatus, setRedeemStatus] = useState<string | null>(null)

  const categories = ['all', 'weekly', 'monthly', 'quarterly', 'annual', 'special']

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true)
        const allRewards = await SupabaseService.getRewards()
        setRewards(allRewards)
      } catch (error) {
        console.error('Error fetching rewards:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRewards()
  }, [])

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory)

  const handleRedeem = async (reward: any) => {
    if (!user || user.points_balance < reward.points_cost || redeeming) return

    setRedeeming(reward.id)
    setRedeemStatus(null)

    try {
      // Create redemption request
      await SupabaseService.createRedemption(user.id, reward.id, reward.points_cost)

      // Deduct points from user balance
      await SupabaseService.updateUser(user.id, {
        points_balance: user.points_balance - reward.points_cost
      })

      // Create point transaction
      await SupabaseService.createPointTransaction({
        user_id: user.id,
        transaction_type: 'spent',
        points_amount: -reward.points_cost,
        reference_type: 'redemption',
        reference_id: reward.id,
        description: `Redeemed: ${reward.name}`
      })

      setRedeemStatus(`Successfully redeemed ${reward.name}! Your request is pending approval.`)
      await refreshUser()

    } catch (error) {
      console.error('Redemption failed:', error)
      setRedeemStatus('Redemption failed. Please try again.')
    } finally {
      setRedeeming(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Rewards Store</h2>
        <p className="text-gray-600">Redeem your points for amazing rewards</p>
        <div className="mt-2 text-lg">
          <span className="text-gray-700">Your Points: </span>
          <span className="font-bold text-blue-600">{user?.points_balance || 0}</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {redeemStatus && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{redeemStatus}</p>
        </div>
      )}

      {filteredRewards.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No rewards available in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{reward.name}</h3>
                  <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {reward.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                
                {reward.terms && (
                  <p className="text-xs text-gray-500 mb-4 italic">{reward.terms}</p>
                )}

                {reward.quantity_available !== -1 && (
                  <p className="text-sm text-gray-600 mb-4">
                    Available: {reward.quantity_available}
                  </p>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-blue-600">{reward.points_cost} pts</div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={
                      !reward.is_active || 
                      (reward.quantity_available !== -1 && reward.quantity_available <= 0) ||
                      !user ||
                      reward.points_cost > user.points_balance ||
                      redeeming === reward.id
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      !reward.is_active || (reward.quantity_available !== -1 && reward.quantity_available <= 0)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : !user || reward.points_cost > (user?.points_balance || 0)
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : redeeming === reward.id
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {!reward.is_active
                      ? 'Unavailable'
                      : reward.quantity_available !== -1 && reward.quantity_available <= 0
                      ? 'Out of Stock'
                      : !user || reward.points_cost > (user?.points_balance || 0)
                      ? 'Need More Points'
                      : redeeming === reward.id
                      ? 'Redeeming...'
                      : 'Redeem'
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Profile page
function Profile() {
  const { user } = useData()
  const [checkIns, setCheckIns] = useState<any[]>([])
  const [userBadges, setUserBadges] = useState<any[]>([])
  const [userRank, setUserRank] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return

      try {
        setLoading(true)
        
        // Fetch user's check-ins
        const userCheckIns = await SupabaseService.getUserCheckIns(user.id, 50)
        setCheckIns(userCheckIns)

        // Fetch user's badges
        const badges = await SupabaseService.getUserBadges(user.id)
        setUserBadges(badges)

        // Calculate user rank
        const leaderboard = await SupabaseService.getLeaderboard(100)
        const rank = leaderboard.findIndex(leader => leader.id === user.id) + 1
        setUserRank(rank || leaderboard.length + 1)

        // Check for new badge eligibility
        await checkAndAwardBadges(user, userCheckIns, badges)

      } catch (error) {
        console.error('Error fetching profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [user])

  const checkAndAwardBadges = async (user: any, checkIns: any[], currentBadges: any[]) => {
    try {
      // Get all available badges
      const { data: allBadges } = await SupabaseService.supabase
        .from('badges')
        .select('*')
        .eq('is_active', true)

      if (!allBadges) return

      const currentBadgeIds = currentBadges.map(ub => ub.badge_id)

      for (const badge of allBadges) {
        if (currentBadgeIds.includes(badge.id)) continue // Already has this badge

        let shouldAward = false

        switch (badge.criteria_type) {
          case 'points':
            shouldAward = user.total_points_earned >= badge.criteria_value
            break
          case 'streak':
            shouldAward = user.current_streak >= badge.criteria_value
            break
          case 'checkins':
            shouldAward = checkIns.length >= badge.criteria_value
            break
        }

        if (shouldAward) {
          await SupabaseService.awardBadge(user.id, badge.id)
          console.log(`Awarded badge: ${badge.name}`)
        }
      }
    } catch (error) {
      console.error('Error checking badge eligibility:', error)
    }
  }

  const getThisMonthStats = () => {
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()
    
    const thisMonthCheckIns = checkIns.filter(checkIn => {
      const checkInDate = new Date(checkIn.check_in_time)
      return checkInDate.getMonth() === thisMonth && checkInDate.getFullYear() === thisYear
    })

    const pointsThisMonth = thisMonthCheckIns.reduce((sum, checkIn) => sum + checkIn.points_earned, 0)
    const earlyCheckIns = thisMonthCheckIns.filter(checkIn => checkIn.check_in_type === 'early').length
    const onTimeCheckIns = thisMonthCheckIns.filter(checkIn => checkIn.check_in_type === 'ontime').length

    return {
      checkIns: thisMonthCheckIns.length,
      pointsEarned: pointsThisMonth,
      earlyCheckIns,
      onTimeCheckIns
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  const monthStats = getThisMonthStats()

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">{user.name?.charAt(0) || 'U'}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.department} • Employee since {new Date(user.hire_date).getFullYear()}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Employee Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Points</span>
              <span className="font-semibold">{user.points_balance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Points Earned</span>
              <span className="font-semibold">{user.total_points_earned}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Streak</span>
              <span className="font-semibold">{user.current_streak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Best Streak</span>
              <span className="font-semibold">{user.longest_streak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Check-ins</span>
              <span className="font-semibold">{checkIns.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Company Rank</span>
              <span className="font-semibold">#{userRank}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">This Month</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Points Earned</span>
              <span className="font-semibold">{monthStats.pointsEarned}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-ins</span>
              <span className="font-semibold">{monthStats.checkIns}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Early Check-ins</span>
              <span className="font-semibold">{monthStats.earlyCheckIns}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">On-time Check-ins</span>
              <span className="font-semibold">{monthStats.onTimeCheckIns}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Achievements ({userBadges.length} badges earned)</h3>
        {userBadges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No badges earned yet. Keep checking in to unlock achievements!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userBadges.map((userBadge) => (
              <div key={userBadge.id} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">{userBadge.badge?.icon || '🏆'}</div>
                <div className="font-semibold text-sm">{userBadge.badge?.name}</div>
                <div className="text-xs text-gray-500 mt-1">{userBadge.badge?.description}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Earned {new Date(userBadge.earned_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Check-ins */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Check-ins</h3>
        {checkIns.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No check-ins yet. Start your journey today!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {checkIns.slice(0, 10).map((checkIn) => (
              <div key={checkIn.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    checkIn.check_in_type === 'early' ? 'bg-green-400' :
                    checkIn.check_in_type === 'ontime' ? 'bg-blue-400' :
                    'bg-gray-400'
                  }`}></div>
                  <span className="text-gray-900">
                    {new Date(checkIn.check_in_time).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-sm text-gray-500">
                    at {new Date(checkIn.check_in_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    checkIn.check_in_type === 'early' ? 'text-green-600' :
                    checkIn.check_in_type === 'ontime' ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    {checkIn.check_in_type === 'early' ? 'Early' :
                     checkIn.check_in_type === 'ontime' ? 'On-time' :
                     'Late'}
                  </span>
                  <span className="font-semibold text-blue-600">+{checkIn.points_earned}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Admin Dashboard
function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white p-6 mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="mt-2">System Kleen Employee Management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600">47</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Today's Check-ins</h3>
          <p className="text-3xl font-bold text-green-600">32</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Pending Redemptions</h3>
          <p className="text-3xl font-bold text-orange-600">8</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Points Awarded Today</h3>
          <p className="text-3xl font-bold text-purple-600">47</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
                <span className="text-gray-600">Sarah Johnson checked in</span>
              </div>
              <span className="text-sm text-gray-500">2 min ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-orange-400 rounded-full mr-3"></div>
                <span className="text-gray-600">Reward redemption pending</span>
              </div>
              <span className="text-sm text-gray-500">5 min ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="h-2 w-2 bg-blue-400 rounded-full mr-3"></div>
                <span className="text-gray-600">Mike Chen earned badge</span>
              </div>
              <span className="text-sm text-gray-500">12 min ago</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-left">
              View All Employees
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-left">
              Approve Redemptions
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-left">
              Generate Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Employee Management
function AdminEmployees() {
  const employees = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@systemkleen.com', points: 387, streak: 12, lastCheckIn: '2025-01-11 07:15' },
    { id: 2, name: 'Mike Chen', email: 'mike.c@systemkleen.com', points: 298, streak: 8, lastCheckIn: '2025-01-11 06:45' },
    { id: 3, name: 'Emily Davis', email: 'emily.d@systemkleen.com', points: 221, streak: 5, lastCheckIn: '2025-01-11 08:30' },
    { id: 4, name: 'Alex Rodriguez', email: 'alex.r@systemkleen.com', points: 198, streak: 4, lastCheckIn: '2025-01-10 07:22' },
    { id: 5, name: 'Jessica Wilson', email: 'jessica.w@systemkleen.com', points: 156, streak: 2, lastCheckIn: '2025-01-11 09:15' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-600">View and manage all employees</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Check-in</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-blue-600">{employee.points}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{employee.streak} days</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{employee.lastCheckIn}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-red-600 hover:text-red-900">Reset</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Admin Redemptions
function AdminRedemptions() {
  const redemptions = [
    { id: 1, employee: 'Sarah Johnson', reward: 'Coffee Gift Card', cost: 50, status: 'pending', date: '2025-01-11 09:30' },
    { id: 2, employee: 'Mike Chen', reward: 'Extra PTO Day', cost: 100, status: 'pending', date: '2025-01-11 08:15' },
    { id: 3, employee: 'Emily Davis', reward: 'Premium Parking Spot', cost: 75, status: 'approved', date: '2025-01-10 14:22' },
    { id: 4, employee: 'Alex Rodriguez', reward: 'Team Lunch', cost: 150, status: 'rejected', date: '2025-01-10 11:45' },
  ]

  const handleApprove = (id: number) => {
    console.log('Approving redemption:', id)
  }

  const handleReject = (id: number) => {
    console.log('Rejecting redemption:', id)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Reward Redemptions</h2>
          <p className="text-gray-600">Approve or reject employee reward requests</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {redemptions.map((redemption) => (
                <tr key={redemption.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{redemption.employee}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{redemption.reward}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-blue-600">{redemption.cost} pts</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      redemption.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      redemption.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {redemption.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{redemption.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {redemption.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApprove(redemption.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(redemption.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Admin Analytics
function AdminAnalytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Reports</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Weekly Check-ins</h3>
            <p className="text-3xl font-bold text-blue-600">234</p>
            <p className="text-sm text-blue-600">+12% from last week</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Points Awarded</h3>
            <p className="text-3xl font-bold text-green-600">1,847</p>
            <p className="text-sm text-green-600">+8% from last week</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Rewards Redeemed</h3>
            <p className="text-3xl font-bold text-purple-600">23</p>
            <p className="text-sm text-purple-600">+15% from last week</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Engagement Trends</h3>
          <p className="text-gray-600">Detailed analytics charts would be implemented here with a charting library like Chart.js or Recharts.</p>
        </div>
      </div>
    </div>
  )
}

// Admin Settings
function AdminSettings() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Settings</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Point System</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Early Check-in (6-7 AM)</label>
                <input type="number" defaultValue={2} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">On-time Check-in (7-9 AM)</label>
                <input type="number" defaultValue={1} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="border rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Late Check-in (After 9 AM)</label>
                <input type="number" defaultValue={0} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input type="text" defaultValue="System Kleen" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Window Start</label>
                <input type="time" defaultValue="06:00" className="border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Window End</label>
                <input type="time" defaultValue="09:00" className="border rounded px-3 py-2" />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SignedIn>
        <Routes>
          {/* Employee Routes */}
          <Route path="/" element={
            <ProtectedRoute requiredRole="employee">
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/check-in" element={
            <ProtectedRoute requiredRole="employee">
              <Layout><CheckIn /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute requiredRole="employee">
              <Layout><Leaderboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/rewards" element={
            <ProtectedRoute requiredRole="employee">
              <Layout><Rewards /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requiredRole="employee">
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/employees" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminEmployees /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/redemptions" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminRedemptions /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminAnalytics /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requiredRole="admin">
              <Layout><AdminSettings /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Catch all - redirect based on role */}
          <Route path="*" element={<ProtectedRoute><Navigate to="/" replace /></ProtectedRoute>} />
        </Routes>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <DataProvider>
        <App />
      </DataProvider>
    </ClerkProvider>
  </React.StrictMode>,
)