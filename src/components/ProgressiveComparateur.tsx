// ⚡ PERFORMANCE: Progressive loading - shell first, then full component
import { useState, useEffect, lazy, Suspense, startTransition } from 'react';

// Lightweight shell loads immediately
import ComparateurOmraShell from '@/pages/ComparateurOmraShell';

// Full component loads after interaction or timeout
const ComparateurOmraFull = lazy(() => import('@/pages/ComparateurOmra'));

export default function ProgressiveComparateur() {
  const [showFull, setShowFull] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after first render
    setIsHydrated(true);

    // Trigger full load after 1.5s or on user interaction
    const timer = setTimeout(() => {
      startTransition(() => {
        setShowFull(true);
      });
    }, 1500);

    const handleInteraction = () => {
      startTransition(() => {
        setShowFull(true);
      });
    };

    // Listen for any user interaction to trigger early load
    const events = ['scroll', 'click', 'touchstart', 'mousemove'];
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    return () => {
      clearTimeout(timer);
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  // During SSR or before hydration, show shell
  if (!isHydrated) {
    return <ComparateurOmraShell />;
  }

  // After interaction or timeout, load full component
  if (showFull) {
    return (
      <Suspense fallback={<ComparateurOmraShell />}>
        <ComparateurOmraFull />
      </Suspense>
    );
  }

  // Show shell while waiting
  return <ComparateurOmraShell />;
}
