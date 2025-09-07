import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Airline {
  icao: string;
  iata: string;
  name: string;
  country: string;
  fleet_average_age?: number;
  fleet_size?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('API_NINJAS_KEY');
    if (!apiKey) {
      throw new Error('API_NINJAS_KEY not configured');
    }

    const { query = '', popular_only = false } = await req.json();

    console.log(`Searching airlines for query: "${query}", popular_only: ${popular_only}`);

    // Compagnies populaires pour les vols France-Arabie Saoudite
    const popularAirlines = [
      'Air France', 'Saudia', 'Emirates', 'Qatar Airways', 
      'Turkish Airlines', 'Lufthansa', 'KLM', 'British Airways',
      'Etihad Airways', 'Royal Jordanian', 'EgyptAir',
      'Transavia', 'Wizz Air', 'Ajet'
    ];

    let allAirlines: Airline[] = [];

    if (popular_only) {
      // Recherche uniquement les compagnies populaires
      for (const popularName of popularAirlines) {
        if (query === '' || popularName.toLowerCase().includes(query.toLowerCase())) {
          try {
            console.log(`Fetching data for ${popularName}...`);
            const response = await fetch(`https://api.api-ninjas.com/v1/airlines?name=${encodeURIComponent(popularName)}`, {
              headers: {
                'X-Api-Key': apiKey
              }
            });

            if (response.ok) {
              const data = await response.json();
              if (Array.isArray(data) && data.length > 0) {
                allAirlines.push(...data);
                console.log(`Found ${data.length} results for ${popularName}`);
              }
            } else {
              console.warn(`API call failed for ${popularName}: ${response.status} ${response.statusText}`);
            }
          } catch (err) {
            console.error(`Error fetching ${popularName}:`, err);
          }
        }
      }
    } else {
      // Recherche générale
      try {
        console.log(`Making general search for: "${query}"`);
        const response = await fetch(`https://api.api-ninjas.com/v1/airlines?name=${encodeURIComponent(query)}`, {
          headers: {
            'X-Api-Key': apiKey
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            allAirlines.push(...data);
            console.log(`Found ${data.length} results for general search`);
          }
        } else {
          console.warn(`API call failed for general search: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.error('Error in general search:', err);
      }
    }

    // Fallback avec liste statique si aucun résultat
    if (allAirlines.length === 0) {
      console.log('No API results, using static fallback');
      const staticAirlines = [
        { icao: 'AFR', iata: 'AF', name: 'Air France', country: 'France' },
        { icao: 'SVA', iata: 'SV', name: 'Saudia', country: 'Saudi Arabia' },
        { icao: 'UAE', iata: 'EK', name: 'Emirates', country: 'United Arab Emirates' },
        { icao: 'QTR', iata: 'QR', name: 'Qatar Airways', country: 'Qatar' },
        { icao: 'THY', iata: 'TK', name: 'Turkish Airlines', country: 'Turkey' },
        { icao: 'DLH', iata: 'LH', name: 'Lufthansa', country: 'Germany' },
        { icao: 'KLM', iata: 'KL', name: 'KLM Royal Dutch Airlines', country: 'Netherlands' },
        { icao: 'BAW', iata: 'BA', name: 'British Airways', country: 'United Kingdom' },
        { icao: 'ETD', iata: 'EY', name: 'Etihad Airways', country: 'United Arab Emirates' },
        { icao: 'RJA', iata: 'RJ', name: 'Royal Jordanian', country: 'Jordan' },
        { icao: 'MSR', iata: 'MS', name: 'EgyptAir', country: 'Egypt' },
        { icao: 'TRA', iata: 'HV', name: 'Transavia', country: 'Netherlands' },
        { icao: 'WZZ', iata: 'W6', name: 'Wizz Air', country: 'Hungary' },
        { icao: 'VJT', iata: 'VF', name: 'Ajet', country: 'Turkey' }
      ];

      allAirlines = staticAirlines.filter(airline =>
        query === '' ||
        airline.name.toLowerCase().includes(query.toLowerCase()) ||
        airline.iata.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Supprimer les doublons et trier
    const uniqueAirlines = allAirlines.reduce((acc: Airline[], current) => {
      const exists = acc.find(airline => airline.iata === current.iata);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    const sortedAirlines = uniqueAirlines.sort((a, b) => a.name.localeCompare(b.name));

    console.log(`Returning ${sortedAirlines.length} unique airlines`);

    return new Response(JSON.stringify({
      airlines: sortedAirlines,
      total: sortedAirlines.length,
      source: allAirlines.length > 0 ? 'api' : 'static'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in airlines-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      airlines: [],
      total: 0,
      source: 'error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});