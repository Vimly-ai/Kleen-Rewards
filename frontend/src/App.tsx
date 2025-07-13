import React, { useEffect, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'

// Context Providers
import { DataProvider } from './contexts/DataContext'
import { DemoAuthProvider } from './contexts/DemoAuthContext'

// Components
import { AppRouter } from './router/AppRouter'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSpinner } from './components/shared/LoadingSpinner'
import { InstallPrompt, UpdatePrompt, OfflineIndicator } from './components/pwa'

// Services and Utils
import { useNotificationService } from './services/notifications'
import { performanceMonitor } from './utils/performance'
import { swUtils } from './utils/pwa'

// Stores
import { useAppStore } from './stores/appStore'
import { useWebSocketStore } from './stores/websocketStore'
import { useNotificationStore } from './stores/notificationStore'

// Styles
import './index.css'

// Create a single query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Get Clerk publishable key - with correct fallback
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Z29sZGVuLWdyYWNrbGUtODguY2xlcmsuYWNjb3VudHMuZGV2JA'

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

console.log('Using Clerk key:', PUBLISHABLE_KEY.substring(0, 20) + '...')

// Performance and Feature Initialization Component
function AppInitializer() {
  const { initialize } = useNotificationService()
  const initializeWebSocket = useWebSocketStore((state) => state.initialize)
  const features = useAppStore((state) => state.features)

  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.initialize()
    performanceMonitor.markStart('app-initialization')

    const initializeApp = async () => {
      try {
        // Initialize PWA features
        if (swUtils.isSupported()) {
          await swUtils.register({
            onUpdate: () => {
              console.log('Service worker update available')
              // You could dispatch an action to show update notification
            },
            onSuccess: () => {
              console.log('Service worker registered successfully')
            },
            onError: (error) => {
              console.error('Service worker registration failed:', error)
            },
          })
        }

        // Initialize notification service
        if (features.notifications) {
          try {
            await initialize()
          } catch (error) {
            console.warn('Failed to initialize notifications:', error)
          }
        }

        // Initialize WebSocket if real-time updates are enabled
        if (features.realTimeUpdates) {
          initializeWebSocket()
        }

        performanceMonitor.markEnd('app-initialization')
        performanceMonitor.measure('app-initialization')
      } catch (error) {
        console.error('Failed to initialize app:', error)
        performanceMonitor.markEnd('app-initialization')
      }
    }

    initializeApp()
  }, [initialize, initializeWebSocket, features.notifications, features.realTimeUpdates])

  return null
}

// App Loading Component
function AppLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <LoadingSpinner size="large" text="Loading Employee Rewards..." />
    </div>
  )
}

// Main App Component with all providers
function AppContent() {
  const theme = useAppStore((state) => state.theme)

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else if (theme === 'light') {
      root.removeAttribute('data-theme')
    } else {
      // System theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDark) {
        root.setAttribute('data-theme', 'dark')
      } else {
        root.removeAttribute('data-theme')
      }
    }
  }, [theme])

  return (
    <>
      <AppInitializer />
      <AppRouter />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
      
      {/* PWA Components */}
      <InstallPrompt showMinimized />
      <UpdatePrompt />
      <OfflineIndicator />
    </>
  )
}

// Root App Component
export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Send error to monitoring service
        console.error('Global error caught:', { error, errorInfo })
        performanceMonitor.recordError(error)
      }}
    >
      <DemoAuthProvider>
        <ClerkProvider 
          publishableKey={PUBLISHABLE_KEY}
        >
          <QueryClientProvider client={queryClient}>
            <DataProvider>
              <BrowserRouter>
                <Suspense fallback={<AppLoader />}>
                  <AppContent />
                </Suspense>
                
                {/* Development Tools */}
                {import.meta.env.DEV && (
                  <ReactQueryDevtools initialIsOpen={false} />
                )}
              </BrowserRouter>
            </DataProvider>
          </QueryClientProvider>
        </ClerkProvider>
      </DemoAuthProvider>
    </ErrorBoundary>
  )
}