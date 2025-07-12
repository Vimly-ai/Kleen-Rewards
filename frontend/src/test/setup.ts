import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock environment variables
vi.mock('import.meta', () => ({
  env: {
    VITE_SUPABASE_URL: 'https://test.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-key',
    VITE_ENABLE_MOCK_DATA: 'true',
    DEV: true,
    PROD: false
  }
}))

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      publicMetadata: { role: 'employee' }
    },
    isSignedIn: true,
    isLoaded: true
  }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignIn: () => <div data-testid="sign-in">Sign In</div>,
  SignUp: () => <div data-testid="sign-up">Sign Up</div>,
  UserButton: () => <div data-testid="user-button">User Button</div>
}))

// Mock Supabase
vi.mock('../services/supabase', () => ({
  default: {
    createUser: vi.fn(),
    getUser: vi.fn(),
    updateUser: vi.fn(),
    getAllUsers: vi.fn(),
    getUserCheckIns: vi.fn(),
    getTodaysCheckIn: vi.fn(),
    createCheckIn: vi.fn(),
    getRewards: vi.fn(),
    createReward: vi.fn(),
    updateReward: vi.fn(),
    getUserRedemptions: vi.fn(),
    getPendingRedemptions: vi.fn(),
    createRedemption: vi.fn(),
    fulfillRedemption: vi.fn(),
    getUserBadges: vi.fn(),
    getMotivationalQuote: vi.fn(),
    getSystemSetting: vi.fn(),
    setSystemSetting: vi.fn(),
    getUserStats: vi.fn(),
    getDashboardStats: vi.fn(),
    getLeaderboard: vi.fn(),
    deleteReward: vi.fn(),
    updateBadge: vi.fn(),
    deleteBadge: vi.fn(),
    updateQuote: vi.fn(),
    deleteQuote: vi.fn()
  }
}))

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/dashboard' }),
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children
  }
})

// Mock Sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  }
}))

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: () => Date.now(),
    getEntriesByType: () => [],
    getEntriesByName: () => [],
    mark: vi.fn(),
    measure: vi.fn()
  }
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Suppress console errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})