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

// Cache séparé pour météo (1h) et taux de change (12h)
const WEATHER_CACHE_DURATION = 60 * 60 * 1000; // 1 heure
const EXCHANGE_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 heures

// Gestion du cache avec localStorage
const getWeatherCache = () => {
  try {
    const cached = localStorage.getItem('weatherCache');
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const setWeatherCache = (data: WeatherAndExchangeData['weather']) => {
  try {
    localStorage.setItem('weatherCache', JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch {}
};

const getExchangeCache = () => {
  try {
    const cached = localStorage.getItem('exchangeCache');
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const setExchangeCache = (data: WeatherAndExchangeData['exchange']) => {
  try {
    localStorage.setItem('exchangeCache', JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch {}
};

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
    const now = Date.now();
    
    // Vérifier les caches séparément
    const weatherCacheData = getWeatherCache();
    const exchangeCacheData = getExchangeCache();
    
    const needWeather = force || !weatherCacheData || (now - weatherCacheData.timestamp) > WEATHER_CACHE_DURATION;
    const needExchange = force || !exchangeCacheData || (now - exchangeCacheData.timestamp) > EXCHANGE_CACHE_DURATION;
    
    // Si on a déjà tout dans le cache, pas besoin de fetch
    if (!needWeather && !needExchange) {
      setData({
        weather: weatherCacheData.data,
        exchange: exchangeCacheData.data
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🌤️ Fetching weather and exchange data...', { needWeather, needExchange });

      const { data: functionData, error: functionError } = await supabase.functions.invoke('weather-and-exchange', {
        body: { timestamp: now, forceRefresh: force }
      });

      if (functionError) {
        console.error('❌ Function error:', functionError);
        throw functionError;
      }

      console.log('✅ Weather and exchange data received');
      
      // Mettre en cache séparément
      if (needWeather && functionData.weather) {
        setWeatherCache(functionData.weather);
      }
      if (needExchange && functionData.exchange) {
        setExchangeCache(functionData.exchange);
      }
      
      setData(functionData);
    } catch (err: any) {
      console.error('💥 Error fetching weather and exchange data:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Vérifier d'abord les caches, puis charger si nécessaire
    const weatherCacheData = getWeatherCache();
    const exchangeCacheData = getExchangeCache();
    const now = Date.now();
    
    const hasValidWeather = weatherCacheData && (now - weatherCacheData.timestamp) < WEATHER_CACHE_DURATION;
    const hasValidExchange = exchangeCacheData && (now - exchangeCacheData.timestamp) < EXCHANGE_CACHE_DURATION;
    
    if (hasValidWeather && hasValidExchange) {
      setData({
        weather: weatherCacheData.data,
        exchange: exchangeCacheData.data
      });
      setLoading(false);
    } else {
      fetchData();
    }

    // Interval pour météo (1h) et taux de change (12h)
    const weatherInterval = setInterval(() => {
      const currentWeatherCache = getWeatherCache();
      const currentNow = Date.now();
      if (!currentWeatherCache || (currentNow - currentWeatherCache.timestamp) >= WEATHER_CACHE_DURATION) {
        fetchData();
      }
    }, WEATHER_CACHE_DURATION);

    const exchangeInterval = setInterval(() => {
      const currentExchangeCache = getExchangeCache();
      const currentNow = Date.now();
      if (!currentExchangeCache || (currentNow - currentExchangeCache.timestamp) >= EXCHANGE_CACHE_DURATION) {
        fetchData();
      }
    }, EXCHANGE_CACHE_DURATION);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(exchangeInterval);
    };
  }, []);

  return { data, loading, error, refetch: fetchData };
};