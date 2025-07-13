#!/usr/bin/env node

/**
 * Simple Admin Setup Instructions
 * 
 * Since this app uses Clerk for authentication, the admin account
 * needs to be configured through Clerk's dashboard.
 * 
 * This file provides step-by-step instructions for setting up
 * systemkleen@gmail.com as the main admin account.
 */

console.log(`
🔐 Admin Account Setup Instructions
===================================

To set up systemkleen@gmail.com as the main admin account:

📋 Account Details:
   Email: systemkleen@gmail.com
   Password: SystemKleen!25
   Role: super_admin

Option 1: Through Clerk Dashboard (Recommended)
-----------------------------------------------
1. Go to your Clerk dashboard: https://dashboard.clerk.com
2. Navigate to "Users" section
3. Click "Create user" or find existing user
4. Set email: systemkleen@gmail.com
5. Set password: SystemKleen!25
6. After creation, click on the user
7. Go to "Metadata" tab
8. In "Public metadata", add:
   {
     "role": "super_admin"
   }
9. Save changes

Option 2: First-Time Sign Up
----------------------------
1. Sign up through your app with:
   - Email: systemkleen@gmail.com
   - Password: SystemKleen!25
2. Go to Clerk dashboard
3. Find the user in "Users" section
4. Update their public metadata as shown above

Option 3: Using Clerk CLI
-------------------------
1. Install Clerk CLI: npm install -g @clerk/clerk-cli
2. Authenticate: clerk login
3. Create user:
   clerk users create \\
     --email-address systemkleen@gmail.com \\
     --password SystemKleen!25 \\
     --first-name System \\
     --last-name Admin
4. Update metadata:
   clerk users update <USER_ID> \\
     --public-metadata '{"role":"super_admin"}'

After Setup:
-----------
✅ The admin can sign in at your app
✅ They'll have access to all admin features:
   - User Management
   - Bonus Points Awards
   - System Settings
   - Analytics Dashboard

🌟 This account will be the main super admin with full privileges!
`)

// Also create a JSON file with the config for reference
const fs = require('fs')
const path = require('path')

const adminConfig = {
  email: 'systemkleen@gmail.com',
  password: 'SystemKleen!25',
  role: 'super_admin',
  publicMetadata: {
    role: 'super_admin'
  },
  instructions: 'Update this user in Clerk dashboard with the publicMetadata shown above'
}

const configPath = path.join(__dirname, 'admin-config.json')
fs.writeFileSync(configPath, JSON.stringify(adminConfig, null, 2))
console.log(`\n📄 Configuration saved to: ${configPath}`)