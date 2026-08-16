import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import Star from 'lucide-react/dist/esm/icons/star';
import Search from 'lucide-react/dist/esm/icons/search';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { agenciesData } from '@/utils/agenciesData';
import { useIsMobile } from '@/hooks/use-mobile';
import { InternalLinks } from '@/components/SEO/InternalLinks';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from "react-helmet-async";

export default function ComparatifAgences() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const isMobile = useIsMobile();
  
  // Charger les données depuis la base de données
  const { data: dbAgencies, isLoading } = useQuery({
    queryKey: ['agencies-comparison'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agencies')
        .select('name, url, google_rating, review_count, strengths, weaknesses, specialties, price_range, highlight');
      if (error) throw error;
      return data;
    }
  });

  // Mapper les données de la DB au format attendu, sinon fallback sur les données statiques
  const agencies = dbAgencies ? dbAgencies.map(agency => ({
    name: agency.name,
    url: agency.url,
    googleRating: agency.google_rating,
    reviewCount: agency.review_count,
    strengths: agency.strengths,
    weaknesses: agency.weaknesses,
    specialties: agency.specialties,
    priceRange: agency.price_range,
    highlight: agency.highlight
  })) : agenciesData;
  
  const filteredAgencies = agencies
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

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Tableau Comparatif Agences Omra - Notes & Tarifs 2026 | Omra Bons Plans</title>
        <meta name="description" content="Tableau comparatif complet des agences Omra et Hajj : notes Google, nombre d'avis, tarifs et spécialités. Comparez les meilleures agences pour votre pèlerinage 2026." />
        <meta name="keywords" content="comparatif agence omra 2026, hajj 2027, agence voyage mecque, avis google, tableau comparatif" />
        <link rel="canonical" href="https://omrabonsplans.fr/comparatif-agences" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Tableau Comparatif Agences Omra - Notes & Tarifs 2026" />
        <meta property="og:description" content="Tableau comparatif complet des agences Omra et Hajj : notes Google, tarifs et spécialités." />
        <meta property="og:url" content="https://omrabonsplans.fr/comparatif-agences" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Tableau Comparatif Agences Omra - Notes & Tarifs 2026",
          "description": "Tableau comparatif complet des agences Omra et Hajj : notes Google, nombre d'avis, tarifs et spécialités. Comparez les meilleures agences pour votre pèlerinage 2026.",
          "url": "https://omrabonsplans.fr/comparatif-agences",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie", "jobTitle": "Expert en pèlerinage islamique" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "url": "https://omrabonsplans.fr" },
          "datePublished": "2025-09-01",
          "dateModified": "2026-08-16",
          "image": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp", "width": 1200, "height": 630 },
          "inLanguage": "fr-FR"
        })}</script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Tableau Comparatif Agences Omra",
            "description": "Tableau comparatif complet des meilleures agences de voyage Omra et Hajj",
            "url": "https://omrabonsplans.fr/comparatif-agences"
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">

        <div className="container mx-auto px-4 py-4 md:py-8">
          <SEOBreadcrumb 
            items={[
              { name: 'Accueil', url: '/' },
              { name: 'Comparatif Agences', url: '/comparatif-agences' }
            ]}
          />

          <header className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {isMobile ? 'Tableau Comparatif Agences' : 'Tableau Comparatif Détaillé des Agences Omra & Hajj 2027'}
            </h1>
            {!isMobile && (
              <>
                <h2 className="text-2xl text-muted-foreground mb-4 font-semibold">
                  Tableau comparatif complet : tarifs, services, notes Google et avis clients vérifiés
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Analysez et comparez les meilleures agences de voyage pour votre pèlerinage. 
                  Notes Google authentiques, avis clients et analyse détaillée des services.
                </p>
              </>
            )}
            {isMobile && (
              <p className="text-sm text-muted-foreground">
                Comparez les meilleures agences : notes, avis et services
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

          {/* Mobile Card View (visible on small screens) */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
          <div className="block lg:hidden space-y-3">
            {filteredAgencies.map((agency) => (
              <Card key={agency.name} className="p-3 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base truncate">{agency.name}</h3>
                      {agency.highlight && (
                        <p className="text-xs text-primary mt-0.5 line-clamp-1">{agency.highlight}</p>
                      )}
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        agency.priceRange === 'Premium' ? 'border-purple-500 text-purple-700 text-xs' :
                        agency.priceRange === 'Économique' ? 'border-green-500 text-green-700 text-xs' :
                        'border-blue-500 text-blue-700 text-xs'
                      }
                    >
                      {agency.priceRange}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex">{renderStars(agency.googleRating)}</div>
                      <Badge className={getRatingColor(agency.googleRating)}>
                        {agency.googleRating}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">{agency.reviewCount} avis</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {agency.specialties.slice(0, 2).map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {agency.specialties.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{agency.specialties.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full h-9"
                    size="sm"
                    asChild
                  >
                    <a 
                      href={agency.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      Visiter
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View (hidden on small screens) */}
          <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Tableau Comparatif Détaillé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agence</TableHead>
                    <TableHead>Note Google</TableHead>
                    <TableHead>Nb d'Avis</TableHead>
                    <TableHead>Spécialités</TableHead>
                    <TableHead>Gamme Prix</TableHead>
                    <TableHead>Site Web</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgencies.map((agency) => (
                    <TableRow key={agency.name}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{agency.name}</div>
                          {agency.highlight && (
                            <div className="text-xs text-primary mt-1">{agency.highlight}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(agency.googleRating)}</div>
                          <Badge className={getRatingColor(agency.googleRating)}>
                            {agency.googleRating}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{agency.reviewCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {agency.specialties.slice(0, 2).map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {agency.specialties.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{agency.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            agency.priceRange === 'Premium' ? 'border-purple-500 text-purple-700' :
                            agency.priceRange === 'Économique' ? 'border-green-500 text-green-700' :
                            'border-blue-500 text-blue-700'
                          }
                        >
                          {agency.priceRange}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a 
                          href={agency.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          Visiter
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            </CardContent>
          </Card>
            </>
          )}
          
          {/* Liens internes SEO */}
          <InternalLinks currentPage="/comparatif-agences" variant="related" className="mt-8" />
        </div>
      </div>
    </ResponsiveLayout>
  );
}