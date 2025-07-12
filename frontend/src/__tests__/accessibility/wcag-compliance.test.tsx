import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Import components to test
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Test wrapper
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('WCAG 2.1 Compliance Tests', () => {
  beforeEach(() => {
    // Reset any global state
    document.body.innerHTML = ''
  })

  describe('Buttons', () => {
    it('should have accessible button implementations', async () => {
      const { container } = render(
        <TestWrapper>
          <Button>Click me</Button>
          <Button variant="secondary" disabled>Disabled button</Button>
          <Button size="sm" aria-label="Small action button">
            <svg aria-hidden="true" width="16" height="16">
              <path d="M8 2l3 3-3 3" />
            </svg>
          </Button>
        </TestWrapper>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()

      // Test keyboard navigation
      const buttons = screen.getAllByRole('button')
      
      // All buttons should be focusable (except disabled ones)
      buttons.forEach(button => {
        if (!button.hasAttribute('disabled')) {
          expect(button).toHaveAttribute('tabindex', '0')
        }
      })
    })

    it('should support keyboard interaction', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(
        <TestWrapper>
          <Button onClick={handleClick}>Test Button</Button>
        </TestWrapper>
      )

      const button = screen.getByRole('button', { name: 'Test Button' })
      
      // Test Enter key
      button.focus()
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)

      // Test Space key
      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('Form Controls', () => {
    it('should have properly labeled form inputs', async () => {
      const { container } = render(
        <TestWrapper>
          <div>
            <label htmlFor="email">Email Address</label>
            <Input 
              id="email" 
              type="email" 
              required 
              aria-describedby="email-error"
            />
            <div id="email-error" role="alert">
              Please enter a valid email address
            </div>
          </div>
        </TestWrapper>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()

      const input = screen.getByLabelText('Email Address')
      expect(input).toHaveAttribute('aria-describedby', 'email-error')
      expect(input).toHaveAttribute('required')
    })

    it('should provide clear error messages', async () => {
      const { container } = render(
        <TestWrapper>
          <div>
            <label htmlFor="password">Password</label>
            <Input 
              id="password" 
              type="password" 
              aria-invalid="true"
              aria-describedby="password-error"
            />
            <div id="password-error" role="alert" aria-live="polite">
              Password must be at least 8 characters long
            </div>
          </div>
        </TestWrapper>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()

      const errorMessage = screen.getByRole('alert')
      expect(errorMessage).toHaveAttribute('aria-live', 'polite')
    })

    it('should handle required field validation', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <form>
            <label htmlFor="name">Full Name *</label>
            <Input id="name" required aria-required="true" />
            <Button type="submit">Submit</Button>
          </form>
        </TestWrapper>
      )

      const input = screen.getByLabelText(/full name/i)
      const submitButton = screen.getByRole('button', { name: 'Submit' })

      expect(input).toHaveAttribute('required')
      expect(input).toHaveAttribute('aria-required', 'true')

      // Try to submit without filling required field
      await user.click(submitButton)
      
      // Browser should prevent submission and focus the invalid field
      expect(input).toHaveFocus()
    })
  })

  describe('Navigation', () => {
    it('should provide accessible navigation landmarks', async () => {
      const { container } = render(
        <TestWrapper>
          <header role="banner">
            <nav aria-label="Main navigation">
              <ul>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/rewards">Rewards</a></li>
                <li><a href="/profile">Profile</a></li>
              </ul>
            </nav>
          </header>
          <main role="main" aria-label="Main content">
            <h1>Dashboard</h1>
            <section aria-labelledby="stats-heading">
              <h2 id="stats-heading">Statistics</h2>
            </section>
          </main>
        </TestWrapper>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()

      // Verify landmarks exist
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should support skip links', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <nav>
            <a href="/dashboard">Dashboard</a>
            <a href="/rewards">Rewards</a>
          </nav>
          <main id="main-content" tabIndex={-1}>
            <h1>Main Content</h1>
          </main>
        </TestWrapper>
      )

      const skipLink = screen.getByText('Skip to main content')
      const mainContent = screen.getByRole('main')

      // Tab to skip link and activate it
      await user.tab()
      expect(skipLink).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(mainContent).toHaveFocus()
    })
  })

  describe('Color and Contrast', () => {
    it('should meet color contrast requirements', async () => {
      const { container } = render(
        <TestWrapper>
          <div className="bg-white text-black p-4">
            <h1 className="text-2xl font-bold">High Contrast Text</h1>
            <p className="text-gray-700">
              This text should meet WCAG AA contrast requirements.
            </p>
            <Button className="bg-blue-600 text-white">
              Primary Action
            </Button>
          </div>
        </TestWrapper>
      )

      // axe will check color contrast automatically
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      })
      expect(results).toHaveNoViolations()
    })

    it('should not rely solely on color for information', async () => {
      const { container } = render(
        <TestWrapper>
          <div>
            <Badge variant="success">
              <span aria-label="Success">✓</span> Success
            </Badge>
            <Badge variant="error">
              <span aria-label="Error">✗</span> Error
            </Badge>
            <Badge variant="warning">
              <span aria-label="Warning">⚠</span> Warning
            </Badge>
          </div>
        </TestWrapper>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()

      // Verify icons provide additional context beyond color
      expect(screen.getByLabelText('Success')).toBeInTheDocument()
      expect(screen.getByLabelText('Error')).toBeInTheDocument()
      expect(screen.getByLabelText('Warning')).toBeInTheDocument()
    })
  })

  describe('Focus Management', () => {
    it('should manage focus in modals correctly', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <div>
            <Button id="open-modal">Open Modal</Button>
            <Modal 
              isOpen={true} 
              onClose={() => {}}
              aria-labelledby="modal-title"
            >
              <h2 id="modal-title">Modal Title</h2>
              <p>Modal content goes here.</p>
              <Button>First Button</Button>
              <Button>Second Button</Button>
              <Button id="close-modal">Close</Button>
            </Modal>
          </div>
        </TestWrapper>
      )

      // Focus should be trapped within modal
      await user.tab()
      expect(screen.getByText('First Button')).toHaveFocus()

      await user.tab()
      expect(screen.getByText('Second Button')).toHaveFocus()

      await user.tab()
      expect(screen.getByText('Close')).toHaveFocus()

      // Tab should cycle back to first focusable element
      await user.tab()
      expect(screen.getByText('First Button')).toHaveFocus()
    })

    it('should provide visible focus indicators', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <div>
            <Button>First Button</Button>
            <Button>Second Button</Button>
            <Input placeholder="Text input" />
          </div>
        </TestWrapper>
      )

      // Tab through elements and verify focus indicators
      await user.tab()
      const firstButton = screen.getByText('First Button')
      expect(firstButton).toHaveFocus()
      expect(firstButton).toHaveClass('focus:outline-none', 'focus:ring-2')

      await user.tab()
      const secondButton = screen.getByText('Second Button')
      expect(secondButton).toHaveFocus()

      await user.tab()
      const input = screen.getByPlaceholderText('Text input')
      expect(input).toHaveFocus()
    })
  })

  describe('Screen Reader Support', () => {
    it('should provide appropriate ARIA labels and descriptions', async () => {
      const { container } = render(
        <TestWrapper>
          <div>
            <Button 
              aria-label="Add new reward to wishlist"
              aria-describedby="wishlist-help"
            >
              ❤️
            </Button>
            <div id="wishlist-help">
              Click to add this reward to your wishlist for later
            </div>
            
            <div role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
              <div style={{ width: '75%' }}>75% Complete</div>
            </div>
          </div>
        </TestWrapper>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()

      const button = screen.getByLabelText('Add new reward to wishlist')
      expect(button).toHaveAttribute('aria-describedby', 'wishlist-help')

      const progressbar = screen.getByRole('progressbar')
      expect(progressbar).toHaveAttribute('aria-valuenow', '75')
    })

    it('should announce dynamic content changes', async () => {
      const user = userEvent.setup()

      const TestComponent = () => {
        const [count, setCount] = React.useState(0)
        
        return (
          <div>
            <Button onClick={() => setCount(c => c + 1)}>
              Increment
            </Button>
            <div role="status" aria-live="polite">
              Count: {count}
            </div>
          </div>
        )
      }

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )

      const button = screen.getByText('Increment')
      const status = screen.getByRole('status')

      expect(status).toHaveAttribute('aria-live', 'polite')
      expect(status).toHaveTextContent('Count: 0')

      await user.click(button)
      expect(status).toHaveTextContent('Count: 1')
    })
  })

  describe('Mobile Accessibility', () => {
    it('should have appropriate touch targets', () => {
      render(
        <TestWrapper>
          <div>
            <Button className="min-h-[44px] min-w-[44px]">
              Touch Target
            </Button>
            <button className="p-3">
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
        </TestWrapper>
      )

      // Touch targets should be at least 44x44px (WCAG 2.1 AAA)
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button)
        const minHeight = parseInt(styles.minHeight) || parseInt(styles.height)
        const minWidth = parseInt(styles.minWidth) || parseInt(styles.width)
        
        expect(minHeight).toBeGreaterThanOrEqual(44)
        expect(minWidth).toBeGreaterThanOrEqual(44)
      })
    })

    it('should work with screen reader gestures', async () => {
      render(
        <TestWrapper>
          <div>
            <h1>Page Title</h1>
            <nav aria-label="Breadcrumb">
              <ol>
                <li><a href="/">Home</a></li>
                <li aria-current="page">Current Page</li>
              </ol>
            </nav>
            <main>
              <section>
                <h2>Section Title</h2>
                <p>Section content</p>
              </section>
            </main>
          </div>
        </TestWrapper>
      )

      // Verify heading hierarchy for screen reader navigation
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2 = screen.getByRole('heading', { level: 2 })
      
      expect(h1).toHaveTextContent('Page Title')
      expect(h2).toHaveTextContent('Section Title')

      // Verify breadcrumb navigation
      const breadcrumb = screen.getByLabelText('Breadcrumb')
      expect(breadcrumb).toBeInTheDocument()
      
      const currentPage = screen.getByText('Current Page')
      expect(currentPage).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('Animation and Motion', () => {
    it('should respect prefers-reduced-motion', () => {
      // Mock prefers-reduced-motion media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        }),
      })

      render(
        <TestWrapper>
          <div className="transition-transform motion-reduce:transition-none">
            Animated element
          </div>
        </TestWrapper>
      )

      const element = screen.getByText('Animated element')
      const styles = window.getComputedStyle(element)
      
      // When prefers-reduced-motion is active, transitions should be disabled
      expect(styles.transition).toBe('none')
    })
  })
})