import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Agency {
  id: string;
  name: string;
  url: string;
  google_search_url?: string;
  google_rating: number;
  review_count: number;
  strengths: string[];
  weaknesses: string[];
  specialties: string[];
  price_range: string;
  highlight: string;
  last_review_update?: string;
  created_at: string;
  updated_at: string;
}

export const useAgencies = () => {
  return useQuery({
    queryKey: ['agencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .order('google_rating', { ascending: false });

      if (error) {
        console.error('Error fetching agencies:', error);
        throw error;
      }

      return data as Agency[];
    },
  });
};

export const useAgency = (name: string) => {
  return useQuery({
    queryKey: ['agency', name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .eq('name', name)
        .single();

      if (error) {
        console.error('Error fetching agency:', error);
        throw error;
      }

      return data as Agency;
    },
    enabled: !!name,
  });
};
