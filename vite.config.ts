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
        manualChunks: {
          // ⚡ Core React - cached long-term
          'react-vendor': ['react', 'react-dom'],
          // Router - separate chunk
          'router': ['react-router-dom'],
          // ⚡ Icons - separate chunk for better caching (large bundle)
          'icons': ['lucide-react'],
          // ⚡ UI components - single chunk to reduce requests
          'ui': ['@radix-ui/react-select', '@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-checkbox', '@radix-ui/react-slider', '@radix-ui/react-tabs', '@radix-ui/react-accordion'],
          // Data fetching
          'query': ['@tanstack/react-query'],
          // Supabase
          'supabase': ['@supabase/supabase-js'],
          // ⚡ Date utilities - separate chunk with locale
          'date': ['date-fns'],
          // ⚡ Forms - separate chunk
          'forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
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
      '@supabase/supabase-js',
      'onnxruntime-web'
    ],
    exclude: ['@tanstack/react-query-devtools']
  },
  // ⚡ Faster dev builds
  esbuild: {
    legalComments: 'none',
    treeShaking: true
  }
}));
