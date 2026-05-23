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
import Users from 'lucide-react/dist/esm/icons/users';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle';
import { SEOHead } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { useNavigate } from 'react-router-dom';
import { useAgency } from '@/hooks/useAgencies';
import { agenciesData } from '@/utils/agenciesData';
import ResponsiveLayout from '@/components/ResponsiveLayout';

const PRICE_RANGE_LABEL: Record<string, string> = {
  'Économique': 'À partir de 899€',
  'Standard': 'À partir de 1 200€',
  'Premium': 'À partir de 1 800€',
  'Économique-Standard': 'À partir de 999€',
  'Standard-Premium': 'À partir de 1 500€',
};

export default function AgenceDetails() {
  const { agencySlug } = useParams();
  const navigate = useNavigate();

  const staticAgency = agenciesData.find(a => a.slug === agencySlug);
  const { data: dbAgency } = useAgency(staticAgency?.name ?? '');

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
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-yellow-300';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.8) return 'Excellent';
    if (rating >= 4.5) return 'Très bon';
    if (rating >= 4.0) return 'Bon';
    return 'Correct';
  };

  if (!agency) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Agence non trouvée</h1>
            <Button onClick={() => navigate('/agences-liste')}>Retour à la liste</Button>
          </div>
        </div>
      </div>
    );
  }

  const canonicalUrl = `https://omrabonsplans.fr/agence-details/${agency.slug}`;

  const faqItems = [
    {
      question: `${agency.name} est-elle une agence agréée ?`,
      answer: `${agency.name} est une agence de voyage spécialisée Omra & Hajj opérant en France. Vérifiez toujours l'agrément officiel auprès du ministère saoudien du Hajj avant de réserver.`,
    },
    {
      question: `Quels sont les tarifs de ${agency.name} ?`,
      answer: `${agency.name} propose des formules en gamme ${agency.priceRange}. ${PRICE_RANGE_LABEL[agency.priceRange] ?? 'Contactez directement l\'agence pour obtenir un devis personnalisé.'} Les prix varient selon la période, la durée et les hôtels choisis.`,
    },
    {
      question: `Comment contacter ${agency.name} ?`,
      answer: `Vous pouvez contacter ${agency.name} directement via leur site web officiel : ${agency.url}. Nous vous recommandons de demander un devis détaillé et de vérifier les conditions d'annulation avant tout paiement.`,
    },
    {
      question: `${agency.name} propose-t-elle des départs en dehors de Paris ?`,
      answer: `Cela dépend des formules proposées. Consultez le site de ${agency.name} pour connaître les villes de départ disponibles. Certaines agences proposent des départs depuis Lyon, Marseille, Lille ou Bordeaux.`,
    },
  ];

  const relatedAgencies = agenciesData
    .filter(a => a.slug !== agency.slug && a.priceRange === agency.priceRange)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${agency.name} — Avis ${agency.googleRating}/5 · Agence Omra & Hajj Agréée 2026`}
        description={`${agency.name} : agence Omra & Hajj en France. Note ${agency.googleRating}/5 basée sur ${agency.reviewCount} avis vérifiés. ${agency.highlight} Comparez les offres, points forts et tarifs 2026.`}
        keywords={`${agency.name}, agence omra ${agency.name.toLowerCase()}, avis ${agency.name.toLowerCase()}, omra hajj agréée france, ${agency.name.toLowerCase()} tarifs 2026`}
        canonical={canonicalUrl}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          "name": agency.name,
          "url": agency.url,
          "sameAs": [agency.url],
          "areaServed": { "@type": "Country", "name": "France" },
          "priceRange": agency.priceRange || "€€",
          "knowsAbout": ["Omra", "Hajj", "Pèlerinage", ...(agency.specialties || [])],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": agency.googleRating,
            "reviewCount": agency.reviewCount,
            "bestRating": "5",
            "worstRating": "1"
          },
          "review": {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": agency.googleRating,
              "bestRating": "5"
            },
            "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie" }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl
          }
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <SEOBreadcrumb
          items={[
            { name: 'Accueil', url: '/' },
            { name: 'Agences Omra & Hajj', url: '/agences-liste' },
            { name: agency.name, url: `/agence-details/${agency.slug}` }
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

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {agency.name} — Agence Omra & Hajj
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Analyse complète de {agency.name} : note Google, avis clients vérifiés, points forts, tarifs et spécialités pour votre pèlerinage 2026.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">

            {/* Note & Résumé */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl" aria-label={`Note et avis ${agency.name}`}>{agency.name}</CardTitle>
                  <a
                    href={agency.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                    aria-label={`Visiter le site de ${agency.name}`}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex">{renderStars(agency.googleRating)}</div>
                  <Badge className={getRatingColor(agency.googleRating)} variant="secondary">
                    {agency.googleRating}/5 — {getRatingLabel(agency.googleRating)}
                  </Badge>
                  <span className="text-lg font-semibold">
                    {agency.reviewCount.toLocaleString('fr-FR')} avis Google
                  </span>
                </div>
                {agency.highlight && (
                  <p className="text-lg text-primary font-medium bg-primary/10 p-3 rounded-lg">
                    {agency.highlight}
                  </p>
                )}
              </CardHeader>
            </Card>

            {/* Points Forts / Points d'Attention */}
            <div className="grid md:grid-cols-2 gap-6">
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
                        <span className="text-green-500 font-bold mt-0.5">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <TrendingDown className="h-5 w-5" />
                    Points d'Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {agency.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold mt-0.5">⚠</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Pour qui est cette agence ? */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Pour qui est {agency.name} ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                {agency.priceRange.includes('Économique') && (
                  <p>✓ <strong>Pèlerins avec un budget serré</strong> — {agency.name} propose des formules accessibles sans sacrifier la qualité essentielle du pèlerinage.</p>
                )}
                {agency.priceRange.includes('Standard') && (
                  <p>✓ <strong>Pèlerins cherchant le bon rapport qualité/prix</strong> — des prestations solides (hôtels bien situés, guides expérimentés) à un tarif raisonnable.</p>
                )}
                {agency.priceRange.includes('Premium') && (
                  <p>✓ <strong>Pèlerins souhaitant le meilleur confort</strong> — hôtels proches du Haram, accompagnement personnalisé et services haut de gamme.</p>
                )}
                <p>✓ <strong>Spécialités : </strong>{agency.specialties.join(', ')}.</p>
                <p>✓ <strong>Note client : {agency.googleRating}/5</strong> sur {agency.reviewCount.toLocaleString('fr-FR')} avis — {getRatingLabel(agency.googleRating).toLowerCase()} pour ce type de prestation.</p>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Questions fréquentes sur {agency.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {faqItems.map((item, i) => (
                    <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <h3 className="font-semibold mb-2 text-foreground">{item.question}</h3>
                      <p className="text-muted-foreground text-sm">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Agences similaires */}
            {relatedAgencies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Agences similaires à comparer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {relatedAgencies.map(related => (
                      <div
                        key={related.slug}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => navigate(`/agence-details/${related.slug}`)}
                      >
                        <div>
                          <span className="font-medium">{related.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">({related.priceRange})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">{related.googleRating}/5</span>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => navigate('/comparatif-agences')}
                  >
                    Voir le comparatif complet
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Gamme de Prix</h4>
                  <Badge variant="outline" className="text-sm">{agency.priceRange}</Badge>
                  {PRICE_RANGE_LABEL[agency.priceRange] && (
                    <p className="text-xs text-muted-foreground mt-1">{PRICE_RANGE_LABEL[agency.priceRange]}</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Spécialités</h4>
                  <div className="flex flex-wrap gap-2">
                    {agency.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Note Google</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(agency.googleRating)}</div>
                    <span className="font-bold">{agency.googleRating}/5</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Basé sur {agency.reviewCount.toLocaleString('fr-FR')} avis vérifiés
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                  <Button asChild className="w-full">
                    <a href={agency.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visiter le site officiel
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/comparateur-omra-france')}
                  >
                    Comparer les offres
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/comparatif-visuel')}
                >
                  Comparer visuellement
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/comparatif-agences')}
                >
                  Tableau comparatif
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/agences-liste')}
                >
                  Toutes les agences
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
