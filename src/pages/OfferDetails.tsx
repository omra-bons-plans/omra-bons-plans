import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, lazy, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
// ⚡ PERFORMANCE: Individual icon imports
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Hotel from 'lucide-react/dist/esm/icons/hotel';
import Plane from 'lucide-react/dist/esm/icons/plane';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Star from 'lucide-react/dist/esm/icons/star';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Copy from 'lucide-react/dist/esm/icons/copy';
import Check from 'lucide-react/dist/esm/icons/check';
import Info from 'lucide-react/dist/esm/icons/info';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { ReviewRequestDialog, useReviewRequest } from '@/components/ui/ReviewRequestDialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getAgencyLogo } from '@/utils/comparateurConstants';

// ⚡ LAZY LOAD: SEO components
const DynamicSEO = lazy(() => import('@/components/SEO/DynamicSEO').then(m => ({ default: m.DynamicSEO })));
const SEOBreadcrumb = lazy(() => import('@/components/SEO/SEOBreadcrumb').then(m => ({ default: m.SEOBreadcrumb })));

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

export default function OfferDetails() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { isDialogOpen, pendingOfferUrl, handleOfferClick, handleContinue, handleClose } = useReviewRequest();

  const isHajj = type === 'hajj';
  const tableName = isHajj ? 'hajj_offers' : 'omra_offers';

  // Fetch offer details - using any type for unified format
  const { data: offerData, isLoading, error } = useQuery({
    queryKey: ['offer-details', type, id],
    queryFn: async () => {
      if (isHajj) {
        const { data, error } = await supabase
          .from('hajj_offers')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        
        // Map to unified format
        return {
          ...data,
          price_eur: data.price_quad_eur,
          month_departure: data.departure_date ? new Date(data.departure_date).toLocaleString('fr-FR', { month: 'long' }) : null,
          date_start: data.departure_date,
          date_end: data.return_date,
          departure_city: data.departure_cities?.[0] || 'Paris',
          formula_type: data.package_type || 'standard',
          hotel_medinah: data.hotel_medina,
          flights_included: true,
          visa_included: true,
          board: data.half_board ? 'Demi-pension' : 'Pension complète',
          is_hajj: true,
          is_complet: false,
          notes: null,
          makkah_nights: null,
          medina_nights: null,
        };
      } else {
        const { data, error } = await supabase
          .from('omra_offers')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return { ...data, is_hajj: false };
      }
    },
    enabled: !!id && !!type,
  });

  // Cast to any to avoid union type issues
  const offer = offerData as any;

  // Fetch agency info
  const { data: agencyInfo } = useQuery({
    queryKey: ['agency-info', offer?.agency_name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agencies')
        .select('name, google_rating, review_count, url, strengths, weaknesses, specialties, price_range, highlight')
        .eq('name', offer?.agency_name)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!offer?.agency_name,
  });

  const agencyLogo = offer?.agency_name ? getAgencyLogo(offer.agency_name) : null;

  // Copy share link
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/offre-${type}/${id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Offre ${isHajj ? 'Hajj' : 'Omra'} - ${offer?.agency_name}`,
          text: `${offer?.agency_name} - ${Number(offer?.price_eur).toLocaleString('fr-FR')}€`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Lien copié dans le presse-papier !');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Lien copié dans le presse-papier !');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (error || !offer) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="p-8 text-center max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Offre non trouvée</h2>
            <p className="text-muted-foreground mb-6">Cette offre n'existe plus ou a été supprimée.</p>
            <Button onClick={() => navigate(isHajj ? '/hajj' : '/omra')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux offres {isHajj ? 'Hajj' : 'Omra'}
            </Button>
          </Card>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background">
        <Suspense fallback={null}>
          <DynamicSEO
            title={`${offer.agency_name} - Offre ${isHajj ? 'Hajj' : 'Omra'} ${Number(offer.price_eur).toLocaleString('fr-FR')}€`}
            description={`Offre ${isHajj ? 'Hajj' : 'Omra'} par ${offer.agency_name} au départ de ${offer.departure_city} - ${offer.duration_nights} nuits - ${Number(offer.price_eur).toLocaleString('fr-FR')}€`}
            keywords={[isHajj ? 'hajj' : 'omra', offer.agency_name, offer.departure_city, 'voyage']}
            path={`/offre-${type}/${id}`}
          />
          <SEOBreadcrumb
            items={[
              { name: 'Accueil', url: '/' },
              { name: isHajj ? 'Hajj' : 'Omra', url: isHajj ? '/hajj' : '/omra' },
              { name: offer.agency_name, url: `/offre-${type}/${id}` }
            ]}
          />
        </Suspense>

        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Back button */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(isHajj ? '/hajj' : '/omra')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux offres
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShare}
              className="gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied ? 'Copié !' : 'Partager'}
            </Button>
          </div>

          {/* Main offer card */}
          <Card className="overflow-hidden border-2 border-primary/10 shadow-xl">
            {/* Header with agency info */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
              <div className="flex items-start gap-4">
                {/* Agency logo */}
                {agencyLogo && (
                  <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-white shadow-md">
                    <img 
                      src={agencyLogo} 
                      alt={offer.agency_name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h1 className="text-2xl font-bold">{offer.agency_name}</h1>
                    {offer.is_recommended && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-md font-bold">
                        ⭐ Recommandé
                      </Badge>
                    )}
                    {offer.is_complet && (
                      <Badge variant="destructive">COMPLET</Badge>
                    )}
                  </div>

                  {agencyInfo && (
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{agencyInfo.google_rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({agencyInfo.review_count} avis)</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {offer.month_departure}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {offer.departure_city}
                    </span>
                    {offer.duration_nights && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {offer.duration_nights} nuits
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & Favorite */}
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {Number(offer.price_eur).toLocaleString('fr-FR')}€
                    </div>
                    <span className="text-sm text-muted-foreground">/ personne</span>
                  </div>
                  <FavoriteButton offerId={offer.id} variant="icon" />
                </div>
              </div>
            </div>

            {/* Dates */}
            {offer.date_start && offer.date_end && (
              <div className="px-6 py-4 border-t bg-muted/30">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Dates :</span>
                  <span>
                    Du {new Date(offer.date_start).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} 
                    {' '}au {new Date(offer.date_end).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            )}

            {/* Hotels */}
            <div className="px-6 py-4 border-t space-y-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Hotel className="h-5 w-5 text-primary" />
                Hébergement
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {offer.hotel_makkah && (
                  <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50">
                    <div className="font-semibold text-amber-800 dark:text-amber-300 mb-1">La Mecque</div>
                    <div className="font-medium">{offer.hotel_makkah}</div>
                    {offer.hotel_makkah_stars && (
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(offer.hotel_makkah_stars)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                    {offer.makkah_nights && (
                      <div className="text-sm text-muted-foreground mt-1">{offer.makkah_nights} nuits</div>
                    )}
                  </Card>
                )}

                {offer.hotel_medinah && (
                  <Card className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200/50">
                    <div className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Médine</div>
                    <div className="font-medium">{offer.hotel_medinah}</div>
                    {offer.hotel_medina_stars && (
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(offer.hotel_medina_stars)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                    {offer.medina_nights && (
                      <div className="text-sm text-muted-foreground mt-1">{offer.medina_nights} nuits</div>
                    )}
                  </Card>
                )}
              </div>
            </div>

            {/* Services & badges */}
            <div className="px-6 py-4 border-t">
              <h3 className="font-bold text-lg mb-3">Services inclus</h3>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "px-3 py-1",
                    offer.formula_type?.toLowerCase() === 'essentiel'
                      ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                      : 'bg-purple-500/10 text-purple-700 border-purple-500/30'
                  )}
                >
                  {offer.formula_type}
                </Badge>

                {offer.flights_included && (
                  <Badge variant="outline" className="px-3 py-1 bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
                    <Plane className="h-3.5 w-3.5 mr-1" />
                    Vol inclus
                  </Badge>
                )}
                
                {offer.visa_included && (
                  <Badge variant="outline" className="px-3 py-1 bg-blue-500/10 text-blue-700 border-blue-500/30">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Visa inclus
                  </Badge>
                )}

                {offer.airline && (
                  <Badge variant="outline" className="px-3 py-1">
                    <Plane className="h-3.5 w-3.5 mr-1" />
                    {offer.airline}
                  </Badge>
                )}

                {offer.board && (
                  <Badge variant="outline" className="px-3 py-1 bg-orange-500/10 text-orange-700 border-orange-500/30">
                    🍽️ {offer.board}
                  </Badge>
                )}

                {/* Hajj-specific badges */}
                {offer.accommodation_zone && (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className="px-3 py-1 bg-purple-500/10 text-purple-700 border-purple-500/30 cursor-help"
                      >
                        📍 Zone {offer.accommodation_zone}
                        <Info className="h-3 w-3 ml-1 inline" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[320px] p-4">
                      <p className="font-semibold text-sm mb-1">
                        {ZONE_DESCRIPTIONS[offer.accommodation_zone]?.title || `Zone ${offer.accommodation_zone}`}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {ZONE_DESCRIPTIONS[offer.accommodation_zone]?.description || 'Zone d\'hébergement pour le Hajj'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {offer.camp_mina && (
                  <Badge variant="outline" className="px-3 py-1 bg-teal-500/10 text-teal-700 border-teal-500/30">
                    ⛺ {offer.camp_mina}
                  </Badge>
                )}

                {offer.nusuk_code && (
                  <Badge variant="outline" className="px-3 py-1 bg-indigo-500/10 text-indigo-700 border-indigo-500/30">
                    🔑 Nusuk: {offer.nusuk_code}
                  </Badge>
                )}
              </div>
            </div>

            {/* Notes */}
            {offer.notes && (
              <div className="px-6 py-4 border-t">
                <h3 className="font-bold text-lg mb-2">Informations supplémentaires</h3>
                <p className="text-muted-foreground">{offer.notes}</p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="px-6 py-6 border-t bg-gradient-to-r from-primary/5 to-transparent space-y-3">
              <Button 
                asChild 
                size="lg"
                className="w-full"
                disabled={offer.is_complet}
              >
                <a 
                  href={offer.offer_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2"
                  onClick={(e) => !offer.is_complet && handleOfferClick(e, offer.offer_url)}
                >
                  <span>{offer.is_complet ? 'Cette offre est complète' : 'Voir l\'offre sur le site de l\'agence'}</span>
                  {!offer.is_complet && <ExternalLink className="h-4 w-4" />}
                </a>
              </Button>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleShare}
                >
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? 'Lien copié !' : 'Copier le lien'}
                </Button>
                
                <Button 
                  variant="outline" 
                  asChild
                  className="flex-1"
                >
                  <Link to="/agences-liste">
                    Comparer les agences
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Back to list */}
          <div className="mt-8 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(isHajj ? '/hajj' : '/omra')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voir toutes les offres {isHajj ? 'Hajj' : 'Omra'}
            </Button>
          </div>
        </div>
      </div>

      <ReviewRequestDialog 
        isOpen={isDialogOpen}
        onClose={handleClose}
        onContinue={handleContinue}
        offerUrl={pendingOfferUrl || ''}
      />
    </ResponsiveLayout>
  );
}
