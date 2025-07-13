import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LoadingSpinner } from './LoadingSpinner'
import { getCurrentDemoUser, isDemoMode } from '../../services/demoService'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallbackPath?: string
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/unauthorized' 
}: RoleGuardProps) {
  const { user, isLoaded, isSignedIn } = useAuth()
  
  // Check if we're in demo mode
  const isDemo = isDemoMode()
  const demoUser = getCurrentDemoUser()
  
  // Handle demo mode authentication
  if (isDemo && demoUser) {
    // Check if demo user has required role
    const hasRequiredRole = allowedRoles.includes(demoUser.role)
    
    if (!hasRequiredRole) {
      return <Navigate to={fallbackPath} replace />
    }
    
    return <>{children}</>
  }

  // Show loading while checking authentication (only for real auth)
  if (!isLoaded) {
    return <LoadingSpinner size="large" text="Checking permissions..." fullScreen />
  }

  // Redirect to auth if not signed in and not in demo mode
  if (!isSignedIn) {
    return <Navigate to="/auth" replace />
  }

  // Get user role from Clerk metadata
  const userRole = user?.publicMetadata?.role as string || 'employee'

  // Check if user has required role
  const hasRequiredRole = allowedRoles.includes(userRole)

  if (!hasRequiredRole) {
    return <Navigate to={fallbackPath} replace />
  }

  return <>{children}</>
}