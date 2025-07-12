import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDemoAuth } from '../contexts/DemoAuthContext'

export default function ClearSession() {
  const navigate = useNavigate()
  const { signOut } = useDemoAuth()

  useEffect(() => {
    // Clear all stored data
    localStorage.clear()
    sessionStorage.clear()
    
    // Sign out from demo auth
    signOut()
    
    // Clear any Clerk data
    if (window.Clerk) {
      window.Clerk.signOut()
    }
    
    // Redirect to auth page
    setTimeout(() => {
      navigate('/auth')
    }, 100)
  }, [navigate, signOut])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Clearing session...</h2>
        <p className="text-gray-600">Redirecting to login page...</p>
      </div>
    </div>
  )
}