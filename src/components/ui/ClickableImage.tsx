import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ImageWithFallback from './ImageWithFallback';

interface ClickableImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const ClickableImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc 
}: ClickableImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
      <DialogContent className="max-w-4xl p-0 bg-black/90">
        <div className="flex items-center justify-center p-4 min-h-[60vh]">
          <ImageWithFallback 
            src={src}
            alt={alt}
            className="max-w-full max-h-[80vh] object-contain"
            fallbackSrc={fallbackSrc}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClickableImage;