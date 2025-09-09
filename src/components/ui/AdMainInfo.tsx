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
    <Card className="p-6 rounded-2xl shadow-sm">
      <div className="space-y-4">
        {/* Category Badge */}
        <div className="flex items-center space-x-3">
          {getCategoryIcon()}
          <Badge variant="secondary" className="px-3 py-1.5 text-sm rounded-full">
            {getCategoryName()}
          </Badge>
        </div>
        
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {title}
        </h1>

        {/* Rating & Reviews */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-foreground">
              {rating.average > 0 ? rating.average.toFixed(1) : 'Nouveau'}
            </span>
          </div>
          {rating.count > 0 && (
            <span className="text-muted-foreground text-sm">
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
    </Card>
  );
};