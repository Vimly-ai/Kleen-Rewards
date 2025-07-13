import { useAuth, useClerk, useSignIn, useSignUp } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/Button'

export function ClerkAuthDebug() {
  const { isLoaded: authLoaded, isSignedIn, userId } = useAuth()
  const clerk = useClerk()
  const { isLoaded: signInLoaded, signIn } = useSignIn()
  const { isLoaded: signUpLoaded, signUp } = useSignUp()
  const [clerkError, setClerkError] = useState<string | null>(null)
  const [networkError, setNetworkError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Clerk is properly initialized
    if (clerk.loaded) {
      console.log('✅ Clerk instance loaded successfully')
      console.log('Clerk version:', clerk.version)
      console.log('Frontend API:', clerk.frontendApi)
      console.log('Instance:', clerk)
    } else {
      console.log('⏳ Clerk instance not yet loaded')
    }

    // Monitor for Clerk errors
    const checkClerkHealth = async () => {
      try {
        // Test if we can reach Clerk's API
        const testUrl = `https://${clerk.frontendApi || 'api.clerk.dev'}/.well-known/jwks.json`
        const response = await fetch(testUrl, { mode: 'no-cors' })
        console.log('Clerk API reachable')
      } catch (error) {
        setNetworkError(`Cannot reach Clerk API: ${error}`)
        console.error('Clerk API error:', error)
      }
    }

    if (clerk.loaded) {
      checkClerkHealth()
    }

    // Listen for Clerk errors
    const handleError = (event: ErrorEvent) => {
      if (event.message.toLowerCase().includes('clerk')) {
        setClerkError(event.message)
        console.error('Clerk error detected:', event)
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [clerk])

  // Test OAuth providers
  const testOAuthProvider = async (provider: string) => {
    if (!signIn) {
      console.error('SignIn not available')
      return
    }

    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: window.location.origin + '/auth',
        redirectUrlComplete: window.location.origin
      })
    } catch (error) {
      console.error(`OAuth ${provider} error:`, error)
      setClerkError(`OAuth ${provider} failed: ${error}`)
    }
  }

  if (!import.meta.env.DEV) return null

  return (
    <div className="fixed bottom-20 right-4 bg-white border border-gray-300 shadow-lg rounded-lg p-4 max-w-md text-xs space-y-2">
      <h3 className="font-bold text-sm mb-2">Clerk Auth Debug</h3>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Clerk Loaded:</span>
          <span className={clerk.loaded ? 'text-green-600' : 'text-red-600'}>
            {String(clerk.loaded)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Auth Loaded:</span>
          <span className={authLoaded ? 'text-green-600' : 'text-red-600'}>
            {String(authLoaded)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>SignIn Ready:</span>
          <span className={signInLoaded ? 'text-green-600' : 'text-red-600'}>
            {String(signInLoaded)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>SignUp Ready:</span>
          <span className={signUpLoaded ? 'text-green-600' : 'text-red-600'}>
            {String(signUpLoaded)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Signed In:</span>
          <span className={isSignedIn ? 'text-green-600' : 'text-gray-600'}>
            {String(isSignedIn)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>User ID:</span>
          <span className="text-gray-600 truncate max-w-[150px]">
            {userId || 'none'}
          </span>
        </div>
      </div>

      {clerkError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
          <strong>Clerk Error:</strong>
          <div className="text-xs mt-1">{clerkError}</div>
        </div>
      )}

      {networkError && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
          <strong>Network Issue:</strong>
          <div className="text-xs mt-1">{networkError}</div>
        </div>
      )}

      <div className="mt-3 space-y-2">
        <div className="text-xs font-semibold">Test OAuth Providers:</div>
        <div className="flex gap-2">
          <Button
            size="small"
            variant="outline"
            onClick={() => testOAuthProvider('google')}
            disabled={!signInLoaded}
          >
            Google
          </Button>
          <Button
            size="small"
            variant="outline"
            onClick={() => testOAuthProvider('github')}
            disabled={!signInLoaded}
          >
            GitHub
          </Button>
        </div>
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-semibold">Environment</summary>
        <pre className="mt-1 text-xs overflow-auto bg-gray-50 p-2 rounded">
{JSON.stringify({
  CLERK_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + '...',
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  BASE_URL: import.meta.env.BASE_URL
}, null, 2)}
        </pre>
      </details>
    </div>
  )
}