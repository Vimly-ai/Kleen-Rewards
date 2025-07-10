import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@clerk/clerk-react'
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

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Z29sZGVuLWdyYWNrbGUtODguY2xlcmsuYWNjb3VudHMuZGV2JA'

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

// Navigation component
function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/check-in', icon: QrIcon, label: 'Check In' },
    { path: '/leaderboard', icon: TrophyIcon, label: 'Leaderboard' },
    { path: '/rewards', icon: GiftIcon, label: 'Rewards' },
    { path: '/profile', icon: UserIcon, label: 'Profile' }
  ]

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
                  Employee Rewards
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
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-6 mb-6">
        <h2 className="text-2xl font-bold">Welcome to System Kleen!</h2>
        <p className="mt-2">Your Employee Rewards Dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Total Points</h3>
          <p className="text-3xl font-bold text-blue-600">245</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
          <p className="text-3xl font-bold text-green-600">7 days</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold mb-2">Rank</h3>
          <p className="text-3xl font-bold text-purple-600">#3</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
              <span className="text-gray-600">Check-in completed</span>
            </div>
            <span className="text-sm text-gray-500">Today, 7:45 AM</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-blue-400 rounded-full mr-3"></div>
              <span className="text-gray-600">Points earned: +2</span>
            </div>
            <span className="text-sm text-gray-500">Today, 7:45 AM</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-orange-400 rounded-full mr-3"></div>
              <span className="text-gray-600">7-day streak achieved!</span>
            </div>
            <span className="text-sm text-gray-500">Today, 7:45 AM</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Check-in page
function CheckIn() {
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [checkInStatus, setCheckInStatus] = useState<string | null>(null)

  const handleCheckIn = async () => {
    setIsCheckingIn(true)
    setCheckInStatus(null)
    
    // Simulate check-in process
    setTimeout(() => {
      const hour = new Date().getHours()
      let pointsEarned = 0
      let status = ''
      
      if (hour >= 6 && hour < 7) {
        pointsEarned = 2
        status = 'Early check-in! You earned 2 points.'
      } else if (hour >= 7 && hour < 9) {
        pointsEarned = 1
        status = 'On-time check-in! You earned 1 point.'
      } else {
        pointsEarned = 0
        status = 'Late check-in. No points earned, but thanks for checking in!'
      }
      
      setCheckInStatus(status)
      setIsCheckingIn(false)
    }, 2000)
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
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

          {checkInStatus && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{checkInStatus}</p>
            </div>
          )}

          <button
            onClick={handleCheckIn}
            disabled={isCheckingIn}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg"
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

          <p className="mt-4 text-sm text-gray-500">
            Check-in window: 6:00 AM - 9:00 AM MST
          </p>
        </div>
      </div>
    </div>
  )
}

// Leaderboard page
function Leaderboard() {
  const leaderboardData = [
    { rank: 1, name: 'Sarah Johnson', points: 387, streak: 12 },
    { rank: 2, name: 'Mike Chen', points: 298, streak: 8 },
    { rank: 3, name: 'You', points: 245, streak: 7 },
    { rank: 4, name: 'Emily Davis', points: 221, streak: 5 },
    { rank: 5, name: 'Alex Rodriguez', points: 198, streak: 4 },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
          <p className="text-gray-600">Top performers this month</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {leaderboardData.map((employee) => (
              <div
                key={employee.rank}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  employee.name === 'You'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    employee.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                    employee.rank === 2 ? 'bg-gray-100 text-gray-800' :
                    employee.rank === 3 ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    #{employee.rank}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.streak} day streak</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-blue-600">{employee.points}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Rewards page
function Rewards() {
  const rewards = [
    { id: 1, name: 'Coffee Gift Card', cost: 50, category: 'Food & Drink', available: true },
    { id: 2, name: 'Extra PTO Day', cost: 100, category: 'Time Off', available: true },
    { id: 3, name: 'Premium Parking Spot', cost: 75, category: 'Perks', available: true },
    { id: 4, name: 'Team Lunch', cost: 150, category: 'Team Events', available: true },
    { id: 5, name: 'Work From Home Day', cost: 80, category: 'Flexibility', available: false },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Rewards Store</h2>
        <p className="text-gray-600">Redeem your points for amazing rewards</p>
        <div className="mt-2 text-lg">
          <span className="text-gray-700">Your Points: </span>
          <span className="font-bold text-blue-600">245</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{reward.name}</h3>
                <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {reward.category}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-blue-600">{reward.cost} pts</div>
                <button
                  disabled={!reward.available || reward.cost > 245}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !reward.available
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : reward.cost > 245
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {!reward.available
                    ? 'Unavailable'
                    : reward.cost > 245
                    ? 'Need More Points'
                    : 'Redeem'
                  }
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Profile page
function Profile() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Employee Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Points</span>
                <span className="font-semibold">245</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Streak</span>
                <span className="font-semibold">7 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Check-ins</span>
                <span className="font-semibold">67</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rank</span>
                <span className="font-semibold">#3</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Points Earned</span>
                <span className="font-semibold">28</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-ins</span>
                <span className="font-semibold">14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Early Check-ins</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">On-time Check-ins</span>
                <span className="font-semibold">9</span>
              </div>
            </div>
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
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
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
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)