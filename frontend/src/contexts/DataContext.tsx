import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import SupabaseService from '../services/supabase'
import type { User as SBUser } from '../services/supabase'
import { isDemoMode, getCurrentDemoUser } from '../services/demoService'

interface DataContextType {
  user: SBUser | null
  loading: boolean
  refreshUser: () => Promise<void>
  updateUserPoints: (points: number) => Promise<void>
  error: string | null
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser, isLoaded } = useAuth()
  const [user, setUser] = useState<SBUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize or sync user data between auth provider and database
  const initializeUser = async () => {
    // Check if we're in demo mode first
    if (isDemoMode()) {
      const demoUser = getCurrentDemoUser()
      if (demoUser) {
        // Create a mock Supabase user object for demo mode
        const mockUser: SBUser = {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          first_name: demoUser.name.split(' ')[0],
          last_name: demoUser.name.split(' ')[1] || '',
          employee_id: demoUser.id,
          department: demoUser.department,
          hire_date: demoUser.joinDate.toISOString().split('T')[0],
          role: demoUser.role as 'employee' | 'admin',
          company: 'System Kleen',
          location: 'Main Office',
          is_active: true,
          points_balance: 0, // Will be overridden by demo stats
          total_points_earned: 0, // Will be overridden by demo stats
          current_streak: 0, // Will be overridden by demo stats
          longest_streak: 0, // Will be overridden by demo stats
          total_check_ins: 0, // Will be overridden by demo stats
          last_check_in: null,
          created_at: demoUser.joinDate.toISOString(),
          updated_at: new Date().toISOString()
        }
        setUser(mockUser)
        setLoading(false)
        return
      }
    }
    
    if (!authUser || !isLoaded) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get role from auth metadata
      const role = authUser.publicMetadata?.role === 'admin' ? 'admin' : 'employee'
      
      // Prepare user data from auth
      const fullName = authUser.fullName || 
                      (authUser.firstName && authUser.lastName ? `${authUser.firstName} ${authUser.lastName}` : '') ||
                      authUser.firstName || 
                      authUser.emailAddresses[0]?.emailAddress?.split('@')[0] || 
                      'Unknown User'
                      
      const userData = {
        email: authUser.emailAddresses[0]?.emailAddress || '',
        name: fullName,
        first_name: authUser.firstName || fullName.split(' ')[0] || '',
        last_name: authUser.lastName || fullName.split(' ').slice(1).join(' ') || '',
        employee_id: authUser.id,
        department: authUser.publicMetadata?.department as string || 'General',
        hire_date: authUser.createdAt ? new Date(authUser.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        role: role as 'employee' | 'admin'
      }

      // Get or create user in Supabase
      const sbUser = await SupabaseService.getOrCreateUser(authUser.id, userData)
      setUser(sbUser)
    } catch (err: any) {
      console.error('Failed to initialize user:', err)
      setError(`Failed to load user data: ${err.message || err}`)
      // Still set loading to false so UI isn't stuck
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  // Refresh user data from Supabase
  const refreshUser = async () => {
    if (!authUser) return

    try {
      const sbUser = await SupabaseService.getUser(authUser.id)
      setUser(sbUser)
    } catch (err) {
      console.error('Failed to refresh user:', err)
      setError('Failed to refresh user data')
    }
  }

  // Update user points and refresh
  const updateUserPoints = async (points: number) => {
    if (!user) return

    try {
      const updatedUser = await SupabaseService.updateUser(user.id, {
        points_balance: user.points_balance + points,
        total_points_earned: user.total_points_earned + (points > 0 ? points : 0)
      })
      setUser(updatedUser)
    } catch (err) {
      console.error('Failed to update points:', err)
      setError('Failed to update points')
    }
  }

  // Initialize user when auth user loads or demo mode changes
  useEffect(() => {
    // Check for demo mode first
    if (isDemoMode()) {
      initializeUser()
      return
    }
    
    // Add a guard to prevent re-initialization if user already exists
    if (!isLoaded) return
    if (!authUser) {
      setUser(null)
      setLoading(false)
      return
    }
    
    // Only initialize if we don't have a user or the auth user ID changed
    if (!user || user.employee_id !== authUser.id) {
      initializeUser()
    }
  }, [authUser?.id, isLoaded])

  const value = useMemo(() => ({
    user,
    loading,
    refreshUser,
    updateUserPoints,
    error
  }), [user, loading, error])

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export default DataContext