import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CachedFormattedListing } from '@/hooks/useCachedAds';

/**
 * ⚡ OPTIMIZED MOBILE LIST ITEM - Compact horizontal card
 * - Minimal DOM nodes
 * - Lazy image loading
 * - No complex animations
 */

interface MobileListItemProps {
  listing: CachedFormattedListing;
  selectedCategory: string;
}

export const MobileListItem = memo(({ listing, selectedCategory }: MobileListItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ad/${listing.slug || listing.id}`, { state: { fromCategory: selectedCategory } });
  };

  const getCategoryBadgeClass = (type: string) => {
    switch (type) {
      case 'sejours': return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'hebergement': return 'bg-purple-500/10 text-purple-700 border-purple-500/30';
      case 'chauffeurs': return 'bg-green-500/10 text-green-700 border-green-500/30';
      case 'guides': return 'bg-orange-500/10 text-orange-700 border-orange-500/30';
      case 'babysitting': return 'bg-pink-500/10 text-pink-700 border-pink-500/30';
      case 'vols': return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/30';
    }
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'sejours': return 'Séjour';
      case 'hebergement': return 'Hébergement';
      case 'chauffeurs': return 'Chauffeur';
      case 'guides': return 'Guide';
      case 'babysitting': return 'Baby-sitting';
      case 'vols': return 'Vol';
      default: return type;
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 border-border/30 bg-card">
        <div className="p-3">
          <div className="flex items-center gap-3">
            {/* Logo/Image - optimized size */}
            {listing.image && (
              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
                <img
                  src={listing.image}
                  alt={listing.title}
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate mb-1">{listing.title}</h3>
              
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <Badge 
                  variant="outline" 
                  className={`text-[10px] px-1.5 py-0 flex-shrink-0 ${getCategoryBadgeClass(listing.type)}`}
                >
                  {getCategoryLabel(listing.type)}
                </Badge>

                {listing.rating && (
                  <div className="flex items-center gap-0.5">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-[10px] font-semibold">{listing.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {listing.location && (
                <div className="text-xs text-muted-foreground truncate">
                  📍 {listing.location}
                </div>
              )}
            </div>

            {/* Price */}
            {listing.price && (
              <div className="flex-shrink-0 text-right">
                <span className="text-lg font-bold text-primary">{listing.price}</span>
                {listing.discount && (
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 font-bold text-[10px] px-1.5 py-0 mt-1 block">
                    -{listing.discount}%
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
});

MobileListItem.displayName = 'MobileListItem';
