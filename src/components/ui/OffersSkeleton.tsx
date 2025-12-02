/**
 * ⚡ SKELETON LOADER pour les offres - Réduit CLS
 * Dimensions fixes pour éviter les layout shifts
 */

interface OffersSkeletonProps {
  count?: number;
  isMobile?: boolean;
}

export const OffersSkeleton = ({ count = 6, isMobile = false }: OffersSkeletonProps) => {
  const skeletonItems = Array.from({ length: count }, (_, i) => i);
  
  if (isMobile) {
    return (
      <div className="space-y-3">
        {skeletonItems.map((i) => (
          <div 
            key={i}
            className="skeleton-card rounded-xl p-4 animate-pulse"
            style={{ minHeight: '120px' }}
          >
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-5 bg-muted rounded w-1/3 mt-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skeletonItems.map((i) => (
        <div 
          key={i}
          className="skeleton-card rounded-xl overflow-hidden animate-pulse"
          style={{ minHeight: '320px' }}
        >
          <div className="h-40 bg-muted" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="flex justify-between items-center mt-4">
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-8 bg-muted rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OffersSkeleton;
