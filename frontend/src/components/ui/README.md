# Enterprise Design System - Employee Rewards

A comprehensive, premium design system built for the Employee Rewards application. This design system provides a cohesive visual identity that feels professional, modern, and engaging.

## Features

- 🎨 **Premium Design Language** - Sophisticated color palette with gold accents
- 🌓 **Dark/Light Theme Support** - Seamless theme switching with system detection
- 👥 **Role-Based Themes** - Different visual treatments for Employee vs Admin
- ♿ **Accessibility First** - WCAG 2.1 compliant with proper contrast and keyboard navigation
- 📱 **Responsive Design** - Mobile-first approach with desktop optimization
- ⚡ **Performance Optimized** - Lightweight components with smooth animations
- 🎯 **TypeScript Native** - Full type safety throughout the system

## Getting Started

### 1. Install Dependencies

```bash
npm install clsx tailwind-merge lucide-react
```

### 2. Import Global Styles

```tsx
// In your main.tsx or App.tsx
import './styles/globals.css';
```

### 3. Wrap Your App with Theme Provider

```tsx
import { ThemeProvider } from './components/ui/Theme';

function App() {
  return (
    <ThemeProvider defaultColorMode="system" defaultUserRole="employee">
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## Design Tokens

### Color Palette

Our color system uses a sophisticated palette designed for enterprise applications:

```tsx
// Primary - Professional Blue
primary: {
  500: '#5562f7', // Main brand color
  600: '#3d3fed', // Hover states
  700: '#2f28d1', // Admin theme
}

// Secondary - Sophisticated Gold
secondary: {
  500: '#ffc532', // Accent color
  600: '#ffb01a', // Hover states
  700: '#e8900d', // Admin theme
}
```

### Typography

```tsx
// Font families
fontFamily: {
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', ...],
  display: ['Inter Display', 'Inter', ...],
  mono: ['JetBrains Mono', 'Monaco', ...],
}

// Font sizes with optimized line heights
fontSize: {
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  // ... more sizes
}
```

### Spacing Scale

Consistent spacing using a harmonic scale:

```tsx
spacing: {
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  4: '1rem',       // 16px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  // ... and more
}
```

## Core Components

### Button

Premium button component with multiple variants and states:

```tsx
import { Button } from '@/components/ui/Button';

// Basic usage
<Button variant="primary" size="md">
  Click me
</Button>

// With icons
<Button 
  variant="secondary" 
  leftIcon={<Star />}
  rightIcon={<ExternalLink />}
>
  Featured Reward
</Button>

// Loading state
<Button 
  variant="primary" 
  loading={true}
  loadingText="Processing..."
>
  Claim Reward
</Button>

// Button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="error">Error</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Button sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

### Input

Sophisticated input component with validation and accessibility:

```tsx
import { Input, Textarea, SearchInput } from '@/components/ui/Input';

// Basic input
<Input 
  label="Email Address"
  placeholder="Enter your email"
  required
/>

// With validation
<Input 
  label="Password"
  type="password"
  error={true}
  errorMessage="Password must be at least 8 characters"
/>

// With elements
<Input 
  label="Search"
  leftElement={<Search />}
  rightElement={<Filter />}
/>

// Textarea
<Textarea 
  label="Description"
  placeholder="Enter description..."
  rows={4}
  resize="vertical"
/>

// Search input with debouncing
<SearchInput 
  placeholder="Search rewards..."
  onSearch={(query) => console.log(query)}
  debounceMs={300}
/>
```

### Card

Versatile card component with multiple variants:

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

// Basic card
<Card variant="elevated" padding="lg">
  <CardHeader title="Card Title" subtitle="Card subtitle" />
  <CardContent>
    Your content here
  </CardContent>
  <CardFooter>
    <Button variant="primary">Action</Button>
  </CardFooter>
</Card>

// Interactive card
<Card 
  variant="premium" 
  hoverable={true}
  clickable={true}
  onClick={() => console.log('Card clicked')}
>
  Content
</Card>

// Loading state
<Card loading={true}>
  Content
</Card>
```

### Badge

Status indicators and labels:

```tsx
import { Badge, StatusBadge, AchievementBadge } from '@/components/ui/Badge';

// Basic badges
<Badge variant="primary">New</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="warning">Pending</Badge>

// Status badges
<StatusBadge status="online" />
<StatusBadge status="pending" showText={true} />

// Count badges
<Badge count={5} max={99} />
<Badge dot={true} />

// Achievement badges
<AchievementBadge 
  achievement={{
    name: "Team Player",
    rarity: "epic",
    icon: <Users />,
  }}
  earned={true}
/>
```

## Rewards System Components

### Reward Card

Premium reward cards for the rewards catalog:

```tsx
import { RewardCard, CompactRewardCard, FeaturedRewardCard } from '@/components/ui/RewardCard';

