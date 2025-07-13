import { useEffect, useState } from 'react'
import { SignIn, SignUp, useAuth, useClerk } from '@clerk/clerk-react'
import { useNavigate, useLocation } from 'react-router-dom'

interface ClerkAuthWrapperProps {
  mode: 'signin' | 'signup'
}

export function ClerkAuthWrapper({ mode }: ClerkAuthWrapperProps) {
  const { isSignedIn, isLoaded } = useAuth()
  const clerk = useClerk()
  const navigate = useNavigate()
  const location = useLocation()
  const [shouldRender, setShouldRender] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    let mounted = true;
    
    const checkAuthState = async () => {
      try {
        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          if (mounted && !shouldRender) {
            console.warn('Clerk loading timeout - showing auth form')
            setShouldRender(true)
            setIsInitializing(false)
          }
        }, 5000) // 5 second timeout
        
        // Wait for Clerk to be fully loaded
        if (!clerk.loaded) {
          await new Promise(resolve => {
            const checkLoaded = setInterval(() => {
              if (clerk.loaded || !mounted) {
                clearInterval(checkLoaded)
                clearTimeout(timeout)
                resolve(true)
              }
            }, 100)
          })
        }
        
        if (!mounted) return;
        
        // Check if user is signed in
        if (isLoaded && isSignedIn) {
          // Get redirect URL from location state or default
          const from = location.state?.from?.pathname || '/'
          navigate(from, { replace: true })
        } else if (isLoaded) {
          // Only render auth components after confirming not signed in
          setShouldRender(true)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Still show auth form on error
        if (mounted) {
          setShouldRender(true)
        }
      } finally {
        if (mounted) {
          setIsInitializing(false)
        }
      }
    }
    
    checkAuthState()
    
    return () => {
      mounted = false
    }
  }, [isLoaded, isSignedIn, navigate, clerk, location])

  // Show loading state while initializing
  if (isInitializing || !shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const appearance = {
    elements: {
      rootBox: 'w-full',
      card: 'shadow-none border-0 p-0',
    },
    variables: {
      colorPrimary: '#3B82F6'
    }
  }

  return mode === 'signup' ? (
    <SignUp 
      appearance={appearance}
      fallbackRedirectUrl="/"
      signInUrl="/auth"
    />
  ) : (
    <SignIn 
      appearance={appearance}
      fallbackRedirectUrl="/"
      signUpUrl="/auth"
    />
  )
}