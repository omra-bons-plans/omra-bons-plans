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
        // ⚡ STABLE CHUNKING: Simple vendor separation
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Vendor bundle for stable caching
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('@radix-ui')) return 'ui';
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('@tanstack')) return 'query';
            if (id.includes('date-fns')) return 'date';
            return 'vendor';
          }
        }
      },
    },
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging
        drop_debugger: true,
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
