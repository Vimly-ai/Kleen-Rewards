/**
 * Profile Check Component - Enterprise Employee Rewards System
 * 
 * Checks if user profile is complete and redirects to setup if needed
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { LoadingSpinner } from './shared/LoadingSpinner'

interface ProfileCheckProps {
  children: React.ReactNode
}

export function ProfileCheck({ children }: ProfileCheckProps) {
  const navigate = useNavigate()
  const { user, loading } = useData()

  useEffect(() => {
    // Skip check if still loading
    if (loading) return

    // Skip check for demo users
    const isDemoUser = user?.email && (
      user.email === 'admin@demo.com' ||
      user.email === 'john@demo.com' ||
      user.email === 'emily@demo.com' ||
      user.email === 'michael@demo.com' ||
      user.email === 'lisa@demo.com'
    )
    
    if (isDemoUser) return

    // Check if profile is incomplete
    if (user && (!user.first_name || !user.last_name || user.name === 'New User')) {
      navigate('/profile-setup', { replace: true })
    }
  }, [user?.email, user?.name, loading]) // Remove navigate from deps to prevent loops

  // Don't render children until we've checked the profile
  if (loading) return <LoadingSpinner size="large" text="Loading user profile..." fullScreen />
  
  // Skip blocking render for demo users
  const isDemoUser = user?.email && (
    user.email === 'admin@demo.com' ||
    user.email === 'john@demo.com' ||
    user.email === 'emily@demo.com' ||
    user.email === 'michael@demo.com' ||
    user.email === 'lisa@demo.com'
  )
  
  if (!isDemoUser && user && (!user.first_name || !user.last_name || user.name === 'New User')) {
    return null
  }

  return <>{children}</>
}