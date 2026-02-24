import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Star from 'lucide-react/dist/esm/icons/star';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Zap from 'lucide-react/dist/esm/icons/zap';
import { CachedFormattedListing } from '@/hooks/useCachedAds';

interface CompactAdListItemProps {
  listing: CachedFormattedListing;
  selectedCategory?: string;
}

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

export const CompactAdListItem = memo(({ listing, selectedCategory }: CompactAdListItemProps) => {
  return (
    <Link
      to={`/ad/${listing.id}`}
      state={{ fromCategory: selectedCategory || (listing.type === 'hebergement' ? 'hebergements' : listing.type) }}
      className="block"
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 border-border/30 bg-card">
        <div className="p-3">
          <div className="flex items-center gap-3">
            {/* Image carrée à gauche — style identique CompactOfferCard */}
            {listing.image && (
              <div
                className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm"
                style={{ aspectRatio: '1/1', minWidth: '64px', minHeight: '64px' }}
              >
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

            {/* Infos au centre */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-sm truncate">{listing.title}</h3>
                {listing.isPopular && (
                  <Badge className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-md font-bold">
                    ⭐ Populaire
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 ${getCategoryBadgeClass(listing.type)}`}
                >
                  {getCategoryLabel(listing.type)}
                </Badge>

                {listing.rating > 0 && (
                  <div className="flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-semibold">{listing.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-muted-foreground">({listing.reviews})</span>
                  </div>
                )}

                {listing.isFlashSale && (
                  <Badge className="text-[10px] px-1.5 py-0 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
                    <Zap className="h-2.5 w-2.5 mr-0.5" />
                    Flash
                  </Badge>
                )}
              </div>

              {listing.location && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{listing.location}</span>
                </div>
              )}
            </div>

            {/* Prix à droite */}
            <div className="flex-shrink-0 text-right">
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold text-primary">{listing.price}</span>
              </div>
              {listing.originalPrice && (
                <span className="text-[10px] text-muted-foreground line-through block">{listing.originalPrice}</span>
              )}
              {listing.discount && (
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 font-bold text-[10px] px-1.5 py-0 mt-0.5">
                  -{listing.discount}%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
});

CompactAdListItem.displayName = 'CompactAdListItem';
