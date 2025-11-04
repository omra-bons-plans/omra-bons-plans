/**
 * Optimisations critiques pour améliorer PSI Mobile
 * Focus sur réduction du TBT et temps d'exécution JS
 */

/**
 * Yield to main thread - permet au navigateur de respirer
 * Utiliser entre les tâches lourdes pour réduire les long tasks
 */
export const yieldToMain = () => {
  return new Promise(resolve => {
    if ('scheduler' in window && 'yield' in (window as any).scheduler) {
      (window as any).scheduler.yield().then(resolve);
    } else {
      setTimeout(resolve, 0);
    }
  });
};

/**
 * Découpe une tâche lourde en micro-tâches
 * Usage: await runInChunks(largeArray, (item) => processItem(item))
 */
export const runInChunks = async <T>(
  items: T[],
  callback: (item: T) => void,
  chunkSize = 50
) => {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunk.forEach(callback);
    await yieldToMain();
  }
};

/**
 * Defer une fonction jusqu'à ce que le navigateur soit idle
 */
export const runWhenIdle = (callback: () => void, timeout = 2000) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 1);
  }
};

/**
 * Précharge intelligente - évite le blocking
 */
export const preloadCriticalAssets = () => {
  runWhenIdle(() => {
    // Précharger uniquement l'image hero critique
    const criticalImages = [
      '/hero-kaaba-2025-optimized.avif',
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    });
  });
};

/**
 * Mesurer et logger Core Web Vitals (dev uniquement)
 */
export const measureCoreWebVitals = () => {
  if (process.env.NODE_ENV !== 'development') return;

  runWhenIdle(() => {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigationTiming) {
      const metrics = {
        FCP: navigationTiming.responseEnd - navigationTiming.fetchStart,
        LCP: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
        TTI: navigationTiming.domInteractive - navigationTiming.fetchStart,
      };
      
      console.table({
        'FCP (First Contentful Paint)': `${(metrics.FCP / 1000).toFixed(2)}s`,
        'LCP (Largest Contentful Paint)': `${(metrics.LCP / 1000).toFixed(2)}s`,
        'TTI (Time to Interactive)': `${(metrics.TTI / 1000).toFixed(2)}s`,
      });
    }
  }, 3000);
};
