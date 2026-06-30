import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ── Dev server ──
  server: {
    port: 5173,
  },

  // ── Production build ──
  build: {
    outDir: 'dist',
    sourcemap: false, // No source maps in production
    rollupOptions: {
      output: {
        // Split large libraries into separate cached chunks
        // NOTE: Vite 8 uses rolldown which requires manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor';
          }
          if (id.includes('node_modules/react-router-dom/') || id.includes('node_modules/react-router/')) {
            return 'router';
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'motion';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'icons';
          }
          if (id.includes('node_modules/axios/')) {
            return 'http';
          }
          if (id.includes('node_modules/zustand/')) {
            return 'store';
          }
        },
      },
    },
  },
})
