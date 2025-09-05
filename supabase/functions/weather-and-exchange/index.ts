import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    // Coordinates for Makkah and Madinah
    const cities = {
      makkah: { lat: 21.4225, lon: 39.8262, name: "Makkah" },
      madinah: { lat: 24.4686, lon: 39.6142, name: "Madinah" }
    };

    console.log('Fetching weather data using WeatherAPI.com...');
    
    // Fetch weather data for both cities using WeatherAPI.com
    const weatherPromises = Object.entries(cities).map(async ([city, coords]) => {
      console.log(`Fetching weather for ${coords.name}...`);
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${coords.lat},${coords.lon}&aqi=no`
      );
      
      if (!weatherResponse.ok) {
        console.error(`Weather API error for ${city}:`, weatherResponse.status, weatherResponse.statusText);
        throw new Error(`Weather API error for ${city}: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();
      console.log(`Weather data for ${city}:`, weatherData);
      
      // Check if weather data is valid
      if (!weatherData.current) {
        console.error(`Invalid weather data for ${city}:`, weatherData);
        throw new Error(`Invalid weather data received for ${city}`);
      }
      
      return {
        city,
        temperature: Math.round(weatherData.current.temp_c),
        description: weatherData.current.condition.text,
        icon: weatherData.current.condition.icon.split('/').pop()?.replace('.png', '') || '01d',
        humidity: weatherData.current.humidity,
        windSpeed: weatherData.current.wind_kph,
        tempMax: null, // WeatherAPI current endpoint doesn't provide daily min/max
        tempMin: null
      };
    });

    console.log('Fetching exchange rate using multiple APIs...');
    
    let eurToSar = 3.95; // Fallback value
    
    try {
      // Try Frankfurter API first (European Central Bank data, completely free)
      const exchangeResponse = await fetch('https://api.frankfurter.app/latest?from=EUR&to=SAR');
      
      if (exchangeResponse.ok) {
        const exchangeData = await exchangeResponse.json();
        console.log('Frankfurter exchange data:', exchangeData);
        
        if (exchangeData.rates && exchangeData.rates.SAR) {
          eurToSar = exchangeData.rates.SAR;
          console.log('Using Frankfurter exchange rate:', eurToSar);
        }
      } else {
        console.warn('Frankfurter API failed:', exchangeResponse.status, exchangeResponse.statusText);
        throw new Error('Frankfurter API failed');
      }
    } catch (frankfurterError) {
      console.warn('Frankfurter API error:', frankfurterError.message);
      
      try {
        // Fallback to ExchangeRate-API (free tier)
        const fallbackResponse = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('ExchangeRate-API data:', fallbackData);
          
          if (fallbackData.rates && fallbackData.rates.SAR) {
            eurToSar = fallbackData.rates.SAR;
            console.log('Using ExchangeRate-API rate:', eurToSar);
          }
        } else {
          console.warn('ExchangeRate-API also failed, using fallback value');
        }
      } catch (fallbackError) {
        console.warn('All exchange APIs failed, using fallback value:', eurToSar);
      }
    }

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