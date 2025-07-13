/**
 * Combined Auth Hook - Enterprise Employee Rewards System
 * 
 * Provides unified authentication interface for both Clerk and Demo mode
 */

import { useUser as useClerkUser } from '@clerk/clerk-react'
import { useDemoAuth } from '../contexts/DemoAuthContext'
import { isDemoMode, getCurrentDemoUser } from '../services/demoService'

export function useAuth() {
  const clerkAuth = useClerkUser()
  const demoAuth = useDemoAuth()

  // Check if we're in demo mode using the demoService
  if (isDemoMode()) {
    const demoUser = getCurrentDemoUser()
    if (demoUser) {
      return {
        isSignedIn: true,
        isLoaded: true,
        user: {
          id: demoUser.id,
          emailAddresses: [{ emailAddress: demoUser.email }],
          fullName: demoUser.name,
          firstName: demoUser.name.split(' ')[0],
          lastName: demoUser.name.split(' ')[1] || '',
          imageUrl: demoUser.avatar || '',
          publicMetadata: {
            role: demoUser.role,
            department: demoUser.department
          },
          createdAt: demoUser.joinDate.getTime()
        }
      }
    }
  }

  // Use demo auth if in demo mode (fallback)
  if (demoAuth.isDemoMode) {
    return {
      isSignedIn: demoAuth.isSignedIn,
      isLoaded: !demoAuth.isLoading,
      user: demoAuth.demoUser ? {
        id: demoAuth.demoUser.id,
        emailAddresses: [{ emailAddress: demoAuth.demoUser.email }],
        fullName: demoAuth.demoUser.fullName,
        firstName: demoAuth.demoUser.firstName,
        lastName: demoAuth.demoUser.lastName,
        imageUrl: demoAuth.demoUser.imageUrl,
        publicMetadata: demoAuth.demoUser.publicMetadata,
        createdAt: new Date().getTime()
      } : null
    }
  }

  // Otherwise use Clerk auth
  return clerkAuth
}