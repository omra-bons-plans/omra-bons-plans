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
        "overflow-hidden hover:shadow-md transition-all duration-200 border-border/30 bg-card cursor-pointer hover:border-primary/20",
        className
      )}>
        {/* Header compact horizontal comme sur homepage */}
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Logo/Image à gauche */}
            {listing.image && (
              <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-white shadow-sm">
                <img 
                  src={listing.image} 
                  alt={listing.title}
                  className="w-full h-full object-contain p-2"
                  loading="lazy"
                />
              </div>
            )}

            {/* Info principale au centre */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              {/* Titre avec badge populaire à droite */}
              <div>
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="font-bold text-base md:text-lg line-clamp-1 flex-1">
                    {listing.title}
                  </h3>
                  {listing.isPopular && (
                    <Badge className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-sm font-bold shrink-0">
                      ⭐ Populaire
                    </Badge>
                  )}
                </div>

                {/* Type d'annonce - BEAUCOUP plus visible */}
                <div className="mb-3">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-sm md:text-base px-4 py-1.5 font-bold rounded-full",
                      listing.type === 'sejours' ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/40' :
                      listing.type === 'hebergement' ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/40' :
                      listing.type === 'chauffeurs' ? 'bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/40' :
                      listing.type === 'guides' ? 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/40' :
                      listing.type === 'babysitting' ? 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/40' :
                      listing.type === 'vols' ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/40' :
                      'bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/40'
                    )}
                  >
                    {listing.type === 'sejours' ? 'Séjour' :
                     listing.type === 'hebergement' ? 'Hébergement' :
                     listing.type === 'chauffeurs' ? 'Chauffeur' :
                     listing.type === 'guides' ? 'Guide' :
                     listing.type === 'babysitting' ? 'Baby-sitting' :
                     listing.type === 'vols' ? 'Vol' : listing.type}
                  </Badge>
                </div>
              </div>

              {/* Informations détaillées - Layout amélioré */}
              <div className="space-y-2.5">
                {/* Description/Date - Si disponible */}
                {listing.subtitle && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{listing.subtitle}</span>
                  </div>
                )}
                
                {/* Ville - TRÈS VISIBLE et prominent */}
                {listing.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-base md:text-lg font-bold text-foreground line-clamp-1">
                      {listing.location}
                    </span>
                  </div>
                )}

                {/* Note - Si disponible */}
                {listing.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />
                    <span className="text-sm font-semibold">{listing.rating}</span>
                    {listing.reviews && (
                      <span className="text-xs text-muted-foreground">({listing.reviews} avis)</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Prix à droite */}
            {listing.price && (
              <div className="flex-shrink-0 text-right">
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-xl md:text-2xl font-bold text-primary">
                    {typeof listing.price === 'string' ? listing.price : `${listing.price}€`}
                  </span>
                  {listing.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {listing.originalPrice}
                    </span>
                  )}
                  {listing.discount && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
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
          <div className="border-t border-primary/10 px-4 py-2 bg-muted/30">
            <div className="flex flex-wrap gap-2">
              {listing.isPromo && (
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-xs">
                  🔥 Promo {listing.discount}%
                </Badge>
              )}
              {listing.isFlashSale && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
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
