import { Star, MapPin } from 'lucide-react';
import { Badge } from './badge';
import { Card } from './card';

interface AdMainInfoProps {
  title: string;
  location: string;
  category: string;
  rating: {
    average: number;
    count: number;
  };
  getCategoryIcon: () => React.ReactNode;
  getCategoryName: () => string;
}

export const AdMainInfo = ({ 
  title, 
  location, 
  category,
  rating,
  getCategoryIcon,
  getCategoryName 
}: AdMainInfoProps) => {
  return (
    <Card className="p-4 md:p-6 rounded-xl shadow-sm">
      <div className="space-y-3">
        {/* Category Badge */}
        <div className="flex items-center space-x-2">
          {getCategoryIcon()}
          <Badge variant="secondary" className="px-2 py-1 text-xs rounded-lg">
            {getCategoryName()}
          </Badge>
        </div>
        
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
          {title}
        </h1>

        {/* Rating & Reviews & Location */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm">
                {rating.average > 0 ? rating.average.toFixed(1) : 'Nouveau'}
              </span>
            </div>
            {rating.count > 0 && (
              <span className="text-muted-foreground text-xs">
                ({rating.count} avis)
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};