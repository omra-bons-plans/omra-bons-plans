import React, { useState } from 'react';
import { ImageComponent } from './ImageComponent';
import { SimpleImageViewer } from './SimpleImageViewer';

interface ImageGalleryDisplayProps {
  images: string[];
  coverImage?: string | null;
  title?: string;
  className?: string;
  bucketName?: string;
}

export const ImageGalleryDisplay = ({ 
  images, 
  coverImage, 
  title = 'Images',
  className = '',
  bucketName = 'ad-images'
}: ImageGalleryDisplayProps) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  // Combine cover image and additional images (keep as paths)
  const allImagePaths = coverImage 
    ? [coverImage, ...images.filter(img => img !== coverImage)]
    : images;

  const handleImageClick = (index: number) => {
    setInitialImageIndex(index);
    setIsGalleryOpen(true);
  };

  if (allImagePaths.length === 0) {
    return (
      <div className={`bg-muted rounded-lg p-8 ${className}`}>
        <p className="text-muted-foreground text-center">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Main Image */}
      <div className="mb-4">
        <ImageComponent
          src={allImagePaths[0]}
          alt={`${title} - Image principale`}
          className="w-full h-64 md:h-80 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => handleImageClick(0)}
          bucketName={bucketName}
        />
      </div>

      {/* Thumbnail Grid */}
      {allImagePaths.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {allImagePaths.slice(1, 5).map((imagePath, index) => (
            <div key={index} className="relative">
              <ImageComponent
                src={imagePath}
                alt={`${title} - Miniature ${index + 2}`}
                className="w-full h-20 object-cover rounded cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleImageClick(index + 1)}
                bucketName={bucketName}
              />
              {index === 3 && allImagePaths.length > 5 && (
                <div 
                  className="absolute inset-0 bg-black/60 rounded flex items-center justify-center text-white font-semibold cursor-pointer"
                  onClick={() => handleImageClick(4)}
                >
                  +{allImagePaths.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <SimpleImageViewer
        images={images}
        coverImage={coverImage}
        title={title}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={initialImageIndex}
        bucketName={bucketName}
      />
    </div>
  );
};