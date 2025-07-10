import { create } from 'zustand';
import { pb } from '../lib/pocketbase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Actions
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => void;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      set({
        user: authData.record as unknown as User,
        isAuthenticated: true,
        loading: false
      });
      
      return { success: true, message: 'Successfully signed in!' };
    } catch (error: any) {
      set({ loading: false });
      return {
        success: false,
        message: error.message || 'Sign in failed. Please try again.'
      };
    }
  },

  signOut: () => {
    pb.authStore.clear();
    set({
      user: null,
      isAuthenticated: false
    });
  },

  signUp: async (name: string, email: string, password: string) => {
    set({ loading: true });
    
    try {
      await pb.collection('users').create({
        name,
        email,
        password,
        passwordConfirm: password,
        role: 'employee',
        status: 'approved'
      });
      
      set({ loading: false });
      return {
        success: true,
        message: 'Account created successfully! Please wait for admin approval.'
      };
    } catch (error: any) {
      set({ loading: false });
      return {
        success: false,
        message: error.message || 'Sign up failed. Please try again.'
      };
    }
  },

  checkAuth: () => {
    if (pb.authStore.isValid && pb.authStore.model) {
      const user = pb.authStore.model as unknown as User;
      set({
        user,
        isAuthenticated: true
      });
    }
  }
}));