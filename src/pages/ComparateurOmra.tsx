import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Search, Plane, CheckCircle2, Calendar } from "lucide-react";

interface OmraOffer {
  id: string;
  agency_name: string;
  offer_title: string;
  offer_url: string;
  price_eur: number;
  duration_nights: number;
  departure_city: string;
  formula_type: string;
  visa_included: boolean;
  flights_included: boolean;
  hotel_makkah: string;
  hotel_medinah: string;
}

const ComparateurOmra = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tripType, setTripType] = useState("omra");
  const [sortBy, setSortBy] = useState("price_asc");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFormula, setSelectedFormula] = useState("");

  const { data: offersData, isLoading } = useQuery({
    queryKey: ['omra-offers', sortBy, selectedMonth, priceRange, selectedCity, selectedFormula],
    queryFn: async () => {
      let query = supabase
        .from('omra_offers')
        .select('*')
        .eq('status', 'active');

      // Filtres
      if (selectedMonth) {
        query = query.eq('month_departure', selectedMonth);
      }
      if (selectedCity) {
        query = query.eq('departure_city', selectedCity);
      }
      if (selectedFormula) {
        query = query.eq('formula_type', selectedFormula);
      }
      query = query.gte('price_eur', priceRange[0]).lte('price_eur', priceRange[1]);

      // Tri
      switch (sortBy) {
        case 'price_asc': query = query.order('price_eur', { ascending: true }); break;
        case 'price_desc': query = query.order('price_eur', { ascending: false }); break;
        case 'duration_asc': query = query.order('duration_nights', { ascending: true }); break;
        case 'duration_desc': query = query.order('duration_nights', { ascending: false }); break;
        default: query = query.order('price_eur', { ascending: true });
      }

      query = query.range(0, 23);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    retry: 1,
  });

  const offers: OmraOffer[] = offersData || [];

  const formulaTypeLabels: Record<string, string> = {
    standard: 'Standard',
    confort: 'Confort',
    premium: 'Premium',
    elite: 'Elite',
  };

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Comparateur de Séjours Omra - Meilleurs Prix | Omra Bons Plans</title>
        <meta name="description" content="Découvrez et comparez toutes les offres Omra en France. Trouvez le meilleur prix pour votre séjour." />
        <link rel="canonical" href="https://omrabonsplans.fr/comparateur-omra" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] text-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Omra Bons Plans - Votre guide vers La Mecque
          </h1>
          <p className="text-lg md:text-xl text-center mb-8 text-gray-200">
            Découvrez et comparez toutes les offres Omra et Hajj en France
          </p>

          {/* Search Bar */}
          <Card className="p-4 bg-[#1E293B] border-none shadow-xl">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher une destination, agence..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 bg-white"
                />
              </div>
              <Select value={tripType} onValueChange={setTripType}>
                <SelectTrigger className="md:w-[180px] h-12 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="omra">Omra</SelectItem>
                  <SelectItem value="hajj">Hajj</SelectItem>
                  <SelectItem value="both">Omra & Hajj</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-12 px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </Card>

          {/* Filtres avancés */}
          <Card className="p-6 mt-4 bg-white">
            <h3 className="text-lg font-semibold mb-4">Filtrez par mois, prix, ville de départ et type de formule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mois de départ</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les mois" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les mois</SelectItem>
                    <SelectItem value="janvier">Janvier</SelectItem>
                    <SelectItem value="février">Février</SelectItem>
                    <SelectItem value="mars">Mars</SelectItem>
                    <SelectItem value="avril">Avril</SelectItem>
                    <SelectItem value="mai">Mai</SelectItem>
                    <SelectItem value="juin">Juin</SelectItem>
                    <SelectItem value="juillet">Juillet</SelectItem>
                    <SelectItem value="août">Août</SelectItem>
                    <SelectItem value="septembre">Septembre</SelectItem>
                    <SelectItem value="octobre">Octobre</SelectItem>
                    <SelectItem value="novembre">Novembre</SelectItem>
                    <SelectItem value="décembre">Décembre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Ville de départ</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les villes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les villes</SelectItem>
                    <SelectItem value="Paris">Paris</SelectItem>
                    <SelectItem value="Lyon">Lyon</SelectItem>
                    <SelectItem value="Marseille">Marseille</SelectItem>
                    <SelectItem value="Toulouse">Toulouse</SelectItem>
                    <SelectItem value="Bordeaux">Bordeaux</SelectItem>
                    <SelectItem value="Nantes">Nantes</SelectItem>
                    <SelectItem value="Strasbourg">Strasbourg</SelectItem>
                    <SelectItem value="Lille">Lille</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type de formule</label>
                <Select value={selectedFormula} onValueChange={setSelectedFormula}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les formules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les formules</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="confort">Confort</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Prix max: {priceRange[1]}€</label>
                <Input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Périodes spéciales */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Périodes spéciales</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge 
              variant={selectedPeriod === 'ramadan' ? 'default' : 'outline'}
              className="px-6 py-2 text-base cursor-pointer"
              onClick={() => setSelectedPeriod(selectedPeriod === 'ramadan' ? '' : 'ramadan')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Ramadan
            </Badge>
            <Badge 
              variant={selectedPeriod === '10derniers' ? 'default' : 'outline'}
              className="px-6 py-2 text-base cursor-pointer"
              onClick={() => setSelectedPeriod(selectedPeriod === '10derniers' ? '' : '10derniers')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              10 derniers jours
            </Badge>
            <Badge 
              variant={selectedPeriod === 'vacances' ? 'default' : 'outline'}
              className="px-6 py-2 text-base cursor-pointer"
              onClick={() => setSelectedPeriod(selectedPeriod === 'vacances' ? '' : 'vacances')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Vacances scolaires
            </Badge>
          </div>
        </div>

        {/* Header des offres */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Offres disponibles ({offers.length})
          </h2>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">Prix croissant</SelectItem>
              <SelectItem value="price_desc">Prix décroissant</SelectItem>
              <SelectItem value="duration_asc">Durée croissante</SelectItem>
              <SelectItem value="duration_desc">Durée décroissante</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des offres */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement des offres...</p>
          </div>
        ) : offers.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl font-semibold mb-2">Aucune offre disponible pour le moment</p>
            <p className="text-muted-foreground">
              Les offres seront ajoutées prochainement via notre système de scraping automatique.
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{offer.offer_title}</h3>
                    <p className="text-sm text-muted-foreground">{offer.agency_name}</p>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-primary">{offer.price_eur}€</span>
                      {offer.duration_nights > 0 && (
                        <span className="text-sm text-muted-foreground">{offer.duration_nights} nuits</span>
                      )}
                    </div>
                    
                    <p className="text-sm">
                      <span className="font-medium">Départ:</span> {offer.departure_city}
                    </p>

                    {offer.hotel_makkah && (
                      <p className="text-sm line-clamp-1">
                        <span className="font-medium">Makkah:</span> {offer.hotel_makkah}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {formulaTypeLabels[offer.formula_type] || offer.formula_type}
                    </Badge>
                    {offer.flights_included && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <Plane className="w-3 h-3" />
                        Vol inclus
                      </Badge>
                    )}
                    {offer.visa_included && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Visa inclus
                      </Badge>
                    )}
                  </div>

                  <Button asChild className="w-full">
                    <a href={offer.offer_url} rel="nofollow sponsored" target="_blank">
                      Voir l'offre
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <Card className="mt-8 p-4 bg-muted">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Mentions légales:</strong> Informations collectées auprès des sites des agences citées. 
            Vérifiez les détails et conditions sur le site de l'agence avant réservation. 
            Les prix et disponibilités sont susceptibles de changer.
          </p>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default ComparateurOmra;
