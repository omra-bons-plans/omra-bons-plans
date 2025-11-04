import React, { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css'
import { preloadCriticalAssets, measureCoreWebVitals, runWhenIdle } from './utils/criticalPerformance'

// Defer HelmetProvider - non critique pour l'initial render
const HelmetProvider = lazy(() => 
  import('react-helmet-async').then(m => ({ default: m.HelmetProvider }))
);

const App = lazy(() => import('./App.tsx'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1, // Moins de retries = moins de JS exécuté
    },
  },
});

// Précharger assets critiques sans bloquer
preloadCriticalAssets();

// Minimal loader
const InitialLoader = () => (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: '#f5f5f0'
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      border: '2px solid #e5e5e0',
      borderTopColor: '#d4a574',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  </div>
);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<InitialLoader />}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>
);

// Mesurer les Core Web Vitals en dev
runWhenIdle(() => {
  measureCoreWebVitals();
});
