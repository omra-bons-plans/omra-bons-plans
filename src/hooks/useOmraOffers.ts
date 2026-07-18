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
  airline?: string | null;
  guide_language?: string[];
  currency_raw?: string | null;
  is_complet: boolean;
  is_recommended: boolean;
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
        
        // Requête directe au lieu de RPC - filtrer les offres actives et non expirées
        // On utilise le 1er du mois courant pour ne pas cacher les offres du mois en cours
        const now = new Date();
        const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        let query = supabase
          .from('omra_offers')
          .select('id, agency_name, agency_url, price_eur, month_departure, date_start, date_end, departure_city, formula_type, duration_nights, makkah_nights, medina_nights, hotel_makkah, hotel_medinah, distance_to_haram_m, offer_url, board, flights_included, visa_included, offer_title, airline, guide_language, currency_raw, is_complet, is_recommended')
          .eq('status', 'active')
          .or(`date_start.is.null,date_start.gte.${firstOfMonth}`);

        // Appliquer les filtres
        if (filters.month) {
          // Comparaison insensible à la casse avec ilike
          query = query.ilike('month_departure', filters.month);
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
        console.log('[useOmraOffers] Sort by:', filters.sortBy);
        console.log('[useOmraOffers] First 5 dates BEFORE sort:', sortedData.slice(0, 5).map(o => ({ date: o.date_start, title: o.offer_title })));
        
        // Helper function to get sortable date value
        const getSortableDate = (offer: OmraOffer): number => {
          if (offer.date_start) {
            return new Date(offer.date_start).getTime();
          }
          
          // Fallback: use month_departure to estimate date
          const monthMap: Record<string, string> = {
            'Janvier 2026': '2026-01',
            'Février 2026': '2026-02',
            'Mars 2026': '2026-03',
            'Avril 2026': '2026-04',
            'Mai 2026': '2026-05',
            'Juin 2026': '2026-06',
            'Juillet 2026': '2026-07',
            'Août 2026': '2026-08',
            'Septembre 2026': '2026-09',
            'Octobre 2026': '2026-10',
            'Novembre 2026': '2026-11',
            'Décembre 2026': '2026-12',
            'Janvier 2027': '2027-01',
            'Février 2027': '2027-02'
          };
          
          const monthStr = monthMap[offer.month_departure];
          if (monthStr) {
            return new Date(`${monthStr}-15`).getTime(); // Use middle of month
          }
          
          return Infinity; // If no date info at all
        };
        
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
          case 'date_asc':
            sortedData.sort((a, b) => {
              const dateA = getSortableDate(a);
              const dateB = getSortableDate(b);
              return dateA - dateB;
            });
            break;
          default:
            // Tri par défaut : date de départ la plus proche
            sortedData.sort((a, b) => {
              const dateA = getSortableDate(a);
              const dateB = getSortableDate(b);
              return dateA - dateB;
            });
        }

        console.log('[useOmraOffers] First 5 dates AFTER sort:', sortedData.slice(0, 5).map(o => ({ date: o.date_start, title: o.offer_title })));
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
