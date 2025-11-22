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

    // Renommer "Pèlerin Hajj" en "Pelerinhajj"
    const { data, error } = await supabase
      .from('agencies')
      .update({ name: 'Pelerinhajj' })
      .eq('name', 'Pèlerin Hajj')
      .select();

    if (error) throw error;

    // Mettre à jour aussi les offres omra qui référencent cette agence
    const { error: offersError } = await supabase
      .from('omra_offers')
      .update({ agency_name: 'Pelerinhajj' })
      .eq('agency_name', 'Pèlerin Hajj');

    if (offersError) {
      console.error('Error updating offers:', offersError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Agency renamed successfully',
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
