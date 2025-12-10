import { useState, useEffect, lazy, Suspense } from 'react';
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
import { 
  Calendar, MapPin, Hotel, Clock, ExternalLink, Filter, Plane, 
  CheckCircle2, Sparkles, Star, Building2, X, RefreshCw, Mail, 
  List, Grid3x3, Send, Package 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { OptimizedHeroImage } from '@/components/ui/OptimizedHeroImage';
import { OffersPagination } from '@/components/ui/OffersPagination';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { InternalLinks } from '@/components/SEO/InternalLinks';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { z } from 'zod';

// ⚡ LAZY LOAD: Composants non-critiques pour réduire le bundle initial
const FilterForm = lazy(() => import('@/components/ui/FilterForm').then(m => ({ default: m.FilterForm })));
const CompactOfferCard = lazy(() => import('@/components/mobile/CompactOfferCard').then(m => ({ default: m.CompactOfferCard })));
const LazyAgencyLogo = lazy(() => import('@/components/ui/LazyAgencyLogo').then(m => ({ default: m.LazyAgencyLogo })));
const HajjNewsletterForm = lazy(() => import('@/components/forms/HajjNewsletterForm').then(m => ({ default: m.HajjNewsletterForm })));

// ⚡ Hide pre-render hero immediately when component mounts
if (typeof window !== 'undefined' && window.__HIDE_PRERENDER__) {
  window.__HIDE_PRERENDER__();
}

const MONTHS = [
  'Ramadan', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const FORMULA_TYPES = ['Essentiel', 'Confort'];
const CITIES = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux', 'Lille'];

const AGENCY_LOGOS: Record<string, string> = {
  'Medinvoyages': '/lovable-uploads/logomedinvoyages.webp',
  'Almaqam': '/lovable-uploads/logoalmaqam.png',
  'Pelerinhajj': '/lovable-uploads/logopelerinhajj.webp',
  'Pelerin': '/lovable-uploads/logopelerinhajj.webp',
  'Al Bayt': '/lovable-uploads/logoalbayt.webp',
  'Hayat': '/lovable-uploads/logohayat.webp',
  'Omra Sounnah': '/lovable-uploads/logoomrasounnah.webp',
  'Omra Pour Tous': '/lovable-uploads/logoomrapourtous.webp',
  'Omra Discount': '/lovable-uploads/logoomradiscount.png',
  'Sabil': '/lovable-uploads/logosabile.webp',
  'Sabil Voyages': '/lovable-uploads/logosabile-optimized.webp',
  'Tawaf': '/lovable-uploads/logotawaf.webp',
  'Al Sirate Voyage': '/lovable-uploads/logoalsirate.webp',
  'Alsirate Voyage': '/lovable-uploads/logoalsirate.webp',
  'Gateway-travel': '/lovable-uploads/logogatewaytravel.webp',
  'Gateway travel': '/lovable-uploads/logogatewaytravel.webp',
  'Gatewaytravel': '/lovable-uploads/logogatewaytravel.webp',
  'Labbayk': '/lovable-uploads/logo-labayk-optimized.webp',
  'OMRA GATE': '/lovable-uploads/logoomragate.webp',
  'Omra Gate': '/lovable-uploads/logoomragate.webp',
  'OmraGate': '/lovable-uploads/logoomragate.webp',
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

// Fonction pour extraire le nombre d'étoiles depuis le nom de l'hôtel
const extractStarsFromHotel = (hotelName: string | null): number => {
  if (!hotelName) return 3; // Par défaut 3 étoiles
  
  // Recherche de patterns comme "5 étoiles", "(5 étoiles)", "5*", etc.
  const starsMatch = hotelName.match(/(\d)\s*(?:étoiles?|\*)/i);
  if (starsMatch) {
    return parseInt(starsMatch[1]);
  }
  
  // Si pas de match, retourner 3 par défaut
  return 3;
};

// Fonction pour nettoyer le nom de l'hôtel (enlever les étoiles)
const cleanHotelName = (hotelName: string | null): string => {
  if (!hotelName) return '';
  return hotelName.replace(/\s*\(?\d\s*étoiles?\)?/gi, '').trim();
};

const agencyFormSchema = z.object({
  agencyName: z.string().trim().min(2, { message: "Le nom de l'agence est requis" }).max(100, { message: "Le nom de l'agence doit faire moins de 100 caractères" }),
  contactName: z.string().trim().min(2, { message: "Votre nom est requis" }).max(100, { message: "Le nom doit faire moins de 100 caractères" }),
  email: z.string().trim().email({ message: "Email invalide" }).max(255, { message: "L'email doit faire moins de 255 caractères" }),
  phone: z.string().trim().min(10, { message: "Numéro de téléphone invalide" }).max(20, { message: "Le téléphone doit faire moins de 20 caractères" }),
  message: z.string().trim().min(10, { message: "Le message doit faire au moins 10 caractères" }).max(1000, { message: "Le message doit faire moins de 1000 caractères" })
});

export default function ComparateurOmra() {
  const [tripType, setTripType] = useState<'omra' | 'hajj'>('omra');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedFormula, setSelectedFormula] = useState<string>('all');
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(10000);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [maxDuration, setMaxDuration] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date_asc');
  const [showFilters, setShowFilters] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'cards' | 'compact'>('compact');
  const [desktopViewMode, setDesktopViewMode] = useState<'cards' | 'list'>('list');
  
  // ⚡ PAGINATION: Réduire nombre d'offres chargées initialement
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = window.innerWidth < 768 ? 8 : 12; // 8 mobile, 12 desktop

  const [offers, setOffers] = useState<any[]>([]);
  const [allOffers, setAllOffers] = useState<any[]>([]);
  const [availableAgencies, setAvailableAgencies] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulaire agence
  const [agencyForm, setAgencyForm] = useState({
    agencyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ⚡ LCP OPTIMIZATION: Defer non-critical queries with staleTime
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
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
  });

  // ⚡ DEFERRED: Agencies data with long cache
  const { data: agenciesFromDb } = useQuery({
    queryKey: ['agencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agencies')
        .select('name, google_rating, review_count, url, strengths, weaknesses, specialties, price_range, highlight');
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes cache
    gcTime: 1000 * 60 * 60, // 1 hour garbage collection
  });

  // Helper function to get agency info from database
  const getAgencyInfo = (agencyName: string) => {
    if (!agenciesFromDb) return null;
    const agency = agenciesFromDb.find(a => a.name === agencyName);
    if (!agency) return null;
    return {
      name: agency.name,
      url: agency.url,
      googleRating: agency.google_rating,
      reviewCount: agency.review_count,
      strengths: agency.strengths,
      weaknesses: agency.weaknesses,
      specialties: agency.specialties,
      priceRange: agency.price_range,
      highlight: agency.highlight
    };
  };

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

  // Fetch offers effect - avec valeurs stables et timeout
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    let loadingStarted = false;
    
    const fetchOffers = async () => {
      const currentPriceMin = priceMin;
      const currentPriceMax = priceMax;
      
      try {
        if (isMounted) {
          setIsLoading(true);
          loadingStarted = true;
        }
        setError(null);
        
        // ⚡ TIMEOUT: Force stop loading after 5 seconds (reduced from 10)
        timeoutId = setTimeout(() => {
          if (isMounted && loadingStarted) {
            console.warn('⚠️ Offers loading timeout - forcing completion');
            setIsLoading(false);
          }
        }, 5000);
        
        console.log('🔍 Filtres actifs:', {
          selectedMonth,
          selectedCity,
          selectedFormula,
          priceMin: currentPriceMin,
          priceMax: currentPriceMax,
          maxDuration,
          selectedAgencies,
          tripType
        });
        
        // Récupérer TOUTES les offres actives pour calculer les options disponibles
        const { data: allActiveOffers, error: allOffersError } = await supabase
          .from('omra_offers')
          .select('*')
          .eq('status', 'active');

        if (allOffersError) {
          console.error('Erreur de chargement:', allOffersError);
          if (isMounted) {
            setError(allOffersError.message);
            setOffers([]);
            setAllOffers([]);
            setIsLoading(false);
          }
          return;
        }

        const allData = allActiveOffers || [];
        if (isMounted) setAllOffers(allData);
        
        // Calculer le prix maximum des offres (seulement au premier chargement)
        if (allData.length > 0) {
          const maxPriceValue = Math.max(...allData.map(offer => offer.price_eur || 0));
          const roundedMax = Math.ceil(maxPriceValue / 100) * 100;
          if (roundedMax !== maxPrice && isMounted) {
            setMaxPrice(roundedMax);
          }
        }
        
        // Extraire les agences uniques depuis TOUTES les offres
        const agencies = Array.from(new Set(allData.map(offer => offer.agency_name).filter(Boolean)));
        if (isMounted) setAvailableAgencies(agencies);
        
        // Extraire les villes disponibles depuis TOUTES les offres
        const allCities = Array.from(new Set(allData.map(offer => offer.departure_city?.trim()).filter(Boolean)));
        if (isMounted) setAvailableCities(allCities.sort());
        
        // Extraire les mois disponibles depuis TOUTES les offres
        const allMonths = Array.from(new Set(allData.map(offer => offer.month_departure).filter(Boolean)));
        if (isMounted) setAvailableMonths(allMonths);
        
        // Filtrer les offres pour l'affichage
        let filtered = allData;
        
        // Appliquer les filtres
        if (selectedMonth && selectedMonth !== 'all') {
          filtered = filtered.filter(offer => offer.month_departure === selectedMonth);
        }
        if (selectedCity && selectedCity !== 'all') {
          filtered = filtered.filter(offer => offer.departure_city === selectedCity);
        }
        if (selectedFormula && selectedFormula !== 'all') {
          filtered = filtered.filter(offer => offer.formula_type === selectedFormula.toLowerCase());
        }
        if (currentPriceMin > 0) {
          filtered = filtered.filter(offer => offer.price_eur >= currentPriceMin);
        }
        if (currentPriceMax < 10000) {
          filtered = filtered.filter(offer => offer.price_eur <= currentPriceMax);
        }
        if (maxDuration) {
          filtered = filtered.filter(offer => offer.duration_nights <= parseInt(maxDuration));
        }
        
        // Filtrer par agences sélectionnées
        if (selectedAgencies.length > 0) {
          filtered = filtered.filter(offer => selectedAgencies.includes(offer.agency_name));
        }
        
        console.log('🏢 Après filtre agences:', { count: filtered.length, selectedAgencies });
        
        // Filtrer par durée de séjour Hajj
        if (tripType === 'hajj' && selectedDuration && selectedDuration !== 'all') {
          const durationText = selectedDuration === 'court' ? 'Court séjour' : 'Long séjour';
          filtered = filtered.filter(offer => 
            offer.notes?.includes(durationText)
          );
        }
        
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
          case 'date_asc':
            filtered.sort((a, b) => {
              const dateA = a.date_start ? new Date(a.date_start).getTime() : Infinity;
              const dateB = b.date_start ? new Date(b.date_start).getTime() : Infinity;
              return dateA - dateB;
            });
            break;
          default:
            // Tri par défaut : date de départ la plus proche
            filtered.sort((a, b) => {
              const dateA = a.date_start ? new Date(a.date_start).getTime() : Infinity;
              const dateB = b.date_start ? new Date(b.date_start).getTime() : Infinity;
              return dateA - dateB;
            });
        }
        
        console.log('✅ Offres finales affichées:', filtered.length);
        if (isMounted) setOffers(filtered);
      } catch (err: any) {
        console.error('❌ Erreur critique:', err);
        if (isMounted) {
          setError(err.message || 'Une erreur est survenue');
          setOffers([]);
          setAllOffers([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchOffers();
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [selectedMonth, selectedCity, selectedFormula, priceMin, priceMax, maxDuration, sortBy, selectedAgencies.length, tripType, selectedDuration]);

  // ⚡ PAGINATION: Calculer offres paginées
  const totalPages = Math.ceil(offers.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedOffers = offers.slice(startIdx, endIdx);

  // Reset page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedCity, selectedFormula, priceMin, priceMax, maxDuration, sortBy, selectedAgencies, tripType]);

  // Scroll vers la liste des offres quand la page change
  useEffect(() => {
    if (currentPage > 1) {
      const offersListElement = document.getElementById('offers-list');
      if (offersListElement) {
        offersListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentPage]);

  // Mettre à jour priceMax quand maxPrice change (seulement au premier chargement)
  useEffect(() => {
    if (isInitialLoad && maxPrice !== 10000 && priceMax === 10000) {
      setPriceMax(maxPrice);
      setIsInitialLoad(false);
    }
  }, [maxPrice]);

  const resetFilters = () => {
    setSelectedMonth('all');
    setSelectedCity('all');
    setSelectedFormula('all');
    setSelectedAgencies([]);
    setSelectedDuration('all');
    setPriceMin(0);
    setPriceMax(maxPrice);
    setMaxDuration('');
  };

  const handleAgencyFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = agencyFormSchema.parse(agencyForm);
      
      // Séparer le nom complet en prénom et nom
      const nameParts = validatedData.contactName.trim().split(' ');
      const prenom = nameParts[0] || '';
      const nom = nameParts.slice(1).join(' ') || nameParts[0];
      
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          nom: nom,
          prenom: prenom,
          mail: validatedData.email,
          message: `Demande d'apparition dans le comparateur\n\nAgence: ${validatedData.agencyName}\nContact: ${validatedData.contactName}\nTéléphone: ${validatedData.phone}\n\nMessage:\n${validatedData.message}`
        }
      });

      if (error) throw error;

      toast.success('Votre demande a été envoyée avec succès !');
      setAgencyForm({
        agencyName: '',
        contactName: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Erreur lors de l\'envoi du message');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background">
      <DynamicSEO
        title="Comparateur Séjours Omra & Hajj 2026"
        description="Trouvez, comparez et réservez votre séjour pour la Omra au meilleur prix parmi des centaines d'offres"
        keywords={['omra', 'comparateur omra', 'séjour omra', 'meilleur prix omra']}
        path="/"
      />
      
      <SEOBreadcrumb
        items={[
          { name: 'Accueil', url: '/' }
        ]}
      />

      {/* ⚡ Hero Section - Optimisé LCP avec dimensions fixes */}
      <div 
        className="hero-container relative flex items-center justify-center"
        style={{ 
          height: 'clamp(400px, 100svh, 900px)',
          marginTop: 0,
          contain: 'layout style paint'
        }}
      >
        {/* ⚡ Image LCP - Priorité maximale */}
        <OptimizedHeroImage 
          mobileWidth={750}
          mobileHeight={500}
          desktopWidth={1600}
          desktopHeight={500}
        />
        
        {/* Overlay simple - pas de backdrop-filter pour perfs */}
        <div className="hero-overlay" />
        
        {/* ⚡ Contenu texte - rendu immédiat */}
        <div className="relative z-10 container mx-auto px-4 text-center" style={{ contentVisibility: 'auto' }}>
          <h1 className="font-bold tracking-tight leading-tight px-2 mb-4">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg font-extrabold">Omra Bons Plans</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mt-3">Votre comparateur de séjours Omra & Hajj 2026</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl font-semibold text-white/95 mb-2 px-4">
            Le seul comparateur français pour la Omra et le Hajj
          </p>
          <p className="text-sm sm:text-base md:text-lg text-white/90 px-4 leading-relaxed max-w-3xl mx-auto">
            Trouvez et réservez votre séjour au meilleur prix
          </p>
        </div>
      </div>

      {/* Search Card - positioned below hero */}
      <div className="container mx-auto px-4 -mt-16 sm:-mt-20 relative z-20 mb-8">
        <Card className="max-w-5xl mx-auto bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-sm shadow-2xl border-2 border-primary/10 animate-scale-in overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
          
          <div className="relative p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            <div className="flex items-center justify-center text-primary bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20 shadow-sm">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-center leading-snug bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Trouvez et comparez les meilleures offres pour votre Omra & Hajj 2026
              </p>
            </div>

            {/* ⚡ Filter Form with Suspense fallback */}
            <Suspense fallback={
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            }>
              <FilterForm
                tripType={tripType}
                setTripType={setTripType}
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedDuration={selectedDuration}
                setSelectedDuration={setSelectedDuration}
                availableCities={availableCities}
                availableMonths={availableMonths}
              />
            </Suspense>
            
            {/* Last Update Info */}
            {lastUpdate && lastUpdate.last_update && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-muted-foreground pt-3 border-t">
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="h-3 w-3" />
                  <span className="text-center">
                    Mise à jour : {format(new Date(lastUpdate.last_update), "d MMM yyyy", { locale: fr })}
                  </span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-700 text-xs">
                  {lastUpdate.offers_count} offres
                </Badge>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Main Content Section */}
      <div className="bg-gradient-to-b from-muted/30 to-background pt-10 pb-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight px-2">
              Omra Bons Plans – votre comparateur de séjours Omra & Hajj au départ de tous les aéroports de France
            </h2>
            <div className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-3xl mx-auto space-y-2 sm:space-y-3 px-2">
              <p className="leading-relaxed">
                Bienvenue sur Omra Bons Plans, le comparateur pensé pour vous aider à trouver la meilleure offre Omra ou Hajj en quelques clics. Que vous prépariez votre voyage en 2026, que vous cherchiez une Omra pas chère ou un Hajj tout confort, notre plateforme compare pour vous les prix, services et prestations des agences agréées.
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
                              className="h-6 w-6 md:h-8 md:w-8 object-cover flex-shrink-0 rounded-lg"
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
                    <span className="text-primary font-bold text-xs md:text-sm">{priceMin}€ - {priceMax}€</span>
                  </label>
                  <Slider
                    min={0}
                    max={maxPrice}
                    step={100}
                    value={[priceMin, priceMax]}
                    onValueChange={(values) => { setPriceMin(values[0]); setPriceMax(values[1]); }}
                    className="py-3 md:py-4"
                  />
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-medium flex items-center gap-1.5 md:gap-2">
                    <Clock className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    Durée maximum (nuits)
                  </label>
                  <Input
                    type="number"
                    placeholder="Ex: 15"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(e.target.value)}
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
              <SelectItem value="date_asc">📅 Date la plus proche</SelectItem>
              <SelectItem value="price_asc">💰 Prix croissant</SelectItem>
              <SelectItem value="price_desc">💎 Prix décroissant</SelectItem>
              <SelectItem value="duration_asc">⏱️ Durée croissante</SelectItem>
              <SelectItem value="duration_desc">📅 Durée décroissante</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {tripType === 'hajj' ? (
          <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:w-20 rounded-full bg-primary/10 mb-4">
                <Calendar className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Offres Hajj 2026
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Les offres pour le Hajj ne sont pas encore disponibles. Nous vous invitons à revenir début janvier 2026 pour découvrir et comparer toutes les offres Hajj des agences agréées.
              </p>
              <Badge variant="outline" className="mt-4 text-sm px-4 py-2">
                Disponible à partir de janvier 2026
              </Badge>
              
              {/* Image des providers Nusuk */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-foreground font-semibold text-base md:text-lg mb-3">
                  Voici les 12 providers qui proposeront très prochainement leurs offres "Hajj 2026" sur la plateforme Nusuk
                </p>
                <p className="text-muted-foreground text-sm md:text-base mb-6">
                  Pensez à mettre de l'argent sur votre compte Nusuk pour être prêt lors de l'ouverture des ventes !
                </p>
                <div className="rounded-xl overflow-hidden border-2 border-border/50 shadow-lg">
                  <img 
                    src="/images/hajj-providers-nusuk.png"
                    alt="Les 12 providers Hajj 2026 sur la plateforme Nusuk"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </div>
              
              {/* Newsletter Subscription Form */}
              <Suspense fallback={<div className="animate-pulse h-32 bg-muted/20 rounded-lg" />}>
                <HajjNewsletterForm />
              </Suspense>
            </div>
          </Card>
        ) : error ? (
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
          <div id="offers-list">
            {/* Toggle d'affichage mobile */}
            <div className="md:hidden flex items-center justify-between mb-4 px-2">
              <span className="text-sm font-medium text-muted-foreground">
                {offers.length} offre{offers.length > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                <Button
                  variant={mobileViewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMobileViewMode('cards')}
                  className="h-8 px-3"
                >
                  <Grid3x3 className="h-4 w-4 mr-1.5" />
                  <span className="text-xs">Cartes</span>
                </Button>
                <Button
                  variant={mobileViewMode === 'compact' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMobileViewMode('compact')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4 mr-1.5" />
                  <span className="text-xs">Liste</span>
                </Button>
              </div>
            </div>

            {/* Toggle desktop/tablette uniquement */}
            <div className="hidden md:flex items-center justify-between mb-6 px-2">
              <span className="text-base font-medium text-muted-foreground">
                {offers.length} offre{offers.length > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                <Button
                  variant={desktopViewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDesktopViewMode('cards')}
                  className="h-9 px-4"
                >
                  <Grid3x3 className="h-4 w-4 mr-2" />
                  <span className="text-sm">Cartes</span>
                </Button>
                <Button
                  variant={desktopViewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDesktopViewMode('list')}
                  className="h-9 px-4"
                >
                  <List className="h-4 w-4 mr-2" />
                  <span className="text-sm">Liste</span>
                </Button>
              </div>
            </div>

            {/* Vue compacte (mobile uniquement) */}
            <div className={mobileViewMode === 'compact' ? 'md:hidden space-y-3' : 'hidden'}>
              {paginatedOffers.map((offer) => {
                const agencyLogo = getAgencyLogo(offer.agency_name);
                const agencyInfo = getAgencyInfo(offer.agency_name);
                return (
                  <CompactOfferCard
                    key={offer.id}
                    offer={offer}
                    agencyLogo={agencyLogo}
                    agencyInfo={agencyInfo}
                  />
                );
              })}
            </div>

            {/* Vue cartes (mobile en mode cards + desktop en mode cards) */}
            <div className={
              mobileViewMode === 'cards' 
                ? `grid grid-cols-1 gap-6 ${desktopViewMode === 'cards' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:hidden'}` 
                : `hidden ${desktopViewMode === 'cards' ? 'md:grid md:grid-cols-2 lg:grid-cols-3' : ''} gap-6`
            }>
              {paginatedOffers.map((offer) => {
                  const agencyLogo = getAgencyLogo(offer.agency_name);
                  const agencyInfo = getAgencyInfo(offer.agency_name);
              
              return (
                <Card 
                  key={offer.id} 
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 md:hover:-translate-y-2 border-primary/10 bg-card/80 backdrop-blur-sm hover:border-primary/30 animate-fade-in relative"
                >
                  {/* Bouton Favoris en overlay - repositionné en haut à gauche */}
                  <div className="absolute top-3 left-3 z-20">
                    <div className="bg-background/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-border/50 hover:scale-110 transition-transform">
                      <FavoriteButton offerId={offer.id} variant="icon" />
                    </div>
                  </div>
                  
                   {/* Header avec logo agence */}
                  <div className="px-3 md:px-6 pt-3 md:pt-6 pb-3 md:pb-4 border-b border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-background relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="flex flex-col items-center gap-2 md:gap-4 relative">
                      {agencyLogo && (
                        <div className="flex-shrink-0 w-full h-56 md:h-72 lg:h-64 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow flex items-center justify-center bg-white/80 dark:bg-gray-900/50 p-4 md:p-6 relative">
                          <LazyAgencyLogo 
                            src={agencyLogo} 
                            alt={offer.agency_name}
                            agencyName={offer.agency_name}
                            className="w-full h-full"
                          />
                          {offer.is_complet && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                              <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-2 border-white font-black px-6 md:px-8 py-3 md:py-4 text-xl md:text-3xl shadow-2xl transform rotate-[-5deg] animate-pulse">
                                ❌ COMPLET
                              </Badge>
                            </div>
                          )}
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
                    <div className="flex flex-col gap-1 relative text-center">
                      <span className="text-xs md:text-sm text-muted-foreground font-medium">Prix en chambre quadruple</span>
                      <div className="flex flex-col md:flex-row items-center justify-center md:items-baseline gap-1 md:gap-2">
                        <span className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                          {Number(offer.price_eur).toLocaleString('fr-FR')}€
                        </span>
                        <span className="text-xs md:text-sm text-muted-foreground font-medium">/ personne</span>
                      </div>
                    </div>
                  </div>

                  {/* Corps de la carte */}
                  <div className="p-3 md:p-6 space-y-3 md:space-y-4">
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {offer.is_recommended && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 hover:from-yellow-500 hover:to-amber-600 font-black px-3 md:px-5 py-1.5 md:py-2.5 text-sm md:text-lg shadow-xl animate-pulse">
                          ⭐ RECOMMANDÉ
                        </Badge>
                      )}
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
                        
                        {offer.airline && (
                          <div className="flex items-center gap-2 md:gap-3">
                            <Plane className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                            <div>
                              <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide">Compagnie</div>
                              <div className="text-sm md:text-base font-semibold text-foreground">{offer.airline}</div>
                            </div>
                          </div>
                        )}
                        
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
                                  <div className="text-sm md:text-base font-semibold text-foreground mb-1">{offer.hotel_makkah}</div>
                                  {offer.hotel_makkah_stars && (
                                    <div className="flex items-center gap-0.5 md:gap-1">
                                      {[...Array(offer.hotel_makkah_stars)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                                      ))}
                                    </div>
                                  )}
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
                                  <div className="text-sm md:text-base font-semibold text-foreground mb-1">{offer.hotel_medinah}</div>
                                  {offer.hotel_medina_stars && (
                                    <div className="flex items-center gap-0.5 md:gap-1">
                                      {[...Array(offer.hotel_medina_stars)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer avec boutons */}
                  <div className="px-3 md:px-6 pb-3 md:pb-6 pt-1 md:pt-2 space-y-2">
                    <Button 
                      asChild 
                      className="w-full h-9 md:h-10 group/btn bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-xl transition-all duration-300 text-sm md:text-base"
                    >
                      <a href={offer.offer_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 md:gap-2">
                        <span className="font-semibold">Voir l'offre</span>
                        <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                      </a>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline"
                      className="w-full h-9 md:h-10 text-sm md:text-base"
                    >
                      <a href="https://omrabonsplans.fr/agences-liste" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 md:gap-2">
                        <span>Voir le comparatif d'agences</span>
                      </a>
                    </Button>
                  </div>
                </Card>
                );
              })}
            </div>

            {/* Vue liste (desktop/tablette uniquement) */}
            <div className={`hidden ${desktopViewMode === 'list' ? 'md:block' : ''} space-y-4`}>
              {offers.map((offer) => {
                const agencyLogo = getAgencyLogo(offer.agency_name);
                const agencyInfo = getAgencyInfo(offer.agency_name);
                
                return (
                  <Card 
                    key={offer.id} 
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-primary/10 bg-card/80 backdrop-blur-sm hover:border-primary/30 relative"
                  >
                    {/* Bouton Favoris en overlay - repositionné en haut à gauche */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className="bg-background/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-border/50 hover:scale-110 transition-transform">
                        <FavoriteButton offerId={offer.id} variant="icon" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row">
                      {/* Logo et agence */}
                      <div className="sm:w-48 lg:w-56 flex-shrink-0 p-4 border-b sm:border-b-0 sm:border-r border-primary/10 bg-gradient-to-br from-primary/5 to-background">
                        {agencyLogo && (
                          <div className="h-32 rounded-lg overflow-hidden shadow-sm flex items-center justify-center bg-white/80 dark:bg-gray-900/50 p-3 relative">
                            <img 
                              src={agencyLogo} 
                              alt={offer.agency_name}
                              className="w-full h-full object-contain"
                            />
                            {offer.is_complet && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                                <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-2 border-white font-black px-3 py-1 text-sm shadow-xl">
                                  ❌ COMPLET
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-center mt-3 group-hover:text-primary transition-colors">
                          {offer.agency_name}
                        </h3>
                        {agencyInfo && (
                          <div className="flex items-center justify-center gap-1 mt-2">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(agencyInfo.googleRating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'fill-gray-300 text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground">
                              {agencyInfo.googleRating.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({agencyInfo.reviewCount})
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Détails de l'offre */}
                      <div className="flex-1 p-4 lg:p-6">
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                          {/* Infos principales */}
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {offer.is_recommended && (
                                <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 hover:from-yellow-500 hover:to-amber-600 font-black px-4 py-1.5 text-base shadow-xl animate-pulse">
                                  ⭐ RECOMMANDÉ
                                </Badge>
                              )}
                              <Badge 
                                className={`font-bold px-3 py-1 capitalize shadow-md ${
                                  offer.formula_type?.toLowerCase() === 'essentiel' 
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                                }`}
                              >
                                ✨ {offer.formula_type}
                              </Badge>
                              {offer.flights_included && (
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
                                  <Plane className="h-3 w-3 mr-1" />
                                  Vol inclus
                                </Badge>
                              )}
                              {offer.visa_included && (
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/30">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Visa inclus
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                                <div>
                                  <div className="text-xs text-muted-foreground">Dates</div>
                                  <div className="text-sm font-semibold">
                                    {offer.date_start && offer.date_end ? (
                                      <>Du {new Date(offer.date_start).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} au {new Date(offer.date_end).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</>
                                    ) : (
                                      offer.month_departure
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                <div>
                                  <div className="text-xs text-muted-foreground">Ville</div>
                                  <div className="text-sm font-semibold">{offer.departure_city}</div>
                                </div>
                              </div>

                              {offer.duration_nights && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                                  <div>
                                    <div className="text-xs text-muted-foreground">Durée</div>
                                    <div className="text-sm font-semibold">{offer.duration_nights} nuits</div>
                                  </div>
                                </div>
                              )}

                              {offer.airline && (
                                <div className="flex items-center gap-2">
                                  <Plane className="h-4 w-4 text-primary flex-shrink-0" />
                                  <div>
                                    <div className="text-xs text-muted-foreground">Compagnie</div>
                                    <div className="text-sm font-semibold">{offer.airline}</div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {(offer.hotel_makkah || offer.hotel_medinah) && (
                              <div className="space-y-2 pt-2 border-t border-primary/10">
                                {offer.hotel_makkah && (
                                  <div className="flex items-start gap-2">
                                    <Hotel className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <div className="text-xs text-muted-foreground">Mecque</div>
                                      <div className="text-sm font-semibold">{offer.hotel_makkah}</div>
                                      {offer.distance_to_haram_m && (
                                        <div className="text-xs text-muted-foreground">{offer.distance_to_haram_m}m du Haram</div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {offer.hotel_medinah && (
                                  <div className="flex items-start gap-2">
                                    <Hotel className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <div className="text-xs text-muted-foreground">Médine</div>
                                      <div className="text-sm font-semibold">{offer.hotel_medinah}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Prix et bouton */}
                          <div className="lg:w-48 flex flex-col justify-between items-center lg:items-end gap-4 lg:border-l lg:border-primary/10 lg:pl-6">
                            <div className="text-center lg:text-right">
                              <div className="text-sm text-muted-foreground mb-1">Prix par personne</div>
                              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                {Number(offer.price_eur).toLocaleString('fr-FR')}€
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">en chambre quadruple</div>
                            </div>
                            <div className="space-y-2">
                              <Button 
                                asChild 
                                className="w-full lg:w-auto group/btn bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-xl transition-all duration-300"
                                disabled={offer.is_complet}
                              >
                                <a href={offer.offer_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                  <span className="font-semibold">{offer.is_complet ? 'Complet' : "Voir l'offre"}</span>
                                  {!offer.is_complet && (
                                    <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                                  )}
                                </a>
                              </Button>
                              <Button 
                                asChild 
                                variant="outline"
                                className="w-full lg:w-auto"
                              >
                                <a href="https://omrabonsplans.fr/agences-liste" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                  <span>Voir le comparatif d'agences</span>
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            {/* ⚡ PAGINATION */}
            <OffersPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={offers.length}
            />
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
                  Plus besoin de consulter des dizaines de sites d'agences. Notre comparateur regroupe toutes les offres Omra 2026 en un seul endroit. Filtrez par prix, date de départ, ville, formule et trouvez instantanément le séjour qui vous convient.
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
                Nous référençons les principales agences de voyages françaises spécialisées dans l'organisation de séjours Omra, notamment Tawaf, Medinvoyages, Almaqam, Pelerinhajj, Al Bayt, Hayat, Omra Sounnah, Omra Pour Tous et Sabil Voyages. Toutes sont agréées et reconnues pour leur sérieux et leur expérience dans le pèlerinage.
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
            <h2 className="text-3xl md:text-4xl font-bold text-center">Préparez votre Omra 2026</h2>
            
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

         {/* Formulaire contact agence */}
         <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/20">
           <div className="max-w-2xl mx-auto">
             <div className="text-center mb-8">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
                 <Mail className="h-4 w-4" />
                 <span>Agences de voyage</span>
               </div>
               <h2 className="text-3xl md:text-4xl font-bold mb-3">Vous souhaitez apparaître sur notre comparateur ?</h2>
               <p className="text-muted-foreground text-lg">Écrivez-nous et faites découvrir vos offres à des milliers de pèlerins</p>
             </div>

             <form onSubmit={handleAgencyFormSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label htmlFor="agencyName" className="text-sm font-medium">
                     Nom de l'agence <span className="text-destructive">*</span>
                   </label>
                   <Input
                     id="agencyName"
                     placeholder="Votre agence"
                     value={agencyForm.agencyName}
                     onChange={(e) => setAgencyForm({ ...agencyForm, agencyName: e.target.value })}
                     required
                     maxLength={100}
                   />
                 </div>

                 <div className="space-y-2">
                   <label htmlFor="contactName" className="text-sm font-medium">
                     Votre nom <span className="text-destructive">*</span>
                   </label>
                   <Input
                     id="contactName"
                     placeholder="Prénom Nom"
                     value={agencyForm.contactName}
                     onChange={(e) => setAgencyForm({ ...agencyForm, contactName: e.target.value })}
                     required
                     maxLength={100}
                   />
                 </div>

                 <div className="space-y-2">
                   <label htmlFor="email" className="text-sm font-medium">
                     Email <span className="text-destructive">*</span>
                   </label>
                   <Input
                     id="email"
                     type="email"
                     placeholder="contact@votre-agence.fr"
                     value={agencyForm.email}
                     onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                     required
                     maxLength={255}
                   />
                 </div>

                 <div className="space-y-2">
                   <label htmlFor="phone" className="text-sm font-medium">
                     Téléphone <span className="text-destructive">*</span>
                   </label>
                   <Input
                     id="phone"
                     type="tel"
                     placeholder="06 12 34 56 78"
                     value={agencyForm.phone}
                     onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })}
                     required
                     maxLength={20}
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label htmlFor="message" className="text-sm font-medium">
                   Votre message <span className="text-destructive">*</span>
                 </label>
                 <Textarea
                   id="message"
                   placeholder="Parlez-nous de votre agence, de vos offres et pourquoi vous souhaitez rejoindre notre comparateur..."
                   value={agencyForm.message}
                   onChange={(e) => setAgencyForm({ ...agencyForm, message: e.target.value })}
                   required
                   maxLength={1000}
                   rows={6}
                   className="resize-none"
                 />
                 <p className="text-xs text-muted-foreground text-right">
                   {agencyForm.message.length}/1000 caractères
                 </p>
               </div>

               <Button 
                 type="submit" 
                 className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-xl transition-all"
                 disabled={isSubmitting}
               >
                 {isSubmitting ? (
                   <>
                     <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                     Envoi en cours...
                   </>
                 ) : (
                   <>
                     <Send className="h-5 w-5 mr-2" />
                     Envoyer ma demande
                   </>
                 )}
               </Button>
             </form>
           </div>
          </Card>
        </div>
        
        {/* Liens internes SEO */}
        <InternalLinks currentPage="/" variant="related" className="mt-8" />
       </div>
      </div>
      </div>
    </ResponsiveLayout>
  );
}
