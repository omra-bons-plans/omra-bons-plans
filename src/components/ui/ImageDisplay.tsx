import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './dialog';
import { Button } from './button';
import { Card } from './card';
import { getImageUrl } from '@/utils/imageUtils';
import UniversalImage from './UniversalImage';

interface ImageDisplayProps {
  images: string[];
  coverImage?: string | null;
  title?: string;
  className?: string;
}

export const ImageDisplay = ({ 
  images, 
  coverImage, 
  title = 'Images', 
  className = '' 
}: ImageDisplayProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Combine cover image and additional images, converting paths to URLs
  const allImagePaths = coverImage 
    ? [coverImage, ...images.filter(img => img !== coverImage)]
    : images;
  
  const allImages = allImagePaths.map(path => getImageUrl(path));

  if (allImages.length === 0) {
    return (
      <Card className={`aspect-video flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center text-muted-foreground">
          <p>Aucune image disponible</p>
        </div>
      </Card>
    );
  }

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchEndX.current) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }
    
    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50; // Distance minimale pour un swipe
    
    if (Math.abs(distance) > threshold && allImages.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      
      if (distance > 0) {
        // Swipe vers la gauche = image suivante
        nextImage();
      } else {
        // Swipe vers la droite = image précédente
        prevImage();
      }
    }

    // Reset touch values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Main Image */}
        <Card className="overflow-hidden cursor-pointer" onClick={() => openModal(0)}>
          <div className="aspect-video relative">
            <UniversalImage
              src={allImages[0]}
              alt={`${title} - Image principale`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              optimize={{ width: 800, height: 600, quality: 85 }}
            />
            
            {allImages.length > 1 && (
              <>
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  +{allImages.length - 1} photo{allImages.length > 2 ? 's' : ''}
                </div>
                
                {/* Pagination dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === 0 
                          ? 'bg-white' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {allImages.slice(1, 5).map((image, index) => (
              <Card 
                key={index} 
                className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openModal(index + 1);
                }}
              >
                <div className="aspect-square relative">
                  <UniversalImage
                    src={image}
                    alt={`${title} - Image ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    optimize={{ width: 200, height: 200, quality: 85 }}
                  />
                  
                  {/* Show "+X more" overlay on last thumbnail if there are more images */}
                  {index === 3 && allImages.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        +{allImages.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black">
          <DialogTitle className="sr-only">
            {title} - Image {currentImageIndex + 1} sur {allImages.length}
          </DialogTitle>
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded">
              {currentImageIndex + 1} / {allImages.length}
            </div>

            {/* Main Image */}
            <UniversalImage
              src={allImages[currentImageIndex]}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              optimize={{ width: 1200, height: 1200, quality: 90 }}
            />

             {/* Navigation Buttons */}
             {allImages.length > 1 && (
               <>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={(e) => {
                     e.stopPropagation();
                     prevImage();
                   }}
                   className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-20"
                   disabled={allImages.length <= 1}
                 >
                   <ChevronLeft className="w-8 h-8" />
                 </Button>
                 
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={(e) => {
                     e.stopPropagation();
                     nextImage();
                   }}
                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-20"
                   disabled={allImages.length <= 1}
                 >
                   <ChevronRight className="w-8 h-8" />
                 </Button>

                 {/* Modal Pagination dots */}
                 <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                   {allImages.map((_, index) => (
                     <button
                       key={index}
                       onClick={(e) => {
                         e.stopPropagation();
                         setCurrentImageIndex(index);
                       }}
                       className={`w-3 h-3 rounded-full transition-all duration-200 ${
                         index === currentImageIndex 
                           ? 'bg-white' 
                           : 'bg-white/50 hover:bg-white/70'
                       }`}
                     />
                   ))}
                 </div>
               </>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};