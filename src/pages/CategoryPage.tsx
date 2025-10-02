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
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { SEOHead } from "@/components/SEO/SEOHead";
import { SEOBreadcrumb } from "@/components/SEO/SEOBreadcrumb";
import { generateCleanCanonicalUrl } from "@/utils/seoHelpers";
import { Helmet } from "react-helmet-async";

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
      sejours: { name: "Séjours", icon: Building, description: "Packages complets Omra", h1: "Séjours Omra Hajj Packages Complets", h2: "Découvrez notre sélection de packages tout inclus pour votre pèlerinage : vols, hébergement, transferts et accompagnement spirituel" },
      vols: { name: "Vols", icon: Plane, description: "Billets d'avion", h1: "Vols Omra Hajj Billets Avion", h2: "Comparez les meilleurs tarifs de vols directs et avec escale vers Jeddah et Médine pour votre Omra ou Hajj" },
      hebergements: { name: "Hébergements", icon: Hotel, description: "Hôtels et appartements", h1: "Hébergements Omra Hajj Mecca Medina", h2: "Trouvez l'hébergement idéal à La Mecque et Médine : hôtels face au Haram, appartements familiaux et résidences de luxe" },
      guides: { name: "Guides", icon: BookOpen, description: "Guides spirituels", h1: "Guides Spirituels Omra Hajj Expérimentés", h2: "Accompagnement spirituel personnalisé par des guides francophones expérimentés pour accomplir vos rites en toute sérénité" },
      chauffeurs: { name: "Chauffeurs", icon: Car, description: "Transport privé", h1: "Chauffeurs Privés Omra Hajj Transport", h2: "Service de transport privé avec chauffeur francophone pour vos déplacements entre La Mecque, Médine et les lieux saints" },
      babysitting: { name: "Baby-sitting", icon: Heart, description: "Garde d'enfants", h1: "Services Baby-sitting Omra et Hajj", h2: "Services de garde d'enfants professionnels et sécurisés pour vous permettre d'accomplir votre pèlerinage en toute tranquillité" }
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
      <ResponsiveLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Catégorie introuvable</h1>
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (loading) {
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

  const Icon = categoryInfo.icon;

  return (
    <ResponsiveLayout>
      <SEOHead 
        title={`${categoryInfo.name} Omra & Hajj - ${sortedListings.length} Annonces 2026`}
        description={`Découvrez ${sortedListings.length} annonces de ${categoryInfo.name.toLowerCase()} pour votre Omra et Hajj 2026. ${categoryInfo.description} au meilleur prix.`}
        keywords={`${categoryInfo.name.toLowerCase()} omra, hajj ${categoryInfo.name.toLowerCase()}, ${category} omra 2026`}
        canonical={`https://omrabonsplans.fr/category/${category}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `${categoryInfo.name} Omra & Hajj`,
          "description": categoryInfo.description,
          "url": `https://omrabonsplans.fr/category/${category}`,
          "numberOfItems": sortedListings.length
        }}
      />
      <div className="min-h-screen bg-background">
        <SEOBreadcrumb 
          items={[
            { name: 'Accueil', url: '/' },
            { name: categoryInfo.name, url: `/category/${category}` }
          ]}
          className="container mx-auto px-4 pt-4"
        />
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
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.h1}</h1>
                </div>
                <h2 className="text-lg lg:text-xl text-white/90 font-semibold max-w-3xl mx-auto">
                  {categoryInfo.h2}
                </h2>
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
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.h1}</h1>
                </div>
                <h2 className="text-lg lg:text-xl text-white/90 font-semibold max-w-3xl mx-auto">
                  {categoryInfo.h2}
                </h2>
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
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.h1}</h1>
                </div>
                <h2 className="text-lg lg:text-xl text-white/90 font-semibold max-w-3xl mx-auto">
                  {categoryInfo.h2}
                </h2>
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
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/2b8f6eaa-5bcc-4d13-9f74-64f2d80de369.png')`
            }}
          >
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center space-y-4 text-white">
                <div className="flex items-center justify-center space-x-3">
                  <Icon className="w-8 h-8" />
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.h1}</h1>
                </div>
                <h2 className="text-lg lg:text-xl text-white/90 font-semibold max-w-3xl mx-auto">
                  {categoryInfo.h2}
                </h2>
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
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.h1}</h1>
                </div>
                <h2 className="text-lg lg:text-xl text-white/90 font-semibold max-w-3xl mx-auto">
                  {categoryInfo.h2}
                </h2>
                <p className="text-white/80 text-lg">
                  {categoryInfo.description}
                </p>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  {sortedListings.length} annonce{sortedListings.length > 1 ? 's' : ''} trouvée{sortedListings.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        ) : category === "sejours" ? (
          <div 
            className="relative py-16 lg:py-24 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/56a2ede6-440b-4caf-8593-87bdc843a439.png')`
            }}
          >
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center space-y-4 text-white">
                <div className="flex items-center justify-center space-x-3">
                  <Icon className="w-8 h-8" />
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.h1}</h1>
                </div>
                <h2 className="text-lg lg:text-xl text-white/90 font-semibold max-w-3xl mx-auto">
                  {categoryInfo.h2}
                </h2>
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
                  <h1 className="text-3xl lg:text-4xl font-bold">{categoryInfo.h1}</h1>
                </div>
                <h2 className="text-lg lg:text-xl text-primary-foreground/90 font-semibold max-w-3xl mx-auto">
                  {categoryInfo.h2}
                </h2>
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
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2 bg-background hover:bg-muted border-2"
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
    </ResponsiveLayout>
  );
};

export default CategoryPage;