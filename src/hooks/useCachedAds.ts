import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getImageUrl } from '@/utils/imageUtils';

/**
 * ⚡ CACHED ADS HOOK - Optimized for LCP
 * - 5-minute cache to avoid repeated Supabase calls
 * - Reduced payload (only essential fields)
 * - Deferred enrichment for non-critical data
 */

// In-memory cache with TTL
const adsCache: {
  data: CachedAd[] | null;
  timestamp: number;
  ttl: number;
} = {
  data: null,
  timestamp: 0,
  ttl: 5 * 60 * 1000 // 5 minutes
};

export interface CachedAd {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  location?: string;
  coverImage?: string;
  isPromotion: boolean;
  promotionEndDate?: string;
  publishEndDate: string;
}

export interface CachedFormattedListing {
  id: string;
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
  isExpired?: boolean;
}

// ⚡ FIXED: Deterministic pseudo-random based on id to avoid re-renders
const getStableRating = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return 4.5 + (Math.abs(hash % 50) / 100);
};

const getStableReviews = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 3) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 90) + 10;
};

interface UseCachedAdsOptions {
  /** Retarder le fetch jusqu'à ce que enabled soit true */
  enabled?: boolean;
}

export const useCachedAds = (limit: number = 12, options: UseCachedAdsOptions = {}) => {
  const { enabled = true } = options;
  const [ads, setAds] = useState<CachedAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ⚡ DEFERRED: Ne pas fetch si enabled est false, garder loading=true
    if (!enabled) {
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const LS_KEY = 'obp_cached_ads_v1';

    const readLocalCache = (): { data: CachedAd[]; timestamp: number } | null => {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { data?: CachedAd[]; timestamp?: number };
        if (!parsed?.data || !parsed?.timestamp) return null;
        return { data: parsed.data, timestamp: parsed.timestamp };
      } catch {
        return null;
      }
    };

    const writeLocalCache = (data: CachedAd[], timestamp: number) => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify({ data, timestamp }));
      } catch {
        // ignore quota / privacy mode
      }
    };

    // ⚡ INSTANT: Hydrate depuis localStorage (si valide) pour afficher plus vite sur mobile
    const now = Date.now();
    const local = readLocalCache();
    if (local && (now - local.timestamp) < adsCache.ttl) {
      adsCache.data = local.data;
      adsCache.timestamp = local.timestamp;
      setAds(local.data);
      setLoading(false);
    }

    const fetchAds = async () => {
      // Remettre loading à true quand on commence à fetch
      if (isMounted) setLoading(true);

      try {
        // ⚡ TIMEOUT: Force stop loading after 8 seconds
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.warn('⚠️ Ads loading timeout - forcing completion');
            setLoading(false);
          }
        }, 8000);

        // Check in-memory cache first
        const now = Date.now();
        if (adsCache.data && (now - adsCache.timestamp) < adsCache.ttl) {
          console.log('⚡ Using cached ads:', adsCache.data.length);
          if (isMounted) {
            setAds(adsCache.data);
            setLoading(false);
          }
          return;
        }

        console.log('🔄 Fetching fresh ads (cache miss)');

        const nowIso = new Date().toISOString();

        // ⚡ OPTIMIZED: Only select essential fields (reduces payload ~70%)
        const { data: adsData, error: adsError } = await supabase
          .from('ads')
          .select('id, title, price, original_price, category, location, cover_image, is_promotion, promotion_end_date, publish_end_date')
          .eq('is_published', true)
          // Compat: dans les anciennes lignes, is_draft/is_paused peuvent être NULL
          .or('is_draft.is.null,is_draft.eq.false')
          .or('is_paused.is.null,is_paused.eq.false')
          .gt('publish_end_date', nowIso)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (adsError) {
          console.error('❌ Supabase error:', adsError);
          if (isMounted) {
            setError('Erreur lors du chargement');
            setLoading(false);
          }
          return;
        }

        const enrichedAds: CachedAd[] = (adsData || []).map((ad: any) => ({
          id: ad.id,
          title: ad.title,
          price: ad.price,
          originalPrice: ad.original_price,
          category: ad.category,
          location: ad.location,
          coverImage: ad.cover_image,
          isPromotion: ad.is_promotion,
          promotionEndDate: ad.promotion_end_date,
          publishEndDate: ad.publish_end_date,
        }));

        // Update cache (mémoire + localStorage)
        adsCache.data = enrichedAds;
        adsCache.timestamp = now;
        writeLocalCache(enrichedAds, now);

        if (isMounted) {
          setAds(enrichedAds);
          setLoading(false);
        }
        console.log('✅ Fetched', enrichedAds.length, 'ads');
      } catch (err) {
        console.error('❌ Error fetching ads:', err);
        if (isMounted) {
          setError('Erreur lors du chargement');
          setLoading(false);
        }
      }
    };

    fetchAds();
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [enabled]); // ⚡ FIXED: Only re-fetch when enabled changes

  // ⚡ FIXED: useMemo to prevent recalculation on every render
  const formattedListings = useMemo((): CachedFormattedListing[] => {
    return ads.map((ad) => {
      const discount = ad.originalPrice && ad.price 
        ? Math.round(((ad.originalPrice - ad.price) / ad.originalPrice) * 100)
        : 0;

      const daysUntilExpiration = ad.publishEndDate 
        ? (new Date(ad.publishEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        : Infinity;
      
      const isFlashSale = discount > 30 && daysUntilExpiration <= 10;
      const isPromo = discount > 0 && discount <= 30;
      const isExpired = ad.publishEndDate ? new Date(ad.publishEndDate) <= new Date() : false;

      // ⚡ OPTIMIZED: Use smaller image dimensions for mobile
      let coverImageUrl = '/ad-placeholder.jpg';
      if (ad.coverImage) {
        coverImageUrl = getImageUrl(ad.coverImage, { width: 320, height: 240, quality: 75 });
      }

      return {
        id: ad.id,
        type: ad.category,
        title: ad.title,
        subtitle: ad.location || '',
        price: ['guides', 'chauffeurs', 'babysitting'].includes(ad.category) 
          ? 'Sur demande' 
          : `${ad.price}€`,
        originalPrice: ad.originalPrice ? `${ad.originalPrice}€` : undefined,
        discount: discount > 0 ? discount : undefined,
        isFlashSale,
        isPromo,
        flashSaleEndDate: isFlashSale ? new Date(ad.publishEndDate) : undefined,
        image: coverImageUrl,
        rating: getStableRating(ad.id), // ⚡ FIXED: Stable rating based on id
        reviews: getStableReviews(ad.id), // ⚡ FIXED: Stable reviews based on id
        location: ad.location || '',
        isPopular: ad.isPromotion || discount > 20,
        isExpired,
      };
    });
  }, [ads]);

  return {
    ads,
    formattedListings,
    loading,
    error,
  };
};

// Force cache invalidation
export const invalidateAdsCache = () => {
  adsCache.data = null;
  adsCache.timestamp = 0;
};
