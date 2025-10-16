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
        
        const { data, error: fetchError } = await (supabase.rpc as any)('get_omra_offers', {
          filter_month: filters.month || null,
          filter_city: filters.city || null,
          filter_formula: filters.formula || null,
          min_price: filters.minPrice || 0,
          max_price: filters.maxPrice || 999999,
          min_duration: filters.minDuration || 0,
          max_distance: filters.maxDistance || 999999
        });

        if (fetchError) throw fetchError;

        let sortedData = (data || []) as unknown as OmraOffer[];
        
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
