import { X, Eye, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentDemoUser, setDemoMode, setCurrentDemoUser } from '../services/demoService'

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const navigate = useNavigate()
  const demoUser = getCurrentDemoUser()
  
  if (!demoUser || !isVisible) {
    return null
  }
  
  const handleExitDemo = () => {
    // Clear demo mode
    setDemoMode(false)
    setCurrentDemoUser(null)
    localStorage.removeItem('demoAuth')
    
    // Navigate to auth page
    navigate('/auth')
  }
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Eye className="h-5 w-5" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-medium">Demo Mode</span>
              <span className="text-sm opacity-90">
                Viewing as: <span className="font-semibold">{demoUser.name}</span> ({demoUser.role})
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExitDemo}
              className="flex items-center space-x-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Exit Demo</span>
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Hide banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}