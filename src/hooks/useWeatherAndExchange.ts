import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
  tempMax?: number;
  tempMin?: number;
}

interface ExchangeData {
  eurToSar: number;
  lastUpdated: string;
}

interface WeatherAndExchangeData {
  weather: {
    makkah: WeatherData;
    madinah: WeatherData;
  };
  exchange: ExchangeData;
}

export const useWeatherAndExchange = () => {
  const [data, setData] = useState<WeatherAndExchangeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: functionData, error: functionError } = await supabase.functions.invoke('weather-and-exchange');

      if (functionError) {
        throw functionError;
      }

      setData(functionData);
    } catch (err: any) {
      console.error('Error fetching weather and exchange data:', err);
      setError(err.message || 'Une erreur est survenue');
      
      // Set fallback data if API fails
      setData({
        weather: {
          makkah: { city: 'makkah', temperature: 32, description: 'ensoleillé', icon: '01d' },
          madinah: { city: 'madinah', temperature: 28, description: 'ensoleillé', icon: '01d' }
        },
        exchange: {
          eurToSar: 3.95,
          lastUpdated: new Date().toISOString()
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data immediately
    fetchData();

    // Set up interval to refresh every 24 hours (86400000 ms)
    const interval = setInterval(fetchData, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
};