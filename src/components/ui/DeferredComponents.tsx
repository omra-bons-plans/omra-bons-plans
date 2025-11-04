import { lazy, Suspense, ComponentType, ReactNode } from 'react';

interface DeferredLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Composant pour différer le chargement des composants lourds
 * Améliore drastiquement le TBT et le temps d'exécution JS
 */
const DeferredLoader = ({ children, fallback = null }: DeferredLoaderProps) => (
  <Suspense fallback={fallback}>{children}</Suspense>
);

/**
 * HOC pour différer n'importe quel composant lourd
 * Usage: const HeavyComponent = deferComponent(() => import('./HeavyComponent'))
 */
export const deferComponent = <P extends Record<string, any>>(
  importFunc: () => Promise<{ default: ComponentType<P> }>
) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: P) => (
    <DeferredLoader fallback={<div className="animate-pulse h-20 bg-muted/30 rounded" />}>
      <LazyComponent {...(props as any)} />
    </DeferredLoader>
  );
};

/**
 * Différer les composants lourds de Radix UI
 * Ces composants ne sont chargés que si utilisés
 */
export const DeferredDialog = deferComponent(() => import('@radix-ui/react-dialog').then(m => ({ default: m.Root })));
export const DeferredDropdown = deferComponent(() => import('@radix-ui/react-dropdown-menu').then(m => ({ default: m.Root })));
export const DeferredPopover = deferComponent(() => import('@radix-ui/react-popover').then(m => ({ default: m.Root })));

export default DeferredLoader;
