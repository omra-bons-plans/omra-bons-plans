import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUtils';

interface SimpleImageViewerProps {
  images: string[];
  coverImage?: string | null;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const SimpleImageViewer = ({ 
  images, 
  coverImage, 
  title = 'Images',
  isOpen,
  onClose,
  initialIndex = 0
}: SimpleImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Combine cover image and additional images
  const allImagePaths = coverImage 
    ? [coverImage, ...images.filter(img => img !== coverImage)]
    : images;
  
  const allImages = allImagePaths.map(path => getImageUrl(path));

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (!isOpen || allImages.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black"
      style={{
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[10000] text-white p-2 bg-black/50 rounded-full hover:bg-black/70"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 z-[10000] bg-black/50 text-white px-3 py-1 rounded">
        {currentIndex + 1} / {allImages.length}
      </div>

      {/* Swipe Area - SIMPLIFIÉ */}
      <div 
        className="absolute inset-0 flex items-center justify-center p-4"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          e.currentTarget.dataset.startX = touch.clientX.toString();
        }}
        onTouchEnd={(e) => {
          const startX = parseFloat(e.currentTarget.dataset.startX || '0');
          const endX = e.changedTouches[0].clientX;
          const deltaX = startX - endX;
          
          // Seuil très bas pour la sensibilité
          if (Math.abs(deltaX) > 30) {
            if (deltaX > 0) {
              nextImage(); // Swipe gauche = image suivante
            } else {
              prevImage(); // Swipe droite = image précédente
            }
          }
        }}
        style={{ touchAction: 'pan-y' }}
      >
        <img
          src={allImages[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain pointer-events-none select-none"
          draggable={false}
        />
      </div>

      {/* Navigation Buttons */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 bg-black/50 rounded-full hover:bg-black/70 z-[10000]"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 bg-black/50 rounded-full hover:bg-black/70 z-[10000]"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Pagination dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[10000]">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};