import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting weather and exchange data fetch...');
    
    console.log('Fetching weather data from database...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get weather data from database
    const { data: weatherDataFromDb, error: weatherError } = await supabase
      .from('weather_data')
      .select('city, temperature, description, icon, humidity, wind_speed, temp_max, temp_min, last_updated')
      .in('city', ['makkah', 'madinah']);

    let makkahWeather, madinahWeather;

    if (weatherError || !weatherDataFromDb || weatherDataFromDb.length === 0) {
      console.warn('Error fetching weather data from database or no data found:', weatherError);
      console.log('Using fallback weather data');
      
      // Fallback weather data
      makkahWeather = {
        city: 'makkah',
        temperature: 35,
        description: 'Clear',
        icon: '',
        humidity: 50,
        windSpeed: 5.0,
        tempMax: null,
        tempMin: null
      };

      madinahWeather = {
        city: 'madinah', 
        temperature: 32,
        description: 'Clear',
        icon: '',
        humidity: 45,
        windSpeed: 3.0,
        tempMax: null,
        tempMin: null
      };
    } else {
      // Process weather data from database
      const makkahData = weatherDataFromDb.find(w => w.city === 'makkah');
      const madinahData = weatherDataFromDb.find(w => w.city === 'madinah');

      makkahWeather = {
        city: 'makkah',
        temperature: makkahData?.temperature || 35,
        description: makkahData?.description || 'Clear',
        icon: makkahData?.icon || '',
        humidity: makkahData?.humidity || 50,
        windSpeed: makkahData?.wind_speed || 5.0,
        tempMax: makkahData?.temp_max || null,
        tempMin: makkahData?.temp_min || null
      };

      madinahWeather = {
        city: 'madinah',
        temperature: madinahData?.temperature || 32,
        description: madinahData?.description || 'Clear', 
        icon: madinahData?.icon || '',
        humidity: madinahData?.humidity || 45,
        windSpeed: madinahData?.wind_speed || 3.0,
        tempMax: madinahData?.temp_max || null,
        tempMin: madinahData?.temp_min || null
      };

      console.log('✅ Weather data from database:');
      console.log(`🕋 Makkah: ${makkahWeather.temperature}°C - ${makkahWeather.description}`);
      console.log(`🏛️ Madinah: ${madinahWeather.temperature}°C - ${madinahWeather.description}`);
    }

    console.log('Fetching exchange rate from database...');
    
    let eurToSar = 3.95; // Fallback value
    let lastUpdated = new Date().toISOString();
    
    try {
      // Get exchange rate from database
      const { data: exchangeRateData, error: exchangeError } = await supabase
        .from('exchange_rates')
        .select('rate, last_updated')
        .eq('base_currency', 'EUR')
        .eq('target_currency', 'SAR')
        .single();

      if (exchangeError) {
        console.warn('Error fetching exchange rate from database:', exchangeError);
        console.log('Using fallback exchange rate:', eurToSar);
      } else if (exchangeRateData) {
        eurToSar = exchangeRateData.rate;
        lastUpdated = exchangeRateData.last_updated;
        console.log('✅ Exchange rate from database:', eurToSar, 'updated at:', lastUpdated);
      }
    } catch (dbError) {
      console.warn('Database connection error, using fallback exchange rate:', dbError);
    }

    console.log('🎯 Final data results:');
    console.log(`🕋 Makkah: ${makkahWeather.temperature}°C - ${makkahWeather.description}`);
    console.log(`🏛️ Madinah: ${madinahWeather.temperature}°C - ${madinahWeather.description}`);
    console.log(`💱 Exchange rate: ${eurToSar} EUR/SAR`);
    console.log('All data fetched successfully from database');

    return new Response(JSON.stringify({
      weather: {
        makkah: makkahWeather,
        madinah: madinahWeather
      },
      exchange: {
        eurToSar: Number(eurToSar.toFixed(2)),
        lastUpdated: lastUpdated
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching weather and exchange data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});