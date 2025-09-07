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

  console.log('🌡️ useWeatherAndExchange hook - Current state:', { 
    hasData: !!data, 
    loading, 
    error,
    temperature: data?.weather?.makkah?.temperature,
    exchangeRate: data?.exchange?.eurToSar 
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🌤️ Fetching weather and exchange data...');

      // Add timestamp to force fresh data
      const timestamp = Date.now();
      const { data: functionData, error: functionError } = await supabase.functions.invoke('weather-and-exchange', {
        body: { timestamp }
      });

      console.log('📡 Function response:', { functionData, functionError, timestamp });

      if (functionError) {
        console.error('❌ Function error:', functionError);
        throw functionError;
      }

      console.log('✅ Weather and exchange data received:', functionData);
      console.log('🌡️ Temperature data:', {
        makkah: functionData?.weather?.makkah?.temperature,
        madinah: functionData?.weather?.madinah?.temperature,
        fetchTime: new Date().toLocaleTimeString()
      });
      setData(functionData);
    } catch (err: any) {
      console.error('💥 Error fetching weather and exchange data:', err);
      setError(err.message || 'Une erreur est survenue');
      
      // Don't set fallback data - let the component handle the null state
      console.log('🔄 API failed, component will show loading or error state');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data immediately
    fetchData();

    // Set up interval to refresh every 5 minutes (300000 ms) for more frequent updates
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
};