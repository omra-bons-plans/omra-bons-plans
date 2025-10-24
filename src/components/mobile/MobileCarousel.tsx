import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

interface MobileCarouselProps {
  children: React.ReactNode;
  className?: string;
  onApiChange?: (api: any) => void;
}

/**
 * Carousel optimisé mobile - chargement différé après interaction
 * Ne pas charger le carousel dans la fold mobile initialement
 */
export const MobileCarousel = ({ 
  children, 
  className = '',
  onApiChange
}: MobileCarouselProps) => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sur mobile, différer le chargement du carousel
    if (isMobile) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500); // Charger après LCP
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [isMobile]);

  if (!isVisible && isMobile) {
    return (
      <div className="h-64 bg-muted/30 animate-pulse rounded-lg" />
    );
  }

  return (
    <Carousel 
      className={className}
      setApi={onApiChange}
    >
      <CarouselContent>
        {children}
      </CarouselContent>
    </Carousel>
  );
};
