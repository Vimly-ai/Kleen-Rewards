/**
 * Combined Auth Hook - Enterprise Employee Rewards System
 * 
 * Provides unified authentication interface for both Clerk and Demo mode
 */

import { useUser as useClerkUser } from '@clerk/clerk-react'
import { useDemoAuth } from '../contexts/DemoAuthContext'

export function useAuth() {
  const clerkAuth = useClerkUser()
  const demoAuth = useDemoAuth()

  // Use demo auth if in demo mode
  if (demoAuth.isDemoMode) {
    return {
      isSignedIn: demoAuth.isSignedIn,
      isLoaded: true,
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