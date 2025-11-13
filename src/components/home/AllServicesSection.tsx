import React, { useState, useEffect } from "react";
import { LayoutGrid, List, ChevronDown, Hotel, Plane, UserCheck, Car, Home, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdCard from "@/components/ui/AdCard";
import { CompactAdCard } from "@/components/ui/CompactAdCard";
import { LargeAdCard } from "@/components/ui/LargeAdCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AllServicesSectionProps {
  listings: any[];
  isMobile: boolean;
  viewMode: "list" | "grid";
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onViewModeChange: (mode: "list" | "grid") => void;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export const AllServicesSection = ({
  listings,
  isMobile,
  viewMode,
  selectedCategory,
  onCategoryChange,
  onViewModeChange,
  hasMore,
  loading,
  onLoadMore
}: AllServicesSectionProps) => {
  const [carouselApi, setCarouselApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const allServices = listings.filter(ad => !ad.isFlashSale);

  useEffect(() => {
    if (!carouselApi) return;
    setCurrent(carouselApi.selectedScrollSnap());
    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const categories = [
    { id: 'all', label: 'Tout', Icon: LayoutGrid },
    { id: 'sejour', label: 'Séjours', Icon: Hotel },
    { id: 'vol', label: 'Vols', Icon: Plane },
    { id: 'guide', label: 'Guides', Icon: UserCheck },
    { id: 'chauffeur', label: 'Chauffeurs', Icon: Car },
    { id: 'hebergement', label: 'Hébergements', Icon: Home },
    { id: 'babysitting', label: 'Babysitting', Icon: Baby },
  ];

  const filteredServices = selectedCategory === 'all'
    ? allServices
    : allServices.filter(ad => ad.category === selectedCategory);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <Badge variant="outline" className="text-lg px-4 py-2">
          Tous les services
        </Badge>
        {!isMobile && (
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Categories Filter */}
      <Collapsible open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
        <CollapsibleTrigger className="w-full mb-4 p-4 bg-card rounded-lg hover:bg-accent transition-colors flex items-center justify-between">
          <span className="font-medium">Filtrer par catégorie</span>
          <ChevronDown className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Tabs value={selectedCategory} onValueChange={onCategoryChange} className="mb-6">
            <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-transparent p-0">
              {categories.map(cat => {
                const Icon = cat.Icon;
                return (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </CollapsibleContent>
      </Collapsible>

      {/* Services Grid/List */}
      {isMobile ? (
        <div className="space-y-4">
          {filteredServices.map(ad => (
            <CompactAdCard key={ad.id} ad={ad} />
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(ad => (
            <LargeAdCard key={ad.id} listing={ad} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredServices.map(ad => (
            <AdCard key={ad.id} listing={ad} />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            size="lg"
            variant="outline"
          >
            {loading ? 'Chargement...' : 'Voir plus de services'}
          </Button>
        </div>
      )}
    </section>
  );
};
