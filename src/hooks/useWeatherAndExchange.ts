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

// Cache simple pour éviter les requêtes répétées de météo
let weatherCache: { data: WeatherAndExchangeData; timestamp: number } | null = null;
const WEATHER_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const useWeatherAndExchange = () => {
  const [data, setData] = useState<WeatherAndExchangeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🌡️ useWeatherAndExchange hook - Current state:', { 
    hasData: !!data, 
    loading, 
    error,
    temperature: data?.weather?.makkah?.temperature,
    exchangeRate: data?.exchange?.eurToSar 
  });

  const fetchData = async (force = false) => {
    // Vérifier le cache d'abord
    const now = Date.now();
    if (!force && weatherCache && (now - weatherCache.timestamp) < WEATHER_CACHE_DURATION) {
      setData(weatherCache.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🌤️ Fetching weather and exchange data...');

      const { data: functionData, error: functionError } = await supabase.functions.invoke('weather-and-exchange', {
        body: { timestamp: now, forceRefresh: force }
      });

      if (functionError) {
        console.error('❌ Function error:', functionError);
        throw functionError;
      }

      console.log('✅ Weather and exchange data received');
      
      // Mettre en cache
      weatherCache = {
        data: functionData,
        timestamp: now
      };
      
      setData(functionData);
    } catch (err: any) {
      console.error('💥 Error fetching weather and exchange data:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Vérifier d'abord le cache, puis charger si nécessaire
    const now = Date.now();
    if (weatherCache && (now - weatherCache.timestamp) < WEATHER_CACHE_DURATION) {
      setData(weatherCache.data);
      setLoading(false);
    } else {
      fetchData();
    }

    // Refresh toutes les heures seulement
    const interval = setInterval(() => fetchData(true), 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
};