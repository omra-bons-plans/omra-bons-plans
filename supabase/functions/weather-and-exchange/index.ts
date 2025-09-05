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
    // Coordinates for Makkah and Madinah
    const cities = {
      makkah: { lat: 21.4225, lon: 39.8262 },
      madinah: { lat: 24.4686, lon: 39.6142 }
    };

    // Fetch weather data for both cities
    const weatherPromises = Object.entries(cities).map(async ([city, coords]) => {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${openWeatherApiKey}&units=metric&lang=fr`
      );
      const weatherData = await weatherResponse.json();
      
      return {
        city,
        temperature: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon
      };
    });

    // Fetch exchange rate EUR to SAR
    const exchangeResponse = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    const exchangeData = await exchangeResponse.json();
    const eurToSar = exchangeData.rates.SAR;

    const [makkahWeather, madinahWeather] = await Promise.all(weatherPromises);

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