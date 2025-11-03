import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let city: string | null = null;
    
    // Essayer d'obtenir la ville depuis le body (POST) ou query params (GET)
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        city = body.city;
      } catch (e) {
        console.log('No JSON body, trying query params');
      }
    }
    
    // Si pas de ville dans le body, essayer les query params
    if (!city) {
      const url = new URL(req.url);
      city = url.searchParams.get('city');
    }
    
    if (!city) {
      return new Response(
        JSON.stringify({ error: 'City parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Fetching prayer times for city: ${city}`);

    // Call Aladhan API
    const aladhanUrl = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=3`;
    const response = await fetch(aladhanUrl);
    
    if (!response.ok) {
      console.error(`Aladhan API error: ${response.status}`);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch prayer times from Aladhan API' }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    
    console.log(`Successfully fetched prayer times for ${city}`);

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in prayer-times function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
