/**
 * Theme Provider - Enterprise Employee Rewards System
 * 
 * Comprehensive theme management with dark/light modes,
 * role-based styling, and sophisticated color switching.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ColorMode, UserRole, Theme } from './types';

interface ThemeContextType {
  theme: Theme;
  colorMode: ColorMode;
  userRole: UserRole;
  setColorMode: (mode: ColorMode) => void;
  setUserRole: (role: UserRole) => void;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultColorMode?: ColorMode;
  defaultUserRole?: UserRole;
  storageKey?: string;
}

/**
 * Theme Provider with comprehensive theme management
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultColorMode = 'system',
  defaultUserRole = 'employee',
  storageKey = 'employee-rewards-theme',
}) => {
  const [colorMode, setColorModeState] = useState<ColorMode>(defaultColorMode);
  const [userRole, setUserRoleState] = useState<UserRole>(defaultUserRole);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const { colorMode: storedMode, userRole: storedRole } = JSON.parse(stored);
        if (storedMode) setColorModeState(storedMode);
        if (storedRole) setUserRoleState(storedRole);
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    setMounted(true);
  }, [storageKey]);

  // Save theme to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ colorMode, userRole }));
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  }, [colorMode, userRole, storageKey, mounted]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const body = document.body;

    // Determine actual color mode (resolve 'system')
    const resolvedMode = colorMode === 'system' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light'
      : colorMode;

    // Apply color mode
    root.setAttribute('data-theme', resolvedMode);
    
    // Apply user role
    root.setAttribute('data-role', userRole);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        resolvedMode === 'dark' ? '#0f172a' : '#f8fafc'
      );
    }

    // Apply color scheme CSS property
    body.style.colorScheme = resolvedMode;

  }, [colorMode, userRole, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (colorMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = document.documentElement;
      root.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [colorMode]);

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
  };

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
  };

  const toggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };

  // Generate theme object
  const theme: Theme = {
    mode: colorMode,
    role: userRole,
    colors: {
      primary: userRole === 'admin' ? '#2f28d1' : '#5562f7',
      secondary: userRole === 'admin' ? '#e8900d' : '#ffc532',
      background: colorMode === 'dark' ? '#020617' : '#f8fafc',
      surface: colorMode === 'dark' ? '#0f172a' : '#f8fafc',
      text: {
        primary: colorMode === 'dark' ? '#f8fafc' : '#0f172a',
        secondary: colorMode === 'dark' ? '#cbd5e1' : '#475569',
        muted: colorMode === 'dark' ? '#94a3b8' : '#64748b',
      },
      border: colorMode === 'dark' ? '#334155' : '#e2e8f0',
      divider: colorMode === 'dark' ? '#1e293b' : '#f1f5f9',
    },
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const value: ThemeContextType = {
    theme,
    colorMode,
    userRole,
    setColorMode,
    setUserRole,
    toggleColorMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme Toggle Component
 */
interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  showLabel = false,
  size = 'md',
}) => {
  const { colorMode, toggleColorMode } = useTheme();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <button
      onClick={toggleColorMode}
      className={`
        inline-flex items-center justify-center rounded-lg border border-border
        bg-background hover:bg-surface transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${sizeClasses[size]} ${className}
      `}
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
    >
      {colorMode === 'light' ? (
        <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
        </svg>
      ) : (
        <svg className={iconSizes[size]} fill="currentColor" viewBox="0 0 24 24">
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
        </svg>
      )}
      
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {colorMode === 'light' ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};

/**
 * Role Toggle Component
 */
interface RoleToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const RoleToggle: React.FC<RoleToggleProps> = ({
  className,
  showLabel = true,
}) => {
  const { userRole, setUserRole } = useTheme();

  const roles: { value: UserRole; label: string }[] = [
    { value: 'employee', label: 'Employee' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
  ];

  return (
    <div className={`inline-flex rounded-lg border border-border bg-background ${className}`}>
      {roles.map((role) => (
        <button
          key={role.value}
          onClick={() => setUserRole(role.value)}
          className={`
            px-3 py-2 text-sm font-medium transition-all duration-200
            first:rounded-l-lg last:rounded-r-lg
            ${userRole === role.value
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-surface'
            }
          `}
        >
          {showLabel ? role.label : role.value.charAt(0).toUpperCase()}
        </button>
      ))}
    </div>
  );
};

/**
 * System Theme Detector Component
 */
export const SystemThemeDetector: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { colorMode, setColorMode } = useTheme();
  
  useEffect(() => {
    if (colorMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        // This will trigger a re-render with the new system preference
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [colorMode, setColorMode]);

  return <>{children}</>;
};

export type { ThemeProviderProps };