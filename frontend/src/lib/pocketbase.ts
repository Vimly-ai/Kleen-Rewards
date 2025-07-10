import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://localhost:8090');

// Enable auto-cancellation of pending requests
pb.autoCancellation(false);

// Listen to auth state changes
pb.authStore.onChange(() => {
  console.log('Auth state changed:', pb.authStore.isValid);
});