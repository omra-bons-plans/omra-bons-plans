import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// ⚡ PERFORMANCE: Individual icon imports to reduce bundle size
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Hotel from 'lucide-react/dist/esm/icons/hotel';
import Plane from 'lucide-react/dist/esm/icons/plane';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Star from 'lucide-react/dist/esm/icons/star';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import Check from 'lucide-react/dist/esm/icons/check';
import Info from 'lucide-react/dist/esm/icons/info';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { ReviewRequestDialog, useReviewRequest } from '@/components/ui/ReviewRequestDialog';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

// Zone descriptions for Hajj offers
const ZONE_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  'M': {
    title: 'Zone M (Mashair)',
    description: 'Hébergement dans des tentes climatisées à Mina (Mashair), à proximité immédiate des sites des rituels. Option très demandée pour son accessibilité.'
  },
  'C': {
    title: 'Zone C (Économique)',
    description: 'Hébergement plus éloigné du Haram et des sites des rituels, avec des tentes plus simples. Conçue pour un Hajj à coût raisonnable.'
  },
  'A': {
    title: 'Zone A (Premium)',
    description: 'Forfaits premium avec hébergements proches du Haram à La Mecque et tentes bien situées à Mina. Confort et proximité garantis.'
  }
};

// Camp Mina descriptions for Hajj offers - normalize all possible variations
const CAMP_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  'Majar Al Kabsh': {
    title: 'Majar Al Kabsh',
    description: 'Très proche du site de lapidation (Jamaraat) et de la gare du train. Les tentes sont généralement plus petites, offrant une intimité supérieure avec moins de personnes par tente. C\'est souvent un choix recommandé pour les personnes âgées en raison de la marche réduite.'
  },
  'Mouassim': {
    title: 'Al Mouaisem',
    description: 'Situé à environ 4 km des Jamaraat, impliquant une marche d\'au moins 45 minutes. Il est considéré comme faisant partie des services standards ou non spéciaux.'
  },
  'Al Mouaisem': {
    title: 'Al Mouaisem',
    description: 'Situé à environ 4 km des Jamaraat, impliquant une marche d\'au moins 45 minutes. Il est considéré comme faisant partie des services standards ou non spéciaux.'
  },
  'mouassim': {
    title: 'Al Mouaisem',
    description: 'Situé à environ 4 km des Jamaraat, impliquant une marche d\'au moins 45 minutes. Il est considéré comme faisant partie des services standards ou non spéciaux.'
  },
  'al mouaisem': {
    title: 'Al Mouaisem',
    description: 'Situé à environ 4 km des Jamaraat, impliquant une marche d\'au moins 45 minutes. Il est considéré comme faisant partie des services standards ou non spéciaux.'
  },
  'majar al kabsh': {
    title: 'Majar Al Kabsh',
    description: 'Très proche du site de lapidation (Jamaraat) et de la gare du train. Les tentes sont généralement plus petites, offrant une intimité supérieure avec moins de personnes par tente. C\'est souvent un choix recommandé pour les personnes âgées en raison de la marche réduite.'
  }
};

// Helper to get camp description with case-insensitive lookup
const getCampDescription = (campName: string) => {
  return CAMP_DESCRIPTIONS[campName] || CAMP_DESCRIPTIONS[campName.toLowerCase()] || {
    title: campName,
    description: 'Camp situé à Mina pour le Hajj'
  };
};

interface CompactOfferCardProps {
  offer: any;
  agencyLogo: string | null;
  agencyInfo: any;
}

