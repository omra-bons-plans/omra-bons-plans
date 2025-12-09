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
          // ⚡ OPTIMIZED: Fine-grained code splitting for faster LCP
          if (id.includes('node_modules')) {
            // React core - loaded first
            if (id.includes('react-dom') || id.includes('react/')) {
              return 'react-core';
            }
            // Router - critical for navigation
            if (id.includes('react-router')) {
              return 'router';
            }
            // Supabase - defer if possible
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            // Forms - only needed on form pages
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'forms';
            }
            // Query - needed for data fetching
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            // UI components - split by usage
            if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-alert-dialog')) {
              return 'ui-dialogs';
            }
            if (id.includes('@radix-ui/react-select') || id.includes('@radix-ui/react-popover')) {
              return 'ui-selects';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-radix';
            }
            // Date utilities - defer
            if (id.includes('date-fns')) {
              return 'date';
            }
            // Lucide icons - large, defer
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Charts - only on specific pages
            if (id.includes('recharts')) {
              return 'charts';
            }
            // Carousel - lazy loaded
            if (id.includes('embla-carousel')) {
              return 'carousel';
            }
            // Other vendor libs
            return 'vendor';
          }
          // Home page components - critical
          if (id.includes('/components/home/')) {
            return 'home';
          }
          // SEO components - needed early
          if (id.includes('/components/SEO/')) {
            return 'seo';
          }
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    chunkSizeWarningLimit: 300, // Stricter limit
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        dead_code: true,
        unused: true
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
    sourcemap: false,
    // ⚡ Optimize for faster initial load
    modulePreload: {
      polyfill: false
    },
    // ⚡ Treeshake aggressively
    treeshake: {
      moduleSideEffects: false
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
