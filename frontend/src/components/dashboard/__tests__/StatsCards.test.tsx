import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test/utils'
import { StatsCards } from '../StatsCards'
import { createMockUser } from '../../../test/utils'

describe('StatsCards', () => {
  const mockUser = createMockUser({
    points_balance: 150,
    current_streak: 7,
    longest_streak: 15
  })

  it('renders all stat cards correctly', () => {
    render(<StatsCards user={mockUser} />)

    expect(screen.getByText('Points Balance')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()

    expect(screen.getByText('Current Streak')).toBeInTheDocument()
    expect(screen.getByText('7 days')).toBeInTheDocument()

    expect(screen.getByText('Longest Streak')).toBeInTheDocument()
    expect(screen.getByText('15 days')).toBeInTheDocument()

    expect(screen.getByText('Next Reward')).toBeInTheDocument()
  })

  it('calculates next reward tier correctly', () => {
    const userNearReward = createMockUser({ points_balance: 45 })
    render(<StatsCards user={userNearReward} />)

    expect(screen.getByText('Coffee Card')).toBeInTheDocument()
    expect(screen.getByText('5 points needed')).toBeInTheDocument()
  })

  it('shows max level for high points', () => {
    const highPointsUser = createMockUser({ points_balance: 1500 })
    render(<StatsCards user={highPointsUser} />)

    expect(screen.getByText('Maximum Level Achieved!')).toBeInTheDocument()
    expect(screen.getByText('🎉 Max level!')).toBeInTheDocument()
  })

  it('displays progress bar for next reward', () => {
    const userWithProgress = createMockUser({ points_balance: 30 })
    render(<StatsCards user={userWithProgress} />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
  })

  it('has correct icons for each stat', () => {
    render(<StatsCards user={mockUser} />)

    // Check that lucide icons are rendered (they should have specific classes)
    const icons = document.querySelectorAll('svg')
    expect(icons).toHaveLength(4) // Star, Flame, Calendar, Clock
  })
})