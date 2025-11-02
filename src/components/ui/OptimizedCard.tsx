import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UniversalImage } from '@/components/ui/UniversalImage';
import { Clock, MapPin, Users } from 'lucide-react';

interface OptimizedCardProps {
  image: string | null;
  title: string;
  price: string;
  location?: string;
  duration?: string;
  capacity?: string;
  badges?: Array<{ label: string; variant?: 'default' | 'secondary' | 'destructive' | 'outline' }>;
  onClick?: () => void;
  className?: string;
}

/**
 * Carte optimisée avec dimensions fixes pour éviter le CLS
 * Toutes les images ont des dimensions explicites et aspect-ratio réservé
 */
export const OptimizedCard: React.FC<OptimizedCardProps> = ({
  image,
  title,
  price,
  location,
  duration,
  capacity,
  badges = [],
  onClick,
  className = ''
}) => {
  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Image container avec aspect-ratio fixe pour éviter CLS */}
      <div 
        className="relative overflow-hidden bg-muted"
        style={{ 
          aspectRatio: '16/9',
          minHeight: '200px'
        }}
      >
        <UniversalImage
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          optimize={{ width: 640, height: 360, quality: 80 }}
          responsive={true}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Badges overlay */}
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {badges.map((badge, idx) => (
              <Badge key={idx} variant={badge.variant || 'default'}>
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-lg line-clamp-2 min-h-[56px]">
          {title}
        </h3>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-muted-foreground">
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
          
          {duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{duration}</span>
            </div>
          )}
          
          {capacity && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>{capacity}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-border">
          <p className="text-2xl font-bold text-primary">
            {price}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedCard;
