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
          // ⚡ React core — chunk immuable, très bien caché
          'react-vendor': ['react', 'react-dom'],
          // Router séparé — change rarement
          'router': ['react-router-dom'],
          // SEO — non critique pour le rendu initial
          'seo': ['react-helmet-async'],
          // ⚡ Radix UI critique (au-dessus du fold)
          'ui-radix-core': [
            '@radix-ui/react-select',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-slider',
            '@radix-ui/react-label',
            '@radix-ui/react-separator',
          ],
          // Radix UI secondaire — chargé après interaction
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
          // Supabase — gros package, chunk dédié
          'supabase': ['@supabase/supabase-js'],
          // Date utils
          'date-core': ['date-fns'],
          // Forms — chargés seulement sur pages avec formulaires
          'forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
          // ⚡ Recharts — ~500KB, chargé uniquement sur pages avec graphiques
          'charts': ['recharts'],
          // Sécurité — chargé seulement pour contenu utilisateur
          'sanitize': ['dompurify'],
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
