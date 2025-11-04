import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X, Star, ExternalLink, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';

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
    name: "Medin Voyages",
    url: "https://medinvoyages.com/",
    googleRating: 5.0,
    reviewCount: 269,
    priceRange: "Standard",
    highlight: "Note parfaite 5/5 avec 269 avis",
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
      tarifsClairs: true,
      optionsPersonnalisees: true
    }
  },
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
    name: "Sabile Voyages",
    url: "https://sabilevoyages.com/",
    googleRating: 4.9,
    reviewCount: 154,
    priceRange: "Standard",
    highlight: "1ère Agence 100% en ligne",
    features: {
      formulesToutInclus: true,
      guidesExperience: true,
      hotelsProximiteMosquees: false,
      departsMultiVilles: false,
      accompagnementSpirituel: true,
      organisationLogistique: true,
      serviceClientReactif: true,
      groupesTailleHumaine: true,
      dimensionEducative: false,
      agenceAgreee: true,
      tarifsClairs: true,
      optionsPersonnalisees: true
    }
  },
  {
    name: "Al Maqam Voyages",
    url: "https://almaqamvoyages.com/",
    googleRating: 4.9,
    reviewCount: 349,
    priceRange: "Standard",
    highlight: "8+ ans d'expérience",
    features: {
      formulesToutInclus: true,
      guidesExperience: true,
      hotelsProximiteMosquees: true,
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
  },
  {
    name: "Al Hayat Voyages",
    url: "https://www.alhayat-voyages.com/",
    googleRating: 4.9,
    reviewCount: 478,
    priceRange: "Économique",
    highlight: "Agence officiellement agréée",
    features: {
      formulesToutInclus: true,
      guidesExperience: true,
      hotelsProximiteMosquees: true,
      departsMultiVilles: false,
      accompagnementSpirituel: true,
      organisationLogistique: true,
      serviceClientReactif: true,
      groupesTailleHumaine: false,
      dimensionEducative: false,
      agenceAgreee: true,
      tarifsClairs: false,
      optionsPersonnalisees: false
    }
  },
  {
    name: "Partir à la Mecque",
    url: "https://partiralamecque.com/",
    googleRating: 4.8,
    reviewCount: 735,
    priceRange: "Premium",
    highlight: "Agréé par le ministère saoudien",
    features: {
      formulesToutInclus: true,
      guidesExperience: true,
      hotelsProximiteMosquees: true,
      departsMultiVilles: false,
      accompagnementSpirituel: true,
      organisationLogistique: true,
      serviceClientReactif: false,
      groupesTailleHumaine: false,
      dimensionEducative: false,
      agenceAgreee: true,
      tarifsClairs: true,
      optionsPersonnalisees: false
    }
  },
  {
    name: "Haramain Voyages",
    url: "https://www.haramainvoyages.com/",
    googleRating: 4.8,
    reviewCount: 651,
    priceRange: "Standard",
    highlight: "Organisation complète de A à Z",
    features: {
      formulesToutInclus: true,
      guidesExperience: true,
      hotelsProximiteMosquees: false,
      departsMultiVilles: false,
      accompagnementSpirituel: true,
      organisationLogistique: true,
      serviceClientReactif: true,
      groupesTailleHumaine: false,
      dimensionEducative: false,
      agenceAgreee: true,
      tarifsClairs: false,
      optionsPersonnalisees: false
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
    name: "Omra Sounnah",
    url: "https://www.omrasounnah.com/",
    googleRating: 4.9,
    reviewCount: 303,
    priceRange: "Standard",
    highlight: "Accompagnement personnalisé",
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
      optionsPersonnalisees: true
    }
  },
  {
    name: "Omra Discount",
    url: "https://www.omradiscount.fr/",
    googleRating: 4.9,
    reviewCount: 120,
    priceRange: "Économique",
    highlight: "Formules 5★ à prix discount",
    features: {
      formulesToutInclus: true,
      guidesExperience: true,
      hotelsProximiteMosquees: true,
      departsMultiVilles: true,
      accompagnementSpirituel: true,
      organisationLogistique: true,
      serviceClientReactif: false,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const isMobile = useIsMobile();

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

  const filteredAgenciesForSelection = agenciesFeatures.filter(agency =>
    agency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNextCard = () => {
    if (currentCardIndex < filteredAgencies.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

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
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h3 className="text-base md:text-lg font-semibold">
            {isMobile ? 'Sélectionner' : 'Sélectionner les agences à comparer'}
          </h3>
          <Badge variant="outline" className="text-xs md:text-sm">
            {selectedAgencies.length}/4
          </Badge>
        </div>
        
        {/* Search Bar for mobile */}
        {isMobile && (
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher une agence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        )}
        
        <div className={`grid gap-2 md:gap-3 ${
          isMobile 
            ? 'grid-cols-1' 
            : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {filteredAgenciesForSelection.map((agency) => {
            const isSelected = selectedAgencies.includes(agency.name);
            return (
              <div 
                key={agency.name} 
                onClick={() => handleAgencyToggle(agency.name)}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-muted/30'
                } ${!isSelected && selectedAgencies.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Checkbox
                  id={agency.name}
                  checked={isSelected}
                  disabled={!isSelected && selectedAgencies.length >= 4}
                  className="pointer-events-none"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={agency.name}
                    className="text-sm font-medium leading-tight cursor-pointer block"
                  >
                    {agency.name}
                  </label>
                  {isMobile && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(agency.googleRating).slice(0, 5)}</div>
                      <span className="text-xs text-muted-foreground">
                        {agency.googleRating} ({agency.reviewCount})
                      </span>
                    </div>
                  )}
                </div>
                {isSelected && isMobile && (
                  <Badge variant="secondary" className="text-xs">
                    ✓
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedAgencies.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <p className="text-sm md:text-base text-muted-foreground">
            {isMobile ? 'Sélectionnez au moins 1 agence' : 'Sélectionnez au moins une agence pour voir la comparaison'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View with Navigation */}
          <div className="block xl:hidden">
            {isMobile && filteredAgencies.length > 1 && (
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevCard}
                  disabled={currentCardIndex === 0}
                  className="h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  {filteredAgencies.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentCardIndex
                          ? 'w-6 bg-primary'
                          : 'w-2 bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextCard}
                  disabled={currentCardIndex === filteredAgencies.length - 1}
                  className="h-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className={isMobile ? 'space-y-4' : 'space-y-4 md:space-y-6'}>
              {(isMobile ? [filteredAgencies[currentCardIndex]] : filteredAgencies).filter(Boolean).map((agency) => (
                <Card key={agency.name} className={`transition-all duration-300 ${
                  agency.isRecommended 
                    ? 'border-2 border-primary shadow-lg' 
                    : 'border border-border'
                }`}>
                  <CardHeader className="pb-3 md:pb-4">
                    {agency.isRecommended && (
                      <Badge className="bg-primary text-primary-foreground px-2 md:px-3 py-0.5 md:py-1 text-xs font-bold shadow-lg w-fit mb-2">
                        ⭐ Recommandé
                      </Badge>
                    )}
                    <div className="space-y-2 md:space-y-3">
                      <h3 className="font-bold text-lg md:text-xl">{agency.name}</h3>
                      <div className="flex justify-center gap-1">{renderStars(agency.googleRating)}</div>
                      <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-primary">{agency.googleRating}/5</div>
                        <div className="text-xs md:text-sm text-muted-foreground">({agency.reviewCount} avis)</div>
                      </div>
                      <div className="flex justify-center">
                        <Badge className={getPriceRangeColor(agency.priceRange)}>
                          {agency.priceRange}
                        </Badge>
                      </div>
                      {agency.highlight && (
                        <p className="text-xs md:text-sm text-primary font-medium text-center line-clamp-2">{agency.highlight}</p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4 pt-0">
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(featureLabels).map(([key, label]) => {
                        const hasFeature = agency.features[key as keyof typeof agency.features];
                        return (
                          <div 
                            key={key} 
                            className={`flex items-center justify-between p-2.5 rounded-lg transition-colors ${
                              hasFeature ? 'bg-success/5 border border-success/20' : 'bg-muted/20'
                            }`}
                          >
                            <span className="text-xs md:text-sm font-medium">{label}</span>
                            {hasFeature ? (
                              <Check className="h-4 w-4 md:h-5 md:w-5 text-success font-bold stroke-[3]" />
                            ) : (
                              <X className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground/40 stroke-[2]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <Button 
                      className={`w-full h-10 md:h-11 ${
                        agency.isRecommended 
                          ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md' 
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
                        Voir l'agence <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Desktop Comparison Table */}
          <div className="hidden xl:block overflow-x-auto">
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
                      <td key={agency.name} className="w-72 p-0 pl-4" style={{ position: 'relative', paddingTop: agency.isRecommended ? '24px' : '0' }}>
                        {agency.isRecommended && (
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50">
                            <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-bold shadow-lg whitespace-nowrap">
                              ⭐ Recommandé
                            </Badge>
                          </div>
                        )}
                        <Card className={`transition-all duration-300 ${
                          agency.isRecommended 
                            ? 'border-2 border-primary shadow-glow transform scale-105 mt-2' 
                            : 'border border-border hover:border-primary/30'
                        }`}>
                          <CardHeader className="text-center relative pt-6">
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
        </>
      )}
    </div>
  );
}