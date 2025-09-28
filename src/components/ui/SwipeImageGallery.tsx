import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { getImageUrl } from '@/utils/imageUtils';
import { ImageComponent } from './ImageComponent';

interface SwipeImageGalleryProps {
  images: string[];
  coverImage?: string | null;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const SwipeImageGallery = ({ 
  images, 
  coverImage, 
  title = 'Images',
  isOpen,
  onClose,
  initialIndex = 0
}: SwipeImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [startX, setStartX] = useState<number | null>(null);

  // Combine cover image and additional images
  const allImagePaths = coverImage 
    ? [coverImage, ...images.filter(img => img !== coverImage)]
    : images;
  
  const allImages = allImagePaths.map(path => getImageUrl(path));

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const nextImage = useCallback(() => {
    console.log('Moving to next image');
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    console.log('Moving to previous image');
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const handleStart = useCallback((clientX: number) => {
    console.log('Touch/Mouse start at:', clientX);
    setStartX(clientX);
  }, []);

  const handleEnd = useCallback((clientX: number) => {
    console.log('Touch/Mouse end at:', clientX, 'Start was:', startX);
    
    if (startX === null) return;
    
    const diff = startX - clientX;
    const threshold = 50;
    
    console.log('Difference:', diff, 'Threshold:', threshold);
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        console.log('Swiped left - going to next');
        nextImage();
      } else {
        console.log('Swiped right - going to previous');
        prevImage();
      }
    }
    
    setStartX(null);
  }, [startX, nextImage, prevImage]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    handleEnd(e.changedTouches[0].clientX);
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    handleEnd(e.clientX);
  };

  if (!isOpen || allImages.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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
        className="absolute top-4 right-4 z-[10000] text-white hover:bg-white/20"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 z-[10000] bg-black/70 text-white px-3 py-1 rounded">
        {currentIndex + 1} / {allImages.length}
      </div>

      {/* Main Image */}
      <div className="flex items-center justify-center w-full h-full p-4">
        <ImageComponent
          src={allImages[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none pointer-events-none"
        />
      </div>

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
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-[10000]"
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
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-[10000]"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          {/* Pagination dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[10000]">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Dot clicked, going to index:', index);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};