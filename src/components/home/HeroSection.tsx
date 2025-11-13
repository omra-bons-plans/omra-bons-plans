import React from "react";
import { Search, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";
import UserMenu from "@/components/ui/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroSectionProps {
  searchQuery: string;
  selectedCity: string;
  onSearchChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onSearch: () => void;
}

export const HeroSection = ({ 
  searchQuery, 
  selectedCity,
  onSearchChange,
  onCityChange,
  onSearch
}: HeroSectionProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div className="hero-section relative min-h-[400px] md:min-h-[500px] flex flex-col">
      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-foreground hover:bg-accent"
              >
                Connexion
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-primary text-primary-foreground hover:bg-primary-dark"
              >
                Inscription
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Content */}
      <div className="hero-media absolute inset-0 z-0">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/hero-kaaba-2025-optimized.avif"
            type="image/avif"
            width="750"
            height="400"
          />
          <img 
            src="/hero-kaaba-2025-new.jpg"
            alt="Comparateur Omra - La Kaaba à La Mecque"
            className="w-full h-full object-cover"
            width="1600"
            height="500"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            style={{ display: 'block' }}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Hero Text & Search */}
      <div className="relative z-10 flex-1 flex items-center justify-center text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Trouvez les meilleurs services pour votre Omra
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
            Comparez et réservez vos séjours, vols et services en toute confiance
          </p>
          
          {/* Search Bar */}
          <div className="bg-card/95 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-xl max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <select
                  value={selectedCity}
                  onChange={(e) => onCityChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="">Toutes les villes</option>
                  <option value="makkah">La Mecque</option>
                  <option value="medina">Médine</option>
                  <option value="jeddah">Djeddah</option>
                </select>
              </div>
              <Button 
                onClick={onSearch}
                size="lg"
                className="bg-primary hover:bg-primary-dark"
              >
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
