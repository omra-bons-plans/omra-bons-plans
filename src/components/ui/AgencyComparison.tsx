import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X, Star, ExternalLink } from 'lucide-react';

interface AgencyFeatures {
  name: string;
  url: string;
  googleRating: number;
  reviewCount: number;
  priceRange: 'Économique' | 'Standard' | 'Premium';
  features: {
    formulesToutInclus: boolean;
    guidesExperience: boolean;
    hotelsProximiteMosquees: boolean;
    departsMultiVilles: boolean;
    accompagnementSpirituel: boolean;
    organisationLogistique: boolean;
    serviceClientReactif: boolean;
    groupesTailleHumaine: boolean;
    dimensionEducative: boolean;
    agenceAgreee: boolean;
    tarifsClairs: boolean;
    optionsPersonnalisees: boolean;
  };
  highlight?: string;
  isRecommended?: boolean;
}

const agenciesFeatures: AgencyFeatures[] = [
  {
    name: "Al Sirate Voyage",
    url: "https://www.alsiratevoyage.com/",
    googleRating: 5.0,
    reviewCount: 1015,
    priceRange: "Premium",
    isRecommended: true,
    highlight: "Note parfaite avec organisation d'excellence",
    features: {
      formulesToutInclus: true,
      guidesExperience: true,
      hotelsProximiteMosquees: true,
      departsMultiVilles: false,
      accompagnementSpirituel: true,
      organisationLogistique: true,
      serviceClientReactif: true,
      groupesTailleHumaine: true,
      dimensionEducative: false,
      agenceAgreee: true,
      tarifsClairs: true,
      optionsPersonnalisees: false
    }
  },
  {
    name: "Omra Du Savoir",
    url: "https://www.omradusavoir.fr/",
    googleRating: 5.0,
    reviewCount: 337,
    priceRange: "Premium",
    highlight: "Approche pédagogique unique",
    features: {
      formulesToutInclus: true,
      guidesExperience: true,
      hotelsProximiteMosquees: true,
      departsMultiVilles: false,
      accompagnementSpirituel: true,
      organisationLogistique: true,
      serviceClientReactif: true,
      groupesTailleHumaine: true,
      dimensionEducative: true,
      agenceAgreee: true,
      tarifsClairs: false,
      optionsPersonnalisees: true
    }
  },
  {
    name: "Omra Pour Tous",
    url: "https://omrapourtous.com/",
    googleRating: 4.9,
    reviewCount: 4822,
    priceRange: "Économique",
    highlight: "Leader avec départs multi-villes",
    features: {
      formulesToutInclus: true,
      guidesExperience: true,
      hotelsProximiteMosquees: true,
      departsMultiVilles: true,
      accompagnementSpirituel: true,
      organisationLogistique: true,
      serviceClientReactif: false,
      groupesTailleHumaine: true,
      dimensionEducative: false,
      agenceAgreee: true,
      tarifsClairs: true,
      optionsPersonnalisees: false
    }
  },
  {
    name: "TAWAF",
    url: "https://www.tawaf.fr/",
    googleRating: 4.9,
    reviewCount: 1289,
    priceRange: "Premium",
    highlight: "Excellence dans l'accompagnement spirituel",
    features: {
      formulesToutInclus: true,
      guidesExperience: true,
      hotelsProximiteMosquees: true,
      departsMultiVilles: false,
      accompagnementSpirituel: true,
      organisationLogistique: true,
      serviceClientReactif: false,
      groupesTailleHumaine: true,
      dimensionEducative: true,
      agenceAgreee: true,
      tarifsClairs: true,
      optionsPersonnalisees: true
    }
  },
  {
    name: "Al Bayt",
    url: "https://www.albayt.fr/",
    googleRating: 4.7,
    reviewCount: 930,
    priceRange: "Standard",
    highlight: "Pionnier avec 13 ans d'expérience",
    features: {
      formulesToutInclus: true,
      guidesExperience: true,
      hotelsProximiteMosquees: false,
      departsMultiVilles: false,
      accompagnementSpirituel: true,
      organisationLogistique: true,
      serviceClientReactif: false,
      groupesTailleHumaine: false,
      dimensionEducative: false,
      agenceAgreee: true,
      tarifsClairs: false,
      optionsPersonnalisees: false
    }
  },
  {
    name: "Pèlerin Hajj",
    url: "https://pelerinhajj.com/",
    googleRating: 4.9,
    reviewCount: 1200,
    priceRange: "Économique",
    highlight: "Tarifs accessibles dès 999€",
    features: {
      formulesToutInclus: true,
      guidesExperience: true,
      hotelsProximiteMosquees: true,
      departsMultiVilles: true,
      accompagnementSpirituel: true,
      organisationLogistique: true,
      serviceClientReactif: true,
      groupesTailleHumaine: false,
      dimensionEducative: false,
      agenceAgreee: true,
      tarifsClairs: true,
      optionsPersonnalisees: false
    }
  }
];

