import { useEffect } from 'react';
import { useAntiScraping } from '@/hooks/useAntiScraping';
import { Shield } from 'lucide-react';

/**
 * Composant de protection anti-scraping amélioré
 * Protection contre le copier-coller massif et clic droit sur images
 */
export const AntiScrapingProtection = () => {
  // Utiliser le hook existant
  const { requestCount } = useAntiScraping({
    enabled: true,
    debugMode: false,
  });

  useEffect(() => {
    if (requestCount > 50) {
      console.warn('🚨 High request rate detected');
    }
  }, [requestCount]);

  // Watermark invisible pour identifier le contenu
  useEffect(() => {
    const watermark = document.createElement('div');
    watermark.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    watermark.setAttribute('data-source', 'mra-omra-protected');
    watermark.textContent = `Protected content - ${new Date().toISOString()}`;
    document.body.appendChild(watermark);

    return () => {
      document.body.removeChild(watermark);
    };
  }, []);

  // Désactiver le clic droit sur les images et le contenu sensible
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('[data-protected]')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div 
      style={{ display: 'none' }} 
      data-anti-scraping="enabled"
      aria-hidden="true"
    >
      <Shield size={16} />
      Anti-scraping protection active
    </div>
  );
};
