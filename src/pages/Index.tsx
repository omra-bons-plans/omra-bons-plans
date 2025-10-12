import React, { useState, useEffect, useRef } from "react";
import { Search, Sun, Cloud, CloudRain, CloudSnow, Cloudy, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWeatherAndExchange } from "@/hooks/useWeatherAndExchange";
import { useAuth } from "@/contexts/AuthContext";
import { useAds } from "@/hooks/useAds";
import { useTopics } from '@/hooks/useTopics';
import ResponsiveLayout from "@/components/ResponsiveLayout";
import Logo from "@/components/ui/Logo";
import { SEOHead } from "@/components/SEO/SEOHead";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserMenu from "@/components/ui/UserMenu";
import AdCard from "@/components/ui/AdCard";
import FeedbackForm from "@/components/ui/FeedbackForm";
import TopicsList from '@/components/ui/TopicsList';
import ThreadedChatWindow from '@/components/ui/ThreadedChatWindow';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Lazy import images to reduce initial bundle size
import kaabaHero from "@/assets/kaaba-hero.jpg";
const meccaMosqueHero = "/src/assets/mecca-mosque-hero.jpg";
const luxuryHotelMecca = "/src/assets/luxury-hotel-mecca.jpg";
const tourGuideMecca = "/src/assets/tour-guide-mecca.jpg";
const airplaneInterior = "/src/assets/airplane-interior.jpg";

// Weather icon mapping function
const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  
  if (desc.includes('clear') || desc.includes('sunny') || desc.includes('dégagé')) {
    return <Sun className="w-8 h-8 text-yellow-500" />;
  }
  if (desc.includes('cloud') || desc.includes('nuageux') || desc.includes('couvert')) {
    return <Cloudy className="w-8 h-8 text-gray-500" />;
  }
  if (desc.includes('rain') || desc.includes('pluie') || desc.includes('averse')) {
    return <CloudRain className="w-8 h-8 text-blue-500" />;
  }
  if (desc.includes('snow') || desc.includes('neige')) {
    return <CloudSnow className="w-8 h-8 text-blue-300" />;
  }
  if (desc.includes('partly') || desc.includes('partiellement')) {
    return <Cloud className="w-8 h-8 text-gray-400" />;
  }
  
  // Default sunny icon
  return <Sun className="w-8 h-8 text-yellow-500" />;
};

