import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React bundle
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          // Router separate
          if (id.includes('node_modules/react-router-dom')) {
            return 'vendor-router';
          }
          // UI components
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-ui';
          }
          // Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          // Forms
          if (id.includes('node_modules/react-hook-form') || 
              id.includes('node_modules/@hookform') || 
              id.includes('node_modules/zod')) {
            return 'vendor-forms';
          }
          // Icons
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Date utilities
          if (id.includes('node_modules/date-fns')) {
            return 'vendor-date';
          }
          // Other utilities
          if (id.includes('node_modules') && !id.includes('node_modules/react')) {
            return 'vendor-utils';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
