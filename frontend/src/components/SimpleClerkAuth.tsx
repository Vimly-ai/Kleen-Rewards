import { SignIn, SignUp } from '@clerk/clerk-react'

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

  if (mode === 'signup') {
    return (
      <SignUp 
        appearance={appearance}
        redirectUrl="/"
        signInUrl="/auth"
      />
    )
  }

  return (
    <SignIn 
      appearance={appearance}
      redirectUrl="/"
      signUpUrl="/auth"
    />
  )
}