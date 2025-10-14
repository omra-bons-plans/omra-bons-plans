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
        manualChunks: {
          // Core essentials - loaded first
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          // Heavy UI libs - lazy loaded
          carousel: ['embla-carousel-react'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast', '@radix-ui/react-tabs'],
          supabase: ['@supabase/supabase-js'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Icons split separately (heavy)
          lucide: ['lucide-react'],
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        },
        // Optimize file naming for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    chunkSizeWarningLimit: 500, // Stricter limit for mobile
    target: 'es2020', // Modern target = smaller code
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2, // More aggressive
        pure_funcs: ['console.info', 'console.debug', 'console.warn']
      },
      mangle: {
        safari10: true
      }
    },
    cssMinify: true, // esbuild (default) is fast and reliable
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
}));
