import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DynamicSEO } from '@/components/SEO/DynamicSEO';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Hotel, Clock, ExternalLink, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const FORMULA_TYPES = ['Essentiel', 'Confort'];
const CITIES = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux', 'Lille'];

const AGENCY_LOGOS: Record<string, string> = {
  'Medinvoyages': '/lovable-uploads/logomedinvoyages.png',
  'Almaqam': '/lovable-uploads/logoalmaqam.png',
  'Pèlerin Hajj': '/lovable-uploads/logopelrinhajj.webp',
  'Al Bayt': '/lovable-uploads/logoalbayt.png',
  'Hayat': '/lovable-uploads/logohayat.png',
  'Omra Sounnah': '/lovable-uploads/logoomrasounnah.png',
  'Omra Pour Tous': '/lovable-uploads/logoomrapourtous.jpeg',
  'Sabile': '/lovable-uploads/logosabile.png',
  'Tawaf': '/lovable-uploads/logotawaf.webp',
};

const getAgencyLogo = (agencyName: string): string | null => {
  const normalizedName = agencyName?.trim().toLowerCase();
  for (const [key, logo] of Object.entries(AGENCY_LOGOS)) {
    if (normalizedName?.includes(key.toLowerCase())) {
      return logo;
    }
  }
  return null;
};

