import { useAuth, useClerk } from '@clerk/clerk-react'
import { useEffect } from 'react'

export function ClerkDebug() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const clerk = useClerk()

  useEffect(() => {
    console.log('=== Clerk Debug Info ===')
    console.log('Clerk loaded:', clerk.loaded)
    console.log('Auth loaded:', isLoaded)
    console.log('Is signed in:', isSignedIn)
    console.log('User ID:', userId)
    console.log('Clerk instance:', clerk)
    console.log('Environment:', {
      VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + '...',
      VITE_ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA,
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD
    })
    console.log('======================')
  }, [clerk, isLoaded, isSignedIn, userId])

  if (!import.meta.env.DEV) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Clerk Debug</h3>
      <div>Loaded: {String(isLoaded)}</div>
      <div>Signed In: {String(isSignedIn)}</div>
      <div>User ID: {userId || 'none'}</div>
      <div>Mock Mode: {import.meta.env.VITE_ENABLE_MOCK_DATA || 'false'}</div>
    </div>
  )
}