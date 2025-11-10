import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ajouter l'agence Labbayk
    const { data, error } = await supabase
      .from('agencies')
      .insert({
        name: 'Labbayk',
        google_rating: 4.5,
        review_count: 0,
        url: 'https://labbayk.fr/',
        highlight: 'Agence spécialisée dans l\'organisation de voyages Omra et Hajj',
        price_range: 'Standard',
        specialties: ['Omra', 'Hajj', 'Voyages spirituels'],
        strengths: ['Service de qualité', 'Accompagnement personnalisé'],
        weaknesses: [],
        google_search_url: 'https://www.google.com/search?q=labbayk+omra',
        last_review_update: new Date().toISOString()
      })
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Labbayk agency added successfully',
        data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
