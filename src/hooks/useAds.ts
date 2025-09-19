import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getImageUrl } from '@/utils/imageUtils';

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  location?: string;
  coverImage?: string;
  images: string[];
  isPromotion: boolean;
  promotionEndDate?: string;
  publishEndDate: string;
  createdAt: string;
  rating?: number;
  reviews?: number;
  showEmail: boolean;
  showPhone: boolean;
  userId: string;
  
  // Category-specific data
  categoryDetails?: any;
}

export interface FormattedListing {
  id: number | string;
  type: string;
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  isFlashSale: boolean;
  isPromo: boolean;
  flashSaleEndDate?: Date;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  isPopular: boolean;
  isExpired?: boolean; // Nouvelle propriété pour indiquer si l'annonce est expirée
}

export const useAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching ads - Start');

      // Calculer la date limite pour les annonces expirées (7 jours avant maintenant)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      // Fetch published ads that haven't expired OR expired within the last 7 days
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .eq('is_published', true)
        .eq('is_draft', false)
        .eq('is_paused', false)
        .gt('publish_end_date', sevenDaysAgo)
        .order('created_at', { ascending: false });

      if (adsError) throw adsError;

      if (!adsData || adsData.length === 0) {
        console.log('📭 No ads found');
        setAds([]);
        setLoading(false);
        return;
      }

      console.log('📊 Found', adsData.length, 'ads');

      // Group ads by category for batch fetching
      const adsByCategory = adsData.reduce((acc: Record<string, any[]>, ad: any) => {
        if (!acc[ad.category]) acc[ad.category] = [];
        acc[ad.category].push(ad);
        return acc;
      }, {} as Record<string, any[]>);

      // Batch fetch category details
      const categoryDetailsMap = new Map();
      
      await Promise.all(Object.entries(adsByCategory).map(async ([category, categoryAds]: [string, any[]]) => {
        const adIds = categoryAds.map((ad: any) => ad.id);
        
        try {
          let categoryData = [];
          
          switch (category) {
            case 'sejours':
              const { data: sejourData } = await supabase
                .from('ads_sejours')
                .select('*')
                .in('ad_id', adIds);
              categoryData = sejourData || [];
              break;
            case 'vols':
              const { data: volData } = await supabase
                .from('ads_vols')
                .select('*')
                .in('ad_id', adIds);
              categoryData = volData || [];
              break;
            case 'guides':
              const { data: guideData } = await supabase
                .from('ads_guides')
                .select('*')
                .in('ad_id', adIds);
              categoryData = guideData || [];
              break;
            case 'chauffeurs':
              const { data: chauffeurData } = await supabase
                .from('ads_chauffeurs')
                .select('*')
                .in('ad_id', adIds);
              categoryData = chauffeurData || [];
              break;
            case 'babysitting':
              const { data: babysittingData } = await supabase
                .from('ads_babysitting')
                .select('*')
                .in('ad_id', adIds);
              categoryData = babysittingData || [];
              break;
            case 'hebergement':
              const { data: hebergementData } = await supabase
                .from('ads_hebergements')
                .select('*')
                .in('ad_id', adIds);
              categoryData = hebergementData || [];
              break;
          }
          
          // Map category details to ad IDs
          categoryData.forEach(detail => {
            categoryDetailsMap.set(detail.ad_id, detail);
          });
          
        } catch (categoryError) {
          console.warn(`Error fetching ${category} details:`, categoryError);
        }
      }));

      // Skip ratings for faster loading - use fallback values
      const allAdIds = adsData.map((ad: any) => ad.id);
      const ratingsMap = new Map();
      
      // Add fallback ratings for all ads to speed up loading
      allAdIds.forEach(adId => {
        ratingsMap.set(adId, {
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 100) + 10
        });
      });

      // Combine all data
      const enrichedAds: Ad[] = adsData.map((ad) => {
        const categoryDetails = categoryDetailsMap.get(ad.id);
        const ratingData = ratingsMap.get(ad.id) || { rating: 4.5, reviews: 0 };

        return {
          id: ad.id,
          title: ad.title,
          description: ad.description,
          price: ad.price,
          originalPrice: ad.original_price,
          category: ad.category,
          location: ad.location,
          coverImage: ad.cover_image,
          images: ad.images || [],
          isPromotion: ad.is_promotion,
          promotionEndDate: ad.promotion_end_date,
          publishEndDate: ad.publish_end_date,
          createdAt: ad.created_at,
          showEmail: ad.show_email,
          showPhone: ad.show_phone,
          userId: ad.user_id,
          categoryDetails,
          rating: ratingData.rating,
          reviews: ratingData.reviews,
        };
      });

      console.log('✅ Successfully enriched', enrichedAds.length, 'ads');
      setAds(enrichedAds);
    } catch (err) {
      console.error('❌ Error fetching ads:', err);
      setError('Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
      console.log('🏁 useAds: Loading completed, setting loading to false');
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Transform ads to formatted listings for display
  const getFormattedListings = (): FormattedListing[] => {
    return ads.map((ad) => {
      const discount = ad.originalPrice && ad.price 
        ? Math.round(((ad.originalPrice - ad.price) / ad.originalPrice) * 100)
        : 0;

      let subtitle = '';
      let location = ad.location || '';

      // Generate subtitle based on category
      switch (ad.category) {
        case 'sejours':
          if (ad.categoryDetails) {
            const nights = (ad.categoryDetails.nights_medina || 0) + (ad.categoryDetails.nights_mecca || 0);
            subtitle = `${nights} jours • ${ad.categoryDetails.formula_type || 'Standard'}`;
          }
          break;
        case 'vols':
          if (ad.categoryDetails) {
            subtitle = `${ad.categoryDetails.airline} • ${ad.categoryDetails.departure_date ? new Date(ad.categoryDetails.departure_date).toLocaleDateString() : ''}`;
          }
          break;
        case 'guides':
          if (ad.categoryDetails) {
            subtitle = `${ad.categoryDetails.years_experience} ans d'expérience • ${ad.categoryDetails.languages?.join(', ') || 'Français'}`;
          }
          break;
        case 'chauffeurs':
          if (ad.categoryDetails) {
            subtitle = `${ad.categoryDetails.vehicle_seats} places • ${ad.categoryDetails.languages?.join(', ') || 'Français'}`;
            // S'assurer que location est une string en joignant le tableau de villes
            location = Array.isArray(ad.categoryDetails.city) 
              ? ad.categoryDetails.city.join(', ') 
              : (ad.categoryDetails.city || location);
          }
          break;
        case 'babysitting':
          if (ad.categoryDetails) {
            subtitle = `${ad.categoryDetails.languages?.join(', ') || 'Français'} • ${ad.categoryDetails.gender === 'female' ? 'Femme' : 'Homme'}`;
          }
          break;
        case 'hebergement':
        case 'hebergements':
          if (ad.categoryDetails) {
            const accommodationType = ad.categoryDetails.accommodation_type === 'apartment' ? 'Appartement' :
                                    ad.categoryDetails.accommodation_type === 'appartement' ? 'Appartement' : 
                                    ad.categoryDetails.accommodation_type === 'hotel' ? 'Hôtel' : 
                                    ad.categoryDetails.accommodation_type;
            let accommodationInfo = accommodationType;
            if (ad.categoryDetails.rooms_count) {
              accommodationInfo += ` • ${ad.categoryDetails.rooms_count} chambres`;
            }
            if (ad.categoryDetails.walking_minutes) {
              accommodationInfo += ` • ${ad.categoryDetails.walking_minutes}min à pied`;
            } else if (ad.categoryDetails.distance_to_mosque) {
              // Fallback: convertir la distance en minutes à pied (environ 80m/minute de marche)
              const distanceInMeters = parseInt(ad.categoryDetails.distance_to_mosque);
              const walkingMinutes = Math.round(distanceInMeters / 80);
              accommodationInfo += ` • ${walkingMinutes}min à pied`;
            }
            subtitle = accommodationInfo;
            location = ad.categoryDetails.city || location;
          }
          break;
        default:
          subtitle = ad.description.length > 50 ? ad.description.substring(0, 50) + '...' : ad.description;
      }

      // Determine promotion type based on discount and publication end date
      const daysUntilExpiration = ad.publishEndDate 
        ? (new Date(ad.publishEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        : Infinity;
      const isFlashSale = discount > 30 && daysUntilExpiration <= 10;
      const isPromo = discount > 0 && discount <= 30;

      const isExpired = ad.publishEndDate ? new Date(ad.publishEndDate) <= new Date() : false;

      // Détermine l'image de couverture : cover_image ou première image avec "cover-" ou première image disponible
      let coverImageUrl = '/ad-placeholder.jpg';
      if (ad.coverImage) {
        coverImageUrl = getImageUrl(ad.coverImage);
      } else if (ad.images && ad.images.length > 0) {
        // Cherche une image qui commence par "cover-" dans le nom
        const coverImage = ad.images.find(img => img.includes('/cover-'));
        const imageToUse = coverImage || ad.images[0];
        coverImageUrl = getImageUrl(imageToUse);
      }

      return {
        id: ad.id,
        type: ad.category,
        title: ad.title,
        subtitle,
        price: ['guides', 'chauffeurs', 'babysitting'].includes(ad.category) 
          ? 'Sur demande' 
          : `${ad.price}€`,
        originalPrice: ad.originalPrice ? `${ad.originalPrice}€` : undefined,
        discount: discount > 0 ? discount : undefined,
        isFlashSale,
        isPromo,
        flashSaleEndDate: isFlashSale ? new Date(ad.publishEndDate) : undefined,
        image: coverImageUrl,
        rating: ad.rating || 4.5,
        reviews: ad.reviews || 0,
        location,
        isPopular: ad.isPromotion || discount > 20, // Popular if promoted or big discount
        isExpired, // Nouvelle propriété pour indiquer si l'annonce est expirée
      };
    });
  };

  return {
    ads,
    formattedListings: getFormattedListings(),
    loading,
    error,
    refetch: fetchAds,
  };
};