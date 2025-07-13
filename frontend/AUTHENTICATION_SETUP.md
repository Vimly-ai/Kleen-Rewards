# Authentication Setup Guide

## Current Configuration

The application is currently running in **Demo Mode** with test credentials. To enable real authentication, you need to configure both Clerk and Supabase with production credentials.

## Why Authentication Isn't Working

The current setup uses:
- **Demo Clerk Key**: `pk_test_Z29sZGVuLWdyYWNrbGUtODguY2xlcmsuYWNjb3VudHMuZGV2JA`
- **Demo Supabase URL**: `https://demo.supabase.co`
- **Demo Mode Enabled**: `VITE_ENABLE_MOCK_DATA = "true"`

These are placeholder values that don't connect to real services.

## To Enable Real Authentication

### 1. Create a Clerk Account
1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Get your production publishable key from the Clerk dashboard

### 2. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Get your project URL and anon key from Project Settings > API

### 3. Update Environment Variables

#### For Local Development
Create a `.env` file in the frontend directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_real_clerk_publishable_key
VITE_SUPABASE_URL=your_real_supabase_url
VITE_SUPABASE_ANON_KEY=your_real_supabase_anon_key
VITE_ENABLE_MOCK_DATA=false
```

#### For Netlify Deployment
1. Go to Netlify > Site Settings > Environment Variables
2. Add the same variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ENABLE_MOCK_DATA` = `false`

### 4. Update netlify.toml
Remove or comment out the demo environment variables:
```toml
[build.environment]
  NODE_VERSION = "18"
  # Remove these lines or update with real values:
  # VITE_ENABLE_MOCK_DATA = "true"
  # VITE_SUPABASE_URL = "https://demo.supabase.co"
  # VITE_SUPABASE_ANON_KEY = "demo-key"
  # VITE_CLERK_PUBLISHABLE_KEY = "pk_test_..."
```

### 5. Set Up Supabase Database
Run the SQL migrations in the `/supabase` directory to create the required tables.

## Demo Mode Features

When `VITE_ENABLE_MOCK_DATA = "true"`:
- Only demo accounts are available
- No real authentication occurs
- Data is stored in localStorage
- Perfect for testing and demonstrations

## Troubleshooting

If you see authentication glitches:
1. Check browser console for specific errors
2. Verify all environment variables are set correctly
3. Ensure Clerk domain settings include your deployment URL
4. Check that Supabase CORS settings allow your domain

## Security Notes

- Never commit real API keys to git
- Use environment variables for all sensitive data
- Enable Row Level Security (RLS) in Supabase
- Configure Clerk security settings appropriately