# Admin Account Setup Guide

This guide explains how to set up **systemkleen@gmail.com** as the main administrator account for the Employee Rewards System.

## 📋 Admin Account Credentials

- **Email:** systemkleen@gmail.com
- **Password:** SystemKleen!25
- **Role:** super_admin

## 🚀 Setup Instructions

Since this application uses Clerk for authentication, the admin account must be configured through Clerk. Choose one of the following methods:

### Method 1: Clerk Dashboard (Recommended)

1. **Sign in to Clerk Dashboard**
   - Go to: https://dashboard.clerk.com
   - Sign in with your Clerk account

2. **Create or Find User**
   - Navigate to the "Users" section
   - Check if systemkleen@gmail.com already exists
   - If not, click "Create user"

3. **Set User Details**
   - Email: `systemkleen@gmail.com`
   - Password: `SystemKleen!25`
   - First name: `System`
   - Last name: `Admin`

4. **Configure Admin Role**
   - Click on the user after creation
   - Go to the "Metadata" tab
   - In the "Public metadata" section, add:
   ```json
   {
     "role": "super_admin"
   }
   ```
   - Click "Save"

### Method 2: Through App Sign-Up

1. **Sign Up in Your App**
   - Go to your deployed app
   - Click "Sign Up"
   - Use email: `systemkleen@gmail.com`
   - Use password: `SystemKleen!25`

2. **Update Role in Clerk**
   - Go to Clerk dashboard
   - Find the newly created user
   - Add the public metadata as shown above

### Method 3: Using Setup Script

We've provided setup scripts in the `scripts/` directory:

1. **Set Clerk Secret Key**
   ```bash
   export CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY
   ```

2. **Run Setup Script**
   ```bash
   # For automated setup (requires npm packages)
   node scripts/setup-admin.js
   
   # For manual instructions
   node scripts/setup-admin-simple.js
   ```

## ✅ Verifying Admin Access

After setup, the admin account will have access to:

- **User Management** - View, approve, and manage all users
- **Bonus Points** - Award bonus points to employees
- **System Settings** - Configure system-wide settings
- **Analytics** - View comprehensive analytics and reports
- **All Employee Features** - Plus administrative controls

## 🔒 Security Notes

1. **Change the password** after first login for security
2. **Enable 2FA** in Clerk dashboard for the admin account
3. **Limit super_admin** role to trusted administrators only
4. **Regular audits** of admin activities are recommended

## 🛠️ Troubleshooting

If you encounter issues:

1. **Verify Clerk Configuration**
   - Ensure VITE_CLERK_PUBLISHABLE_KEY is set correctly
   - Check that Clerk project is active

2. **Check User Metadata**
   - In Clerk dashboard, verify public metadata contains `"role": "super_admin"`
   - Metadata must be in valid JSON format

3. **Clear Browser Cache**
   - After updating metadata, clear cache and cookies
   - Sign out and sign back in

## 📞 Support

For additional help:
- Check Clerk documentation: https://clerk.com/docs
- Review app documentation in `/docs` directory
- Contact system administrator

---

**Important:** Keep these admin credentials secure. This account has full system access and should only be used by authorized personnel.