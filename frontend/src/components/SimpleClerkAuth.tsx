import { SignIn, SignUp } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { ClerkErrorBoundary } from './ClerkErrorBoundary'

interface SimpleClerkAuthProps {
  mode: 'signin' | 'signup'
}

export function SimpleClerkAuth({ mode }: SimpleClerkAuthProps) {
  useEffect(() => {
    console.log('SimpleClerkAuth rendering, mode:', mode)
  }, [mode])

  const appearance = {
    elements: {
      rootBox: 'w-full',
      card: 'shadow-none border-0 p-0',
    },
    variables: {
      colorPrimary: '#3B82F6'
    }
  }

  // Use afterSignInUrl and afterSignUpUrl instead of redirectUrl
  const signInProps = {
    appearance,
    afterSignInUrl: '/',
    signUpUrl: '/auth',
    routing: 'path' as const,
    path: '/auth'
  }

  const signUpProps = {
    appearance,
    afterSignUpUrl: '/',
    signInUrl: '/auth',
    routing: 'path' as const,
    path: '/auth'
  }

  return (
    <ClerkErrorBoundary>
      {mode === 'signup' ? (
        <SignUp {...signUpProps} />
      ) : (
        <SignIn {...signInProps} />
      )}
    </ClerkErrorBoundary>
  )
}