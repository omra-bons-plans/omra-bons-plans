import { useEffect } from 'react';

/**
 * ⚡ PERFORMANCE: Preload top agency logos to improve LCP
 * These are the first 4 visible logos in the comparator
 */
const TOP_AGENCY_LOGOS = [
  '/lovable-uploads/logomedinvoyages.webp',
  '/lovable-uploads/logoalsirate.webp',
  '/lovable-uploads/logoomrasounnah.webp',
  '/lovable-uploads/logoomrapourtous.webp',
];

export const usePreloadAgencyLogos = () => {
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    // Use requestIdleCallback to avoid blocking main thread
    const preload = () => {
      TOP_AGENCY_LOGOS.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.type = 'image/webp';
        document.head.appendChild(link);
      });
    };

    // ⚡ MOBILE: Defer to 5s (vs 3s desktop) to prioritize LCP
    const delay = isMobile ? 5000 : 3000;
    
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preload, { timeout: delay });
    } else {
      setTimeout(preload, delay);
    }
  }, []);
};
