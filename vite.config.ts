import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // This checks every file being bundled
          if (id.includes('node_modules')) {
            // Put Tabler icons in their own chunk
            if (id.includes('@tabler/icons-react')) {
              return 'icons';
            }
            // Put Supabase in its own chunk
            if (id.includes('@supabase/supabase-js')) {
              return 'supabase';
            }
            // Put React and React Router in the vendor chunk
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 600 
  }
})