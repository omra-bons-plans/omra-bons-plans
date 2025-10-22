import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OmraOffer {
  id: string;
  agency_name: string;
  agency_url: string;
  price_eur: number;
  month_departure: string;
  date_start: string | null;
  date_end: string | null;
  departure_city: string;
  formula_type: string;
  duration_nights: number | null;
  makkah_nights: number | null;
  medina_nights: number | null;
  hotel_makkah: string | null;
  hotel_medinah: string | null;
  distance_to_haram_m: number | null;
  offer_url: string;
  board: string | null;
  flights_included: boolean;
  visa_included: boolean;
  offer_title: string;
  guide_language?: string[];
  currency_raw?: string | null;
}

interface FilterOptions {
  month?: string;
  city?: string;
  formula?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDistance?: number;
  sortBy?: string;
}

export const useOmraOffers = (filters: FilterOptions) => {
  const [offers, setOffers] = useState<OmraOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        console.log('[useOmraOffers] Fetching offers with filters:', filters);
        
        // Requête directe au lieu de RPC
        let query = supabase
          .from('omra_offers')
          .select('*')
          .eq('status', 'active');

        // Appliquer les filtres
        if (filters.month) {
          query = query.eq('month_departure', filters.month);
        }
        if (filters.city) {
          query = query.eq('departure_city', filters.city);
        }
        if (filters.formula) {
          query = query.eq('formula_type', filters.formula.toLowerCase());
        }
        if (filters.minPrice !== undefined) {
          query = query.gte('price_eur', filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          query = query.lte('price_eur', filters.maxPrice);
        }
        if (filters.minDuration) {
          query = query.gte('duration_nights', filters.minDuration);
        }
        if (filters.maxDistance) {
          query = query.lte('distance_to_haram_m', filters.maxDistance);
        }

        const { data, error: fetchError } = await query;

        console.log('[useOmraOffers] Response:', { data, error: fetchError });

        if (fetchError) {
          console.error('[useOmraOffers] Fetch error:', fetchError);
          throw fetchError;
        }

        let sortedData = (data || []) as unknown as OmraOffer[];
        console.log('[useOmraOffers] Sorted data length:', sortedData.length);
        
        switch (filters.sortBy) {
          case 'price_asc':
            sortedData.sort((a, b) => (a.price_eur || 0) - (b.price_eur || 0));
            break;
          case 'price_desc':
            sortedData.sort((a, b) => (b.price_eur || 0) - (a.price_eur || 0));
            break;
          case 'duration_asc':
            sortedData.sort((a, b) => (a.duration_nights || 0) - (b.duration_nights || 0));
            break;
          case 'duration_desc':
            sortedData.sort((a, b) => (b.duration_nights || 0) - (a.duration_nights || 0));
            break;
        }

        setOffers(sortedData);
        setError(null);
      } catch (err) {
        console.error('[useOmraOffers] Caught error:', err);
        setError(err as Error);
        setOffers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [filters.month, filters.city, filters.formula, filters.minPrice, filters.maxPrice, filters.minDuration, filters.maxDistance, filters.sortBy]);

  return { offers, isLoading, error };
};
