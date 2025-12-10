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
        // ⚡ OPTIMIZED CHUNKING: Separate vendor bundles for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks(id) {
          // ⚡ Ultra-optimized chunking for mobile LCP
          if (id.includes('node_modules')) {
            // React core - smallest possible chunk
            if (id.includes('react-dom')) return 'react-dom';
            if (id.includes('react') && !id.includes('react-router') && !id.includes('react-hook-form') && !id.includes('react-helmet') && !id.includes('react-query')) return 'react-core';
            
            // Router - separate chunk
            if (id.includes('react-router')) return 'router';
            
            // ⚡ Icons - LARGE bundle, must be separate
            if (id.includes('lucide-react')) return 'icons';
            
            // ⚡ Radix UI - grouped by usage frequency
            if (id.includes('@radix-ui/react-select') || id.includes('@radix-ui/react-popover')) return 'ui-critical';
            if (id.includes('@radix-ui')) return 'ui-deferred';
            
            // Supabase - deferred
            if (id.includes('@supabase')) return 'supabase';
            
            // Data fetching - deferred
            if (id.includes('@tanstack')) return 'query';
            
            // Date utilities - deferred
            if (id.includes('date-fns')) return 'date';
            
            // Forms - deferred
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) return 'forms';
            
            // Helmet - deferred
            if (id.includes('react-helmet')) return 'helmet';
          }
        }
      },
    },
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    cssMinify: true,
    cssCodeSplit: true,
    reportCompressedSize: false,
    sourcemap: false
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
  // ⚡ Optimize dependencies - pre-bundle critical ones
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@supabase/supabase-js'
    ],
    exclude: ['@tanstack/react-query-devtools']
  },
  // ⚡ Faster dev builds
  esbuild: {
    legalComments: 'none',
    treeShaking: true
  }
}));
