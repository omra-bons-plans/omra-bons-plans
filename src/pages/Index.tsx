import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, LayoutGrid, List } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
import { CompactAdCard } from "@/components/ui/CompactAdCard";
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

// ⚡ REMOVED: Images imported lazily now to reduce initial JS bundle


const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const isMobile = useIsMobile();
  const { topics } = useTopics();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const selectedTopic = selectedTopicId ? topics.find(t => t.id === selectedTopicId) : null;
  const [flashSalesCarouselApi, setFlashSalesCarouselApi] = useState<any>();
  const [allServicesCarouselApi, setAllServicesCarouselApi] = useState<any>();
  const [flashSalesCurrent, setFlashSalesCurrent] = useState(0);
  const [allServicesCurrent, setAllServicesCurrent] = useState(0);
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAllServicesCategoryOpen, setIsAllServicesCategoryOpen] = useState(false);
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
      image: "/lovable-uploads/81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png",
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
        title="Omra pas chère 2025 🇸🇦 | Comparateur d'agences agréées - Omra Bons Plans"
        description="Comparez les meilleurs séjours Omra 2025 depuis la France 🇫🇷. Trouvez votre Omra pas chère avec vol, visa et hôtels à Makkah & Médine inclus. Offres mises à jour quotidiennement."
        keywords="omra pas chère, omra 2025, séjour omra, agence omra France, vol omra, hôtel Makkah, hôtel Médine, visa omra, omra tout compris, omra ramadan"
        canonical="https://omrabonsplans.fr/"
        ogImage="https://omrabonsplans.fr/hero-kaaba-2025-optimized.avif"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          "name": "Omra Bons Plans",
          "url": "https://omrabonsplans.fr",
          "description": "Comparateur d'agences Omra agréées en France. Séjours tout compris avec vol, visa et hôtels.",
          "areaServed": "France",
          "sameAs": [
            "https://www.instagram.com/omrabonsplans",
            "https://www.tiktok.com/@omrabonsplans.fr"
          ],
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://omrabonsplans.fr/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      {/* Desktop & Tablet Header - Fixed at top */}
      <header className="hidden md:block fixed top-0 left-0 right-0 glass-strong z-50 border-b border-border/20 mb-0">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left aligned */}
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="h-12 md:h-16 flex items-center">
                <Logo size={120} className="text-primary object-contain md:w-[140px]" style={{ maxHeight: '64px' }} />
              </div>
            </div>
            
            {/* Right buttons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {user ? (
                <UserMenu />
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" className="text-sm md:text-base text-muted-foreground hover:text-foreground transition-all duration-300">
                    Se connecter
                  </Button>
                </Link>
              )}
              <Link to="/publish">
                <Button className="btn-modern text-primary-foreground px-4 md:px-8 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base">
                  Publier une annonce
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-background p-0 m-0">

      {/* Hero Section - Mobile First avec dimensions fixes */}
      <section className="hero-wrapper gap-kill -mt-[52px] md:mt-[64px] lg:mt-[80px]" style={{ minHeight: isMobile ? '100vh' : '600px', aspectRatio: isMobile ? '9/16' : '16/9' }}>
        <div className="hero-media" style={{ minHeight: isMobile ? '100vh' : '600px' }}>
          <picture>
            {/* Mobile: Image optimisée 750x1334 */}
            <source
              media="(max-width: 767px)"
              srcSet="/hero-kaaba-2025-optimized.avif"
              type="image/avif"
            />
            {/* Desktop: Image normale */}
            <img
              src="/hero-kaaba-2025-optimized.avif"
              alt="Omra Bons Plans – Séjours Omra et Hajj 2026"
              width="1600"
              height="900"
              fetchPriority="high"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                position: 'absolute',
                inset: 0
              }}
            />
          </picture>
        </div>
        
        <div className="hero-overlay">
          <div className="container mx-auto px-4 md:px-6 relative z-20">
            <div className="flex flex-col items-center justify-center text-center pt-[54px] pb-8 md:pb-12 md:py-20">
              <div className="space-y-4 md:space-y-8 max-w-4xl">
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-white text-2xl md:text-4xl lg:text-5xl">Tous les services</span><br />
                  <span className="gradient-text-secondary font-black text-4xl md:text-6xl lg:text-8xl">Hajj & Omra</span><br />
                  <span className="text-white text-2xl md:text-4xl lg:text-6xl">en un seul endroit</span>
                </h1>
                
                <p className="text-sm md:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto px-2">
                  <span className="text-white">Trouvez facilement des bons plans pour le Hajj et la Omra : chauffeurs, logements, séjours, guides et plus encore</span>
                </p>

                {/* WhatsApp Community Button - Mobile optimized */}
                <div className="mt-6 md:mt-8 max-w-[300px] md:max-w-[320px] mx-auto px-2">
                  <button
                    onClick={() => window.open('https://whatsapp.com/channel/0029VaFFu5P5PO18w7fmTB0M', '_blank')}
                    className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 md:space-x-3 w-full min-h-[48px]"
                  >
                    <div className="relative z-10">
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.506"/>
                      </svg>
                    </div>
                    
                    <div className="relative z-10 flex-1 text-center">
                      <div className="text-xs md:text-sm font-bold leading-tight">Rejoignez la communauté</div>
                      <div className="text-xs md:text-sm font-bold leading-tight">Omra Bons Plans</div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <div className="absolute inset-0 bg-green-400 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></div>
                  </button>
                  
                  <div className="text-center mt-2 md:mt-3">
                    <p className="text-white/80 text-xs md:text-sm">
                      🔥 +5000 membres pour des bons plans exclusifs !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs - Mobile First */}
      <section className="pt-8 md:pt-16 lg:pt-32 pb-12 md:pb-20 px-0 md:px-6">
        <div className="container mx-auto">
          {/* Tabs System */}
          <Tabs defaultValue="annonces" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8 bg-muted/30 rounded-xl p-1 max-w-md mx-auto sticky top-16 md:top-20 z-40 backdrop-blur-md mx-4 md:mx-auto">
              <TabsTrigger 
                value="annonces" 
                className="rounded-lg font-semibold text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all min-h-[44px]"
              >
                <DynamicIcon name="building" className="w-4 h-4 mr-1 md:mr-2" />
                Annonces
              </TabsTrigger>
              <TabsTrigger 
                value="discussions" 
                className="rounded-lg font-semibold text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all min-h-[44px]"
              >
                <DynamicIcon name="message-circle" className="w-4 h-4 mr-1 md:mr-2" />
                Discussions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="annonces" className="space-y-0">
              {/* Flash Sales Section - Mobile First */}
              {filteredFlashSalesListings.length > 0 && (
                <section className="pb-12 md:pb-20">
                  <div className="md:container md:mx-auto max-w-md mx-auto px-4 md:px-6 md:max-w-none">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-3 md:mb-4 gradient-text-primary">
                      Comparez les prix et prestations Omra
                    </h2>
                    <p className="text-center text-muted-foreground mb-8 md:mb-12 text-sm md:text-base lg:text-lg px-2">
                      Trouvez le meilleur rapport qualité-prix pour votre séjour
                    </p>
                    <div className="mb-8 md:mb-16">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-8 mb-6 md:mb-8">
                      <div>
                        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Ventes Flash Omra & Hajj 2026 : Séjours, vols et hébergements à prix réduits</h2>
                        <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Profitez de nos offres promotionnelles limitées sur les packages tout inclus, billets d'avion et hôtels près du Haram</p>
                      </div>
                        
                      </div>
                    </div>

                    {/* Categories - Mobile: Collapsible Menu, Desktop: Pills */}
                    {isMobile ? (
                      <Collapsible open={isCategoryOpen} onOpenChange={setIsCategoryOpen} className="mb-6">
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between w-full px-4 py-3 bg-card border-2 rounded-xl hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <DynamicIcon 
                                name={(selectedCategory === "all" ? "grid-3x3" : getOrderedCategories().find(c => c.id === selectedCategory)?.icon || "grid-3x3") as any} 
                                className="h-5 w-5 text-primary" 
                              />
                              <span className="font-semibold">
                                {selectedCategory === "all" ? "Tous" : (getOrderedCategories().find(c => c.id === selectedCategory)?.name || "Catégories")}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {selectedCategory === "all" ? filteredFlashSalesListings.length : (getOrderedCategories().find(c => c.id === selectedCategory)?.count || 0)}
                              </Badge>
                            </div>
                            <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3">
                          <div className="grid gap-2 p-2 bg-card border-2 rounded-xl">
                            <button
                              onClick={() => {
                                setSelectedCategory("all");
                                setIsCategoryOpen(false);
                              }}
                              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                                selectedCategory === "all"
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <DynamicIcon name="grid-3x3" className="h-5 w-5" />
                                <span className="font-medium">Tous</span>
                              </div>
                              <Badge variant={selectedCategory === "all" ? "secondary" : "outline"} className="ml-2">
                                {filteredFlashSalesListings.length}
                              </Badge>
                            </button>
                            {getOrderedCategories().map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => {
                                  setSelectedCategory(cat.id);
                                  setIsCategoryOpen(false);
                                }}
                                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                                  selectedCategory === cat.id
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <DynamicIcon name={cat.icon as any} className="h-5 w-5" />
                                  <span className="font-medium">{cat.name}</span>
                                </div>
                                {cat.count > 0 && (
                                  <Badge variant={selectedCategory === cat.id ? "secondary" : "outline"} className="ml-2">
                                    {cat.count}
                                  </Badge>
                                )}
                              </button>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3 md:justify-center px-1 scroll-smooth mb-8 md:mb-16">
                        <Button 
                          onClick={() => setSelectedCategory("all")}
                          className={`rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 min-h-[44px] flex items-center gap-2 ${
                            selectedCategory === "all" 
                              ? "btn-modern text-primary-foreground shadow-lg scale-105" 
                              : "glass border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5"
                          }`}
                          variant={selectedCategory === "all" ? "default" : "outline"}
                        >
                          <DynamicIcon name="grid-3x3" className="w-4 h-4" />
                          <span>Tous</span>
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {filteredFlashSalesListings.length}
                          </Badge>
                        </Button>
                        {getOrderedCategories().map((category) => (
                          <Button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 min-h-[44px] flex items-center gap-2 ${
                              selectedCategory === category.id 
                                ? "btn-modern text-primary-foreground shadow-lg scale-105" 
                                : "glass border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5"
                            }`}
                            variant={selectedCategory === category.id ? "default" : "outline"}
                          >
                            <DynamicIcon name={category.icon as any} className="w-4 h-4" />
                            <span>{category.name}</span>
                            {category.count > 0 && (
                              <Badge variant="secondary" className="ml-1 text-xs">
                                {category.count}
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* View Mode Toggle - Mobile Only */}
                    {isMobile && (
                      <div className="flex gap-2 mb-6">
                        <Button
                          variant={viewMode === "list" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className="flex-1 min-h-[44px]"
                        >
                          <List className="h-4 w-4 mr-2" />
                          Liste
                        </Button>
                        <Button
                          variant={viewMode === "grid" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className="flex-1 min-h-[44px]"
                        >
                          <LayoutGrid className="h-4 w-4 mr-2" />
                          Cartes
                        </Button>
                      </div>
                    )}

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

                  {/* Mobile: Vue Liste ou Grille */}
                  <div className="block md:hidden">
                    {viewMode === "list" ? (
                      /* Vue Liste - HORIZONTALE comme comparateur */
                      <div className="space-y-2">
                        {filteredFlashSalesListings.map((listing) => (
                          <Link key={listing.id} to={`/ad/${listing.id}`}>
                            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 border-border/50 bg-card">
                              <div className="flex items-center gap-2 p-2.5">
                                {/* Logo/Image carré à gauche */}
                                {listing.image && (
                                  <div className="flex-shrink-0 w-14 h-14 rounded-md overflow-hidden bg-white shadow-sm">
                                    <img
                                      src={listing.image}
                                      alt={listing.title}
                                      loading="lazy"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}

                                {/* Infos au milieu */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-sm truncate">{listing.title}</h3>
                                  
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                    {listing.rating && (
                                      <>
                                        <DynamicIcon name="star" className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="font-medium">{listing.rating}</span>
                                      </>
                                    )}
                                    {listing.subtitle && (
                                      <span className="truncate">• {listing.subtitle}</span>
                                    )}
                                  </div>

                                  {listing.location && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                      <DynamicIcon name="map-pin" className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">{listing.location}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Prix à droite */}
                                <div className="flex-shrink-0 text-right pl-2">
                                  {listing.price && (
                                    <div className="font-bold text-sm text-primary whitespace-nowrap">
                                      {listing.price}
                                    </div>
                                  )}
                                  {listing.originalPrice && (
                                    <div className="text-xs text-muted-foreground line-through">
                                      {listing.originalPrice}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      /* Vue Cartes - VERTICALE complète comme comparateur */
                      <div className="space-y-4">
                        {filteredFlashSalesListings.map((listing) => (
                          <Link key={listing.id} to={`/ad/${listing.id}`}>
                            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/30 bg-card">
                              {/* Image/Logo grande */}
                              {listing.image && (
                                <div className="relative h-48 bg-white flex items-center justify-center p-6">
                                  <img
                                    src={listing.image}
                                    alt={listing.title}
                                    loading="lazy"
                                    className="w-full h-full object-contain"
                                  />
                                  {/* Badges sur l'image */}
                                  {(listing.isPromo || listing.isPopular) && (
                                    <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                                      {listing.isPromo && (
                                        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 font-bold text-xs">
                                          -{listing.discount}% 🔥
                                        </Badge>
                                      )}
                                      {listing.isPopular && (
                                        <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 font-bold text-xs">
                                          ⭐ Populaire
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Titre et note */}
                              <div className="px-4 pt-4 pb-3 text-center border-b border-border">
                                <h3 className="font-bold text-lg mb-2">{listing.title}</h3>
                                {listing.rating && (
                                  <div className="flex items-center justify-center gap-1">
                                    <DynamicIcon name="star" className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-semibold">{listing.rating}</span>
                                  </div>
                                )}
                              </div>

                              {/* Prix en évidence */}
                              {listing.price && (
                                <div className="px-4 py-4 bg-primary/5 text-center">
                                  <div className="text-sm text-muted-foreground mb-1">Prix</div>
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="text-3xl font-bold text-primary">{listing.price}</span>
                                    {listing.originalPrice && (
                                      <span className="text-sm text-muted-foreground line-through">{listing.originalPrice}</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Détails */}
                              <div className="p-4 space-y-3">
                                {listing.subtitle && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <DynamicIcon name="calendar" className="w-4 h-4 text-muted-foreground" />
                                    <span>{listing.subtitle}</span>
                                  </div>
                                )}

                                {listing.location && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <DynamicIcon name="map-pin" className="w-4 h-4 text-muted-foreground" />
                                    <span>{listing.location}</span>
                                  </div>
                                )}

                                {/* Bouton CTA */}
                                <Button className="w-full mt-4" size="lg">
                                  Voir l'offre
                                  <DynamicIcon name="external-link" className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

      {/* Introduction SEO Section - Mobile First */}
      <section className="py-8 md:py-12 lg:py-16 px-4 md:px-6 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-4 md:space-y-6 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Préparez votre Omra 2026 avec Omra Bons Plans
            </h2>
            <div className="space-y-3 md:space-y-4 text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed">
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

      {/* All Services Section - Mobile First */}
      <section className="py-12 md:py-16 lg:py-20 px-0 md:px-6">
        <div className="md:container md:mx-auto max-w-md mx-auto px-4 md:px-6 md:max-w-none">
          <div className="mb-8 md:mb-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-8 mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Services Hajj & Omra en 2026</h2>
                <p className="text-muted-foreground text-sm md:text-base lg:text-lg">Découvrez nos conseils pour trouver une <strong>Omra pas chère</strong> adaptée à votre budget</p>
              </div>
            </div>
          </div>

          {/* Categories - Mobile: Collapsible Menu, Desktop: Pills */}
          {isMobile ? (
            <Collapsible open={isAllServicesCategoryOpen} onOpenChange={setIsAllServicesCategoryOpen} className="mb-6">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between w-full px-4 py-3 bg-card border-2 rounded-xl hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <DynamicIcon 
                      name={(selectedCategory === "all" ? "grid-3x3" : getAllOrderedCategories().find(c => c.id === selectedCategory)?.icon || "grid-3x3") as any} 
                      className="h-5 w-5 text-primary" 
                    />
                    <span className="font-semibold">
                      {selectedCategory === "all" ? "Tous" : (getAllOrderedCategories().find(c => c.id === selectedCategory)?.name || "Catégories")}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {selectedCategory === "all" ? filteredListings.length : (getAllOrderedCategories().find(c => c.id === selectedCategory)?.count || 0)}
                    </Badge>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isAllServicesCategoryOpen ? 'rotate-180' : ''}`} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="grid gap-2 p-2 bg-card border-2 rounded-xl">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setIsAllServicesCategoryOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      selectedCategory === "all"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <DynamicIcon name="grid-3x3" className="h-5 w-5" />
                      <span className="font-medium">Tous</span>
                    </div>
                    <Badge variant={selectedCategory === "all" ? "secondary" : "outline"} className="ml-2">
                      {filteredListings.length}
                    </Badge>
                  </button>
                  {getAllOrderedCategories().map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsAllServicesCategoryOpen(false);
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        selectedCategory === cat.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <DynamicIcon name={cat.icon as any} className="h-5 w-5" />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      {cat.count > 0 && (
                        <Badge variant={selectedCategory === cat.id ? "secondary" : "outline"} className="ml-2">
                          {cat.count}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3 md:justify-center px-1 scroll-smooth mb-8 md:mb-16">
              <Button 
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 min-h-[44px] flex items-center gap-2 ${
                  selectedCategory === "all" 
                    ? "btn-modern text-primary-foreground shadow-lg scale-105" 
                    : "glass border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5"
                }`}
                variant={selectedCategory === "all" ? "default" : "outline"}
              >
                <DynamicIcon name="grid-3x3" className="w-4 h-4" />
                <span>Tous</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredListings.length}
                </Badge>
              </Button>
              {getAllOrderedCategories().map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 min-h-[44px] flex items-center gap-2 ${
                    selectedCategory === category.id 
                      ? "btn-modern text-primary-foreground shadow-lg scale-105" 
                      : "glass border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                >
                  <DynamicIcon name={category.icon as any} className="w-4 h-4" />
                  <span>{category.name}</span>
                  {category.count > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {category.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}

          {/* View Mode Toggle - Mobile Only */}
          {isMobile && (
            <div className="flex gap-2 mb-6">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex-1 min-h-[44px]"
              >
                <List className="h-4 w-4 mr-2" />
                Liste
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex-1 min-h-[44px]"
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Cartes
              </Button>
            </div>
          )}

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

          {/* Mobile: Liste verticale full-width */}
          {filteredListings.length > 0 ? (
            <div className="block md:hidden space-y-4 mb-16">
              {filteredListings.slice(0, 6).map((listing) => (
                <Link key={listing.id} to={`/ad/${listing.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50">
                    <div className="relative h-48 bg-muted">
                      {listing.image && (
                        <img
                          src={listing.image}
                          alt={listing.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        {listing.isPromo && (
                          <Badge className="bg-destructive text-destructive-foreground font-bold shadow-lg">
                            -{listing.discount}% OFF
                          </Badge>
                        )}
                        {listing.isPopular && (
                          <Badge className="bg-primary text-primary-foreground font-bold shadow-lg">
                            ⭐ Recommandé
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-bold text-base line-clamp-2">
                          {listing.title}
                        </h3>
                        {listing.subtitle && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {listing.subtitle}
                          </p>
                        )}
                      </div>
                      
                      {listing.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DynamicIcon name="map-pin" className="w-4 h-4 mr-1.5" />
                          <span>{listing.location}</span>
                        </div>
                      )}
                      
                      {listing.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <DynamicIcon name="star" className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="ml-1 font-semibold text-sm">{listing.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({listing.reviews} avis)
                          </span>
                        </div>
                      )}
                      
                      {listing.price && (
                        <div className="flex items-end justify-between pt-2 border-t">
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-primary">
                              {listing.price}
                            </div>
                            {listing.originalPrice && (
                              <div className="text-sm text-muted-foreground line-through">
                                {listing.originalPrice}
                              </div>
                            )}
                          </div>
                          <Button size="sm" className="btn-modern">
                            Voir l'offre
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
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
        
        {/* Load More Button - Mobile First */}
        {hasMore && filteredListings.length > 0 && (
          <div className="text-center py-8 md:py-12">
            <Button 
              onClick={loadMore}
              disabled={adsLoading}
              variant="outline"
              size="lg"
              className="px-6 md:px-8 py-3 text-sm md:text-base font-semibold min-h-[48px]"
            >
              {adsLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Chargement...
                </>
              ) : (
                `Voir plus (${total - formattedListings.length})`
              )}
            </Button>
          </div>
        )}
      </section>

      {/* Additional Services - Mobile First */}
      <section className="py-8 md:py-12 lg:py-20 px-4 md:px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16 items-center">
            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold break-words">Séjours populaires en ce moment</h2>
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed">
                Découvrez nos offres les plus demandées par période
              </p>
              
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-primary">Omra Janvier 2025</h3>
                <p className="text-muted-foreground text-sm md:text-base">Profitez des prix attractifs de la basse saison avec des hôtels proches du Haram.</p>
                
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-primary mt-4 md:mt-6">Omra Ramadan 2025</h3>
                <p className="text-muted-foreground text-sm md:text-base">Vivez le Ramadan à La Mecque, période la plus spirituelle de l'année.</p>
                
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-primary mt-4 md:mt-6">Omra Décembre 2025</h3>
                <p className="text-muted-foreground text-sm md:text-base">Partez pendant les vacances scolaires, idéal pour les familles.</p>
              </div>
              
              <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold break-words mt-8 md:mt-12">Services complémentaires à La Mecque et Médine</h2>
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed break-words">
                Enrichissez votre voyage spirituel avec nos guides pratiques : trouvez les meilleurs restaurants halal certifiés à proximité du Haram, réservez vos billets pour le train haute vitesse Haramain Express reliant La Mecque, Médine et Jeddah pour des déplacements confortables.
              </p>
              
              <div className="space-y-4 md:space-y-6 mt-6 md:mt-8">
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold">Restaurants halal & Transport</h3>
                <Link to="/blog/restaurants" className="flex items-start space-x-4 hover:bg-background/50 p-3 rounded-lg transition-colors group">
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

      {/* Notre Mission Section - Mobile First */}
      <section className="py-8 md:py-12 lg:py-16 xl:py-24 px-4 md:px-6 bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern-modern opacity-5"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground">
              Notre mission : faciliter votre Omra et Hajj
            </h2>
            
            <div className="prose prose-lg max-w-none text-left">
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6">
                Depuis plus de dix ans à Makkah, j'ai accompagné plus de 5000 pèlerins dans leur Omra et leur Hajj. J'ai pu voir leurs joies, leurs difficultés, leurs questions, et surtout leur soif de bien faire.
              </p>
              
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6">
                C'est pour répondre à ces besoins que j'ai créé <strong className="text-primary font-semibold">Omra Bons Plans</strong>. Ce site n'est pas une agence, mais un guide indépendant qui vous aide à :
              </p>
              
              <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2 md:mr-3 mt-1">✓</span>
                  <span className="text-muted-foreground text-sm md:text-base lg:text-lg">Choisir une <strong className="font-semibold">Omra adaptée à votre budget</strong>.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 md:mr-3 mt-1">✓</span>
                  <span className="text-muted-foreground text-sm md:text-base lg:text-lg">Comprendre les <strong className="font-semibold">différences de prix Omra</strong> entre les offres.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 md:mr-3 mt-1">✓</span>
                  <span className="text-muted-foreground text-sm md:text-base lg:text-lg">Trouver la bonne <strong className="font-semibold">agence Omra</strong> selon votre situation.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 md:mr-3 mt-1">✓</span>
                  <span className="text-muted-foreground text-sm md:text-base lg:text-lg">Préparer sereinement le <strong className="font-semibold">Hajj 2026</strong>, étape par étape.</span>
                </li>
              </ul>
              
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed">
                Mon but est simple : vous accompagner avec sincérité et bienveillance, en partageant des informations fiables et des rappels spirituels, afin que votre voyage soit un succès matériel et surtout spirituel.
              </p>
            </div>
          </div>
        </div>
      </section>
            </TabsContent>

            <TabsContent value="discussions" className="space-y-0">
              <div className="py-6 md:py-8">
          <div className="text-center mb-6 md:mb-8 px-4">
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

      {/* Articles récents Section - Mobile First */}
      <section className="py-8 md:py-12 lg:py-16 xl:py-24 px-4 md:px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-3 md:mb-4">Guides et articles complets pour préparer votre Omra et Hajj 2026 : rituels, visa, choix d'agence</h2>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg px-2">Consultez nos guides détaillés rédigés par des experts pour bien préparer votre pèlerinage : explications des rites, démarches administratives, comparatif d'agences et conseils pratiques essentiels</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Article 1 - Types de Hajj */}
            <div className="bg-background rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-5 md:p-6 space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl font-bold">Quels sont les trois types de Hajj ?</h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Savez-vous qu'il existe trois manières d'accomplir le Hajj ? Le Tamattu', le Qiran et l'Ifrad. Dans cet article, je partage mon expérience et j'explique en détail leurs différences, leurs avantages et la sagesse derrière ces rites.
                </p>
                <Link 
                  to="/blog/general/quels-sont-les-trois-types-de-hajj" 
                  className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-colors text-sm md:text-base min-h-[44px] pt-2"
                >
                  Lire la suite
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Article 2 - Préparation Omra */}
            <div className="bg-background rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-5 md:p-6 space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl font-bold">Comment préparer sa première Omra ?</h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Vous partez pour votre première Omra et vous vous posez mille questions ? Ce guide complet vous accompagne pas à pas : du visa aux rites, en passant par les erreurs à éviter et les conseils pratiques essentiels pour un pèlerinage réussi.
                </p>
                <Link 
                  to="/blog/general/guide-complet-de-la-omra-tapes-rituels-et-conseils-pratique" 
                  className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-colors text-sm md:text-base min-h-[44px] pt-2"
                >
                  Lire la suite
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Article 3 - Choisir son agence */}
            <div className="bg-background rounded-xl md:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-5 md:p-6 space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl font-bold">Comment choisir son agence Omra ?</h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Face à la multitude d'offres, comment s'y retrouver ? Dans cet article, je vous donne les critères essentiels pour identifier une agence Omra sérieuse et fiable. Tarifs, transparence, avis clients : tout ce qu'il faut savoir avant de réserver.
                </p>
                <Link 
                  to="/blog/general/hajj-ou-omra-quelle-agence-choisir" 
                  className="inline-flex items-center text-primary hover:text-primary/80 font-semibold transition-colors text-sm md:text-base min-h-[44px] pt-2"
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

      {/* SEO Content Section - Mobile First */}
      <section className="py-8 md:py-12 lg:py-16 xl:py-24 px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Pourquoi choisir Omra Bons Plans ?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto">
              La plateforme de référence pour trouver et comparer les meilleures offres Omra 2025.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DynamicIcon name="shield" className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Agences agréées</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Accédez à une sélection des meilleures agences Omra, reconnues pour leur fiabilité. Réservez votre pèlerinage en toute confiance avec des professionnels certifiés.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DynamicIcon name="star" className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Avis vérifiés</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Consultez les retours d'expérience authentiques de milliers de pèlerins. Prenez une décision éclairée grâce aux avis certifiés de notre communauté.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DynamicIcon name="headset" className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Assistance 7j/7</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bénéficiez d'un support réactif avant, pendant et après votre voyage. Notre équipe est disponible pour répondre à toutes vos questions.
                </p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DynamicIcon name="search" className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Recherche facilitée</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Trouvez rapidement les meilleures offres Omra parmi notre sélection rigoureuse. Comparez en un clic les séjours économiques et premium.
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
                  Explorez les meilleurs prix Omra 2025. Comparez facilement les tarifs, les itinéraires et les prestations pour économiser temps et argent.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DynamicIcon name="clock" className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Offres mises à jour</h3>
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

      {/* Blog Categories Section - SEO Internal Links */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Découvrez nos Guides & Ressources
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explorez nos catégories pour trouver toutes les informations essentielles pour votre voyage Omra et Hajj
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Blog Général */}
            <Link to="/blog/general" className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <DynamicIcon name="book-open" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    Blog Général
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Guides complets, conseils d'experts et articles sur l'Omra, le Hajj et la spiritualité
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Restaurants */}
            <Link to="/blog/restaurants" className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <DynamicIcon name="utensils" className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    Restaurants Halal
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Sélection des meilleurs restaurants halal certifiés à La Mecque et Médine
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Associations */}
            <Link to="/blog/associations" className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <DynamicIcon name="heart" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    Associations
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Associations musulmanes et organisations caritatives au service de la communauté
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Vendeurs */}
            <Link to="/blog/vendeurs" className="group">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <DynamicIcon name="store" className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    Vendeurs & Commerçants
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Annuaire des commerçants et artisans de confiance pour tous vos besoins
                  </p>
                </CardContent>
              </Card>
            </Link>
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
            
            {/* Blog Categories */}
            <div>
              <h3 className="font-bold text-lg mb-6">Blog & Guides</h3>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><Link to="/blog/general" className="hover:text-primary transition-colors">Blog Général</Link></li>
                <li><Link to="/blog/restaurants" className="hover:text-primary transition-colors">Restaurants Halal</Link></li>
                <li><Link to="/blog/associations" className="hover:text-primary transition-colors">Associations</Link></li>
                <li><Link to="/blog/vendeurs" className="hover:text-primary transition-colors">Vendeurs & Commerçants</Link></li>
              </ul>
            </div>
            
            {/* Service */}
            <div>
              <h3 className="font-bold text-lg mb-6">Service</h3>
              <ul className="space-y-4 text-muted-foreground text-sm">
                <li><Link to="/comparatif-agences" className="hover:text-primary transition-colors">Comparatif Agences</Link></li>
                <li><Link to="/comparateur-omra" className="hover:text-primary transition-colors">Comparateur Séjours Omra</Link></li>
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

      {/* Floating Publish Button - Mobile Only */}
      {isMobile && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
          <Link to="/publish">
            <Button 
              className="btn-modern text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 min-h-[48px]"
            >
              <DynamicIcon name="plus" className="w-5 h-5 mr-2" />
              Publier une annonce
            </Button>
          </Link>
        </div>
      )}
      </div>
    </ResponsiveLayout>
  );
};

export default Index;
