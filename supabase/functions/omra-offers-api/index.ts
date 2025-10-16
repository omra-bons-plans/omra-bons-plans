import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const month = url.searchParams.get('month');
    const priceMin = url.searchParams.get('priceMin');
    const priceMax = url.searchParams.get('priceMax');
    const departure = url.searchParams.get('departure')?.split(',').filter(Boolean);
    const type = url.searchParams.get('type')?.split(',').filter(Boolean);
    const sort = url.searchParams.get('sort') || 'price_asc';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '24');

    // Build query
    let query = supabaseClient
      .from('omra_offers')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    // Apply filters
    if (month) {
      query = query.eq('month_departure', month);
    }
    if (priceMin) {
      query = query.gte('price_eur', parseFloat(priceMin));
    }
    if (priceMax) {
      query = query.lte('price_eur', parseFloat(priceMax));
    }
    if (departure && departure.length > 0) {
      query = query.in('departure_city', departure);
    }
    if (type && type.length > 0) {
      query = query.in('formula_type', type);
    }

    // Apply sorting
    switch (sort) {
      case 'price_desc':
        query = query.order('price_eur', { ascending: false });
        break;
      case 'price_asc':
        query = query.order('price_eur', { ascending: true });
        break;
      case 'duration_desc':
        query = query.order('duration_nights', { ascending: false });
        break;
      case 'duration_asc':
        query = query.order('duration_nights', { ascending: true });
        break;
      case 'distance_asc':
        query = query.order('distance_to_haram_m', { ascending: true, nullsFirst: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('price_eur', { ascending: true });
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    // Get last update time
    const { data: lastUpdate } = await supabaseClient
      .from('omra_offers')
      .select('scraped_at')
      .order('scraped_at', { ascending: false })
      .limit(1)
      .single();

    return new Response(
      JSON.stringify({
        offers: data,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
        lastUpdate: lastUpdate?.scraped_at || null,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=900' },
      }
    );
  } catch (error) {
    console.error('Error fetching offers:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});