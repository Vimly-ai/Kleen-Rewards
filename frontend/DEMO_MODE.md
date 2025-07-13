# Demo Mode Documentation

## Overview

The Employee Rewards System now includes a comprehensive demo mode that allows users to explore the application's features without affecting production data or requiring real authentication setup.

## Demo Accounts

### Employee Account
- **Name:** Sarah Johnson
- **Role:** Employee
- **Department:** Operations
- **Current Stats:**
  - Points: 3,420
  - Current Streak: 28 days
  - Rank: #1
  - Achievements: 3 unlocked

### Admin Account
- **Name:** Michael Chen
- **Role:** Admin
- **Department:** Management
- **Features Access:**
  - User management
  - Analytics dashboard
  - Bonus points awards
  - System settings
  - 42 team members to manage

## Accessing Demo Mode

1. **From Auth Page:**
   - Navigate to `/auth`
   - Click "View demo mode →" button
   - Select either Employee or Admin experience

2. **Direct URL:**
   - Add `?demo=true` to the auth page URL
   - Example: `https://employee-rewards.netlify.app/auth?demo=true`

## Demo Features

### Employee Demo Experience
- **Rich Activity History:** Pre-populated check-ins, achievements, and bonus points
- **Realistic Streaks:** Shows ongoing 28-day streak with history
- **Achievement Progress:** Mix of unlocked and in-progress achievements
- **Leaderboard Position:** Ranked #1 with realistic competition
- **Activity Timeline:** Recent check-ins, achievements, and rewards

### Admin Demo Experience
- **Executive Dashboard:** Real-time metrics and KPIs
- **Team Analytics:** Department performance breakdowns
- **User Management:** View and manage 42 demo employees
- **Trend Analysis:** Weekly and monthly engagement trends
- **System Health:** Simulated uptime and performance metrics

## Demo Mode Indicators

1. **Purple Banner:** Fixed banner at top showing:
   - "Demo Mode" label with eye icon
   - Current demo user name and role
   - "Exit Demo" button

2. **Data Isolation:** 
   - All demo data is generated dynamically
   - No interaction with production database
   - Changes are not persisted

## Technical Implementation

### Key Components

1. **`demoService.ts`**
   - Generates realistic demo data
   - Manages demo user sessions
   - Provides consistent demo experience

2. **`DemoModeSelector.tsx`**
   - Beautiful selection UI for demo accounts
   - One-click access to either experience

3. **`DemoBanner.tsx`**
   - Persistent indicator of demo mode
   - Quick exit functionality

4. **Data Hooks Integration**
   - `useCurrentUser()` returns demo user when in demo mode
   - `useUserStats()` returns demo statistics
   - `useUserCheckIns()` returns demo check-in history
   - Achievements and leaderboard show demo data

### Demo Mode Detection

```typescript
import { isDemoMode, getCurrentDemoUser } from './services/demoService'

// Check if in demo mode
if (isDemoMode()) {
  const demoUser = getCurrentDemoUser()
  // Use demo data
}
```

## Benefits

1. **Sales & Marketing:**
   - Live demonstration without setup
   - Show full feature set instantly
   - No authentication configuration needed

2. **User Testing:**
   - New users can explore before signing up
   - Test different user perspectives
   - Understand app capabilities

3. **Development:**
   - Test features without real data
   - Consistent data for screenshots
   - Easy onboarding for new developers

## Exiting Demo Mode

Users can exit demo mode by:
1. Clicking "Exit Demo" in the banner
2. Clicking the X button to hide the banner (session persists)
3. Navigating to `/auth` and using real authentication

## Security

- Demo mode is completely isolated from production data
- No real user data is exposed in demo mode
- Demo accounts cannot access real system functions
- All demo data is generated client-side

## Future Enhancements

- [ ] Guided tour overlay for first-time demo users
- [ ] More demo scenarios (different departments, roles)
- [ ] Interactive tutorials within demo mode
- [ ] Demo data persistence within session
- [ ] Customizable demo parameters

---

**Note:** Demo mode is designed for demonstration purposes only. For production use, proper authentication with Clerk must be configured.