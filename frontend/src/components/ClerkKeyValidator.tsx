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
        if (!clerkKey) {
          setStatus('invalid')
          setError('No key provided')
          return
        }

        // Log for debugging
        console.log('Validating Clerk key with API...')
        
        // Let Clerk handle the validation - just check if key exists
        setStatus('valid')
        setError(null)
        
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
            <span className="text-sm text-green-700">Clerk key detected - attempting to initialize</span>
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