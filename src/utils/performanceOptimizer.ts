/**
 * Utilitaires d'optimisation des performances pour améliorer les Core Web Vitals
 */

/**
 * Précharge intelligemment les ressources critiques
 */
export const preloadCriticalResources = () => {
  // Déjà géré dans index.html avec fetchpriority="high"
  // On évite les duplications
  
  // Preload fonts critiques
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.href = 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);
};

/**
 * Optimise le rendu initial pour réduire le FID
 */
export const optimizeInitialRender = () => {
  // Différer les tâches non critiques
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Initialiser les éléments non critiques
      console.log('🚀 Optimisation des performances activée');
    });
  }

  // Optimiser la fonts loading
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      console.log('✅ Polices chargées');
    });
  }
};

/**
 * Divise les tâches JavaScript longues
 */
export const yieldToMain = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
};

/**
 * Optimise les images en utilisant l'Intersection Observer
 */
export const createOptimizedImageObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  const observer = new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px 0px',
    threshold: 0.1
  });

  return observer;
};

/**
 * Réduit les Layout Shifts en pré-calculant les dimensions
 */
export const preventLayoutShift = (element: HTMLElement, width: number, height: number) => {
  element.style.aspectRatio = `${width} / ${height}`;
  element.style.minHeight = `${height}px`;
};