// Function to translate weather descriptions
const translateWeatherDescription = (description: string) => {
  const desc = description.toLowerCase();
  
  if (desc.includes('sunny') || desc.includes('clear')) {
    return 'Ensoleillé';
  }
  if (desc.includes('cloudy') || desc.includes('overcast')) {
    return 'Nuageux';
  }
  if (desc.includes('partly cloudy')) {
    return 'Partiellement nuageux';
  }
  if (desc.includes('rain')) {
    return 'Pluvieux';
  }
  if (desc.includes('snow')) {
    return 'Neigeux';
  }
  
  // Return original if no translation found
  return description;
};

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentWeatherCity, setCurrentWeatherCity] = useState<'makkah' | 'madinah'>('makkah');
  const [mobileRotatingIndex, setMobileRotatingIndex] = useState(0);
  const isMobile = useIsMobile();
  const { topics } = useTopics();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const selectedTopic = selectedTopicId ? topics.find(t => t.id === selectedTopicId) : null;
  const [flashSalesCarouselApi, setFlashSalesCarouselApi] = useState<any>();
  const [allServicesCarouselApi, setAllServicesCarouselApi] = useState<any>();
  const [flashSalesCurrent, setFlashSalesCurrent] = useState(0);
  const [allServicesCurrent, setAllServicesCurrent] = useState(0);
  const { data: weatherAndExchange, loading: weatherLoading, refetch: refetchWeather } = useWeatherAndExchange();
  const { user } = useAuth();
  // ⚡ CRITICAL: Load only 6 ads for mobile to reduce LCP
  const adsLimit = isMobile ? 6 : 15;
  const { formattedListings, loading: adsLoading, error: adsError, hasMore, loadMore, total } = useAds(adsLimit, 0);

  // Refs pour les sections de scroll
  const flashSalesTabsRef = useRef<HTMLDivElement>(null);
  const flashSalesCardsRef = useRef<HTMLDivElement>(null);
  const allServicesTabsRef = useRef<HTMLDivElement>(null);
  const allServicesCardsRef = useRef<HTMLDivElement>(null);

  // ❌ REMOVED: Auto-rotation was blocking main thread during LCP

  // Tracking carousel simplifié
  useEffect(() => {
    if (!flashSalesCarouselApi) return;
    setFlashSalesCurrent(flashSalesCarouselApi.selectedScrollSnap());
    flashSalesCarouselApi.on("select", () => {
      setFlashSalesCurrent(flashSalesCarouselApi.selectedScrollSnap());
    });
  }, [flashSalesCarouselApi]);

  useEffect(() => {
    if (!allServicesCarouselApi) return;
    setAllServicesCurrent(allServicesCarouselApi.selectedScrollSnap());
    allServicesCarouselApi.on("select", () => {
      setAllServicesCurrent(allServicesCarouselApi.selectedScrollSnap());
    });
  }, [allServicesCarouselApi]);

  const getCategoryCount = (categoryId: string) => {
    return formattedListings.filter(listing => listing.type === categoryId).length;
  };

  const categories = [
    { id: "sejours", name: "Séjours", icon: "building", description: "Packages complets Omra", count: getCategoryCount("sejours") },
    { id: "vols", name: "Vols", icon: "plane", description: "Billets d'avion", count: getCategoryCount("vols") },
    { id: "hebergement", name: "Hébergements", icon: "hotel", description: "Hôtels et appartements", count: getCategoryCount("hebergement") },
    { id: "guides", name: "Guides", icon: "book-open", description: "Guides spirituels", count: getCategoryCount("guides") },
    { id: "chauffeurs", name: "Chauffeurs", icon: "car", description: "Transport privé", count: getCategoryCount("chauffeurs") },
    { id: "babysitting", name: "Baby-sitting", icon: "heart", description: "Garde d'enfants", count: getCategoryCount("babysitting") }
  ];

  // ❌ REMOVED: Auto-scroll was blocking main thread during LCP

  // Use real ads from database, fallback to sample data if no ads exist
  const sampleListings = [
    {
      id: "sample-1",
      type: "sejours",
      title: "Exemple - Séjour Omra Confort",
      subtitle: "15 jours avec hôtel 5 étoiles",
      price: "1450€",
      originalPrice: "1890€",
      discount: 23,
      isFlashSale: false,
      isPromo: true,
      flashSaleEndDate: undefined,
      image: luxuryHotelMecca,
      rating: 4.8,
      reviews: 124,
      location: "Makkah - Médine",
      isPopular: true
    }
  ];

  const featuredListings = formattedListings.length > 0 ? formattedListings : sampleListings;

  // Get flash sale listings (only services with prices: sejours, vols, hebergement)
  const flashSalesListings = featuredListings.filter(listing => 
    listing.isFlashSale && 
    listing.flashSaleEndDate && 
    ['sejours', 'vols', 'hebergement'].includes(listing.type)
  );

  // Filter flash sales based on selected category
  const filteredFlashSalesListings = selectedCategory === "all" 
    ? flashSalesListings
    : flashSalesListings.filter(listing => listing.type === selectedCategory);

  // Filter listings based on selected category - exclude flash sales
  const filteredListings = selectedCategory === "all" 
    ? featuredListings.filter(listing => !listing.isFlashSale) // Exclude flash sales from "all"
    : featuredListings.filter(listing => 
        listing.type === selectedCategory && !listing.isFlashSale // Exclude flash sales from specific categories
      );

  // Filter and reorder categories - selected category first
  const getOrderedCategories = () => {
    const flashCategories = categories.filter(category => ['sejours', 'vols', 'hebergement'].includes(category.id));
    
    // Put selected category first for all screen sizes
    if (selectedCategory !== "all") {
      const selectedCat = flashCategories.find(cat => cat.id === selectedCategory);
      const otherCats = flashCategories.filter(cat => cat.id !== selectedCategory);
      return selectedCat ? [selectedCat, ...otherCats] : flashCategories;
    }
    
    return flashCategories;
  };

  // Reorder all categories - selected category first
  const getAllOrderedCategories = () => {
    if (selectedCategory !== "all") {
      const selectedCat = categories.find(cat => cat.id === selectedCategory);
      const otherCats = categories.filter(cat => cat.id !== selectedCategory);
      return selectedCat ? [selectedCat, ...otherCats] : categories;
    }
    
    return categories;
  };

  // Show loading state
  if (adsLoading) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Chargement des annonces...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  console.log('✅ Index page: Rendering with', formattedListings.length, 'ads');

  const earliestEndDate = filteredFlashSalesListings.length > 0 
    ? filteredFlashSalesListings.reduce((earliest, listing) => 
        listing.flashSaleEndDate! < earliest ? listing.flashSaleEndDate! : earliest, 
        filteredFlashSalesListings[0].flashSaleEndDate!
      )
    : undefined;

  const stats = [
    { value: "+15M", label: "visiteurs par an", icon: "trending-up" },
    { value: "450", label: "jours / an", icon: "calendar" },
    { value: "28", label: "ans d'expertise", icon: "shield" },
    { value: "46K+", label: "satisfactions", icon: "users" }
  ];

  return (
    <ResponsiveLayout>
      <SEOHead
        title="Omra Bons Plans - Plateforme #1 d'Annonces Omra & Hajj 2026"
        description="Trouvez les meilleures offres pour votre Omra et Hajj 2026. Comparez séjours, vols, hébergements, guides et chauffeurs en Arabie Saoudite. Conseils d'experts pour une Omra pas chère."
        keywords="omra pas cher, hajj 2026, voyage omra, séjours omra, vol omra, hébergement mecque, guide omra, chauffeur arabie saoudite, visa omra, agence omra"
        canonical="https://omrabonsplans.fr/"
        ogImage="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Omra Bons Plans",
          "url": "https://omrabonsplans.fr",
          "description": "Plateforme de comparaison et d'annonces pour services Omra et Hajj en Arabie Saoudite",
          "inLanguage": "fr-FR",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://omrabonsplans.fr/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Omra Bons Plans",
            "url": "https://omrabonsplans.fr",
            "logo": {
              "@type": "ImageObject",
              "url": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png",
              "width": 512,
              "height": 512
            },
            "sameAs": [
              "https://www.instagram.com/omrabonsplans",
              "https://www.tiktok.com/@omrabonsplans.fr"
            ]
          }
        }}
      />
      <div className="min-h-screen bg-background">
        {/* Desktop Header - Hidden on mobile */}
        <header className="hidden lg:block glass-strong sticky top-0 z-50 border-b border-border/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center justify-between w-full">
              {/* Logo - Left aligned on desktop */}
              <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="h-16 flex items-center">
                  <Logo size={140} className="text-primary object-contain" style={{ maxHeight: '64px' }} />
                </div>
              </div>
              
              {/* Right buttons */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {user ? (
                  <UserMenu />
                ) : (
                  <Link to="/auth">
                    <Button variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground transition-all duration-300">
                      Se connecter
                    </Button>
                  </Link>
                )}
                <Link to="/publish">
                  <Button className="btn-modern text-primary-foreground px-3 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base">
                    <span className="hidden sm:inline">Publier une annonce</span>
                    <span className="sm:hidden">Publier</span>
                  </Button>
                </Link>
              </div>
            </div>
            </div>
          </div>
        </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden lg:pt-0 pt-16">
        {/* Background Image - Desktop only (as IMG for better LCP) */}
        <img 
          src={kaabaHero}
          alt="La Kaaba sacrée à La Mecque - Hajj et Omra"
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <div className="hero-overlay absolute inset-0 hidden md:block"></div>

        {/* Mobile: Gradient background (no image for better LCP) */}
        <div className="absolute inset-0 block md:hidden bg-gradient-to-br from-primary via-primary-dark to-accent"></div>
        <div className="hero-overlay absolute inset-0 block md:hidden"></div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 islamic-pattern-modern opacity-30 z-10"></div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-secondary/20 rounded-full blur-sm float"></div>
        <div className="absolute top-40 right-40 w-8 h-8 bg-primary/30 rounded-full blur-sm float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-warning/20 rounded-full blur-sm float" style={{animationDelay: '4s'}}></div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="flex flex-col items-center justify-start text-center min-h-screen pt-20 md:pt-32">
            <div className="space-y-6 md:space-y-10 max-w-4xl">
              <div className="space-y-2 md:space-y-6">
                <h1 className="text-4xl md:text-8xl font-bold leading-tight">
                  <span className="text-white drop-shadow-lg">Trouvez tous les services</span><br />
                  <span className="gradient-text-secondary font-black text-6xl md:text-9xl drop-shadow-lg">Hajj & Omra</span><br />
                  <span className="text-white drop-shadow-lg">Facilement en un seul endroit</span>
                </h1>
                
                <p className="text-lg md:text-3xl font-bold leading-relaxed mt-4">
                  <span className="text-white drop-shadow-lg">Trouvez facilement des annonces logements, chauffeurs, guides, séjours et plus encore pour le Hajj & la Omra</span>
                </p>
              </div>

              {/* Compact Weather & Exchange Widget */}
              <div className="bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-soft mx-auto border border-border/20 
                             w-fit min-w-[150px] max-w-[200px] sm:max-w-[280px] lg:max-w-xs">
                
                {/* Mobile: Single rotating field */}
                <div className="block sm:hidden">
                  <button
                    onClick={() => refetchWeather(true)}
                    disabled={weatherLoading}
                    className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 z-10"
                    title="Actualiser les données"
                  >
                    <RefreshCw className={`w-2 h-2 text-gray-600 ${weatherLoading ? 'animate-spin' : ''}`} />
                  </button>
                  
                  <div className="py-1 min-h-[45px] flex items-center justify-center">
                    {(() => {
                      const items = [
                        {
                          icon: weatherAndExchange?.weather ? getWeatherIcon(weatherAndExchange.weather.makkah?.description || 'Sunny') : null,
                          title: 'Makkah',
                          value: `${weatherAndExchange?.weather?.makkah?.temperature || '--'}°`,
                          subtitle: translateWeatherDescription(weatherAndExchange?.weather?.makkah?.description || 'Ensoleillé')
                        },
                        {
                          icon: weatherAndExchange?.weather ? getWeatherIcon(weatherAndExchange.weather.madinah?.description || 'Sunny') : null,
                          title: 'Médine',
                          value: `${weatherAndExchange?.weather?.madinah?.temperature || '--'}°`,
                          subtitle: translateWeatherDescription(weatherAndExchange?.weather?.madinah?.description || 'Ensoleillé')
                        },
                        {
                          icon: null,
                          title: 'Taux du jour',
                          value: `1€ = ${weatherAndExchange?.exchange?.eurToSar ? weatherAndExchange.exchange.eurToSar.toFixed(2) : '4.39'} Sar`,
                          subtitle: 'Euro vers Riyal'
                        }
                      ];

                      const currentItem = items[mobileRotatingIndex];

                      if (currentItem.icon) {
                        return (
                          <div key={mobileRotatingIndex} className="animate-fade-in flex items-center space-x-2">
                            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                              {currentItem.icon}
                            </div>
                            <div className="text-left">
                              <div className="text-xs font-semibold text-gray-800">{currentItem.title}</div>
                              <div className="text-sm font-bold text-amber-500">{currentItem.value}</div>
                              <div className="text-[7px] text-gray-500 capitalize">{currentItem.subtitle}</div>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div key={mobileRotatingIndex} className="animate-fade-in text-center">
                            <div className="text-xs font-semibold text-gray-800">{currentItem.title}</div>
                            <div className="text-sm font-bold text-amber-500">{currentItem.value}</div>
                            <div className="text-[7px] text-gray-500 capitalize">{currentItem.subtitle}</div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>

                {/* Desktop/Tablet: Original layout */}
                <div className="hidden sm:flex flex-col gap-1 sm:gap-2">
                  {/* Header with refresh button */}
                  <div className="flex items-center justify-end mb-1">
                    <button
                      onClick={() => refetchWeather(true)}
                      disabled={weatherLoading}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                      title="Actualiser les données"
                    >
                      <RefreshCw className={`w-2 h-2 sm:w-3 sm:h-3 text-gray-600 ${weatherLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Weather Section - Compact */}
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {/* City Indicator Dots */}
                    <div className="flex flex-col space-y-0.5 sm:space-y-1">
                      <button
                        onClick={() => setCurrentWeatherCity('madinah')}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                          currentWeatherCity === 'madinah' 
                            ? 'bg-amber-500 shadow-sm' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label="Afficher la météo de Médine"
                      />
                      <button
                        onClick={() => setCurrentWeatherCity('makkah')}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                          currentWeatherCity === 'makkah' 
                            ? 'bg-amber-500 shadow-sm' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label="Afficher la météo de La Mecque"
                      />
                    </div>

                    {/* Weather Icon - Smaller */}
                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 sm:w-4 sm:h-4">
                        {weatherAndExchange?.weather && 
                          getWeatherIcon(
                            currentWeatherCity === 'makkah' 
                              ? (weatherAndExchange.weather.makkah?.description || 'Sunny')
                              : (weatherAndExchange.weather.madinah?.description || 'Sunny')
                          )
                        }
                      </div>
                    </div>

                    {/* Weather Info - Compact */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] sm:text-xs text-gray-600 font-medium">
                        {(() => {
                          const today = new Date();
                          const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
                          return days[today.getDay()];
                        })()}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                        {currentWeatherCity === 'makkah' ? 'Makkah, Arabie saoudite' : 'Médine, Arabie saoudite'}
                      </div>
                      <div className="text-[9px] sm:text-xs text-gray-500 capitalize truncate">
                        {currentWeatherCity === 'makkah' 
                          ? translateWeatherDescription(weatherAndExchange?.weather?.makkah?.description || 'Ensoleillé')
                          : translateWeatherDescription(weatherAndExchange?.weather?.madinah?.description || 'Ensoleillé')}
                      </div>
                    </div>

                    {/* Temperature - Compact */}
                    <div className="text-lg sm:text-2xl font-bold text-amber-500">
                      {weatherAndExchange?.weather 
                        ? (currentWeatherCity === 'makkah' 
                            ? `${weatherAndExchange.weather.makkah?.temperature || '--'}°`
                            : `${weatherAndExchange.weather.madinah?.temperature || '--'}°`)
                        : '--°'}
                    </div>
                  </div>

                  {/* Exchange Rate Section - Compact */}
                  <div className="text-center pt-1 sm:pt-2 border-t border-gray-200">
                    <div className="text-[9px] sm:text-xs text-gray-600 font-medium mb-1">Taux du jour</div>
                    <div className="text-base sm:text-lg font-bold text-gray-800">
                      1€ = <span className="text-amber-500">
                        {weatherAndExchange?.exchange?.eurToSar ? weatherAndExchange.exchange.eurToSar.toFixed(2) : '4.39'}
                      </span> Sar
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Community Button */}
              <div className="mt-8 max-w-[320px] mx-auto">
                <button
                  onClick={() => window.open('https://whatsapp.com/channel/0029VaFFu5P5PO18w7fmTB0M', '_blank')}
                  className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 w-full"
                >
                  {/* WhatsApp Icon */}
                  <div className="relative z-10">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.506"/>
                    </svg>
                  </div>
                  
                  {/* Text Content */}
                  <div className="relative z-10 flex-1 text-center">
                    <div className="text-base font-bold">Rejoignez la communauté</div>
                    <div className="text-base font-bold">Omra Bons Plans</div>
                  </div>
                  
                  {/* Animated Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                  
                  {/* Pulse Effect */}
                  <div className="absolute inset-0 bg-green-400 rounded-2xl opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></div>
                </button>
                
                <div className="text-center mt-3">
                  <p className="text-white/80 text-sm">
                    🔥 Rejoignez +5000 membres pour des bons plans exclusifs !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="pt-16 md:pt-32 pb-20 px-0 md:px-6">
        <div className="container mx-auto">
          {/* Tabs System */}
          <Tabs defaultValue="annonces" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/30 rounded-xl p-1 max-w-md mx-auto sticky top-20 z-40 backdrop-blur-md">
              <TabsTrigger 
                value="annonces" 
                className="rounded-lg font-semibold text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <DynamicIcon name="building" className="w-4 h-4 mr-2" />
                Annonces
              </TabsTrigger>
              <TabsTrigger 
                value="discussions" 
                className="rounded-lg font-semibold text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <DynamicIcon name="message-circle" className="w-4 h-4 mr-2" />
                Discussions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="annonces" className="space-y-0">
              {/* Flash Sales Section - Only show if there are flash sales */}
              {filteredFlashSalesListings.length > 0 && (
                <section className="pb-20">
                  <div className="md:container md:mx-auto max-w-md mx-auto px-6 md:px-6 md:max-w-none">
                    <div className="mb-16">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
                      <div>
                        <h2 className="text-4xl font-bold mb-4">Ventes Flash Omra & Hajj 2026 : Séjours, vols et hébergements à prix réduits</h2>
                        <p className="text-muted-foreground text-lg">Profitez de nos offres promotionnelles limitées sur les packages tout inclus, billets d'avion et hôtels près du Haram</p>
                      </div>
                        
                      </div>
                    </div>

                    {/* Category Pills - Horizontal Scroll on Mobile */}
                    <div className="horizontal-scroll-container flash-sales-tabs-container">
                      <div className="flex gap-3 mb-16 overflow-x-auto scrollbar-hide pb-2 md:justify-center scroll-hint">
                        <div className="flex gap-3 min-w-max md:min-w-0">
                          <Button 
                            onClick={() => setSelectedCategory("all")}
                            className={`rounded-full px-8 py-3 text-base font-semibold whitespace-nowrap transition-all duration-300 min-w-fit ${
                              selectedCategory === "all" 
                                ? "btn-modern text-primary-foreground" 
                                : "glass border-2 border-primary/30 hover:bg-primary/10"
                            }`}
                            variant={selectedCategory === "all" ? "default" : "outline"}
                          >
                            Tous
                          </Button>
                          {/* Filtrer seulement les catégories avec prix pour les ventes flash */}
                          {getOrderedCategories().map((category) => (
                            <Button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`rounded-full px-8 py-3 text-base font-semibold whitespace-nowrap transition-all duration-300 min-w-fit ${
                                selectedCategory === category.id 
                                  ? "btn-modern text-primary-foreground" 
                                  : "glass border-2 border-primary/30 hover:bg-primary/10"
                              }`}
                              variant={selectedCategory === category.id ? "default" : "outline"}
                            >
                              {category.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Grid Layout */}
                    <div className="hidden lg:grid grid-cols-4 gap-8">
                      {filteredFlashSalesListings.map((listing) => (
                        <AdCard 
                          key={listing.id} 
                          listing={listing}
                          imageHeight="h-56"
                        />
                      ))}
                    </div>

                    {/* Tablet: Carousel with 2 items */}
                    <div className="hidden md:block lg:hidden carousel-item-peek">
                      <Carousel className="w-full">
                        <CarouselContent className="-ml-4">
                          {filteredFlashSalesListings.map((listing) => (
                          <CarouselItem key={listing.id} className="pl-4 basis-1/2">
                            <AdCard 
                              key={listing.id}
                              listing={listing} 
                              className="w-full"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden sm:flex" />
                      <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                  </div>

                  {/* Mobile: Carousel with 1 item */}
                  <div className="block md:hidden carousel-item-peek flash-sales-cards-container">
                    <Carousel 
                      className="w-full scroll-hint"
                      setApi={setFlashSalesCarouselApi}
                    >
                      <CarouselContent>
                        {filteredFlashSalesListings.map((listing) => (
                          <CarouselItem key={listing.id}>
                            <AdCard 
                              listing={listing}
                              imageHeight="h-56"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden sm:flex" />
                      <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                    
                    {/* Pagination dots for mobile */}
                    <div className="flex justify-center space-x-2 mt-6">
                      {filteredFlashSalesListings.map((_, index) => (
                        <div
                          key={index}
                          className="w-2 h-2 rounded-full transition-colors duration-200"
                          style={{
                            backgroundColor: index === flashSalesCurrent ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

      {/* Introduction SEO Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Préparez votre Omra 2026 avec Omra Bons Plans
            </h2>
            <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
              <p>
                Bienvenue sur <strong className="text-foreground">Omra Bons Plans</strong>, la première plateforme française dédiée à l'organisation de votre pèlerinage en Arabie Saoudite. Que vous recherchiez un <strong className="text-foreground">séjour Omra tout compris</strong>, des <strong className="text-foreground">vols pas chers vers Jeddah</strong>, un <strong className="text-foreground">hébergement près du Haram</strong> à La Mecque ou Médine, ou encore un <strong className="text-foreground">guide spirituel expérimenté</strong>, nous centralisons toutes les offres pour faciliter vos recherches.
              </p>
              <p>
                Notre mission est de vous aider à trouver une <strong className="text-foreground">Omra pas chère</strong> sans compromis sur la qualité. Comparez les prix, consultez les avis authentiques des pèlerins, et accédez à des conseils d'experts pour préparer votre voyage religieux sereinement. Du <strong className="text-foreground">visa Omra</strong> aux formalités administratives, en passant par les meilleures périodes pour partir, nous vous accompagnons à chaque étape de votre préparation.
              </p>
              <p>
                Avec des annonces vérifiées, des <Link to="/comparatif-agences" className="text-primary hover:underline font-semibold">comparatifs d'agences</Link> détaillés, et des <Link to="/blog" className="text-primary hover:underline font-semibold">guides pratiques sur notre blog</Link>, Omra Bons Plans est votre partenaire de confiance pour réaliser le voyage spirituel de votre vie. Consultez également notre <Link to="/prayer-times" className="text-primary hover:underline font-semibold">outil des horaires de prière</Link> et notre <Link to="/islamic-calendar" className="text-primary hover:underline font-semibold">calendrier islamique</Link> pour planifier votre séjour aux dates les plus propices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Services Section - Now first */}
      <section className="py-20 px-0 md:px-6">
        <div className="md:container md:mx-auto max-w-md mx-auto px-6 md:px-6 md:max-w-none">
          <div className="mb-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">Services Hajj & Omra en 2026</h2>
                <p className="text-muted-foreground text-lg">Découvrez nos conseils pour trouver une <strong>Omra pas chère</strong> adaptée à votre budget</p>
              </div>
            </div>
          </div>

          {/* Category Pills - Same as Flash Sales */}
          <div className="horizontal-scroll-container all-services-tabs-container">
            <div className="flex gap-3 mb-16 overflow-x-auto scrollbar-hide pb-2 md:justify-center scroll-hint">
              <div className="flex gap-3 min-w-max md:min-w-0">
                <Button 
                  onClick={() => setSelectedCategory("all")}
                  className={`rounded-full px-8 py-3 text-base font-semibold whitespace-nowrap transition-all duration-300 min-w-fit ${
                    selectedCategory === "all" 
                      ? "btn-modern text-primary-foreground" 
                      : "glass border-2 border-primary/30 hover:bg-primary/10"
                  }`}
                  variant={selectedCategory === "all" ? "default" : "outline"}
                >
                  Tous
                </Button>
                {getAllOrderedCategories().map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`rounded-full px-8 py-3 text-base font-semibold whitespace-nowrap transition-all duration-300 min-w-fit ${
                      selectedCategory === category.id 
                        ? "btn-modern text-primary-foreground" 
                        : "glass border-2 border-primary/30 hover:bg-primary/10"
                    }`}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Listings under tabs */}
          {/* Desktop: Grid Layout */}
          {filteredListings.length > 0 ? (
            <div className="hidden lg:grid grid-cols-4 gap-8 mb-16">
              {filteredListings.map((listing) => (
                <AdCard 
                  key={listing.id} 
                  listing={listing}
                  imageHeight="h-56"
                />
              ))}
            </div>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center py-20 space-y-6 mb-16">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">✏️</span>
              </div>
              <div className="text-center space-y-3 max-w-md">
                <p className="text-2xl font-bold text-foreground">
                  Aucune annonce n'est disponible pour cette recherche pour le moment
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Nous travaillons activement à enrichir notre site pour mieux répondre à vos besoins.
                </p>
              </div>
            </div>
          )}

          {/* Tablet: Carousel with 2 items */}
          {filteredListings.length > 0 ? (
            <div className="hidden md:block lg:hidden carousel-item-peek mb-16">
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {filteredListings.map((listing) => (
                    <CarouselItem key={listing.id} className="pl-4 basis-1/2">
                      <AdCard 
                        key={listing.id}
                        listing={listing} 
                        className="w-full"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </div>
          ) : (
            <div className="hidden md:flex lg:hidden flex-col items-center justify-center py-20 space-y-6 mb-16">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">✏️</span>
              </div>
              <div className="text-center space-y-3 max-w-md px-6">
                <p className="text-xl font-bold text-foreground">
                  Aucune annonce n'est disponible pour cette recherche pour le moment
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Nous travaillons activement à enrichir notre site pour mieux répondre à vos besoins.
                </p>
              </div>
            </div>
          )}

          {/* Mobile: Carousel with 1 item */}
          {filteredListings.length > 0 ? (
            <div className="block md:hidden carousel-item-peek mb-16 all-services-cards-container">
              <Carousel 
                className="w-full scroll-hint"
                setApi={setAllServicesCarouselApi}
              >
                <CarouselContent>
                  {filteredListings.map((listing) => (
                    <CarouselItem key={listing.id}>
                      <AdCard 
                        listing={listing}
                        imageHeight="h-56"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
              
              {/* Pagination dots for mobile */}
              <div className="flex justify-center space-x-2 mt-6">
                {filteredListings.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full transition-colors duration-200"
                    style={{
                      backgroundColor: index === allServicesCurrent ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
                    }}
                  />
                ))}
              </div>
            </div>
            ) : (
              <div className="flex md:hidden flex-col items-center justify-center py-20 space-y-6 mb-16">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">✏️</span>
                </div>
                <div className="text-center space-y-3 max-w-md px-6">
                  <p className="text-xl font-bold text-foreground">
                    Aucune annonce n'est disponible pour cette recherche pour le moment
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Nous travaillons activement à enrichir notre site pour mieux répondre à vos besoins.
                  </p>
                </div>
              </div>
            )}
         </div>
        
        {/* Load More Button */}
        {hasMore && filteredListings.length > 0 && (
          <div className="text-center py-12">
            <Button 
              onClick={loadMore}
              disabled={adsLoading}
              variant="outline"
              size="lg"
              className="px-8 py-3 text-base font-semibold"
            >
              {adsLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Chargement...
                </>
              ) : (
                `Voir plus d'annonces (${total - formattedListings.length} restantes)`
              )}
            </Button>
          </div>
        )}
      </section>

      {/* Additional Services */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold break-words">Services Complémentaires pour votre séjour à La Mecque et Médine : restaurants halal et transports</h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed break-words">
                Enrichissez votre voyage spirituel avec nos guides pratiques : trouvez les meilleurs restaurants halal certifiés à proximité du Haram, réservez vos billets pour le train haute vitesse Haramain Express reliant La Mecque, Médine et Jeddah pour des déplacements confortables.
              </p>
              
              <div className="space-y-6">
                <Link to="/blog?category=restaurants" className="flex items-start space-x-4 hover:bg-background/50 p-3 rounded-lg transition-colors group">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <DynamicIcon name="utensils-crossed" className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Restaurants Halal</h3>
                    <p className="text-sm text-muted-foreground">Guide des meilleurs restaurants à La Mecque et Médine</p>
                  </div>
                </Link>
                
                <a 
                  href="https://sar.hhr.sa/timetable#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-start space-x-4 hover:bg-background/50 p-3 rounded-lg transition-colors group"
                >
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <span className="text-2xl">🚄</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">Train Haramain Express</h3>
                    <p className="text-sm text-muted-foreground">Réservez votre billet sur le train haute vitesse reliant La Mecque, Médine et Jeddah</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Service Image */}
            <div className="relative">
              <div className="bg-gradient-subtle rounded-3xl overflow-hidden shadow-large">
                <div className="aspect-video bg-gradient-primary/20 relative">
                  <img 
                    src="/lovable-uploads/f137f21e-556a-46f4-affa-52a97b71a0b8.png"
                    alt="Train Haramain Express traversant le désert saoudien au coucher du soleil"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-secondary rounded-full opacity-80"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Bons Plans Section - SEO */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Bons Plans Omra & Hajj</h2>
            <p className="text-muted-foreground text-lg">Trouvez les meilleures offres et conseils pour votre pèlerinage</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Carte Omra pas chère */}
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="text-2xl font-bold">Omra pas chère</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Découvrez nos conseils pour trouver une <strong className="text-foreground">Omra pas chère</strong> adaptée à votre budget. Nous comparons pour vous les meilleures offres afin que vous puissiez accomplir votre pèlerinage dans les meilleures conditions, sans mauvaise surprise.
                </p>
              </div>
            </div>

            {/* Carte Prix Omra */}
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💵</span>
                  </div>
                  <h3 className="text-2xl font-bold">Prix Omra</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Comparez le <strong className="text-foreground">prix Omra 2026/2027</strong> avec nos guides détaillés. Nous analysons pour vous les formules proposées par différentes agences Omra afin de vous aider à choisir la plus transparente et la plus fiable.
                </p>
              </div>
            </div>

            {/* Carte Visa Omra */}
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-2xl font-bold">Visa Omra</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Obtenir son <strong className="text-foreground">visa Omra</strong> peut sembler compliqué, mais avec nos explications étape par étape, vous saurez exactement quels documents préparer et comment éviter les erreurs fréquentes.
                </p>
              </div>
            </div>

            {/* Carte Agence Omra */}
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <h3 className="text-2xl font-bold">Agence Omra</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Trouver la bonne <strong className="text-foreground">agence Omra</strong> est essentiel pour voyager en confiance. Sur Omra Bons Plans, nous partageons nos retours d'expérience et nos recommandations pour sélectionner une agence sérieuse et adaptée à vos besoins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Mission Section - SEO */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern-modern opacity-5"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Notre mission : faciliter votre Omra et Hajj
            </h2>
            
            <div className="prose prose-lg max-w-none text-left">
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                Depuis plus de dix ans à Makkah, j'ai accompagné plus de 5000 pèlerins dans leur Omra et leur Hajj. J'ai pu voir leurs joies, leurs difficultés, leurs questions, et surtout leur soif de bien faire.
              </p>
              
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                C'est pour répondre à ces besoins que j'ai créé <strong className="text-primary font-semibold">Omra Bons Plans</strong>. Ce site n'est pas une agence, mais un guide indépendant qui vous aide à :
              </p>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-3 mt-1">✓</span>
                  <span className="text-muted-foreground text-base md:text-lg">Choisir une <strong className="font-semibold">Omra adaptée à votre budget</strong>.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 mt-1">✓</span>
                  <span className="text-muted-foreground text-base md:text-lg">Comprendre les <strong className="font-semibold">différences de prix Omra</strong> entre les offres.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 mt-1">✓</span>
                  <span className="text-muted-foreground text-base md:text-lg">Trouver la bonne <strong className="font-semibold">agence Omra</strong> selon votre situation.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 mt-1">✓</span>
                  <span className="text-muted-foreground text-base md:text-lg">Préparer sereinement le <strong className="font-semibold">Hajj 2026</strong>, étape par étape.</span>
                </li>
              </ul>
              
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Mon but est simple : vous accompagner avec sincérité et bienveillance, en partageant des informations fiables et des rappels spirituels, afin que votre voyage soit un succès matériel et surtout spirituel.
              </p>
            </div>
          </div>
        </div>
      </section>
            </TabsContent>

            <TabsContent value="discussions" className="space-y-0">
              <div className="py-8">
          <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4">Forum de discussions Omra & Hajj : conseils, témoignages et entraide entre pèlerins francophones</h2>
                  <p className="text-muted-foreground text-lg">Rejoignez notre communauté de pèlerins pour poser vos questions, partager vos expériences et bénéficier des conseils de voyageurs qui ont déjà accompli leur Omra ou Hajj</p>
                </div>
                <div className="max-w-6xl mx-auto">
                  {/* New Discussion System */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <TopicsList 
                        selectedTopicId={selectedTopicId} 
                        onTopicSelect={setSelectedTopicId} 
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <ThreadedChatWindow
                        topicId={selectedTopicId}
                        topicTitle={selectedTopic?.title}
                        topicColor={selectedTopic?.color}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Articles récents Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Guides et articles complets pour préparer votre Omra et Hajj 2026 : rituels, visa, choix d'agence</h2>
            <p className="text-muted-foreground text-lg">Consultez nos guides détaillés rédigés par des experts pour bien préparer votre pèlerinage : explications des rites, démarches administratives, comparatif d'agences et conseils pratiques essentiels</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Article 1 - Types de Hajj */}
            <div className="bg-background rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">Quels sont les trois types de Hajj ?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Savez-vous qu'il existe trois manières d'accomplir le Hajj ? Le Tamattu', le Qiran et l'Ifrad. Dans cet article, je partage mon expérience et j'explique en détail leurs différences, leurs avantages et la sagesse derrière ces rites.
                </p>
                <Link 
                  to="/blog/general/quels-sont-les-trois-types-de-hajj" 
                  className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Lire la suite
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Article 2 - Préparation Omra */}
            <div className="bg-background rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">Comment préparer sa première Omra ?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Vous partez pour votre première Omra et vous vous posez mille questions ? Ce guide complet vous accompagne pas à pas : du visa aux rites, en passant par les erreurs à éviter et les conseils pratiques essentiels pour un pèlerinage réussi.
                </p>
                <Link 
                  to="/blog/general/guide-complet-de-la-omra-tapes-rituels-et-conseils-pratique" 
                  className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Lire la suite
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Article 3 - Choisir son agence */}
            <div className="bg-background rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">Comment choisir son agence Omra ?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Face à la multitude d'offres, comment s'y retrouver ? Dans cet article, je vous donne les critères essentiels pour identifier une agence Omra sérieuse et fiable. Tarifs, transparence, avis clients : tout ce qu'il faut savoir avant de réserver.
                </p>
                <Link 
                  to="/blog/general/hajj-ou-omra-quelle-agence-choisir" 
                  className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Lire la suite
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section - Pourquoi choisir Omra Bons Plans */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Pourquoi choisir Omra Bons Plans pour organiser votre Omra 2026 ou Omra 2027 ?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto">
              <strong className="text-foreground">Omra Bons Plans</strong> est votre <strong className="text-foreground">comparateur Omra</strong> de référence pour trouver les <strong className="text-foreground">meilleures offres Omra 2026</strong> et <strong className="text-foreground">Omra 2027</strong>. Simplifiez la recherche des meilleures agences pour organiser votre <strong className="text-foreground">pèlerinage à la Mecque et Médine</strong> avec notre plateforme intuitive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DynamicIcon name="search" className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Recherche facilitée</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Trouvez rapidement les <strong className="text-foreground">meilleures agences Omra</strong> parmi notre sélection rigoureuse de spécialistes. Comparez en un clic les <strong className="text-foreground">offres Omra économiques</strong> et <strong className="text-foreground">forfaits premium</strong> pour votre <strong className="text-foreground">voyage spirituel</strong>.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DynamicIcon name="trending-up" className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Comparaison simplifiée</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Explorez les <strong className="text-foreground">meilleurs prix Omra 2026</strong> et <strong className="text-foreground">2027</strong>. Comparez facilement les <strong className="text-foreground">tarifs Omra</strong>, les <strong className="text-foreground">itinéraires</strong>, et les <strong className="text-foreground">prestations</strong> des agences spécialisées pour économiser temps et argent.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DynamicIcon name="shield" className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Agences vérifiées</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Accédez à une sélection des <strong className="text-foreground">meilleures agences Omra 2026 et 2027</strong>, reconnues pour leur fiabilité. Réservez votre <strong className="text-foreground">pèlerinage Omra</strong> en toute confiance avec des professionnels certifiés.
                </p>
              </div>
            </Card>
          </div>

          {/* Guide complet Omra */}
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Comment organiser votre Omra 2026 ou Omra 2027 : guide complet</h3>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Organiser une <strong className="text-foreground">Omra 2026</strong> ou <strong className="text-foreground">Omra 2027</strong> nécessite une préparation minutieuse. Que vous recherchiez une <strong className="text-foreground">Omra pas chère</strong> ou un <strong className="text-foreground">forfait Omra confort</strong>, notre <strong className="text-foreground">comparateur de voyages Omra</strong> vous accompagne à chaque étape.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="space-y-3">
                  <h4 className="font-bold text-foreground text-lg">✈️ Vols pour la Omra</h4>
                  <p>
                    Comparez les <strong className="text-foreground">billets d'avion Omra</strong> au meilleur prix. Trouvez des <strong className="text-foreground">vols directs</strong> vers Jeddah depuis Paris, Lyon, Marseille et d'autres villes de France. Profitez de nos offres de <strong className="text-foreground">vols Omra économiques</strong> toute l'année.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-foreground text-lg">🏨 Hébergements Mecque et Médine</h4>
                  <p>
                    Découvrez notre sélection d'<strong className="text-foreground">hôtels à la Mecque</strong> et <strong className="text-foreground">hébergements Médine</strong> proches des <strong className="text-foreground">lieux saints</strong>. Du 3 étoiles au 5 étoiles, trouvez l'<strong className="text-foreground">hôtel Haram</strong> idéal pour votre séjour spirituel.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-foreground text-lg">🚗 Transferts et Transport</h4>
                  <p>
                    Réservez vos <strong className="text-foreground">transferts aéroport Jeddah</strong>, <strong className="text-foreground">chauffeur privé Mecque</strong>, et <strong className="text-foreground">transport Médine</strong>. Bénéficiez de services de <strong className="text-foreground">taxi Omra</strong> fiables pour vos déplacements entre les villes saintes.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-foreground text-lg">👨‍🏫 Guides spirituels</h4>
                  <p>
                    Profitez de l'accompagnement de <strong className="text-foreground">guides Omra francophones</strong> expérimentés. Apprenez les <strong className="text-foreground">rites de la Omra</strong> et visitez les <strong className="text-foreground">sites historiques islamiques</strong> avec des experts certifiés.
                  </p>
                </div>
              </div>

              <p>
                Notre plateforme rassemble toutes les informations essentielles pour votre <strong className="text-foreground">voyage Omra</strong> : <strong className="text-foreground">visa Omra Arabie Saoudite</strong>, <strong className="text-foreground">vaccinations obligatoires</strong>, <strong className="text-foreground">assurance voyage</strong>, et <strong className="text-foreground">conseils pratiques</strong> pour un pèlerinage réussi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section - Omra selon les périodes */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Quand partir pour votre Omra ? Trouvez la meilleure période</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto">
              Chaque période de l'année offre une expérience unique pour votre <strong className="text-foreground">pèlerinage Omra</strong>. Découvrez les avantages de chaque saison pour planifier votre <strong className="text-foreground">voyage spirituel</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="text-3xl mb-2">🌙</div>
                <h3 className="text-xl font-bold">Omra Ramadan 2026 et 2027</h3>
                <p className="text-muted-foreground leading-relaxed">
                  La <strong className="text-foreground">Omra pendant Ramadan</strong> est la période la plus prisée. Réservez votre <strong className="text-foreground">forfait Omra Ramadan 2026</strong> ou <strong className="text-foreground">2027</strong> dès maintenant pour profiter des <strong className="text-foreground">meilleurs tarifs</strong> et de la spiritualité intense du mois sacré.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="text-3xl mb-2">☀️</div>
                <h3 className="text-xl font-bold">Omra vacances scolaires</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Partez en <strong className="text-foreground">Omra famille</strong> pendant les <strong className="text-foreground">vacances d'été</strong>, <strong className="text-foreground">Toussaint</strong> ou <strong className="text-foreground">vacances hiver</strong>. Profitez d'<strong className="text-foreground">offres Omra groupe</strong> adaptées aux familles avec des <strong className="text-foreground">hébergements spacieux</strong>.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="text-xl font-bold">Omra dernière minute</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Saisissez nos <strong className="text-foreground">promotions Omra dernière minute</strong> et <strong className="text-foreground">offres flash</strong> pour partir rapidement à <strong className="text-foreground">petit prix</strong>. Consultez régulièrement nos <strong className="text-foreground">deals Omra</strong> et <strong className="text-foreground">réductions exceptionnelles</strong>.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section SEO */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions fréquentes sur l'organisation de votre Omra</h2>
            <p className="text-muted-foreground text-lg">Toutes les réponses à vos questions pour préparer sereinement votre pèlerinage</p>
          </div>

          <div className="space-y-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3">Quel est le prix moyen d'une Omra en 2026 ?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Le <strong className="text-foreground">prix Omra 2026</strong> varie selon la période, la durée et le confort choisi. Comptez entre <strong className="text-foreground">1200€ et 3000€</strong> pour un <strong className="text-foreground">forfait Omra tout compris</strong>. Les <strong className="text-foreground">offres Omra économiques</strong> démarrent à partir de 1000€ hors saison, tandis que les <strong className="text-foreground">forfaits Omra Ramadan</strong> sont plus élevés en raison de la forte demande.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3">Comment obtenir le visa Omra ?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Le <strong className="text-foreground">visa Omra Arabie Saoudite</strong> peut être obtenu via une <strong className="text-foreground">agence Omra agréée</strong> ou en ligne sur le portail officiel. Les <strong className="text-foreground">démarches visa Omra</strong> incluent un passeport valide 6 mois, des photos d'identité, et les <strong className="text-foreground">vaccinations obligatoires</strong> (méningite). Le <strong className="text-foreground">coût visa Omra</strong> est généralement inclus dans les forfaits d'agence.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3">Quelle est la durée idéale pour une Omra ?</h3>
              <p className="text-muted-foreground leading-relaxed">
                La <strong className="text-foreground">durée Omra</strong> recommandée est de <strong className="text-foreground">7 à 15 jours</strong>. Un <strong className="text-foreground">séjour Omra court</strong> de 7 jours permet d'accomplir les rites essentiels, tandis qu'un <strong className="text-foreground">séjour Omra long</strong> de 15 jours offre plus de temps pour la méditation et les visites des <strong className="text-foreground">sites historiques islamiques</strong> à Médine et La Mecque.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3">Quelles sont les étapes de la Omra ?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Les <strong className="text-foreground">rites de la Omra</strong> comprennent 4 piliers : l'<strong className="text-foreground">Ihram</strong> (état de sacralisation), le <strong className="text-foreground">Tawaf</strong> (7 tours autour de la Kaaba), le <strong className="text-foreground">Sa'i</strong> (parcours entre Safa et Marwa), et la <strong className="text-foreground">Tahalul</strong> (désacralisation). Nos <strong className="text-foreground">guides Omra</strong> vous accompagnent pour accomplir ces rites correctement.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3">Peut-on faire plusieurs Omra lors d'un même voyage ?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Oui, il est possible d'effectuer plusieurs <strong className="text-foreground">Omra pendant un séjour</strong>. Beaucoup de pèlerins choisissent de faire une <strong className="text-foreground">deuxième Omra</strong> ou même plus durant leur voyage. Il suffit de se mettre en état d'<strong className="text-foreground">Ihram</strong> depuis un <strong className="text-foreground">Miqat</strong> (comme la mosquée Aisha) pour chaque nouvelle Omra.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final SEO Text Block */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-card">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-lg space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Omra Bons Plans : Votre comparateur de référence pour la Omra 2026 et 2027</h2>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Omra Bons Plans</strong> est la plateforme incontournable pour comparer et trouver les <strong className="text-foreground">meilleures offres Omra</strong>. Que vous planifiez votre <strong className="text-foreground">Omra 2026</strong> ou <strong className="text-foreground">Omra 2027</strong>, notre <strong className="text-foreground">comparateur Omra</strong> vous permet d'accéder en quelques clics aux offres les plus compétitives du marché.
              </p>

              <p>
                Nous référençons une large sélection d'<strong className="text-foreground">agences Omra agréées</strong> proposant des <strong className="text-foreground">forfaits Omra</strong> adaptés à tous les budgets : <strong className="text-foreground">Omra économique</strong>, <strong className="text-foreground">Omra confort</strong>, et <strong className="text-foreground">Omra premium</strong>. Trouvez facilement des <strong className="text-foreground">offres Omra tout compris</strong> incluant <strong className="text-foreground">vols</strong>, <strong className="text-foreground">hébergements</strong>, <strong className="text-foreground">transferts</strong>, <strong className="text-foreground">visa</strong>, et <strong className="text-foreground">accompagnement spirituel</strong>.
              </p>

              <p>
                Notre site vous guide également dans toutes les étapes de préparation de votre <strong className="text-foreground">voyage Omra</strong> : obtention du <strong className="text-foreground">visa Omra</strong>, choix de la <strong className="text-foreground">meilleure période</strong>, réservation d'<strong className="text-foreground">hôtels proches du Haram</strong>, et conseils pratiques pour réussir votre <strong className="text-foreground">pèlerinage</strong>. Profitez de nos <strong className="text-foreground">comparatifs d'agences Omra</strong>, <strong className="text-foreground">avis clients vérifiés</strong>, et <strong className="text-foreground">guides détaillés</strong> pour organiser sereinement votre voyage spirituel.
              </p>

              <p>
                Que vous recherchiez une <strong className="text-foreground">Omra Ramadan</strong>, une <strong className="text-foreground">Omra dernière minute</strong>, une <strong className="text-foreground">Omra en famille</strong>, ou une <strong className="text-foreground">Omra pour femme seule</strong>, <strong className="text-foreground">Omra Bons Plans</strong> centralise toutes les informations nécessaires pour faire le bon choix. Comparez les <strong className="text-foreground">prix Omra 2026</strong>, les <strong className="text-foreground">services proposés</strong>, et les <strong className="text-foreground">avis pèlerins</strong> pour réserver en toute confiance.
              </p>

              <p>
                Rejoignez des milliers de pèlerins satisfaits qui ont trouvé leur <strong className="text-foreground">forfait Omra idéal</strong> sur <strong className="text-foreground">Omra Bons Plans</strong>. Commencez dès maintenant à planifier votre <strong className="text-foreground">voyage à La Mecque et Médine</strong> avec le leader du <strong className="text-foreground">comparateur de voyages Omra</strong> en France.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 px-6 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern-modern opacity-20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
                Partagez vos suggestions pour améliorer Omra Bons Plans : votre avis compte
              </h2>
              <p className="text-primary-foreground/90 text-xl leading-relaxed">
                Votre expérience et vos idées sont essentielles pour nous aider à améliorer notre plateforme. Partagez vos suggestions, demandes de nouvelles fonctionnalités ou retours d'expérience pour rendre Omra Bons Plans encore plus utile à la communauté
              </p>
            </div>
            
            <FeedbackForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Logo and Description */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Logo size={80} className="text-primary" />
                <span className="text-lg font-normal text-foreground tracking-tight">
                  Omra Bons Plans
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Omra Bons Plans est la première plateforme de voyages
                religieux dédiée à l'organisation des pèlerinages
                d'Omra pour les francophones et
                anglophones, restez connecté avec nous.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                  <span className="text-sm">📘</span>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                  <span className="text-sm">🐦</span>
                </div>
                <a 
                  href="https://0d32be0f-306d-480b-b7fd-a00d6f7142c4.lovableproject.com/**"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
                  aria-label="Suivez-nous sur Instagram"
                >
                  <DynamicIcon name="instagram" className="w-4 h-4 text-primary" />
                </a>
                <a 
                  href="https://www.tiktok.com/@omrabonsplans.fr?_t=ZS-8ze7UP4jLne&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
                  aria-label="Suivez-nous sur TikTok"
                >
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* A propos */}
            <div>
              <h3 className="font-bold text-lg mb-6">A propos</h3>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><Link to="/about" className="hover:text-primary transition-colors">Qui sommes nous ?</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/comparatif-agences" className="hover:text-primary transition-colors">Comparatif Agences</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Vip</Link></li>
              </ul>
            </div>
            
            {/* Service */}
            <div>
              <h3 className="font-bold text-lg mb-6">Service</h3>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><Link to="/comparatif-agences" className="hover:text-primary transition-colors">Comparatif Agences</Link></li>
                <li><Link to="/prayer-times" className="hover:text-primary transition-colors">Horaires de Prière</Link></li>
                <li><Link to="/islamic-calendar" className="hover:text-primary transition-colors">Calendrier Islamique</Link></li>
                <li><Link to="/ramadan-hajj-dates" className="hover:text-primary transition-colors">Dates Ramadan & Hajj</Link></li>
              </ul>
            </div>
            
            {/* Autre */}
            <div>
              <h3 className="font-bold text-lg mb-6">Autre</h3>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><Link to="#" className="hover:text-primary transition-colors">Voyage</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Restauration</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Activité</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Hôtels</Link></li>
              </ul>
            </div>
          </div>
          
          {/* SEO Footer Content */}
          <div className="border-t border-border pt-8 pb-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                <strong className="text-foreground">Omra Bons Plans</strong> est le site de référence pour préparer votre <strong className="text-foreground">voyage Omra</strong> et votre <strong className="text-foreground">Hajj 2026</strong>. Avec des conseils pratiques, des comparatifs d'<strong className="text-foreground">agences Omra</strong>, des explications claires sur le <strong className="text-foreground">visa Omra</strong>, et des astuces pour trouver une <strong className="text-foreground">Omra pas chère</strong>, nous vous aidons à vivre votre pèlerinage dans les meilleures conditions.
              </p>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Que vous soyez en pleine préparation spirituelle ou à la recherche d'informations pratiques, ce site est là pour vous accompagner à chaque étape.
              </p>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-border pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Omra Bons Plans Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
      </div>
    </ResponsiveLayout>
  );
};

export default Index;
