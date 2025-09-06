import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting cleanup of expired ads...');

    // Supprimer les annonces expirées depuis plus de 7 jours
    const { data: expiredAds, error: selectError } = await supabase
      .from('ads')
      .select('id, title, publish_end_date, user_id')
      .not('publish_end_date', 'is', null)
      .lt('publish_end_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (selectError) {
      console.error('Error selecting expired ads:', selectError);
      throw selectError;
    }

    console.log(`Found ${expiredAds?.length || 0} expired ads to delete`);

    if (expiredAds && expiredAds.length > 0) {
      // Supprimer les détails spécifiques des annonces d'abord (pour éviter les erreurs de contraintes)
      const adIds = expiredAds.map(ad => ad.id);
      
      // Supprimer les détails des différents types d'annonces
      const tablesToCleanup = [
        'ads_sejours', 
        'ads_vols', 
        'ads_hebergements', 
        'ads_guides', 
        'ads_chauffeurs', 
        'ads_babysitting'
      ];

      for (const table of tablesToCleanup) {
        const { error: detailsError } = await supabase
          .from(table)
          .delete()
          .in('ad_id', adIds);

        if (detailsError) {
          console.error(`Error deleting from ${table}:`, detailsError);
          // Continue even if some details deletion fails
        } else {
          console.log(`Cleaned up details from ${table}`);
        }
      }

      // Supprimer les statistiques de clics
      const { error: clickStatsError } = await supabase
        .from('click_stats')
        .delete()
        .in('ad_id', adIds);

      if (clickStatsError) {
        console.error('Error deleting click stats:', clickStatsError);
      } else {
        console.log('Cleaned up click stats');
      }

      // Supprimer les avis
      const { error: reviewsError } = await supabase
        .from('reviews')
        .delete()
        .in('ad_id', adIds);

      if (reviewsError) {
        console.error('Error deleting reviews:', reviewsError);
      } else {
        console.log('Cleaned up reviews');
      }

      // Enfin, supprimer les annonces principales
      const { data: deletedAds, error: deleteError } = await supabase
        .from('ads')
        .delete()
        .in('id', adIds)
        .select('id, title');

      if (deleteError) {
        console.error('Error deleting ads:', deleteError);
        throw deleteError;
      }

      console.log(`Successfully deleted ${deletedAds?.length || 0} expired ads:`, 
        deletedAds?.map(ad => ad.title).join(', '));

      return new Response(JSON.stringify({
        success: true,
        message: `Deleted ${deletedAds?.length || 0} expired ads`,
        deletedAds: deletedAds
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } else {
      console.log('No expired ads to delete');
      return new Response(JSON.stringify({
        success: true,
        message: 'No expired ads to delete',
        deletedAds: []
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

  } catch (error: any) {
    console.error('Error in cleanup-expired-ads function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);