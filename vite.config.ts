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
    // ⚡ modulePreload: true (défaut) — le navigateur précharge les chunks en avance
    // modulePreload: false désactivait ce mécanisme → pénalité de ~200ms sur navigation
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          // React core — immutable, well cached
          'react-vendor': ['react', 'react-dom'],
          // Router — rarely changes
          'router': ['react-router-dom'],
          // SEO — not critical for initial render
          'seo': ['react-helmet-async'],
          // Radix UI critical (above the fold)
          'ui-radix-core': [
            '@radix-ui/react-select',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-slider',
            '@radix-ui/react-label',
            '@radix-ui/react-separator',
          ],
          // Radix UI secondary — loaded after interaction
          'ui-radix-secondary': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-avatar',
            '@radix-ui/react-tooltip',
          ],
          // Data fetching
          'query': ['@tanstack/react-query'],
          // Supabase core client (lightweight, needed immediately)
          'supabase-core': ['@supabase/supabase-js'],
          // Date utils — split: only format/locale is on critical path
          'date-core': ['date-fns'],
          // Forms — only on pages with forms
          'forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
          // Recharts — only on stats pages
          'charts': ['recharts'],
          // Sanitizer — only for user-generated content
          'sanitize': ['dompurify'],
          // Carousel — non-critical
          'carousel': ['embla-carousel-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,          // ⚡ 3 passes pour meilleur minification
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        dead_code: true,
        collapse_vars: true,
        reduce_vars: true,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    cssMinify: true,
    cssCodeSplit: true,    // ⚡ CSS par chunk → seul le CSS nécessaire chargé
    reportCompressedSize: false,
    sourcemap: false,
    // ⚡ Assetssize inline limit — images < 4KB intégrées en base64
    assetsInlineLimit: 4096,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ⚡ Pré-bundle les dépendances critiques pour le démarrage rapide
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query',
    ],
    exclude: ['@tanstack/react-query-devtools'],
  },
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
  },
}));
