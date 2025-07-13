# Clerk OAuth Setup Guide

This guide will help you configure Clerk authentication to enable OAuth sign up/sign in functionality in the Employee Rewards application.

## Current Issue

The application is configured with an invalid Clerk publishable key. To enable OAuth authentication (Google, GitHub, etc.), you need to:

1. Create a Clerk account
2. Get a valid publishable key
3. Configure your environment variables

## Step-by-Step Setup

### 1. Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Click "Sign up" to create a free account
3. Verify your email address

### 2. Create an Application

1. Once logged in, click "Create application"
2. Give your application a name (e.g., "Employee Rewards")
3. Select the authentication methods you want:
   - Email/Password
   - Google OAuth
   - GitHub OAuth
   - Any other providers you need

### 3. Get Your Publishable Key

1. In your Clerk dashboard, go to "API Keys"
2. Copy the "Publishable key" (it starts with `pk_test_` for development)
3. Keep this tab open, you'll need more information

### 4. Update Environment Variables

1. Open the `.env` file in the frontend directory
2. Replace the current invalid key:

```env
# Replace this line:
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Z29sZGVuLWdyYWNrbGUtODguY2xlcmsuYWNjb3VudHMuZGV2JA

# With your actual key:
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_key_here
```

### 5. Configure Clerk Settings

In your Clerk dashboard:

1. Go to "Paths" in the left sidebar
2. Configure these settings:
   - **Sign-in URL**: `/auth`
   - **Sign-up URL**: `/auth`
   - **After sign-in URL**: `/`
   - **After sign-up URL**: `/`

3. Go to "Redirect URLs" and add:
   - `http://localhost:5173` (for local development)
   - `https://employee-rewards.netlify.app` (for production)
   - Any custom domain you're using

### 6. Enable OAuth Providers

1. In Clerk dashboard, go to "User & Authentication"
2. Click on "Social Connections"
3. Enable and configure:
   - Google (you'll need Google OAuth credentials)
   - GitHub (you'll need a GitHub OAuth app)
   - Any other providers you want

### 7. Restart Your Development Server

After updating the `.env` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Troubleshooting

### "Invalid Clerk key" Error
- Make sure your key starts with `pk_test_` or `pk_live_`
- Check for any extra spaces or quotes in the `.env` file

### OAuth Providers Not Showing
- Ensure you've enabled them in Clerk dashboard
- Clear your browser cache and cookies
- Try incognito/private browsing mode

### Redirect Errors
- Double-check all URLs in Clerk dashboard match your application
- Ensure trailing slashes are consistent

## Using Demo Mode

While setting up Clerk, you can use demo mode:

1. The application automatically falls back to demo mode if Clerk isn't configured
2. Use the demo credentials shown on the login page
3. Full functionality is available in demo mode for testing

## Need Help?

- Clerk Documentation: [https://clerk.com/docs](https://clerk.com/docs)
- Clerk Support: Available through their dashboard
- Application Issues: Check the browser console for detailed error messages

## Security Notes

- Never commit your Clerk keys to version control
- Use different keys for development and production
- Regularly rotate your keys in production environments