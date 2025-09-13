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

/**
 * Hook pour optimiser les performances SEO
 */
export const useSEOPerformance = () => {
  useEffect(() => {
    // Précharger les ressources critiques
    const preloadCriticalResources = () => {
      const criticalImages = [
        '/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png', // Logo
        '/lovable-uploads/81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png'  // Hero image
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimiser les fonts
    const optimizeFonts = () => {
      const fontLinks = document.querySelectorAll('link[href*="fonts"]');
      fontLinks.forEach(link => {
        link.setAttribute('rel', 'preload');
        link.setAttribute('as', 'font');
        link.setAttribute('crossorigin', 'anonymous');
      });
    };

    preloadCriticalResources();
    optimizeFonts();
  }, []);

  return {
    preloadImage: (src: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    }
  };
};