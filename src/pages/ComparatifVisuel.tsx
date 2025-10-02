import React from 'react';
import { SEOHead } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Button } from '@/components/ui/button';
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
            Comparez jusqu'à 4 agences côte à côte : tarifs, services inclus, notes et spécialités
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Analysez et comparez les meilleures agences de voyage pour votre pèlerinage. 
            Notes Google authentiques, avis clients et analyse détaillée des services.
          </p>
        </header>

        <AgencyComparison />
      </div>
    </div>
  );
}