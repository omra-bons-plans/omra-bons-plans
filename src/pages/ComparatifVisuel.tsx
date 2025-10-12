import React from 'react';
import { SEOHead } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AgencyComparison from '@/components/ui/AgencyComparison';

export default function ComparatifVisuel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Comparatif Visuel Agences Omra & Hajj - Outil Interactif"
        description="Outil de comparaison visuel interactif pour choisir la meilleure agence de voyage Omra et Hajj. Comparez jusqu'à 4 agences simultanément."
        keywords="comparatif visuel agences omra, hajj comparateur, outil comparaison agences"
        canonical="https://omrabonsplans.fr/comparatif-visuel"
      />

      <div className="container mx-auto px-4 py-8">
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
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Comparatif Visuel Interactif des Agences Omra & Hajj 2026
          </h1>
          <h2 className="text-2xl text-muted-foreground mb-4 font-semibold">
            Comparez jusqu&apos;à 4 agences côte à côte : tarifs, services inclus, notes Google et spécialités
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Trouvez l&apos;agence de voyage Omra ou Hajj idéale grâce à notre outil de comparaison visuel innovant. 
            Sélectionnez jusqu&apos;à 4 agences parmi les meilleures du marché francophone et comparez instantanément 
            leurs offres : fourchettes de prix, services inclus (vols, hébergement, transferts, accompagnement spirituel), 
            notes Google authentiques basées sur des centaines d&apos;avis clients réels, et spécialités de chaque agence. 
            Notre comparateur transparent vous aide à prendre une décision éclairée pour votre voyage spirituel en 
            visualisant clairement les différences entre les agences. Comparez les tarifs des packages tout compris, 
            vérifiez la proximité des hôtels par rapport au Haram de La Mecque et de Médine, analysez les services 
            d&apos;accompagnement spirituel proposés, et découvrez les points forts de chaque agence certifiée. 
            Que vous recherchiez une formule économique, un séjour de luxe ou un accompagnement personnalisé avec 
            guide francophone, notre outil vous permet de comparer objectivement toutes les options disponibles 
            pour votre Omra 2026 ou Hajj 2026. Gagnez du temps en évitant de consulter des dizaines de sites web 
            différents et prenez votre décision en toute confiance.
          </p>
        </header>

        <AgencyComparison />

        {/* Liens utiles */}
        <Card className="mt-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Ressources utiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/agences-liste" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Liste des Agences</h3>
                <p className="text-sm text-muted-foreground">Voir toutes les agences Omra et leurs détails</p>
              </a>
              <a href="/comparatif-agences" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Comparatif Détaillé</h3>
                <p className="text-sm text-muted-foreground">Analyse approfondie des agences de voyage Omra</p>
              </a>
              <a href="/category/sejours" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Séjours Omra</h3>
                <p className="text-sm text-muted-foreground">Découvrez nos packages complets pour l'Omra</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}