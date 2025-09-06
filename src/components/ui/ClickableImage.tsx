import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

interface ClickableImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  // Props pour gérer plusieurs images
  images?: string[];
  initialIndex?: number;
}

const ClickableImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc,
  images,
  initialIndex = 0
}: ClickableImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // Use either the images array or single src
  const imagesList = images || [src];
  const hasMultipleImages = imagesList.length > 1;

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : imagesList.length - 1);
    } else {
      setCurrentIndex(currentIndex < imagesList.length - 1 ? currentIndex + 1 : 0);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentIndex(initialIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          if (hasMultipleImages) navigateImage('prev');
          break;
        case 'ArrowRight':
          if (hasMultipleImages) navigateImage('next');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, hasMultipleImages]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer hover:opacity-80 transition-opacity">
          <ImageWithFallback 
            src={src}
            alt={alt}
            className={className}
            fallbackSrc={fallbackSrc}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black/95">
        <DialogTitle className="sr-only">Aperçu de l'image</DialogTitle>
        <DialogDescription className="sr-only">
          {hasMultipleImages ? `Image ${currentIndex + 1} sur ${imagesList.length}` : 'Image en grand format'}
        </DialogDescription>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={closeModal}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation buttons */}
          {hasMultipleImages && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                onClick={() => navigateImage('prev')}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-16 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                onClick={() => navigateImage('next')}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Current image */}
          <div className="w-full h-full p-8 flex items-center justify-center">
            <ImageWithFallback
              src={imagesList[currentIndex]}
              alt={`${alt} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              fallbackSrc={fallbackSrc}
            />
          </div>

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {imagesList.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClickableImage;