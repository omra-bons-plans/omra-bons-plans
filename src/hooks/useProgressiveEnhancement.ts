import { useState, useEffect } from 'react';

/**
 * Hook pour amélioration progressive - charge les features après interaction
 * Réduit drastiquement le JS initial et le TBT
 */
export const useProgressiveEnhancement = () => {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Charger les améliorations après interaction utilisateur
    const enhance = () => {
      if (hasInteracted) return;
      setHasInteracted(true);
      
      // Utiliser requestIdleCallback pour ne pas bloquer le main thread
      if ('requestIdleCallback' in window) {
        requestIdleCallback(
          () => {
            setIsEnhanced(true);
          },
          { timeout: 2000 }
        );
      } else {
        setTimeout(() => setIsEnhanced(true), 1000);
      }
    };

    // Événements d'interaction
    const events = ['scroll', 'touchstart', 'click', 'keydown', 'mousemove'];
    events.forEach(event => {
      window.addEventListener(event, enhance, { once: true, passive: true });
    });

    // Fallback: charger après 3s même sans interaction
    const fallbackTimer = setTimeout(enhance, 3000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, enhance);
      });
      clearTimeout(fallbackTimer);
    };
  }, [hasInteracted]);

  return { isEnhanced, hasInteracted };
};
