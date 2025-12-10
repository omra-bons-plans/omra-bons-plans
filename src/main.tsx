import { createRoot } from 'react-dom/client'
import { StrictMode, lazy, Suspense } from 'react'

// ⚡ CRITICAL: Import CSS first for fastest paint
import './index.css'

// ⚡ LAZY LOAD: Heavy dependencies loaded after initial render
const QueryClientProvider = lazy(() => 
  import('@tanstack/react-query').then(m => ({ default: m.QueryClientProvider }))
);
const HelmetProvider = lazy(() => 
  import('react-helmet-async').then(m => ({ default: m.HelmetProvider }))
);
const App = lazy(() => import('./App'));

// ⚡ Minimal loading state - no heavy components
const MinimalLoader = () => (
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
      border: '3px solid #e5e5e5',
      borderTopColor: '#b4823c',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
);

const rootElement = document.getElementById("root");

if (rootElement) {
  // ⚡ Hide pre-render IMMEDIATELY
  if (typeof window !== 'undefined' && window.__HIDE_PRERENDER__) {
    window.__HIDE_PRERENDER__();
  }
  
  // ⚡ Create QueryClient lazily to reduce initial bundle
  const getQueryClient = () => {
    const { QueryClient } = require('@tanstack/react-query');
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 10,
          refetchOnWindowFocus: false,
        },
      },
    });
  };

  // ⚡ Deferred render with lazy providers
  const renderApp = async () => {
    const { QueryClient, QueryClientProvider: QCP } = await import('@tanstack/react-query');
    const { HelmetProvider: HP } = await import('react-helmet-async');
    const AppComponent = (await import('./App')).default;
    
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 10,
          refetchOnWindowFocus: false,
        },
      },
    });

    createRoot(rootElement).render(
      <StrictMode>
        <HP>
          <QCP client={queryClient}>
            <AppComponent />
          </QCP>
        </HP>
      </StrictMode>
    );
  };

  // ⚡ Start render immediately
  renderApp();
  
  // ⚡ Cleanup pre-render elements
  requestAnimationFrame(() => {
    const prerenderHero = document.getElementById('prerender-hero');
    const prerenderSkeleton = document.getElementById('prerender-skeleton');
    if (prerenderHero) {
      prerenderHero.classList.add('hidden');
      setTimeout(() => prerenderHero.remove(), 100);
    }
    if (prerenderSkeleton) {
      prerenderSkeleton.style.display = 'none';
      setTimeout(() => prerenderSkeleton.remove(), 100);
    }
  });
}