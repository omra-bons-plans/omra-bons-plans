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
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) {
      console.error('Failed to parse HTML');
      return offers;
    }

    // Traitement spécifique pour Tawaf
    if (config.agency_name === 'Tawaf') {
      return parseTawafOffers(doc, config);
    }

    // Logique générique pour les autres agences
    const selectors = config.selectors || {};
    const containerSelector = selectors.container || 'article, .offer, .product, .card, [class*="offer"]';
    
    const offerElements = doc.querySelectorAll(containerSelector);
    console.log(`Found ${offerElements.length} potential offer elements for ${config.agency_name}`);
    
    offerElements.forEach((element, index) => {
      if (index >= 20) return; // Limiter à 20 offres max
      
      try {
        const offerData = extractOfferData(element, config, html);
        if (offerData && offerData.price_eur > 0) {
          offers.push(offerData);
        }
      } catch (err) {
        console.error(`Error extracting offer ${index}:`, err);
      }
    });
    
  } catch (err) {
    console.error('Error parsing HTML:', err);
  }
  
  return offers;
}

function parseTawafOffers(doc: Document, config: ScraperConfig): any[] {
  const offers: any[] = [];
  const selectors = config.selectors || {};
  
  console.log('Parsing Tawaf offers with selectors:', selectors);
  
  // Récupérer tous les liens d'offres
  const offerLinks = doc.querySelectorAll(selectors.offerContainer || 'a.elementor-button');
  console.log(`Found ${offerLinks.length} offer links for Tawaf`);
  
  let currentMonth = 'Non spécifié';
  
  offerLinks.forEach((link, index) => {
    try {
      // Trouver le titre du mois en remontant dans le DOM
      let parent = link.parentElement;
      let monthTitle = null;
      
      for (let i = 0; i < 10 && parent; i++) {
        const heading = parent.querySelector('h2.elementor-heading-title a');
        if (heading && heading.textContent) {
          monthTitle = heading.textContent.trim();
          break;
        }
        parent = parent.parentElement;
      }
      
      if (monthTitle) {
        // Extraire le mois du titre (ex: "OMRA OCTOBRE 2025" -> "Octobre")
        const monthMatch = monthTitle.match(/OMRA\s+(\w+)\s+\d{4}/i);
        if (monthMatch) {
          currentMonth = monthMatch[1].charAt(0).toUpperCase() + monthMatch[1].slice(1).toLowerCase();
        }
      }
      
      const href = link.getAttribute('href');
      if (!href) return;
      
      const buttonText = link.querySelector('.elementor-button-text');
      if (!buttonText) return;
      
      const fullText = buttonText.textContent || '';
      
      // Vérifier si l'offre est complète
      const isComplete = fullText.includes('COMPLET');
      if (isComplete) return; // Ignorer les offres complètes
      
      // Extraire le prix (ex: "1950€/pers")
      const priceMatch = fullText.match(/(\d+(?:\s?\d+)*)\s*€/);
      if (!priceMatch) return;
      const price = parseFloat(priceMatch[1].replace(/\s/g, ''));
      
      // Extraire les dates (ex: "23 Oct. au 01 Nov. 2025")
      const datePattern = /(\d{1,2})\s+(\w+)\.?\s+au\s+(\d{1,2})\s+(\w+)\.?\s+(\d{4})/i;
      const dateMatch = fullText.match(datePattern);
      
      let dateStart = null;
      let dateEnd = null;
      let durationNights = null;
      
      if (dateMatch) {
        const [_, startDay, startMonth, endDay, endMonth, year] = dateMatch;
        
        // Convertir les noms de mois en numéros
        const monthMap: Record<string, string> = {
          'jan': '01', 'janv': '01', 'janvier': '01',
          'fév': '02', 'févr': '02', 'février': '02', 'fev': '02', 'fevrier': '02',
          'mar': '03', 'mars': '03',
          'avr': '04', 'avril': '04',
          'mai': '05',
          'jui': '06', 'juin': '06',
          'juil': '07', 'juillet': '07',
          'aoû': '08', 'août': '08', 'aout': '08',
          'sep': '09', 'sept': '09', 'septembre': '09',
          'oct': '10', 'octobre': '10',
          'nov': '11', 'novembre': '11',
          'déc': '12', 'décembre': '12', 'dec': '12', 'decembre': '12'
        };
        
        const startMonthNum = monthMap[startMonth.toLowerCase().replace('.', '')];
        const endMonthNum = monthMap[endMonth.toLowerCase().replace('.', '')];
        
        if (startMonthNum && endMonthNum) {
          dateStart = `${year}-${startMonthNum}-${startDay.padStart(2, '0')}`;
          
          // La date de fin peut être l'année suivante
          let endYear = year;
          if (parseInt(endMonthNum) < parseInt(startMonthNum)) {
            endYear = (parseInt(year) + 1).toString();
          }
          dateEnd = `${endYear}-${endMonthNum}-${endDay.padStart(2, '0')}`;
          
          // Calculer la durée
          const start = new Date(dateStart);
          const end = new Date(dateEnd);
          durationNights = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }
      }
      
      // Détecter si c'est vacances scolaires
      const isVacances = fullText.toLowerCase().includes('vacances scolaires');
      
      // Créer un hash unique
      const sourceHash = `${config.agency_name}-${href}-${price}`;
      
      const offer = {
        agency_name: config.agency_name,
        agency_url: config.agency_url,
        offer_title: `Omra ${currentMonth} ${dateStart ? dateStart.split('-')[0] : '2025'}`,
        price_eur: price,
        currency_raw: 'EUR',
        month_departure: currentMonth,
        date_start: dateStart,
        date_end: dateEnd,
        departure_city: 'Paris', // Tawaf départ Paris par défaut
        formula_type: 'confort', // Tawaf propose du confort (hôtels 5★)
        duration_nights: durationNights,
        makkah_nights: durationNights ? Math.floor(durationNights * 0.6) : null,
        medina_nights: durationNights ? Math.floor(durationNights * 0.4) : null,
        hotel_makkah: 'Conrad 5*',
        hotel_medinah: 'Bosphorus 5*',
        airline: 'Saudia Airlines',
        flights_included: true,
        visa_included: true,
        board: isVacances ? 'Petit déjeuner' : 'Demi-pension à Médine',
        offer_url: href,
        status: 'active',
        source_hash: sourceHash,
        scraped_at: new Date().toISOString()
      };
      
      offers.push(offer);
      console.log(`Extracted Tawaf offer ${index + 1}:`, offer.offer_title, offer.price_eur + '€');
      
    } catch (err) {
      console.error(`Error extracting Tawaf offer ${index}:`, err);
    }
  });
  
  console.log(`Total Tawaf offers extracted: ${offers.length}`);
  return offers;
}

