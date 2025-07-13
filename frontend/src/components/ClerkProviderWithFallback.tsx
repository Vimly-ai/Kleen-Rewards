import { ClerkProvider } from '@clerk/clerk-react'
import { ReactNode, useState, useEffect } from 'react'
import { LoadingSpinner } from './shared/LoadingSpinner'

interface ClerkProviderWithFallbackProps {
  children: ReactNode
  publishableKey: string
}

export function ClerkProviderWithFallback({ children, publishableKey }: ClerkProviderWithFallbackProps) {
  const [clerkError, setClerkError] = useState<string | null>(null)

  useEffect(() => {
    // Log for debugging
    console.log('Clerk Provider initialized with key:', publishableKey ? publishableKey.substring(0, 40) + '...' : 'No key')
    
    // Add global error handler for Clerk issues
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('Clerk') || event.message.includes('clerk')) {
        console.error('Clerk initialization error:', event.message)
        setClerkError(event.message)
      }
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [publishableKey])

  // If no key provided, render children without Clerk
  if (!publishableKey) {
    console.warn('No Clerk key provided. Using demo mode.')
    return <>{children}</>
  }

  // Show error if Clerk fails
  if (clerkError) {
    console.error('Clerk error:', clerkError)
  }

  try {
    return (
      <ClerkProvider 
        publishableKey={publishableKey}
        navigate={(to) => {
          // Handle internal navigation for Clerk routes
          if (to.startsWith('/')) {
            window.history.pushState({}, '', to)
            window.dispatchEvent(new PopStateEvent('popstate'))
          } else {
            window.location.href = to
          }
        }}
        appearance={{
          elements: {
            rootBox: 'clerk-root-box',
            card: 'clerk-card'
          }
        }}
      >
        {children}
      </ClerkProvider>
    )
  } catch (error) {
    console.error('Failed to initialize Clerk:', error)
    // Fallback to rendering children without Clerk
    return <>{children}</>
  }
}