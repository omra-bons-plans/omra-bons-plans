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

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentWeatherCity, setCurrentWeatherCity] = useState<'makkah' | 'madinah'>('makkah');
  const isMobile = useIsMobile();
  const { data: weatherAndExchange, loading: weatherLoading, refetch: refetchWeather } = useWeatherAndExchange();
  const { user } = useAuth();
  const { formattedListings, loading: adsLoading, error: adsError } = useAds();

  const categories = [
    { id: "sejours", name: "Séjours", icon: Building, description: "Packages complets Omra", count: 0 },
    { id: "vols", name: "Vols", icon: Plane, description: "Billets d'avion", count: 0 },
    { id: "hebergement", name: "Hébergements", icon: Hotel, description: "Hôtels et appartements", count: 0 },
    { id: "guides", name: "Guides", icon: BookOpen, description: "Guides spirituels", count: 0 },
    { id: "chauffeurs", name: "Chauffeurs", icon: Car, description: "Transport privé", count: 0 },
    { id: "babysitting", name: "Baby-sitting", icon: Heart, description: "Garde d'enfants", count: 0 }
  ];

  const stats = [
    { value: "+15M", label: "visiteurs par an", icon: TrendingUp },
    { value: "450", label: "jours / an", icon: Calendar },
    { value: "28", label: "ans d'expertise", icon: Shield },
    { value: "46K+", label: "satisfactions", icon: Users }
  ];

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background">
        
        {/* Desktop Header */}
        <header className="hidden lg:block glass-strong sticky top-0 z-50 border-b border-border/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="h-16 flex items-center">
                  <Logo size={140} className="text-primary object-contain" style={{ maxHeight: '64px' }} />
                </div>
              </div>
              
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
        </header>

        {/* Hero Section avec H1 SEO optimisé */}
        <section className="relative min-h-screen flex items-center overflow-hidden lg:pt-0 pt-16">
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

          <div className="absolute inset-0 islamic-pattern-modern opacity-30 z-10"></div>
          
          <div className="container mx-auto px-6 relative z-20">
            <div className="flex flex-col items-center justify-start text-center min-h-screen pt-20 md:pt-32">
              <div className="space-y-6 md:space-y-10 max-w-4xl">
                <div className="space-y-2 md:space-y-6">
                  <h1 className="text-4xl md:text-8xl font-bold leading-tight">
                    <span className="text-white drop-shadow-lg">Omra 2025 Pas Chère</span><br />
                    <span className="gradient-text-secondary font-black text-6xl md:text-9xl drop-shadow-lg">dès 890€</span><br />
                    <span className="text-white drop-shadow-lg">Pèlerinage à la Mecque</span><br />
                    <span className="text-white drop-shadow-lg">Hajj 2026-2027</span>
                  </h1>
                  
                  <p className="text-lg md:text-3xl font-bold leading-relaxed mt-4">
                    <span className="text-white drop-shadow-lg">🕋 Séjours Omra Ramadan • Packages Famille • Guides Spirituels</span>
                  </p>
                </div>

                {/* Widget météo compact */}
                <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-soft max-w-[280px] mx-auto border border-border/20">
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[10px] sm:text-xs text-gray-500">
                        Données en temps réel
                      </div>
                      <button
                        onClick={refetchWeather}
                        disabled={weatherLoading}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-2 h-2 sm:w-3 sm:h-3 text-gray-600 ${weatherLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sun className="w-4 h-4 text-yellow-500" />
                        <div>
                          <div className="text-xs font-semibold text-gray-800">
                            {currentWeatherCity === 'makkah' ? 'Mecque' : 'Médine'}
                          </div>
                          <div className="text-[10px] text-gray-600">
                            {weatherAndExchange?.weather?.[currentWeatherCity]?.temperature || 'N/A'}°C
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs font-semibold text-gray-800">
                          1€ = {weatherAndExchange?.exchange?.eurToSar || 'N/A'} SAR
                        </div>
                        <div className="text-[10px] text-green-600">
                          Temps réel
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/omra-ramadan">
                    <Button className="btn-modern text-primary-foreground px-8 py-4 text-lg shadow-elevation">
                      🌙 Omra Ramadan 2025
                    </Button>
                  </Link>
                  <Link to="/hajj-2026">
                    <Button variant="outline" className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-primary shadow-elevation">
                      🕋 Hajj 2026-2027
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section SEO enrichie avec contenu optimisé */}
        <section className="py-16 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  Omra 2025 et Hajj 2026-2027 : Votre Pèlerinage à la Mecque au Meilleur Prix
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Découvrez notre sélection exclusive d'<strong className="text-foreground">Omra pas chère</strong> et <strong className="text-foreground">Hajj 2026-2027</strong> avec plus de 500 prestataires certifiés. 
                  Depuis 15 ans, nous accompagnons les pèlerins dans l'organisation de leur voyage spirituel vers les Lieux Saints.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                    🌙 Omra Ramadan et Périodes Privilégiées
                  </h3>
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p className="mb-4">
                      L'<strong className="text-foreground">Omra Ramadan 2025</strong> représente l'expérience spirituelle la plus intense. 
                      Pendant ce mois béni, la Mecque accueille des millions de pèlerins dans une atmosphère unique de recueillement.
                    </p>
                    <p className="mb-4">
                      Chaque mois offre ses avantages pour votre <strong className="text-foreground">pèlerinage à la Mecque</strong> :
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <strong className="text-foreground">Hiver</strong>
                        <p className="text-sm"><strong>Omra janvier</strong>, <strong>Omra février</strong> - climat doux</p>
                      </div>
                      <div>
                        <strong className="text-foreground">Printemps</strong>  
                        <p className="text-sm"><strong>Omra mars</strong>, <strong>Omra avril</strong> - parfait famille</p>
                      </div>
                      <div>
                        <strong className="text-foreground">Été</strong>
                        <p className="text-sm"><strong>Omra juin</strong>, <strong>Omra juillet</strong>, <strong>Omra août</strong> - tarifs bas</p>
                      </div>
                      <div>
                        <strong className="text-foreground">Automne</strong>
                        <p className="text-sm"><strong>Omra septembre</strong>, <strong>Omra octobre</strong>, <strong>Omra novembre</strong>, <strong>Omra décembre</strong></p>  
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                    🕋 Hajj 2026-2027 et Omra en Famille
                  </h3>
                  <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p className="mb-4">
                      Le <strong className="text-foreground">Hajj 2026</strong> et <strong className="text-foreground">Hajj 2027</strong> sont en préparation. 
                      Ce pèlerinage majeur nécessite une organisation que nos experts maîtrisent depuis des décennies.
                    </p>
                    <div className="bg-primary/10 p-6 rounded-xl mb-6">
                      <h4 className="text-xl font-semibold text-foreground mb-3">Hajj pas cher 2026-2027</h4>
                      <p className="mb-2">✅ Packages complets dès 4500€</p>
                      <p className="mb-2">✅ <strong>Omra en famille</strong> avec enfants</p>
                      <p className="mb-2">✅ <strong>Omra vacances scolaires</strong></p>
                      <p>✅ <strong>Omra avec enfants</strong> - services spécialisés</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section statistiques */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA final */}
              <div className="text-center mt-16">
                <p className="text-lg text-muted-foreground mb-6">
                  Rejoignez des milliers de pèlerins qui nous font confiance pour organiser leur 
                  <strong className="text-foreground"> Omra 2025</strong>, <strong className="text-foreground">Hajj 2026</strong> et <strong className="text-foreground">Hajj 2027</strong>
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/category/sejours">
                    <Button className="btn-modern px-6 py-3">
                      Voir les Séjours Omra
                    </Button>
                  </Link>
                  <Link to="/omra-ramadan">
                    <Button variant="outline" className="px-6 py-3">
                      Omra Ramadan 2025
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FeedbackForm />
        <ChatWindow />
      </div>
    </ResponsiveLayout>
  );
};

export default Index;
