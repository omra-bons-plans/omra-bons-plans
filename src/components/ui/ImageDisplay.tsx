import { useState } from 'react';
import { Card } from './card';
import { getImageUrl } from '@/utils/imageUtils';
import UniversalImage from './UniversalImage';
import { SwipeableImageGallery } from './SwipeableImageGallery';

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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const openGallery = (index: number = 0) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Main Image */}
        <Card className="overflow-hidden cursor-pointer" onClick={() => openGallery(0)}>
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
                        openGallery(index);
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
                  openGallery(index + 1);
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

      {/* Swipeable Gallery Modal */}
      <SwipeableImageGallery
        images={images}
        coverImage={coverImage}
        title={title}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={selectedImageIndex}
      />
    </>
  );
};