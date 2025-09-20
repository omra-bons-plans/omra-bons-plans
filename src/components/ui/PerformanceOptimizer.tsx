import React, { useEffect, useState } from 'react';

const PerformanceOptimizer = () => {
  const [loadTime, setLoadTime] = useState<number | null>(null);

  useEffect(() => {
    // Mesurer le temps de chargement initial
    const startTime = performance.mark('page-start');
    
    const measureLoadTime = () => {
      if (document.readyState === 'complete') {
        const endTime = performance.now();
        const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigationTiming) {
          const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
          setLoadTime(loadTime);
          console.log(`📊 Page load time: ${(loadTime / 1000).toFixed(2)}s`);
        }
      }
    };

    // Vérifier si la page est déjà chargée
    if (document.readyState === 'complete') {
      measureLoadTime();
    } else {
      window.addEventListener('load', measureLoadTime);
    }

    // Optimiser les performances avec des métriques détaillées
    const optimizePerformance = () => {
      // Réduire les reflows/repaints
      document.documentElement.style.fontSize = '16px';
      
      // Optimiser les animations
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          document.body.style.willChange = 'auto';
        });
      }
    };

    optimizePerformance();

    return () => {
      window.removeEventListener('load', measureLoadTime);
    };
  }, []);

  // En développement uniquement, afficher les métriques de performance
  if (process.env.NODE_ENV === 'development' && loadTime) {
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded z-50">
        Load: {(loadTime / 1000).toFixed(2)}s
      </div>
    );
  }

  return null;
};

export default PerformanceOptimizer;