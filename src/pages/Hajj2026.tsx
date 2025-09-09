import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { Star, MapPin, Calendar, Users, Plane, Shield, Clock, CheckCircle } from 'lucide-react';

const Hajj2026 = () => {
  const navigate = useNavigate();

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Hajj 2026 - Omra Bons Plans",
    "description": "Hajj 2026 dès 4500€. Packages complets avec quotas gouvernementaux sécurisés, hôtels 5 étoiles à Mina et Arafat, guide spirituel français. Réservation prioritaire ouverte.",
    "url": "https://omrabonsplans.fr/hajj-2026",
    "offers": {
      "@type": "Offer",
      "name": "Hajj 2026 Package Complet",
      "price": "4500",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Hajj 2026 dès 4500€ | Grand Pèlerinage Mecque | Quotas Sécurisés</title>
        <meta name="description" content="🕋 Hajj 2026 dès 4500€. Quotas gouvernementaux sécurisés, hôtels 5⭐ Mina/Arafat, guide spirituel français. 15 ans expérience pèlerinage. Réservation prioritaire." />
        <meta name="keywords" content="hajj 2026, hajj pas cher, grand pèlerinage mecque, hajj 2026 france, package hajj complet, quota hajj, réservation hajj 2026" />
        <link rel="canonical" href="https://omrabonsplans.fr/hajj-2026" />
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
              backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(/lovable-uploads/81c64f5d-d94b-4e16-9f68-3b2b5689f9cf.png)`,
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
              
              <Badge className="bg-green-600 text-white px-4 py-2 text-sm mb-6">
                🎯 Quotas Gouvernementaux Sécurisés
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text-secondary">Hajj 2026</span><br />
                <span className="text-2xl md:text-4xl">Le Grand Pèlerinage</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
                🕋 5ème Pilier de l'Islam - Réalisez votre rêve<br />
                Packages complets dès <strong className="text-yellow-400">4500€</strong>
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="btn-modern px-8 py-4 text-lg">
                  Réserver Hajj 2026
                </Button>
                <Button variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-primary">
                  Guide Hajj Gratuit
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section informative */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  Hajj 2026 : Votre Pèlerinage en Toute Sérénité
                </h2>
                <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                  Le <strong>Hajj 2026</strong> représente l'accomplissement du 5ème pilier de l'Islam. 
                  Avec 15 ans d'expérience, nous vous accompagnons dans cette démarche spirituelle exceptionnelle 
                  avec des <strong>quotas gouvernementaux sécurisés</strong> et un service premium.
                </p>
              </div>

              {/* Pourquoi nous choisir */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <Card className="text-center border-primary/20">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Quotas Sécurisés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Partenariat officiel avec les autorités saoudiennes. 
                      Vos places pour le <strong>Hajj 2026</strong> sont garanties.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-primary/20">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Accompagnement Expert</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Guides spirituels français expérimentés, imams certifiés. 
                      Support 24h/7j pendant tout votre <strong>grand pèlerinage</strong>.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-primary/20">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Confort Premium</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Hôtels 5 étoiles à Mina, Arafat et Mozdalifa. 
                      Transport climatisé, repas halal premium inclus.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Programme détaillé */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                  Programme Hajj 2026 - 15 Jours Spirituels
                </h2>
                
                <div className="grid lg:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-6">
                      🕋 Les Rituels du Hajj Expliqués
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-sm font-semibold text-primary">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Ihram et Talbiya</h4>
                          <p className="text-sm text-muted-foreground">
                            Préparation spirituelle et physique. Mise en état de sacralisation 
                            avec accompagnement de nos guides expérimentés.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-sm font-semibold text-primary">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Tawaf d'Arrivée</h4>
                          <p className="text-sm text-muted-foreground">
                            Circumambulation autour de la Kaaba en groupes organisés 
                            pour éviter la foule et garantir votre sécurité.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-sm font-semibold text-primary">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Jour d'Arafat</h4>
                          <p className="text-sm text-muted-foreground">
                            Le point culminant du <strong>Hajj 2026</strong>. 
                            Station sur le mont Arafat avec hébergement climatisé et repas inclus.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-sm font-semibold text-primary">4</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Lapidation et Sacrifice</h4>
                          <p className="text-sm text-muted-foreground">
                            Rituels de Mina avec accompagnement sécurisé. 
                            Sacrifice organisé selon les normes islamiques.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-6">
                      🏨 Hébergement Premium Inclus
                    </h3>
                    
                    <div className="space-y-6">
                      <Card className="border-primary/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            La Mecque (8 nuits)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p>• <strong>Hôtel 5⭐</strong> face à la Grande Mosquée</p>
                          <p>• <strong>Chambre climatisée</strong> avec vue Kaaba</p>
                          <p>• <strong>Wifi gratuit</strong> et service 24h</p>
                          <p>• <strong>Restaurant halal</strong> buffet varié</p>
                        </CardContent>
                      </Card>

                      <Card className="border-primary/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Mina et Arafat (4 nuits)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p>• <strong>Tentes VIP climatisées</strong> à Mina</p>
                          <p>• <strong>Hébergement premium</strong> à Arafat</p>
                          <p>• <strong>Literie confortable</strong> et sanitaires privés</p>
                          <p>• <strong>Repas inclus</strong> pendant les rituels</p>
                        </CardContent>
                      </Card>

                      <Card className="border-primary/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Médine (3 nuits)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p>• <strong>Hôtel 5⭐</strong> proche Mosquée du Prophète</p>
                          <p>• <strong>Visites guidées</strong> Rawda et lieux saints</p>
                          <p>• <strong>Transport inclus</strong> vers tous sites</p>
                          <p>• <strong>Shopping organisé</strong> souvenirs et dattes</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarifs Hajj 2026 */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                  Nos Packages Hajj 2026 - Réservation Prioritaire
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Package Standard */}
                  <Card className="border-2 border-border hover:border-primary/30 transition-all">
                    <CardHeader className="text-center pb-4">
                      <Badge className="w-fit mx-auto mb-3 bg-blue-100 text-blue-800">
                        Standard
                      </Badge>
                      <CardTitle className="text-2xl">Hajj 2026 Essentiel</CardTitle>
                      <div className="text-4xl font-bold text-primary">4500€</div>
                      <p className="text-sm text-muted-foreground">15 jours tout inclus</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Vol direct Paris-Jeddah A/R</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Hôtels 4-5⭐ Mecque et Médine</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Tentes climatisées à Mina</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Tous les repas inclus</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Guide spirituel français</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Transport sur place inclus</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Assurance voyage complète</span>
                        </div>
                      </div>
                      <Button className="w-full mt-6">
                        Réserver Maintenant
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Places limitées - Réservation prioritaire
                      </p>
                    </CardContent>
                  </Card>

                  {/* Package Premium */}
                  <Card className="border-2 border-primary shadow-lg">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        ⭐ Recommandé
                      </Badge>
                    </div>
                    <CardHeader className="text-center pb-4 pt-8">
                      <Badge className="w-fit mx-auto mb-3 bg-primary/10 text-primary">
                        Premium
                      </Badge>
                      <CardTitle className="text-2xl">Hajj 2026 Confort</CardTitle>
                      <div className="text-4xl font-bold text-primary">5900€</div>
                      <p className="text-sm text-muted-foreground">15 jours confort premium</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span><strong>Vol direct</strong> + surclassement possible</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span><strong>Hôtels 5⭐</strong> face Kaaba et Rawda</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span><strong>Tentes VIP</strong> à Mina et Arafat</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span><strong>Repas gastronomiques</strong> halal premium</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span><strong>Imam privé</strong> pour le groupe</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span><strong>Transport VIP</strong> climatisé</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span><strong>Assistance 24h/7j</strong> dédiée</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span><strong>Cadeaux souvenirs</strong> inclus</span>
                        </div>
                      </div>
                      <Button className="w-full mt-6 btn-modern">
                        Réserver Premium
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        <strong>Seulement 20 places disponibles</strong>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* CTA Final */}
              <div className="text-center bg-primary/10 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Ne Manquez Pas Votre Hajj 2026
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Les places pour le <strong>Hajj 2026</strong> sont limitées par les quotas gouvernementaux. 
                  Réservez dès maintenant pour garantir votre participation au grand pèlerinage.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="btn-modern px-8 py-4">
                    Réserver Mon Hajj 2026
                  </Button>
                  <Button variant="outline" className="px-8 py-4">
                    Demander un Devis Gratuit
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default Hajj2026;