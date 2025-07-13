import { ExternalLink, Key, Copy } from 'lucide-react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

export function ClerkDashboardHelper() {
  const instanceUrl = 'golden-grackle-88'
  
  return (
    <Card className="p-6 bg-blue-50 border-blue-200">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Key className="w-6 h-6 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Find Your Publishable Key
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Based on your JWKS key, your Clerk instance is <code className="bg-white px-2 py-1 rounded">{instanceUrl}</code>
            </p>
            
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Quick Links to Your Dashboard:</p>
                <div className="space-y-2">
                  <a
                    href={`https://dashboard.clerk.com/apps/app_2qGkVfYPA6u4QmYWjQmWGEvKJHR/instances/ins_2qGkVgLT8N0zPlwFOC1wt0xHuMm`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Try: Direct link to your instance
                  </a>
                  <a
                    href="https://dashboard.clerk.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Or: Go to main dashboard
                  </a>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>What to look for:</strong> In the API Keys section, find the key that starts with{' '}
                  <code className="bg-yellow-100 px-1 rounded">pk_test_</code> and is about 100-150 characters long.
                  It will NOT be the short key you currently have.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Your publishable key will look like:</p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
pk_test_Y2xlcmstbGl2ZS1leGFtcGxlLTEyMy5jbGVyay5hY2NvdW50cy5kZXYkMTIzNDU2Nzg5MGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGRw
                </pre>
                <p className="text-xs text-gray-600 mt-2">
                  Note: Much longer than your current key
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}