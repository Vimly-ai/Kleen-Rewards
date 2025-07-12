import { Link } from 'react-router-dom'
import { Shield, ArrowLeft, Home } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'

export default function UnauthorizedPage() {
  const { user } = useUser()
  const userRole = user?.publicMetadata?.role as string || 'employee'

  const getRedirectPath = () => {
    return userRole === 'admin' || userRole === 'super_admin' ? '/admin' : '/employee'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Unauthorized Illustration */}
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page. 
            Please contact your administrator if you believe this is an error.
          </p>
        </div>

        {/* User Info */}
        <div className="bg-gray-100 rounded-lg p-4 text-sm">
          <div className="text-gray-600">Current Role:</div>
          <div className="font-medium text-gray-900 capitalize">
            {userRole}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            to={getRedirectPath()}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="text-sm text-gray-500">
          Need different permissions? Contact your system administrator.
        </div>
      </div>
    </div>
  )
}