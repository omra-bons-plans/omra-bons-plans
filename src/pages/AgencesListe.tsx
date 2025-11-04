import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, TrendingUp, TrendingDown, Search, ExternalLink, Eye, ArrowRightLeft } from 'lucide-react';
import { SEOHead } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { agenciesData } from '@/utils/agenciesData';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AgencesListe() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const filteredAgencies = agenciesData
    .filter(agency => 
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.googleRating - a.googleRating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.7) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (rating >= 4.3) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (rating >= 4.0) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
  };

  const handleViewDetails = () => {
    navigate('/comparatif-agences');
  };

  const handleCompare = () => {
    navigate('/comparatif-visuel');
  };

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Liste Agences Omra & Hajj 2026 | Comparatif Avis Google</title>
        <meta name="description" content="Découvrez la liste complète des meilleures agences de voyage pour Omra et Hajj : notes Google authentiques, avis clients, points forts et tarifs comparés." />
        <meta name="keywords" content="agence omra 2026, hajj agence voyage, avis google agences, comparatif agences omra" />
        <link rel="canonical" href="https://omrabonsplans.fr/agences-liste" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Liste Agences Omra & Hajj 2026 | Comparatif Avis" />
        <meta property="og:description" content="Découvrez la liste complète des meilleures agences de voyage pour Omra et Hajj avec notes Google authentiques." />
        <meta property="og:url" content="https://omrabonsplans.fr/agences-liste" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Liste Agences Omra & Hajj",
            "description": "Collection des meilleures agences de voyage pour Omra et Hajj",
            "url": "https://omrabonsplans.fr/agences-liste",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Agences de Voyage Omra et Hajj"
            }
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Liste Agences de Voyages Omra & Hajj 2026-2027"
          description="Découvrez la liste complète des meilleures agences de voyage pour Omra et Hajj : notes Google, avis clients, points forts et tarifs."
          keywords="agence omra 2026, hajj 2026, agence voyage mecque, avis google"
        />

        <div className="container mx-auto px-4 py-4 md:py-8">
          <SEOBreadcrumb 
            items={[
              { name: 'Accueil', url: '/' },
              { name: 'Agences Liste', url: '/agences-liste' }
            ]}
          />

        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isMobile ? 'Agences Omra & Hajj 2026' : 'Liste Complète des Agences Omra & Hajj 2026-2027'}
          </h1>
          {!isMobile && (
              <>
                <h2 className="text-2xl text-muted-foreground mb-4 font-semibold">
                  Comparatif détaillé des meilleures agences de voyage pour votre pèlerinage avec avis Google authentiques
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Analysez et comparez les meilleures agences de voyage pour votre pèlerinage. 
                  Notes Google authentiques, avis clients et analyse détaillée des services.
                </p>
            </>
          )}
          {isMobile && (
              <p className="text-sm text-muted-foreground">
                Comparez les meilleures agences avec avis authentiques
              </p>
            )}
          </header>

        <div className="sticky top-0 z-10 bg-background pb-4 mb-4 border-b border-border">
          <div className="relative w-full mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={isMobile ? "Rechercher..." : "Rechercher une agence ou spécialité..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'rating' ? 'default' : 'outline'}
              onClick={() => setSortBy('rating')}
              size="sm"
              className="flex-1"
            >
              {isMobile ? 'Note' : 'Par Note'}
            </Button>
            <Button
              variant={sortBy === 'reviews' ? 'default' : 'outline'}
              onClick={() => setSortBy('reviews')}
              size="sm"
              className="flex-1"
            >
              {isMobile ? 'Avis' : 'Par Avis'}
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              onClick={() => setSortBy('name')}
              size="sm"
              className="flex-1"
            >
              {isMobile ? 'A-Z' : 'Par Nom'}
            </Button>
          </div>
        </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgencies.map((agency) => (
              <Card key={agency.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base md:text-lg truncate flex-1">{agency.name}</CardTitle>
                    <a 
                      href={agency.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary ml-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="flex">{renderStars(agency.googleRating)}</div>
                    <Badge className={getRatingColor(agency.googleRating)}>
                      {agency.googleRating}/5
                    </Badge>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      ({agency.reviewCount} avis)
                    </span>
                  </div>
                  {agency.highlight && (
                    <p className="text-xs md:text-sm text-primary font-medium line-clamp-1">{agency.highlight}</p>
                  )}
                </CardHeader>
              
              <CardContent className="space-y-3 pt-0">
                <div>
                  <Badge variant="secondary" className="mb-2 text-xs">{agency.priceRange}</Badge>
                  <div className="flex flex-wrap gap-1">
                    {agency.specialties.slice(0, isMobile ? 2 : 3).map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {isMobile && agency.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{agency.specialties.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs md:text-sm mb-1.5 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    Points Forts
                  </h4>
                  <ul className="text-xs space-y-0.5">
                    {agency.strengths.slice(0, isMobile ? 2 : 3).map((strength, index) => (
                      <li key={index} className="text-muted-foreground">• {strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-xs md:text-sm mb-1.5 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-orange-600" />
                    Points d'Attention
                  </h4>
                  <ul className="text-xs space-y-0.5">
                    {agency.weaknesses.slice(0, isMobile ? 1 : 2).map((weakness, index) => (
                      <li key={index} className="text-muted-foreground">• {weakness}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 text-xs"
                    onClick={handleViewDetails}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    {isMobile ? 'Détail' : 'Voir détail'}
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 h-8 text-xs"
                    onClick={handleCompare}
                  >
                    <ArrowRightLeft className="h-3 w-3 mr-1" />
                    VS
                  </Button>
                </div>
              </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}