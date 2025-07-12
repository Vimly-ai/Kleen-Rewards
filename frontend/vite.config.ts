import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    // Clear output directory before build
    emptyOutDir: true,
    // Optimize bundle size
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // Manual chunking for better caching
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'auth': ['@clerk/clerk-react'],
          'db': ['@supabase/supabase-js'],
          'qr': ['@zxing/browser', '@zxing/library', 'qr-scanner', 'qrcode'],
          'ui': ['lucide-react', 'sonner']
        }
      }
    },
    // Bundle size warning limit
    chunkSizeWarningLimit: 1000,
    // Minification options
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    }
  },
  // Ensure proper asset handling
  base: '/',
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@clerk/clerk-react',
      '@supabase/supabase-js',
      'lucide-react',
      'sonner'
    ],
    exclude: [
      '@zxing/browser',
      '@zxing/library',
      'qr-scanner',
      'qrcode'
    ]
  },
  // Development server optimization
  server: {
    hmr: {
      overlay: false
    }
  }
})