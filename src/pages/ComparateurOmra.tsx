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

export default function ComparateurOmra() {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedFormula, setSelectedFormula] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [minDuration, setMinDuration] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('price_asc');
  const [showFilters, setShowFilters] = useState(false);

  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch offers avec requête directe
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        let query = supabase
          .from('omra_offers')
          .select('*')
          .eq('status', 'active');

        // Filtres
        if (selectedMonth) query = query.eq('month_departure', selectedMonth);
        if (selectedCity) query = query.eq('departure_city', selectedCity);
        if (selectedFormula) query = query.eq('formula_type', selectedFormula.toLowerCase());
        if (priceRange[0] > 0) query = query.gte('price_eur', priceRange[0]);
        if (priceRange[1] < 10000) query = query.lte('price_eur', priceRange[1]);
        if (minDuration) query = query.gte('duration_nights', parseInt(minDuration));
        if (maxDistance) query = query.lte('distance_to_haram_m', parseInt(maxDistance));

        const { data, error: fetchError } = await query;

        if (fetchError) {
          setError(fetchError.message);
        } else {
          let sorted = data || [];
          // Tri
          switch (sortBy) {
            case 'price_asc':
              sorted.sort((a, b) => (a.price_eur || 0) - (b.price_eur || 0));
              break;
            case 'price_desc':
              sorted.sort((a, b) => (b.price_eur || 0) - (a.price_eur || 0));
              break;
            case 'duration_asc':
              sorted.sort((a, b) => (a.duration_nights || 0) - (b.duration_nights || 0));
              break;
            case 'duration_desc':
              sorted.sort((a, b) => (b.duration_nights || 0) - (a.duration_nights || 0));
              break;
          }
          setOffers(sorted);
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
    setSelectedMonth('');
    setSelectedCity('');
    setSelectedFormula('');
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
        {/* Hero Section */}
        <div className="text-center space-y-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Votre comparateur séjours OMRA 2025 et 2026
          </h1>
          <h2 className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Trouveez, comparez et réservez votre séjours pour la Omra au meilleurs prix !
          </h2>
        </div>

        {/* Quick Filters */}
        <Card className="p-6 bg-card/50 backdrop-blur">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Mois de départ</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les mois" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les mois</SelectItem>
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
                  <SelectItem value="">Toutes les villes</SelectItem>
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
                  <SelectItem value="">Toutes les formules</SelectItem>
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

          {/* Advanced Filters */}
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

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">
            {offers ? `${offers.length} offre${offers.length > 1 ? 's' : ''} trouvée${offers.length > 1 ? 's' : ''}` : 'Chargement...'}
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

        {/* Offers Grid */}
        {error ? (
          <Card className="p-12 text-center border-destructive">
            <p className="text-destructive text-lg font-semibold mb-2">
              Erreur lors du chargement des offres
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              {error}
            </p>
            <Button onClick={() => window.location.reload()}>
              Recharger la page
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
        ) : offers && offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg line-clamp-2 mb-2">
                      {offer.offer_title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{offer.agency_name}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {offer.price_eur}€
                    </span>
                    <span className="text-sm text-muted-foreground">par personne</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{offer.formula_type}</Badge>
                    {offer.flights_included && <Badge variant="outline">Vol inclus</Badge>}
                    {offer.visa_included && <Badge variant="outline">Visa inclus</Badge>}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{offer.month_departure} - {offer.duration_nights} nuits</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Départ: {offer.departure_city}</span>
                    </div>
                    {(offer.makkah_nights || offer.medina_nights) && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {offer.makkah_nights}N La Mecque / {offer.medina_nights}N Médine
                        </span>
                      </div>
                    )}
                    {offer.hotel_makkah && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hotel className="h-4 w-4" />
                        <span className="line-clamp-1">{offer.hotel_makkah}</span>
                      </div>
                    )}
                    {offer.distance_to_haram_m && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{offer.distance_to_haram_m}m du Haram</span>
                      </div>
                    )}
                  </div>

                  <Button asChild className="w-full">
                    <a href={offer.offer_url} target="_blank" rel="noopener noreferrer">
                      Voir l'offre
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
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
