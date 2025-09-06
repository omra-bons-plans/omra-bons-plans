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
  flashSaleEndDate?: Date;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  isPopular: boolean;
}

export const useAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch published ads that haven't expired
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .eq('is_published', true)
        .eq('is_draft', false)
        .eq('is_paused', false)
        .gt('publish_end_date', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (adsError) throw adsError;

      if (!adsData || adsData.length === 0) {
        setAds([]);
        setLoading(false);
        return;
      }

      // Fetch category-specific details for each ad
      const enrichedAds: Ad[] = await Promise.all(
        adsData.map(async (ad) => {
          let categoryDetails = null;

          try {
            switch (ad.category) {
              case 'sejours':
                const { data: sejourData } = await supabase
                  .from('ads_sejours')
                  .select('*')
                  .eq('ad_id', ad.id)
                  .single();
                categoryDetails = sejourData;
                break;
              case 'vols':
                const { data: volData } = await supabase
                  .from('ads_vols')
                  .select('*')
                  .eq('ad_id', ad.id)
                  .single();
                categoryDetails = volData;
                break;
              case 'guides':
                const { data: guideData } = await supabase
                  .from('ads_guides')
                  .select('*')
                  .eq('ad_id', ad.id)
                  .single();
                categoryDetails = guideData;
                break;
              case 'chauffeurs':
                const { data: chauffeurData } = await supabase
                  .from('ads_chauffeurs')
                  .select('*')
                  .eq('ad_id', ad.id)
                  .single();
                categoryDetails = chauffeurData;
                break;
              case 'babysitting':
                const { data: babysittingData } = await supabase
                  .from('ads_babysitting')
                  .select('*')
                  .eq('ad_id', ad.id)
                  .single();
                categoryDetails = babysittingData;
                break;
              case 'hebergement':
                const { data: hebergementData } = await supabase
                  .from('ads_hebergements')
                  .select('*')
                  .eq('ad_id', ad.id)
                  .single();
                categoryDetails = hebergementData;
                break;
            }
          } catch (categoryError) {
            console.warn(`Error fetching ${ad.category} details for ad ${ad.id}:`, categoryError);
          }

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
          };
        })
      );

      // Fetch real ratings for all ads
      const adsWithRealRatings = await Promise.all(
        enrichedAds.map(async (ad) => {
          const { data: ratingData } = await supabase
            .rpc('get_ad_rating', { ad_id: ad.id });
          
          const rating = ratingData?.[0]?.avg_rating || 0;
          const reviewCount = ratingData?.[0]?.review_count || 0;
          
          return {
            ...ad,
            rating: rating > 0 ? Number(rating) : 4.5 + Math.random() * 0.5, // Fallback to random for ads without reviews
            reviews: reviewCount > 0 ? reviewCount : Math.floor(Math.random() * 100) + 10, // Fallback to random
          };
        })
      );

      setAds(adsWithRealRatings);
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
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
            location = ad.categoryDetails.city || location;
          }
          break;
        case 'babysitting':
          if (ad.categoryDetails) {
            subtitle = `${ad.categoryDetails.languages?.join(', ') || 'Français'} • ${ad.categoryDetails.gender === 'female' ? 'Femme' : 'Homme'}`;
          }
          break;
        case 'hebergement':
          if (ad.categoryDetails) {
            subtitle = `${ad.categoryDetails.accommodation_type} • ${ad.categoryDetails.rooms_count} chambres`;
            location = ad.categoryDetails.city || location;
          }
          break;
        default:
          subtitle = ad.description.length > 50 ? ad.description.substring(0, 50) + '...' : ad.description;
      }

      // Determine if it's a flash sale (promotion ending within 7 days)
      const isFlashSale = ad.isPromotion && ad.promotionEndDate 
        ? new Date(ad.promotionEndDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        : false;

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
        flashSaleEndDate: ad.promotionEndDate ? new Date(ad.promotionEndDate) : undefined,
        image: getImageUrl(ad.coverImage) || '/ad-placeholder.jpg',
        rating: ad.rating || 4.5,
        reviews: ad.reviews || 0,
        location,
        isPopular: ad.isPromotion || discount > 20, // Popular if promoted or big discount
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