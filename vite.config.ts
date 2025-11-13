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
          // ⚡ MOBILE: Chunking ultra-granulaire pour réduire TBT
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) return 'react-dom';
            if (id.includes('react/')) return 'react';
            if (id.includes('react-router')) return 'router';
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('react-hook-form') || id.includes('zod')) return 'forms';
            if (id.includes('embla-carousel')) return 'carousel';
            if (id.includes('@radix-ui/react-dialog')) return 'radix-dialog';
            if (id.includes('@radix-ui/react-dropdown')) return 'radix-dropdown';
            if (id.includes('@radix-ui')) return 'radix-ui';
            if (id.includes('lucide-react')) return 'icons';
            return 'vendor';
          }
          // Séparer composants lourds
          if (id.includes('components/ui/ThreadedChatWindow')) return 'chat';
          if (id.includes('components/ui/TopicsList')) return 'topics';
          if (id.includes('components/ui/FeedbackForm')) return 'feedback';
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    chunkSizeWarningLimit: 400,
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        ecma: 2020,
        unsafe: true,
        unsafe_math: true,
        unsafe_methods: true,
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false,
        ecma: 2020,
      },
      ecma: 2020,
      toplevel: true,
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
}));
