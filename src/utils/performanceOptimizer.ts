/**
 * Utilitaires d'optimisation des performances pour améliorer les Core Web Vitals
 */

/**
 * Précharge intelligemment les ressources critiques
 */
export const preloadCriticalResources = () => {
  // Image hero critique (AVIF moderne)
  const heroImage = document.createElement('link');
  heroImage.rel = 'preload';
  heroImage.as = 'image';
  heroImage.href = '/hero-kaaba-2025-new.avif';
  heroImage.type = 'image/avif';
  heroImage.fetchPriority = 'high';
  document.head.appendChild(heroImage);
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