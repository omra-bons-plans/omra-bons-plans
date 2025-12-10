import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx'
import './index.css'

// ⚡ Create QueryClient with optimized settings
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
  // ⚡ Hide pre-render elements before React hydration
  if (typeof window !== 'undefined' && window.__HIDE_PRERENDER__) {
    window.__HIDE_PRERENDER__();
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
}