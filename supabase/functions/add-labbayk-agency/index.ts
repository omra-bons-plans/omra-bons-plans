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

    // Ajouter l'agence Labbayk
    const { data, error } = await supabase
      .from('agencies')
      .insert({
        name: 'Labbayk',
        google_rating: 4.9,
        review_count: 172,
        url: 'https://www.labbayk.fr/',
        highlight: 'Agence parisienne d\'excellence avec note exceptionnelle 4.9/5 et forte dimension spirituelle',
        price_range: 'Standard',
        specialties: ['Omra guidée spirituelle', 'Hajj', 'Voyages émotionnels', 'Accompagnement personnalisé'],
        strengths: [
          'Note exceptionnelle de 4.9/5 sur Google',
          'Voyages spirituels enrichissants avec temps libre',
          'Excellent accompagnement et organisation',
          'Groupes à taille humaine pour une ambiance conviviale',
          'Équipe à l\'écoute et professionnelle',
          'Expériences mémorables avec forte dimension spirituelle'
        ],
        weaknesses: [
          'Agence basée uniquement à Paris (17 Rue le Bua, 75020)',
          'Pas de présence en province',
          'Moins connue que les grandes agences établies'
        ],
        google_search_url: 'https://maps.app.goo.gl/ZhnCgS2mnqaLrjeo7',
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
