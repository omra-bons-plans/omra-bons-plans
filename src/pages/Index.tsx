import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Star, Clock, Eye, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAds } from "@/hooks/useAds";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import ChatWindow from "@/components/ui/ChatWindow";

const SimpleIndex = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  
  const { ads, loading } = useAds();

  // Apply filters and sorting
  const filteredAds = ads
    .filter(ad => {
      const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ad.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || ad.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default: // recent
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      hebergements: "Hébergement",
      vols: "Vol",
      sejours: "Séjour",
      guides: "Guide",
      chauffeurs: "Chauffeur",
      babysitting: "Babysitting"
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 animate-gradient-x"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Votre plateforme de services pour le Hajj et la Omra
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Trouvez tous les services dont vous avez besoin pour votre pèlerinage : hébergements, vols, guides spirituels et bien plus encore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
              <Link to="/publish/category">Publier une annonce</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth">Se connecter</Link>
            </Button>
          </div>
        </div>
      </section>

      <Tabs defaultValue="ads" className="w-full">
        <div className="border-b">
          <div className="max-w-7xl mx-auto px-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="ads" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Annonces
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Discussion
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="ads" className="mt-0">
          {/* Search and Filters */}
          <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Rechercher une annonce..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes catégories</SelectItem>
                      <SelectItem value="hebergements">Hébergements</SelectItem>
                      <SelectItem value="vols">Vols</SelectItem>
                      <SelectItem value="sejours">Séjours</SelectItem>
                      <SelectItem value="guides">Guides</SelectItem>
                      <SelectItem value="chauffeurs">Chauffeurs</SelectItem>
                      <SelectItem value="babysitting">Babysitting</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Plus récent</SelectItem>
                      <SelectItem value="price_asc">Prix croissant</SelectItem>
                      <SelectItem value="price_desc">Prix décroissant</SelectItem>
                      <SelectItem value="rating">Mieux notés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          {/* Ads Grid */}
          <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Dernières annonces</h2>
              
              {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-video bg-muted"></div>
                      <CardContent className="p-6">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                        <div className="h-6 bg-muted rounded w-1/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAds.map((ad) => (
                    <Link key={ad.id} to={`/ad/${ad.id}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-primary/10 hover:-translate-y-1">
                        <div className="aspect-video bg-muted relative overflow-hidden rounded-t-lg">
                          {ad.coverImage ? (
                            <img 
                              src={ad.coverImage} 
                              alt={ad.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                              <span className="text-muted-foreground">Pas d'image</span>
                            </div>
                          )}
                          <Badge className="absolute top-2 left-2 bg-primary text-white">
                            {getCategoryLabel(ad.category)}
                          </Badge>
                          {ad.isPromotion && (
                            <Badge className="absolute top-2 right-2 bg-destructive text-white">
                              Promotion
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {ad.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {ad.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            {ad.location && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{ad.location}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {ad.rating && ad.rating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">
                                    {ad.rating.toFixed(1)}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    ({ad.reviews || 0})
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              {ad.originalPrice && ad.originalPrice > ad.price && (
                                <span className="text-sm text-muted-foreground line-through mr-2">
                                  {ad.originalPrice}€
                                </span>
                              )}
                              <span className="text-xl font-bold text-primary">
                                {ad.price}€
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-muted-foreground text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {formatDistanceToNow(new Date(ad.createdAt), {
                                    addSuffix: true,
                                    locale: fr
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && filteredAds.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucune annonce trouvée pour votre recherche.</p>
                </div>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="chat" className="mt-0">
          <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto flex justify-center">
              <ChatWindow />
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimpleIndex;