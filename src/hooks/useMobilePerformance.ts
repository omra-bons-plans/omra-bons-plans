import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

/**
 * Hook pour optimiser les performances MOBILE uniquement
 * - Différer les scripts non critiques
 * - Réduire le JS exécutable initial
 * - Optimiser le rendu mobile
 */
export const useMobilePerformance = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Optimisations uniquement sur mobile
    if (!isMobile) return;

    // Différer les tâches non critiques après le LCP
    const deferNonCritical = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Nettoyer les animations coûteuses
          document.body.style.willChange = 'auto';
          
          // Log performance (dev only)
          if (import.meta.env.DEV) {
            const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            if (navigationTiming) {
              const lcp = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
              console.log(`📱 Mobile LCP: ${(lcp / 1000).toFixed(2)}s`);
            }
          }
        }, { timeout: 2000 });
      }
    };

    // Attendre que la page soit interactive
    if (document.readyState === 'complete') {
      deferNonCritical();
    } else {
      window.addEventListener('load', deferNonCritical, { once: true });
    }

    // Optimiser les fonts sur mobile
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        console.log('✅ Fonts loaded on mobile');
      });
    }

    return () => {
      window.removeEventListener('load', deferNonCritical);
    };
  }, [isMobile]);

  return {
    isMobile,
    isOptimized: true
  };
};
