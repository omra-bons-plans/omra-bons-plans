import { useState, useEffect } from 'react';

/**
 * Hook pour charger un composant après le LCP (Lazy Loading intelligent)
 * Attend que la page soit interactive avant de charger les composants non critiques
 */
export const useLazyComponent = (delay: number = 100) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Attendre que la page soit interactive
    if (document.readyState === 'complete') {
      const timer = setTimeout(() => setShouldLoad(true), delay);
      return () => clearTimeout(timer);
    } else {
      const handleLoad = () => {
        const timer = setTimeout(() => setShouldLoad(true), delay);
        return () => clearTimeout(timer);
      };
      window.addEventListener('load', handleLoad, { once: true });
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [delay]);

  return shouldLoad;
};
