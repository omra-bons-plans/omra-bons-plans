import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { CompactOfferCard } from '@/components/mobile/CompactOfferCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Star from 'lucide-react/dist/esm/icons/star';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import { toast } from 'sonner';
import { getAgencyInfo } from '@/utils/agenciesData';
import { InternalLinks } from '@/components/SEO/InternalLinks';
import { Helmet } from "react-helmet-async";

const AGENCY_LOGOS: Record<string, string> = {
  'Medinvoyages': '/lovable-uploads/logomedinvoyages.webp',
  'Almaqam': '/lovable-uploads/logoalmaqam.webp',
  'Pelerinhajj': '/lovable-uploads/logopelerinhajj.webp',
  'Hayat': '/lovable-uploads/logohayat.webp',
  'Omra Sounnah': '/lovable-uploads/logoomrasounnah.webp',
  'Omra Discount': '/lovable-uploads/logoomradiscount.webp',
  'Sabil Voyages': '/lovable-uploads/logosabile.webp',
  'Tawaf': '/lovable-uploads/logotawaf.webp',
  'Gateway travel': '/lovable-uploads/logogatewaytravel.webp',
};

const getAgencyLogo = (agencyName: string): string | null => {
  const normalizedName = agencyName?.trim().toLowerCase();
  
  for (const [key, logo] of Object.entries(AGENCY_LOGOS)) {
    const normalizedKey = key.toLowerCase();
    if (normalizedName?.includes(normalizedKey) || normalizedKey.includes(normalizedName)) {
      return logo;
    }
  }
  return null;
};

export default function Favoris() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  
  // Charger les IDs des favoris depuis localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('omra_favorites') || '[]');
    setFavoriteIds(favorites);
  }, []);
  
  // Fetch les offres favorites depuis la DB (Omra + Hajj)
  const { data: offers, isLoading, refetch } = useQuery({
    queryKey: ['favorite-offers', favoriteIds],
    queryFn: async () => {
      if (favoriteIds.length === 0) return [];
      
      // Récupérer les offres Omra
      const { data: omraData, error: omraError } = await supabase
        .from('omra_offers')
        .select('*')
        .in('id', favoriteIds)
        .eq('status', 'active');
      
      if (omraError) throw omraError;
      
      // Récupérer les offres Hajj
      const { data: hajjData, error: hajjError } = await supabase
        .from('hajj_offers')
        .select('*')
        .in('id', favoriteIds)
        .eq('status', 'active');
      
      if (hajjError) throw hajjError;
      
      // Normaliser les offres Hajj pour correspondre au format Omra
      const normalizedHajjOffers = (hajjData || []).map(offer => ({
        ...offer,
        offer_type: 'hajj' as const,
        offer_title: `Hajj ${offer.package_type} - ${offer.accommodation_zone}`,
        departure_city: offer.departure_cities?.[0] || 'Paris',
        price_eur: offer.price_quad_eur,
        hotel_makkah: offer.hotel_makkah,
        hotel_medinah: offer.hotel_medina,
        hotel_makkah_stars: offer.hotel_makkah_stars,
        hotel_medina_stars: offer.hotel_medina_stars,
        date_start: offer.departure_date,
        date_end: offer.return_date,
        flights_included: true,
        formula_type: offer.package_type,
      }));
      
      // Marquer les offres Omra
      const normalizedOmraOffers = (omraData || []).map(offer => ({
        ...offer,
        offer_type: 'omra' as const,
      }));
      
      // Combiner et trier par date de création
      return [...normalizedOmraOffers, ...normalizedHajjOffers].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: favoriteIds.length > 0
  });
  
  const removeFavorite = (offerId: string) => {
    const newFavorites = favoriteIds.filter(id => id !== offerId);
    setFavoriteIds(newFavorites);
    localStorage.setItem('omra_favorites', JSON.stringify(newFavorites));
    
    // Dispatch event pour mettre à jour le compteur
    window.dispatchEvent(new Event('favorites-updated'));
    
    toast.success('Offre retirée des favoris');
    refetch();
  };
  
  const clearAllFavorites = () => {
    setFavoriteIds([]);
    localStorage.setItem('omra_favorites', JSON.stringify([]));
    window.dispatchEvent(new Event('favorites-updated'));
    toast.success('Tous les favoris ont été supprimés');
  };
  
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Mes Favoris - Offres Omra Sauvegardées | Omra Bons Plans</title>
        <meta name="description" content="Retrouvez toutes vos offres Omra favorites sauvegardées. Comparez facilement vos séjours, vols et hébergements préférés pour votre pèlerinage." />
        <meta name="keywords" content="favoris omra, offres sauvegardées, comparaison omra, mes offres" />
        <link rel="canonical" href="https://omrabonsplans.fr/favoris" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Mes Favoris - Offres Omra Sauvegardées" />
        <meta property="og:description" content="Retrouvez toutes vos offres Omra favorites pour les comparer facilement." />
        <meta property="og:url" content="https://omrabonsplans.fr/favoris" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-background pt-16 md:pt-24 pb-24 md:pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                <Star className="inline-block h-6 w-6 md:h-8 md:w-8 text-yellow-500 fill-yellow-500 mr-2" />
                Mes Favoris
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                {favoriteIds.length} offre{favoriteIds.length > 1 ? 's' : ''} sauvegardée{favoriteIds.length > 1 ? 's' : ''}
              </p>
            </div>
            
            {favoriteIds.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFavorites}
                className="text-xs md:text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Tout effacer
              </Button>
            )}
          </div>
          
          {/* Empty State */}
          {favoriteIds.length === 0 && (
            <Card className="p-8 md:p-12 text-center">
              <Star className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aucun favori</h2>
              <p className="text-muted-foreground mb-6">
                Ajoutez des offres à vos favoris pour les retrouver facilement et les comparer.
              </p>
              <Button asChild>
                <a href="/comparateur-omra">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Découvrir les offres
                </a>
              </Button>
            </Card>
          )}
          
          {/* Loading State */}
          {isLoading && favoriteIds.length > 0 && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="h-20 bg-muted rounded"></div>
                </Card>
              ))}
            </div>
          )}
          
          {/* Offers List */}
          {!isLoading && offers && offers.length > 0 && (
            <div className="space-y-4">
              {offers.map((offer) => {
                const agencyLogo = getAgencyLogo(offer.agency_name || '');
                const agencyInfo = getAgencyInfo(offer.agency_name || '');
                
                return (
                  <div key={offer.id} className="relative">
                    <CompactOfferCard
                      offer={offer}
                      agencyLogo={agencyLogo}
                      agencyInfo={agencyInfo}
                    />
                    
                    {/* Bouton supprimer en overlay */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFavorite(offer.id)}
                      className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Info box */}
          {favoriteIds.length > 0 && (
            <Card className="mt-8 p-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Astuce :</strong> Vos favoris sont sauvegardés localement sur cet appareil. 
                Pour les synchroniser sur tous vos appareils, connectez-vous à votre compte.
              </p>
            </Card>
          )}
          
          {/* Liens internes SEO */}
          <InternalLinks currentPage="/favoris" variant="related" className="mt-8" />
        </div>
      </div>
    </ResponsiveLayout>
  );
}
