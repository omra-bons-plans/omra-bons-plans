import { useState } from "react";
import { Search, MapPin, Star, Clock, Zap, TrendingUp, Users, Calendar, Shield } from "lucide-react";
import { Link } from "react-router-dom";
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
      title: "Saciet abou yahya",
      subtitle: "15 jours avec hôtel 5 étoiles",
      price: "1450€",
      originalPrice: "1890€",
      discount: 23,
      isFlashSale: true,
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 124,
      location: "Makkah - Médine",
      isPopular: true
    },
    {
      id: 2,
      type: "hotel", 
      title: "ALBATT",
      subtitle: "Hôtel proche Masjid Al Haram",
      price: "1690€",
      originalPrice: "2100€", 
      discount: 19,
      isFlashSale: false,
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 89,
      location: "Makkah",
      isPopular: false
    },
    {
      id: 3,
      type: "guide",
      title: "Omra Pour Tous", 
      subtitle: "Guide expérimenté - Français/Arabe",
      price: "990€",
      originalPrice: "1250€",
      discount: 21,
      isFlashSale: false,
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 67,
      location: "Makkah - Médine",
      isPopular: false
    },
    {
      id: 4,
      type: "guide",
      title: "Ouasis tours",
      subtitle: "Accompagnement personnalisé",
      price: "80€",
      originalPrice: "120€",
      discount: 33,
      isFlashSale: true,
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 95,
      location: "Médine",
      isPopular: false
    }
  ];

  const stats = [
    { value: "+15M", label: "visiteurs par an", icon: TrendingUp },
    { value: "450", label: "jours / an", icon: Calendar },
    { value: "28", label: "ans d'expertise", icon: Shield },
    { value: "46K+", label: "satisfactions", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-primary-foreground font-bold text-lg">O</span>
              </div>
              <span className="text-xl font-bold text-foreground">omrabonsplans.fr</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">Venir Book</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Categories</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Ajouter</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Se connecter</a>
            </nav>
            <Link to="/publish">
              <Button className="bg-primary hover:bg-primary-dark text-primary-foreground px-6">
                Publier une annonce
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-16 h-16 bg-secondary/20 rounded-full"></div>
        <div className="absolute top-32 right-32 w-8 h-8 bg-primary/30 rounded-full"></div>
        <div className="absolute bottom-20 left-10 w-12 h-12 bg-warning/20 rounded-full"></div>
        
        <div className="container mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="text-foreground">Organisez votre</span><br />
                  <span className="gradient-text-secondary">OMRA 2025</span>
                  <span className="text-foreground"> et</span><br />
                  <span className="text-foreground">partez au meilleur</span><br />
                  <span className="text-foreground">prix !</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Réduisez vos coûts, pas vos rêves
                </p>
              </div>

              {/* Price highlight */}
              <div className="flex items-center space-x-4 p-4 bg-card rounded-2xl border border-border shadow-soft max-w-sm">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🕌</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prix le plus bas</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-primary">32°</span>
                    <span className="text-lg text-muted-foreground">Prix en baisse de 3.95 Sar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Images Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 transform rotate-3">
                <div className="space-y-4">
                  <div className="w-40 h-32 bg-gradient-primary rounded-2xl shadow-large flex items-center justify-center">
                    <span className="text-4xl">🕌</span>
                  </div>
                  <div className="w-32 h-40 bg-gradient-secondary rounded-2xl shadow-medium flex items-center justify-center">
                    <span className="text-4xl">🏛️</span>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="w-36 h-28 bg-card border-2 border-secondary rounded-2xl shadow-medium flex items-center justify-center">
                    <span className="text-3xl">📿</span>
                  </div>
                  <div className="w-40 h-36 bg-gradient-hero rounded-2xl shadow-large flex items-center justify-center">
                    <span className="text-4xl">☪️</span>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-soft">
                <span className="text-2xl">✨</span>
              </div>
              <div className="absolute -bottom-6 -right-2 w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💫</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sales Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold mb-4">Ventes Flash</h2>
            <p className="text-muted-foreground text-lg">Offres limitées à saisir rapidement</p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button variant="default" className="bg-primary text-primary-foreground rounded-full px-8 py-3">
              Séjours
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-3 border-border hover:bg-accent">
              Vols
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-3 border-border hover:bg-accent">
              Hébergements
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden border border-border bg-card">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-subtle flex items-center justify-center">
                    <span className="text-6xl opacity-40">🕌</span>
                  </div>
                  
                  {listing.isPopular && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1">
                      Populaire
                    </Badge>
                  )}
                  
                  {listing.isFlashSale && (
                    <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs px-2 py-1 flash-pulse">
                      <Zap className="w-3 h-3 mr-1" />
                      Vente Flash
                    </Badge>
                  )}
                  
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-card text-card-foreground border border-border text-xs">
                      {listing.type === 'sejour' ? 'Séjour' : 
                       listing.type === 'hotel' ? 'Hôtel' : 
                       listing.type === 'guide' ? 'Guide' : 'Service'}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{listing.subtitle}</p>
                  
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 fill-secondary text-secondary mr-1" />
                    <span className="text-sm font-medium">{listing.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({listing.reviews})</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        {listing.originalPrice && (
                          <p className="text-xs text-muted-foreground line-through">{listing.originalPrice}</p>
                        )}
                        <p className="text-2xl font-bold text-primary">{listing.price}</p>
                      </div>
                      {listing.discount > 0 && (
                        <Badge className="bg-success text-success-foreground">
                          -{listing.discount}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" className="px-8 py-3 rounded-full border-border hover:bg-accent">
              Voir toutes les offres
            </Button>
          </div>
        </div>
      </section>

      {/* All Services Section */}
      <section className="py-20 px-6 bg-accent/30">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold mb-4">Tout ce dont vous avez besoin en un seul endroit</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Une plateforme complète pour organiser votre pèlerinage en toute sérénité
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button variant="default" className="bg-primary text-primary-foreground rounded-full px-8 py-3">
              Séjours
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-3 border-border hover:bg-accent">
              Vols
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-3 border-border hover:bg-accent">
              Hébergements
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-3 border-border hover:bg-accent">
              Guides
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-3 border-border hover:bg-accent">
              Chauffeurs
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-3 border-border hover:bg-accent">
              Baby-Sitting
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <Card key={`all-${listing.id}`} className="group hover:shadow-large transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden border border-border bg-card">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-subtle flex items-center justify-center">
                    <span className="text-6xl opacity-40">
                      {listing.type === 'sejour' ? '🕌' : 
                       listing.type === 'hotel' ? '🏨' : 
                       listing.type === 'guide' ? '👨‍🏫' : '🛎️'}
                    </span>
                  </div>
                  
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-card text-card-foreground border border-border text-xs">
                      {listing.type === 'sejour' ? 'Séjour' : 
                       listing.type === 'hotel' ? 'Hôtel' : 
                       listing.type === 'guide' ? 'Guide' : 'Service'}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{listing.subtitle}</p>
                  
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 fill-secondary text-secondary mr-1" />
                    <span className="text-sm font-medium">{listing.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({listing.reviews})</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-primary">{listing.price}</p>
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
        <div className="absolute top-10 right-10 w-24 h-24 bg-secondary/10 rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/10 rounded-full"></div>
        
        <div className="container mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold">
                  <span className="text-foreground">Des réductions en exclusivité</span><br />
                  <span className="text-foreground">sur </span>
                  <span className="gradient-text-secondary">Omra Bons plans</span>
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Grâce aux bons plans pour un voyage Omra remarquable
                  découvrant chez vous, activités, décontracte et fassc vous en vous
                  déplaçant. Profitez des réductions sur tous les services
                  détenus ou VIETNAM CANADA Enquêter Ideal structure.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold gradient-text-secondary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Person Image Placeholder */}
            <div className="relative">
              <div className="w-full max-w-md mx-auto">
                <div className="bg-gradient-primary rounded-3xl p-8 shadow-large">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl">👨‍👩‍👧‍👦</span>
                    </div>
                    <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🕌</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-primary-foreground font-semibold">Famille satisfaite</p>
                    <p className="text-primary-foreground/80 text-sm">Pèlerinage réussi</p>
                  </div>
                </div>
              </div>
              
              {/* Floating decorations */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-soft">
                <span className="text-2xl">✨</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-warning/30 rounded-full"></div>
            </div>
          </div>
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
                les invitations, des navettes de transport, des décès artistisques et standards,
                registrations des éléments GREEN développement sur voyage omra item.
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

            {/* Service Image Placeholder */}
            <div className="relative">
              <div className="bg-gradient-subtle rounded-3xl p-12 shadow-large">
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 bg-primary/20 rounded-2xl mx-auto flex items-center justify-center">
                    <span className="text-6xl">🕌</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Services Premium</h3>
                    <p className="text-muted-foreground">
                      Découvrez nos services exclusifs pour un pèlerinage inoubliable
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-secondary rounded-full opacity-80"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 bg-gradient-primary">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-primary-foreground">S'abonner à notre newsletter</h2>
            <p className="text-primary-foreground/90 text-lg">
              Vous serez toujours informé. Inscrivez-vous à notre mailing et obtenez off res
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Votre email ici"
                className="bg-primary-foreground text-foreground border-0 flex-1"
              />
              <Button className="bg-secondary hover:bg-secondary-dark text-secondary-foreground px-8">
                S'abonner
              </Button>
            </div>
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
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                  <span className="text-primary-foreground font-bold text-lg">O</span>
                </div>
                <span className="text-xl font-bold">omrabonsplans.fr</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
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
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Qui sommes nous ?</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contrat</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Vip</a></li>
              </ul>
            </div>
            
            {/* Service */}
            <div>
              <h4 className="font-bold text-lg mb-6">Service</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Nous que Voir</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Comment</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Vous</a></li>
              </ul>
            </div>
            
            {/* Autre */}
            <div>
              <h4 className="font-bold text-lg mb-6">Autre</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Voyage</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Restauration</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Activité</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Hôtels</a></li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-border pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 Omra Bons Plans Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
