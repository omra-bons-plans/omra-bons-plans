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
  
  // ⚡ Hide pre-render elements IMMEDIATELY before React hydration
  if (typeof window !== 'undefined' && window.__HIDE_PRERENDER__) {
    window.__HIDE_PRERENDER__();
  }
  
  // Nettoyer le contenu de pré-rendu
  rootElement.innerHTML = '';
  
  createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
  
  // ⚡ Remove pre-render elements after short delay
  requestAnimationFrame(() => {
    const prerenderHero = document.getElementById('prerender-hero');
    const prerenderSkeleton = document.getElementById('prerender-skeleton');
    if (prerenderHero) {
      prerenderHero.classList.add('hidden');
      setTimeout(() => prerenderHero.remove(), 150);
    }
    if (prerenderSkeleton) {
      prerenderSkeleton.style.display = 'none';
      setTimeout(() => prerenderSkeleton.remove(), 150);
    }
  });
  
  console.log('✅ React app rendered successfully');
} else {
  console.error('❌ Root element not found!');
}

// Extend window type
declare global {
  interface Window {
    __HIDE_PRERENDER__?: () => void;
  }
}