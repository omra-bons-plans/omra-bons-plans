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

    console.log('Fetching weather data with fallback APIs...');
    
    // Fetch weather data for both cities with fallback system
    const weatherPromises = Object.entries(cities).map(async ([city, cityData]) => {
      console.log(`🌤️ Fetching weather for ${cityData.name}...`);
      
      // Try WeatherAPI first, then Open-Meteo as fallback
      let weatherData = null;
      let lastError = null;
      
      // Method 1: WeatherAPI (primary)
      if (weatherApiKey) {
        try {
          console.log(`🔄 Trying WeatherAPI for ${cityData.name}...`);
          const cacheBuster = Date.now();
          
          for (const protocol of ['https', 'http']) {
            try {
              const url = `${protocol}://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${encodeURIComponent(cityData.query)}&_=${cacheBuster}`;
              
              const weatherResponse = await fetch(url, {
                headers: { 'User-Agent': 'Supabase-Edge-Function/1.0' },
                signal: AbortSignal.timeout(8000)
              });
              
              if (weatherResponse.ok) {
                const data = await weatherResponse.json();
                if (data?.current) {
                  weatherData = {
                    temperature: Math.round(data.current.temp_c),
                    description: data.current.condition?.text || 'Clear',
                    icon: data.current.condition?.icon || '',
                    humidity: data.current.humidity || null,
                    wind_speed: data.current.wind_kph || null
                  };
                  console.log(`✅ WeatherAPI success for ${cityData.name}: ${weatherData.temperature}°C`);
                  break;
                }
              }
            } catch (error) {
              console.log(`⚠️ WeatherAPI ${protocol} failed for ${cityData.name}:`, error.message);
              lastError = `WeatherAPI: ${error.message}`;
            }
          }
        } catch (error) {
          console.log(`❌ WeatherAPI failed for ${cityData.name}:`, error.message);
          lastError = `WeatherAPI: ${error.message}`;
        }
      }
      
      // Method 2: Open-Meteo (free fallback, no API key needed)
      if (!weatherData) {
        try {
          console.log(`🔄 Trying Open-Meteo fallback for ${cityData.name}...`);
          
          // Get coordinates for the cities
          const coords = city === 'makkah' 
            ? { lat: 21.4225, lon: 39.8262 } // Makkah coordinates
            : { lat: 24.4686, lon: 39.6142 }; // Madinah coordinates
          
          const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh`;
          
          const meteoResponse = await fetch(meteoUrl, {
            signal: AbortSignal.timeout(8000)
          });
          
          if (meteoResponse.ok) {
            const data = await meteoResponse.json();
            if (data?.current_weather) {
              // Map weather codes to descriptions
              const getWeatherDescription = (code) => {
                const codes = {
                  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
                  45: 'Fog', 48: 'Depositing rime fog',
                  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
                  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
                  80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers'
                };
                return codes[code] || 'Clear';
              };
              
              weatherData = {
                temperature: Math.round(data.current_weather.temperature),
                description: getWeatherDescription(data.current_weather.weathercode),
                icon: '', // Open-Meteo doesn't provide icons
                humidity: null, // Not available in current_weather
                wind_speed: data.current_weather.windspeed || null
              };
              console.log(`✅ Open-Meteo success for ${cityData.name}: ${weatherData.temperature}°C`);
            }
          }
        } catch (error) {
          console.log(`❌ Open-Meteo failed for ${cityData.name}:`, error.message);
          lastError = `Open-Meteo: ${error.message}`;
        }
      }
      
      // If all APIs failed, throw error
      if (!weatherData) {
        throw new Error(`All weather APIs failed for ${city}. Last error: ${lastError}`);
      }
      
      return {
        city,
        ...weatherData,
        temp_max: null,
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
        }, { 
          onConflict: 'city',
          ignoreDuplicates: false 
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