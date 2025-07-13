import { useState } from 'react'
import { DemoCredentials } from '../../components/DemoCredentials'
import { DemoSignIn } from '../../components/DemoSignIn'
import { SimpleClerkAuth } from '../../components/SimpleClerkAuth'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  // Start with demo login shown by default in demo mode
  const isDemoMode = true // import.meta.env.VITE_ENABLE_MOCK_DATA === 'true'
  const [showDemoLogin, setShowDemoLogin] = useState(isDemoMode)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className={`${isDemoMode && showDemoLogin ? 'max-w-5xl' : 'max-w-md'} w-full`}>
        <div className={`${isDemoMode && showDemoLogin ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-start' : 'space-y-8'}`}>
          <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Employee Rewards
          </h2>
          <p className="mt-2 text-gray-600">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Auth Component */}
        {showDemoLogin && isDemoMode ? (
          <DemoSignIn />
        ) : (
          <>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Clerk authentication is currently in development mode. 
                For testing, please use the "Use demo accounts" option below.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <SimpleClerkAuth mode={isSignUp ? 'signup' : 'signin'} />
            </div>
          </>
        )}
        
        {/* Demo Mode Options */}
        {isDemoMode && (
          <div className="mt-4 space-y-3">
            <div className="text-center">
              <button
                onClick={() => setShowDemoLogin(!showDemoLogin)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium underline"
              >
                {showDemoLogin ? 'Use regular sign in' : 'Use demo accounts'}
              </button>
            </div>
            
            {!showDemoLogin && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-700 text-center">
                  🎯 To test with demo accounts, click "Use demo accounts" above
                </p>
              </div>
            )}
          </div>
        )}

        {/* Toggle */}
        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
          </div>
          
          {/* Demo Credentials (only shown in demo mode) */}
          {isDemoMode && showDemoLogin && (
            <div className="lg:mt-0">
              <DemoCredentials />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}