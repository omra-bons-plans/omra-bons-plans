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
        title={`${categoryInfo.name} pour Omra & Hajj 2026 - ${sortedListings.length} Offres | Omra Bons Plans`}
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

          {/* Section informative SEO */}
          <Card className="mb-8 bg-muted/30">
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {category === 'sejours' && (
                  <div className="space-y-4">
                    <p>
                      Découvrez notre sélection exclusive de <strong>packages Omra et Hajj 2026</strong> tout inclus proposés par des agences de voyage certifiées. Chaque séjour comprend les vols internationaux, les hébergements en hôtels 4 ou 5 étoiles situés à proximité immédiate du Haram de La Mecque et de la Mosquée du Prophète à Médine, les transferts terrestres climatisés, les visas, l&apos;accompagnement spirituel par des guides francophones expérimentés, et l&apos;assurance voyage complète.
                    </p>
                    <p>
                      Nos séjours s&apos;adaptent à tous les budgets et toutes les durées : formules économiques de 7 jours pour une première Omra, packages standards de 10 à 15 jours pour une expérience complète, ou séjours premium de 21 jours avec services VIP et chambres face au Haram. Voyagez en groupe avec d&apos;autres pèlerins francophones ou optez pour un séjour individuel personnalisé selon vos dates et préférences.
                    </p>
                  </div>
                )}
                {category === 'vols' && (
                  <div className="space-y-4">
                    <p>
                      Comparez et réservez vos <strong>billets d&apos;avion vers Jeddah et Médine</strong> au meilleur prix pour votre Omra ou Hajj 2026. Nous proposons des vols directs et avec escale au départ des principales villes françaises (Paris, Lyon, Marseille, Toulouse, Nantes, Nice) vers l&apos;Arabie Saoudite. Les vols directs sur compagnies régulières (Saudi Airlines, Air France, Turkish Airlines) offrent un confort optimal avec une durée de vol de 5 à 6 heures, tandis que les vols avec escale permettent d&apos;économiser sur le budget tout en garantissant un bon service.
                    </p>
                    <p>
                      Profitez de nos tarifs négociés avec les compagnies aériennes partenaires et bénéficiez de conditions avantageuses : bagages en soute généreux (2x23kg minimum), repas halal à bord, flexibilité de modification, et assurance annulation incluse. Réservez vos vols en avance pour garantir les meilleures disponibilités, particulièrement pendant les périodes de forte affluence comme le Ramadan et les vacances scolaires.
                    </p>
                  </div>
                )}
                {category === 'hebergements' && (
                  <div className="space-y-4">
                    <p>
                      Trouvez l&apos;<strong>hébergement idéal pour votre séjour Omra ou Hajj</strong> parmi notre large sélection d&apos;hôtels, appartements meublés et résidences hôtelières à La Mecque et Médine. Les hôtels situés à proximité directe du Haram Sharif offrent un accès privilégié aux lieux saints : marchez seulement 2 à 5 minutes à pied pour rejoindre la Kaaba ou la mosquée du Prophète. Pour les familles nombreuses, les appartements spacieux avec cuisine équipée permettent plus d&apos;intimité et d&apos;économies sur les repas.
                    </p>
                    <p>
                      Notre gamme comprend toutes les catégories : hôtels économiques 3 étoiles à partir de 50€/nuit pour les budgets serrés, hôtels confort 4 étoiles autour de 100€/nuit avec vue sur le Haram, et hôtels de luxe 5 étoiles comme Hilton, Fairmont ou Swissôtel avec services premium (spa, restaurants gastronomiques, room service 24h). Tous les hébergements sont vérifiés et garantissent propreté, sécurité et respect des normes islamiques.
                    </p>
                  </div>
                )}
                {category === 'guides' && (
                  <div className="space-y-4">
                    <p>
                      Bénéficiez de l&apos;accompagnement spirituel d&apos;un <strong>guide Omra francophone expérimenté</strong> pour vivre pleinement votre pèlerinage en Arabie Saoudite. Nos guides diplômés possèdent une connaissance approfondie des rites du Hajj et de la Omra, maîtrisent parfaitement l&apos;arabe et le français, et ont accompagné des centaines de pèlerins au fil des années. Ils vous enseigneront les invocations authentiques (douas), vous expliqueront la signification spirituelle de chaque rituel, et vous aideront à accomplir correctement tous les piliers du pèlerinage.
                    </p>
                    <p>
                      L&apos;accompagnement comprend généralement les services suivants : explication détaillée des rites avant le départ, assistance pendant le Ihram et le Tawaf autour de la Kaaba, guidance pour le Sa&apos;i entre Safa et Marwa, enseignement des prières spécifiques, visites des sites historiques (grotte de Hira, mont Uhud, cimetière Al-Baqi), conférences religieuses quotidiennes, et disponibilité 24h/24 pour répondre à toutes vos questions. Optez pour un guide privé pour un service personnalisé ou rejoignez un groupe de 15-20 pèlerins pour partager cette expérience spirituelle enrichissante.
                    </p>
                  </div>
                )}
                {category === 'chauffeurs' && (
                  <div className="space-y-4">
                    <p>
                      Réservez votre <strong>chauffeur privé professionnel</strong> pour tous vos déplacements en Arabie Saoudite pendant votre Omra ou Hajj. Nos chauffeurs expérimentés connaissent parfaitement les routes entre Jeddah, La Mecque, Médine et tous les sites importants du pèlerinage. Ils conduisent des véhicules modernes climatisés et confortables (berlines, minibus 7-15 places) parfaitement entretenus et respectant toutes les normes de sécurité saoudiennes.
                    </p>
                    <p>
                      Les services proposés incluent : transfert aéroport vers votre hôtel, navettes quotidiennes entre votre hébergement et le Haram, excursions vers les sites historiques (grotte de Hira, mont Arafat, mosquée de Quba), déplacements pour le shopping dans les souks traditionnels, et transport inter-villes (trajet Médine-La Mecque en 5h). Nos chauffeurs francophones peuvent également servir de guides touristiques et vous donner des conseils pratiques sur les meilleures adresses pour manger, faire des courses, et découvrir l&apos;Arabie Saoudite authentique. Tarifs dégressifs pour les réservations longue durée et les groupes familiaux.
                    </p>
                  </div>
                )}
                {category === 'babysitting' && (
                  <div className="space-y-4">
                    <p>
                      Profitez pleinement de votre <strong>pèlerinage spirituel</strong> en confiant vos enfants à nos services de <strong>garde professionnels et sécurisés</strong> à La Mecque et Médine. Nos baby-sitters qualifiées sont des femmes musulmanes pratiquantes, parfaitement bilingues français-arabe, formées aux premiers secours, et expérimentées dans la garde d&apos;enfants de tous âges (nourrissons, bambins, enfants). Elles créent un environnement chaleureux, éducatif et amusant pendant que vous accomplissez vos rites religieux en toute tranquillité d&apos;esprit.
                    </p>
                    <p>
                      Les services incluent : garde à l&apos;hôtel pendant vos prières au Haram (minimum 2h, maximum 8h par jour), activités ludiques et éducatives adaptées à l&apos;âge (jeux islamiques, apprentissage du Coran, contes du prophète), préparation et service des repas pour les enfants, aide aux devoirs pour les enfants scolarisés, et couchers selon les routines habituelles. Toutes nos baby-sitters ont été vérifiées avec certificat de bonne moralité, références contrôlées, et assurance responsabilité civile. Réservation flexible à la journée, à la demi-journée, ou pour toute la durée de votre séjour avec tarifs dégressifs. Service de garde de nuit disponible sur demande pour les parents souhaitant prier Tahajjud au Haram.
                    </p>
                  </div>
                )}
              </div>
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