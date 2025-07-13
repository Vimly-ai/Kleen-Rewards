import { SignIn, SignUp } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { ClerkErrorBoundary } from './ClerkErrorBoundary'

interface SimpleClerkAuthProps {
  mode: 'signin' | 'signup'
}

export function SimpleClerkAuth({ mode }: SimpleClerkAuthProps) {
  // Log for debugging
  useEffect(() => {
    console.log('SimpleClerkAuth rendered with mode:', mode)
  }, [mode])

  const appearance = {
    elements: {
      rootBox: 'w-full',
      card: 'shadow-none border-0 p-0',
      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
      socialButtonsBlockButton: 'border-gray-300',
      formFieldInput: 'border-gray-300',
      footerActionLink: 'text-blue-600 hover:text-blue-700'
    },
    variables: {
      colorPrimary: '#3B82F6',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorTextSecondary: '#6b7280',
      colorDanger: '#ef4444',
      borderRadius: '0.5rem'
    }
  }

  // Simplified routing configuration
  const routingProps = {
    routing: 'path',
    path: '/auth',
    afterSignInUrl: '/',
    afterSignUpUrl: '/',
    redirectUrl: '/'
  }

  return (
    <ClerkErrorBoundary>
      {mode === 'signup' ? (
        <SignUp 
          appearance={appearance}
          {...routingProps}
        />
      ) : (
        <SignIn 
          appearance={appearance}
          {...routingProps}
        />
      )}
    </ClerkErrorBoundary>
  )
}