import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { requireAdmin } from '../_shared/auth.ts';

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

  const authError = await requireAdmin(req);
  if (authError) return authError;

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
        console.log(`[update-agency-reviews] First 500 chars for ${agency.name}:`, content.substring(0, 500));

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
        
        // Recherche du nombre d'avis avec stratégie améliorée
        // Pattern principal: chercher le format Google standard proche de la note
        // Format Google typique: "4,9 ★ (1 354)" ou "4.9★ (1354 avis)" 
        
        // Stratégie 1: Chercher spécifiquement après une étoile avec parenthèses
        const starParenPattern = /[★⭐][\s\u00A0]*\([\s\u00A0]*([0-9]{1,2}[\s\u00A0]*[0-9]{3}(?:[\s\u00A0]*[0-9]{3})?)[\s\u00A0]*(?:avis)?\)/gi;
        const starParenMatches = Array.from(content.matchAll(starParenPattern));
        
        const reviewCandidates: number[] = [];
        
        for (const match of starParenMatches) {
          const cleanNum = match[1].replace(/[\s\u00A0,.]/g, '');
          const num = parseInt(cleanNum, 10);
          if (!isNaN(num) && num >= 10 && num <= 50000) {
            reviewCandidates.push(num);
            console.log(`[update-agency-reviews] Star-paren pattern found for ${agency.name}:`, num);
          }
        }
        
        // Stratégie 2: Chercher le mot "avis" avec un nombre juste avant
        if (reviewCandidates.length === 0) {
          const avisPattern = /([0-9]{1,2}[\s\u00A0]*[0-9]{3}(?:[\s\u00A0]*[0-9]{3})?)[\s\u00A0]+avis/gi;
          const avisMatches = Array.from(content.matchAll(avisPattern));
          
          for (const match of avisMatches) {
            const cleanNum = match[1].replace(/[\s\u00A0,.]/g, '');
            const num = parseInt(cleanNum, 10);
            if (!isNaN(num) && num >= 10 && num <= 50000) {
              reviewCandidates.push(num);
              console.log(`[update-agency-reviews] Avis pattern found for ${agency.name}:`, num);
            }
          }
        }
        
        // Stratégie 3: Chercher dans les 100 premiers caractères après l'étoile
        if (reviewCandidates.length === 0) {
          const starIndex = content.search(/[★⭐]/);
          if (starIndex !== -1) {
            const afterStar = content.substring(starIndex, starIndex + 100);
            const numberPattern = /\(?\s*([0-9]{1,2}[\s\u00A0]*[0-9]{3}(?:[\s\u00A0]*[0-9]{3})?)\s*\)?/g;
            const numberMatches = Array.from(afterStar.matchAll(numberPattern));
            
            for (const match of numberMatches) {
              const cleanNum = match[1].replace(/[\s\u00A0,.]/g, '');
              const num = parseInt(cleanNum, 10);
              if (!isNaN(num) && num >= 10 && num <= 50000) {
                reviewCandidates.push(num);
                console.log(`[update-agency-reviews] Near-star pattern found for ${agency.name}:`, num);
              }
            }
          }
        }
        
        // Prendre le nombre le plus petit (probablement le plus précis)
        // Les grands nombres comme 20000 sont souvent des limites d'affichage
        if (reviewCandidates.length > 0) {
          // Filtrer les nombres suspects (multiples de 10000)
          const validCandidates = reviewCandidates.filter(n => n % 10000 !== 0 || n < 10000);
          
          if (validCandidates.length > 0) {
            // Prendre le premier trouvé (généralement le plus proche de la note)
            newReviewCount = validCandidates[0];
            console.log(`[update-agency-reviews] Selected review count for ${agency.name}:`, newReviewCount, 'from candidates:', validCandidates);
          } else {
            // Si tous sont suspects, prendre le plus petit
            newReviewCount = Math.min(...reviewCandidates);
            console.log(`[update-agency-reviews] Selected minimum for ${agency.name}:`, newReviewCount);
          }
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
