import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Star, Clock, Zap, TrendingUp, Users, Calendar, Shield, Sun, Cloud, CloudRain, CloudSnow, Cloudy, Building, Plane, Hotel, BookOpen, Car, Heart, ChevronDown, UtensilsCrossed, HelpingHand, Leaf, Activity, MessageCircle, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWeatherAndExchange } from "@/hooks/useWeatherAndExchange";
import { useAuth } from "@/contexts/AuthContext";
import { useAds } from "@/hooks/useAds";
import CountdownTimer from "@/components/ui/CountdownTimer";
import UserMenu from "@/components/ui/UserMenu";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import FeedbackForm from "@/components/ui/FeedbackForm";
import AdCard from "@/components/ui/AdCard";
import Logo from "@/components/ui/Logo";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatWindow from "@/components/ui/ChatWindow";

// Import images
import meccaMosqueHero from "@/assets/mecca-mosque-hero.jpg";
import luxuryHotelMecca from "@/assets/luxury-hotel-mecca.jpg";
import tourGuideMecca from "@/assets/tour-guide-mecca.jpg";
import airplaneInterior from "@/assets/airplane-interior.jpg";

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
  const isMobile = useIsMobile();
  const [flashSalesCarouselApi, setFlashSalesCarouselApi] = useState<CarouselApi>();
  const [allServicesCarouselApi, setAllServicesCarouselApi] = useState<CarouselApi>();
  const [flashSalesCurrent, setFlashSalesCurrent] = useState(0);
  const [allServicesCurrent, setAllServicesCurrent] = useState(0);
  const { data: weatherAndExchange, loading: weatherLoading, refetch: refetchWeather } = useWeatherAndExchange();
  const { user } = useAuth();
  const { formattedListings, loading: adsLoading, error: adsError } = useAds();

  // Refs pour les sections de scroll
  const flashSalesTabsRef = useRef<HTMLDivElement>(null);
  const flashSalesCardsRef = useRef<HTMLDivElement>(null);
  const allServicesTabsRef = useRef<HTMLDivElement>(null);
  const allServicesCardsRef = useRef<HTMLDivElement>(null);

  // Allow manual city selection for weather
  const toggleWeatherCity = () => {
    setCurrentWeatherCity(prev => prev === 'makkah' ? 'madinah' : 'makkah');
  };

  // Auto-switch between cities every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeatherCity(prev => prev === 'makkah' ? 'madinah' : 'makkah');
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Track carousel positions
  useEffect(() => {
    console.log('💡 Index page: Setting up flash sales carousel');
    if (!flashSalesCarouselApi) return;

    flashSalesCarouselApi.on("select", () => {
      setFlashSalesCurrent(flashSalesCarouselApi.selectedScrollSnap());
    });
  }, [flashSalesCarouselApi]);

  useEffect(() => {
    if (!allServicesCarouselApi) return;

    allServicesCarouselApi.on("select", () => {
      setAllServicesCurrent(allServicesCarouselApi.selectedScrollSnap());
    });
  }, [allServicesCarouselApi]);

  const getCategoryCount = (categoryId: string) => {
    return formattedListings.filter(listing => listing.type === categoryId).length;
  };

  const categories = [
    { id: "sejours", name: "Séjours", icon: Building, description: "Packages complets Omra", count: getCategoryCount("sejours") },
    { id: "vols", name: "Vols", icon: Plane, description: "Billets d'avion", count: getCategoryCount("vols") },
    { id: "hebergement", name: "Hébergements", icon: Hotel, description: "Hôtels et appartements", count: getCategoryCount("hebergement") },
    { id: "guides", name: "Guides", icon: BookOpen, description: "Guides spirituels", count: getCategoryCount("guides") },
    { id: "chauffeurs", name: "Chauffeurs", icon: Car, description: "Transport privé", count: getCategoryCount("chauffeurs") },
    { id: "babysitting", name: "Baby-sitting", icon: Heart, description: "Garde d'enfants", count: getCategoryCount("babysitting") }
  ];

  // Auto-scroll pour mobile uniquement - Version simplifiée
  useEffect(() => {
    if (!isMobile) return;
    
    const performScroll = (selector: string, name: string) => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        console.log(`✅ Scroll ${name}:`, element);
        element.scrollTo({ left: 150, behavior: 'smooth' });
        setTimeout(() => {
          element.scrollTo({ left: 0, behavior: 'smooth' });
        }, 1000);
      } else {
        console.log(`❌ Element not found: ${name} - ${selector}`);
      }
    };

    // Animation séquentielle sur mobile avec décalage marqué
    setTimeout(() => performScroll('.flash-sales-tabs-container .overflow-x-auto', 'Flash Sales Tabs'), 2000);
    setTimeout(() => performScroll('.flash-sales-cards-container [data-embla-scroll-container]', 'Flash Sales Cards'), 5000);
    setTimeout(() => performScroll('.all-services-tabs-container .overflow-x-auto', 'All Services Tabs'), 8000);
    setTimeout(() => performScroll('.all-services-cards-container [data-embla-scroll-container]', 'All Services Cards'), 11000);
    
  }, [isMobile]);

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
    console.log('⏳ Index page: Loading ads...');
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
    { value: "+15M", label: "visiteurs par an", icon: TrendingUp },
    { value: "450", label: "jours / an", icon: Calendar },
    { value: "28", label: "ans d'expertise", icon: Shield },
    { value: "46K+", label: "satisfactions", icon: Users }
  ];

  return (
    <ResponsiveLayout>
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
        {/* Background Image - Desktop */}
        <div 
          className="absolute inset-0 z-0 hidden md:block"
          style={{
            backgroundImage: `url(/lovable-uploads/81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="hero-overlay absolute inset-0"></div>
        </div>

        {/* Background Image - Mobile uniquement */}
        <div 
          className="absolute inset-0 z-0 block md:hidden"
          style={{
            backgroundImage: `url(/lovable-uploads/d5128689-bda3-4612-9ae8-6910ed21a8c8.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="hero-overlay absolute inset-0"></div>
        </div>

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
                  <span className="text-white drop-shadow-lg">Organisez votre</span><br />
                  <span className="gradient-text-secondary font-black text-6xl md:text-9xl drop-shadow-lg">OMRA 2025</span><br />
                  <span className="text-white drop-shadow-lg"> et partez au</span><br />
                  <span className="text-white drop-shadow-lg">meilleur prix !</span>
                </h1>
                
                <p className="text-lg md:text-3xl font-bold leading-relaxed mt-4">
                  <span className="text-white drop-shadow-lg">Réduisez vos coûts, pas vos rêves</span>
                </p>
              </div>

              {/* Compact Weather & Exchange Widget */}
              <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-soft max-w-[280px] mx-auto border border-border/20 
                             scale-110 sm:scale-100 sm:p-3 sm:max-w-xs">
                <div className="flex flex-col gap-1 sm:gap-2">
                  {/* Header with refresh button */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[10px] sm:text-xs text-gray-500">
                      Données en temps réel
                    </div>
                    <button
                      onClick={refetchWeather}
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
                      />
                      <button
                        onClick={() => setCurrentWeatherCity('makkah')}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                          currentWeatherCity === 'makkah' 
                            ? 'bg-amber-500 shadow-sm' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
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
                        {weatherAndExchange?.exchange?.eurToSar || '4.39'}
                      </span> Sar
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Community Button */}
              <div className="mt-8">
                <button
                  onClick={() => window.open('https://chat.whatsapp.com/BI3ZaOGPAQs2iTISdceqKe', '_blank')}
                  className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
                >
                  {/* WhatsApp Icon */}
                  <div className="relative z-10">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.506"/>
                    </svg>
                  </div>
                  
                  {/* Text Content */}
                  <div className="relative z-10 text-left">
                    <div className="text-lg font-bold">Rejoindre notre communauté</div>
                    <div className="text-sm opacity-90">OmraBonsPlans sur WhatsApp</div>
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
                <Building className="w-4 h-4 mr-2" />
                Annonces
              </TabsTrigger>
              <TabsTrigger 
                value="discussions" 
                className="rounded-lg font-semibold text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Discussions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="annonces" className="space-y-0">
              {/* Flash Sales Section */}
              <section className="pb-20">
        <div className="md:container md:mx-auto max-w-md mx-auto px-6 md:px-6 md:max-w-none">
          <div className="mb-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">Ventes Flash</h2>
                <p className="text-muted-foreground text-lg">Offres limitées à saisir rapidement</p>
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
          {filteredFlashSalesListings.length > 0 ? (
            <div className="hidden lg:grid grid-cols-4 gap-8">
              {filteredFlashSalesListings.map((listing) => (
                <AdCard 
                  key={listing.id} 
                  listing={listing}
                  imageHeight="h-56"
                />
              ))}
            </div>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">✏️</span>
              </div>
              <div className="text-center space-y-3 max-w-md">
                <h3 className="text-2xl font-bold text-foreground">
                  Aucune annonce n'est disponible pour cette recherche pour le moment
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nous travaillons activement à enrichir notre site pour mieux répondre à vos besoins.
                </p>
              </div>
            </div>
          )}

          {/* Tablet: Carousel with 2 items */}
          {filteredFlashSalesListings.length > 0 ? (
            <div className="hidden md:block lg:hidden carousel-item-peek">
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {filteredFlashSalesListings.map((listing) => (
                  <CarouselItem key={listing.id} className="pl-4 basis-1/2">
                    <Card 
                      className="card-modern overflow-hidden border-border/20 bg-card/50 cursor-pointer transition-transform hover:scale-105"
                      onClick={() => navigate(`/ad/${listing.id}`)}
                    >
                      <div className="relative group">
                        <div className="w-full h-56 overflow-hidden">
                          <img 
                            src={listing.image} 
                            alt={listing.title}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                            onError={(e) => {
                              console.log('Flash sale tablet image failed to load:', listing.image);
                              const target = e.target as HTMLImageElement;
                              target.src = '/ad-placeholder.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        </div>
                        
                        {listing.isPopular && (
                          <Badge className="absolute top-4 left-4 bg-gradient-primary text-primary-foreground text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-full font-semibold shadow-medium">
                            ⭐ Populaire
                          </Badge>
                        )}
                        
                        {listing.isFlashSale && (
                          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-full font-semibold flash-pulse">
                            <Zap className="w-3 h-3 mr-1" />
                            <span>Flash</span>
                          </Badge>
                        )}
                        
                         {listing.isFlashSale && listing.flashSaleEndDate && (
                           <div className="absolute top-16 right-4">
                             <CountdownTimer 
                               targetDate={listing.flashSaleEndDate} 
                               className="text-xs scale-50 origin-top-right"
                             />
                           </div>
                         )}
                        
                        <div className="absolute bottom-4 right-4">
                          <Badge className="glass text-xs px-3 py-2 rounded-full font-semibold">
                             {listing.type === 'sejours' ? 'Séjour' : 
                              listing.type === 'hotels' ? 'Hôtel' : 
                              listing.type === 'guides' ? 'Guide' : 
                              listing.type === 'vols' ? 'Vols' :
                              listing.type === 'chauffeurs' ? 'Chauffeur' : 'Service'}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-xl line-clamp-1">{listing.title}</h3>
                          <p className="text-muted-foreground line-clamp-1">{listing.subtitle}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                             <span className="font-semibold">{listing.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">({listing.reviews} avis)</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{listing.location}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {['guides', 'chauffeurs', 'babysitting'].includes(listing.type) ? (
                            <div className="space-y-1">
                              <div className="text-lg font-semibold text-primary">Service disponible</div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-baseline space-x-2">
                                <span className="text-2xl font-bold text-primary">{listing.price}</span>
                                {listing.originalPrice && (
                                  <span className="text-sm text-muted-foreground line-through">{listing.originalPrice}</span>
                                )}
                              </div>
                              {listing.discount && (
                                <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                                  -{listing.discount}%
                                </Badge>
                              )}
                            </div>
                          )}
                          <Button className="btn-modern px-6 py-2 text-sm">
                            {['guides', 'chauffeurs', 'babysitting'].includes(listing.type) ? 'Contacter' : 'Réserver'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
          ) : (
            <div className="hidden md:block lg:hidden flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">✏️</span>
              </div>
              <div className="text-center space-y-3 max-w-md">
                <h3 className="text-2xl font-bold text-foreground">
                  Aucune annonce n'est disponible pour cette recherche pour le moment
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nous travaillons activement à enrichir notre site pour mieux répondre à vos besoins.
                </p>
              </div>
            </div>
          )}

          {/* Mobile: Carousel with 1 item */}
          {filteredFlashSalesListings.length > 0 ? (
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
          ) : (
            <div className="flex md:hidden flex-col items-center justify-center py-20 space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">✏️</span>
              </div>
              <div className="text-center space-y-3 max-w-md px-6">
                <h3 className="text-xl font-bold text-foreground">
                  Aucune annonce n'est disponible pour cette recherche pour le moment
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Nous travaillons activement à enrichir notre site pour mieux répondre à vos besoins.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* All Services Section - Now first */}
      <section className="py-20 px-0 md:px-6">
        <div className="md:container md:mx-auto max-w-md mx-auto px-6 md:px-6 md:max-w-none">
          <div className="mb-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">Votre plateforme de services pour le hajj et la omra</h2>
                <p className="text-muted-foreground text-lg">Découvrez tous nos services pour un voyage parfait</p>
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
                <h3 className="text-2xl font-bold text-foreground">
                  Aucune annonce n'est disponible pour cette recherche pour le moment
                </h3>
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
                      <Card 
                        className="card-modern overflow-hidden border-border/20 bg-card/50 cursor-pointer transition-transform hover:scale-105"
                        onClick={() => navigate(`/ad/${listing.id}`)}
                      >
                        <div className="relative group">
                          <div className="w-full h-56 overflow-hidden">
                            <img 
                              src={listing.image} 
                              alt={listing.title}
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                              onError={(e) => {
                                console.log('Tablet image failed to load:', listing.image);
                                const target = e.target as HTMLImageElement;
                                target.src = '/ad-placeholder.jpg';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                          </div>
                          
                          {listing.isPopular && (
                            <Badge className="absolute top-4 left-4 bg-gradient-primary text-primary-foreground text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-full font-semibold shadow-medium">
                              ⭐ Populaire
                            </Badge>
                          )}
                          
                          {listing.isFlashSale && (
                            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-full font-semibold flash-pulse">
                              <Zap className="w-3 h-3 mr-1" />
                              <span>Flash</span>
                            </Badge>
                          )}
                          
                           {listing.isFlashSale && listing.flashSaleEndDate && (
                             <div className="absolute top-16 right-4">
                               <CountdownTimer 
                                 targetDate={listing.flashSaleEndDate} 
                                 className="text-xs scale-50 origin-top-right"
                               />
                             </div>
                           )}
                          
                          <div className="absolute bottom-4 right-4">
                            <Badge className="glass text-xs px-3 py-2 rounded-full font-semibold">
                               {listing.type === 'sejours' ? 'Séjour' : 
                                listing.type === 'hotels' ? 'Hôtel' : 
                                listing.type === 'guides' ? 'Guide' : 
                                listing.type === 'vols' ? 'Vols' :
                                listing.type === 'chauffeurs' ? 'Chauffeur' : 'Service'}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="p-6 space-y-4">
                          <div className="space-y-2">
                            <h3 className="font-bold text-xl line-clamp-1">{listing.title}</h3>
                            <p className="text-muted-foreground line-clamp-1">{listing.subtitle}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                               <span className="font-semibold">{listing.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">({listing.reviews} avis)</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{listing.location}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            {['guides', 'chauffeurs', 'babysitting'].includes(listing.type) ? (
                              <div className="space-y-1">
                                <div className="text-lg font-semibold text-primary">Service disponible</div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex items-baseline space-x-2">
                                  <span className="text-2xl font-bold text-primary">{listing.price}</span>
                                  {listing.originalPrice && (
                                    <span className="text-sm text-muted-foreground line-through">{listing.originalPrice}</span>
                                  )}
                                </div>
                                {listing.discount && (
                                  <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                                    -{listing.discount}%
                                  </Badge>
                                )}
                              </div>
                            )}
                            <Button className="btn-modern px-6 py-2 text-sm">
                              {['guides', 'chauffeurs', 'babysitting'].includes(listing.type) ? 'Contacter' : 'Réserver'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
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
                <h3 className="text-xl font-bold text-foreground">
                  Aucune annonce n'est disponible pour cette recherche pour le moment
                </h3>
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
                  <h3 className="text-xl font-bold text-foreground">
                    Aucune annonce n'est disponible pour cette recherche pour le moment
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Nous travaillons activement à enrichir notre site pour mieux répondre à vos besoins.
                  </p>
                </div>
              </div>
            )}
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 px-6 bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Autres services</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Explorez encore plus Omra Granite des services pour vos voyages religieux:
                les invitations, des navettes de transport, des décès artistisques et standards.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Restaurants</h3>
                    <p className="text-sm text-muted-foreground">Découvrez les meilleurs restaurants halal</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🚂</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Trains</h3>
                    <p className="text-sm text-muted-foreground">Liaisons train avec la 3</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location de voitures</h3>
                    <p className="text-sm text-muted-foreground">Louez une voiture à l'heure ou à la journée</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Image */}
            <div className="relative">
              <div className="bg-gradient-subtle rounded-3xl overflow-hidden shadow-large">
                <div className="aspect-video bg-gradient-primary/20 flex items-center justify-center">
                  <div className="text-9xl opacity-40">🍽️</div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-secondary rounded-full opacity-80"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
            </TabsContent>

            <TabsContent value="discussions" className="space-y-0">
              <div className="py-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold mb-4">Discussions</h2>
                  <p className="text-muted-foreground text-lg">Échangez avec la communauté OmraBonsPlans</p>
                </div>
                <div className="max-w-4xl mx-auto">
                  <ChatWindow />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 px-6 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern-modern opacity-20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
                Aidez-nous à nous améliorer
              </h2>
              <p className="text-primary-foreground/90 text-xl leading-relaxed">
                Vos idées et conseils sont précieux ! Partagez vos suggestions pour améliorer notre plateforme
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
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                  <span className="text-sm">📷</span>
                </div>
              </div>
            </div>
            
            {/* A propos */}
            <div>
              <h4 className="font-bold text-lg mb-6">A propos</h4>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><Link to="/about" className="hover:text-primary transition-colors">Qui sommes nous ?</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Vip</Link></li>
              </ul>
            </div>
            
            {/* Service */}
            <div>
              <h4 className="font-bold text-lg mb-6">Service</h4>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><Link to="#" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Nous que Voir</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Comment</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Vous</Link></li>
              </ul>
            </div>
            
            {/* Autre */}
            <div>
              <h4 className="font-bold text-lg mb-6">Autre</h4>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><Link to="#" className="hover:text-primary transition-colors">Voyage</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Restauration</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Activité</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Hôtels</Link></li>
              </ul>
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
