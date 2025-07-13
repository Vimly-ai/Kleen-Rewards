import { AlertCircle, ExternalLink, Copy, CheckCircle } from 'lucide-react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { useState } from 'react'
import { toast } from 'sonner'

export function ClerkSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedStep(null), 2000)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              OAuth Authentication Setup Required
            </h3>
            <p className="text-gray-600 mb-4">
              The application needs a valid Clerk API key to enable sign up and sign in with Google, GitHub, and other providers.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Current Status:</strong> Invalid or missing Clerk configuration detected. 
                OAuth features are disabled.
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Current key: {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 
                  `${import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.substring(0, 20)}...` : 
                  'Not configured'}
              </p>
            </div>

            <h4 className="font-medium text-gray-900 mb-3">Quick Setup Guide:</h4>
            
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Create a free account at{' '}
                    <a 
                      href="https://clerk.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 font-medium"
                    >
                      clerk.com
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Create a new application in your Clerk dashboard
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2">
                    Copy your publishable key and add to <code className="bg-gray-100 px-1 rounded">.env</code>:
                  </p>
                  <div className="bg-gray-100 rounded-lg p-3 relative">
                    <pre className="text-xs overflow-x-auto">
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here</pre>
                    <button
                      onClick={() => copyToClipboard('VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here', 3)}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                    >
                      {copiedStep === 3 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2">
                    In Clerk dashboard, configure these URLs:
                  </p>
                  <div className="bg-gray-50 rounded p-3 space-y-1 text-xs">
                    <div>
                      <span className="font-medium">Sign-in URL:</span>{' '}
                      <code className="bg-white px-1 rounded">/auth</code>
                    </div>
                    <div>
                      <span className="font-medium">After sign-in URL:</span>{' '}
                      <code className="bg-white px-1 rounded">/</code>
                    </div>
                    <div className="pt-2">
                      <span className="font-medium">Allowed redirect URLs:</span>
                      <ul className="mt-1 ml-4 list-disc list-inside">
                        <li><code className="bg-white px-1 rounded">http://localhost:5173</code></li>
                        <li><code className="bg-white px-1 rounded">https://employee-rewards.netlify.app</code></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                  5
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    Enable OAuth providers (Google, GitHub, etc.) and restart your server
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                as="a"
                href="/Users/andrewfackrell/SuperClaude/Employee-Rewards-/frontend/.env.clerk.example"
                target="_blank"
                size="sm"
                variant="outline"
                className="w-full"
              >
                View Detailed Setup Instructions
              </Button>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Continue with Demo Mode:</strong> You can test the application using demo accounts 
                  while setting up OAuth. The demo provides full functionality without real authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}