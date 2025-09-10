import { Star } from 'lucide-react';
import { ReviewStats } from '@/hooks/useReviews';
import { useEffect } from 'react';

interface RatingDisplayProps {
  stats: ReviewStats;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  businessName?: string; // Pour les Rich Snippets
  businessType?: string; // Type d'entreprise (ex: "TravelAgency")
}

export const RatingDisplay = ({ 
  stats, 
  showCount = true, 
  size = 'md',
  className = '',
  businessName,
  businessType = 'TravelAgency'
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

  // Générer les données structurées pour les Rich Snippets
  useEffect(() => {
    if (stats.totalReviews > 0 && businessName) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": businessType,
        "name": businessName,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": stats.averageRating.toFixed(1),
          "reviewCount": stats.totalReviews,
          "bestRating": "5",
          "worstRating": "1"
        }
      };

      let scriptTag = document.querySelector(`script[data-rating-ld="${businessName}"]`) as HTMLScriptElement;
      
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        scriptTag.setAttribute('data-rating-ld', businessName);
        document.head.appendChild(scriptTag);
      }
      
      scriptTag.textContent = JSON.stringify(structuredData);

      return () => {
        const existingScript = document.querySelector(`script[data-rating-ld="${businessName}"]`);
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, [stats, businessName, businessType]);

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