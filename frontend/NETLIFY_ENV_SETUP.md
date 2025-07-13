# Netlify Environment Variables Setup

## Important: Local .env vs Production Environment

The `.env` file only works locally. For your deployed Netlify site, you need to set environment variables in Netlify's dashboard.

## How to Set Environment Variables in Netlify:

### Method 1: Netlify Dashboard (Recommended)

1. Go to https://app.netlify.com
2. Select your site (employee-rewards)
3. Go to "Site settings"
4. Click on "Environment variables" in the left sidebar
5. Click "Add a variable"
6. Add these variables:

```
Key: VITE_CLERK_PUBLISHABLE_KEY
Value: pk_test_Z29sZGVuLWdyYWNrbGUtODguY2xlcmsuYWNjb3VudHMuZGV2JA

Key: VITE_ENABLE_MOCK_DATA
Value: false

Key: VITE_SUPABASE_URL
Value: https://demo.supabase.co

Key: VITE_SUPABASE_ANON_KEY
Value: demo-key

Key: VITE_APP_ENV
Value: production

Key: VITE_ENABLE_PWA
Value: true
```

7. Click "Save"
8. **Important**: Redeploy your site for changes to take effect
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

### Method 2: Netlify CLI

If you have Netlify CLI installed:

```bash
netlify env:set VITE_CLERK_PUBLISHABLE_KEY "pk_test_Z29sZGVuLWdyYWNrbGUtODguY2xlcmsuYWNjb3VudHMuZGV2JA"
netlify env:set VITE_ENABLE_MOCK_DATA "false"
netlify env:set VITE_SUPABASE_URL "https://demo.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "demo-key"
netlify env:set VITE_APP_ENV "production"
netlify env:set VITE_ENABLE_PWA "true"
```

### Method 3: netlify.toml (Not recommended for secrets)

You can also use `netlify.toml`, but this is not recommended for sensitive keys as they'll be in your repository:

```toml
[build.environment]
  VITE_CLERK_PUBLISHABLE_KEY = "pk_test_Z29sZGVuLWdyYWNrbGUtODguY2xlcmsuYWNjb3VudHMuZGV2JA"
  VITE_ENABLE_MOCK_DATA = "false"
```

## Verify Environment Variables Are Set:

1. After setting and redeploying, visit your site
2. Open browser console (F12)
3. You should see the debug log showing your Clerk key
4. If you see "No key", the environment variables aren't set properly

## Common Issues:

1. **Variables not showing up**: Make sure to redeploy after adding variables
2. **Wrong variable names**: All Vite env vars must start with `VITE_`
3. **Quotes in values**: Don't include quotes in the Netlify dashboard values
4. **Build cache**: Sometimes you need to clear build cache and redeploy

## Quick Test:

Add this to your site and check console:
```javascript
console.log('Clerk Key exists:', !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)
```

If it shows `false`, the environment variable isn't set in Netlify.