/**
 * Demo Credentials Component - Enterprise Employee Rewards System
 * 
 * Displays demo login credentials for testing the application
 */

import React from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { DEMO_CREDENTIALS } from '../services/demoData'
import { Copy, User, Shield } from 'lucide-react'
import { toast } from 'sonner'

export const DemoCredentials: React.FC = () => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Demo Accounts</h3>
            <p className="text-sm text-gray-600">Use these credentials to explore the system</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Admin Account */}
          <div className="bg-white/80 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                <h4 className="font-medium text-gray-900">Admin Account</h4>
                <Badge variant="warning" size="sm">Full Access</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{DEMO_CREDENTIALS.admin.description}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <div>
                  <span className="text-xs text-gray-500">Email:</span>
                  <p className="font-mono text-sm">{DEMO_CREDENTIALS.admin.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => copyToClipboard(DEMO_CREDENTIALS.admin.email, 'Email')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <div>
                  <span className="text-xs text-gray-500">Password:</span>
                  <p className="font-mono text-sm">{DEMO_CREDENTIALS.admin.password}</p>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => copyToClipboard(DEMO_CREDENTIALS.admin.password, 'Password')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Employee Account */}
          <div className="bg-white/80 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                <h4 className="font-medium text-gray-900">Employee Account</h4>
                <Badge variant="primary" size="sm">Standard Access</Badge>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{DEMO_CREDENTIALS.user.description}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <div>
                  <span className="text-xs text-gray-500">Email:</span>
                  <p className="font-mono text-sm">{DEMO_CREDENTIALS.user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => copyToClipboard(DEMO_CREDENTIALS.user.email, 'Email')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <div>
                  <span className="text-xs text-gray-500">Password:</span>
                  <p className="font-mono text-sm">{DEMO_CREDENTIALS.user.password}</p>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => copyToClipboard(DEMO_CREDENTIALS.user.password, 'Password')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>Demo Features:</strong> Check-in system • Points tracking • Rewards marketplace • 
            Achievements • Leaderboard • Admin analytics • Real-time updates
          </p>
        </div>
      </div>
    </Card>
  )
}