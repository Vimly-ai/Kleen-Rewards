import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  // UI State
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  lastVisited: string | null
  
  // Feature flags
  features: {
    realTimeUpdates: boolean
    offlineMode: boolean
    notifications: boolean
    analytics: boolean
  }
  
  // App preferences
  preferences: {
    autoCheckIn: boolean
    soundEnabled: boolean
    animationsEnabled: boolean
    compactMode: boolean
  }
  
  // Actions
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLastVisited: (path: string) => void
  toggleFeature: (feature: keyof AppState['features']) => void
  updatePreferences: (preferences: Partial<AppState['preferences']>) => void
  resetApp: () => void
}

const initialState = {
  sidebarOpen: false,
  theme: 'system' as const,
  lastVisited: null,
  features: {
    realTimeUpdates: true,
    offlineMode: true,
    notifications: true,
    analytics: true
  },
  preferences: {
    autoCheckIn: false,
    soundEnabled: true,
    animationsEnabled: true,
    compactMode: false
  }
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        setTheme: (theme) => set({ theme }),
        
        setLastVisited: (path) => set({ lastVisited: path }),
        
        toggleFeature: (feature) => set((state) => ({
          features: {
            ...state.features,
            [feature]: !state.features[feature]
          }
        })),
        
        updatePreferences: (preferences) => set((state) => ({
          preferences: {
            ...state.preferences,
            ...preferences
          }
        })),
        
        resetApp: () => set(initialState)
      }),
      {
        name: 'employee-rewards-app',
        partialize: (state) => ({
          theme: state.theme,
          features: state.features,
          preferences: state.preferences,
          lastVisited: state.lastVisited
        })
      }
    ),
    {
      name: 'app-store'
    }
  )
)