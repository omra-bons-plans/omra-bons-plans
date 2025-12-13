import React from 'react';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AgencyComparison from '@/components/ui/AgencyComparison';
import { useIsMobile } from '@/hooks/use-mobile';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { Helmet } from "react-helmet-async";

export default function ComparatifVisuel() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Comparateur Visuel Agences Omra - Outil Interactif | Omra Bons Plans</title>
        <meta name="description" content="Outil de comparaison visuel interactif pour choisir votre agence Omra et Hajj. Comparez jusqu'à 4 agences côte à côte : tarifs, services et avis Google." />
        <meta name="keywords" content="comparatif visuel agences omra, hajj comparateur, outil comparaison agences, omra 2026" />
        <link rel="canonical" href="https://omrabonsplans.fr/agences-liste" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Comparateur Visuel Agences Omra - Outil Interactif" />
        <meta property="og:description" content="Comparez jusqu'à 4 agences Omra et Hajj côte à côte avec notre outil interactif." />
        <meta property="og:url" content="https://omrabonsplans.fr/comparatif-visuel" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Comparateur Visuel Agences Omra",
            "description": "Outil de comparaison visuel interactif pour choisir votre agence Omra et Hajj",
            "url": "https://omrabonsplans.fr/comparatif-visuel",
            "applicationCategory": "UtilityApplication"
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">

        <div className="container mx-auto px-4 py-4 md:py-8">
          <SEOBreadcrumb 
            items={[
              { name: 'Accueil', url: '/' },
              { name: 'Agences Liste', url: '/agences-liste' },
              { name: 'Comparatif Visuel', url: '/comparatif-visuel' }
            ]}
          />

          <Button 
            variant="ghost" 
            onClick={() => navigate('/agences-liste')}
            className="mb-4 md:mb-6"
            size={isMobile ? "sm" : "default"}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isMobile ? 'Retour' : 'Retour à la liste'}
          </Button>

          <header className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {isMobile ? 'Comparateur Visuel' : 'Comparateur Visuel Interactif : Sélectionnez Vos Agences Omra'}
            </h1>
            {!isMobile && (
              <>
                <h2 className="text-2xl text-muted-foreground mb-4 font-semibold">
                  Comparez jusqu&apos;à 4 agences côte à côte : tarifs, services inclus, notes Google et spécialités
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                  Trouvez l&apos;agence de voyage Omra ou Hajj idéale grâce à notre outil de comparaison visuel innovant. 
                  Sélectionnez jusqu&apos;à 4 agences parmi les meilleures du marché francophone et comparez instantanément 
                  leurs offres : fourchettes de prix, services inclus (vols, hébergement, transferts, accompagnement spirituel), 
                  notes Google authentiques basées sur des centaines d&apos;avis clients réels, et spécialités de chaque agence.
                </p>
              </>
            )}
            {isMobile && (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Comparez jusqu&apos;à 4 agences : tarifs, services et avis
                </p>
                <Card className="bg-primary/5 border-primary/20 p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <div className="text-2xl">💡</div>
                    <div className="text-xs text-left">
                      <p className="font-semibold mb-1">Comment utiliser :</p>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        <li>Sélectionnez jusqu&apos;à 4 agences</li>
                        <li>Naviguez entre les cartes</li>
                        <li>Comparez les services et tarifs</li>
                        <li>Cliquez pour visiter le site</li>
                      </ol>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </header>

          <AgencyComparison />

          {/* Liens utiles */}
          <Card className="mt-6 md:mt-8 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Ressources utiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <a href="/agences-liste" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm md:text-base">Liste des Agences</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Voir toutes les agences Omra</p>
                </a>
                <a href="/comparatif-agences" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm md:text-base">Comparatif Détaillé</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Analyse approfondie</p>
                </a>
                <a href="/category/sejours" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1 text-sm md:text-base">Séjours Omra</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Nos packages complets</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
}