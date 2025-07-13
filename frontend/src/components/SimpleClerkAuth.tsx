import { SignIn, SignUp } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { ClerkErrorBoundary } from './ClerkErrorBoundary'

interface SimpleClerkAuthProps {
  mode: 'signin' | 'signup'
}

export function SimpleClerkAuth({ mode }: SimpleClerkAuthProps) {

  const appearance = {
    elements: {
      rootBox: 'w-full',
      card: 'shadow-none border-0 p-0',
    },
    variables: {
      colorPrimary: '#3B82F6'
    }
  }

  // Simplified props without routing to prevent conflicts
  const signInProps = {
    appearance,
    afterSignInUrl: window.location.origin,
    signUpUrl: window.location.origin + '/auth'
  }

  const signUpProps = {
    appearance,
    afterSignUpUrl: window.location.origin,
    signInUrl: window.location.origin + '/auth'
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