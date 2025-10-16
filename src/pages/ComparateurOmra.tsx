import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Filter, X, ArrowUpDown, Plane, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface OmraOffer {
  id: string;
  agency_name: string;
  agency_url: string;
  offer_title: string;
  offer_url: string;
  price_eur: number;
  duration_nights: number;
  month_departure: string;
  date_start: string;
  date_end: string;
  departure_city: string;
  formula_type: string;
  visa_included: boolean;
  flights_included: boolean;
  medina_nights: number;
  makkah_nights: number;
  hotel_medinah: string;
  hotel_makkah: string;
  distance_to_haram_m: number;
  scraped_at: string;
}

const ComparateurOmra = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("price_asc");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Fetch offers with comprehensive error handling
  const { data: offersData, isLoading, error: queryError, refetch } = useQuery({
    queryKey: ['omra-offers', selectedMonth, priceRange, selectedCities, selectedTypes, sortBy],
    queryFn: async () => {
      try {
        console.log('Fetching offers...');

        let query = supabase
          .from('omra_offers')
          .select('*', { count: 'exact' })
          .eq('status', 'active');

        // Apply filters
        if (selectedMonth) {
          query = query.eq('month_departure', selectedMonth);
        }
        if (priceRange[0] > 0) {
          query = query.gte('price_eur', priceRange[0]);
        }
        if (priceRange[1] < 10000) {
          query = query.lte('price_eur', priceRange[1]);
        }
        if (selectedCities.length > 0) {
          query = query.in('departure_city', selectedCities);
        }
        if (selectedTypes.length > 0) {
          query = query.in('formula_type', selectedTypes);
        }

        // Apply sorting
        switch (sortBy) {
          case 'price_desc':
            query = query.order('price_eur', { ascending: false });
            break;
          case 'price_asc':
            query = query.order('price_eur', { ascending: true });
            break;
          case 'duration_desc':
            query = query.order('duration_nights', { ascending: false });
            break;
          case 'duration_asc':
            query = query.order('duration_nights', { ascending: true });
            break;
          case 'distance_asc':
            query = query.order('distance_to_haram_m', { ascending: true, nullsFirst: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          default:
            query = query.order('price_eur', { ascending: true });
        }

        query = query.range(0, 23); // First 24 results

        const { data: offers, error, count } = await query;

        if (error) {
          console.error('Database error:', error);
          throw error;
        }

        // Get last update time
        const { data: lastUpdateData } = await supabase
          .from('omra_offers')
          .select('scraped_at')
          .order('scraped_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        console.log('Fetched offers successfully:', offers?.length || 0);

        return {
          offers: offers || [],
          pagination: {
            page: 1,
            limit: 24,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / 24),
          },
          lastUpdate: lastUpdateData?.scraped_at || null,
        };
      } catch (error) {
        console.error('Error in queryFn:', error);
        // Return empty data instead of throwing
        return {
          offers: [],
          pagination: { page: 1, limit: 24, total: 0, totalPages: 0 },
          lastUpdate: null,
        };
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 15, // 15 minutes
    throwOnError: false, // Don't crash the page on error
  });

  const offers: OmraOffer[] = offersData?.offers || [];
  const lastUpdate = offersData?.lastUpdate;

  const handleCompareToggle = (offerId: string) => {
    setCompareList(prev =>
      prev.includes(offerId)
        ? prev.filter(id => id !== offerId)
        : prev.length < 4 ? [...prev, offerId] : prev
    );
  };

  const resetFilters = () => {
    setSelectedMonth("");
    setPriceRange([0, 10000]);
    setSelectedCities([]);
    setSelectedTypes([]);
  };

  const formulaTypeLabels: Record<string, string> = {
    standard: 'Standard',
    confort: 'Confort',
    premium: 'Premium',
    elite: 'Elite',
    autre: 'Autre',
  };

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Comparateur de Séjours Omra - Meilleurs Prix | Omra Bons Plans</title>
        <meta name="description" content="Comparez les offres de séjours Omra de plusieurs agences. Filtrez par mois, prix, ville de départ et type de formule pour trouver la meilleure offre." />
        <link rel="canonical" href="https://omrabonsplans.fr/comparateur-omra" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Comparateur de séjours Omra</h1>
          <p className="text-muted-foreground text-lg">
            Filtrez par mois, prix, ville de départ et type de formule. Comparez et réservez auprès de l'agence.
          </p>
          {lastUpdate && (
            <p className="text-sm text-muted-foreground mt-2">
              Dernière mise à jour : {format(new Date(lastUpdate), 'PPP', { locale: fr })}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="p-6 h-fit lg:sticky lg:top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtres
              </h2>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Réinitialiser
              </Button>
            </div>

            {/* Month Filter */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Mois de départ</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les mois" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les mois</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() + i);
                    const value = format(date, 'yyyy-MM');
                    return (
                      <SelectItem key={value} value={value}>
                        {format(date, 'MMMM yyyy', { locale: fr })}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">
                Prix (EUR): {priceRange[0]} - {priceRange[1]}€
              </label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={10000}
                step={100}
                className="mt-2"
              />
            </div>

            {/* Departure Cities */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Ville de départ</label>
              <div className="space-y-2">
                {['Paris', 'Lyon', 'Marseille', 'Bruxelles', 'Genève'].map(city => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={city}
                      checked={selectedCities.includes(city)}
                      onCheckedChange={(checked) => {
                        setSelectedCities(prev =>
                          checked ? [...prev, city] : prev.filter(c => c !== city)
                        );
                      }}
                    />
                    <label htmlFor={city} className="text-sm cursor-pointer">
                      {city}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Formula Type */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Type de formule</label>
              <div className="space-y-2">
                {Object.entries(formulaTypeLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={selectedTypes.includes(key)}
                      onCheckedChange={(checked) => {
                        setSelectedTypes(prev =>
                          checked ? [...prev, key] : prev.filter(t => t !== key)
                        );
                      }}
                    />
                    <label htmlFor={key} className="text-sm cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort & Compare Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_asc">Prix croissant</SelectItem>
                    <SelectItem value="price_desc">Prix décroissant</SelectItem>
                    <SelectItem value="duration_asc">Durée croissante</SelectItem>
                    <SelectItem value="duration_desc">Durée décroissante</SelectItem>
                    <SelectItem value="distance_asc">Proximité Haram</SelectItem>
                    <SelectItem value="newest">Plus récentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {compareList.length > 0 && (
                <Button onClick={() => setShowComparison(!showComparison)}>
                  Comparer ({compareList.length})
                </Button>
              )}
            </div>

            {/* Offers Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Chargement des offres...</p>
              </div>
            ) : queryError ? (
              <Card className="p-12 text-center">
                <p className="text-lg mb-4 text-destructive">Erreur lors du chargement</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {queryError instanceof Error ? queryError.message : 'Une erreur est survenue'}
                </p>
                <Button onClick={() => refetch()}>Réessayer</Button>
              </Card>
            ) : offers.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-lg mb-4">
                  {selectedMonth || selectedCities.length > 0 || selectedTypes.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000
                    ? 'Aucune offre ne correspond à vos critères'
                    : 'Aucune offre disponible pour le moment'}
                </p>
                {(selectedMonth || selectedCities.length > 0 || selectedTypes.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <Button onClick={resetFilters}>Élargir les filtres</Button>
                )}
                {offers.length === 0 && !selectedMonth && selectedCities.length === 0 && selectedTypes.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Les offres seront ajoutées prochainement via notre système de scraping automatique.
                    En attendant, vous pouvez <a href="/agences-liste" className="text-primary underline">consulter notre liste d'agences</a>.
                  </p>
                )}
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {offers.map((offer) => (
                  <Card key={offer.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{offer.offer_title}</h3>
                        <p className="text-sm text-muted-foreground">{offer.agency_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{offer.price_eur}€</p>
                        {offer.duration_nights > 0 && (
                          <p className="text-sm text-muted-foreground">{offer.duration_nights} nuits</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm">
                        <span className="font-medium">Départ:</span> {offer.departure_city}
                        {offer.month_departure && ` - ${format(new Date(offer.month_departure + '-01'), 'MMMM yyyy', { locale: fr })}`}
                      </p>
                      {offer.hotel_makkah && (
                        <p className="text-sm"><span className="font-medium">Makkah:</span> {offer.hotel_makkah}</p>
                      )}
                      {offer.hotel_medinah && (
                        <p className="text-sm"><span className="font-medium">Médine:</span> {offer.hotel_medinah}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{formulaTypeLabels[offer.formula_type] || offer.formula_type}</Badge>
                      {offer.flights_included && (
                        <Badge variant="outline" className="gap-1">
                          <Plane className="w-3 h-3" />
                          Vol inclus
                        </Badge>
                      )}
                      {offer.visa_included && (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Visa inclus
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <a href={offer.offer_url} rel="nofollow sponsored" target="_blank">
                          Voir l'offre
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                      <Button
                        variant={compareList.includes(offer.id) ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleCompareToggle(offer.id)}
                        disabled={!compareList.includes(offer.id) && compareList.length >= 4}
                      >
                        {compareList.includes(offer.id) ? <X className="w-4 h-4" /> : '+'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Comparison Table */}
            {showComparison && compareList.length > 0 && (
              <Card className="mt-8 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Comparaison des offres</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowComparison(false)}>
                    Fermer
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold">Critère</th>
                        {compareList.map(offerId => {
                          const offer = offers.find(o => o.id === offerId);
                          return offer ? (
                            <th key={offerId} className="text-left p-2 font-semibold">{offer.agency_name}</th>
                          ) : null;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Prix</td>
                        {compareList.map(offerId => {
                          const offer = offers.find(o => o.id === offerId);
                          return offer ? (
                            <td key={offerId} className="p-2 font-bold text-primary">{offer.price_eur}€</td>
                          ) : null;
                        })}
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Formule</td>
                        {compareList.map(offerId => {
                          const offer = offers.find(o => o.id === offerId);
                          return offer ? (
                            <td key={offerId} className="p-2">{formulaTypeLabels[offer.formula_type] || offer.formula_type}</td>
                          ) : null;
                        })}
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Durée</td>
                        {compareList.map(offerId => {
                          const offer = offers.find(o => o.id === offerId);
                          return offer ? (
                            <td key={offerId} className="p-2">{offer.duration_nights} nuits</td>
                          ) : null;
                        })}
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Vol inclus</td>
                        {compareList.map(offerId => {
                          const offer = offers.find(o => o.id === offerId);
                          return offer ? (
                            <td key={offerId} className="p-2">{offer.flights_included ? 'Oui' : 'Non'}</td>
                          ) : null;
                        })}
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Visa inclus</td>
                        {compareList.map(offerId => {
                          const offer = offers.find(o => o.id === offerId);
                          return offer ? (
                            <td key={offerId} className="p-2">{offer.visa_included ? 'Oui' : 'Non'}</td>
                          ) : null;
                        })}
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Lien</td>
                        {compareList.map(offerId => {
                          const offer = offers.find(o => o.id === offerId);
                          return offer ? (
                            <td key={offerId} className="p-2">
                              <a href={offer.offer_url} target="_blank" rel="nofollow sponsored" className="text-primary hover:underline">
                                Voir l'offre
                              </a>
                            </td>
                          ) : null;
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Disclaimer */}
            <Card className="mt-8 p-4 bg-muted">
              <p className="text-sm text-muted-foreground">
                <strong>Mentions légales:</strong> Informations collectées auprès des sites des agences citées. 
                Vérifiez les détails et conditions sur le site de l'agence avant réservation. 
                Les prix et disponibilités sont susceptibles de changer.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default ComparateurOmra;