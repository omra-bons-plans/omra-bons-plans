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

        // Extraire la note et le nombre d'avis avec regex améliorées
        // Format Google: "4,9★" ou "4.9★" suivi de "(1 289)" ou "(1289)" ou "1 289 avis"
        
        let newRating = agency.google_rating;
        let newReviewCount = agency.review_count;
        
        // Recherche de la note avec pattern plus flexible
        // Chercher un nombre décimal (avec virgule ou point) suivi d'une étoile
        const ratingPatterns = [
          /([0-9])[,.]([0-9])[\s]*[★⭐]/g,  // Format: 4,9★ ou 4.9★
          /([0-9])[\s]*[★⭐]/g,              // Format: 5★
        ];
        
        for (const pattern of ratingPatterns) {
          const matches = Array.from(content.matchAll(pattern));
          if (matches.length > 0) {
            const match = matches[0];
            if (match.length > 2 && match[2]) {
              // Note décimale trouvée
              newRating = parseFloat(`${match[1]}.${match[2]}`);
            } else {
              // Note entière trouvée
              newRating = parseFloat(match[1]);
            }
            console.log(`[update-agency-reviews] Found rating for ${agency.name}:`, newRating);
            break;
          }
        }
        
        // Recherche du nombre d'avis avec plusieurs stratégies
        // Stratégie 1: Chercher tous les nombres de 2+ chiffres dans le texte
        const allNumbers = content.matchAll(/([0-9]{1}[\s\u00A0]*[0-9]{3}[\s\u00A0]*[0-9]{0,3}|[0-9]{3,})/g);
        const foundNumbers: number[] = [];
        
        for (const match of allNumbers) {
          // Nettoyer: supprimer espaces et espaces insécables
          const cleanNum = match[1].replace(/[\s\u00A0,.]/g, '');
          const num = parseInt(cleanNum, 10);
          if (!isNaN(num) && num >= 10 && num <= 50000) {
            // Plage réaliste pour nombre d'avis
            foundNumbers.push(num);
          }
        }
        
        // Stratégie 2: Chercher spécifiquement près d'une étoile ou du mot "avis"
        const contextPatterns = [
          /([0-9]{1}[\s\u00A0]*[0-9]{3}[\s\u00A0]*[0-9]{0,3})[\s\u00A0]*avis/gi,
          /\([\s\u00A0]*([0-9]{1}[\s\u00A0]*[0-9]{3}[\s\u00A0]*[0-9]{0,3})[\s\u00A0]*\)/g,
          /[★⭐][\s\u00A0]*\(?([0-9]{1}[\s\u00A0]*[0-9]{3}[\s\u00A0]*[0-9]{0,3})\)?/g,
        ];
        
        const contextNumbers: number[] = [];
        for (const pattern of contextPatterns) {
          const matches = Array.from(content.matchAll(pattern));
          for (const match of matches) {
            const cleanNum = match[1].replace(/[\s\u00A0,.]/g, '');
            const num = parseInt(cleanNum, 10);
            if (!isNaN(num) && num >= 10 && num <= 50000) {
              contextNumbers.push(num);
            }
          }
        }
        
        // Prioriser les nombres trouvés dans un contexte, sinon prendre le plus grand
        if (contextNumbers.length > 0) {
          newReviewCount = Math.max(...contextNumbers);
          console.log(`[update-agency-reviews] Found reviews (context) for ${agency.name}:`, newReviewCount);
        } else if (foundNumbers.length > 0) {
          newReviewCount = Math.max(...foundNumbers);
          console.log(`[update-agency-reviews] Found reviews (general) for ${agency.name}:`, newReviewCount);
        } else {
          console.log(`[update-agency-reviews] No reviews found for ${agency.name}`);
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
