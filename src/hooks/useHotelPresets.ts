import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HotelPreset {
  id: string;
  hotel_name: string;
  city: 'makkah' | 'medina';
  stars: number;
  usage_count: number;
}

export const useHotelPresets = (city: 'makkah' | 'medina') => {
  const [hotels, setHotels] = useState<HotelPreset[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hotel_presets')
        .select('*')
        .eq('city', city)
        .order('usage_count', { ascending: false })
        .order('hotel_name');

      if (error) throw error;
      setHotels((data || []) as HotelPreset[]);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [city]);

  const saveHotel = async (hotelName: string, stars: number) => {
    try {
      const { error } = await supabase.rpc('increment_hotel_usage', {
        p_hotel_name: hotelName,
        p_city: city,
        p_stars: stars
      });

      if (error) throw error;
      await fetchHotels();
    } catch (error) {
      console.error('Error saving hotel:', error);
    }
  };

  return { hotels, loading, saveHotel, refetch: fetchHotels };
};
