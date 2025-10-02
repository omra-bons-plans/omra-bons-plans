import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook pour traquer les métriques SEO importantes
 */
export const useSEOTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Traquer les Core Web Vitals
    const trackWebVitals = () => {
      if ('web-vital' in window) {
        // @ts-ignore
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(console.log);
          getFID(console.log);
          getFCP(console.log);
          getLCP(console.log);
          getTTFB(console.log);
        });
      }
    };

    // Mettre à jour les meta tags pour le tracking
    const updatePageTracking = () => {
      // Mettre à jour le titre de page dans l'historique
      if (document.title) {
        console.log('📊 Page vue:', document.title, location.pathname);
      }

      // Signaler à Google que la page a changé (pour SPA)
      if (typeof window !== 'undefined' && 'gtag' in window) {
        // @ts-ignore - gtag est défini dynamiquement par Google Analytics
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          page_path: location.pathname,
        });
      }
    };

    trackWebVitals();
    updatePageTracking();
  }, [location]);

  return {
    currentPath: location.pathname,
    currentSearch: location.search
  };
};

// ❌ REMOVED: useSEOPerformance was causing aggressive preloading that killed LCP
// Preloading ALL images is counter-productive - only preload ONE critical hero image