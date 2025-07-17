/**
 * Utility to clear all demo mode flags from localStorage
 * This ensures the app uses real Supabase data instead of demo data
 */

export function clearDemoMode(): void {
  // Clear all demo-related localStorage items
  localStorage.removeItem('demoMode')
  localStorage.removeItem('demoUserId')
  localStorage.removeItem('demoUserType')
  localStorage.removeItem('demoAuth')
  localStorage.removeItem('demo_user_email')
  
  // Clear demo redemptions
  localStorage.removeItem('demo_redemptions')
  
  // Clear demo QR codes
  localStorage.removeItem('systemkleen_active_qr_code')
  localStorage.removeItem('systemkleen_qr_history')
  
  console.log('Demo mode flags cleared from localStorage')
}

// Auto-clear demo mode if VITE_ENABLE_MOCK_DATA is false
if (import.meta.env.VITE_ENABLE_MOCK_DATA === 'false') {
  clearDemoMode()
} 