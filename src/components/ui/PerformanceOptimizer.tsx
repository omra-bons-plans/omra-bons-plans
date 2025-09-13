import { useEffect } from 'react';
import { measureWebVitals } from '@/utils/performanceUtils';

/**
 * Component to optimize page performance through various techniques
 */
export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        { href: '/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png', as: 'image' },
        { href: '/lovable-uploads/81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png', as: 'image' },
        { href: '/lovable-uploads/d5128689-bda3-4612-9ae8-6910ed21a8c8.png', as: 'image' },
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.as;
        link.href = resource.href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // Optimize fonts loading
    const optimizeFonts = () => {
      const fontLinks = document.querySelectorAll('link[href*="fonts"]');
      fontLinks.forEach(link => {
        link.setAttribute('rel', 'preload');
        link.setAttribute('as', 'font');
        link.setAttribute('crossorigin', 'anonymous');
      });
    };

    // Add resource hints for external domains
    const addResourceHints = () => {
      const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Optimize main thread blocking
    const optimizeMainThread = () => {
      // Use requestIdleCallback for non-critical tasks
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          // Perform non-critical initialization here
          measureWebVitals();
          console.log('🚀 Non-critical tasks executed during idle time');
        });
      }
    };

    // Performance monitoring
    const setupPerformanceMonitoring = () => {
      // Monitor Core Web Vitals
      if ('PerformanceObserver' in window) {
        try {
          // Largest Contentful Paint
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('📊 LCP:', lastEntry.startTime);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay
          const fidObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              const fidEntry = entry as any;
              console.log('📊 FID:', fidEntry.processingStart - fidEntry.startTime);
            }
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((entryList) => {
            let clsValue = 0;
            for (const entry of entryList.getEntries()) {
              const clsEntry = entry as any;
              if (!clsEntry.hadRecentInput) {
                clsValue += clsEntry.value;
              }
            }
            console.log('📊 CLS:', clsValue);
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('Performance monitoring not supported:', error);
        }
      }
    };

    // Execute optimizations
    preloadCriticalResources();
    optimizeFonts();
    addResourceHints();
    optimizeMainThread();
    setupPerformanceMonitoring();

    // Cleanup function
    return () => {
      // Clean up observers if needed
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;