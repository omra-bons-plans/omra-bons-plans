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
        "overflow-hidden hover:shadow-md transition-shadow duration-200 border-border/30 bg-card cursor-pointer",
        className
      )}>
        {/* MOBILE: Vue compacte horizontale inspirée du Comparateur Omra */}
        <div className="block sm:hidden">
          <div className="p-3">
            <div className="flex items-center gap-3">
              {/* Logo carré à gauche */}
              {listing.image && (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Infos au milieu */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate mb-1">
                  {listing.title}
                </h3>
                
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  {listing.type && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] px-1.5 py-0 flex-shrink-0",
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
                  )}

                  {listing.rating && (
                    <div className="flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] font-semibold">{listing.rating}</span>
                    </div>
                  )}
                </div>

                {listing.location && (
                  <div className="text-xs text-muted-foreground truncate">
                    📍 {listing.location}
                  </div>
                )}
              </div>

              {/* Prix à droite */}
              {listing.price && (
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-baseline gap-0.5 justify-end">
                    <span className="text-lg font-bold text-primary">
                      {typeof listing.price === 'string' ? listing.price : `${listing.price}€`}
                    </span>
                  </div>
                  {listing.discount && (
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 font-bold text-[10px] px-1.5 py-0 mt-1">
                      -{listing.discount}%
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop & Tablet: Logo horizontal style */}
        <div className="relative hidden sm:block">
          <div className="flex items-center gap-4 p-5 md:p-6 bg-gradient-to-br from-background to-muted/20">
            {listing.image && (
              <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl overflow-hidden bg-white shadow-lg border border-border/20">
                <img 
                  src={listing.image} 
                  alt={listing.title}
                  className="w-full h-full object-contain p-3 md:p-4"
                  loading="lazy"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-3">
                <h3 className="font-bold text-xl md:text-2xl flex-1 line-clamp-2 text-foreground leading-tight">
                  {listing.title}
                </h3>
                {listing.isPopular && (
                  <Badge className="text-xs px-3 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 shadow-md font-bold animate-pulse">
                    ⭐ Populaire
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-sm px-3 py-1 font-semibold",
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
                  <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-foreground">{listing.rating}</span>
                    {listing.reviews && (
                      <span className="text-sm text-muted-foreground">({listing.reviews})</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-muted-foreground">
                {listing.subtitle && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{listing.subtitle}</span>
                  </div>
                )}
                {listing.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                )}
              </div>
            </div>

            {listing.price && (
              <div className="flex-shrink-0 text-right bg-primary/5 rounded-2xl p-4 md:p-5 border border-primary/10">
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-3xl md:text-4xl font-bold text-primary leading-none">
                    {typeof listing.price === 'string' ? listing.price : `${listing.price}€`}
                  </span>
                  {listing.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {listing.originalPrice}
                    </span>
                  )}
                  {listing.discount && (
                    <Badge variant="destructive" className="text-sm px-2 py-1 shadow-md font-bold">
                      -{listing.discount}%
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
