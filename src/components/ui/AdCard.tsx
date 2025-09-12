import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { FormattedListing } from "@/hooks/useAds";

interface AdCardProps {
  listing: FormattedListing;
  className?: string;
  imageHeight?: string;
}

const AdCard = ({ listing, className = "", imageHeight = "h-56" }: AdCardProps) => {
  const cardClasses = `
    card-modern overflow-hidden border-border/20 bg-card/50 transition-all duration-300
    ${!listing.isExpired ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50 grayscale'}
    lg:mx-0 mx-[-1rem] lg:rounded-lg rounded-none
    ${className}
  `;

  // Ne pas permettre le lien si l'annonce est expirée
  if (listing.isExpired) {
    return (
      <Card className={cardClasses}>
        <div className="relative group">
          <div className={`w-full ${imageHeight} overflow-hidden`}>
            <img 
              src={listing.image} 
              alt={listing.title}
              className="w-full h-full object-cover transition-all duration-500"
              onError={(e) => {
                console.log('Ad image failed to load:', listing.image);
                const target = e.target as HTMLImageElement;
                target.src = '/ad-placeholder.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
          
          {/* Badge d'annonce expirée */}
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge className="bg-red-600 text-white text-sm px-4 py-2 rounded-full font-semibold">
              <Clock className="w-4 h-4 mr-2" />
              Offre expirée
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold text-xl line-clamp-1 text-muted-foreground">
              {listing.title}
            </h3>
            <p className="line-clamp-1 text-muted-foreground/60">
              {listing.subtitle}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-muted-foreground">
                {listing.price}
              </span>
            </div>
          </div>
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
      <div className="relative group">
        <div className={`w-full ${imageHeight} overflow-hidden`}>
          <img 
            src={listing.image} 
            alt={listing.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              !listing.isExpired ? 'group-hover:scale-110' : ''
            }`}
            onError={(e) => {
              console.log('Ad image failed to load:', listing.image);
              const target = e.target as HTMLImageElement;
              target.src = '/ad-placeholder.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>
        
        {/* Badge d'annonce expirée */}
        {listing.isExpired && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge className="bg-red-600 text-white text-sm px-4 py-2 rounded-full font-semibold">
              <Clock className="w-4 h-4 mr-2" />
              Offre expirée
            </Badge>
          </div>
        )}
        
        {!listing.isExpired && listing.isPopular && (
          <Badge className="absolute top-4 left-4 bg-gradient-primary text-primary-foreground text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-full font-semibold shadow-medium">
            ⭐ Populaire
          </Badge>
        )}
        
        {!listing.isExpired && listing.isFlashSale && (
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-full font-semibold flash-pulse">
            <Zap className="w-3 h-3 mr-1" />
            <span>Flash</span>
          </Badge>
        )}
        
        {/* Individual countdown for flash sale items */}
        {!listing.isExpired && listing.isFlashSale && listing.flashSaleEndDate && (
          <div className="absolute top-16 right-4">
            <CountdownTimer 
              targetDate={listing.flashSaleEndDate} 
              className="text-xs scale-50 origin-top-right"
            />
          </div>
        )}
        
        {!listing.isExpired && (
          <div className="absolute bottom-4 right-4">
            <Badge className="glass text-xs px-3 py-2 rounded-full font-semibold">
              {listing.type === 'sejours' ? 'Séjour' : 
               listing.type === 'hebergement' ? 'Hébergement' : 
               listing.type === 'guides' ? 'Guide' : 
               listing.type === 'vols' ? 'Vols' :
               listing.type === 'chauffeurs' ? 'Chauffeur' : 
               listing.type === 'babysitting' ? 'Baby-sitting' : 'Service'}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className={`font-bold text-xl line-clamp-1 ${listing.isExpired ? 'text-muted-foreground' : ''}`}>
            {listing.title}
          </h3>
          <p className={`line-clamp-1 ${listing.isExpired ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
            {listing.subtitle}
          </p>
        </div>
        
        {!listing.isExpired && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold">{listing.rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">({listing.reviews} avis)</span>
          </div>
        )}
        
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {!listing.isExpired && listing.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {listing.originalPrice}
              </span>
            )}
            <span className={`font-bold text-lg ${
              listing.isExpired ? 'text-muted-foreground' : 'text-primary'
            }`}>
              {listing.price}
            </span>
            {!listing.isExpired && listing.discount && (
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                -{listing.discount}%
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default AdCard;