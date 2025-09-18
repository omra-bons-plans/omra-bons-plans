import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X, Star, ExternalLink, Filter, ArrowUpDown } from 'lucide-react';

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
  const [showOnlySelected, setShowOnlySelected] = useState(false);

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
      {/* Enhanced Header with Controls */}
      <div className="mb-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Filter className="h-4 w-4" />
            Outil de Comparaison Interactif
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Sélectionnez jusqu'à 4 agences pour les comparer côte à côte
          </p>
        </div>

        {/* Quick Selection Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedAgencies(agenciesFeatures.filter(a => a.isRecommended).map(a => a.name))}
            className="text-xs"
          >
            Recommandées
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedAgencies(agenciesFeatures.filter(a => a.priceRange === 'Économique').map(a => a.name).slice(0, 4))}
            className="text-xs"
          >
            Économiques
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedAgencies(agenciesFeatures.filter(a => a.priceRange === 'Premium').map(a => a.name).slice(0, 4))}
            className="text-xs"
          >
            Premium
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedAgencies([])}
            className="text-xs"
          >
            Tout désélectionner
          </Button>
        </div>

        {/* Agency Selection Grid */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-center">Choisir les agences à comparer</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {agenciesFeatures.map((agency) => (
              <div 
                key={agency.name} 
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
                  selectedAgencies.includes(agency.name)
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/30'
                }`}
                onClick={() => handleAgencyToggle(agency.name)}
              >
                {agency.isRecommended && (
                  <div className="absolute -top-1 -right-1">
                    <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5 shadow-md">
                      ⭐
                    </Badge>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedAgencies.includes(agency.name)}
                    disabled={!selectedAgencies.includes(agency.name) && selectedAgencies.length >= 4}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm leading-tight">{agency.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(agency.googleRating)}</div>
                      <span className="text-xs text-muted-foreground">
                        {agency.googleRating} ({agency.reviewCount})
                      </span>
                    </div>
                    <Badge 
                      className={`${getPriceRangeColor(agency.priceRange)} text-xs mt-1`}
                      variant="outline"
                    >
                      {agency.priceRange}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedAgencies.length > 0 && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm">
                <Check className="h-4 w-4" />
                {selectedAgencies.length} agence{selectedAgencies.length > 1 ? 's' : ''} sélectionnée{selectedAgencies.length > 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedAgencies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Sélectionnez au moins une agence pour voir la comparaison</p>
        </div>
      ) : (
        <>
          {/* Enhanced Mobile Card View */}
          <div className="block xl:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAgencies.map((agency) => (
                <Card key={agency.name} className={`group transition-all duration-500 hover:shadow-xl ${
                  agency.isRecommended 
                    ? 'border-2 border-primary shadow-lg bg-gradient-to-br from-primary/5 to-background' 
                    : 'border border-border hover:border-primary/50'
                }`}>
                  <CardHeader className="pb-3 relative">
                    {agency.isRecommended && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-bold shadow-lg animate-pulse">
                          ⭐ Recommandé
                        </Badge>
                      </div>
                    )}
                    
                    <div className="text-center space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors duration-300">
                          {agency.name}
                        </h3>
                        <div className="flex justify-center items-center gap-2">
                          <div className="flex">{renderStars(agency.googleRating)}</div>
                          <span className="text-sm text-muted-foreground">({agency.reviewCount})</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {agency.googleRating}/5
                        </div>
                        <Badge className={`${getPriceRangeColor(agency.priceRange)} font-medium px-4 py-1`}>
                          {agency.priceRange}
                        </Badge>
                      </div>
                      
                      {agency.highlight && (
                        <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                          <p className="text-sm text-primary font-medium text-center">{agency.highlight}</p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Features in a more compact grid */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground mb-3 text-center">
                        Services & Avantages
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(featureLabels).map(([key, label]) => (
                          <div key={key} className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                            agency.features[key as keyof typeof agency.features]
                              ? 'bg-success/10 text-success border border-success/20'
                              : 'bg-muted/30 text-muted-foreground'
                          }`}>
                            {agency.features[key as keyof typeof agency.features] ? (
                              <Check className="h-3 w-3 flex-shrink-0" />
                            ) : (
                              <X className="h-3 w-3 flex-shrink-0" />
                            )}
                            <span className="leading-tight">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full group-hover:scale-105 transition-transform duration-300 ${
                        agency.isRecommended 
                          ? 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg' 
                          : ''
                      }`}
                      variant={agency.isRecommended ? 'default' : 'outline'}
                      asChild
                    >
                      <a 
                        href={agency.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2"
                      >
                        Découvrir l'agence
                        <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced Desktop Comparison Table */}
          <div className="hidden xl:block">
            <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <td className="w-64 p-0">
                        <div className="h-full bg-gradient-to-br from-muted/50 to-muted/30 border-r border-border">
                          <div className="p-6 text-center">
                            <div className="space-y-2">
                              <ArrowUpDown className="h-5 w-5 mx-auto text-muted-foreground" />
                              <h3 className="font-bold text-lg text-foreground">Comparaison</h3>
                              <p className="text-xs text-muted-foreground">Fonctionnalités</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      {filteredAgencies.map((agency) => (
                        <td key={agency.name} className="w-72 p-0 pl-4" style={{ position: 'relative', paddingTop: agency.isRecommended ? '24px' : '0' }}>
                          {agency.isRecommended && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50">
                              <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-3 py-1 text-xs font-bold shadow-lg whitespace-nowrap animate-pulse">
                                ⭐ Recommandé
                              </Badge>
                            </div>
                          )}
                          <Card className={`group transition-all duration-500 hover:shadow-xl ${
                            agency.isRecommended 
                              ? 'border-2 border-primary shadow-glow bg-gradient-to-br from-primary/5 to-background' 
                              : 'border border-border hover:border-primary/50'
                          }`}>
                            <CardHeader className="text-center relative pt-6 pb-4">
                              <div className="space-y-3">
                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                  {agency.name}
                                </h3>
                                <div className="flex justify-center">{renderStars(agency.googleRating)}</div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {agency.googleRating}/5
                                  </div>
                                  <div className="text-sm text-muted-foreground">({agency.reviewCount} avis)</div>
                                </div>
                                <Badge className={`${getPriceRangeColor(agency.priceRange)} font-medium px-3 py-1`}>
                                  {agency.priceRange}
                                </Badge>
                                {agency.highlight && (
                                  <div className="px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
                                    <p className="text-xs text-primary font-medium leading-tight">{agency.highlight}</p>
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                          </Card>
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(featureLabels).map(([key, label], index) => (
                      <tr key={key} className={index % 2 === 0 ? 'bg-muted/20' : 'bg-background'}>
                        <td className="w-64 p-0 align-top">
                          <div className="h-16 flex items-center text-sm font-medium text-foreground border-r border-border px-4">
                            {label}
                          </div>
                        </td>
                        {filteredAgencies.map((agency) => (
                          <td key={agency.name} className="w-72 p-0 pl-4 align-top">
                            <div className={`h-16 flex items-center justify-center transition-colors ${
                              agency.features[key as keyof typeof agency.features] 
                                ? 'bg-success/10' 
                                : 'bg-destructive/5'
                            }`}>
                              {agency.features[key as keyof typeof agency.features] ? (
                                <div className="flex items-center gap-2 text-success">
                                  <Check className="h-5 w-5 font-bold stroke-[3]" />
                                  <span className="text-xs font-medium">Oui</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <X className="h-5 w-5 font-bold stroke-[3]" />
                                  <span className="text-xs">Non</span>
                                </div>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="w-64 p-0">
                        <div className="h-20 flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30 border-r border-border">
                          <span className="text-sm font-semibold text-muted-foreground">Action</span>
                        </div>
                      </td>
                      {filteredAgencies.map((agency) => (
                        <td key={agency.name} className="w-72 p-0 pl-4">
                          <div className="h-20 flex items-center justify-center p-4">
                            <Button 
                              className={`w-full group transition-all duration-300 hover:scale-105 ${
                                agency.isRecommended 
                                  ? 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg' 
                                  : 'hover:border-primary/50'
                              }`}
                              variant={agency.isRecommended ? 'default' : 'outline'}
                              asChild
                            >
                              <a 
                                href={agency.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2"
                              >
                                Découvrir
                                <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
          </div>
        </>
      )}
    </div>
  );
}