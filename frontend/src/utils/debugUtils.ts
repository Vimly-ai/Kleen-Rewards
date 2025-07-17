/**
 * Debug utilities for development and troubleshooting
 * These can be run in the browser console
 */

// Make these available globally for console access
declare global {
  interface Window {
    clearDemoMode: () => void
    checkDemoMode: () => void
    checkEnvironment: () => void
  }
}

export function clearDemoMode(): void {
  // Clear all demo-related localStorage items
  localStorage.removeItem('demoMode')
  localStorage.removeItem('demoUserId')
  localStorage.removeItem('demoUserType')
  localStorage.removeItem('demoAuth')
  localStorage.removeItem('demo_user_email')
  localStorage.removeItem('demo_redemptions')
  localStorage.removeItem('systemkleen_active_qr_code')
  localStorage.removeItem('systemkleen_qr_history')
  
  console.log('✅ Demo mode flags cleared from localStorage')
  console.log('🔄 Please refresh the page to see real data')
}

export function checkDemoMode(): void {
  const demoMode = localStorage.getItem('demoMode')
  const demoUserId = localStorage.getItem('demoUserId')
  const demoAuth = localStorage.getItem('demoAuth')
  const envMockData = import.meta.env.VITE_ENABLE_MOCK_DATA
  
  console.log('🔍 Demo Mode Status:')
  console.log('  localStorage.demoMode:', demoMode)
  console.log('  localStorage.demoUserId:', demoUserId)
  console.log('  localStorage.demoAuth:', demoAuth ? 'exists' : 'null')
  console.log('  VITE_ENABLE_MOCK_DATA:', envMockData)
  
  if (demoMode === 'true' || envMockData === 'true') {
    console.log('⚠️  Demo mode is currently ENABLED')
  } else {
    console.log('✅ Demo mode is DISABLED - using real data')
  }
}

export function checkEnvironment(): void {
  console.log('🔍 Environment Status:')
  console.log('  VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('  VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
  console.log('  VITE_CLERK_PUBLISHABLE_KEY:', import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing')
  console.log('  VITE_WEBSOCKET_URL:', import.meta.env.VITE_WEBSOCKET_URL ? '✅ Set' : '❌ Missing')
  console.log('  VITE_ENABLE_MOCK_DATA:', import.meta.env.VITE_ENABLE_MOCK_DATA)
  console.log('  MODE:', import.meta.env.MODE)
  console.log('  DEV:', import.meta.env.DEV)
  console.log('  PROD:', import.meta.env.PROD)
}

export function checkWebSocket(): void {
  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL
  
  console.log('🔌 WebSocket Status:')
  console.log('  URL:', websocketUrl || 'Not set')
  
  if (!websocketUrl) {
    console.log('  Status: ❌ Not configured')
    console.log('💡 To enable WebSocket features:')
    console.log('  1. Start the WebSocket server: ./start-websocket.sh')
    console.log('  2. Set VITE_WEBSOCKET_URL=ws://localhost:3001 in .env.local')
    console.log('  3. Restart your frontend app')
  } else if (websocketUrl === 'ws://localhost:3001%') {
    console.log('  Status: ⚠️ Misconfigured (has % at end)')
    console.log('💡 Fix: Remove the % from VITE_WEBSOCKET_URL in .env.local')
  } else {
    console.log('  Status: ✅ Configured')
    console.log('📊 Features: Real-time stats, live notifications, online users')
  }
}

// Attach to window for console access
if (typeof window !== 'undefined') {
  window.clearDemoMode = clearDemoMode
  window.checkDemoMode = checkDemoMode
  window.checkEnvironment = checkEnvironment
  
  console.log('🛠️  Debug utilities loaded. Available commands:')
  console.log('  - clearDemoMode() - Clear all demo mode flags')
  console.log('  - checkDemoMode() - Check current demo mode status')
  console.log('  - checkEnvironment() - Check environment variables')
} 