import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import App from '../../App'

// Mock the stores
vi.mock('../../stores/appStore', () => ({
  useAppStore: (selector?: (state: any) => any) => {
    const mockState = {
      theme: 'light',
      features: {
        notifications: true,
        realTimeUpdates: true,
        offlineMode: true,
        analytics: true
      }
    }
    return selector ? selector(mockState) : mockState
  }
}))

vi.mock('../../stores/websocketStore', () => ({
  useWebSocketStore: (selector?: (state: any) => any) => {
    const mockState = {
      initialize: vi.fn()
    }
    return selector ? selector(mockState) : mockState
  }
}))

vi.mock('../../stores/notificationStore', () => ({
  useNotificationStore: (selector?: (state: any) => any) => {
    const mockState = {
      notifications: []
    }
    return selector ? selector(mockState) : mockState
  }
}))

// Mock services
vi.mock('../../services/notifications', () => ({
  useNotificationService: () => ({
    initialize: vi.fn().mockResolvedValue(true)
  })
}))

vi.mock('../../utils/performance', () => ({
  performance: {
    initialize: vi.fn(),
    markStart: vi.fn(),
    markEnd: vi.fn(),
    measure: vi.fn(),
    recordError: vi.fn()
  }
}))

vi.mock('../../utils/pwa', () => ({
  swUtils: {
    isSupported: () => true,
    register: vi.fn().mockResolvedValue(true)
  }
}))

// Mock router
vi.mock('../../router/AppRouter', () => ({
  AppRouter: () => <div data-testid="app-router">App Router</div>
}))

// Mock PWA components
vi.mock('../../components/pwa', () => ({
  InstallPrompt: () => <div data-testid="install-prompt">Install Prompt</div>,
  UpdatePrompt: () => <div data-testid="update-prompt">Update Prompt</div>,
  OfflineIndicator: () => <div data-testid="offline-indicator">Offline Indicator</div>
}))

// Mock data context
vi.mock('../../contexts/DataContext', () => ({
  DataProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="data-provider">{children}</div>
  )
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('app-router')).toBeInTheDocument()
    })
  })

  it('renders all PWA components', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('install-prompt')).toBeInTheDocument()
      expect(screen.getByTestId('update-prompt')).toBeInTheDocument()
      expect(screen.getByTestId('offline-indicator')).toBeInTheDocument()
    })
  })

  it('provides all necessary context providers', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('data-provider')).toBeInTheDocument()
    })
  })

  it('handles initialization errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock initialization failure
    vi.mocked(vi.importMock('../../services/notifications')).mockImplementation(() => ({
      useNotificationService: () => ({
        initialize: vi.fn().mockRejectedValue(new Error('Init failed'))
      })
    }))
    
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('app-router')).toBeInTheDocument()
    })
    
    consoleSpy.mockRestore()
  })

  it('applies theme correctly', async () => {
    // Mock light theme
    vi.mocked(vi.importMock('../../stores/appStore')).mockImplementation(() => ({
      useAppStore: (selector?: (state: any) => any) => {
        const mockState = {
          theme: 'light',
          features: {
            notifications: true,
            realTimeUpdates: true,
            offlineMode: true,
            analytics: true
          }
        }
        return selector ? selector(mockState) : mockState
      }
    }))

    render(<App />)
    
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  it('initializes performance monitoring', async () => {
    const { performance } = await import('../../utils/performance')
    
    render(<App />)
    
    await waitFor(() => {
      expect(performance.initialize).toHaveBeenCalled()
      expect(performance.markStart).toHaveBeenCalledWith('app-initialization')
    })
  })

  it('shows loading spinner during initialization', () => {
    render(<App />)
    
    // The loading spinner should be rendered initially
    expect(screen.getByText(/Loading Employee Rewards/)).toBeInTheDocument()
  })
})