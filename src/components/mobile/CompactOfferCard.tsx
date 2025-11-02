import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Hotel, Plane, ExternalLink, CheckCircle2, Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CompactOfferCardProps {
  offer: any;
  agencyLogo: string | null;
  agencyInfo: any;
}

export const CompactOfferCard = ({ offer, agencyLogo, agencyInfo }: CompactOfferCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-primary/10">
      {/* Header compact */}
      <div 
        className="p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {/* Logo miniature */}
          {agencyLogo && (
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm relative">
              <img 
                src={agencyLogo} 
                alt={offer.agency_name}
                className="w-full h-full object-contain p-1"
              />
              {offer.is_complet && (
                <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center">
                  <span className="text-white text-[8px] font-black">COMPLET</span>
                </div>
              )}
            </div>
          )}

          {/* Info principale */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate">{offer.agency_name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[10px] px-1.5 py-0",
                  offer.formula_type?.toLowerCase() === 'essentiel'
                    ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                    : 'bg-purple-500/10 text-purple-700 border-purple-500/30'
                )}
              >
                {offer.formula_type}
              </Badge>
              {agencyInfo && (
                <div className="flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] font-semibold">{agencyInfo.googleRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs font-medium text-foreground/80">
              <Calendar className="h-3.5 w-3.5" />
              <span className="truncate">{offer.month_departure}</span>
              <MapPin className="h-3.5 w-3.5" />
              <span>{offer.departure_city}</span>
            </div>
          </div>

          {/* Prix */}
          <div className="flex-shrink-0 text-right">
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold text-primary">
                {Number(offer.price_eur).toLocaleString('fr-FR')}€
              </span>
              <span className="text-[10px] text-muted-foreground">/ pers.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Détails expandables */}
      {isExpanded && (
        <div className="border-t border-primary/10 p-3 space-y-2 bg-muted/30 animate-fade-in">
          {/* Dates */}
          {offer.date_start && offer.date_end && (
            <div className="text-xs">
              <span className="font-semibold">Dates : </span>
              Du {new Date(offer.date_start).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} au {new Date(offer.date_end).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
              {offer.duration_nights && <span className="text-muted-foreground"> ({offer.duration_nights}n)</span>}
            </div>
          )}

          {/* Nuits */}
          {(offer.makkah_nights || offer.medina_nights) && (
            <div className="text-xs">
              <span className="font-semibold">Séjour : </span>
              {offer.makkah_nights}n Mecque / {offer.medina_nights}n Médine
            </div>
          )}

          {/* Hôtels */}
          {offer.hotel_makkah && (
            <div className="flex items-start gap-1.5 text-xs">
              <Hotel className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">Mecque : </span>
                {offer.hotel_makkah}
                {offer.distance_to_haram_m && (
                  <span className="text-muted-foreground"> ({offer.distance_to_haram_m}m)</span>
                )}
              </div>
            </div>
          )}

          {offer.hotel_medinah && (
            <div className="flex items-start gap-1.5 text-xs">
              <Hotel className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">Médine : </span>
                {offer.hotel_medinah}
              </div>
            </div>
          )}

          {/* Badges services */}
          <div className="flex flex-wrap gap-1">
            {offer.flights_included && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
                <Plane className="h-2.5 w-2.5 mr-0.5" />
                Vol
              </Badge>
            )}
            {offer.visa_included && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-blue-500/10 text-blue-700 border-blue-500/30">
                <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                Visa
              </Badge>
            )}
            {offer.airline && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {offer.airline}
              </Badge>
            )}
          </div>

          {/* Bouton CTA */}
          <Button 
            asChild 
            size="sm"
            className="w-full h-8 text-xs mt-2"
            disabled={offer.is_complet}
          >
            <a 
              href={offer.offer_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-1.5"
            >
              <span>{offer.is_complet ? 'Complet' : 'Voir l\'offre'}</span>
              {!offer.is_complet && <ExternalLink className="h-3 w-3" />}
            </a>
          </Button>
        </div>
      )}
    </Card>
  );
};
