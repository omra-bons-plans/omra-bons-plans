import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent } from './dialog';
import { Button } from './button';
import { Card } from './card';
import { getImageUrl } from '@/utils/imageUtils';

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

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Main Image */}
        <Card className="overflow-hidden cursor-pointer" onClick={() => openModal(0)}>
          <div className="aspect-video relative">
            <img
              src={allImages[0]}
              alt={`${title} - Images pèlerinage Omra Hajj - ${title}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/ad-placeholder.jpg';
              }}
            />
            
            {allImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                +{allImages.length - 1} photo{allImages.length > 2 ? 's' : ''}
              </div>
            )}
          </div>
        </Card>

        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {allImages.slice(1, 5).map((image, index) => (
              <Card 
                key={index} 
                className="overflow-hidden cursor-pointer"
                onClick={() => openModal(index + 1)}
              >
                <div className="aspect-square relative">
                  <img
                    src={image}
                    alt={`${title} - Photo séjour Omra ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = '/ad-placeholder.jpg';
                    }}
                  />
                  
                  {/* Show "+X more" overlay on last thumbnail if there are more images */}
                  {index === 3 && allImages.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">
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
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
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
            <img
              src={allImages[currentImageIndex]}
              alt={`${title} - Photo pèlerinage ${currentImageIndex + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/ad-placeholder.jpg';
              }}
            />

            {/* Navigation Buttons */}
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};