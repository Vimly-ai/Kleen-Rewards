# Employee Rewards System - Test Flows

## Application Access
- Frontend: http://localhost:5173/
- Supabase: Connected to https://xkggxfqzqkhucrkkskox.supabase.co
- Clerk Auth: Connected to remarkable-monkey-42.clerk.accounts.dev

## Test Flow 1: Regular Employee User

### 1. User Registration
1. Navigate to http://localhost:5173/
2. Click "Sign Up" or "Get Started"
3. Create a new account with:
   - Email: test.employee@systemkleen.com
   - Password: TestEmployee123!
4. Complete email verification if required
5. You'll be redirected to profile setup

### 2. Profile Setup
1. Enter your details:
   - Full Name: Test Employee
   - Department: Operations
   - Employee ID: EMP001
2. Complete profile setup

### 3. Employee Dashboard
Once logged in, you should see:
- **Dashboard Overview**:
  - Current points balance (starts at 0)
  - Current streak (0 days)
  - Quick stats cards
  - Recent activity feed

### 4. Check-In Process
1. Click "Check In" button on dashboard
2. Click "Open QR Scanner"
3. If camera access is denied, use "Test Check-In (Demo)" button
4. For manual testing, enter: `SK2024-MAIN-001` or click demo button
5. Verify points awarded:
   - Before 7:45 AM MST: 2 points (Early)
   - 7:45-8:00 AM MST: 1 point (On-time)
   - After 8:00 AM MST: 0 points (Late)
6. Check that streak increases to 1 day

### 5. Profile & Avatar
1. Navigate to Profile page
2. Click "Change Avatar"
3. Select a default avatar
4. Save changes
5. Refresh page to verify avatar persists

### 6. Rewards Catalog
1. Navigate to Rewards page
2. Browse available rewards
3. Filter by category (Weekly, Monthly, Quarterly, Annual)
4. Note point costs for each reward
5. Try to redeem (should fail if insufficient points)

### 7. Leaderboard
1. Navigate to Leaderboard
2. View top performers
3. Check your own ranking

## Test Flow 2: Admin User

### 1. Admin Registration
1. Sign out if logged in as employee
2. Sign up with:
   - Email: test.admin@systemkleen.com
   - Password: TestAdmin123!
3. **IMPORTANT**: After registration, you need to manually update user role in Supabase:
   - Go to Supabase dashboard
   - Find the user in `employees` table
   - Change `role` from 'employee' to 'admin'

### 2. Admin Dashboard
1. After role update, log out and log back in
2. You should now see Admin menu items:
   - Executive Dashboard
   - User Management
   - Redemptions
   - Settings

### 3. Executive Dashboard
Verify you can see:
- Real-time metrics (Active Users, Check-ins Today, etc.)
- Business KPIs
- Engagement metrics
- System health indicators
- Charts and analytics

### 4. User Management
1. Navigate to User Management
2. View all employees
3. Test features:
   - Award bonus points to an employee
   - Filter by department/status
   - Search for specific users
   - Bulk actions

### 5. Redemption Management
1. Navigate to Redemptions
2. View pending redemptions
3. Test approval/rejection workflow
4. Check redemption history

### 6. Real-time Updates
1. Keep admin dashboard open
2. In another browser/incognito, log in as employee
3. Perform a check-in
4. Verify admin dashboard shows real-time update

## Verification Checklist

### Employee Features ✓
- [ ] Registration and login works
- [ ] Profile setup saves to database
- [ ] Check-in awards correct points based on time
- [ ] Avatar selection persists
- [ ] Points balance updates correctly
- [ ] Streak tracking works
- [ ] Can view rewards catalog
- [ ] Can view leaderboard

### Admin Features ✓
- [ ] Admin role gives access to admin pages
- [ ] Executive dashboard shows real-time data
- [ ] Can manage users
- [ ] Can award bonus points
- [ ] Can manage redemptions
- [ ] Real-time updates work

### Known Issues to Test
1. **Avatar Save**: Verify avatar selection saves to database
2. **QR Scanner**: Test with both camera and demo button
3. **Time Zones**: Verify MST timezone is used for check-ins
4. **Real-time Updates**: Check WebSocket connection in admin panel

## Database Verification
You can verify data in Supabase dashboard:
1. `employees` table - User data and points
2. `check_ins` table - Check-in records
3. `rewards` table - Available rewards
4. `redemptions` table - Redemption requests
5. `point_transactions` table - Point history