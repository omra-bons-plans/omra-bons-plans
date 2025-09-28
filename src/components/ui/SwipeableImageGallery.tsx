import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './dialog';
import { Button } from './button';
import { getImageUrl } from '@/utils/imageUtils';
import UniversalImage from './UniversalImage';

interface SwipeableImageGalleryProps {
  images: string[];
  coverImage?: string | null;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const SwipeableImageGallery = ({ 
  images, 
  coverImage, 
  title = 'Images',
  isOpen,
  onClose,
  initialIndex = 0
}: SwipeableImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const touchStartX = useRef<number>(0);
  const touchMoved = useRef<boolean>(false);

  // Combine cover image and additional images
  const allImagePaths = coverImage 
    ? [coverImage, ...images.filter(img => img !== coverImage)]
    : images;
  
  const allImages = allImagePaths.map(path => getImageUrl(path));

  useEffect(() => {
    setCurrentImageIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchMoved.current = false;
    console.log('🟢 Touch Start:', touchStartX.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    touchMoved.current = true;
    console.log('🔄 Touch Move:', e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchMoved.current || allImages.length <= 1) {
      console.log('❌ Pas de mouvement ou une seule image');
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;
    const threshold = 20; // Très sensible
    
    console.log('🔴 Touch End - Start:', touchStartX.current, 'End:', touchEndX, 'Delta:', deltaX);
    
    if (Math.abs(deltaX) > threshold) {
      e.preventDefault();
      e.stopPropagation();
      
      if (deltaX > 0) {
        console.log('➡️ Swipe Left - Next Image');
        nextImage();
      } else {
        console.log('⬅️ Swipe Right - Previous Image');
        prevImage();
      }
    } else {
      console.log('❌ Mouvement trop court:', Math.abs(deltaX), 'vs', threshold);
    }

    touchStartX.current = 0;
    touchMoved.current = false;
  };

  if (allImages.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 bg-black border-0">
        <DialogTitle className="sr-only">
          {title} - Image {currentImageIndex + 1} sur {allImages.length}
        </DialogTitle>
        
        <div 
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ 
            touchAction: 'pan-y',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-50 bg-black/70 text-white px-3 py-1 rounded">
            {currentImageIndex + 1} / {allImages.length}
          </div>

          {/* Main Image */}
          <UniversalImage
            src={allImages[currentImageIndex]}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="max-w-[95vw] max-h-[90vh] object-contain pointer-events-none"
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-40"
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-40"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>

              {/* Pagination dots */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
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
  );
};