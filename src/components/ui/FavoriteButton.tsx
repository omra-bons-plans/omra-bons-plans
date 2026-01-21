// ⚡ PERFORMANCE: Individual icon import to reduce bundle size
import Star from 'lucide-react/dist/esm/icons/star';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toggleFavorite, isFavorite } from '@/utils/favoritesHelper';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface FavoriteButtonProps {
  offerId: string;
  variant?: 'icon' | 'button';
  className?: string;
  showLabel?: boolean;
}

/**
 * Bouton favori réutilisable
 * - Toggle favoris avec feedback visuel
 * - Sync avec localStorage
 * - Variants: icon (petit) ou button (large)
 */
export const FavoriteButton = ({ 
  offerId, 
  variant = 'icon',
  className = '',
  showLabel = false
}: FavoriteButtonProps) => {
  const [isFav, setIsFav] = useState(false);
  
  // Init & listen to changes
  useEffect(() => {
    setIsFav(isFavorite(offerId));
    
    const handleUpdate = () => {
      setIsFav(isFavorite(offerId));
    };
    
    window.addEventListener('favorites-updated', handleUpdate);
    return () => window.removeEventListener('favorites-updated', handleUpdate);
  }, [offerId]);
  
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = toggleFavorite(offerId);
    setIsFav(newState);
    
    toast.success(
      newState ? '⭐ Ajouté aux favoris' : 'Retiré des favoris',
      { duration: 2000 }
    );
  };
  
  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "p-2 rounded-full transition-all duration-200 hover:scale-110 active:scale-95",
          isFav 
            ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30" 
            : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:bg-background hover:text-yellow-500",
          className
        )}
        aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Star 
          className={cn(
            "h-4 w-4 transition-all",
            isFav && "fill-yellow-500"
          )} 
        />
      </button>
    );
  }
  
  return (
    <Button
      variant={isFav ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      className={cn(
        "transition-all duration-200",
        isFav && "bg-yellow-500 hover:bg-yellow-600 text-white",
        className
      )}
    >
      <Star 
        className={cn(
          "h-4 w-4",
          showLabel && "mr-2",
          isFav && "fill-current"
        )} 
      />
      {showLabel && (isFav ? 'Favori' : 'Ajouter')}
    </Button>
  );
};
