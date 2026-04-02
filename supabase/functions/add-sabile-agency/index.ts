import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { requireAdmin } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ajouter l'agence Sabile Voyages
    const { data, error } = await supabase
      .from('agencies')
      .insert({
        name: 'Sabile Voyages',
        google_rating: 4.5,
        review_count: 147,
        url: 'https://sabilevoyages.com/',
        highlight: 'Agence spécialisée dans l\'organisation de voyages spirituels',
        price_range: 'Standard',
        specialties: ['Omra guidée', 'Hajj', 'Voyages spirituels'],
        strengths: ['Service personnalisé', 'Accompagnement spirituel', 'Prix compétitifs'],
        weaknesses: ['Agence récente', 'Moins d\'avis que les grandes agences'],
        google_search_url: 'https://www.google.com/search?q=sabile+voyages',
        last_review_update: new Date().toISOString()
      })
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sabile Voyages agency added successfully',
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
