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
    
    const weatherApiKey = Deno.env.get('WEATHERAPI_KEY');
    if (!weatherApiKey) {
      console.error('WEATHERAPI_KEY not found in environment');
      throw new Error('WeatherAPI key not configured');
    }
    
    // WeatherAPI queries for Makkah and Madinah
    const cities = {
      makkah: { query: "Mecca,Saudi Arabia", name: "Makkah" },
      madinah: { query: "Medina,Saudi Arabia", name: "Madinah" }
    };

    console.log('Fetching weather data using WeatherAPI...');
    
    // Fetch weather data for both cities using WeatherAPI
    const weatherPromises = Object.entries(cities).map(async ([city, cityData]) => {
      console.log(`Fetching weather for ${cityData.name}...`);
      
      // WeatherAPI current conditions endpoint
      const cacheBuster = Date.now();
      const weatherResponse = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${encodeURIComponent(cityData.query)}&_=${cacheBuster}`
      );
      
      if (!weatherResponse.ok) {
        console.error(`WeatherAPI error for ${city}:`, weatherResponse.status, weatherResponse.statusText);
        throw new Error(`WeatherAPI error for ${city}: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();
      console.log(`Weather data for ${city}:`, JSON.stringify(weatherData, null, 2));
      
      if (!weatherData || !weatherData.current) {
        console.error(`Invalid weather data for ${city}:`, weatherData);
        throw new Error(`Invalid weather data received for ${city}`);
      }
      
      const currentWeather = weatherData.current;
      const temperature = Math.round(currentWeather.temp_c);
      console.log(`🌡️ Exact temperature for ${cityData.name}: ${currentWeather.temp_c}°C (rounded: ${temperature}°C)`);
      console.log(`📍 Location confirmed: ${cityData.name}, Saudi Arabia`);
      console.log(`🕐 Data timestamp: ${weatherData.location.localtime}`);
      
      return {
        city,
        temperature,
        description: currentWeather.condition?.text || 'Sunny',
        icon: currentWeather.condition?.icon || '',
        humidity: currentWeather.humidity || null,
        windSpeed: currentWeather.wind_kph || null,
        tempMax: null, // WeatherAPI current endpoint doesn't provide daily min/max
        tempMin: null
      };
    });

    console.log('Fetching exchange rate from database...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
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

    const [makkahWeather, madinahWeather] = await Promise.all(weatherPromises);
    
    console.log('🎯 Final weather results:');
    console.log(`🕋 Makkah: ${makkahWeather.temperature}°C`);
    console.log(`🏛️ Madinah: ${madinahWeather.temperature}°C`);
    console.log('All data fetched successfully');

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