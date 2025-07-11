import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import PocketBaseService, { User as PBUser } from '../services/pocketbase'

interface DataContextType {
  user: PBUser | null
  loading: boolean
  refreshUser: () => Promise<void>
  updateUserPoints: (points: number) => Promise<void>
  error: string | null
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser()
  const [user, setUser] = useState<PBUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize or sync user data between Clerk and PocketBase
  const initializeUser = async () => {
    if (!clerkUser || !isLoaded) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get role from Clerk metadata
      const role = clerkUser.publicMetadata?.role === 'admin' ? 'admin' : 'employee'
      
      // Prepare user data from Clerk
      const userData = {
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || 'Unknown',
        employee_id: clerkUser.id,
        department: clerkUser.publicMetadata?.department as string || 'General',
        hire_date: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        role: role as 'employee' | 'admin'
      }

      // Get or create user in PocketBase
      const pbUser = await PocketBaseService.getOrCreateUser(clerkUser.id, userData)
      setUser(pbUser)
    } catch (err) {
      console.error('Failed to initialize user:', err)
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  // Refresh user data from PocketBase
  const refreshUser = async () => {
    if (!clerkUser) return

    try {
      const pbUser = await PocketBaseService.getUser(clerkUser.id)
      setUser(pbUser)
    } catch (err) {
      console.error('Failed to refresh user:', err)
      setError('Failed to refresh user data')
    }
  }

  // Update user points and refresh
  const updateUserPoints = async (points: number) => {
    if (!user) return

    try {
      const updatedUser = await PocketBaseService.updateUser(user.id, {
        points_balance: user.points_balance + points,
        total_points_earned: user.total_points_earned + (points > 0 ? points : 0)
      })
      setUser(updatedUser)
    } catch (err) {
      console.error('Failed to update points:', err)
      setError('Failed to update points')
    }
  }

  // Initialize user when Clerk user loads
  useEffect(() => {
    initializeUser()
  }, [clerkUser, isLoaded])

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