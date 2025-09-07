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
    
    // More precise coordinates for Makkah and Madinah (near the mosques)
    const cities = {
      makkah: { lat: 21.422487, lon: 39.826206, name: "Makkah" },
      madinah: { lat: 24.468661, lon: 39.611146, name: "Madinah" }
    };

    console.log('Fetching weather data using WeatherAPI.com...');
    
    // Fetch weather data for both cities using WeatherAPI.com
    const weatherPromises = Object.entries(cities).map(async ([city, coords]) => {
      console.log(`Fetching weather for ${coords.name}...`);
      
      // Add cache-busting parameter and try forecast endpoint for more recent data
      const cacheBuster = Date.now();
      let weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${coords.lat},${coords.lon}&aqi=no&cb=${cacheBuster}`
      );
      
      // If current data is too old (more than 30 minutes), try forecast endpoint
      if (weatherResponse.ok) {
        const preliminaryData = await weatherResponse.json();
        const lastUpdated = new Date(preliminaryData.current.last_updated_epoch * 1000);
        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
        
        if (lastUpdated < thirtyMinutesAgo) {
          console.log(`⚠️ Current data for ${city} is ${Math.round((now.getTime() - lastUpdated.getTime()) / 1000 / 60)} minutes old, trying forecast...`);
          weatherResponse = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${coords.lat},${coords.lon}&days=1&aqi=no&cb=${cacheBuster}`
          );
        } else {
          // Use the already fetched data
          weatherResponse = new Response(JSON.stringify(preliminaryData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      if (!weatherResponse.ok) {
        console.error(`Weather API error for ${city}:`, weatherResponse.status, weatherResponse.statusText);
        throw new Error(`Weather API error for ${city}: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();
      console.log(`Weather data for ${city}:`, JSON.stringify(weatherData, null, 2));
      
      // Handle both current and forecast endpoints
      let currentWeather;
      if (weatherData.current) {
        currentWeather = weatherData.current;
      } else if (weatherData.forecast && weatherData.forecast.forecastday[0]?.hour) {
        // Use the most recent hour from forecast
        const currentHour = new Date().getHours();
        currentWeather = weatherData.forecast.forecastday[0].hour[currentHour] || weatherData.forecast.forecastday[0].hour[weatherData.forecast.forecastday[0].hour.length - 1];
        console.log(`📈 Using forecast data for ${city} at hour ${currentHour}`);
      } else {
        console.error(`Invalid weather data for ${city}:`, weatherData);
        throw new Error(`Invalid weather data received for ${city}`);
      }
      
      const temperature = Math.round(currentWeather.temp_c);
      console.log(`🌡️ Exact temperature for ${coords.name}: ${currentWeather.temp_c}°C (rounded: ${temperature}°C)`);
      console.log(`📍 Location confirmed: ${weatherData.location.name}, ${weatherData.location.country}`);
      console.log(`🕐 Data timestamp: ${currentWeather.last_updated || 'forecast data'}`);
      
      return {
        city,
        temperature,
        description: currentWeather.condition.text,
        icon: currentWeather.condition.icon.split('/').pop()?.replace('.png', '') || '01d',
        humidity: currentWeather.humidity,
        windSpeed: currentWeather.wind_kph,
        tempMax: null, // WeatherAPI current endpoint doesn't provide daily min/max
        tempMin: null
      };
    });

    console.log('Fetching exchange rate using ExchangeRate.host API...');
    
    const exchangeApiKey = Deno.env.get('EXCHANGERATE_HOST_KEY');
    let eurToSar = 3.95; // Fallback value
    
    try {
      if (!exchangeApiKey) {
        console.warn('EXCHANGERATE_HOST_KEY not found, using fallback APIs');
        throw new Error('ExchangeRate.host API key not configured');
      }
      
      // Use ExchangeRate.host API with API key
      const exchangeResponse = await fetch(
        `https://api.exchangerate.host/latest?access_key=${exchangeApiKey}&base=EUR&symbols=SAR`
      );
      
      if (exchangeResponse.ok) {
        const exchangeData = await exchangeResponse.json();
        console.log('ExchangeRate.host API data:', exchangeData);
        
        if (exchangeData.success && exchangeData.rates && exchangeData.rates.SAR) {
          eurToSar = exchangeData.rates.SAR;
          console.log('Using ExchangeRate.host rate:', eurToSar);
        } else {
          console.warn('Invalid response from ExchangeRate.host, trying fallback');
          throw new Error('Invalid response from ExchangeRate.host');
        }
      } else {
        console.warn('ExchangeRate.host API failed:', exchangeResponse.status, exchangeResponse.statusText);
        throw new Error('ExchangeRate.host API failed');
      }
    } catch (exchangeHostError) {
      console.warn('ExchangeRate.host API error:', exchangeHostError.message);
      
      try {
        // Fallback to Frankfurter API (European Central Bank data, completely free)
        const exchangeResponse = await fetch('https://api.frankfurter.app/latest?from=EUR&to=SAR');
        
        if (exchangeResponse.ok) {
          const exchangeData = await exchangeResponse.json();
          console.log('Frankfurter fallback exchange data:', exchangeData);
          
          if (exchangeData.rates && exchangeData.rates.SAR) {
            eurToSar = exchangeData.rates.SAR;
            console.log('Using Frankfurter fallback rate:', eurToSar);
          }
        } else {
          console.warn('Frankfurter fallback API failed:', exchangeResponse.status, exchangeResponse.statusText);
          throw new Error('Frankfurter fallback API failed');
        }
      } catch (frankfurterError) {
        console.warn('Frankfurter fallback API error:', frankfurterError.message);
        
        try {
          // Final fallback to ExchangeRate-API (free tier)
          const fallbackResponse = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('ExchangeRate-API final fallback data:', fallbackData);
            
            if (fallbackData.rates && fallbackData.rates.SAR) {
              eurToSar = fallbackData.rates.SAR;
              console.log('Using ExchangeRate-API final fallback rate:', eurToSar);
            }
          } else {
            console.warn('All exchange APIs failed, using hardcoded fallback value');
          }
        } catch (finalError) {
          console.warn('All exchange APIs failed, using hardcoded fallback value:', eurToSar);
        }
      }
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