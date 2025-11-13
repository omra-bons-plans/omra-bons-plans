import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink } from 'lucide-react';
import { LazyAgencyLogo } from '@/components/ui/LazyAgencyLogo';
import { getAgencyLogo } from '@/utils/agencyLogos';

interface Offer {
  id: string;
  offer_title: string;
  agency_name: string;
  price_eur: number;
  duration_nights?: number;
  date_start?: string;
  date_end?: string;
  hotel_makkah?: string;
  hotel_medina?: string;
  hotel_makkah_stars?: number;
  hotel_medina_stars?: number;
  departure_city: string;
  formula_type: string;
  flights_included: boolean;
  visa_included: boolean;
  board?: string;
  airline?: string;
  makkah_nights?: number;
  medina_nights?: number;
  distance_to_haram_m?: number;
  offer_url: string;
}

interface OfferComparisonProps {
  offers: Offer[];
  onClose?: () => void;
}

export const OfferComparison = ({ offers, onClose }: OfferComparisonProps) => {
  const [selectedOffers, setSelectedOffers] = useState<Offer[]>(offers.slice(0, 3));

  const features = [
    { key: 'price_eur', label: 'Prix', format: (v: any) => `${v}€` },
    { key: 'duration_nights', label: 'Durée', format: (v: any) => `${v} nuits` },
    { key: 'formula_type', label: 'Formule' },
    { key: 'departure_city', label: 'Départ' },
    { key: 'date_start', label: 'Date départ', format: (v: any) => new Date(v).toLocaleDateString('fr-FR') },
    { key: 'makkah_nights', label: 'Nuits La Mecque', format: (v: any) => `${v} nuits` },
    { key: 'medina_nights', label: 'Nuits Médine', format: (v: any) => `${v} nuits` },
    { key: 'hotel_makkah', label: 'Hôtel La Mecque' },
    { key: 'hotel_makkah_stars', label: 'Étoiles La Mecque', format: (v: any) => '⭐'.repeat(v || 0) },
    { key: 'hotel_medina', label: 'Hôtel Médine' },
    { key: 'hotel_medina_stars', label: 'Étoiles Médine', format: (v: any) => '⭐'.repeat(v || 0) },
    { key: 'distance_to_haram_m', label: 'Distance Haram', format: (v: any) => `${v}m` },
    { key: 'flights_included', label: 'Vols inclus', format: (v: any) => v ? <Check className="text-green-500" /> : <X className="text-red-500" /> },
    { key: 'visa_included', label: 'Visa inclus', format: (v: any) => v ? <Check className="text-green-500" /> : <X className="text-red-500" /> },
    { key: 'board', label: 'Pension' },
    { key: 'airline', label: 'Compagnie' },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 p-4 min-w-max">
        {/* Colonne des labels */}
        <div className="sticky left-0 bg-background z-10 min-w-[200px]">
          <Card className="h-full p-4 space-y-2">
            {/* En-tête vide pour l'alignment */}
            <div className="h-40 flex items-center font-bold text-lg">
              Caractéristiques
            </div>
            
            {/* Labels des features */}
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`py-3 px-2 font-medium ${
                  idx % 2 === 0 ? 'bg-muted/30' : ''
                }`}
              >
                {feature.label}
              </div>
            ))}
          </Card>
        </div>

        {/* Colonnes des offres */}
        {selectedOffers.map((offer, offerIdx) => {
          const agencyLogo = getAgencyLogo(offer.agency_name);
          
          return (
            <Card key={offer.id} className="min-w-[280px] p-4 space-y-2 hover-scale">
              {/* Header avec logo et agence */}
              <div className="h-40 flex flex-col items-center justify-center gap-2 border-b pb-4">
                {agencyLogo && (
                  <LazyAgencyLogo
                    src={agencyLogo}
                    alt={offer.agency_name}
                    agencyName={offer.agency_name}
                    className="h-16 w-auto object-contain"
                  />
                )}
                <h3 className="font-bold text-center">{offer.agency_name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {offer.formula_type}
                </Badge>
              </div>

              {/* Valeurs des features */}
              {features.map((feature, idx) => {
                const value = (offer as any)[feature.key];
                const displayValue = feature.format 
                  ? feature.format(value) 
                  : value || '-';

                return (
                  <div
                    key={idx}
                    className={`py-3 px-2 text-center ${
                      idx % 2 === 0 ? 'bg-muted/30' : ''
                    }`}
                  >
                    {displayValue}
                  </div>
                );
              })}

              {/* CTA */}
              <div className="pt-4">
                <Button 
                  asChild
                  className="w-full"
                  variant={offerIdx === 0 ? 'default' : 'outline'}
                >
                  <a 
                    href={offer.offer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Voir l'offre
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Actions */}
      {onClose && (
        <div className="p-4 text-center">
          <Button onClick={onClose} variant="ghost">
            Fermer la comparaison
          </Button>
        </div>
      )}
    </div>
  );
};
