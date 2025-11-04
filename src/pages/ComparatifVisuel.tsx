import React from 'react';
import { SEOHead } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AgencyComparison from '@/components/ui/AgencyComparison';
import { useIsMobile } from '@/hooks/use-mobile';
import ResponsiveLayout from '@/components/ResponsiveLayout';

export default function ComparatifVisuel() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Comparatif Visuel Agences Omra & Hajj - Outil Interactif"
          description="Outil de comparaison visuel interactif pour choisir la meilleure agence de voyage Omra et Hajj. Comparez jusqu'à 4 agences simultanément."
          keywords="comparatif visuel agences omra, hajj comparateur, outil comparaison agences"
          canonical="https://omrabonsplans.fr/comparatif-visuel"
        />

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
              {isMobile ? 'Comparatif Visuel Agences' : 'Comparatif Visuel Interactif des Agences Omra & Hajj 2026'}
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
              <p className="text-sm text-muted-foreground">
                Sélectionnez jusqu&apos;à 4 agences et comparez leurs services
              </p>
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