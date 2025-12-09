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
          // ⚡ FIXED: React MUST be bundled with Radix to avoid forwardRef errors
          if (id.includes('node_modules')) {
            // React + Radix together to prevent initialization issues
            if (id.includes('react') || id.includes('@radix-ui')) {
              return 'react-ui';
            }
            // Router
            if (id.includes('react-router')) {
              return 'router';
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            // Forms
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'forms';
            }
            // Query
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            // Date utilities
            if (id.includes('date-fns')) {
              return 'date';
            }
            // Icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Charts
            if (id.includes('recharts')) {
              return 'charts';
            }
            // Carousel
            if (id.includes('embla-carousel')) {
              return 'carousel';
            }
            // Other vendor libs
            return 'vendor';
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
