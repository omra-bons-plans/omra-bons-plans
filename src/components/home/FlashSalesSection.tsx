import React, { useState, useEffect } from "react";
import { ChevronDown, Hotel, Plane, UserCheck, Car, Home, Baby, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CompactAdCard } from "@/components/ui/CompactAdCard";
import { LargeAdCard } from "@/components/ui/LargeAdCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FlashSalesSectionProps {
  listings: any[];
  isMobile: boolean;
  viewMode: "list" | "grid";
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const FlashSalesSection = ({ 
  listings, 
  isMobile, 
  viewMode,
  selectedCategory,
  onCategoryChange
}: FlashSalesSectionProps) => {
  const [carouselApi, setCarouselApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const flashSales = listings.filter(ad => ad.isFlashSale);

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

  const filteredFlashSales = selectedCategory === 'all' 
    ? flashSales 
    : flashSales.filter(ad => ad.category === selectedCategory);

  if (flashSales.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="destructive" className="text-lg px-4 py-2">
          ⚡ Ventes Flash
        </Badge>
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

      {/* Flash Sales Carousel */}
      {isMobile ? (
        <div className="space-y-4">
          {filteredFlashSales.slice(0, 6).map(ad => (
            <CompactAdCard key={ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <Carousel setApi={setCarouselApi} className="w-full">
          <CarouselContent>
            {filteredFlashSales.map(ad => (
              <CarouselItem key={ad.id} className="md:basis-1/2 lg:basis-1/3">
                <LargeAdCard listing={ad} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </section>
  );
};
