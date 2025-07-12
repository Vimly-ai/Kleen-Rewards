/**
 * Profile Check Component - Enterprise Employee Rewards System
 * 
 * Checks if user profile is complete and redirects to setup if needed
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'

interface ProfileCheckProps {
  children: React.ReactNode
}

export function ProfileCheck({ children }: ProfileCheckProps) {
  const navigate = useNavigate()
  const { user, loading } = useData()

  useEffect(() => {
    // Skip check if still loading
    if (loading) return

    // Check if profile is incomplete
    if (user && (!user.first_name || !user.last_name || user.name === 'New User')) {
      navigate('/profile-setup')
    }
  }, [user, loading, navigate])

  // Don't render children until we've checked the profile
  if (loading) return null
  if (user && (!user.first_name || !user.last_name || user.name === 'New User')) return null

  return <>{children}</>
}