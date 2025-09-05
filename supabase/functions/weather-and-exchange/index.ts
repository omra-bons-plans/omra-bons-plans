import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY');

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
    
    // Check if API key is available
    if (!openWeatherApiKey) {
      console.error('OpenWeather API key is missing');
      throw new Error('OpenWeather API key is not configured');
    }

    // Coordinates for Makkah and Madinah
    const cities = {
      makkah: { lat: 21.4225, lon: 39.8262 },
      madinah: { lat: 24.4686, lon: 39.6142 }
    };

    console.log('Fetching weather data for both cities...');
    
    // Fetch weather data for both cities
    const weatherPromises = Object.entries(cities).map(async ([city, coords]) => {
      console.log(`Fetching weather for ${city}...`);
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${openWeatherApiKey}&units=metric&lang=fr`
      );
      
      if (!weatherResponse.ok) {
        console.error(`Weather API error for ${city}:`, weatherResponse.status, weatherResponse.statusText);
        throw new Error(`Weather API error for ${city}: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();
      console.log(`Weather data for ${city}:`, weatherData);
      
      // Check if weather data is valid
      if (!weatherData.main || !weatherData.weather || !weatherData.weather[0]) {
        console.error(`Invalid weather data for ${city}:`, weatherData);
        throw new Error(`Invalid weather data received for ${city}`);
      }
      
      return {
        city,
        temperature: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon
      };
    });

    console.log('Fetching exchange rate...');
    
    // Fetch exchange rate EUR to SAR
    const exchangeResponse = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    
    if (!exchangeResponse.ok) {
      console.error('Exchange API error:', exchangeResponse.status, exchangeResponse.statusText);
      throw new Error(`Exchange API error: ${exchangeResponse.status}`);
    }
    
    const exchangeData = await exchangeResponse.json();
    console.log('Exchange data:', exchangeData);
    
    if (!exchangeData.rates || !exchangeData.rates.SAR) {
      console.error('Invalid exchange data:', exchangeData);
      throw new Error('Invalid exchange rate data received');
    }
    
    const eurToSar = exchangeData.rates.SAR;

    const [makkahWeather, madinahWeather] = await Promise.all(weatherPromises);
    console.log('All data fetched successfully');

    return new Response(JSON.stringify({
      weather: {
        makkah: makkahWeather,
        madinah: madinahWeather
      },
      exchange: {
        eurToSar: Number(eurToSar.toFixed(2)),
        lastUpdated: new Date().toISOString()
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