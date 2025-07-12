import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from '../../App'

// Create test wrapper
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

// Mock Clerk with different auth states
const mockClerkStates = {
  signedOut: {
    isSignedIn: false,
    isLoaded: true,
    user: null
  },
  signedInEmployee: {
    isSignedIn: true,
    isLoaded: true,
    user: {
      id: 'employee-123',
      firstName: 'John',
      lastName: 'Doe',
      emailAddresses: [{ emailAddress: 'john@company.com' }],
      publicMetadata: { role: 'employee' }
    }
  },
  signedInAdmin: {
    isSignedIn: true,
    isLoaded: true,
    user: {
      id: 'admin-456',
      firstName: 'Jane',
      lastName: 'Smith',
      emailAddresses: [{ emailAddress: 'jane@company.com' }],
      publicMetadata: { role: 'admin' }
    }
  },
  loading: {
    isSignedIn: false,
    isLoaded: false,
    user: null
  }
}

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect unauthenticated users to auth page', async () => {
    // Mock signed out state
    vi.mocked('@clerk/clerk-react', true).useUser.mockReturnValue(mockClerkStates.signedOut)

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('sign-in')).toBeInTheDocument()
    })
  })

  it('should redirect employees to employee dashboard after sign in', async () => {
    // Mock employee sign in
    vi.mocked('@clerk/clerk-react', true).useUser.mockReturnValue(mockClerkStates.signedInEmployee)

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(window.location.pathname).toBe('/employee')
    })
  })

  it('should redirect admins to admin dashboard after sign in', async () => {
    // Mock admin sign in
    vi.mocked('@clerk/clerk-react', true).useUser.mockReturnValue(mockClerkStates.signedInAdmin)

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(window.location.pathname).toBe('/admin')
    })
  })

  it('should show loading state while authentication is loading', async () => {
    // Mock loading state
    vi.mocked('@clerk/clerk-react', true).useUser.mockReturnValue(mockClerkStates.loading)

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    expect(screen.getByText(/Loading Employee Rewards/)).toBeInTheDocument()
  })

  it('should handle role-based access control', async () => {
    // Start with employee user
    vi.mocked('@clerk/clerk-react', true).useUser.mockReturnValue(mockClerkStates.signedInEmployee)

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    // Try to access admin route (should be redirected)
    fireEvent.click(screen.getByText('Admin'))

    await waitFor(() => {
      expect(screen.getByTestId('unauthorized')).toBeInTheDocument()
    })
  })

  it('should persist auth state across page refreshes', async () => {
    // Mock persistent auth state
    const mockLocalStorage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify({
        user: mockClerkStates.signedInEmployee.user,
        isSignedIn: true
      })),
      setItem: vi.fn(),
      removeItem: vi.fn()
    }

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    })

    vi.mocked('@clerk/clerk-react', true).useUser.mockReturnValue(mockClerkStates.signedInEmployee)

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('employee-dashboard')).toBeInTheDocument()
    })
  })

  it('should handle sign out flow correctly', async () => {
    // Start signed in
    vi.mocked('@clerk/clerk-react', true).useUser.mockReturnValue(mockClerkStates.signedInEmployee)

    const { rerender } = render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('employee-dashboard')).toBeInTheDocument()
    })

    // Mock sign out
    vi.mocked('@clerk/clerk-react', true).useUser.mockReturnValue(mockClerkStates.signedOut)

    rerender(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('sign-in')).toBeInTheDocument()
    })
  })

  it('should handle auth errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock auth error
    vi.mocked('@clerk/clerk-react', true).ClerkProvider.mockImplementation(() => {
      throw new Error('Auth service unavailable')
    })

    expect(() =>
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      )
    ).toThrow('Auth service unavailable')

    consoleSpy.mockRestore()
  })

  it('should update user metadata correctly', async () => {
    const user = userEvent.setup()
    vi.mocked('@clerk/clerk-react', true).useUser.mockReturnValue(mockClerkStates.signedInEmployee)

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    // Navigate to profile
    await user.click(screen.getByText('Profile'))

    await waitFor(() => {
      expect(screen.getByTestId('user-profile')).toBeInTheDocument()
    })

    // Update profile info
    const nameInput = screen.getByLabelText('First Name')
    await user.clear(nameInput)
    await user.type(nameInput, 'Updated Name')

    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument()
    })
  })

  it('should handle concurrent auth state changes', async () => {
    let authState = mockClerkStates.loading

    vi.mocked('@clerk/clerk-react', true).useUser.mockImplementation(() => authState)

    const { rerender } = render(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    // Simulate rapid auth state changes
    authState = mockClerkStates.signedOut
    rerender(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    authState = mockClerkStates.signedInEmployee
    rerender(
      <TestWrapper>
        <App />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByTestId('employee-dashboard')).toBeInTheDocument()
    })
  })
})