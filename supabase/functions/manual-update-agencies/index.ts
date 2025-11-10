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

    // Corrections manuelles des agences
    const updates = [
      { name: 'TAWAF', review_count: 1343, google_rating: null },
      { name: 'Medin Voyages', review_count: 271, google_rating: null },
      { name: 'Al Bayt', review_count: 959, google_rating: null },
      { name: 'Pèlerin Hajj', review_count: 1354, google_rating: null },
      { name: 'Omra Pour Tous', review_count: 5778, google_rating: null },
      { name: 'Al Maqam Voyages', review_count: 392, google_rating: null },
      { name: 'Omra Sounnah', review_count: 309, google_rating: null },
      { name: 'Al Sirate Voyage', review_count: 1114, google_rating: null },
      { name: 'Sabil Voyages', review_count: 147, google_rating: 4.5 },
      { name: 'Gateway Travel', review_count: 19, google_rating: 5.0 },
      { name: 'Omra Discount', review_count: 125, google_rating: null },
      { name: 'Labbayk', review_count: 172, google_rating: 4.9 },
    ];

    const results = [];
    
    for (const update of updates) {
      const updateData: any = {
        review_count: update.review_count,
        last_review_update: new Date().toISOString()
      };
      
      if (update.google_rating !== null) {
        updateData.google_rating = update.google_rating;
      }
      
      const { data, error } = await supabase
        .from('agencies')
        .update(updateData)
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
