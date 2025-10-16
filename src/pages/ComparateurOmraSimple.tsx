import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Hotel, MapPin, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ComparateurOmraSimple() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        console.log('Fetching offers...');
        const { data, error: fetchError } = await supabase
          .from('omra_offers')
          .select('*')
          .eq('status', 'active')
          .limit(10);

        console.log('Data:', data);
        console.log('Error:', fetchError);

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setOffers(data || []);
        }
      } catch (err: any) {
        console.error('Caught error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">Comparateur Omra (Test)</h1>

        {error && (
          <Card className="p-6 mb-4 border-destructive">
            <p className="text-destructive">Erreur: {error}</p>
          </Card>
        )}

        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <div className="space-y-4">
            <p className="text-lg">
              {offers.length} offres trouvées
            </p>
            
            {offers.map((offer) => (
              <Card key={offer.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-2xl">{offer.agency_name}</h3>
                    <Badge 
                      className={`mt-2 font-bold px-4 py-2 text-base capitalize ${
                        offer.formula_type?.toLowerCase() === 'essentiel' 
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                          : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                      }`}
                    >
                      ✨ {offer.formula_type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">à partir de</div>
                    <div className="text-4xl font-bold text-primary">{offer.price_eur}€</div>
                    <div className="text-sm text-muted-foreground">/ personne</div>
                  </div>
                </div>

                {/* Dates */}
                {offer.date_start && offer.date_end ? (
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h4 className="text-xl font-bold">
                        Omra {new Date(offer.date_start).toLocaleDateString('fr-FR', { month: 'long' })}
                      </h4>
                    </div>
                    <div className="text-base font-semibold">
                      Du {new Date(offer.date_start).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} au {new Date(offer.date_end).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                    </div>
                    {offer.duration_nights && (
                      <div className="text-sm text-muted-foreground mt-1">{offer.duration_nights} nuits</div>
                    )}
                  </div>
                ) : (
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h4 className="text-xl font-bold">
                        Omra {offer.month_departure}
                      </h4>
                    </div>
                    {offer.duration_nights && (
                      <div className="text-sm text-muted-foreground mt-1">{offer.duration_nights} nuits</div>
                    )}
                  </div>
                )}

                {/* Départ et répartition */}
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-xs font-medium text-muted-foreground uppercase">Départ</div>
                      <div className="text-base font-semibold">{offer.departure_city}</div>
                    </div>
                  </div>
                  
                  {(offer.makkah_nights || offer.medina_nights) && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-xs font-medium text-muted-foreground uppercase">Répartition</div>
                        <div className="text-base font-semibold">
                          {offer.makkah_nights} nuits La Mecque / {offer.medina_nights} nuits Médine
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hôtels */}
                <div className="space-y-3">
                  {offer.hotel_makkah && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Hotel className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Hôtel La Mecque</div>
                          <div className="text-base font-semibold mb-1">{offer.hotel_makkah}</div>
                          <div className="flex items-center gap-1">
                            {[...Array(offer.formula_type?.toLowerCase() === 'confort' ? 5 : 3)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          {offer.distance_to_haram_m && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{offer.distance_to_haram_m}m du Haram</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {offer.hotel_medinah && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Hotel className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Hôtel Médine</div>
                          <div className="text-base font-semibold mb-1">{offer.hotel_medinah}</div>
                          <div className="flex items-center gap-1">
                            {[...Array(offer.formula_type?.toLowerCase() === 'confort' ? 5 : 3)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button className="w-full" asChild>
                  <a href={offer.offer_url} target="_blank" rel="noopener noreferrer">
                    Voir l'offre
                  </a>
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
