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
import { Calendar, MapPin, Hotel, Clock, ExternalLink, Filter, Plane, CheckCircle2, Sparkles, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getAgencyInfo } from '@/utils/agenciesData';

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
  'Pelerin': '/lovable-uploads/logopelrinhajj.webp',
  'Al Bayt': '/lovable-uploads/logoalbayt.png',
  'Hayat': '/lovable-uploads/logohayat.png',
  'Omra Sounnah': '/lovable-uploads/logoomrasounnah.png',
  'Omra Pour Tous': '/lovable-uploads/logoomrapourtous.jpeg',
  'Sabil': '/lovable-uploads/logosabilvoyages.png',
  'Sabil Voyages': '/lovable-uploads/logosabilvoyages.png',
  'Tawaf': '/lovable-uploads/logotawaf.webp',
};

const getAgencyLogo = (agencyName: string): string | null => {
  const normalizedName = agencyName?.trim().toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/\s+/g, '');
  
  for (const [key, logo] of Object.entries(AGENCY_LOGOS)) {
    const normalizedKey = key.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/\s+/g, '');
    
    if (normalizedName?.includes(normalizedKey) || normalizedKey.includes(normalizedName)) {
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
        
        // Exemple fake pour l'agence Tawaf
        const fakeOffer = {
          id: 'fake-tawaf-example',
          agency_name: 'Tawaf',
          agency_url: 'https://tawaf.fr',
          price_eur: 2450,
          month_departure: 'Janvier',
          date_start: '2025-01-15',
          date_end: '2025-01-27',
          departure_city: 'Paris',
          formula_type: 'confort',
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
          offer_title: 'Omra Confort Janvier 2025',
          status: 'active',
          scraped_at: new Date().toISOString()
        };
        
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
          // Ajouter l'exemple fake au début
          let sorted = [fakeOffer, ...(data || [])];
          
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
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

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 pt-8 md:pt-12 pb-6 md:pb-8 relative">
          <div className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 rounded-full text-xs md:text-sm font-medium text-primary mb-2 md:mb-4">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
              <span>Meilleurs prix garantis</span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent leading-tight px-2">
              Comparateur Omra 2025 - 2026
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Trouvez, comparez et réservez votre séjour pour la Omra au meilleur prix parmi des centaines d'offres
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 space-y-4 md:space-y-8">

        {/* Filtres principaux */}
        <Card className="p-3 md:p-6 bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg animate-scale-in">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm font-medium flex items-center gap-1.5 md:gap-2">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  Mois de départ
                </label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="bg-background/50 h-9 md:h-10 text-sm">
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

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm font-medium flex items-center gap-1.5 md:gap-2">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  Ville de départ
                </label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="bg-background/50 h-9 md:h-10 text-sm">
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

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm font-medium flex items-center gap-1.5 md:gap-2">
                  <Hotel className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  Formule
                </label>
                <Select value={selectedFormula} onValueChange={setSelectedFormula}>
                  <SelectTrigger className="bg-background/50 h-9 md:h-10 text-sm">
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
            </div>

            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto hover-scale h-9 text-sm"
            >
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              {showFilters ? 'Masquer' : 'Plus de filtres'}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-primary/10 space-y-4 md:space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-xs md:text-sm font-medium flex items-center justify-between">
                    <span>Budget</span>
                    <span className="text-primary font-bold text-xs md:text-sm">{priceRange[0]}€ - {priceRange[1]}€</span>
                  </label>
                  <Slider
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-3 md:py-4"
                  />
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-medium flex items-center gap-1.5 md:gap-2">
                    <Clock className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    Durée minimum (nuits)
                  </label>
                  <Input
                    type="number"
                    placeholder="Ex: 10"
                    value={minDuration}
                    onChange={(e) => setMinDuration(e.target.value)}
                    className="bg-background/50 h-9 md:h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-medium flex items-center gap-1.5 md:gap-2">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    Distance max du Haram (m)
                  </label>
                  <Input
                    type="number"
                    placeholder="Ex: 500"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(e.target.value)}
                    className="bg-background/50 h-9 md:h-10 text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <Button variant="outline" onClick={resetFilters} className="w-full hover-scale h-9 md:h-10 text-sm">
                    Réinitialiser les filtres
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Barre de résultats */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 bg-card/50 p-3 md:p-4 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              <span className="text-foreground font-bold">{offers.length}</span> offre{offers.length > 1 ? 's' : ''} disponible{offers.length > 1 ? 's' : ''}
            </p>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[220px] bg-background/50 h-9 md:h-10 text-sm">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">💰 Prix croissant</SelectItem>
              <SelectItem value="price_desc">💎 Prix décroissant</SelectItem>
              <SelectItem value="duration_asc">⏱️ Durée croissante</SelectItem>
              <SelectItem value="duration_desc">📅 Durée décroissante</SelectItem>
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
              <Card key={i} className="p-6 bg-card/80 backdrop-blur-sm animate-pulse">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-16 w-16 rounded-xl" />
                  </div>
                  <Skeleton className="h-12 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const agencyLogo = getAgencyLogo(offer.agency_name);
              const agencyInfo = getAgencyInfo(offer.agency_name);
              
              return (
                <Card 
                  key={offer.id} 
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 md:hover:-translate-y-2 border-primary/10 bg-card/80 backdrop-blur-sm hover:border-primary/30 animate-fade-in"
                >
                   {/* Header avec logo agence */}
                  <div className="px-3 md:px-6 pt-3 md:pt-6 pb-3 md:pb-4 border-b border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-background relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex flex-col items-center gap-2 md:gap-4 relative">
                      {agencyLogo && (
                        <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-lg md:rounded-xl bg-background border border-primary/20 p-1.5 md:p-2 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          <img 
                            src={agencyLogo} 
                            alt={offer.agency_name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-1 md:gap-2">
                        <h3 className="text-lg md:text-2xl font-bold text-center group-hover:text-primary transition-all duration-300">
                          {offer.agency_name}
                        </h3>
                        {agencyInfo && (
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <div className="flex items-center gap-0.5 md:gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 md:h-4 md:w-4 ${
                                    i < Math.floor(agencyInfo.googleRating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : i < agencyInfo.googleRating
                                      ? 'fill-yellow-400 text-yellow-400 opacity-50'
                                      : 'fill-gray-300 text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs md:text-sm font-semibold text-muted-foreground">
                              {agencyInfo.googleRating.toFixed(1)}
                            </span>
                            <span className="text-[10px] md:text-xs text-muted-foreground">
                              ({agencyInfo.reviewCount.toLocaleString('fr-FR')} avis)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prix en évidence */}
                  <div className="px-3 md:px-6 py-3 md:py-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2 relative text-center md:text-left">
                      <div className="flex flex-col md:flex-row items-center md:items-baseline gap-1 md:gap-2">
                        <span className="text-xs md:text-sm text-muted-foreground font-medium">à partir de</span>
                        <span className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                          {offer.price_eur}€
                        </span>
                      </div>
                      <span className="text-xs md:text-sm text-muted-foreground font-medium">/ personne</span>
                    </div>
                  </div>

                  {/* Corps de la carte */}
                  <div className="p-3 md:p-6 space-y-3 md:space-y-4">
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      <Badge 
                        className={`font-bold px-2.5 md:px-4 py-1 md:py-2 text-xs md:text-base capitalize shadow-md ${
                          offer.formula_type?.toLowerCase() === 'essentiel' 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-600 hover:from-amber-600 hover:to-orange-600' 
                            : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-purple-600 hover:from-purple-600 hover:to-indigo-700'
                        }`}
                      >
                        ✨ {offer.formula_type}
                      </Badge>
                      {offer.flights_included && (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 transition-colors px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs">
                          <Plane className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                          Vol inclus
                        </Badge>
                      )}
                      {offer.visa_included && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/20 transition-colors px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs">
                          <CheckCircle2 className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                          Visa inclus
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      {offer.date_start && offer.date_end ? (
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3 md:p-4 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                            <h4 className="text-sm md:text-xl font-bold text-foreground">
                              Omra {new Date(offer.date_start).toLocaleDateString('fr-FR', { month: 'long' })}
                            </h4>
                          </div>
                          <div className="text-xs md:text-base font-semibold text-foreground">
                            Du {new Date(offer.date_start).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} au {new Date(offer.date_end).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                          </div>
                          {offer.duration_nights && (
                            <div className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">{offer.duration_nights} nuits</div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3 md:p-4 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                            <h4 className="text-sm md:text-xl font-bold text-foreground">
                              Omra {offer.month_departure}
                            </h4>
                          </div>
                          {offer.duration_nights && (
                            <div className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">{offer.duration_nights} nuits</div>
                          )}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 gap-2 md:gap-3 bg-muted/50 p-3 md:p-4 rounded-lg">
                        <div className="flex items-center gap-2 md:gap-3">
                          <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                          <div>
                            <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide">Départ</div>
                            <div className="text-sm md:text-base font-semibold text-foreground">{offer.departure_city}</div>
                          </div>
                        </div>
                        
                        {(offer.makkah_nights || offer.medina_nights) && (
                          <div className="flex items-center gap-2 md:gap-3">
                            <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide">Répartition</div>
                              <div className="text-sm md:text-base font-semibold text-foreground">
                                {offer.makkah_nights} nuits La Mecque / {offer.medina_nights} nuits Médine
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {(offer.hotel_makkah || offer.hotel_medinah || offer.distance_to_haram_m) && (
                        <div className="space-y-2 md:space-y-3">
                          {offer.hotel_makkah && (
                            <div className="bg-muted/50 p-3 md:p-4 rounded-lg">
                              <div className="flex items-start gap-2 md:gap-3">
                                <Hotel className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0 mt-0.5 md:mt-1" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5 md:mb-1">Hôtel La Mecque</div>
                                  <div className="text-sm md:text-base font-semibold text-foreground mb-1 truncate">{offer.hotel_makkah}</div>
                                  <div className="flex items-center gap-0.5 md:gap-1">
                                    {[...Array(offer.formula_type?.toLowerCase() === 'confort' ? 5 : 3)].map((_, i) => (
                                      <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                  {offer.distance_to_haram_m && (
                                    <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2 text-xs md:text-sm text-muted-foreground">
                                      <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                                      <span>{offer.distance_to_haram_m}m du Haram</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {offer.hotel_medinah && (
                            <div className="bg-muted/50 p-3 md:p-4 rounded-lg">
                              <div className="flex items-start gap-2 md:gap-3">
                                <Hotel className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0 mt-0.5 md:mt-1" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5 md:mb-1">Hôtel Médine</div>
                                  <div className="text-sm md:text-base font-semibold text-foreground mb-1 truncate">{offer.hotel_medinah}</div>
                                  <div className="flex items-center gap-0.5 md:gap-1">
                                    {[...Array(offer.formula_type?.toLowerCase() === 'confort' ? 5 : 3)].map((_, i) => (
                                      <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer avec bouton */}
                  <div className="px-3 md:px-6 pb-3 md:pb-6 pt-1 md:pt-2">
                    <Button 
                      asChild 
                      className="w-full h-9 md:h-10 group/btn bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-xl transition-all duration-300 text-sm md:text-base"
                    >
                      <a href={offer.offer_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 md:gap-2">
                        <span className="font-semibold">Voir l'offre</span>
                        <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                      </a>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-16 text-center bg-card/50 backdrop-blur-sm border-primary/10">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Filter className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">
                Aucune offre ne correspond à vos critères
              </p>
              <p className="text-sm text-muted-foreground">
                Essayez de modifier vos filtres pour voir plus de résultats
              </p>
              <Button variant="outline" onClick={resetFilters} className="mt-4">
                Réinitialiser les filtres
              </Button>
            </div>
          </Card>
        )}

        {/* Section informative */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/10 shadow-lg">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>À propos de ce comparateur</span>
            </div>
            <h3 className="text-2xl font-bold">Trouvez votre séjour Omra idéal</h3>
            <p className="text-muted-foreground leading-relaxed">
              Les offres affichées sont automatiquement récupérées depuis plusieurs agences de voyages spécialisées dans l'organisation de séjours Omra. 
              Les prix et disponibilités sont mis à jour régulièrement pour vous garantir les informations les plus récentes. 
              Nous vous recommandons de vérifier les détails et conditions directement auprès de l'agence avant de finaliser votre réservation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Badge variant="outline" className="px-4 py-2">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Prix transparents
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Mise à jour quotidienne
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Hotel className="h-4 w-4 mr-2" />
                Toutes formules
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
