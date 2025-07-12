/**
 * Design Tokens - Enterprise Employee Rewards System
 * 
 * A comprehensive design token system that provides the foundation
 * for a premium, professional interface with role-based theming.
 */

// Color Palette - Premium Enterprise Colors
export const colors = {
  // Primary - Professional Blue with gold accents
  primary: {
    50: '#f0f4ff',
    100: '#e0e9ff',
    200: '#c7d5ff',
    300: '#a3b5ff',
    400: '#7a8cfd',
    500: '#5562f7',
    600: '#3d3fed',
    700: '#2f28d1',
    800: '#271fa7',
    900: '#261d84',
    950: '#1a1250',
  },
  
  // Secondary - Sophisticated Gold for rewards/achievements
  secondary: {
    50: '#fffdf0',
    100: '#fffbe0',
    200: '#fff4c2',
    300: '#ffe997',
    400: '#ffd65c',
    500: '#ffc532',
    600: '#ffb01a',
    700: '#e8900d',
    800: '#c8700f',
    900: '#a55c12',
    950: '#623505',
  },
  
  // Success - Professional Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // Warning - Sophisticated Orange
  warning: {
    50: '#fffbf0',
    100: '#fff4de',
    200: '#ffe5bc',
    300: '#ffd08f',
    400: '#ffb660',
    500: '#ff9c37',
    600: '#f0821c',
    700: '#c86314',
    800: '#9f4e18',
    900: '#814018',
    950: '#461e09',
  },
  
  // Error - Professional Red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  // Neutral - Sophisticated Grays
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // Role-specific colors
  employee: {
    primary: '#5562f7',
    secondary: '#ffc532',
    background: '#f8fafc',
    surface: '#ffffff',
    accent: '#22c55e',
  },
  
  admin: {
    primary: '#2f28d1',
    secondary: '#e8900d',
    background: '#f1f5f9',
    surface: '#ffffff',
    accent: '#dc2626',
  },
} as const;

// Typography Scale - Professional and Readable
export const typography = {
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'Courier New', 'monospace'],
    display: ['Inter Display', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Spacing Scale - Consistent and Harmonious
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

// Border Radius - Modern and Consistent
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

// Shadows - Premium and Sophisticated
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Premium shadows for special elements
  premium: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(255 199 50 / 0.1)',
  glow: '0 0 20px rgb(85 98 247 / 0.3)',
  achievement: '0 8px 32px rgb(255 199 50 / 0.3), 0 4px 12px rgb(255 199 50 / 0.2)',
} as const;

// Animation - Smooth and Professional
export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;

// Z-Index Scale
export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  modal: '1000',
  overlay: '1010',
  dropdown: '1020',
  tooltip: '1030',
} as const;

// Breakpoints - Mobile-first responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Theme variants
export const themes = {
  light: {
    background: colors.neutral[50],
    surface: colors.neutral[50],
    card: '#ffffff',
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      muted: colors.neutral[500],
    },
    border: colors.neutral[200],
    divider: colors.neutral[100],
  },
  
  dark: {
    background: colors.neutral[950],
    surface: colors.neutral[900],
    card: colors.neutral[800],
    text: {
      primary: colors.neutral[50],
      secondary: colors.neutral[300],
      muted: colors.neutral[400],
    },
    border: colors.neutral[700],
    divider: colors.neutral[800],
  },
} as const;

// Component-specific tokens
export const components = {
  button: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
      xl: '3.5rem',
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.625rem 1rem',
      lg: '0.75rem 1.5rem',
      xl: '1rem 2rem',
    },
  },
  
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
  },
  
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem',
    },
  },
} as const;

// Export default design system
export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  zIndex,
  breakpoints,
  themes,
  components,
} as const;

export type DesignSystem = typeof designSystem;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;