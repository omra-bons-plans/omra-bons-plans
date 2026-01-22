import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Euro from 'lucide-react/dist/esm/icons/euro';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Star from 'lucide-react/dist/esm/icons/star';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { UniversalImage } from '@/components/ui/UniversalImage';

interface CompactAdCardProps {
  ad: any;
  onClick?: () => void;
}

export const CompactAdCard = ({ ad, onClick }: CompactAdCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryLabels: Record<string, string> = {
    sejour: 'Séjour',
    hebergement: 'Hébergement',
    chauffeur: 'Chauffeur',
    guide: 'Guide',
    'baby-sitting': 'Baby-sitting',
    vol: 'Vol'
  };

  const categoryColors: Record<string, string> = {
    sejour: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
    hebergement: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
    chauffeur: 'bg-green-500/10 text-green-700 border-green-500/30',
    guide: 'bg-orange-500/10 text-orange-700 border-orange-500/30',
    'baby-sitting': 'bg-pink-500/10 text-pink-700 border-pink-500/30',
    vol: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30'
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 border-border/30 bg-card">
      {/* Header compact */}
      <div 
        className="p-3 cursor-pointer active:bg-muted/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {/* Image miniature */}
          {ad.images?.[0] && (
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted shadow-sm">
              <UniversalImage
                src={ad.images[0]}
                alt={ad.title || 'Annonce'}
                className="w-full h-full object-cover"
                loading="lazy"
                optimize={{ width: 64, height: 64, quality: 75 }}
              />
            </div>
          )}

          {/* Info principale */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-sm truncate">{ad.title}</h3>
              {ad.is_urgent && (
                <Badge className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-md font-bold animate-pulse">
                  🔥 URGENT
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-0.5">
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[10px] px-1.5 py-0",
                  categoryColors[ad.category] || 'bg-gray-500/10 text-gray-700 border-gray-500/30'
                )}
              >
                {categoryLabels[ad.category] || ad.category}
              </Badge>
              {ad.rating && (
                <div className="flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] font-semibold">{ad.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 text-xs text-foreground/80">
              {ad.location && (
                <>
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{ad.location}</span>
                </>
              )}
            </div>
          </div>

          {/* Prix */}
          <div className="flex-shrink-0 text-right">
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold text-primary">
                {ad.price ? `${ad.price}€` : 'Sur devis'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Détails expandables */}
      {isExpanded && (
        <div className="border-t border-primary/10 p-3 space-y-2 bg-muted/30 animate-fade-in">
          {ad.subtitle && (
            <p className="text-xs text-muted-foreground">{ad.subtitle}</p>
          )}

          {ad.dates && (
            <div className="flex items-start gap-1.5 text-xs">
              <Calendar className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
              <span>{ad.dates}</span>
            </div>
          )}

          {ad.description && (
            <p className="text-xs line-clamp-3">{ad.description}</p>
          )}

          {/* Boutons CTA */}
          <div className="flex gap-2">
            <Button 
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              <Eye className="h-3 w-3 mr-1" />
              Voir les détails
            </Button>
            {ad.phone && (
              <Button 
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <a href={`tel:${ad.phone}`}>
                  <Phone className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
