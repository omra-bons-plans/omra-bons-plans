import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { Star, MapPin, Calendar, Users, Mosque, Heart, Clock, Shield } from 'lucide-react';

const OmraRamadan = () => {
  const navigate = useNavigate();

  // Schema.org structured data for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Omra Ramadan 2025 - Omra Bons Plans",
    "description": "Séjours Omra Ramadan 2025 dès 1290€. Packages tout inclus avec hôtels 5 étoiles face à la Kaaba, guides spirituels français, repas Iftar et Sahur. Réservation sécurisée.",
    "url": "https://omrabonsplans.fr/omra-ramadan",
    "offers": {
      "@type": "Offer",
      "name": "Omra Ramadan 2025",
      "price": "1290",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "description": "Séjour spirituel Omra pendant le mois de Ramadan avec guide français expérimenté"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1247"
    }
  };

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Omra Ramadan 2025 dès 1290€ | Séjours Omra Mois Sacré | Guide Français</title>
        <meta name="description" content="🌙 Omra Ramadan 2025 dès 1290€. Séjours tout inclus avec hôtels 5⭐ face Kaaba, guides spirituels français, repas Iftar/Sahur. Réservation sécurisée. 15 ans expérience." />
        <meta name="keywords" content="omra ramadan, omra ramadan 2025, séjour omra ramadan, omra mois sacré, omra avec guide français, omra pas chère ramadan, forfait omra ramadan, voyage omra ramadan" />
        <link rel="canonical" href="https://omrabonsplans.fr/omra-ramadan" />
        <meta property="og:title" content="Omra Ramadan 2025 dès 1290€ | Séjours Mois Sacré" />
        <meta property="og:description" content="🌙 Vivez l'Omra pendant Ramadan 2025. Séjours tout inclus dès 1290€ avec hôtels 5⭐ face à la Kaaba et guides spirituels français expérimentés." />
        <meta property="og:url" content="https://omrabonsplans.fr/omra-ramadan" />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(/lovable-uploads/81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="text-white/80 hover:text-white"
                >
                  ← Retour à l'accueil
                </Button>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text-secondary">Omra Ramadan 2025</span><br />
                <span className="text-2xl md:text-4xl">Le Pèlerinage du Mois Sacré</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
                🌙 Vivez l'expérience spirituelle la plus intense<br />
                Séjours tout inclus dès <strong className="text-yellow-400">1290€</strong>
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="btn-modern px-8 py-4 text-lg">
                  Voir les Offres Ramadan
                </Button>
                <Button variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-primary">
                  Guide Ramadan Gratuit
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section principale avec contenu SEO enrichi */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              
              {/* Introduction SEO */}
              <div className="prose prose-lg max-w-none mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Pourquoi Choisir l'Omra Ramadan 2025 ?
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                    L'<strong>Omra Ramadan</strong> représente l'expérience spirituelle la plus intense qu'un musulman puisse vivre. 
                    Pendant ce mois béni, les Lieux Saints de la Mecque et Médine se transforment en un océan de foi et de recueillement.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Colonne 1: Avantages spirituels */}
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                      <Mosque className="w-8 h-8" />
                      L'Atmosphère Unique du Ramadan
                    </h3>
                    
                    <div className="space-y-6 text-muted-foreground">
                      <p>
                        Réaliser son <strong className="text-foreground">pèlerinage à la Mecque</strong> pendant le Ramadan offre une dimension spirituelle incomparable. 
                        L'ambiance de jeûne, de prière collective et de solidarité entre pèlerins crée une atmosphère unique de purification de l'âme.
                      </p>
                      
                      <div className="bg-primary/10 p-6 rounded-xl">
                        <h4 className="text-lg font-semibold text-foreground mb-4">Moments Privilégiés du Ramadan</h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                            <span><strong>Iftar à la Mecque</strong> : Rupture du jeûne face à la Kaaba</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                            <span><strong>Tarawih</strong> : Prières nocturnes dans la Grande Mosquée</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                            <span><strong>Dernière décade</strong> : Recherche de Laylat al-Qadr</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                            <span><strong>Solidarité</strong> : Partage avec les pèlerins du monde entier</span>
                          </li>
                        </ul>
                      </div>
                      
                      <p>
                        Nos <strong className="text-foreground">séjours Omra Ramadan 2025</strong> sont spécialement conçus pour maximiser cette expérience spirituelle. 
                        Nous organisons les horaires de visite pour respecter les temps de jeûne et de prière, 
                        tout en vous offrant les meilleures conditions de confort.
                      </p>
                    </div>
                  </div>

                  {/* Colonne 2: Services inclus */}
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                      <Heart className="w-8 h-8" />
                      Nos Services Ramadan Inclus
                    </h3>
                    
                    <div className="space-y-6">
                      <Card className="border-primary/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Programme Adapté au Jeûne
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <p>• <strong>Sahur organisé</strong> : Repas avant l'aube dans nos hôtels</p>
                          <p>• <strong>Iftar premium</strong> : Rupture du jeûne avec menu varié</p>
                          <p>• <strong>Horaires flexibles</strong> : Visites adaptées aux temps de prière</p>
                          <p>• <strong>Repos respecté</strong> : Temps libres pour la récupération</p>
                        </CardContent>
                      </Card>

                      <Card className="border-primary/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Accompagnement Spirituel
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <p>• <strong>Guide religieux français</strong> : Imam expérimenté</p>
                          <p>• <strong>Cours de Coran</strong> : Sessions quotidiennes</p>
                          <p>• <strong>Invocations guidées</strong> : Douas en français et arabe</p>
                          <p>• <strong>Conférences</strong> : Enseignements islamiques</p>
                        </CardContent>
                      </Card>

                      <Card className="border-primary/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Confort Premium
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <p>• <strong>Hôtels 5 étoiles</strong> : Face à la Kaaba et Rawda</p>
                          <p>• <strong>Transport VIP</strong> : Climatisé Mecque-Médine</p>
                          <p>• <strong>Assistance 24h/7j</strong> : Équipe sur place</p>
                          <p>• <strong>Groupe limité</strong> : Maximum 25 personnes</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section offres */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                  Nos Formules Omra Ramadan 2025
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Formule Essentielle */}
                  <Card className="relative border-2 border-border hover:border-primary/30 transition-all">
                    <CardHeader className="text-center pb-4">
                      <Badge className="w-fit mx-auto mb-3 bg-blue-100 text-blue-800">
                        Essentielle
                      </Badge>
                      <CardTitle className="text-2xl">Omra Ramadan</CardTitle>
                      <div className="text-3xl font-bold text-primary">1290€</div>
                      <p className="text-sm text-muted-foreground">15 jours / 14 nuits</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>Hôtel 4⭐ Mecque + Médine</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Vol direct A/R inclus</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span>Guide spirituel français</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>Repas Iftar et Sahur</span>
                      </div>
                      <Button className="w-full mt-6">
                        Réserver Maintenant
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Formule Confort */}
                  <Card className="relative border-2 border-primary shadow-lg scale-105">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        ⭐ Plus Populaire
                      </Badge>
                    </div>
                    <CardHeader className="text-center pb-4 pt-8">
                      <Badge className="w-fit mx-auto mb-3 bg-primary/10 text-primary">
                        Confort
                      </Badge>
                      <CardTitle className="text-2xl">Omra Ramadan Plus</CardTitle>
                      <div className="text-3xl font-bold text-primary">1790€</div>
                      <p className="text-sm text-muted-foreground">18 jours / 17 nuits</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>Hôtel 5⭐ face Kaaba</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Vol direct + bagages</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span>Imam français certifié</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>Tous repas + collations</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-primary" />
                        <span>Zam Zam illimité</span>
                      </div>
                      <Button className="w-full mt-6 btn-modern">
                        Réserver Maintenant
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Formule Premium */}
                  <Card className="relative border-2 border-border hover:border-primary/30 transition-all">
                    <CardHeader className="text-center pb-4">
                      <Badge className="w-fit mx-auto mb-3 bg-yellow-100 text-yellow-800">
                        Premium
                      </Badge>
                      <CardTitle className="text-2xl">Omra Ramadan VIP</CardTitle>
                      <div className="text-3xl font-bold text-primary">2390€</div>
                      <p className="text-sm text-muted-foreground">21 jours / 20 nuits</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>Suite 5⭐ vue Kaaba</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Business class disponible</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span>Guide privé personnalisé</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>Restaurant gastronomique</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-primary" />
                        <span>Excursions privées incluses</span>
                      </div>
                      <Button className="w-full mt-6">
                        Réserver Maintenant
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Section FAQ SEO */}
              <div className="bg-muted/30 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-center text-foreground mb-8">
                  Questions Fréquentes sur l'Omra Ramadan
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Quand réserver son Omra Ramadan 2025 ?</h3>
                      <p className="text-sm text-muted-foreground">
                        Il est recommandé de réserver votre <strong>Omra Ramadan</strong> 6 à 8 mois à l'avance pour bénéficier des meilleurs tarifs et disponibilités d'hôtels face à la Kaaba.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Les repas sont-ils adaptés au jeûne ?</h3>
                      <p className="text-sm text-muted-foreground">
                        Absolument ! Nos <strong>séjours Omra Ramadan</strong> incluent des repas Sahur avant l'aube et des Iftar copieux pour la rupture du jeûne, respectant les traditions islamiques.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Y a-t-il un accompagnement spirituel ?</h3>
                      <p className="text-sm text-muted-foreground">
                        Oui, chaque groupe est accompagné d'un imam français expérimenté qui guide les rituels, donne des cours et répond à toutes vos questions spirituelles.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Peut-on personnaliser son séjour ?</h3>
                      <p className="text-sm text-muted-foreground">
                        Nos conseillers spécialisés dans l'<strong>Omra Ramadan</strong> peuvent adapter votre séjour selon vos besoins : durée, niveau d'hôtel, activités spirituelles supplémentaires.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Quelles sont les dates du Ramadan 2025 ?</h3>
                      <p className="text-sm text-muted-foreground">
                        Le Ramadan 2025 devrait débuter vers le 28 février et se terminer vers le 30 mars 2025 (sous réserve d'observation lunaire). Nos départs sont programmés en conséquence.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">L'Omra Ramadan est-elle plus chère ?</h3>
                      <p className="text-sm text-muted-foreground">
                        Les prix peuvent être légèrement supérieurs due à la forte demande, mais nos <strong>offres Omra Ramadan pas chère</strong> restent très compétitives dès 1290€ tout inclus.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default OmraRamadan;