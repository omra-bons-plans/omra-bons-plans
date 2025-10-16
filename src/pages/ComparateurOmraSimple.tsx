import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Hotel, Star, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ComparateurOmraSimple() {
  // Exemple fake pour l'agence Tawaf
  const fakeOffer = {
    id: 'fake-1',
    agency_name: 'Tawaf',
    agency_url: 'https://tawaf.fr',
    price_eur: 2450,
    month_departure: 'Janvier',
    date_start: new Date('2025-01-15'),
    date_end: new Date('2025-01-27'),
    departure_city: 'Paris',
    formula_type: 'Confort',
    duration_nights: 12,
    makkah_nights: 7,
    medina_nights: 5,
    hotel_makkah: 'Hilton Suites Makkah',
    hotel_medinah: 'Al Aqeeq Hotel',
    distance_to_haram_m: 150,
    offer_url: 'https://tawaf.fr/offre-exemple',
    board: 'Pension Complète',
    flights_included: true,
    visa_included: true,
    offer_title: 'Omra Confort Janvier 2025'
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM', { locale: fr });
  };

  const getStars = (formula: string) => {
    return formula === 'Confort' ? 5 : 3;
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: count }).map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Exemple Fake - Agence Tawaf</h1>
        <p className="text-muted-foreground mb-8">Données d'exemple pour démonstration</p>

        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            {/* En-tête avec agence et formule */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{fakeOffer.agency_name}</h3>
                <Badge variant={fakeOffer.formula_type === 'Confort' ? 'default' : 'secondary'}>
                  {fakeOffer.formula_type}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{fakeOffer.price_eur}€</div>
                <div className="text-sm text-muted-foreground">par personne</div>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                Du {formatDate(fakeOffer.date_start)} au {formatDate(fakeOffer.date_end)}
              </span>
            </div>

            {/* Ville de départ */}
            <div className="flex items-center gap-2 mb-4 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>Départ de {fakeOffer.departure_city}</span>
            </div>

            {/* Répartition des nuits */}
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{fakeOffer.makkah_nights}</div>
                  <div className="text-sm text-muted-foreground">nuits à Makkah</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{fakeOffer.medina_nights}</div>
                  <div className="text-sm text-muted-foreground">nuits à Médine</div>
                </div>
              </div>
            </div>

            {/* Hôtels */}
            <div className="space-y-3">
              {/* Hôtel Makkah */}
              <div className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">Makkah</span>
                  </div>
                  {renderStars(getStars(fakeOffer.formula_type))}
                </div>
                <div className="text-sm font-medium mb-1">{fakeOffer.hotel_makkah}</div>
                <div className="text-xs text-muted-foreground">
                  À {fakeOffer.distance_to_haram_m}m du Haram
                </div>
              </div>

              {/* Hôtel Médine */}
              <div className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">Médine</span>
                  </div>
                  {renderStars(getStars(fakeOffer.formula_type))}
                </div>
                <div className="text-sm font-medium">{fakeOffer.hotel_medinah}</div>
              </div>
            </div>

            {/* Inclusions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {fakeOffer.flights_included && (
                <Badge variant="outline" className="text-xs">✈️ Vols inclus</Badge>
              )}
              {fakeOffer.visa_included && (
                <Badge variant="outline" className="text-xs">📋 Visa inclus</Badge>
              )}
              {fakeOffer.board && (
                <Badge variant="outline" className="text-xs">🍽️ {fakeOffer.board}</Badge>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
