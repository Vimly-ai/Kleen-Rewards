import { useEffect, useState } from 'react'
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

interface ClerkAuthWrapperProps {
  mode: 'signin' | 'signup'
}

export function ClerkAuthWrapper({ mode }: ClerkAuthWrapperProps) {
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Prevent rendering until Clerk is loaded
    if (isLoaded) {
      if (isSignedIn) {
        // If already signed in, redirect away from auth page
        navigate('/', { replace: true })
      } else {
        // Only render auth components if not signed in
        setShouldRender(true)
      }
    }
  }, [isLoaded, isSignedIn, navigate])

  // Don't render anything until we've checked auth state
  if (!shouldRender) {
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