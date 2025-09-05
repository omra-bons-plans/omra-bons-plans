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
    console.log('Starting weather and exchange data fetch with free APIs...');
    
    // Coordinates for Makkah and Madinah
    const cities = {
      makkah: { lat: 21.4225, lon: 39.8262, name: "Makkah" },
      madinah: { lat: 24.4686, lon: 39.6142, name: "Madinah" }
    };

    console.log('Fetching weather data using Open-Meteo (free API)...');
    
    // Fetch weather data for both cities using Open-Meteo (completely free)
    const weatherPromises = Object.entries(cities).map(async ([city, coords]) => {
      console.log(`Fetching weather for ${coords.name}...`);
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&timezone=Asia/Riyadh`
      );
      
      if (!weatherResponse.ok) {
        console.error(`Weather API error for ${city}:`, weatherResponse.status, weatherResponse.statusText);
        throw new Error(`Weather API error for ${city}: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();
      console.log(`Weather data for ${city}:`, weatherData);
      
      // Check if weather data is valid
      if (!weatherData.current_weather) {
        console.error(`Invalid weather data for ${city}:`, weatherData);
        throw new Error(`Invalid weather data received for ${city}`);
      }
      
      return {
        city,
        temperature: Math.round(weatherData.current_weather.temperature),
        description: getWeatherDescription(weatherData.current_weather.weathercode),
        icon: getWeatherIcon(weatherData.current_weather.weathercode)
      };
    });

    console.log('Fetching exchange rate using ExchangeRate-API (free tier)...');
    
    // Fetch exchange rate EUR to SAR using free tier
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

// Helper function to convert weather codes to descriptions
function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    0: 'Ciel dégagé',
    1: 'Principalement dégagé',
    2: 'Partiellement nuageux',
    3: 'Couvert',
    45: 'Brouillard',
    48: 'Brouillard givrant',
    51: 'Bruine légère',
    53: 'Bruine modérée',
    55: 'Bruine dense',
    61: 'Pluie légère',
    63: 'Pluie modérée',
    65: 'Pluie forte',
    80: 'Averses légères',
    81: 'Averses modérées',
    82: 'Averses violentes'
  };
  return weatherCodes[code] || 'Conditions météo inconnues';
}

// Helper function to convert weather codes to icons
function getWeatherIcon(code: number): string {
  const iconMap: { [key: number]: string } = {
    0: '01d',    // Clear sky
    1: '02d',    // Mainly clear
    2: '03d',    // Partly cloudy
    3: '04d',    // Overcast
    45: '50d',   // Fog
    48: '50d',   // Depositing rime fog
    51: '09d',   // Light drizzle
    53: '09d',   // Moderate drizzle
    55: '09d',   // Dense drizzle
    61: '10d',   // Light rain
    63: '10d',   // Moderate rain
    65: '10d',   // Heavy rain
    80: '09d',   // Light rain showers
    81: '09d',   // Moderate rain showers
    82: '09d'    // Violent rain showers
  };
  return iconMap[code] || '01d';
}