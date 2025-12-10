import { useState, useEffect, useRef, startTransition } from 'react';

/**
 * ⚡ DEFERRED LOADING HOOK - Chargement progressif Phase 2
 * - Utilise IntersectionObserver pour détecter le scroll
 * - startTransition pour rendu non-bloquant
 * - Délai configurable (défaut: 1s)
 */

interface UseDeferredLoadingOptions {
  /** Délai avant de démarrer le chargement (ms) */
  delay?: number;
  /** Marge pour l'IntersectionObserver (ex: "100px") */
  rootMargin?: string;
  /** Seuil de visibilité (0-1) */
  threshold?: number;
}

interface UseDeferredLoadingReturn {
  /** Ref à attacher à l'élément observé */
  triggerRef: React.RefObject<HTMLDivElement>;
  /** True quand le chargement Phase 2 doit commencer */
  shouldLoad: boolean;
  /** True si déclenché par scroll (vs délai) */
  triggeredByScroll: boolean;
}

export const useDeferredLoading = (
  options: UseDeferredLoadingOptions = {}
): UseDeferredLoadingReturn => {
  const {
    delay = 1000,
    rootMargin = '200px',
    threshold = 0.1
  } = options;

  const [shouldLoad, setShouldLoad] = useState(false);
  const [triggeredByScroll, setTriggeredByScroll] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    // ⚡ Délai minimum avant chargement Phase 2
    const delayTimer = setTimeout(() => {
      if (!hasTriggered.current) {
        hasTriggered.current = true;
        startTransition(() => {
          setShouldLoad(true);
        });
        console.log('⏱️ Phase 2: Chargement déclenché par délai');
      }
    }, delay);

    // ⚡ IntersectionObserver pour chargement au scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered.current) {
            hasTriggered.current = true;
            clearTimeout(delayTimer);
            startTransition(() => {
              setShouldLoad(true);
              setTriggeredByScroll(true);
            });
            console.log('👀 Phase 2: Chargement déclenché par scroll');
          }
        });
      },
      {
        rootMargin,
        threshold
      }
    );

    const element = triggerRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      clearTimeout(delayTimer);
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [delay, rootMargin, threshold]);

  return {
    triggerRef,
    shouldLoad,
    triggeredByScroll
  };
};
