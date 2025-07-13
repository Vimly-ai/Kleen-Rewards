import { useNavigate } from 'react-router-dom'
import { Users, Shield, Eye, ChevronRight } from 'lucide-react'
import { DEMO_ACCOUNTS, setDemoMode, setCurrentDemoUser } from '../services/demoService'
import { useDemoAuth } from '../contexts/DemoAuthContext'

export function DemoModeSelector() {
  const navigate = useNavigate()
  const { signIn } = useDemoAuth()
  
  const handleDemoLogin = async (userType: 'employee' | 'admin') => {
    // Enable demo mode
    setDemoMode(true)
    setCurrentDemoUser(userType)
    
    // Store demo auth info
    const user = DEMO_ACCOUNTS[userType].user
    localStorage.setItem('demoAuth', JSON.stringify({
      user,
      isAuthenticated: true,
      isDemoMode: true
    }))
    
    // Force reload to ensure all contexts pick up the demo mode
    window.location.href = userType === 'admin' ? '/admin/dashboard' : '/employee/dashboard'
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-4">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Demo Mode
        </h3>
        <p className="text-gray-600">
          Experience the full application with sample data
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Employee Demo */}
        <button
          onClick={() => handleDemoLogin('employee')}
          className="w-full group relative bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg p-6 text-left transition-all duration-200 border border-gray-200 hover:border-indigo-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Employee Experience
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Sarah Johnson • Operations Team
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                    28-day streak
                  </span>
                  <span>3,420 points</span>
                  <span>Rank #1</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </div>
        </button>
        
        {/* Admin Demo */}
        <button
          onClick={() => handleDemoLogin('admin')}
          className="w-full group relative bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg p-6 text-left transition-all duration-200 border border-gray-200 hover:border-purple-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Admin Experience
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Michael Chen • Management
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-1"></span>
                    Admin
                  </span>
                  <span>42 team members</span>
                  <span>Analytics access</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          <strong>Demo Mode:</strong> All data is simulated for demonstration purposes. 
          No real accounts or data are affected.
        </p>
      </div>
    </div>
  )
}