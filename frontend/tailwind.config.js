/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Primary colors - Professional Blue
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
        
        // Secondary colors - Sophisticated Gold
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
        
        // Success colors
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
        
        // Warning colors
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
        
        // Error colors
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
        
        // Neutral colors
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

        // Semantic color mappings
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        foreground: 'rgb(var(--color-text-primary) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      
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
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      
      boxShadow: {
        'premium': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(255 199 50 / 0.1)',
        'glow': '0 0 20px rgb(85 98 247 / 0.3)',
        'achievement': '0 8px 32px rgb(255 199 50 / 0.3), 0 4px 12px rgb(255 199 50 / 0.2)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-shift': 'gradientShift 15s ease infinite',
      },
      
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        bounceIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.3)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        glow: {
          from: {
            boxShadow: '0 0 20px rgb(85 98 247 / 0.2)',
          },
          to: {
            boxShadow: '0 0 30px rgb(85 98 247 / 0.4), 0 0 40px rgb(85 98 247 / 0.1)',
          },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      
      zIndex: {
        'modal': '1000',
        'overlay': '1010',
        'dropdown': '1020',
        'tooltip': '1030',
      },
      
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}