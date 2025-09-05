import { useState } from "react";
import { Search, MapPin, Star, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const categories = [
    { id: "sejours", name: "Séjours", icon: "🕌", description: "Packages complets Omra", count: 45 },
    { id: "vols", name: "Vols", icon: "✈️", description: "Billets d'avion", count: 23 },
    { id: "hotels", name: "Hébergements", icon: "🏨", description: "Hôtels et appartements", count: 67 },
    { id: "guides", name: "Guides", icon: "👨‍🏫", description: "Guides spirituels", count: 34 },
    { id: "chauffeurs", name: "Chauffeurs", icon: "🚗", description: "Transport privé", count: 28 },
    { id: "babysitting", name: "Baby-sitting", icon: "👶", description: "Garde d'enfants", count: 12 }
  ];

  const featuredListings = [
    {
      id: 1,
      type: "sejour",
      title: "Omra Confort 5★ - 15 jours",
      price: "2890€",
      originalPrice: "4200€",
      discount: 31,
      isFlashSale: true,
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 124,
      location: "Makkah - Médine",
      company: "Emirates"
    },
    {
      id: 2,
      type: "hotel",
      title: "Hôtel proche Masjid Al Haram",
      price: "85€",
      originalPrice: null,
      discount: 0,
      isFlashSale: false,
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 89,
      location: "Makkah",
      distance: "50m de la mosquée"
    },
    {
      id: 3,
      type: "guide",
      title: "Guide expérimenté - Français/Arabe",
      price: "45€/jour",
      originalPrice: null,
      discount: 0,
      isFlashSale: false,
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 67,
      location: "Makkah - Médine",
      experience: "8 ans d'expérience"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-emerald rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-xl font-bold text-foreground">omrabonsplans.fr</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-foreground hover:text-primary transition-colors">Accueil</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Catégories</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">Connexion</Button>
              <Button size="sm" className="bg-gradient-emerald text-white">Publier</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald to-gold bg-clip-text text-transparent">
            Trouvez votre Omra idéale
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            La première plateforme française dédiée aux annonces Omra. 
            Séjours, vols, hébergements, guides et services pour votre pèlerinage.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-card border border-border/40 rounded-2xl p-6 shadow-elegant">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Que recherchez-vous ?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select 
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Toutes les villes</option>
                  <option value="makkah">Makkah</option>
                  <option value="medine">Médine</option>
                  <option value="jeddah">Jeddah</option>
                </select>
              </div>
              <Button className="w-full bg-gradient-emerald text-white hover:opacity-90">
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-accent/5">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nos catégories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/40">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <Badge variant="secondary" className="bg-emerald/10 text-emerald">
                    {category.count} annonces
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Annonces à la une</h2>
            <Button variant="outline">Voir toutes les annonces</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border-border/40">
                <div className="relative">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {listing.isFlashSale && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white">
                      <Zap className="w-3 h-3 mr-1" />
                      Vente Flash
                    </Badge>
                  )}
                  {listing.discount > 0 && (
                    <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                      -{listing.discount}%
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 line-clamp-2">{listing.title}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{listing.rating}</span>
                    <span className="text-sm text-muted-foreground ml-1">({listing.reviews})</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{listing.location}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">{listing.price}</span>
                      {listing.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">{listing.originalPrice}</span>
                      )}
                    </div>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/40 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-emerald rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">O</span>
                </div>
                <span className="font-bold">omrabonsplans.fr</span>
              </div>
              <p className="text-muted-foreground">
                La plateforme de référence pour organiser votre Omra en toute sérénité.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Catégories</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Séjours</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Vols</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Hébergements</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Guides</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Aide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 omrabonsplans.fr - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
