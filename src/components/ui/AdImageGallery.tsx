import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { Dialog, DialogContent } from './dialog';
import { Card } from './card';

interface AdImageGalleryProps {
  images: string[];
  coverImage?: string | null;
  title: string;
  isPromotion?: boolean;
  discountPercent?: number;
  isFlash?: boolean;
}

export const AdImageGallery = ({ 
  images, 
  coverImage, 
  title, 
  isPromotion = false, 
  discountPercent = 0,
  isFlash = false 
}: AdImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine cover image and additional images
  const allImages = coverImage 
    ? [coverImage, ...images.filter(img => img !== coverImage)]
    : images;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setShowModal(true);
  };

  const nextModalImage = () => {
    setModalIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevModalImage = () => {
    setModalIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const scrollToThumbnail = (index: number) => {
    if (scrollRef.current) {
      const thumbnail = scrollRef.current.children[index] as HTMLElement;
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  };

  useEffect(() => {
    scrollToThumbnail(currentIndex);
  }, [currentIndex]);

  if (!allImages.length) {
    return (
      <Card className="relative aspect-[4/3] bg-muted flex items-center justify-center rounded-2xl overflow-hidden">
        <div className="text-center">
          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Aucune image disponible</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md group">
        <img
          src={allImages[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
          onClick={() => openModal(currentIndex)}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = '/ad-placeholder.jpg';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 space-y-1.5">
          {isFlash && (
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg text-xs">
              ⚡ FLASH
            </Badge>
          )}
          {isPromotion && discountPercent > 0 && (
            <Badge className="bg-green-600 text-white shadow-lg text-xs">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm h-10 w-10 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm h-10 w-10 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          {currentIndex + 1}/{allImages.length}
        </div>
      </div>

      {/* Thumbnails Slider */}
      {allImages.length > 1 && (
        <div className="px-4">
          <div 
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`
                  relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all
                  ${currentIndex === index 
                    ? 'border-primary shadow-md scale-105' 
                    : 'border-transparent hover:border-muted-foreground/20'
                  }
                `}
              >
                <img
                  src={image}
                  alt={`Miniature ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/ad-placeholder.jpg';
                  }}
                />
                {currentIndex !== index && (
                  <div className="absolute inset-0 bg-black/20" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-0">
          <div className="relative">
            <img
              src={allImages[modalIndex]}
              alt={`${title} - Image ${modalIndex + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-12 w-12 rounded-full"
                  onClick={prevModalImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-12 w-12 rounded-full"
                  onClick={nextModalImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
              {modalIndex + 1} / {allImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};