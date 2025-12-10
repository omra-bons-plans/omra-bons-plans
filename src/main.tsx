import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx'
import './index.css'

console.log('🚀 App starting...');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById("root");

if (rootElement) {
  console.log('✅ Root element found, rendering React app...');
  
  // ⚡ LCP FIX: NE PAS supprimer le prerender-hero - il sert de LCP
  // React va se superposer dessus avec z-index plus élevé
  // On supprime UNIQUEMENT le skeleton (pas l'image hero)
  const prerenderSkeleton = document.getElementById('prerender-skeleton');
  if (prerenderSkeleton) {
    prerenderSkeleton.style.display = 'none';
  }
  
  createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
  
  // ⚡ LCP FIX: Supprimer le prerender-hero APRÈS que React soit complètement rendu
  // Utiliser un délai plus long pour s'assurer que le LCP est mesuré
  setTimeout(() => {
    const prerenderHero = document.getElementById('prerender-hero');
    if (prerenderHero) {
      prerenderHero.style.opacity = '0';
      prerenderHero.style.pointerEvents = 'none';
      // Supprimer du DOM après la transition
      setTimeout(() => prerenderHero.remove(), 300);
    }
  }, 1500); // 1.5s après le rendu React - le LCP aura été mesuré
  
  console.log('✅ React app rendered successfully');
} else {
  console.error('❌ Root element not found!');
}