export default function ComparateurOmra() {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedFormula, setSelectedFormula] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [minDuration, setMinDuration] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('price_asc');
  const [showFilters, setShowFilters] = useState(false);

  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        let query = supabase
          .from('omra_offers')
          .select('*')
          .eq('status', 'active');

        if (selectedMonth && selectedMonth !== 'all') query = query.eq('month_departure', selectedMonth);
        if (selectedCity && selectedCity !== 'all') query = query.eq('departure_city', selectedCity);
        if (selectedFormula && selectedFormula !== 'all') query = query.eq('formula_type', selectedFormula.toLowerCase());
        if (priceRange[0] > 0) query = query.gte('price_eur', priceRange[0]);
        if (priceRange[1] < 10000) query = query.lte('price_eur', priceRange[1]);
        if (minDuration) query = query.gte('duration_nights', parseInt(minDuration));
        if (maxDistance) query = query.lte('distance_to_haram_m', parseInt(maxDistance));

        const { data, error: fetchError } = await query;

        if (fetchError) {
          setError(fetchError.message);
        } else {
          let sorted = data || [];
          switch (sortBy) {
            case 'price_asc':
              sorted.sort((a, b) => a.price_eur - b.price_eur);
              break;
            case 'price_desc':
              sorted.sort((a, b) => b.price_eur - a.price_eur);
              break;
            case 'duration_asc':
              sorted.sort((a, b) => (a.duration_nights || 0) - (b.duration_nights || 0));
              break;
            case 'duration_desc':
              sorted.sort((a, b) => (b.duration_nights || 0) - (a.duration_nights || 0));
              break;
          }
          setOffers(sorted);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [selectedMonth, selectedCity, selectedFormula, priceRange, minDuration, maxDistance, sortBy]);

  const resetFilters = () => {
    setSelectedMonth('all');
    setSelectedCity('all');
    setSelectedFormula('all');
    setPriceRange([0, 10000]);
    setMinDuration('');
    setMaxDistance('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <DynamicSEO
        title="Comparateur Séjours Omra 2025 et 2026"
        description="Trouvez, comparez et réservez votre séjour pour la Omra au meilleur prix parmi des centaines d'offres"
        keywords={['omra', 'comparateur omra', 'séjour omra', 'meilleur prix omra']}
        path="/comparateur-omra"
      />
      
      <SEOBreadcrumb
        items={[
          { name: 'Accueil', url: '/' },
          { name: 'Comparateur Omra', url: '/comparateur-omra' }
        ]}
      />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Votre comparateur séjours OMRA 2025 et 2026
          </h1>
          <h2 className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Trouveez, comparez et réservez votre séjours pour la Omra au meilleurs prix !
          </h2>
        </div>

        <Card className="p-6 bg-card/50 backdrop-blur">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Mois de départ</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les mois" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les mois</SelectItem>
                  {MONTHS.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Ville de départ</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {CITIES.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Formule</label>
              <Select value={selectedFormula} onValueChange={setSelectedFormula}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les formules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les formules</SelectItem>
                  {FORMULA_TYPES.map(formula => (
                    <SelectItem key={formula} value={formula}>{formula}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Masquer' : 'Plus de filtres'}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Budget (€): {priceRange[0]} - {priceRange[1]}
                  </label>
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-4"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Durée minimum (nuits)</label>
                  <Input
                    type="number"
                    placeholder="Ex: 10"
                    value={minDuration}
                    onChange={(e) => setMinDuration(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Distance max du Haram (m)</label>
                  <Input
                    type="number"
                    placeholder="Ex: 500"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button variant="outline" onClick={resetFilters} className="w-full">
                    Réinitialiser les filtres
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">
            {offers.length} offre{offers.length > 1 ? 's' : ''} trouvée{offers.length > 1 ? 's' : ''}
          </p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">Prix croissant</SelectItem>
              <SelectItem value="price_desc">Prix décroissant</SelectItem>
              <SelectItem value="duration_asc">Durée croissante</SelectItem>
              <SelectItem value="duration_desc">Durée décroissante</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error ? (
          <Card className="p-12 text-center border-destructive">
            <p className="text-destructive text-lg font-semibold mb-2">
              Erreur: {error}
            </p>
            <Button onClick={() => window.location.reload()}>
              Recharger
            </Button>
          </Card>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-24 w-full" />
              </Card>
            ))}
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const agencyLogo = getAgencyLogo(offer.agency_name);
              
              return (
                <Card 
                  key={offer.id} 
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card"
                >
                  {/* Header avec logo agence */}
                  <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-br from-muted/30 to-background">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                          {offer.offer_title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{offer.agency_name}</p>
                      </div>
                      {agencyLogo && (
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-background border p-2 flex items-center justify-center">
                          <img 
                            src={agencyLogo} 
                            alt={offer.agency_name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prix en évidence */}
                  <div className="px-6 py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">
                        {offer.price_eur}€
                      </span>
                      <span className="text-sm text-muted-foreground">par personne</span>
                    </div>
                  </div>

                  {/* Corps de la carte */}
                  <div className="p-6 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="font-medium">
                        {offer.formula_type}
                      </Badge>
                      {offer.flights_included && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                          Vol inclus
                        </Badge>
                      )}
                      {offer.visa_included && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                          Visa inclus
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3 text-sm">
                      {offer.date_start && offer.date_end ? (
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium text-foreground">Dates</div>
                            <div>
                              {new Date(offer.date_start).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} → {new Date(offer.date_end).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                            {offer.duration_nights && (
                              <div className="text-xs">{offer.duration_nights} nuits</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium text-foreground">Mois de départ</div>
                            <div>
                              {offer.month_departure}
                              {offer.duration_nights && ` - ${offer.duration_nights} nuits`}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Départ</div>
                          <div>{offer.departure_city}</div>
                        </div>
                      </div>
                      
                      {(offer.makkah_nights || offer.medina_nights) && (
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium text-foreground">Répartition</div>
                            <div>
                              {offer.makkah_nights}N La Mecque / {offer.medina_nights}N Médine
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {offer.hotel_makkah && (
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Hotel className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium text-foreground">Hôtel</div>
                            <div className="line-clamp-2">{offer.hotel_makkah}</div>
                          </div>
                        </div>
                      )}
                      
                      {offer.distance_to_haram_m && (
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium text-foreground">Distance</div>
                            <div>{offer.distance_to_haram_m}m du Haram</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer avec bouton */}
                  <div className="px-6 pb-6">
                    <Button asChild className="w-full group-hover:shadow-lg transition-shadow">
                      <a href={offer.offer_url} target="_blank" rel="noopener noreferrer">
                        Voir l'offre
                        <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              Aucune offre ne correspond à vos critères. Essayez de modifier vos filtres.
            </p>
          </Card>
        )}

        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-2">💡 À propos de ce comparateur</h3>
          <p className="text-sm text-muted-foreground">
            Les offres affichées sont automatiquement récupérées depuis plusieurs agences de voyages spécialisées. 
            Les prix et disponibilités sont mis à jour régulièrement. Nous vous recommandons de vérifier les détails directement auprès de l'agence avant de réserver.
          </p>
        </Card>
      </div>
    </div>
  );
}
