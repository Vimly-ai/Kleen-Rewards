// This auth store is no longer used - we use Clerk for authentication
// Keeping file to avoid import errors, but all exports are dummy

export const useAuthStore = () => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  signIn: async () => ({ success: false, message: 'Use Clerk' }),
  signOut: () => {},
  signUp: async () => ({ success: false, message: 'Use Clerk' }),
  checkAuth: () => {}
});