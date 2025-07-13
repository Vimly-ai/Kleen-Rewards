import { useEffect, useState } from 'react'
import { Card } from './ui/Card'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export function ClerkKeyValidator() {
  const [status, setStatus] = useState<'checking' | 'valid' | 'invalid'>('checking')
  const [error, setError] = useState<string | null>(null)
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  useEffect(() => {
    async function validateKey() {
      try {
        // First check format
        if (!clerkKey || (!clerkKey.startsWith('pk_test_') && !clerkKey.startsWith('pk_live_'))) {
          setStatus('invalid')
          setError('Key format is invalid')
          return
        }

        // Try to initialize Clerk with the key
        const response = await fetch(`https://api.clerk.dev/v1/public/interstitial`, {
          headers: {
            'Authorization': `Bearer ${clerkKey}`,
            'Content-Type': 'application/json'
          }
        }).catch(() => null)

        if (response && response.ok) {
          setStatus('valid')
        } else {
          setStatus('invalid')
          setError('Key validation failed with Clerk API')
        }
      } catch (err) {
        setStatus('invalid')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    validateKey()
  }, [clerkKey])

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center gap-3">
        {status === 'checking' && (
          <>
            <Loader className="w-5 h-5 text-blue-500 animate-spin" />
            <span className="text-sm text-gray-600">Validating Clerk key...</span>
          </>
        )}
        {status === 'valid' && (
          <>
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-700">Clerk key is valid</span>
          </>
        )}
        {status === 'invalid' && (
          <>
            <XCircle className="w-5 h-5 text-red-500" />
            <div>
              <span className="text-sm text-red-700">Clerk key is invalid</span>
              {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </div>
          </>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Current key: {clerkKey ? `${clerkKey.substring(0, 30)}...` : 'Not configured'}
      </div>
    </Card>
  )
}