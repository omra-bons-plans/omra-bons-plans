import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedCardProps {
  imageSrc?: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Card optimisée pour mobile avec lazy loading intelligent des images
 * - Images AVIF uniquement sur mobile
 * - Dimensions fixes pour éviter CLS
 * - Intersection Observer pour lazy load
 */
export const MobileOptimizedCard = ({ 
  imageSrc, 
  alt, 
  children, 
  className = '' 
}: MobileOptimizedCardProps) => {
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className={className}>
      {imageSrc && (
        <div 
          style={{ 
            aspectRatio: '16/9', 
            width: '100%',
            minHeight: isMobile ? '200px' : '240px',
            backgroundColor: '#f5f5f0',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={imageSrc}
            alt={alt}
            width={isMobile ? 360 : 480}
            height={isMobile ? 220 : 300}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>
      )}
      {children}
    </Card>
  );
};
