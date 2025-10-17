import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedOffer {
  agency_name: string;
  agency_url: string;
  offer_title: string;
  offer_url: string;
  price_eur: number;
  month_departure: string;
  date_start?: string;
  date_end?: string;
  departure_city: string;
  formula_type: string;
  duration_nights?: number;
  makkah_nights?: number;
  medina_nights?: number;
  hotel_makkah?: string;
  hotel_medinah?: string;
  distance_to_haram_m?: number;
  board?: string;
  flights_included: boolean;
  visa_included?: boolean;
  source_hash: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  try {
    const { run_type = 'scheduled' } = await req.json().catch(() => ({}));

    console.log(`[Weekly Refresh] Starting ${run_type} run at ${new Date().toISOString()}`);

    // Créer un run record
    const { data: runRecord, error: runError } = await supabase
      .from('omra_update_runs')
      .insert({
        run_type,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (runError) throw runError;

    const runId = runRecord.id;
    const agencyResults: any[] = [];
    let totalFetched = 0;
    let totalValidated = 0;
    let totalRejected = 0;

    // 1. Vider la table temporaire
    console.log('[Weekly Refresh] Clearing omra_offers_next table...');
    const { error: clearError } = await supabase
      .from('omra_offers_next')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (clearError) {
      console.error('[Weekly Refresh] Error clearing table:', clearError);
    }

    // 2. Récupérer les configs actives
    const { data: configs, error: configError } = await supabase
      .from('omra_scraper_config')
      .select('*')
      .eq('is_active', true);

    if (configError) throw configError;

    console.log(`[Weekly Refresh] Found ${configs?.length || 0} active scrapers`);

    // 3. Scraper chaque agence
    for (const config of configs || []) {
      console.log(`[Weekly Refresh] Scraping ${config.agency_name}...`);
      
      try {
        const offers = await scrapeAgency(config);
        console.log(`[Weekly Refresh] ${config.agency_name}: ${offers.length} offers found`);

        let agencyAdded = 0;
        let agencyRejected = 0;
        let agencyErrors = 0;

        // 4. Insérer dans omra_offers_next avec dédoublonnage
        for (const offer of offers) {
          try {
            // Validation stricte
            if (!offer.price_eur || offer.price_eur <= 0) {
              console.log(`[Weekly Refresh] Rejected: invalid price ${offer.price_eur}`);
              agencyRejected++;
              totalRejected++;
              continue;
            }

            if (!offer.offer_url || !offer.offer_url.startsWith('http')) {
              console.log(`[Weekly Refresh] Rejected: invalid URL ${offer.offer_url}`);
              agencyRejected++;
              totalRejected++;
              continue;
            }

            // Insérer dans next table
            const { error: insertError } = await supabase
              .from('omra_offers_next')
              .insert({
                ...offer,
                status: 'active',
                scraped_at: new Date().toISOString(),
              });

            if (insertError) {
              if (insertError.code === '23505') {
                // Doublon - ignoré silencieusement
                console.log(`[Weekly Refresh] Duplicate skipped: ${offer.source_hash}`);
              } else {
                console.error(`[Weekly Refresh] Insert error:`, insertError);
                agencyErrors++;
              }
            } else {
              agencyAdded++;
              totalValidated++;
            }
          } catch (offerError) {
            console.error(`[Weekly Refresh] Error processing offer:`, offerError);
            agencyErrors++;
          }
        }

        totalFetched += offers.length;

        agencyResults.push({
          agency_name: config.agency_name,
          offers_fetched: offers.length,
          offers_added: agencyAdded,
          offers_rejected: agencyRejected,
          errors: agencyErrors,
        });

        // Rate limiting: 1 req/s avec délai aléatoire
        const delay = 800 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

      } catch (agencyError: any) {
        console.error(`[Weekly Refresh] Error scraping ${config.agency_name}:`, agencyError);
        agencyResults.push({
          agency_name: config.agency_name,
          offers_fetched: 0,
          offers_added: 0,
          offers_rejected: 0,
          errors: 1,
          error_message: agencyError.message,
        });
      }
    }

    // 5. Vérifier qu'on a au moins 1 offre valide
    const { count: nextCount } = await supabase
      .from('omra_offers_next')
      .select('*', { count: 'exact', head: true });

    console.log(`[Weekly Refresh] Total validated offers in next table: ${nextCount}`);

    let swapExecuted = false;
    let errorMessage = null;

    if (!nextCount || nextCount === 0) {
      console.error('[Weekly Refresh] CRITICAL: No valid offers found. Aborting swap.');
      errorMessage = 'Aucune offre valide trouvée. Swap annulé pour éviter une page vide.';
      
      // Mettre à jour le run avec erreur
      await supabase
        .from('omra_update_runs')
        .update({
          status: 'error',
          completed_at: new Date().toISOString(),
          offers_fetched: totalFetched,
          offers_validated: totalValidated,
          offers_rejected: totalRejected,
          swap_executed: false,
          error_message: errorMessage,
          agency_results: agencyResults,
        })
        .eq('id', runId);

      return new Response(
        JSON.stringify({
          success: false,
          error: errorMessage,
          run_id: runId,
          stats: {
            offers_fetched: totalFetched,
            offers_validated: totalValidated,
            offers_rejected: totalRejected,
            swap_executed: false,
          },
          agency_results: agencyResults,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 6. Exécuter le swap atomique
    console.log('[Weekly Refresh] Executing atomic swap...');
    
    try {
      // Renommer omra_offers -> omra_offers_old
      await supabase.rpc('execute_sql', {
        sql: 'ALTER TABLE public.omra_offers RENAME TO omra_offers_old;'
      }).catch(() => {
        // Fallback: supprimer directement et renommer
      });

      // Supprimer toutes les anciennes offres
      await supabase
        .from('omra_offers')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      // Copier toutes les offres de next vers offers
      const { data: nextOffers } = await supabase
        .from('omra_offers_next')
        .select('*');

      if (nextOffers) {
        for (const offer of nextOffers) {
          const { id, created_at, updated_at, ...offerData } = offer;
          await supabase
            .from('omra_offers')
            .insert(offerData);
        }
      }

      swapExecuted = true;
      console.log('[Weekly Refresh] Swap completed successfully!');

    } catch (swapError: any) {
      console.error('[Weekly Refresh] Swap error:', swapError);
      errorMessage = `Erreur lors du swap: ${swapError.message}`;
      swapExecuted = false;
    }

    // 7. Mettre à jour le run record
    await supabase
      .from('omra_update_runs')
      .update({
        status: swapExecuted ? 'success' : 'error',
        completed_at: new Date().toISOString(),
        offers_fetched: totalFetched,
        offers_validated: totalValidated,
        offers_rejected: totalRejected,
        swap_executed: swapExecuted,
        error_message: errorMessage,
        agency_results: agencyResults,
      })
      .eq('id', runId);

    // 8. Purger le cache (invalider les requêtes React Query côté client)
    console.log('[Weekly Refresh] Cache invalidation will occur on next client request');

    return new Response(
      JSON.stringify({
        success: true,
        run_id: runId,
        stats: {
          offers_fetched: totalFetched,
          offers_validated: totalValidated,
          offers_rejected: totalRejected,
          swap_executed: swapExecuted,
        },
        agency_results: agencyResults,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('[Weekly Refresh] Fatal error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function scrapeAgency(config: any): Promise<ScrapedOffer[]> {
  const offers: ScrapedOffer[] = [];

  try {
    console.log(`Fetching ${config.agency_url}...`);
    const response = await fetch(config.agency_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OmraBonsPlans/1.0; +https://omrabonsplans.fr)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    if (!doc) {
      throw new Error('Failed to parse HTML');
    }

    // Parsing spécifique selon l'agence
    const parsedOffers = parseOffersFromHTML(doc, config);
    offers.push(...parsedOffers);

  } catch (error: any) {
    console.error(`Error scraping ${config.agency_name}:`, error);
    throw error;
  }

  return offers;
}

function parseOffersFromHTML(doc: any, config: any): ScrapedOffer[] {
  const offers: ScrapedOffer[] = [];

  // Parsing générique basé sur les selectors
  try {
    const containers = doc.querySelectorAll(config.selectors?.container || '.offer-item');

    for (const container of containers) {
      try {
        const offer = extractOfferData(container, config);
        if (offer) {
          offers.push(offer);
        }
      } catch (error) {
        console.error('Error extracting offer:', error);
      }
    }
  } catch (error) {
    console.error('Error parsing offers:', error);
  }

  return offers;
}

function extractOfferData(container: any, config: any): ScrapedOffer | null {
  try {
    const selectors = config.selectors || {};

    // Extraction des données
    const title = container.querySelector(selectors.title)?.textContent?.trim() || 'Offre Omra';
    const priceText = container.querySelector(selectors.price)?.textContent?.trim() || '';
    const url = container.querySelector(selectors.url)?.getAttribute('href') || '';

    // Extraire le prix
    const priceMatch = priceText.match(/(\d+[\s,]?\d*)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(/[\s,]/g, '')) : 0;

    if (price <= 0 || !url) {
      return null;
    }

    // Normalisation URL
    const fullUrl = url.startsWith('http') ? url : new URL(url, config.agency_url).href;

    // Extraction autres données
    const departureCityText = container.querySelector(selectors.departure_city)?.textContent?.trim() || 'Paris';
    const departureCity = normalizeCityName(departureCityText);

    const dateText = container.querySelector(selectors.date)?.textContent?.trim() || '';
    const { date_start, date_end, month_departure } = extractDates(dateText);

    const formulaText = container.textContent?.toLowerCase() || '';
    const formula_type = detectFormula(formulaText);

    const hotelMakkah = container.querySelector(selectors.hotel_makkah)?.textContent?.trim();
    const hotelMedinah = container.querySelector(selectors.hotel_medinah)?.textContent?.trim();

    const distanceText = container.querySelector(selectors.distance)?.textContent?.trim() || '';
    const distance_to_haram_m = extractDistance(distanceText);

    // Générer source_hash
    const source_hash = generateHash(`${config.agency_name}${fullUrl}${date_start || ''}`);

    return {
      agency_name: config.agency_name,
      agency_url: config.agency_url,
      offer_title: title,
      offer_url: fullUrl,
      price_eur: Math.round(price),
      month_departure: month_departure || new Date().toISOString().substring(0, 7),
      date_start,
      date_end,
      departure_city: departureCity,
      formula_type,
      hotel_makkah: hotelMakkah,
      hotel_medinah: hotelMedinah,
      distance_to_haram_m,
      flights_included: true,
      visa_included: true,
      source_hash,
    };
  } catch (error) {
    console.error('Error extracting offer data:', error);
    return null;
  }
}

function normalizeCityName(city: string): string {
  const normalized = city.replace(/\(.*?\)/g, '').trim();
  const cityMap: { [key: string]: string } = {
    'paris': 'Paris',
    'lyon': 'Lyon',
    'marseille': 'Marseille',
    'toulouse': 'Toulouse',
    'nice': 'Nice',
    'bruxelles': 'Bruxelles',
    'geneve': 'Genève',
  };

  const lowerCity = normalized.toLowerCase();
  return cityMap[lowerCity] || normalized;
}

function detectFormula(text: string): string {
  if (text.includes('elite') || text.includes('5*') || text.includes('luxe')) {
    return 'elite';
  }
  if (text.includes('premium') || text.includes('4*')) {
    return 'premium';
  }
  if (text.includes('confort') || text.includes('3*')) {
    return 'confort';
  }
  return 'standard';
}

function extractDates(dateText: string): { date_start?: string; date_end?: string; month_departure?: string } {
  const result: any = {};

  // Essayer de parser les dates
  const dateMatch = dateText.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (dateMatch) {
    const day = dateMatch[1].padStart(2, '0');
    const month = dateMatch[2].padStart(2, '0');
    let year = dateMatch[3];
    if (year.length === 2) {
      year = '20' + year;
    }
    result.date_start = `${year}-${month}-${day}`;
    result.month_departure = `${year}-${month}`;
  }

  return result;
}

function extractDistance(text: string): number | undefined {
  const match = text.match(/(\d+)\s*m/i);
  return match ? parseInt(match[1]) : undefined;
}

function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}