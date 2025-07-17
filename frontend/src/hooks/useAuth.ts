/**
 * Auth Hook - Enterprise Employee Rewards System
 * 
 * Provides authentication interface using Clerk
 */

import { useUser as useClerkUser } from '@clerk/clerk-react'

export function useAuth() {
  // Use Clerk auth only
  return useClerkUser()
}