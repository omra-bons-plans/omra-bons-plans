import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CachedFormattedListing } from '@/hooks/useCachedAds';

/**
 * ⚡ OPTIMIZED AD CARD - Lighter than AdCard for Home Page
 * - No CountdownTimer (heavy component)
 * - Simplified badge logic
 * - Optimized image with explicit dimensions
 */

interface OptimizedAdCardProps {
  listing: CachedFormattedListing;
  priority?: boolean;
  className?: string;
  imageHeight?: string;
}

export const OptimizedAdCard = memo(({ listing, priority = false, className = '', imageHeight = 'h-44' }: OptimizedAdCardProps) => {
  const cardClasses = `
    overflow-hidden border border-border/20 bg-card/95 rounded-2xl transition-transform duration-200
    ${!listing.isExpired ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg' : 'cursor-not-allowed opacity-60 grayscale'}
    ${className}
  `;

  if (listing.isExpired) {
    return (
      <Card className={cardClasses}>
        <div className="relative">
          <div className={`w-full ${imageHeight} overflow-hidden rounded-t-2xl bg-muted`}>
            <img
              src={listing.image}
              alt={listing.title}
              width={320}
              height={176}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-2xl">
            <Badge className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
              <Clock className="w-3 h-3 mr-1" />
              Offre expirée
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-base line-clamp-1 text-muted-foreground">{listing.title}</h3>
          <span className="font-semibold text-muted-foreground">{listing.price}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link
      to={`/ad/${listing.id}`}
      state={{ fromCategory: listing.type === 'hebergement' ? 'hebergements' : listing.type }}
      className="block"
    >
      <Card className={cardClasses}>
        <div className="relative">
          <div className={`w-full ${imageHeight} overflow-hidden rounded-t-2xl bg-muted`}>
            <img
              src={listing.image}
              alt={listing.title}
              width={320}
              height={176}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Simplified badges */}
          {listing.isPopular && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              ⭐ Populaire
            </Badge>
          )}
          
          {listing.isFlashSale && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
              <Zap className="w-3 h-3 mr-1" />
              Flash
            </Badge>
          )}

          {/* Category badge */}
          <Badge className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
            {listing.type === 'sejours' ? 'Séjour' : 
             listing.type === 'hebergement' ? 'Hébergement' : 
             listing.type === 'guides' ? 'Guide' : 
             listing.type === 'vols' ? 'Vols' :
             listing.type === 'chauffeurs' ? 'Chauffeur' : 
             listing.type === 'babysitting' ? 'Baby-sitting' : 'Service'}
          </Badge>
        </div>

        <CardContent className="p-4 space-y-2">
          <h3 className="font-bold text-base line-clamp-1">{listing.title}</h3>
          
          {listing.subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-1">{listing.subtitle}</p>
          )}
          
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{listing.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({listing.reviews})</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {listing.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">{listing.originalPrice}</span>
              )}
              <span className="font-bold text-lg text-primary">{listing.price}</span>
            </div>
            {listing.discount && (
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                -{listing.discount}%
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

OptimizedAdCard.displayName = 'OptimizedAdCard';
