import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'

export function useAuthModeFallback() {
  const [shouldUseDemoMode, setShouldUseDemoMode] = useState(false)
  const { isLoaded } = useAuth()
  
  useEffect(() => {
    // If Clerk hasn't loaded after 10 seconds, fall back to demo mode
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        console.warn('Clerk failed to load after 10 seconds, falling back to demo mode')
        setShouldUseDemoMode(true)
      }
    }, 10000)
    
    return () => clearTimeout(timeout)
  }, [isLoaded])
  
  // Check if we're getting repeated errors
  useEffect(() => {
    let errorCount = 0
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('clerk') || event.message.includes('Clerk')) {
        errorCount++
        if (errorCount > 3) {
          console.warn('Multiple Clerk errors detected, falling back to demo mode')
          setShouldUseDemoMode(true)
        }
      }
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])
  
  return shouldUseDemoMode
}