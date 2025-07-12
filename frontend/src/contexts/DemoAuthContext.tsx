/**
 * Demo Authentication Context - Enterprise Employee Rewards System
 * 
 * Provides demo authentication bypass for testing without Clerk
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { DEMO_USERS } from '../services/demoData'

interface DemoUser {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  imageUrl: string
  publicMetadata: {
    role: 'admin' | 'employee'
    department: string
  }
}

interface DemoAuthContextType {
  isSignedIn: boolean
  isDemoMode: boolean
  demoUser: DemoUser | null
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => void
  isLoading?: boolean
}

const DemoAuthContext = createContext<DemoAuthContextType | null>(null)

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // Always enable demo mode for now
  const isDemoMode = true // import.meta.env.VITE_ENABLE_MOCK_DATA === 'true'

  // Disabled auto-restore of demo sessions to prevent automatic redirect issues
  // Users must explicitly click demo login buttons
  useEffect(() => {
    // Clear any stored demo session on mount to ensure clean state
    localStorage.removeItem('demo_user_email')
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    if (!isDemoMode) return false

    setIsLoading(true)
    
    // Add small delay to simulate real auth
    await new Promise(resolve => setTimeout(resolve, 300))

    // Simple demo password check
    if (password !== 'demo123') {
      setIsLoading(false)
      return false
    }

    // Find demo user by email
    const user = DEMO_USERS.find(u => u.email === email)
    if (!user) {
      setIsLoading(false)
      return false
    }

    const demoUserData: DemoUser = {
      id: user.clerkId,
      email: user.email,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1] || '',
      fullName: user.name,
      imageUrl: user.avatarUrl,
      publicMetadata: {
        role: user.role,
        department: user.department
      }
    }

    setDemoUser(demoUserData)
    setIsLoading(false)
    // Don't persist demo sessions to prevent auto-login issues
    return true
  }

  const signOut = () => {
    setDemoUser(null)
    localStorage.removeItem('demo_user_email')
  }

  return (
    <DemoAuthContext.Provider
      value={{
        isSignedIn: !!demoUser,
        isDemoMode,
        demoUser,
        signIn,
        signOut,
        isLoading
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  )
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext)
  if (!context) {
    throw new Error('useDemoAuth must be used within DemoAuthProvider')
  }
  return context
}