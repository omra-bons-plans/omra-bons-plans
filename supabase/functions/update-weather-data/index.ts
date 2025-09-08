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
    console.log('🌤️ Starting scheduled weather data update...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      console.log(`🌡️ Temperature for ${cityData.name}: ${currentWeather.temp_c}°C (rounded: ${temperature}°C)`);
      
      return {
        city,
        temperature,
        description: currentWeather.condition?.text || 'Sunny',
        icon: currentWeather.condition?.icon || '',
        humidity: currentWeather.humidity || null,
        wind_speed: currentWeather.wind_kph || null,
        temp_max: null, // WeatherAPI current endpoint doesn't provide daily min/max
        temp_min: null
      };
    });

    const weatherResults = await Promise.all(weatherPromises);
    
    // Update weather data in the database
    for (const weather of weatherResults) {
      const { error: updateError } = await supabase
        .from('weather_data')
        .upsert({ 
          city: weather.city,
          temperature: weather.temperature,
          description: weather.description,
          icon: weather.icon,
          humidity: weather.humidity,
          wind_speed: weather.wind_speed,
          temp_max: weather.temp_max,
          temp_min: weather.temp_min,
          last_updated: new Date().toISOString() 
        });

      if (updateError) {
        console.error(`Error updating weather data for ${weather.city}:`, updateError);
        throw updateError;
      }

      console.log(`✅ Weather data updated for ${weather.city}:`, weather.temperature, '°C');
    }

    console.log('🎯 All weather data updated successfully');

    return new Response(JSON.stringify({
      success: true,
      weather: weatherResults,
      updated_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error updating weather data:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});