import React from 'react'
import { Button } from './ui/Button'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ClerkErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Clerk authentication error:', error)
    console.error('Error info:', errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Authentication Error
          </h3>
          <p className="text-sm text-red-700 mb-4">
            {this.state.error?.message || 'An error occurred with the authentication system.'}
          </p>
          <details className="text-xs text-red-600 mb-4">
            <summary className="cursor-pointer">Technical details</summary>
            <pre className="mt-2 overflow-auto">{this.state.error?.stack}</pre>
          </details>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="small"
          >
            Reload Page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}