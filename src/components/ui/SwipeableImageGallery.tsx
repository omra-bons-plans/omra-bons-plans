import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
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

  // Combine cover image and additional images
  const allImagePaths = coverImage 
    ? [coverImage, ...images.filter(img => img !== coverImage)]
    : images;
  
  const allImages = allImagePaths.map(path => getImageUrl(path));

  useEffect(() => {
    setCurrentImageIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const nextImage = () => {
    console.log('➡️ Next image');
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    console.log('⬅️ Previous image');
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (!isOpen || allImages.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{ touchAction: 'manipulation' }}
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
        {currentImageIndex + 1} / {allImages.length}
      </div>

      {/* Swipe Area - Full Screen */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          console.log('🟢 TOUCH START:', touch.clientX);
          e.currentTarget.dataset.startX = touch.clientX.toString();
          e.currentTarget.dataset.moved = 'false';
        }}
        onTouchMove={(e) => {
          console.log('🔄 TOUCH MOVE:', e.touches[0].clientX);
          e.currentTarget.dataset.moved = 'true';
        }}
        onTouchEnd={(e) => {
          const startX = parseFloat(e.currentTarget.dataset.startX || '0');
          const endX = e.changedTouches[0].clientX;
          const moved = e.currentTarget.dataset.moved === 'true';
          const deltaX = startX - endX;
          
          console.log('🔴 TOUCH END - Start:', startX, 'End:', endX, 'Delta:', deltaX, 'Moved:', moved);
          
          if (moved && Math.abs(deltaX) > 30 && allImages.length > 1) {
            e.preventDefault();
            e.stopPropagation();
            
            if (deltaX > 0) {
              console.log('➡️ SWIPE LEFT -> NEXT');
              nextImage();
            } else {
              console.log('⬅️ SWIPE RIGHT -> PREV');
              prevImage();
            }
          }
          
          // Reset
          e.currentTarget.dataset.startX = '0';
          e.currentTarget.dataset.moved = 'false';
        }}
      >
        {/* Main Image */}
        <UniversalImage
          src={allImages[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className="max-w-[95vw] max-h-[90vh] object-contain select-none"
          optimize={{ width: 1200, height: 1200, quality: 90 }}
        />
      </div>

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
                onClick={() => {
                  console.log('🔘 Dot clicked:', index);
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
  );
};