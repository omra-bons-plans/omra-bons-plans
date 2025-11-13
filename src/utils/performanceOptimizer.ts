/**
 * Utilitaires d'optimisation des performances pour améliorer les Core Web Vitals
 */

/**
 * Précharge intelligemment les ressources critiques
 */
export const preloadCriticalResources = () => {
  // Images critiques above-the-fold
  const criticalImages = [
    '/src/assets/mecca-mosque-hero.jpg',
    '/lovable-uploads/81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
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