# Employee Rewards Frontend

A modern, high-performance React application for employee rewards and recognition system with comprehensive PWA features, real-time updates, and enterprise-grade architecture.

## 🚀 Features

### Core Features
- **Employee Check-ins** - QR code-based location check-ins with offline support
- **Rewards System** - Point-based rewards with real-time redemption
- **Achievement Tracking** - Progress tracking and badge system
- **Leaderboards** - Competitive scoring and rankings
- **Real-time Updates** - WebSocket-powered live notifications
- **Admin Dashboard** - Comprehensive analytics and user management

### Technical Features
- **Progressive Web App (PWA)** - Offline-first architecture with service workers
- **Real-time Sync** - WebSocket integration with offline queue
- **Performance Optimized** - Code splitting, lazy loading, bundle optimization
- **Accessibility** - WCAG 2.1 AA compliant with comprehensive screen reader support
- **Security** - Role-based access control with comprehensive error handling
- **Testing** - 95%+ test coverage with unit, integration, and E2E tests

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git** for version control

## 🛠️ Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd Employee-Rewards-/frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### 2. Environment Configuration

Create `.env.local` with the following variables:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Supabase Database
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_REAL_TIME=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_PWA_FEATURES=true

# Development
VITE_ENABLE_MOCK_DATA=false
VITE_DEBUG_MODE=false
```

### 3. Development Server

```bash
# Start development server
npm run dev

# Available at http://localhost:5173
```

### 4. Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

### Test Suites

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:e2e          # End-to-end tests
npm run test:a11y         # Accessibility tests
npm run test:performance  # Performance tests

# Test coverage
npm run test:coverage

# Interactive test UI
npm run test:ui
```

### Testing Philosophy

- **Unit Tests** - Individual functions and components
- **Integration Tests** - Component interactions and data flow
- **E2E Tests** - Complete user workflows
- **Accessibility Tests** - WCAG compliance and screen reader support
- **Performance Tests** - Bundle size, load times, and Core Web Vitals

## 🔍 Code Quality

### Linting and Formatting

```bash
# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check

# Type checking
npm run typecheck

# Full validation
npm run validate
```

### Performance Analysis

```bash
# Bundle analysis
npm run analyze

# Bundle size check
npm run bundle-size-check

# Lighthouse audit
npm run lighthouse

# Security audit
npm run audit-security
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Design system components
│   ├── admin/           # Admin-specific components
│   ├── employee/        # Employee-specific components
│   ├── pwa/            # PWA-related components
│   └── shared/         # Shared components
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── employee/       # Employee pages
│   └── shared/         # Shared pages
├── stores/             # Zustand state management
├── services/           # API and external services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── contexts/           # React contexts
├── router/             # Routing configuration
├── styles/             # Global styles and tokens
└── __tests__/          # Test files
    ├── unit/           # Unit tests
    ├── integration/    # Integration tests
    ├── e2e/           # End-to-end tests
    ├── accessibility/ # Accessibility tests
    └── performance/   # Performance tests
```

## 🏗️ Architecture

### State Management

The application uses **Zustand** for state management with the following stores:

- **`appStore`** - Global app state (theme, preferences, features)
- **`adminStore`** - Admin-specific state and data
- **`notificationStore`** - Notification system state
- **`websocketStore`** - Real-time connection management

### Data Flow

1. **React Query** - Server state management and caching
2. **Zustand** - Client state management
3. **WebSocket** - Real-time updates
4. **Service Workers** - Offline data sync

### Component Architecture

- **Design System** - Consistent UI components with variants
- **Compound Components** - Complex components with sub-components
- **Render Props** - Flexible component composition
- **Error Boundaries** - Graceful error handling

## 🔒 Security

### Authentication & Authorization

- **Clerk** - Authentication provider with role-based access
- **Role Guards** - Component-level access control
- **Route Protection** - Automatic redirects for unauthorized access

### Security Features

- **CSP Headers** - Content Security Policy protection
- **XSS Protection** - Input sanitization and validation
- **CSRF Protection** - Request validation
- **Secure Storage** - Encrypted local storage for sensitive data

## 📱 PWA Features

### Offline Support

- **Service Worker** - Asset caching and offline functionality
- **Background Sync** - Queue operations when offline
- **Offline Indicators** - Clear offline/online status

### Installation

- **Install Prompts** - Native app-like installation
- **App Manifest** - PWA configuration
- **Icon Generation** - Multiple icon sizes for different devices

## 🎯 Performance

### Optimization Strategies

- **Code Splitting** - Route-based and component-based splitting
- **Lazy Loading** - Dynamic imports for non-critical components
- **Bundle Optimization** - Tree shaking and dead code elimination
- **Image Optimization** - WebP format with fallbacks
- **Caching Strategy** - Service worker caching for static assets

### Performance Budgets

- **Bundle Size** - < 500KB gzipped total
- **First Contentful Paint** - < 1.5 seconds
- **Largest Contentful Paint** - < 2.5 seconds
- **Time to Interactive** - < 3 seconds
- **Cumulative Layout Shift** - < 0.1

## ♿ Accessibility

### WCAG 2.1 Compliance