export const CompactOfferCard = ({ offer, agencyLogo, agencyInfo }: CompactOfferCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zonePopupOpen, setZonePopupOpen] = useState(false);
  const [campPopupOpen, setCampPopupOpen] = useState(false);
  const { isDialogOpen, pendingOfferUrl, handleOfferClick, handleContinue, handleClose } = useReviewRequest();
  const isMobile = useIsMobile();

  const offerType = offer.is_hajj ? 'hajj' : 'omra';

  // Share offer link
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/offre-${offerType}/${offer.id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Offre ${offer.is_hajj ? 'Hajj' : 'Omra'} - ${offer.agency_name}`,
          text: `${offer.agency_name} - ${Number(offer.price_eur).toLocaleString('fr-FR')}€`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Lien copié !');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Lien copié !');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 border-border/30 bg-card">
      {/* Header compact */}
      <div 
        className="p-3 cursor-pointer active:bg-muted/30 transition-colors relative"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Bouton favoris en overlay */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton offerId={offer.id} variant="icon" />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Logo miniature */}
          {agencyLogo && (
            <div 
              className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm relative"
              style={{ aspectRatio: '1/1', minWidth: '64px', minHeight: '64px' }}
            >
              <img 
                src={agencyLogo} 
                alt={offer.agency_name}
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain p-1"
              />
              {offer.is_complet && (
                <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center">
                  <span className="text-white text-[8px] font-black">COMPLET</span>
                </div>
              )}
            </div>
          )}

          {/* Info principale */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-sm truncate">{offer.agency_name}</h3>
              {offer.is_recommended && (
                <Badge className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-md font-bold">
                  ⭐ Recommandé
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[10px] px-1.5 py-0",
                  offer.formula_type?.toLowerCase() === 'essentiel'
                    ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                    : 'bg-purple-500/10 text-purple-700 border-purple-500/30'
                )}
              >
                {offer.formula_type}
              </Badge>
              {agencyInfo && (
                <div className="flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-[10px] font-semibold">{agencyInfo.googleRating.toFixed(1)}</span>
                  <span className="text-[10px] text-muted-foreground">({agencyInfo.reviewCount})</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs font-medium text-foreground/80">
              <Calendar className="h-3.5 w-3.5" />
              <span className="truncate">{offer.month_departure}</span>
              <MapPin className="h-3.5 w-3.5" />
              <span>{offer.departure_city}</span>
            </div>
          </div>

          {/* Prix */}
          <div className="flex-shrink-0 text-right">
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold text-primary">
                {Number(offer.price_eur).toLocaleString('fr-FR')}€
              </span>
              <span className="text-[10px] text-muted-foreground">/ pers.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Détails expandables */}
      {isExpanded && (
        <div className="border-t border-primary/10 p-3 space-y-2 bg-muted/30 animate-fade-in">
          {/* Dates */}
          {offer.date_start && offer.date_end && (
            <div className="text-xs">
              <span className="font-semibold">Dates : </span>
              Du {new Date(offer.date_start).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} au {new Date(offer.date_end).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
            </div>
          )}

          {/* Nuits */}
          {offer.duration_nights && (
            <div className="text-xs">
              <span className="font-semibold">{offer.duration_nights} nuitées</span>
            </div>
          )}

          {/* Hôtels */}
          {offer.hotel_makkah && (
            <div className="flex items-start gap-1.5 text-xs">
              <Hotel className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">Mecque : </span>
                {offer.hotel_makkah}
                {offer.hotel_makkah_stars && (
                  <span className="text-yellow-500"> {'⭐'.repeat(offer.hotel_makkah_stars)}</span>
                )}
              </div>
            </div>
          )}

          {offer.hotel_medinah && (
            <div className="flex items-start gap-1.5 text-xs">
              <Hotel className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-semibold">Médine : </span>
                {offer.hotel_medinah}
                {offer.hotel_medina_stars && (
                  <span className="text-yellow-500"> {'⭐'.repeat(offer.hotel_medina_stars)}</span>
                )}
              </div>
            </div>
          )}

          {/* Badges services */}
          <div className="flex flex-wrap gap-1">
            {offer.flights_included && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
                <Plane className="h-2.5 w-2.5 mr-0.5" />
                Vol
              </Badge>
            )}
            {offer.visa_included && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-blue-500/10 text-blue-700 border-blue-500/30">
                <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                Visa
              </Badge>
            )}
            {offer.airline && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {offer.airline}
              </Badge>
            )}
            {/* Hajj-specific badges */}
            {offer.board && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-orange-500/10 text-orange-700 border-orange-500/30">
                🍽️ {offer.board}
              </Badge>
            )}
            {offer.accommodation_zone && (
              isMobile ? (
                // Mobile: clickable badge that opens a dialog
                <Badge 
                  variant="outline" 
                  className="text-[10px] px-1.5 py-0 bg-purple-500/10 text-purple-700 border-purple-500/30 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setZonePopupOpen(true); }}
                >
                  📍 Zone {offer.accommodation_zone}
                  <Info className="h-2.5 w-2.5 ml-0.5 inline" />
                </Badge>
              ) : (
                // Desktop: tooltip on hover
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className="text-[10px] px-1.5 py-0 bg-purple-500/10 text-purple-700 border-purple-500/30 cursor-help"
                    >
                      📍 Zone {offer.accommodation_zone}
                      <Info className="h-2.5 w-2.5 ml-0.5 inline" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[280px] p-3">
                    <p className="font-semibold text-sm mb-1">
                      {ZONE_DESCRIPTIONS[offer.accommodation_zone]?.title || `Zone ${offer.accommodation_zone}`}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {ZONE_DESCRIPTIONS[offer.accommodation_zone]?.description || 'Zone d\'hébergement pour le Hajj'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )
            )}
            {offer.camp_mina && (
              isMobile ? (
                // Mobile: clickable badge that opens a dialog
                <Badge 
                  variant="outline" 
                  className="text-[10px] px-1.5 py-0 bg-teal-500/10 text-teal-700 border-teal-500/30 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setCampPopupOpen(true); }}
                >
                  ⛺ {offer.camp_mina}
                  <Info className="h-2.5 w-2.5 ml-0.5 inline" />
                </Badge>
              ) : (
                // Desktop: tooltip on hover
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className="text-[10px] px-1.5 py-0 bg-teal-500/10 text-teal-700 border-teal-500/30 cursor-help"
                    >
                      ⛺ {offer.camp_mina}
                      <Info className="h-2.5 w-2.5 ml-0.5 inline" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[280px] p-3">
                    <p className="font-semibold text-sm mb-1">
                      {getCampDescription(offer.camp_mina).title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {getCampDescription(offer.camp_mina).description}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )
            )}
            {offer.nusuk_code && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-indigo-500/10 text-indigo-700 border-indigo-500/30">
                🔑 Nusuk: {offer.nusuk_code}
              </Badge>
            )}
          </div>

          {/* Boutons CTA */}
          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              <Button 
                asChild 
                size="sm"
                className="flex-1 h-8 text-xs"
                disabled={offer.is_complet}
              >
                <a 
                  href={offer.offer_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-1.5"
                  onClick={(e) => !offer.is_complet && handleOfferClick(e, offer.offer_url)}
                >
                  <span>{offer.is_complet ? 'Complet' : 'Voir l\'offre'}</span>
                  {!offer.is_complet && <ExternalLink className="h-3 w-3" />}
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="h-8 px-2"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
              </Button>
            </div>
            <Button 
              asChild 
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs"
            >
              <Link to="/agences-liste">
                Comparer agences
              </Link>
            </Button>
          </div>
        </div>
      )}
      
      {/* Zone Popup for Mobile */}
      <Dialog open={zonePopupOpen} onOpenChange={setZonePopupOpen}>
        <DialogContent className="max-w-[320px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              📍 {ZONE_DESCRIPTIONS[offer.accommodation_zone]?.title || `Zone ${offer.accommodation_zone}`}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {ZONE_DESCRIPTIONS[offer.accommodation_zone]?.description || 'Zone d\'hébergement pour le Hajj'}
          </p>
        </DialogContent>
      </Dialog>
      
      {/* Camp Mina Popup for Mobile */}
      <Dialog open={campPopupOpen} onOpenChange={setCampPopupOpen}>
        <DialogContent className="max-w-[320px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              ⛺ {getCampDescription(offer.camp_mina).title}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getCampDescription(offer.camp_mina).description}
          </p>
        </DialogContent>
      </Dialog>
      
      {/* Review Request Dialog */}
      <ReviewRequestDialog 
        isOpen={isDialogOpen}
        onClose={handleClose}
        onContinue={handleContinue}
        offerUrl={pendingOfferUrl || ''}
      />
    </Card>
  );
};
