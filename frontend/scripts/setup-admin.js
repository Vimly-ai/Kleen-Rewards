#!/usr/bin/env node

/**
 * Setup Script - Initialize Admin Account
 * 
 * This script sets up systemkleen@gmail.com as the main super admin account
 * in the Employee Rewards System.
 * 
 * Usage:
 * 1. Set your Clerk Secret Key: export CLERK_SECRET_KEY=sk_test_...
 * 2. Run: node scripts/setup-admin.js
 */

import { Clerk } from '@clerk/clerk-sdk-node'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
dotenv.config()

// Configuration
const ADMIN_EMAIL = 'systemkleen@gmail.com'
const ADMIN_PASSWORD = 'SystemKleen!25'
const ADMIN_NAME = 'System Admin'

// Validate environment variables
if (!process.env.CLERK_SECRET_KEY) {
  console.error('❌ Error: CLERK_SECRET_KEY environment variable is required')
  console.error('   Set it with: export CLERK_SECRET_KEY=sk_test_...')
  console.error('   You can find this in your Clerk dashboard under API Keys')
  process.exit(1)
}

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Error: Supabase configuration is required')
  console.error('   Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env')
  process.exit(1)
}

// Initialize Clerk
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY })

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function setupAdminAccount() {
  console.log('🚀 Setting up admin account for Employee Rewards System...')
  console.log(`📧 Admin Email: ${ADMIN_EMAIL}`)
  console.log('')

  try {
    // Step 1: Check if user already exists in Clerk
    console.log('1️⃣ Checking if user exists in Clerk...')
    let user
    
    try {
      const users = await clerk.users.getUserList({
        emailAddress: [ADMIN_EMAIL]
      })
      
      if (users.length > 0) {
        user = users[0]
        console.log('   ✅ User found in Clerk')
      }
    } catch (error) {
      console.log('   ℹ️  User not found, will create new account')
    }

    // Step 2: Create user if doesn't exist
    if (!user) {
      console.log('2️⃣ Creating new user in Clerk...')
      
      try {
        user = await clerk.users.createUser({
          emailAddress: [ADMIN_EMAIL],
          password: ADMIN_PASSWORD,
          firstName: 'System',
          lastName: 'Admin',
          publicMetadata: {
            role: 'super_admin'
          }
        })
        
        console.log('   ✅ User created successfully')
        console.log(`   📋 User ID: ${user.id}`)
      } catch (error) {
        if (error.errors?.[0]?.code === 'form_identifier_exists') {
          console.error('   ❌ User already exists but couldn\'t retrieve it')
          console.error('   💡 Try signing in through the app or check Clerk dashboard')
        } else {
          throw error
        }
        return
      }
    } else {
      console.log('2️⃣ Updating existing user role...')
    }

    // Step 3: Update user metadata to set super_admin role
    if (user) {
      console.log('3️⃣ Setting super_admin role...')
      
      await clerk.users.updateUserMetadata(user.id, {
        publicMetadata: {
          role: 'super_admin'
        }
      })
      
      console.log('   ✅ Role updated to super_admin')
    }

    // Step 4: Initialize user in Supabase (if needed)
    console.log('4️⃣ Checking Supabase database...')
    
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', ADMIN_EMAIL)
      .single()

    if (!existingUser && user) {
      console.log('   📝 Creating user profile in Supabase...')
      
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: ADMIN_EMAIL,
          name: ADMIN_NAME,
          role: 'super_admin',
          status: 'active',
          company: 'System Kleen',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.log('   ⚠️  Warning: Could not create Supabase profile')
        console.log('   ℹ️  Profile will be created automatically on first login')
      } else {
        console.log('   ✅ Supabase profile created')
      }
    } else if (existingUser) {
      console.log('   ✅ User already exists in Supabase')
      
      // Update role if needed
      if (existingUser.role !== 'super_admin') {
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'super_admin' })
          .eq('id', existingUser.id)
          
        if (!updateError) {
          console.log('   ✅ Updated Supabase role to super_admin')
        }
      }
    }

    // Success summary
    console.log('')
    console.log('✨ Setup completed successfully!')
    console.log('')
    console.log('📋 Admin Account Details:')
    console.log('   Email: ' + ADMIN_EMAIL)
    console.log('   Password: ' + ADMIN_PASSWORD)
    console.log('   Role: super_admin')
    console.log('')
    console.log('🔐 You can now sign in with these credentials at your app')
    console.log('🌟 This account has full administrative privileges')

  } catch (error) {
    console.error('')
    console.error('❌ Setup failed:', error.message)
    console.error('')
    
    if (error.status === 401) {
      console.error('🔑 Authentication error - check your CLERK_SECRET_KEY')
    } else if (error.status === 422) {
      console.error('📝 Validation error - check the user data')
    } else {
      console.error('💡 Check the error details above and try again')
    }
    
    process.exit(1)
  }
}

// Run the setup
setupAdminAccount()