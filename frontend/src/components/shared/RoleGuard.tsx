import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LoadingSpinner } from './LoadingSpinner'

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

  // Show loading while checking authentication
  if (!isLoaded) {
    return <LoadingSpinner size="large" text="Checking permissions..." fullScreen />
  }

  // Redirect to auth if not signed in
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