import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../../stores/appStore'
import { act, renderHook } from '@testing-library/react'

describe('App Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { resetApp } = useAppStore.getState()
    act(() => {
      resetApp()
    })
  })

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useAppStore())
    
    expect(result.current.sidebarOpen).toBe(false)
    expect(result.current.theme).toBe('system')
    expect(result.current.lastVisited).toBe(null)
    expect(result.current.features.realTimeUpdates).toBe(true)
    expect(result.current.features.offlineMode).toBe(true)
    expect(result.current.features.notifications).toBe(true)
    expect(result.current.features.analytics).toBe(true)
    expect(result.current.preferences.autoCheckIn).toBe(false)
    expect(result.current.preferences.soundEnabled).toBe(true)
    expect(result.current.preferences.animationsEnabled).toBe(true)
    expect(result.current.preferences.compactMode).toBe(false)
  })

  it('should toggle sidebar open state', () => {
    const { result } = renderHook(() => useAppStore())
    
    act(() => {
      result.current.setSidebarOpen(true)
    })
    
    expect(result.current.sidebarOpen).toBe(true)
    
    act(() => {
      result.current.setSidebarOpen(false)
    })
    
    expect(result.current.sidebarOpen).toBe(false)
  })

  it('should update theme', () => {
    const { result } = renderHook(() => useAppStore())
    
    act(() => {
      result.current.setTheme('dark')
    })
    
    expect(result.current.theme).toBe('dark')
    
    act(() => {
      result.current.setTheme('light')
    })
    
    expect(result.current.theme).toBe('light')
  })

  it('should set last visited path', () => {
    const { result } = renderHook(() => useAppStore())
    
    act(() => {
      result.current.setLastVisited('/dashboard')
    })
    
    expect(result.current.lastVisited).toBe('/dashboard')
  })

  it('should toggle features', () => {
    const { result } = renderHook(() => useAppStore())
    
    // Toggle real-time updates off
    act(() => {
      result.current.toggleFeature('realTimeUpdates')
    })
    
    expect(result.current.features.realTimeUpdates).toBe(false)
    
    // Toggle it back on
    act(() => {
      result.current.toggleFeature('realTimeUpdates')
    })
    
    expect(result.current.features.realTimeUpdates).toBe(true)
  })

  it('should update preferences partially', () => {
    const { result } = renderHook(() => useAppStore())
    
    act(() => {
      result.current.updatePreferences({
        autoCheckIn: true,
        compactMode: true
      })
    })
    
    expect(result.current.preferences.autoCheckIn).toBe(true)
    expect(result.current.preferences.compactMode).toBe(true)
    // Other preferences should remain unchanged
    expect(result.current.preferences.soundEnabled).toBe(true)
    expect(result.current.preferences.animationsEnabled).toBe(true)
  })

  it('should reset app state', () => {
    const { result } = renderHook(() => useAppStore())
    
    // Change some state
    act(() => {
      result.current.setSidebarOpen(true)
      result.current.setTheme('dark')
      result.current.setLastVisited('/profile')
      result.current.toggleFeature('notifications')
      result.current.updatePreferences({ autoCheckIn: true })
    })
    
    // Verify state changed
    expect(result.current.sidebarOpen).toBe(true)
    expect(result.current.theme).toBe('dark')
    expect(result.current.lastVisited).toBe('/profile')
    expect(result.current.features.notifications).toBe(false)
    expect(result.current.preferences.autoCheckIn).toBe(true)
    
    // Reset app
    act(() => {
      result.current.resetApp()
    })
    
    // Verify state is back to initial values
    expect(result.current.sidebarOpen).toBe(false)
    expect(result.current.theme).toBe('system')
    expect(result.current.lastVisited).toBe(null)
    expect(result.current.features.notifications).toBe(true)
    expect(result.current.preferences.autoCheckIn).toBe(false)
  })

  it('should persist state correctly', () => {
    const { result } = renderHook(() => useAppStore())
    
    // Change some persisted state
    act(() => {
      result.current.setTheme('dark')
      result.current.setLastVisited('/rewards')
      result.current.toggleFeature('analytics')
      result.current.updatePreferences({ soundEnabled: false })
    })
    
    // Create a new store instance to simulate page reload
    const newStoreState = useAppStore.getState()
    
    // Persisted state should be maintained
    expect(newStoreState.theme).toBe('dark')
    expect(newStoreState.lastVisited).toBe('/rewards')
    expect(newStoreState.features.analytics).toBe(false)
    expect(newStoreState.preferences.soundEnabled).toBe(false)
    
    // Non-persisted state should be reset
    expect(newStoreState.sidebarOpen).toBe(false)
  })

  it('should handle multiple feature toggles', () => {
    const { result } = renderHook(() => useAppStore())
    
    act(() => {
      result.current.toggleFeature('realTimeUpdates')
      result.current.toggleFeature('offlineMode')
      result.current.toggleFeature('notifications')
      result.current.toggleFeature('analytics')
    })
    
    expect(result.current.features.realTimeUpdates).toBe(false)
    expect(result.current.features.offlineMode).toBe(false)
    expect(result.current.features.notifications).toBe(false)
    expect(result.current.features.analytics).toBe(false)
  })

  it('should handle rapid preference updates', () => {
    const { result } = renderHook(() => useAppStore())
    
    act(() => {
      result.current.updatePreferences({ autoCheckIn: true })
      result.current.updatePreferences({ soundEnabled: false })
      result.current.updatePreferences({ animationsEnabled: false })
      result.current.updatePreferences({ compactMode: true })
    })
    
    expect(result.current.preferences).toEqual({
      autoCheckIn: true,
      soundEnabled: false,
      animationsEnabled: false,
      compactMode: true
    })
  })
})