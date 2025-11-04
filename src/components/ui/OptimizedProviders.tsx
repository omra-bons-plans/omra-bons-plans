import { lazy, Suspense, ReactNode } from 'react';
import { useProgressiveEnhancement } from '@/hooks/useProgressiveEnhancement';

// Lazy load non-critical providers
const TooltipProvider = lazy(() => 
  import("@/components/ui/tooltip").then(m => ({ default: m.TooltipProvider }))
);

interface OptimizedProvidersProps {
  children: ReactNode;
}

/**
 * Providers optimisés - chargés progressivement après interaction
 * Réduit le bundle initial de ~30-40KB
 */
export const OptimizedProviders = ({ children }: OptimizedProvidersProps) => {
  const { isEnhanced } = useProgressiveEnhancement();

  if (!isEnhanced) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<>{children}</>}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </Suspense>
  );
};
