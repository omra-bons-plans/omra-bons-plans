/**
 * Critical resource preloader for improving initial page load performance
 */

// Critical images that should be preloaded immediately
const CRITICAL_IMAGES = [
  '/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png', // Logo
  '/lovable-uploads/81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png', // Hero desktop
  '/lovable-uploads/d5128689-bda3-4612-9ae8-6910ed21a8c8.png', // Hero mobile
];

// Critical fonts
const CRITICAL_FONTS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
];

/**
 * Preload critical resources as early as possible
 */
export const preloadCriticalResources = () => {
  // Preload critical images
  CRITICAL_IMAGES.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload critical fonts
  CRITICAL_FONTS.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // DNS prefetch for external domains
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

/**
 * Initialize performance optimizations
 */
export const initializePerformanceOptimizations = () => {
  // Run critical resource preloading immediately
  preloadCriticalResources();

  // Optimize font loading
  const style = document.createElement('style');
  style.textContent = `
    /* Optimize font rendering */
    * {
      font-display: swap;
    }
    
    /* Reduce layout shift */
    img {
      height: auto;
      max-width: 100%;
    }
    
    /* Improve text rendering */
    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
  `;
  document.head.appendChild(style);

  // Setup performance monitoring
  if ('PerformanceObserver' in window) {
    try {
      // Monitor long tasks that block the main thread
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn('Long task detected:', entry.duration + 'ms');
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.warn('Performance monitoring setup failed:', error);
    }
  }
};

// Auto-initialize when this module is imported
if (typeof window !== 'undefined') {
  // Use requestIdleCallback if available, otherwise fallback to setTimeout
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(initializePerformanceOptimizations);
  } else {
    setTimeout(initializePerformanceOptimizations, 0);
  }
}