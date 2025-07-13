import { ClerkProvider } from '@clerk/clerk-react'
import { ReactNode, useState, useEffect } from 'react'
import { LoadingSpinner } from './shared/LoadingSpinner'

interface ClerkProviderWithFallbackProps {
  children: ReactNode
  publishableKey: string
}

export function ClerkProviderWithFallback({ children, publishableKey }: ClerkProviderWithFallbackProps) {
  const [clerkError, setClerkError] = useState<string | null>(null)
  const [isValidKey, setIsValidKey] = useState(true)

  useEffect(() => {
    // Validate key format
    const isValid = publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_')
    setIsValidKey(isValid)
    
    if (!isValid) {
      console.error('Invalid Clerk publishable key format. Please check your .env file.')
    }
  }, [publishableKey])

  // If key is invalid, render children without Clerk
  if (!isValidKey) {
    console.warn('Clerk disabled due to invalid configuration. Using demo mode.')
    return <>{children}</>
  }

  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      navigate={(to) => window.location.href = to}
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
}