import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from '../../App'

// Test utilities
function TestApp() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

// Mock API responses
const mockApiResponses = {
  user: {
    id: 'user-123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@company.com',
    role: 'employee',
    points: 150,
    totalPoints: 500,
    checkIns: 25,
    achievements: []
  },
  rewards: [
    {
      id: 'reward-1',
      title: 'Coffee Voucher',
      description: 'Free coffee from cafe',
      pointsCost: 50,
      category: 'food',
      available: true
    },
    {
      id: 'reward-2',
      title: 'Extra Day Off',
      description: 'Additional vacation day',
      pointsCost: 200,
      category: 'time-off',
      available: true
    }
  ],
  checkInSuccess: {
    points: 10,
    message: 'Check-in successful!',
    timestamp: new Date().toISOString()
  }
}

describe('Critical User Flows E2E', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    vi.clearAllMocks()
    
    // Mock successful auth state
    vi.mocked('@clerk/clerk-react', true).useUser.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
      user: {
        id: 'user-123',
        firstName: 'Test',
        lastName: 'User',
        emailAddresses: [{ emailAddress: 'test@company.com' }],
        publicMetadata: { role: 'employee' }
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Employee Check-in Flow', () => {
    it('should complete full check-in process', async () => {
      // Mock QR scanner
      vi.mock('../../components/QRScanner', () => ({
        QRScanner: ({ onScan }: { onScan: (data: string) => void }) => (
          <div>
            <div>QR Scanner</div>
            <button
              onClick={() => onScan('check-in-location-123')}
              data-testid="mock-scan"
            >
              Simulate Scan
            </button>
          </div>
        )
      }))

      render(<TestApp />)

      // Navigate to employee dashboard
      await waitFor(() => {
        expect(screen.getByTestId('employee-dashboard')).toBeInTheDocument()
      })

      // Start check-in process
      const checkInButton = screen.getByRole('button', { name: /check in/i })
      await user.click(checkInButton)

      // Should show QR scanner
      await waitFor(() => {
        expect(screen.getByText('QR Scanner')).toBeInTheDocument()
      })

      // Simulate QR scan
      const scanButton = screen.getByTestId('mock-scan')
      await user.click(scanButton)

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/check.*in.*successful/i)).toBeInTheDocument()
      })

      // Should update points display
      await waitFor(() => {
        expect(screen.getByText(/\+10 points/i)).toBeInTheDocument()
      })
    })

    it('should handle invalid QR codes', async () => {
      render(<TestApp />)

      await waitFor(() => {
        expect(screen.getByTestId('employee-dashboard')).toBeInTheDocument()
      })

      const checkInButton = screen.getByRole('button', { name: /check in/i })
      await user.click(checkInButton)

      // Simulate invalid QR scan
      const invalidScanButton = screen.getByTestId('mock-scan')
      fireEvent.click(invalidScanButton)

      // Mock invalid response
      vi.mocked('../../services/supabase', true).createCheckIn.mockRejectedValue(
        new Error('Invalid location')
      )

      await waitFor(() => {
        expect(screen.getByText(/invalid.*location/i)).toBeInTheDocument()
      })
    })

    it('should prevent duplicate check-ins', async () => {
      // Mock user already checked in today
      vi.mocked('../../services/supabase', true).getTodaysCheckIn.mockResolvedValue({
        id: 'checkin-123',
        timestamp: new Date().toISOString()
      })

      render(<TestApp />)

      await waitFor(() => {
        expect(screen.getByTestId('employee-dashboard')).toBeInTheDocument()
      })

      // Check-in button should be disabled
      const checkInButton = screen.getByRole('button', { name: /already checked in/i })
      expect(checkInButton).toBeDisabled()
    })
  })

  describe('Rewards Redemption Flow', () => {
    it('should complete reward redemption successfully', async () => {
      render(<TestApp />)

      // Navigate to rewards page
      const rewardsLink = screen.getByRole('link', { name: /rewards/i })
      await user.click(rewardsLink)

      await waitFor(() => {
        expect(screen.getByTestId('rewards-page')).toBeInTheDocument()
      })

      // Should display available rewards
      await waitFor(() => {
        expect(screen.getByText('Coffee Voucher')).toBeInTheDocument()
        expect(screen.getByText('Extra Day Off')).toBeInTheDocument()
      })

      // Redeem affordable reward
      const coffeeReward = screen.getByText('Coffee Voucher').closest('[data-testid=\"reward-card\"]')
      const redeemButton = coffeeReward?.querySelector('button[aria-label=\"Redeem\"]')
      
      expect(redeemButton).not.toBeDisabled()
      await user.click(redeemButton!)

      // Should show confirmation dialog
      await waitFor(() => {
        expect(screen.getByText(/confirm redemption/i)).toBeInTheDocument()
      })

      // Confirm redemption
      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      await user.click(confirmButton)

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/redeemed successfully/i)).toBeInTheDocument()
      })

      // Should update user points
      await waitFor(() => {
        expect(screen.getByText(/100.*points/i)).toBeInTheDocument() // 150 - 50 = 100
      })
    })

    it('should prevent redemption of unaffordable rewards', async () => {
      render(<TestApp />)

      const rewardsLink = screen.getByRole('link', { name: /rewards/i })
      await user.click(rewardsLink)

      await waitFor(() => {
        expect(screen.getByTestId('rewards-page')).toBeInTheDocument()
      })

      // Try to redeem expensive reward (200 points, user has 150)
      const expensiveReward = screen.getByText('Extra Day Off').closest('[data-testid=\"reward-card\"]')
      const redeemButton = expensiveReward?.querySelector('button[aria-label=\"Redeem\"]')
      
      expect(redeemButton).toBeDisabled()
    })

    it('should filter rewards by category', async () => {
      render(<TestApp />)

      const rewardsLink = screen.getByRole('link', { name: /rewards/i })
      await user.click(rewardsLink)

      await waitFor(() => {
        expect(screen.getByTestId('rewards-page')).toBeInTheDocument()
      })

      // Filter by food category
      const foodFilter = screen.getByRole('button', { name: /food/i })
      await user.click(foodFilter)

      await waitFor(() => {
        expect(screen.getByText('Coffee Voucher')).toBeInTheDocument()
        expect(screen.queryByText('Extra Day Off')).not.toBeInTheDocument()
      })

      // Clear filter
      const allFilter = screen.getByRole('button', { name: /all/i })
      await user.click(allFilter)

      await waitFor(() => {
        expect(screen.getByText('Coffee Voucher')).toBeInTheDocument()
        expect(screen.getByText('Extra Day Off')).toBeInTheDocument()
      })
    })
  })

  describe('Profile Management Flow', () => {
    it('should update profile information', async () => {
      render(<TestApp />)

      // Navigate to profile
      const profileLink = screen.getByRole('link', { name: /profile/i })
      await user.click(profileLink)

      await waitFor(() => {
        expect(screen.getByTestId('profile-page')).toBeInTheDocument()
      })

      // Update profile information
      const firstNameInput = screen.getByLabelText(/first name/i)
      await user.clear(firstNameInput)
      await user.type(firstNameInput, 'Updated')

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/profile updated/i)).toBeInTheDocument()
      })
    })

    it('should validate profile form inputs', async () => {
      render(<TestApp />)

      const profileLink = screen.getByRole('link', { name: /profile/i })
      await user.click(profileLink)

      await waitFor(() => {
        expect(screen.getByTestId('profile-page')).toBeInTheDocument()
      })

      // Try to save with empty name
      const firstNameInput = screen.getByLabelText(/first name/i)
      await user.clear(firstNameInput)

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
      })
    })
  })

  describe('Navigation and Accessibility', () => {
    it('should navigate using keyboard', async () => {
      render(<TestApp />)

      await waitFor(() => {
        expect(screen.getByTestId('employee-dashboard')).toBeInTheDocument()
      })

      // Use Tab to navigate
      await user.tab()
      expect(screen.getByRole('link', { name: /dashboard/i })).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('link', { name: /rewards/i })).toHaveFocus()

      // Use Enter to activate link
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByTestId('rewards-page')).toBeInTheDocument()
      })
    })

    it('should have proper ARIA labels', async () => {
      render(<TestApp />)

      await waitFor(() => {
        expect(screen.getByTestId('employee-dashboard')).toBeInTheDocument()
      })

      // Check for proper ARIA labels
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation')
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Main content')
      expect(screen.getByRole('button', { name: /check in/i })).toHaveAttribute('aria-describedby')
    })

    it('should handle responsive navigation', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      })

      render(<TestApp />)

      await waitFor(() => {
        expect(screen.getByTestId('employee-dashboard')).toBeInTheDocument()
      })

      // On mobile, navigation should be collapsed
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument()
      
      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: /menu/i })
      await user.click(menuButton)

      await waitFor(() => {
        expect(screen.getByRole('navigation')).toHaveAttribute('aria-expanded', 'true')
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Mock network error
      vi.mocked('../../services/supabase', true).getUser.mockRejectedValue(
        new Error('Network error')
      )

      render(<TestApp />)

      await waitFor(() => {
        expect(screen.getByText(/network.*error/i)).toBeInTheDocument()
      })

      // Should show retry button
      const retryButton = screen.getByRole('button', { name: /retry/i })
      expect(retryButton).toBeInTheDocument()
    })

    it('should handle offline scenarios', async () => {
      // Mock offline
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      })

      render(<TestApp />)

      await waitFor(() => {
        expect(screen.getByTestId('offline-indicator')).toBeInTheDocument()
      })

      // Should show offline message
      expect(screen.getByText(/you.*are.*offline/i)).toBeInTheDocument()
    })
  })
})