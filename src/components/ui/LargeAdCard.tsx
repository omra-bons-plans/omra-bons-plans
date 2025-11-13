import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface LargeAdCardProps {
  listing: any;
  className?: string;
}

export const LargeAdCard = ({ listing, className }: LargeAdCardProps) => {
  return (
    <Link to={`/ad/${listing.id}`}>
      <Card className={cn(
        "overflow-hidden hover:shadow-lg transition-all duration-300 border-border/40 bg-card cursor-pointer hover:border-primary/30 hover:scale-[1.01]",
        className
      )}>
        {/* Header horizontal responsive */}
        <div className="p-3 md:p-4 lg:p-5">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Logo/Image à gauche */}
            {listing.image && (
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden bg-gradient-to-br from-white to-muted shadow-md">
                <img 
                  src={listing.image} 
                  alt={listing.title}
                  className="w-full h-full object-contain p-2 md:p-3"
                  loading="lazy"
                />
              </div>
            )}

            {/* Info principale au centre */}
            <div className="flex-1 min-w-0">
              {/* Titre et badges */}
              <div className="flex items-start gap-2 mb-2">
                <h3 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl flex-1 line-clamp-2 text-foreground">
                  {listing.title}
                </h3>
                {listing.isPopular && (
                  <Badge className="hidden sm:inline-flex text-[10px] md:text-xs px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 shadow-md font-bold">
                    ⭐ Populaire
                  </Badge>
                )}
              </div>

              {/* Type et note */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[10px] md:text-xs px-2 py-0.5 font-semibold",
                    listing.type === 'sejours' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30' :
                    listing.type === 'hebergement' ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30' :
                    listing.type === 'chauffeurs' ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30' :
                    listing.type === 'guides' ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30' :
                    listing.type === 'babysitting' ? 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/30' :
                    listing.type === 'vols' ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30' :
                    'bg-muted text-muted-foreground border-border'
                  )}
                >
                  {listing.type === 'sejours' ? 'Séjour' :
                   listing.type === 'hebergement' ? 'Hébergement' :
                   listing.type === 'chauffeurs' ? 'Chauffeur' :
                   listing.type === 'guides' ? 'Guide' :
                   listing.type === 'babysitting' ? 'Baby-sitting' :
                   listing.type === 'vols' ? 'Vol' : listing.type}
                </Badge>
                
                {listing.rating && (
                  <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 md:h-3.5 md:w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs md:text-sm font-semibold text-foreground">{listing.rating}</span>
                    {listing.reviews && (
                      <span className="text-xs text-muted-foreground">({listing.reviews})</span>
                    )}
                  </div>
                )}

                {listing.isPopular && (
                  <Badge className="sm:hidden text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 font-bold">
                    ⭐
                  </Badge>
                )}
              </div>

              {/* Localisation et date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs md:text-sm text-muted-foreground">
                {listing.subtitle && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">{listing.subtitle}</span>
                  </div>
                )}
                {listing.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Prix à droite */}
            {listing.price && (
              <div className="flex-shrink-0 text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary">
                    {typeof listing.price === 'string' ? listing.price : `${listing.price}€`}
                  </span>
                  {listing.originalPrice && (
                    <span className="text-xs md:text-sm text-muted-foreground line-through">
                      {listing.originalPrice}
                    </span>
                  )}
                  {listing.discount && (
                    <Badge variant="destructive" className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 shadow-md">
                      -{listing.discount}%
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Badges promotionnels en bas si nécessaire */}
        {(listing.isPromo || listing.isFlashSale) && (
          <div className="border-t border-border/50 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 bg-gradient-to-r from-muted/30 to-muted/50">
            <div className="flex flex-wrap gap-2">
              {listing.isPromo && (
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-xs md:text-sm shadow-lg">
                  🔥 Promo {listing.discount}%
                </Badge>
              )}
              {listing.isFlashSale && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs md:text-sm shadow-lg">
                  ⚡ Vente Flash
                </Badge>
              )}
            </div>
          </div>
        )}
      </Card>
    </Link>
  );
};
