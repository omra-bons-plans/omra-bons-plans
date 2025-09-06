import { Star } from 'lucide-react';
import { ReviewStats } from '@/hooks/useReviews';

interface RatingDisplayProps {
  stats: ReviewStats;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RatingDisplay = ({ 
  stats, 
  showCount = true, 
  size = 'md',
  className = '' 
}: RatingDisplayProps) => {
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (stats.totalReviews === 0) {
    return (
      <div className={`flex items-center space-x-1 text-muted-foreground ${className}`}>
        <Star className={`${iconSizes[size]} text-muted-foreground`} />
        <span className={textSizes[size]}>Aucun avis</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <Star className={`${iconSizes[size]} fill-yellow-400 text-yellow-400`} />
        <span className={`font-semibold ${textSizes[size]}`}>
          {stats.averageRating.toFixed(1)}
        </span>
      </div>
      {showCount && (
        <>
          <span className={`text-muted-foreground ${textSizes[size]}`}>•</span>
          <span className={`text-muted-foreground ${textSizes[size]}`}>
            ({stats.totalReviews} avis)
          </span>
        </>
      )}
    </div>
  );
};