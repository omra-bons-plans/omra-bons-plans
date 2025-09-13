/**
 * Performance utilities for optimizing Core Web Vitals
 */

// Preload critical resources
export const preloadResource = (href: string, as: string, crossorigin?: boolean) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
};

// Optimize image loading with intersection observer
export const createImageObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  const options = {
    rootMargin: '50px',
    threshold: 0.1
  };
  
  return new IntersectionObserver(callback, options);
};

// Defer non-critical scripts
export const deferScript = (src: string, async = true) => {
  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  if (async) script.async = true;
  document.head.appendChild(script);
};

// Optimize CSS delivery
export const loadCSSAsync = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  link.onload = () => {
    link.rel = 'stylesheet';
  };
  document.head.appendChild(link);
};

// Measure Core Web Vitals
export const measureWebVitals = async () => {
  try {
    const webVitals = await import('web-vitals');
    
    // Use the correct API methods from web-vitals v3+
    if (webVitals.onCLS) webVitals.onCLS(console.log);
    if (webVitals.onINP) webVitals.onINP(console.log); // Replaces FID in v3+
    if (webVitals.onFCP) webVitals.onFCP(console.log);
    if (webVitals.onLCP) webVitals.onLCP(console.log);
    if (webVitals.onTTFB) webVitals.onTTFB(console.log);
  } catch (error) {
    console.warn('Web Vitals measurement failed:', error);
  }
};

// Optimize main thread with scheduler
export const scheduleWork = (callback: () => void, priority: 'high' | 'normal' | 'low' = 'normal') => {
  if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
    // Use Scheduler API if available
    (window as any).scheduler.postTask(callback, { priority });
  } else if ('requestIdleCallback' in window && priority === 'low') {
    // Fallback to requestIdleCallback for low priority
    window.requestIdleCallback(callback);
  } else {
    // Fallback to requestAnimationFrame
    requestAnimationFrame(callback);
  }
};

// Optimize font loading
export const optimizeFontLoading = () => {
  // Add font-display: swap to improve FCP
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

// Reduce Cumulative Layout Shift
export const reserveImageSpace = (width: number, height: number) => ({
  width,
  height,
  aspectRatio: `${width}/${height}`,
});

export default {
  preloadResource,
  createImageObserver,
  deferScript,
  loadCSSAsync,
  measureWebVitals,
  scheduleWork,
  optimizeFontLoading,
  reserveImageSpace
};