const featureLabels = {
  formulesToutInclus: "Formules tout inclus",
  guidesExperience: "Guides expérimentés",
  hotelsProximiteMosquees: "Hôtels proche mosquées",
  departsMultiVilles: "Départs multi-villes",
  accompagnementSpirituel: "Accompagnement spirituel",
  organisationLogistique: "Organisation logistique",
  serviceClientReactif: "Service client réactif",
  groupesTailleHumaine: "Grand groupe",
  dimensionEducative: "Dimension éducative",
  agenceAgreee: "Agence agréée",
  tarifsClairs: "Tarifs clairs",
  optionsPersonnalisees: "Options personnalisées"
};

interface AgencyComparisonProps {
  className?: string;
}

export default function AgencyComparison({ className }: AgencyComparisonProps) {
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>([
    "Al Sirate Voyage", "TAWAF", "Omra Pour Tous"
  ]);

  const handleAgencyToggle = (agencyName: string) => {
    setSelectedAgencies(prev => {
      if (prev.includes(agencyName)) {
        return prev.filter(name => name !== agencyName);
      } else if (prev.length < 4) {
        return [...prev, agencyName];
      }
      return prev;
    });
  };

  const filteredAgencies = agenciesFeatures.filter(agency => 
    selectedAgencies.includes(agency.name)
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < rating ? 'fill-warning text-warning' : 'text-muted-foreground/30'}`}
      />
    ));
  };

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case 'Économique': return 'bg-success/10 text-success border-success/20';
      case 'Standard': return 'bg-primary/10 text-primary border-primary/20';
      case 'Premium': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className={className}>
      {/* Agency Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Sélectionner les agences à comparer (max 4)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {agenciesFeatures.map((agency) => (
            <div key={agency.name} className="flex items-center space-x-2">
              <Checkbox
                id={agency.name}
                checked={selectedAgencies.includes(agency.name)}
                onCheckedChange={() => handleAgencyToggle(agency.name)}
                disabled={!selectedAgencies.includes(agency.name) && selectedAgencies.length >= 4}
              />
              <label
                htmlFor={agency.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {agency.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="min-w-fit">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <td className="w-64 p-0">
                  <Card className="border-2 border-muted bg-muted/20 h-full">
                    <CardHeader className="text-center pb-4">
                      <div className="h-16 flex items-center justify-center">
                        <h3 className="font-bold text-lg text-muted-foreground">Fonctionnalités</h3>
                      </div>
                      <div className="h-20"></div>
                    </CardHeader>
                  </Card>
                </td>
                {filteredAgencies.map((agency) => (
                  <td key={agency.name} className="w-72 p-0 pl-4">
                     <Card className={`transition-all duration-300 ${
                       agency.isRecommended 
                         ? 'border-2 border-primary shadow-glow transform scale-105 mt-6' 
                         : 'border border-border hover:border-primary/30'
                     }`}>
                       <CardHeader className="text-center relative pt-6 overflow-visible">
                         {agency.isRecommended && (
                           <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                             <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-bold shadow-md whitespace-nowrap">
                               ⭐ Recommandé
                             </Badge>
                           </div>
                         )}
                        
                        <div className="space-y-3">
                          <h3 className="font-bold text-lg">{agency.name}</h3>
                          <div className="flex justify-center">{renderStars(agency.googleRating)}</div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{agency.googleRating}/5</div>
                            <div className="text-sm text-muted-foreground">({agency.reviewCount} avis)</div>
                          </div>
                          <Badge className={getPriceRangeColor(agency.priceRange)}>
                            {agency.priceRange}
                          </Badge>
                          {agency.highlight && (
                            <p className="text-xs text-primary font-medium">{agency.highlight}</p>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(featureLabels).map(([key, label]) => (
                <tr key={key}>
                  <td className="w-64 p-0 align-top">
                    <div className="h-16 flex items-center text-sm font-medium text-muted-foreground border-b border-muted/30 px-4 bg-muted/5">
                      {label}
                    </div>
                  </td>
                  {filteredAgencies.map((agency) => (
                    <td key={agency.name} className="w-72 p-0 pl-4 align-top">
                      <div className="h-16 flex items-center justify-center border-b border-muted/30">
                        {agency.features[key as keyof typeof agency.features] ? (
                          <Check className="h-6 w-6 text-success font-bold stroke-[3]" />
                        ) : (
                          <X className="h-6 w-6 text-destructive font-bold stroke-[3]" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="w-64 p-0"></td>
                {filteredAgencies.map((agency) => (
                  <td key={agency.name} className="w-72 p-0 pl-4">
                    <div className="h-20 flex items-center justify-center p-4">
                      <Button 
                        className={`w-full ${
                          agency.isRecommended 
                            ? 'bg-primary hover:bg-primary-dark text-primary-foreground' 
                            : 'variant-outline'
                        }`}
                        asChild
                      >
                        <a 
                          href={agency.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          Voir l'agence <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {selectedAgencies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Sélectionnez au moins une agence pour voir la comparaison</p>
        </div>
      )}
    </div>
  );
}