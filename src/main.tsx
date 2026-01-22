import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx'
import './index.css'

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
  // ⚡ LCP FIX: Hide skeleton immediately
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
  
  // ⚡ LCP FIX: Delay pre-render removal to ensure React has painted
  setTimeout(() => {
    const prerenderHero = document.getElementById('prerender-hero');
    if (prerenderHero) {
      prerenderHero.style.display = 'none';
      prerenderHero.remove();
    }
  }, 50);
}