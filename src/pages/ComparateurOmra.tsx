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
  formula_type: 'standard' | 'confort' | 'premium' | 'elite' | 'autre';
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

  // Fetch offers
  const { data: offersData, isLoading } = useQuery({
    queryKey: ['omra-offers', selectedMonth, priceRange, selectedCities, selectedTypes, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        sort: sortBy,
        page: '1',
        limit: '24',
      });
      
      if (selectedMonth) params.append('month', selectedMonth);
      if (priceRange[0] > 0) params.append('priceMin', priceRange[0].toString());
      if (priceRange[1] < 10000) params.append('priceMax', priceRange[1].toString());
      if (selectedCities.length > 0) params.append('departure', selectedCities.join(','));
      if (selectedTypes.length > 0) params.append('type', selectedTypes.join(','));

      const { data, error } = await supabase.functions.invoke('omra-offers-api', {
        method: 'GET',
        body: params.toString(),
      });

      if (error) throw error;
      return data;
    },
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

  const formulaTypeLabels = {
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
              <div className="text-center py-12">Chargement des offres...</div>
            ) : offers.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-lg mb-4">Aucune offre ne correspond à vos critères</p>
                <Button onClick={resetFilters}>Élargir les filtres</Button>
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
                        <p className="text-sm text-muted-foreground">{offer.duration_nights} nuits</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm">
                        <span className="font-medium">Départ:</span> {offer.departure_city} - {format(new Date(offer.date_start), 'MMMM yyyy', { locale: fr })}
                      </p>
                      {offer.hotel_makkah && (
                        <p className="text-sm"><span className="font-medium">Makkah:</span> {offer.hotel_makkah}</p>
                      )}
                      {offer.hotel_medinah && (
                        <p className="text-sm"><span className="font-medium">Médine:</span> {offer.hotel_medinah}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{formulaTypeLabels[offer.formula_type]}</Badge>
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
                <h2 className="text-xl font-bold mb-4">Comparaison</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Critère</th>
                        {compareList.map(offerId => {
                          const offer = offers.find(o => o.id === offerId);
                          return offer ? (
                            <th key={offerId} className="text-left p-2">{offer.agency_name}</th>
                          ) : null;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2 font-medium">Prix</td>
                        {compareList.map(offerId => {
                          const offer = offers.find(o => o.id === offerId);
                          return offer ? (
                            <td key={offerId} className="p-2">{offer.price_eur}€</td>
                          ) : null;
                        })}
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 font-medium">Formule</td>
                        {compareList.map(offerId => {
                          const offer = offers.find(o => o.id === offerId);
                          return offer ? (
                            <td key={offerId} className="p-2">{formulaTypeLabels[offer.formula_type]}</td>
                          ) : null;
                        })}
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 font-medium">Durée</td>
                        {compareList.map(offerId => {
                          const offer = offers.find(o => o.id === offerId);
                          return offer ? (
                            <td key={offerId} className="p-2">{offer.duration_nights} nuits</td>
                          ) : null;
                        })}
                      </tr>
                      {/* Add more comparison rows */}
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