const reward = {
  id: '1',
  title: 'Premium Coffee Voucher',
  description: 'Enjoy a premium coffee experience at our partner locations.',
  points: 250,
  category: 'Food & Beverage',
  image: '/rewards/coffee.jpg',
  available: true,
  popularity: 4.8,
  expiresAt: new Date('2024-12-31'),
  tags: ['Popular', 'Instant', 'Local'],
};

// Standard reward card
<RewardCard 
  reward={reward}
  userPoints={500}
  onClaim={(reward) => console.log('Claiming:', reward)}
  onViewDetails={(reward) => console.log('Viewing:', reward)}
  showPopularity={true}
/>

// Compact version
<CompactRewardCard 
  reward={reward}
  userPoints={500}
  horizontal={true}
/>

// Featured version
<FeaturedRewardCard 
  reward={reward}
  userPoints={500}
  featured={true}
  spotlight={true}
/>
```

### Achievement Badge

Sophisticated achievement system with rarity-based styling:

```tsx
import { AchievementBadge, AchievementGrid, AchievementShowcase } from '@/components/ui/AchievementBadge';

const achievement = {
  id: '1',
  title: 'Team Collaborator',
  description: 'Work effectively with team members on 10 projects',
  icon: <Users />,
  category: 'teamwork',
  rarity: 'epic' as const,
  progress: { current: 7, total: 10 },
  unlockedAt: undefined,
  isSecret: false,
};

// Individual achievement badge
<AchievementBadge 
  achievement={achievement}
  size="lg"
  showProgress={true}
  onClick={(achievement) => console.log('Achievement clicked:', achievement)}
/>

// Achievement grid
<AchievementGrid 
  achievements={achievements}
  columns={4}
  size="md"
  onAchievementClick={(achievement) => console.log(achievement)}
/>

// Achievement showcase
<AchievementShowcase 
  achievement={achievement}
  showDetails={true}
/>
```

## Admin Components

### Admin Card

Authority-conveying dashboard cards for administrators:

```tsx
import { AdminCard, MetricCard, AlertCard, QuickActionCard } from '@/components/ui/AdminCard';

// Admin metric card
<AdminCard 
  title="Total Users"
  subtitle="Active employees in the system"
  value={1247}
  previousValue={1180}
  trend={{
    direction: 'up',
    percentage: 5.7,
    label: 'vs last month'
  }}
  status="success"
  icon={<Users />}
  actions={[
    {
      label: 'View Details',
      icon: <ExternalLink />,
      onClick: () => console.log('View details'),
    }
  ]}
  onRefresh={() => console.log('Refreshing data')}
  elevation="high"
/>

// Metric card with target tracking
<MetricCard 
  title="Monthly Engagement"
  value={847}
  target={1000}
  trend={{
    direction: 'up',
    percentage: 12.5,
    period: 'vs last month'
  }}
  status="on-track"
  format="number"
  icon={<TrendingUp />}
/>

// Alert card
<AlertCard 
  type="warning"
  title="System Maintenance"
  message="Scheduled maintenance will occur this weekend from 2-4 AM EST."
  dismissible={true}
  actions={[
    {
      label: 'Learn More',
      onClick: () => console.log('Learn more'),
    }
  ]}
/>

// Quick action card
<QuickActionCard 
  title="Add New User"
  description="Invite a new employee to join the rewards program"
  icon={<Plus />}
  onClick={() => console.log('Add user')}
  badge={{ text: 'Popular', variant: 'primary' }}
/>
```

## Theme System

### Theme Provider

Comprehensive theme management:

```tsx
import { ThemeProvider, useTheme, ThemeToggle, RoleToggle } from '@/components/ui/Theme';

// App wrapper
<ThemeProvider 
  defaultColorMode="system"
  defaultUserRole="employee"
  storageKey="app-theme"
>
  <App />
</ThemeProvider>

// Using theme in components
function MyComponent() {
  const { theme, colorMode, userRole, toggleColorMode, setUserRole } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme.mode}</p>
      <p>User role: {theme.role}</p>
      <ThemeToggle size="md" showLabel={true} />
      <RoleToggle showLabel={true} />
    </div>
  );
}
```

### Role-Based Styling

Components automatically adapt based on user role:

```tsx
// Employee theme - Warm, engaging colors
[data-role="employee"] {
  --color-role-primary: 85 98 247;    // Friendly blue
  --color-role-secondary: 255 197 50; // Warm gold
  --color-role-accent: 34 197 94;     // Success green
}

// Admin theme - Authoritative, professional colors
[data-role="admin"] {
  --color-role-primary: 47 40 209;    // Deep blue
  --color-role-secondary: 232 144 13; // Rich gold
  --color-role-accent: 220 38 38;     // Alert red
}
```

## Animations and Micro-interactions

### Animation Classes

Smooth, professional animations:

```tsx
// Fade in animation
<div className="animate-fade-in">Content</div>

