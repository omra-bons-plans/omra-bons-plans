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
    
    const accuWeatherApiKey = Deno.env.get('ACCUWEATHER_API_KEY');
    if (!accuWeatherApiKey) {
      console.error('ACCUWEATHER_API_KEY not found in environment');
      throw new Error('AccuWeather API key not configured');
    }
    
    // AccuWeather location keys for Makkah and Madinah
    const cities = {
      makkah: { locationKey: "212667", name: "Makkah" },
      madinah: { locationKey: "215074", name: "Madinah" }
    };

    console.log('Fetching weather data using AccuWeather API...');
    
    // Fetch weather data for both cities using AccuWeather API
    const weatherPromises = Object.entries(cities).map(async ([city, cityData]) => {
      console.log(`Fetching weather for ${cityData.name}...`);
      
      // AccuWeather current conditions endpoint
      const cacheBuster = Date.now();
      const weatherResponse = await fetch(
        `https://dataservice.accuweather.com/currentconditions/v1/${cityData.locationKey}?apikey=${accuWeatherApiKey}&details=true&_=${cacheBuster}`
      );
      
      if (!weatherResponse.ok) {
        console.error(`AccuWeather API error for ${city}:`, weatherResponse.status, weatherResponse.statusText);
        throw new Error(`AccuWeather API error for ${city}: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();
      console.log(`Weather data for ${city}:`, JSON.stringify(weatherData, null, 2));
      
      if (!weatherData || !Array.isArray(weatherData) || weatherData.length === 0) {
        console.error(`Invalid weather data for ${city}:`, weatherData);
        throw new Error(`Invalid weather data received for ${city}`);
      }
      
      const currentWeather = weatherData[0];
      const temperature = Math.round(currentWeather.Temperature.Metric.Value);
      console.log(`🌡️ Exact temperature for ${cityData.name}: ${currentWeather.Temperature.Metric.Value}°C (rounded: ${temperature}°C)`);
      console.log(`📍 Location confirmed: ${cityData.name}, Saudi Arabia`);
      console.log(`🕐 Data timestamp: ${currentWeather.LocalObservationDateTime}`);
      
      return {
        city,
        temperature,
        description: currentWeather.WeatherText || 'Sunny',
        icon: currentWeather.WeatherIcon?.toString().padStart(2, '0') || '01',
        humidity: currentWeather.RelativeHumidity || null,
        windSpeed: currentWeather.Wind?.Speed?.Metric?.Value || null,
        tempMax: null, // AccuWeather current endpoint doesn't provide daily min/max
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