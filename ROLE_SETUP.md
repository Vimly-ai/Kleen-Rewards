# Role Setup Instructions

## Setting User Roles in Clerk

To test the admin functionality, you need to set user roles in Clerk:

### For Admin Access:
1. Go to your Clerk Dashboard: https://dashboard.clerk.com
2. Navigate to "Users" section
3. Find the user you want to make admin (Andy@vimly.ai)
4. Click on the user
5. Go to "Public metadata" section
6. Add this JSON:
```json
{
  "role": "admin"
}
```
7. Save the changes

### For Employee Access:
- Users without the admin role automatically get employee access
- Or explicitly set:
```json
{
  "role": "employee"
}
```

## Testing the Roles

### Admin User (Andy@vimly.ai):
- Should see "Admin Portal" in navigation
- Access to: Dashboard, Employees, Redemptions, Analytics, Settings
- Red "Admin" badge in header

### Employee Users:
- Should see "Employee Rewards" in navigation  
- Access to: Dashboard, Check In, Leaderboard, Rewards, Profile
- Standard employee interface

## Routes:

### Employee Routes:
- `/` - Dashboard
- `/check-in` - Daily check-in
- `/leaderboard` - Employee rankings
- `/rewards` - Reward catalog
- `/profile` - User profile

### Admin Routes:
- `/admin` - Admin dashboard
- `/admin/employees` - Employee management
- `/admin/redemptions` - Approve/reject redemptions
- `/admin/analytics` - Engagement reports
- `/admin/settings` - System configuration

## Role Protection:
- Automatic redirect based on user role
- Admin users accessing employee routes → redirected to `/admin`
- Employee users accessing admin routes → redirected to `/`