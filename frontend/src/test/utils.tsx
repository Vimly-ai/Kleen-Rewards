import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'

// Mock Clerk provider
const MockClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="clerk-provider">{children}</div>
}

// Test providers wrapper
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <MockClerkProvider>
        {children}
      </MockClerkProvider>
    </BrowserRouter>
  )
}

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  employee_id: 'EMP001',
  department: 'Engineering',
  hire_date: '2023-01-01',
  role: 'employee' as const,
  status: 'active' as const,
  points_balance: 100,
  total_points_earned: 150,
  current_streak: 5,
  longest_streak: 10,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  ...overrides
})

export const createMockCheckIn = (overrides = {}) => ({
  id: 'checkin-1',
  user_id: 'test-user-id',
  check_in_time: '2023-01-01T08:00:00Z',
  points_earned: 5,
  check_in_type: 'ontime' as const,
  streak_day: 1,
  created_at: '2023-01-01T08:00:00Z',
  updated_at: '2023-01-01T08:00:00Z',
  ...overrides
})

export const createMockReward = (overrides = {}) => ({
  id: 'reward-1',
  title: 'Coffee Card',
  description: 'A $10 coffee card',
  points_cost: 50,
  category: 'food' as const,
  is_active: true,
  stock_quantity: 10,
  image_url: null,
  terms_conditions: 'Valid for 30 days',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  ...overrides
})

// Test utilities
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}

export const mockAsyncFunction = <T,>(returnValue: T, delay = 0) => {
  return jest.fn().mockImplementation(() => 
    new Promise(resolve => setTimeout(() => resolve(returnValue), delay))
  )
}

// DOM testing utilities
export const getByTestId = (container: HTMLElement, testId: string) => {
  const element = container.querySelector(`[data-testid="${testId}"]`)
  if (!element) {
    throw new Error(`Unable to find element with data-testid: ${testId}`)
  }
  return element
}

// Snapshot testing utilities
export const stripTransientProps = (tree: any) => {
  const stripNode = (node: any): any => {
    if (typeof node !== 'object' || node === null) {
      return node
    }

    if (Array.isArray(node)) {
      return node.map(stripNode)
    }

    const { key, ref, ...rest } = node
    const stripped: any = {}

    for (const [prop, value] of Object.entries(rest)) {
      if (prop.startsWith('$')) {
        // Skip transient props (styled-components)
        continue
      }
      stripped[prop] = stripNode(value)
    }

    return stripped
  }

  return stripNode(tree)
}