function extractOfferData(element: Element, config: ScraperConfig, fullHtml: string): any | null {
  const selectors = config.selectors || {};
  
  // Extraire le prix
  const priceSelector = selectors.price || '[class*="price"], [class*="prix"], .price, .prix';
  const priceElement = element.querySelector(priceSelector);
  const priceText = priceElement?.textContent || element.textContent || '';
  const priceMatch = priceText.match(/(\d+(?:\s?\d+)*(?:[.,]\d+)?)\s*(?:€|EUR)/);
  const price = priceMatch ? parseFloat(priceMatch[1].replace(/\s/g, '').replace(',', '.')) : 0;
  
  if (price === 0) return null;
  
  // Extraire le titre
  const titleSelector = selectors.title || 'h1, h2, h3, h4, [class*="title"], [class*="titre"]';
  const titleElement = element.querySelector(titleSelector);
  const title = titleElement?.textContent?.trim() || `${config.agency_name} - Offre Omra`;
  
  // Extraire les dates
  const fullText = element.textContent || '';
  const datePattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/g;
  const dateMatches = [...fullText.matchAll(datePattern)];
  
  let dateStart = null;
  let dateEnd = null;
  let monthDeparture = 'Non spécifié';
  
  if (dateMatches.length >= 2) {
    const startMatch = dateMatches[0];
    const endMatch = dateMatches[1];
    
    const startDay = startMatch[1].padStart(2, '0');
    const startMonth = startMatch[2].padStart(2, '0');
    let startYear = startMatch[3];
    if (startYear.length === 2) startYear = '20' + startYear;
    
    const endDay = endMatch[1].padStart(2, '0');
    const endMonth = endMatch[2].padStart(2, '0');
    let endYear = endMatch[3];
    if (endYear.length === 2) endYear = '20' + endYear;
    
    dateStart = `${startYear}-${startMonth}-${startDay}`;
    dateEnd = `${endYear}-${endMonth}-${endDay}`;
    
    // Calculer le mois de départ
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    monthDeparture = monthNames[parseInt(startMonth) - 1] || 'Non spécifié';
  } else {
    // Essayer de trouver un mois dans le texte
    const monthPattern = /(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)/gi;
    const monthMatch = fullText.match(monthPattern);
    if (monthMatch) {
      monthDeparture = monthMatch[0].charAt(0).toUpperCase() + monthMatch[0].slice(1).toLowerCase();
    }
  }
  
  // Calculer la durée
  let durationNights = null;
  if (dateStart && dateEnd) {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    durationNights = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  } else {
    const durationMatch = fullText.match(/(\d+)\s*(?:nuits?|jours?|j)/i);
    if (durationMatch) {
      durationNights = parseInt(durationMatch[1]);
    }
  }
  
  // Extraire la ville de départ
  const departurePattern = /(?:départ|au départ de|depuis)\s*:?\s*([A-Za-zÀ-ÿ\s-]+?)(?:\s*[,.\n]|$)/gi;
  const departureMatch = fullText.match(departurePattern);
  let departureCity = 'Paris';
  if (departureMatch) {
    const cityMatch = departureMatch[0].match(/(?:départ|au départ de|depuis)\s*:?\s*([A-Za-zÀ-ÿ\s-]+?)(?:\s*[,.\n]|$)/i);
    if (cityMatch) {
      departureCity = cityMatch[1].trim();
    }
  }
  
  // Extraire la compagnie aérienne
  const airlines = ['Saudi', 'Saudia', 'Turkish Airlines', 'Emirates', 'Air France', 'Royal Air Maroc', 'RAM', 'Lufthansa', 'Qatar Airways'];
  let airline = null;
  for (const airlineName of airlines) {
    if (fullText.includes(airlineName)) {
      airline = airlineName;
      break;
    }
  }
  
  // Extraire les nuits Makkah/Médine
  const makkahMatch = fullText.match(/(\d+)\s*(?:nuits?|j)\s*(?:à|a)?\s*(?:La\s*)?Mecque|Makkah/i);
  const medinaMatch = fullText.match(/(\d+)\s*(?:nuits?|j)\s*(?:à|a)?\s*Médine|Medina/i);
  const makkahNights = makkahMatch ? parseInt(makkahMatch[1]) : null;
  const medinaNights = medinaMatch ? parseInt(medinaMatch[1]) : null;
  
  // Extraire les hôtels
  const hotelPattern = /(?:hôtel|hotel)\s*:?\s*([A-Za-zÀ-ÿ\s\d-]+?)(?:\s*[,.\n]|(?:\d+\s*(?:étoiles?|★|\*)))/gi;
  const hotelMatches = [...fullText.matchAll(hotelPattern)];
  let hotelMakkah = null;
  let hotelMedinah = null;
  
  if (hotelMatches.length > 0) {
    hotelMakkah = hotelMatches[0][1]?.trim() || null;
  }
  if (hotelMatches.length > 1) {
    hotelMedinah = hotelMatches[1][1]?.trim() || null;
  }
  
  // Détecter la formule
  const formulaType = detectFormulaFromHotelInfo(fullText, hotelMakkah, hotelMedinah);
  
  // Créer un hash unique
  const sourceHash = `${config.agency_name}-${price}-${dateStart || monthDeparture}-${departureCity}-${formulaType}`;
  
  return {
    agency_name: config.agency_name,
    agency_url: config.agency_url,
    offer_title: title,
    price_eur: price,
    currency_raw: 'EUR',
    month_departure: monthDeparture,
    date_start: dateStart,
    date_end: dateEnd,
    departure_city: departureCity,
    formula_type: formulaType,
    duration_nights: durationNights,
    makkah_nights: makkahNights,
    medina_nights: medinaNights,
    hotel_makkah: hotelMakkah,
    hotel_medinah: hotelMedinah,
    airline: airline,
    flights_included: true,
    visa_included: fullText.toLowerCase().includes('visa'),
    offer_url: config.agency_url,
    status: 'active',
    source_hash: sourceHash,
    scraped_at: new Date().toISOString()
  };
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
