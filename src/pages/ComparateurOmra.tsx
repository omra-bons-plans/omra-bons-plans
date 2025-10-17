import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DynamicSEO } from '@/components/SEO/DynamicSEO';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, MapPin, Hotel, Clock, ExternalLink, Filter, Plane, CheckCircle2, Sparkles, Star, Building2, X, RefreshCw, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getAgencyInfo } from '@/utils/agenciesData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import heroImage from '@/assets/hero-comparateur-omra.jpg';
import { Package } from 'lucide-react';

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
  'Al Sirate Voyage': '/lovable-uploads/logoalsiratevoyage.png',
  'Alsirate Voyage': '/lovable-uploads/logoalsiratevoyage.png',
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
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [minDuration, setMinDuration] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('price_asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [offers, setOffers] = useState<any[]>([]);
  const [allOffers, setAllOffers] = useState<any[]>([]);
  const [availableAgencies, setAvailableAgencies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch last successful update info
  const { data: lastUpdate } = useQuery({
    queryKey: ['last-successful-update'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_last_successful_update');
      if (error) throw error;
      return data as {
        last_update: string | null;
        offers_count: number;
        offers_rejected: number;
        message?: string;
      };
    }
  });

  const toggleAgency = (agency: string) => {
    setSelectedAgencies(prev => {
      if (prev.includes(agency)) {
        return prev.filter(a => a !== agency);
      } else if (prev.length < 4) {
        return [...prev, agency];
      }
      return prev;
    });
  };

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
          const allData = data || [];
          setAllOffers(allData);
          
          // Extraire les agences uniques
          const agencies = Array.from(new Set(allData.map(offer => offer.agency_name).filter(Boolean)));
          setAvailableAgencies(agencies);
          
          // Filtrer par agences sélectionnées
          let filtered = selectedAgencies.length > 0 
            ? allData.filter(offer => selectedAgencies.includes(offer.agency_name))
            : allData;
          
          // Trier
          switch (sortBy) {
            case 'price_asc':
              filtered.sort((a, b) => a.price_eur - b.price_eur);
              break;
            case 'price_desc':
              filtered.sort((a, b) => b.price_eur - a.price_eur);
              break;
            case 'duration_asc':
              filtered.sort((a, b) => (a.duration_nights || 0) - (b.duration_nights || 0));
              break;
            case 'duration_desc':
              filtered.sort((a, b) => (b.duration_nights || 0) - (a.duration_nights || 0));
              break;
          }
          setOffers(filtered);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [selectedMonth, selectedCity, selectedFormula, priceRange, minDuration, maxDistance, sortBy, selectedAgencies]);

  const resetFilters = () => {
    setSelectedMonth('all');
    setSelectedCity('all');
    setSelectedFormula('all');
    setSelectedAgencies([]);
    setPriceRange([0, 10000]);
    setMinDuration('');
    setMaxDistance('');
  };

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background">
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

      {/* Hero Section avec image de fond et overlay 70% pour contraste AAA */}
      <div className="relative h-[500px] sm:h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <img 
          src={heroImage} 
          alt="Kaaba à La Mecque" 
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/70" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight animate-fade-in leading-tight max-w-5xl mx-auto">
            Comparateur Omra & Hajj 2025 - 2026
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-white mb-8 sm:mb-10 md:mb-12 animate-fade-in px-2 max-w-3xl mx-auto leading-relaxed">
            Filtrez par ville, période, budget et type de formule. Réservez auprès des agences agréées.
          </p>

          {/* Search Card - Design épuré mobile */}
          <Card className="max-w-5xl mx-auto bg-background shadow-lg animate-scale-in border-border">
            <div className="p-4 sm:p-6 md:p-8 space-y-5">
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200 dark:border-amber-900 flex items-center justify-center gap-2">
                <Package className="h-4 w-4 text-amber-700 dark:text-amber-500 flex-shrink-0" />
                <p className="text-sm font-medium text-amber-700 dark:text-amber-500 text-center leading-snug">
                  Trouvez et comparez les meilleures offres pour votre Omra & Hajj 2025 ou Omra 2026
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city-hero" className="text-xs sm:text-sm font-semibold text-foreground/80 block uppercase tracking-wide">
                    Ville de départ
                  </label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger id="city-hero" className="h-14 border-2 border-border hover:border-primary/50 transition-colors text-base">
                      <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="all" className="py-3.5">Toutes les villes</SelectItem>
                      {CITIES.map((city) => (
                        <SelectItem key={city} value={city} className="py-3.5">
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="month-hero" className="text-xs sm:text-sm font-semibold text-foreground/80 block uppercase tracking-wide">
                    Période
                  </label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger id="month-hero" className="h-14 border-2 border-border hover:border-primary/50 transition-colors text-base">
                      <SelectValue placeholder="Tous les mois" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="all" className="py-3.5">Tous les mois</SelectItem>
                      {MONTHS.map((month) => (
                        <SelectItem key={month} value={month} className="py-3.5">
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg md:text-lg rounded-xl"
                  >
                    Rechercher
                  </Button>
                </div>
              </div>
              
              {/* Last Update Info */}
              {lastUpdate && lastUpdate.last_update && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">
                      Mise à jour : {format(new Date(lastUpdate.last_update), "d MMM yyyy", { locale: fr })}
                    </span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-500 text-xs font-semibold border-green-200 dark:border-green-900">
                    {lastUpdate.offers_count} offres
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-gradient-to-b from-muted/30 to-background py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight px-2">
              Omra Bons Plans – votre comparateur de séjours Omra & Hajj au départ de tous les aéroports de France
            </h2>
            <div className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-3xl mx-auto space-y-2 sm:space-y-3 px-2">
              <p className="leading-relaxed">
                Bienvenue sur Omra Bons Plans, le comparateur pensé pour vous aider à trouver la meilleure offre Omra ou Hajj en quelques clics. Que vous prépariez votre voyage en 2025 ou 2026, que vous cherchiez une Omra pas chère ou un Hajj tout confort, notre plateforme compare pour vous les prix, services et prestations des agences agréées.
              </p>
              <p className="leading-relaxed">
                Depuis tous les aéroports de France (Paris, Lyon, Marseille, Toulouse, Nice, Nantes, Bordeaux, Lille… et plus encore), accédez instantanément à des séjours personnalisés selon vos critères : dates, budget, ville de départ, type de formule, hôtels à Makkah/Médine, vols et accompagnement francophone. Nous mettons la transparence au cœur de la recherche pour que vous choisissiez sereinement l&apos;offre qui vous ressemble.
              </p>
            </div>
          </div>

      <div className="space-y-4 md:space-y-8">

        {/* Filtres avancés */}
        <Card className="p-3 md:p-6 bg-card shadow-lg">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                Affiner votre recherche
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-xs md:text-sm"
              >
                {showFilters ? 'Masquer' : 'Afficher les filtres'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm font-medium flex items-center gap-1.5 md:gap-2">
                  <Hotel className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  Formule
                </label>
                <Select value={selectedFormula} onValueChange={setSelectedFormula}>
                  <SelectTrigger className="h-9 md:h-10 text-sm">
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
          </div>

          {showFilters && (
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-primary/10 space-y-4 md:space-y-6 animate-fade-in">
              {/* Filtre par agence */}
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs md:text-sm font-medium flex items-center gap-1.5 md:gap-2">
                    <Building2 className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    Agences (max 4)
                  </label>
                  {selectedAgencies.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedAgencies.length}/4 sélectionnées
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                  {availableAgencies.map(agency => {
                    const isSelected = selectedAgencies.includes(agency);
                    const isDisabled = !isSelected && selectedAgencies.length >= 4;
                    const agencyLogo = getAgencyLogo(agency);
                    
                    return (
                      <button
                        key={agency}
                        onClick={() => !isDisabled && toggleAgency(agency)}
                        disabled={isDisabled}
                        className={`
                          relative flex items-center gap-2 p-2 md:p-3 rounded-lg border-2 transition-all
                          ${isSelected 
                            ? 'border-primary bg-primary/10 shadow-md' 
                            : isDisabled
                              ? 'border-muted bg-muted/5 opacity-50 cursor-not-allowed'
                              : 'border-border hover:border-primary/50 hover:bg-primary/5'
                          }
                        `}
                      >
                        <Checkbox 
                          checked={isSelected}
                          disabled={isDisabled}
                          className="pointer-events-none"
                        />
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {agencyLogo && (
                            <img 
                              src={agencyLogo} 
                              alt={agency}
                              className="h-6 w-6 md:h-8 md:w-8 object-contain flex-shrink-0"
                            />
                          )}
                          <span className="text-xs md:text-sm font-medium truncate">
                            {agency}
                          </span>
                        </div>
                        {isSelected && (
                          <X 
                            className="h-3 w-3 text-primary flex-shrink-0" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAgency(agency);
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

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
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-border bg-background animate-fade-in rounded-2xl"
                >
                   {/* Header avec logo agence - Design mobile épuré */}
                  <div className="px-4 pt-4 pb-3 border-b border-border">
                    <div className="flex flex-col items-center gap-2">
                      {agencyLogo && (
                        <div className="w-16 h-16 rounded-lg bg-background border border-border overflow-hidden flex items-center justify-center p-2">
                          <img 
                            src={agencyLogo} 
                            alt={offer.agency_name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <h3 className="text-base font-semibold text-center">
                        {offer.agency_name}
                      </h3>
                    </div>
                  </div>

                  {/* Titre de l'offre */}
                  <div className="px-4 pt-3 pb-2">
                    <p className="text-base font-bold leading-snug line-clamp-2 text-foreground">
                      {offer.date_start && offer.date_end 
                        ? `Omra ${new Date(offer.date_start).toLocaleDateString('fr-FR', { month: 'long' })} - ${offer.duration_nights} nuits`
                        : `Omra ${offer.month_departure} - ${offer.duration_nights} nuits`
                      }
                    </p>
                  </div>

                  {/* Prix en évidence - Mobile first */}
                  <div className="px-4 py-3 bg-amber-50 dark:bg-amber-950/20">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[22px] font-bold text-primary">
                        {offer.price_eur}€
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">/pers</span>
                    </div>
                  </div>

                  {/* Détails en phrases - Mobile friendly */}
                  <div className="px-4 py-3 space-y-2.5 text-sm leading-relaxed">
                    <p className="text-foreground">
                      <span className="font-semibold">Départ {offer.departure_city}</span>
                      {offer.date_start && offer.date_end && (
                        <>, {new Date(offer.date_start).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}, {offer.duration_nights} nuits</>
                      )}
                    </p>
                    
                    {(offer.makkah_nights || offer.medina_nights) && (
                      <p className="text-foreground">
                        <span className="font-semibold">{offer.makkah_nights}N Makkah / {offer.medina_nights}N Médine</span> — hôtels si dispo
                      </p>
                    )}
                    
                    {offer.airline && (
                      <p className="text-foreground">
                        <span className="font-semibold">Compagnie :</span> {offer.airline}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="px-4 pb-3">
                    <div className="flex flex-wrap gap-2">
                      {offer.flights_included && (
                        <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 text-xs font-medium px-2 py-0.5">
                          Vol inclus
                        </Badge>
                      )}
                      {offer.visa_included && (
                        <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-900 text-xs font-medium px-2 py-0.5">
                          Visa inclus
                        </Badge>
                      )}
                      <Badge className={`text-xs font-medium px-2 py-0.5 capitalize ${
                        offer.formula_type?.toLowerCase() === 'essentiel' 
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900' 
                          : 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-200 dark:border-purple-900'
                      }`}>
                        {offer.formula_type}
                      </Badge>
                    </div>
                  </div>

                  {/* CTA Button - Pleine largeur mobile */}
                  <div className="px-4 pb-4">
                    <Button 
                      asChild 
                      className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-xl"
                    >
                      <a href={offer.offer_url} target="_blank" rel="noopener noreferrer nofollow sponsored" className="flex items-center justify-center gap-2">
                        <span>Voir l'offre</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center border-border bg-background">
            <div className="max-w-md mx-auto space-y-4">
              <p className="text-muted-foreground text-base">
                Aucune offre ne correspond à vos critères. Essayez d'élargir la période ou le budget.
              </p>
              <Button variant="outline" onClick={resetFilters} className="mt-4 h-12">
                Réinitialiser
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

        {/* Section Pourquoi utiliser notre comparateur */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Pourquoi utiliser notre comparateur Omra ?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover-scale">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Gain de temps considérable</h3>
                <p className="text-muted-foreground">
                  Plus besoin de consulter des dizaines de sites d'agences. Notre comparateur regroupe toutes les offres Omra 2025 et 2026 en un seul endroit. Filtrez par prix, date de départ, ville, formule et trouvez instantanément le séjour qui vous convient.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover-scale">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Meilleurs prix garantis</h3>
                <p className="text-muted-foreground">
                  Comparez les tarifs de multiples agences agréées pour la Omra. Notre système vous permet d'identifier rapidement les meilleures offres et de réaliser des économies importantes sur votre pèlerinage.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover-scale">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Hotel className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Toutes les formules disponibles</h3>
                <p className="text-muted-foreground">
                  Que vous recherchiez une formule économique ou un séjour confort proche du Haram, notre comparateur affiche tous les types d'hébergements. Filtrez par distance au Haram, nombre d'étoiles et prestations incluses.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover-scale">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Flexibilité des dates</h3>
                <p className="text-muted-foreground">
                  Recherchez des départs toute l'année selon votre disponibilité. Notre outil vous permet de comparer les offres par mois et de choisir la période la plus avantageuse pour votre Omra, hors vacances scolaires ou pendant Ramadan.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Section Comment ça marche */}
        <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">Comment fonctionne notre comparateur ?</h2>
              <p className="text-muted-foreground text-lg">
                Trouvez votre voyage Omra idéal en 3 étapes simples
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Définissez vos critères de recherche</h3>
                  <p className="text-muted-foreground">
                    Sélectionnez votre mois de départ préféré, votre ville d'origine (Paris, Lyon, Marseille, etc.), votre budget et le type de formule souhaité (Essentiel ou Confort). Affinez avec nos filtres avancés : durée du séjour, distance au Haram, agences spécifiques.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Comparez les offres en temps réel</h3>
                  <p className="text-muted-foreground">
                    Notre système affiche instantanément toutes les offres correspondant à vos critères. Vous pouvez trier par prix croissant/décroissant ou par durée de séjour. Chaque offre détaille le prix, les dates, les hôtels à La Mecque et Médine, la compagnie aérienne et les prestations incluses.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Réservez directement auprès de l'agence</h3>
                  <p className="text-muted-foreground">
                    Une fois votre choix effectué, cliquez sur "Voir l'offre" pour accéder au site de l'agence. Vous serez redirigé vers la page de réservation officielle où vous pourrez finaliser votre inscription en toute sécurité et obtenir tous les détails complémentaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Section FAQ */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Questions fréquentes sur le comparateur Omra</h2>
          
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Quelles agences sont référencées sur le comparateur ?</h3>
              <p className="text-muted-foreground">
                Nous référençons les principales agences de voyages françaises spécialisées dans l'organisation de séjours Omra, notamment Tawaf, Medinvoyages, Almaqam, Pèlerin Hajj, Al Bayt, Hayat, Omra Sounnah, Omra Pour Tous et Sabil Voyages. Toutes sont agréées et reconnues pour leur sérieux et leur expérience dans le pèlerinage.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Les prix affichés sont-ils définitifs ?</h3>
              <p className="text-muted-foreground">
                Les prix sont mis à jour quotidiennement et reflètent les tarifs officiels des agences au moment de l'extraction. Cependant, ils peuvent évoluer selon la disponibilité et les périodes. Nous vous recommandons de vérifier le prix final directement sur le site de l'agence avant de réserver.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Quelle différence entre formule Essentiel et Confort ?</h3>
              <p className="text-muted-foreground">
                La formule Essentiel propose généralement des hôtels 3 étoiles situés à distance raisonnable du Haram (500m à 1km), idéale pour les petits budgets. La formule Confort offre des hôtels 4-5 étoiles très proches du Haram (50m à 300m), avec plus de prestations et de standing. Le choix dépend de votre budget et de vos priorités.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Puis-je réserver directement sur ce site ?</h3>
              <p className="text-muted-foreground">
                Non, notre site est un comparateur qui vous permet de trouver les meilleures offres. La réservation se fait directement auprès de l'agence de voyages en cliquant sur "Voir l'offre". Vous serez redirigé vers le site officiel de l'agence pour finaliser votre inscription.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Comment choisir la meilleure période pour partir en Omra ?</h3>
              <p className="text-muted-foreground">
                La période idéale dépend de vos contraintes personnelles et de votre budget. Le mois de Ramadan est très prisé mais plus cher et très fréquenté. Les mois hors vacances scolaires (septembre à novembre, janvier à mars hors vacances) offrent généralement les meilleurs tarifs et une affluence plus modérée. L'été (juin-août) peut être très chaud.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Qu'est-ce qui est généralement inclus dans le prix ?</h3>
              <p className="text-muted-foreground">
                La plupart des forfaits Omra incluent les vols aller-retour depuis la France, l'hébergement en pension complète ou demi-pension, les transferts aéroport-hôtel, le visa saoudien, et l'assurance de base. Certaines agences ajoutent des excursions, la visite de sites historiques ou un accompagnement religieux. Vérifiez toujours les détails de l'offre.
              </p>
            </Card>
          </div>
        </div>

        {/* Section à propos de la Omra */}
        <Card className="p-8 md:p-12 bg-gradient-to-br from-background via-primary/5 to-background">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center">Préparez votre Omra 2025-2026</h2>
            
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                La Omra, également appelée "petit pèlerinage", est un acte d'adoration majeur en Islam que les musulmans peuvent effectuer à tout moment de l'année, contrairement au Hajj qui a des dates fixes. Accomplir la Omra est une expérience spirituelle profonde qui permet de se rapprocher d'Allah, de demander pardon pour ses péchés et de renouveler sa foi.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Pourquoi partir en Omra organisée ?</h3>
              <p>
                Partir avec une agence spécialisée présente de nombreux avantages : prise en charge complète des aspects logistiques (visa, vols, hébergement, transferts), accompagnement religieux par des guides francophones expérimentés, organisation de visites des lieux saints et historiques, et sérénité d'esprit pour se concentrer pleinement sur la dimension spirituelle du voyage.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Quand réserver son séjour Omra ?</h3>
              <p>
                Il est recommandé de réserver votre Omra 3 à 6 mois à l'avance, surtout pour les périodes prisées comme Ramadan, les vacances scolaires ou les mois de décembre-janvier. Une réservation anticipée vous garantit un meilleur choix d'hôtels, de dates de départ et souvent des tarifs plus avantageux. Utilisez notre comparateur pour surveiller les prix et saisir les meilleures opportunités.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Les villes de départ en France</h3>
              <p>
                Notre comparateur référence des départs depuis les principales villes françaises : Paris (aéroports Charles de Gaulle et Orly), Lyon, Marseille, Toulouse, Nice, Nantes, Strasbourg, Bordeaux et Lille. Les vols directs sont généralement disponibles depuis Paris avec des compagnies comme Saudi Arabian Airlines, tandis que les autres villes proposent souvent des vols avec escale via Istanbul, Dubaï ou Doha.
              </p>
             </div>
           </div>
         </Card>
       </div>
      </div>
     </div>
    </div>
    </ResponsiveLayout>
  );
}
