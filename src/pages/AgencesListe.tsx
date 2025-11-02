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

export default function AgencesListe() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const navigate = useNavigate();
  
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

  const handleViewDetails = (agencyName: string) => {
    const encodedName = encodeURIComponent(agencyName);
    navigate(`/agence-details/${encodedName}`);
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

        <div className="container mx-auto px-4 py-8">
        <SEOBreadcrumb 
          items={[
            { name: 'Accueil', url: '/' },
            { name: 'Agences Liste', url: '/agences-liste' }
          ]}
        />

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Liste Complète des Agences Omra & Hajj 2026-2027
          </h1>
          <h2 className="text-2xl text-muted-foreground mb-4 font-semibold">
            Comparatif détaillé des meilleures agences de voyage pour votre pèlerinage avec avis Google authentiques
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Analysez et comparez les meilleures agences de voyage pour votre pèlerinage. 
            Notes Google authentiques, avis clients et analyse détaillée des services.
          </p>
        </header>

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher une agence ou spécialité..."
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
            >
              Par Note
            </Button>
            <Button
              variant={sortBy === 'reviews' ? 'default' : 'outline'}
              onClick={() => setSortBy('reviews')}
              size="sm"
            >
              Par Avis
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              onClick={() => setSortBy('name')}
              size="sm"
            >
              Par Nom
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgencies.map((agency) => (
            <Card key={agency.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{agency.name}</CardTitle>
                  <a 
                    href={agency.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(agency.googleRating)}</div>
                  <Badge className={getRatingColor(agency.googleRating)}>
                    {agency.googleRating}/5
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({agency.reviewCount} avis)
                  </span>
                </div>
                {agency.highlight && (
                  <p className="text-sm text-primary font-medium">{agency.highlight}</p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">{agency.priceRange}</Badge>
                  <div className="flex flex-wrap gap-1">
                    {agency.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    Points Forts
                  </h4>
                  <ul className="text-xs space-y-1">
                    {agency.strengths.slice(0, 3).map((strength, index) => (
                      <li key={index} className="text-muted-foreground">• {strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-orange-600" />
                    Points d'Attention
                  </h4>
                  <ul className="text-xs space-y-1">
                    {agency.weaknesses.slice(0, 2).map((weakness, index) => (
                      <li key={index} className="text-muted-foreground">• {weakness}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(agency.name)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir détail
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    onClick={handleCompare}
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
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