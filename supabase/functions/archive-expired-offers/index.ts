import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[archive-expired-offers] Starting execution...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Récupérer toutes les offres actives dont la date de départ est passée
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Début de la journée
    const todayStr = today.toISOString().split('T')[0];

    console.log(`[archive-expired-offers] Checking offers with date_start before ${todayStr}`);

    const { data: expiredOffers, error: fetchError } = await supabase
      .from('omra_offers')
      .select('id, agency_name, offer_title, date_end, date_start')
      .eq('status', 'active')
      .not('date_start', 'is', null)
      .lt('date_start', todayStr);

    if (fetchError) {
      console.error('[archive-expired-offers] Error fetching expired offers:', fetchError);
      throw fetchError;
    }

    console.log(`[archive-expired-offers] Found ${expiredOffers?.length || 0} expired offers`);

    if (!expiredOffers || expiredOffers.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          archived_count: 0,
          message: 'No expired offers to archive',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Marquer les offres comme expirées
    const offerIds = expiredOffers.map(o => o.id);
    
    const { error: updateError } = await supabase
      .from('omra_offers')
      .update({ status: 'expired' })
      .in('id', offerIds);

    if (updateError) {
      console.error('[archive-expired-offers] Error updating offers:', updateError);
      throw updateError;
    }

    console.log(`[archive-expired-offers] Successfully archived ${expiredOffers.length} offers`);
    console.log('[archive-expired-offers] Archived offers:', expiredOffers.map(o => ({
      title: o.offer_title,
      agency: o.agency_name,
      date_start: o.date_start,
      date_end: o.date_end,
    })));

    return new Response(
      JSON.stringify({
        success: true,
        archived_count: expiredOffers.length,
        archived_offers: expiredOffers.map(o => ({
          id: o.id,
          agency: o.agency_name,
          title: o.offer_title,
          date_start: o.date_start,
          date_end: o.date_end,
        })),
        message: `Successfully archived ${expiredOffers.length} expired offer(s)`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('[archive-expired-offers] Fatal error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
