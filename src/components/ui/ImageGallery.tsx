import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import { getImageUrl } from '@/utils/imageUtils';

interface ImageGalleryProps {
  images: string[];
  title: string;
  coverImage?: string | null;
}

const ImageGallery = ({ images, title, coverImage }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Combine cover image and gallery images, avoiding duplicates
  const allImages = coverImage 
    ? [coverImage, ...(images || []).filter(img => img !== coverImage)]
    : (images || []);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    console.log('🔄 Navigating:', direction, 'Current index:', selectedImageIndex, 'Total images:', allImages.length);
    
    if (direction === 'prev') {
      const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1;
      console.log('⬅️ Going to index:', newIndex);
      setSelectedImageIndex(newIndex);
    } else {
      const newIndex = selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0;
      console.log('➡️ Going to index:', newIndex);
      setSelectedImageIndex(newIndex);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      
      switch (event.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedImageIndex, allImages.length]);

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      {coverImage && (
        <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
          <ImageWithFallback
            src={getImageUrl(coverImage)}
            alt={title}
            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
            onClick={() => openLightbox(0)}
          />
        </div>
      )}

      {/* Gallery Images */}
      {images && images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images
              .filter(img => !coverImage || img !== coverImage) // Filter out cover image
              .map((image, filteredIndex) => {
                // Find the correct index in allImages
                const imageIndex = allImages.indexOf(image);
                return (
                  <div key={image} className="aspect-square rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={getImageUrl(image)}
                      alt={`${title} - Image ${filteredIndex + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => openLightbox(imageIndex)}
                    />
                  </div>
                );
              })
            }
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-screen-lg w-[95vw] h-[95vh] p-0 bg-black border-0 overflow-hidden" 
                       onPointerDownOutside={(e) => e.preventDefault()}>
          <div className="relative w-full h-full flex items-center justify-center group">
            {/* Current image */}
            {selectedImageIndex !== null && allImages[selectedImageIndex] && (
              <div className="w-full h-full flex items-center justify-center p-4">
                <ImageWithFallback
                  src={getImageUrl(allImages[selectedImageIndex])}
                  alt={`${title} - Image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            {/* Navigation buttons */}
            {allImages.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                <button
                  type="button"
                  className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (selectedImageIndex !== null) {
                      const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1;
                      setSelectedImageIndex(newIndex);
                    }
                  }}
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  type="button"
                  className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (selectedImageIndex !== null) {
                      const newIndex = selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0;
                      setSelectedImageIndex(newIndex);
                    }
                  }}
                  aria-label="Image suivante"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Image counter */}
            {allImages.length > 1 && selectedImageIndex !== null && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium pointer-events-none">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}

            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
              onClick={closeLightbox}
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;