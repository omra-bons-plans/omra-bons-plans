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
          // Critical vendors - smallest bundle
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-react';
          }
          // Router separated
          if (id.includes('react-router-dom')) {
            return 'vendor-router';
          }
          // Supabase separated
          if (id.includes('@supabase/supabase-js')) {
            return 'vendor-supabase';
          }
          // Form libraries
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
            return 'vendor-forms';
          }
          // UI library (Radix) - defer
          if (id.includes('@radix-ui')) {
            return 'vendor-ui';
          }
          // Query library
          if (id.includes('@tanstack/react-query')) {
            return 'vendor-query';
          }
          // Icons - defer
          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }
          // Charts - heavy, defer
          if (id.includes('recharts')) {
            return 'vendor-charts';
          }
          // Rich text editor - heavy, defer
          if (id.includes('dompurify') || id.includes('react-helmet')) {
            return 'vendor-editor';
          }
          // Date utils
          if (id.includes('date-fns')) {
            return 'vendor-dates';
          }
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    chunkSizeWarningLimit: 500,
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        dead_code: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        keep_fargs: false,
        hoist_vars: false,
        if_return: true,
        join_vars: true,
        side_effects: true
      },
      mangle: {
        safari10: true,
        toplevel: true
      },
      format: {
        comments: false
      }
    },
    cssMinify: true,
    cssCodeSplit: true,
    reportCompressedSize: false,
    sourcemap: false,
    // More aggressive optimizations
    modulePreload: {
      polyfill: false
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
