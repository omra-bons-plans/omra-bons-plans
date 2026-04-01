import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Star from 'lucide-react/dist/esm/icons/star';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Zap from 'lucide-react/dist/esm/icons/zap';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import { CachedFormattedListing } from '@/hooks/useCachedAds';
import { FavoriteButton } from '@/components/ui/FavoriteButton';

interface CompactAdListItemProps {
  listing: CachedFormattedListing;
  selectedCategory?: string;
}

const getCategoryBadgeClass = (type: string) => {
  switch (type) {
    case 'sejours': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-600';
    case 'hebergement': return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-purple-600';
    case 'chauffeurs': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-600';
    case 'guides': return 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-600';
    case 'babysitting': return 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-600';
    case 'vols': return 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-indigo-600';
    default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-600';
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
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/10 bg-card/80 backdrop-blur-sm hover:border-primary/30 relative">
      {/* Favoris overlay */}
      <div className="absolute top-3 left-3 z-20">
        <div className="bg-background/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-border/50 hover:scale-110 transition-transform">
          <FavoriteButton offerId={listing.id} variant="icon" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Image et titre à gauche */}
        <div className="sm:w-48 lg:w-56 flex-shrink-0 p-4 border-b sm:border-b-0 sm:border-r border-primary/10 bg-gradient-to-br from-primary/5 to-background">
          {listing.image && (
            <div className="h-32 rounded-lg overflow-hidden shadow-sm flex items-center justify-center bg-white/80 dark:bg-gray-900/50 relative">
              <img
                src={listing.image}
                alt={listing.title}
                width={224}
                height={128}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h3 className="text-lg font-bold text-center mt-3 group-hover:text-primary transition-colors line-clamp-2">
            {listing.title}
          </h3>
          {listing.rating > 0 && (
            <div className="flex items-center justify-center gap-1 mt-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(listing.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-300 text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {listing.rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({listing.reviews})
              </span>
            </div>
          )}
        </div>

        {/* Détails au centre */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1 space-y-3">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={`font-bold px-3 py-1 capitalize shadow-md ${getCategoryBadgeClass(listing.type)}`}>
                  ✨ {getCategoryLabel(listing.type)}
                </Badge>
                {listing.isPopular && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 font-bold px-3 py-1 shadow-md">
                    ⭐ Populaire
                  </Badge>
                )}
                {listing.isFlashSale && (
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 font-bold px-3 py-1 shadow-md">
                    <Zap className="h-3 w-3 mr-1" />
                    Flash
                  </Badge>
                )}
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3">
                {listing.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Localisation</div>
                      <div className="text-sm font-semibold">{listing.location}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prix et bouton à droite */}
            <div className="lg:w-48 flex flex-col justify-between items-center lg:items-end gap-4 lg:border-l lg:border-primary/10 lg:pl-6">
              <div className="text-center lg:text-right">
                <div className="text-sm text-muted-foreground mb-1">Prix</div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {listing.price}
                </div>
                {listing.originalPrice && (
                  <div className="text-sm text-muted-foreground line-through mt-1">{listing.originalPrice}</div>
                )}
                {listing.discount && (
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 font-bold text-xs px-2 py-0.5 mt-1">
                    -{listing.discount}%
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full lg:w-auto group/btn bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <Link
                    to={`/ad/${listing.id}`}
                    state={{ fromCategory: selectedCategory || (listing.type === 'hebergement' ? 'hebergements' : listing.type) }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="font-semibold">Voir l'offre</span>
                    <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

CompactAdListItem.displayName = 'CompactAdListItem';
