import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import SupabaseService from '../services/supabase'
import type { User as SBUser } from '../services/supabase'

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
      const userData = {
        email: authUser.emailAddresses[0]?.emailAddress || '',
        name: authUser.fullName || authUser.firstName || 'Unknown',
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

  // Initialize user when auth user loads
  useEffect(() => {
    initializeUser()
  }, [authUser, isLoaded])

  const value = {
    user,
    loading,
    refreshUser,
    updateUserPoints,
    error
  }

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