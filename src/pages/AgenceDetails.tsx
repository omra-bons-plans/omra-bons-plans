import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Star from 'lucide-react/dist/esm/icons/star';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import TrendingDown from 'lucide-react/dist/esm/icons/trending-down';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import { SEOHead } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { useNavigate } from 'react-router-dom';
import { useAgency } from '@/hooks/useAgencies';
import { agenciesData } from '@/utils/agenciesData';
import ResponsiveLayout from '@/components/ResponsiveLayout';

export default function AgenceDetails() {
  const { agencyName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(agencyName || '');
  
  // Fetch live data from Supabase
  const { data: dbAgency } = useAgency(decodedName);
  // Fallback to static data for strengths/weaknesses/specialties/highlight
  const staticAgency = agenciesData.find(a => a.name === decodedName);
  
  // Merge: use DB for rating/reviewCount, static for the rest
  const agency = staticAgency ? {
    ...staticAgency,
    googleRating: dbAgency?.google_rating ?? staticAgency.googleRating,
    reviewCount: dbAgency?.review_count ?? staticAgency.reviewCount,
    url: dbAgency?.url ?? staticAgency.url,
  } : null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.7) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (rating >= 4.3) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (rating >= 4.0) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
  };

  if (!agency) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Agence non trouvée</h1>
            <Button onClick={() => navigate('/agences-liste')}>
              Retour à la liste
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${agency.name} - Agence Omra & Hajj : Avis ${agency.googleRating}/5`}
        description={`${agency.name} : agence Omra & Hajj agréée. Note Google ${agency.googleRating}/5 (${agency.reviewCount} avis). ${agency.highlight || 'Points forts, faiblesses et tarifs détaillés.'}`}
        keywords={`${agency.name}, omra, hajj, agence voyage, avis google, agence agrée france`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          "name": agency.name,
          "url": agency.url,
          "areaServed": {
            "@type": "Country",
            "name": "France"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": agency.googleRating,
            "reviewCount": agency.reviewCount,
            "bestRating": "5",
            "worstRating": "1"
          },
          "priceRange": agency.priceRange || "€€",
          "serviceType": ["Omra", "Hajj", "Voyage Religieux"],
          "knowsAbout": agency.specialties || [],
          "sameAs": [agency.url]
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <SEOBreadcrumb 
          items={[
            { name: 'Accueil', url: '/' },
            { name: 'Agences Liste', url: '/agences-liste' },
            { name: agency.name, url: `/agence-details/${encodeURIComponent(agency.name)}` }
          ]}
        />

        <Button 
          variant="ghost" 
          onClick={() => navigate('/agences-liste')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {agency.name} — Agence Omra & Hajj
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Analyse complète de {agency.name} : note Google, avis clients, points forts, tarifs et spécialités.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl" aria-label={`Note et avis ${agency.name}`}>{agency.name}</CardTitle>
                  <a 
                    href={agency.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex">{renderStars(agency.googleRating)}</div>
                  <Badge className={getRatingColor(agency.googleRating)} variant="secondary">
                    {agency.googleRating}/5
                  </Badge>
                  <span className="text-lg font-semibold">
                    {agency.reviewCount} avis Google
                  </span>
                </div>
                {agency.highlight && (
                  <p className="text-lg text-primary font-medium bg-primary/10 p-3 rounded-lg">
                    {agency.highlight}
                  </p>
                )}
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    Points Forts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {agency.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle as="h2" className="flex items-center gap-2 text-orange-600">
                    <TrendingDown className="h-5 w-5" />
                    Points d'Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {agency.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">⚠</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Gamme de Prix</h4>
                  <Badge variant="outline" className="text-sm">
                    {agency.priceRange}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Spécialités</h4>
                  <div className="flex flex-wrap gap-2">
                    {agency.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button asChild className="w-full">
                    <a href={agency.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visiter le site web
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/comparatif-visuel')}
                >
                  Comparer avec d'autres agences
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/comparatif-agences')}
                >
                  Voir le tableau comparatif
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
