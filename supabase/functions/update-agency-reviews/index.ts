import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgencyReviewData {
  agency_name: string;
  google_rating: number;
  review_count: number;
  last_review_update: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[update-agency-reviews] Starting agency reviews update...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');

    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer toutes les agences avec leurs URLs Google
    const { data: agencies, error: fetchError } = await supabase
      .from('agencies')
      .select('id, name, google_search_url, google_rating, review_count')
      .not('google_search_url', 'is', null);

    if (fetchError) {
      console.error('[update-agency-reviews] Error fetching agencies:', fetchError);
      throw fetchError;
    }

    if (!agencies || agencies.length === 0) {
      console.log('[update-agency-reviews] No agencies with Google URLs found');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No agencies to update',
          updated: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[update-agency-reviews] Found ${agencies.length} agencies to update`);

    const results: AgencyReviewData[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Traiter chaque agence
    for (const agency of agencies) {
      try {
        console.log(`[update-agency-reviews] Scraping ${agency.name}...`);

        // Utiliser Firecrawl pour scraper la page Google
        const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${firecrawlApiKey}`,
          },
          body: JSON.stringify({
            url: agency.google_search_url,
            formats: ['markdown'],
            onlyMainContent: false,
          }),
        });

        if (!scrapeResponse.ok) {
          const errorText = await scrapeResponse.text();
          console.error(`[update-agency-reviews] Firecrawl error for ${agency.name}:`, errorText);
          errorCount++;
          continue;
        }

        const scrapeData = await scrapeResponse.json();
        const content = scrapeData.data?.markdown || '';

        console.log(`[update-agency-reviews] Content length for ${agency.name}:`, content.length);

        // Extraire la note et le nombre d'avis avec regex
        // Format Google: "4,9★" ou "4.9★" suivi de "(1 289)" ou "(1289)"
        const ratingMatch = content.match(/([0-9][,.]?[0-9]?)[\s]*[★⭐]/);
        const reviewMatch = content.match(/\([\s]*([0-9\s.]+)[\s]*\)/);

        let newRating = agency.google_rating;
        let newReviewCount = agency.review_count;

        if (ratingMatch) {
          const ratingStr = ratingMatch[1].replace(',', '.');
          newRating = parseFloat(ratingStr);
          console.log(`[update-agency-reviews] Found rating for ${agency.name}:`, newRating);
        }

        if (reviewMatch) {
          const reviewStr = reviewMatch[1].replace(/[\s.]/g, '');
          newReviewCount = parseInt(reviewStr, 10);
          console.log(`[update-agency-reviews] Found reviews for ${agency.name}:`, newReviewCount);
        }

        // Mettre à jour dans la base de données
        const { error: updateError } = await supabase
          .from('agencies')
          .update({
            google_rating: newRating,
            review_count: newReviewCount,
            last_review_update: new Date().toISOString(),
          })
          .eq('id', agency.id);

        if (updateError) {
          console.error(`[update-agency-reviews] Error updating ${agency.name}:`, updateError);
          errorCount++;
        } else {
          console.log(`[update-agency-reviews] Updated ${agency.name}: ${newRating}★ (${newReviewCount} avis)`);
          successCount++;
          results.push({
            agency_name: agency.name,
            google_rating: newRating,
            review_count: newReviewCount,
            last_review_update: new Date().toISOString(),
          });
        }

        // Pause entre les requêtes pour respecter les limites
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`[update-agency-reviews] Error processing ${agency.name}:`, error);
        errorCount++;
      }
    }

    console.log(`[update-agency-reviews] Completed: ${successCount} success, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Updated ${successCount} agencies`,
        updated: successCount,
        errors: errorCount,
        results: results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('[update-agency-reviews] Fatal error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