// Slide up animation
<div className="animate-slide-up">Content</div>

// Bounce in animation
<div className="animate-bounce-in">Content</div>

// Glow effect for premium elements
<div className="animate-glow">Premium content</div>

// Gradient animation
<div className="gradient-animated">Dynamic background</div>
```

### Hover Effects

```tsx
// Card hover effects
<Card className="card-hover">Basic hover</Card>
<Card className="card-premium">Premium hover with glow</Card>

// Button hover states are built-in
<Button variant="primary">Smooth hover transitions</Button>
```

## Accessibility Features

### Keyboard Navigation

- All interactive components support keyboard navigation
- Focus indicators meet WCAG contrast requirements
- Logical tab order throughout components

### Screen Reader Support

- Proper ARIA labels and roles
- Semantic HTML structure
- Descriptive alt text for images

### Color Contrast

- All color combinations meet WCAG AA standards
- High contrast mode support
- Color-blind friendly palette

### Example Accessible Component

```tsx
<Button
  variant="primary"
  onClick={handleClick}
  aria-label="Claim reward for Premium Coffee Voucher"
  disabled={!canAfford}
>
  {canAfford ? 'Claim Reward' : 'Insufficient Points'}
</Button>
```

## Responsive Design

### Breakpoints

```tsx
const breakpoints = {
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
};
```

### Responsive Components

Components automatically adapt to screen size:

```tsx
// Responsive grid
<CardGrid 
  columns={3}          // Desktop: 3 columns
  responsive={true}    // Mobile: 1 column, Tablet: 2 columns
  gap="md"
/>

// Responsive badge size
<Badge 
  size={{ base: 'sm', md: 'md', lg: 'lg' }}
/>
```

## Best Practices

### Component Usage

1. **Always use the theme provider** at the root of your application
2. **Import components individually** to enable tree shaking
3. **Use semantic color variants** (success, warning, error) over specific colors
4. **Provide accessible labels** for all interactive elements
5. **Test with different themes** and user roles

### Performance Tips

1. **Use className prop** for custom styling instead of inline styles
2. **Leverage the cn() utility** for conditional classes
3. **Prefer CSS animations** over JavaScript animations
4. **Use loading states** for better perceived performance

### Customization

```tsx
// Extending components with custom styles
<Button 
  variant="primary"
  className="shadow-premium hover:shadow-achievement"
>
  Custom styled button
</Button>

// Using design tokens in custom components
<div className="bg-primary-50 text-primary-700 border-primary-200">
  Custom component using design tokens
</div>
```

## Component Reference

### Available Components

| Component | Description | Key Features |
|-----------|-------------|--------------|
| `Button` | Interactive button | Multiple variants, loading states, icons |
| `Input` | Form input field | Validation, icons, helper text |
| `Card` | Content container | Multiple variants, hover effects |
| `Badge` | Status indicator | Count badges, status badges, achievements |
| `Modal` | Overlay dialog | Accessible, animated, customizable |
| `RewardCard` | Reward display | Premium styling, affordability indicators |
| `AchievementBadge` | Achievement display | Rarity-based styling, progress tracking |
| `AdminCard` | Admin dashboard card | Authority-conveying design, metrics |
| `ThemeProvider` | Theme management | Dark/light modes, role-based themes |

### Utility Functions

| Function | Description | Usage |
|----------|-------------|-------|
| `cn()` | Class name utility | `cn('base-class', { 'conditional': true })` |
| `formatNumber()` | Number formatting | `formatNumber(1234, { notation: 'compact' })` |
| `formatRelativeTime()` | Relative time | `formatRelativeTime(new Date())` |
| `getInitials()` | Name initials | `getInitials('John Doe')` |
| `copyToClipboard()` | Clipboard utility | `await copyToClipboard('text')` |

## Migration Guide

### From Existing Components

If you're migrating from existing components:

1. **Replace button elements** with `<Button>` component
2. **Update input fields** to use `<Input>` with proper validation
3. **Wrap your app** with `<ThemeProvider>`
4. **Update color classes** to use the new design tokens
5. **Test accessibility** with screen readers and keyboard navigation

### Breaking Changes

- Color palette has been completely redesigned
- Component APIs may differ from previous implementations
- Theme system requires provider wrapper
- Some utility classes have been renamed

## Contributing

When contributing to the design system:

1. **Follow TypeScript conventions** with proper type definitions
2. **Include accessibility features** in all components
3. **Write comprehensive tests** for new components
4. **Update documentation** with usage examples
5. **Test across themes** and user roles
6. **Consider performance implications** of new features

## Support

For questions or issues with the design system:

1. Check this documentation first
2. Review component source code for implementation details
3. Test with different themes and screen sizes
4. Ensure accessibility requirements are met

This design system provides a solid foundation for building a professional, accessible, and engaging Employee Rewards application. The components are designed to work seamlessly together while maintaining flexibility for customization and extension.