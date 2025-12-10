import React, { memo } from 'react';
import { OffersSkeleton } from '@/components/ui/OffersSkeleton';

interface DeferredOffersSectionProps {
  shouldLoad: boolean;
  isLoading: boolean;
  children: React.ReactNode;
  isMobile: boolean;
}

/**
 * ⚡ DEFERRED OFFERS SECTION - Phase 2 du chargement progressif
 * - Affiche un skeleton attractif avant le chargement
 * - Reserve l'espace pour éviter le CLS
 * - Transition fluide vers le contenu réel
 */
export const DeferredOffersSection = memo(({
  shouldLoad,
  isLoading,
  children,
  isMobile
}: DeferredOffersSectionProps) => {
  // Phase 1: Avant que shouldLoad soit true
  if (!shouldLoad) {
    return (
      <div 
        className="transition-opacity duration-300"
        style={{ minHeight: isMobile ? '400px' : '600px' }}
      >
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-muted/50 rounded-lg w-2/3 mx-auto" />
          <div className="h-4 bg-muted/30 rounded w-1/2 mx-auto" />
          <div className="mt-8">
            <OffersSkeleton count={isMobile ? 3 : 4} isMobile={isMobile} />
          </div>
        </div>
      </div>
    );
  }

  // Phase 2: Chargement en cours
  if (isLoading) {
    return (
      <div 
        className="transition-opacity duration-300"
        style={{ minHeight: isMobile ? '400px' : '600px' }}
      >
        <OffersSkeleton count={isMobile ? 4 : 8} isMobile={isMobile} />
      </div>
    );
  }

  // Phase 2: Contenu chargé
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
});

DeferredOffersSection.displayName = 'DeferredOffersSection';
