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
    // Only preload on desktop (mobile has limited bandwidth)
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

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

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preload, { timeout: 2000 });
    } else {
      setTimeout(preload, 500);
    }
  }, []);
};
