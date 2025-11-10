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

    // Corrections manuelles des agences bloquées par CAPTCHA
    const updates = [
      { name: 'Pèlerin Hajj', review_count: 1354 },
      { name: 'TAWAF', review_count: 1289 },
      { name: 'Al Bayt', review_count: 959 },
      { name: 'Omra Pour Tous', review_count: 4822 },
    ];

    const results = [];
    
    for (const update of updates) {
      const { data, error } = await supabase
        .from('agencies')
        .update({
          review_count: update.review_count,
          last_review_update: new Date().toISOString()
        })
        .eq('name', update.name)
        .select();

      if (error) {
        console.error(`Error updating ${update.name}:`, error);
      } else {
        console.log(`Updated ${update.name} to ${update.review_count} reviews`);
        results.push(data);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Agencies updated successfully',
        results
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
