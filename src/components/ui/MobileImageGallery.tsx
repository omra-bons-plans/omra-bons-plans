import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { getImageUrl } from '@/utils/imageUtils';
import { ImageComponent } from './ImageComponent';

interface MobileImageGalleryProps {
  images: string[];
  coverImage?: string | null;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const MobileImageGallery = ({ 
  images, 
  coverImage, 
  title = 'Images',
  isOpen,
  onClose,
  initialIndex = 0
}: MobileImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);

  // Combine cover image and additional images
  const allImagePaths = coverImage 
    ? [coverImage, ...images.filter(img => img !== coverImage)]
    : images;
  
  const allImages = allImagePaths.map(path => getImageUrl(path));

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = false;
    console.log('🟢 TOUCH START:', touchStartX.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    isDragging.current = true;
    console.log('🔄 TOUCH MOVE:', touchEndX.current);
  };

  const handleTouchEnd = () => {
    console.log('🔴 TOUCH END - Start:', touchStartX.current, 'End:', touchEndX.current, 'Dragging:', isDragging.current);
    
    if (!isDragging.current) return;
    
    const deltaX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 30; // Réduit de 50 à 30
    
    console.log('📏 Delta X:', deltaX, 'Min distance:', minSwipeDistance);
    
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        console.log('➡️ SWIPE LEFT -> NEXT');
        nextImage();
      } else {
        console.log('⬅️ SWIPE RIGHT -> PREV');
        prevImage();
      }
    } else {
      console.log('❌ Swipe distance insufficient');
    }
  };

  if (!isOpen || allImages.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        touchAction: 'pan-y', 
        WebkitUserSelect: 'none',
        userSelect: 'none'
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
      <ImageComponent
        src={allImages[currentIndex]}
        alt={`${title} - Image ${currentIndex + 1}`}
        className="max-w-[95vw] max-h-[90vh] object-contain select-none"
      />

      {/* Navigation Buttons */}
      {allImages.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-[10000]"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-[10000]"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          {/* Pagination dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[10000]">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
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