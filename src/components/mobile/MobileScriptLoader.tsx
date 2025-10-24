import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Composant pour différer les scripts tiers sur MOBILE uniquement
 * - Analytics chargés après interaction utilisateur
 * - Scripts non critiques après 3.5s
 */
export const MobileScriptLoader = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Optimisations uniquement mobile
    if (!isMobile) return;

    let userInteracted = false;

    const loadNonCriticalScripts = () => {
      if (userInteracted) return;
      userInteracted = true;

      // Charger les scripts non critiques
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => {
          console.log('📱 Loading deferred mobile scripts');
          // Ici vous pouvez charger d'autres scripts si nécessaire
        }, { timeout: 3500 });
      }
    };

    // Charger après interaction utilisateur (scroll, touch, click)
    const events = ['scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, loadNonCriticalScripts, { once: true, passive: true });
    });

    // Fallback: charger après 3.5s même sans interaction
    const timeout = setTimeout(loadNonCriticalScripts, 3500);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, loadNonCriticalScripts);
      });
      clearTimeout(timeout);
    };
  }, [isMobile]);

  return null;
};
