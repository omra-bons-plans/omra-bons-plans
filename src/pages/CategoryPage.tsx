import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Filter, MapPin, Building, Plane, Hotel, BookOpen, Car, Heart, Grid, List, SlidersHorizontal, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAds } from "@/hooks/useAds";
import AdCard from "@/components/ui/AdCard";
import MobileLayout from "@/components/mobile/MobileLayout";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { formattedListings, loading } = useAds();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [priceRange, setPriceRange] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get category info
  const getCategoryInfo = (categoryId: string) => {
    const categoryMap = {
      sejours: { name: "Séjours", icon: Building, description: "Packages complets Omra" },
      vols: { name: "Vols", icon: Plane, description: "Billets d'avion" },
      hebergements: { name: "Hébergements", icon: Hotel, description: "Hôtels et appartements" },
      guides: { name: "Guides", icon: BookOpen, description: "Guides spirituels" },
      chauffeurs: { name: "Chauffeurs", icon: Car, description: "Transport privé" },
      babysitting: { name: "Baby-sitting", icon: Heart, description: "Garde d'enfants" }
    };
    return categoryMap[categoryId as keyof typeof categoryMap];
  };

  const categoryInfo = getCategoryInfo(category || "");

  // Filter ads by category
  const categoryListings = formattedListings.filter(listing => {
    if (category === "hebergements") {
      return listing.type === "hebergement";
    }
    return listing.type === category;
  });

  // Apply filters
  const filteredListings = categoryListings.filter(listing => {
    // Search filter
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !listing.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // City filter
    if (selectedCity && selectedCity !== "all" && !listing.location.toLowerCase().includes(selectedCity.toLowerCase())) {
      return false;
    }

    // Price range filter
    if (priceRange && priceRange !== "all") {
      const price = typeof listing.price === 'string' ? 
        parseFloat(listing.price.replace(/[€\s]/g, '')) : listing.price;
      
      switch (priceRange) {
        case "0-500":
          return price <= 500;
        case "500-1000":
          return price > 500 && price <= 1000;
        case "1000-2000":
          return price > 1000 && price <= 2000;
        case "2000+":
          return price > 2000;
        default:
          return true;
      }
    }

    return true;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[€\s]/g, '')) : a.price;
        const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[€\s]/g, '')) : b.price;
        return priceA - priceB;
      case "price-desc":
        const priceDescA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[€\s]/g, '')) : a.price;
        const priceDescB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[€\s]/g, '')) : b.price;
        return priceDescB - priceDescA;
      case "rating":
        return b.rating - a.rating;
      case "popular":
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      default: // recent
        return new Date(b.id).getTime() - new Date(a.id).getTime();
    }
  });

  // Get unique cities for filter
  const cities = [...new Set(categoryListings.map(listing => {
    // S'assurer que location est une string avant d'utiliser split
    if (typeof listing.location === 'string') {
      return listing.location.split(' - ')[0].split(',')[0].trim();
    }
    // Si location n'est pas une string, retourner une valeur par défaut
    return 'Non spécifié';
  }))].sort();

  if (!categoryInfo) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Catégorie introuvable</h1>
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Chargement des annonces...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const Icon = categoryInfo.icon;

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        {category === "vols" ? (
          <div 
            className="relative py-16 lg:py-24 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/lovable-uploads/9620a4d7-67e8-42d0-b852-bee640f652f1.png')`
            }}
          >
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center space-y-4 text-white">
                <div className="flex items-center justify-center space-x-3">
                  <Icon className="w-8 h-8" />
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.name}</h1>
                </div>
                <p className="text-white/80 text-lg">
                  {categoryInfo.description}
                </p>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {sortedListings.length} annonce{sortedListings.length > 1 ? 's' : ''} trouvée{sortedListings.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        ) : category === "chauffeurs" ? (
          <div 
            className="relative py-16 lg:py-24 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/297b56e8-a8c3-4e62-a5f2-6f6f13481412.png')`
            }}
          >
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center space-y-4 text-white">
                <div className="flex items-center justify-center space-x-3">
                  <Icon className="w-8 h-8" />
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.name}</h1>
                </div>
                <p className="text-white/80 text-lg">
                  {categoryInfo.description}
                </p>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {sortedListings.length} annonce{sortedListings.length > 1 ? 's' : ''} trouvée{sortedListings.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        ) : category === "babysitting" ? (
          <div 
            className="relative py-16 lg:py-24 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/lovable-uploads/2ca6155f-3ded-4f14-9525-569582b6e18b.png')`
            }}
          >
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center space-y-4 text-white">
                <div className="flex items-center justify-center space-x-3">
                  <Icon className="w-8 h-8" />
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.name}</h1>
                </div>
                <p className="text-white/80 text-lg">
                  {categoryInfo.description}
                </p>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {sortedListings.length} annonce{sortedListings.length > 1 ? 's' : ''} trouvée{sortedListings.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        ) : category === "guides" ? (
          <div 
            className="relative py-16 lg:py-24 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/b44f7a09-71c3-4dcb-92b6-d93306719835.png')`
            }}
          >
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center space-y-4 text-white">
                <div className="flex items-center justify-center space-x-3">
                  <Icon className="w-8 h-8" />
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.name}</h1>
                </div>
                <p className="text-white/80 text-lg">
                  {categoryInfo.description}
                </p>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {sortedListings.length} annonce{sortedListings.length > 1 ? 's' : ''} trouvée{sortedListings.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        ) : category === "hebergements" ? (
          <div 
            className="relative py-16 lg:py-24 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/ff7dd8f2-dfcd-405e-a4f6-9e59ffc8c580.png')`
            }}
          >
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center space-y-4 text-white">
                <div className="flex items-center justify-center space-x-3">
                  <Icon className="w-8 h-8" />
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.name}</h1>
                </div>
                <p className="text-white/80 text-lg">
                  {categoryInfo.description}
                </p>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {sortedListings.length} annonce{sortedListings.length > 1 ? 's' : ''} trouvée{sortedListings.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-primary text-primary-foreground py-8 lg:py-12">
            <div className="container mx-auto px-4">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Icon className="w-8 h-8" />
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.name}</h1>
                </div>
                <p className="text-primary-foreground/80 text-lg">
                  {categoryInfo.description}
                </p>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {sortedListings.length} annonce{sortedListings.length > 1 ? 's' : ''} trouvée{sortedListings.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </Button>
          </div>
          
          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filtres et recherche</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ville</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range (only for categories with prices) */}
                {['sejours', 'vols', 'hebergements'].includes(category || '') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prix</label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les prix" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les prix</SelectItem>
                        <SelectItem value="0-500">0€ - 500€</SelectItem>
                        <SelectItem value="500-1000">500€ - 1000€</SelectItem>
                        <SelectItem value="1000-2000">1000€ - 2000€</SelectItem>
                        <SelectItem value="2000+">2000€+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Sort */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trier par</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Plus récent</SelectItem>
                      <SelectItem value="popular">Popularité</SelectItem>
                      <SelectItem value="rating">Note</SelectItem>
                      {['sejours', 'vols', 'hebergements'].includes(category || '') && (
                        <>
                          <SelectItem value="price-asc">Prix croissant</SelectItem>
                          <SelectItem value="price-desc">Prix décroissant</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear filters */}
              {(searchQuery || (selectedCity && selectedCity !== "all") || (priceRange && priceRange !== "all") || sortBy !== "recent") && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCity("all");
                      setPriceRange("all");
                      setSortBy("recent");
                    }}
                  >
                    Effacer les filtres
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {sortedListings.length} résultat{sortedListings.length > 1 ? 's' : ''}
            </h2>
            
            {!isMobile && (
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Results */}
          {sortedListings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCity("all");
                    setPriceRange("all");
                    setSortBy("recent");
                  }}
                >
                  Effacer les filtres
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
                : "space-y-4"
            }>
              {sortedListings.map((listing) => (
                <AdCard
                  key={listing.id}
                  listing={listing}
                  className={viewMode === "list" ? "flex-row" : ""}
                  imageHeight={viewMode === "list" ? "h-32" : "h-56"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default CategoryPage;