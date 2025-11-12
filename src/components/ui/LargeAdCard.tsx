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
            <div className="flex-1 min-w-0">
              {/* Titre */}
              <h3 className="font-bold text-base md:text-lg line-clamp-1 mb-2">
                {listing.title}
              </h3>

              {/* Type d'annonce - Plus grand et visible */}
              <div className="mb-2">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs px-3 py-1 font-semibold",
                    listing.type === 'sejours' ? 'bg-blue-500/10 text-blue-700 border-blue-500/30' :
                    listing.type === 'hebergement' ? 'bg-purple-500/10 text-purple-700 border-purple-500/30' :
                    listing.type === 'chauffeurs' ? 'bg-green-500/10 text-green-700 border-green-500/30' :
                    listing.type === 'guides' ? 'bg-orange-500/10 text-orange-700 border-orange-500/30' :
                    listing.type === 'babysitting' ? 'bg-pink-500/10 text-pink-700 border-pink-500/30' :
                    listing.type === 'vols' ? 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30' :
                    'bg-gray-500/10 text-gray-700 border-gray-500/30'
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

              {/* Détails sur 2 lignes pour utiliser l'espace */}
              <div className="space-y-1.5">
                {/* Ligne 1: Description/Date */}
                {listing.subtitle && (
                  <div className="flex items-center gap-1.5 text-sm text-foreground/80">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{listing.subtitle}</span>
                  </div>
                )}
                
                {/* Ligne 2: Ville - Plus visible */}
                {listing.location && (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                )}

                {/* Ligne 3: Note si disponible */}
                {listing.rating && (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{listing.rating}</span>
                    {listing.reviews && (
                      <span className="text-xs text-muted-foreground">({listing.reviews} avis)</span>
                    )}
                  </div>
                )}
              </div>

              {/* Badge populaire en bas */}
              {listing.isPopular && (
                <div className="mt-2">
                  <Badge className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-sm font-bold">
                    ⭐ Populaire
                  </Badge>
                </div>
              )}
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
