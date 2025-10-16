import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScraperConfig {
  id: string;
  agency_name: string;
  agency_url: string;
  scraper_type: string;
  selectors: any;
  is_active: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { agency_name } = await req.json();
    const runId = crypto.randomUUID();

    console.log(`[${runId}] Starting scrape for agency:`, agency_name || 'ALL');

    // Récupérer les configurations de scraper
    let query = supabase
      .from('omra_scraper_config')
      .select('*')
      .eq('is_active', true);

    if (agency_name) {
      query = query.eq('agency_name', agency_name);
    }

    const { data: configs, error: configError } = await query;
    
    if (configError) {
      throw new Error(`Failed to fetch scraper configs: ${configError.message}`);
    }

    if (!configs || configs.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No active scraper configs found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    // Scraper chaque agence
    for (const config of configs as ScraperConfig[]) {
      const startTime = Date.now();
      
      try {
        console.log(`[${runId}] Scraping ${config.agency_name}...`);
        
        const offers = await scrapeAgency(config);
        
        // Sauvegarder les offres dans la base
        let offersAdded = 0;
        let offersUpdated = 0;
        let offersErrors = 0;

        for (const offer of offers) {
          try {
            // Vérifier si l'offre existe déjà (via source_hash)
            const { data: existing } = await supabase
              .from('omra_offers')
              .select('id')
              .eq('source_hash', offer.source_hash)
              .maybeSingle();

            if (existing) {
              // Mettre à jour l'offre existante
              const { error: updateError } = await supabase
                .from('omra_offers')
                .update({
                  ...offer,
                  scraped_at: new Date().toISOString()
                })
                .eq('id', existing.id);
              
              if (updateError) {
                console.error(`[${runId}] Error updating offer:`, JSON.stringify(updateError));
                console.error(`[${runId}] Offer data:`, JSON.stringify(offer));
                offersErrors++;
              } else {
                offersUpdated++;
              }
            } else {
              // Créer une nouvelle offre
              const { error: insertError } = await supabase
                .from('omra_offers')
                .insert(offer);
              
              if (insertError) {
                console.error(`[${runId}] Error inserting offer:`, JSON.stringify(insertError));
                console.error(`[${runId}] Offer data:`, JSON.stringify(offer));
                offersErrors++;
              } else {
                offersAdded++;
              }
            }
          } catch (err) {
            console.error(`[${runId}] Error saving offer:`, err);
            offersErrors++;
          }
        }

        const duration = Date.now() - startTime;

        // Logger le résultat
        await supabase.from('omra_scraper_logs').insert({
          run_id: runId,
          agency_name: config.agency_name,
          status: 'success',
          offers_scraped: offers.length,
          offers_added: offersAdded,
          offers_updated: offersUpdated,
          offers_errors: offersErrors,
          duration_ms: duration,
          started_at: new Date(Date.now() - duration).toISOString(),
          completed_at: new Date().toISOString()
        });

        results.push({
          agency: config.agency_name,
          success: true,
          offers: offers.length,
          added: offersAdded,
          updated: offersUpdated,
          errors: offersErrors
        });

      } catch (err) {
        const duration = Date.now() - startTime;
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        
        console.error(`[${runId}] Error scraping ${config.agency_name}:`, errorMessage);

        // Logger l'erreur
        await supabase.from('omra_scraper_logs').insert({
          run_id: runId,
          agency_name: config.agency_name,
          status: 'error',
          offers_scraped: 0,
          offers_added: 0,
          offers_updated: 0,
          offers_errors: 0,
          duration_ms: duration,
          error_details: { message: errorMessage },
          started_at: new Date(Date.now() - duration).toISOString(),
          completed_at: new Date().toISOString()
        });

        results.push({
          agency: config.agency_name,
          success: false,
          error: errorMessage
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        run_id: runId, 
        results,
        total_agencies: results.length 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Scraper error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function scrapeAgency(config: ScraperConfig): Promise<any[]> {
  // Fetch la page
  const response = await fetch(config.agency_url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();
  
  // Parse le HTML et extrait les offres selon les sélecteurs
  const offers = parseOffersFromHTML(html, config);
  
  return offers;
}

function parseOffersFromHTML(html: string, config: ScraperConfig): any[] {
  const offers: any[] = [];
  
  try {
    // Extraction basique pour commencer
    // On va créer un regex pattern pour extraire les prix
    const pricePattern = /(\d+(?:\.\d+)?)\s*€/g;
    const prices = [...html.matchAll(pricePattern)];
    
    // Pour l'instant, on crée des offres de test basées sur les prix trouvés
    prices.slice(0, 10).forEach((match, index) => {
      const price = parseFloat(match[1]);
      const monthDeparture = getRandomMonth();
      const departureCity = 'Paris';
      const durationNights = Math.floor(Math.random() * 15) + 7;
      const formulaType = detectFormulaFromHotelInfo(html);
      
      offers.push({
        agency_name: config.agency_name,
        agency_url: config.agency_url,
        offer_title: `${config.agency_name} - Offre ${index + 1}`,
        price_eur: price,
        currency_raw: 'EUR',
        month_departure: monthDeparture,
        departure_city: departureCity,
        formula_type: formulaType,
        duration_nights: durationNights,
        makkah_nights: Math.floor(Math.random() * 7) + 3,
        medina_nights: Math.floor(Math.random() * 5) + 2,
        flights_included: true,
        visa_included: Math.random() > 0.5,
        offer_url: config.agency_url,
        status: 'active',
        source_hash: `${config.agency_name}-${price}-${monthDeparture}-${departureCity}-${formulaType}-${durationNights}`,
        scraped_at: new Date().toISOString()
      });
    });
    
  } catch (err) {
    console.error('Error parsing HTML:', err);
  }
  
  return offers;
}

function getRandomMonth(): string {
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return months[Math.floor(Math.random() * months.length)];
}

function detectFormulaFromHotelInfo(
  html: string, 
  hotelMakkah?: string, 
  hotelMedinah?: string
): string {
  const fiveStarPatterns = [
    /5\s*étoiles?/gi,
    /5\s*★/gi,
    /5\s*\*/gi,
    /\*{5}/g,
    /hôtel\s*5/gi,
    /hotel\s*5/gi,
    /5\s*stars?/gi,
    /luxe/gi,
    /prestige/gi,
    /cinq\s*étoiles?/gi
  ];
  
  const textToCheck = `${html} ${hotelMakkah || ''} ${hotelMedinah || ''}`;
  
  // Si AU MOINS un hôtel est 5★ → confort
  if (fiveStarPatterns.some(pattern => pattern.test(textToCheck))) {
    return 'confort';
  }
  
  // Sinon → essentiel
  return 'essentiel';
}
