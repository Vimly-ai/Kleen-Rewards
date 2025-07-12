/**
 * Demo Sign In Component - Enterprise Employee Rewards System
 * 
 * Sign in form for demo mode authentication
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useDemoAuth } from '../contexts/DemoAuthContext'
import { DEMO_CREDENTIALS } from '../services/demoData'

export const DemoSignIn: React.FC = () => {
  const navigate = useNavigate()
  const { signIn } = useDemoAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const success = await signIn(email, password)
      if (success) {
        toast.success('Welcome back!')
        
        // Wait a moment for auth state to propagate
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Navigate based on role
        const isAdmin = email === DEMO_CREDENTIALS.admin.email
        navigate(isAdmin ? '/admin' : '/employee', { replace: true })
      } else {
        setError('Invalid email or password')
        setLoading(false)
      }
    } catch (err) {
      console.error('Demo login error:', err)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const fillCredentials = (type: 'admin' | 'user') => {
    const creds = type === 'admin' ? DEMO_CREDENTIALS.admin : DEMO_CREDENTIALS.user
    setEmail(creds.email)
    setPassword(creds.password)
    setError('')
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your email"
                required
              />
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your password"
                required
              />
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Quick fill</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              size="small"
              onClick={() => fillCredentials('admin')}
              className="text-sm"
            >
              Admin Demo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="small"
              onClick={() => fillCredentials('user')}
              className="text-sm"
            >
              Employee Demo
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}