- **Level AA** - Full compliance with WCAG 2.1 AA standards
- **Screen Reader Support** - Comprehensive ARIA implementation
- **Keyboard Navigation** - Full keyboard accessibility
- **Color Contrast** - Minimum 4.5:1 contrast ratio
- **Focus Management** - Visible focus indicators and logical flow

### Testing Tools

- **jest-axe** - Automated accessibility testing
- **Pa11y** - Command-line accessibility testing
- **Manual Testing** - Screen reader and keyboard testing

## 🚀 Deployment

### Build Process

```bash
# Production build
npm run build

# Build with analysis
npm run build-report

# Preview build
npm run preview
```

### Environment Setup

#### Staging
```env
NODE_ENV=staging
VITE_API_URL=https://staging-api.yourapp.com
VITE_ENABLE_ANALYTICS=true
```

#### Production
```env
NODE_ENV=production
VITE_API_URL=https://api.yourapp.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
```

### CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow:

1. **Quality Checks** - Linting, type checking, testing
2. **Security Scanning** - Vulnerability and dependency audits
3. **Performance Testing** - Lighthouse CI and bundle analysis
4. **Accessibility Testing** - Pa11y and automated a11y tests
5. **Build & Deploy** - Optimized production builds
6. **Notifications** - Team notifications for deploy status

## 📊 Monitoring

### Performance Monitoring

- **Core Web Vitals** - Real-time performance tracking
- **Error Tracking** - Comprehensive error logging
- **User Analytics** - Usage patterns and feature adoption
- **Bundle Analysis** - Size tracking and optimization alerts

### Error Handling

- **Global Error Boundary** - Application-level error catching
- **Network Error Recovery** - Automatic retry with exponential backoff
- **User-Friendly Messages** - Contextual error messages
- **Error Reporting** - Automatic error submission to monitoring service

## 🔧 Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens",
    "deque-systems.vscode-axe-linter"
  ]
}
```

### Browser DevTools

- **React DevTools** - Component inspection
- **Zustand DevTools** - State management debugging
- **React Query DevTools** - Data fetching inspection
- **Lighthouse** - Performance auditing

## 🤝 Contributing

### Code Standards

- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Conventional Commits** - Semantic commit messages

### Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Run full validation: `npm run validate`
4. Submit PR with description and testing notes
5. Ensure all CI checks pass
6. Request code review

### Testing Requirements

- **Unit Tests** - All new utilities and hooks
- **Component Tests** - All new UI components
- **Integration Tests** - All new features
- **Accessibility Tests** - All new user interfaces

## 📚 API Documentation

### Authentication

```typescript
// Clerk user object structure
interface User {
  id: string
  firstName: string
  lastName: string
  emailAddresses: Array<{ emailAddress: string }>
  publicMetadata: {
    role: 'employee' | 'admin' | 'super_admin'
    department?: string
    startDate?: string
  }
}
```

### State Management

```typescript
// App store interface
interface AppState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  features: {
    realTimeUpdates: boolean
    offlineMode: boolean
    notifications: boolean
    analytics: boolean
  }
  preferences: {
    autoCheckIn: boolean
    soundEnabled: boolean
    animationsEnabled: boolean
    compactMode: boolean
  }
}
```

### API Endpoints

```typescript
// Example API calls
const api = {
  // User management
  getUser: (id: string) => Promise<User>
  updateUser: (id: string, data: Partial<User>) => Promise<User>
  
  // Check-ins
  createCheckIn: (locationId: string) => Promise<CheckIn>
  getTodaysCheckIn: (userId: string) => Promise<CheckIn | null>
  
  // Rewards
  getRewards: () => Promise<Reward[]>
  redeemReward: (rewardId: string) => Promise<Redemption>
}
```

## 🆘 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
npm run clean
npm install

# Check for type errors
npm run typecheck
```

#### Test Failures
```bash
# Update test snapshots
npm test -- -u

# Run tests in watch mode
npm test -- --watch
```

#### Performance Issues
```bash
# Analyze bundle
npm run analyze

# Check for memory leaks
npm run test:performance
```

### Debug Mode

Enable debug mode for detailed logging:

```env
VITE_DEBUG_MODE=true
```

This enables:
- Detailed performance metrics
- Error stack traces
- State change logging
- Network request logging

## 📞 Support

### Getting Help

- **Documentation** - Check this README and inline code comments
- **Issues** - Create GitHub issue with reproduction steps
- **Discussions** - Use GitHub Discussions for questions
- **Code Review** - Tag team members for technical questions

### Reporting Bugs

When reporting bugs, include:

1. **Environment** - OS, browser, Node.js version
2. **Steps to Reproduce** - Minimal reproduction case
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Screenshots** - Visual bugs or UI issues
6. **Console Logs** - Any error messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the incredible framework
- **Vite Team** - For the blazing-fast build tool
- **Clerk** - For seamless authentication
- **Supabase** - For the backend infrastructure
- **Tailwind CSS** - For the utility-first CSS framework
- **Open Source Community** - For the amazing tools and libraries

---

**Built with ❤️ by the Employee Rewards Team**
