import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { requireAdmin } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgencyConfig {
  name: string;
  url: string;
  scraper: (html: string) => Promise<any[]>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const agencies: AgencyConfig[] = [
      { name: 'Tawaf', url: 'https://www.tawaf.fr', scraper: scrapeTawaf },
      { name: 'Sabile Voyages', url: 'https://sabilevoyages.com', scraper: scrapeSabile },
      { name: 'Omra Pour Tous', url: 'https://omrapourtous.com/omra-2025-omra-2026/', scraper: scrapeOmraPourtous },
      { name: 'Omra Sounnah', url: 'https://www.omrasounnah.com/omra/', scraper: scrapeOmraSounnah },
      { name: 'Alhayat Voyages', url: 'https://www.alhayat-voyages.com/omra/', scraper: scrapeAlhayat },
      { name: 'Albayt', url: 'https://www.albayt.fr/produit/omra/', scraper: scrapeAlbayt },
      { name: 'Pelerin Hajj', url: 'https://pelerinhajj.com', scraper: scrapePelerinHajj },
      { name: 'Isla Voyages', url: 'https://islavoyages.com/omra/', scraper: scrapeIslaVoyages },
      { name: 'Omra du Savoir', url: 'https://www.omradusavoir.fr', scraper: scrapeOmraDuSavoir },
      { name: 'Almaqam Voyages', url: 'https://almaqamvoyages.com', scraper: scrapeAlmaqam },
      { name: 'Medin Voyages', url: 'https://medinvoyages.com/omras/', scraper: scrapeMedinVoyages },
    ];

    console.log('🚀 Starting scraping for all agencies');
    
    let totalImported = 0;
    let totalErrors = 0;
    const results: any[] = [];

    for (const agency of agencies) {
      try {
        console.log(`\n📡 Scraping ${agency.name}...`);
        
        const response = await fetch(agency.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        const offers = await agency.scraper(html);
        
        console.log(`✅ Found ${offers.length} offers for ${agency.name}`);

        // Import offers via import-omra-data function
        if (offers.length > 0) {
          const importResponse = await fetch(`${supabaseUrl}/functions/v1/import-omra-data`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({ offers }),
          });

          const importResult = await importResponse.json();
          totalImported += importResult.imported || 0;
          
          results.push({
            agency: agency.name,
            success: true,
            offersFound: offers.length,
            imported: importResult.imported,
            updated: importResult.updated,
          });
        } else {
          results.push({
            agency: agency.name,
            success: true,
            offersFound: 0,
            imported: 0,
          });
        }
        
      } catch (error) {
        console.error(`❌ Error scraping ${agency.name}:`, error);
        totalErrors++;
        results.push({
          agency: agency.name,
          success: false,
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalImported,
        totalErrors,
        agencies: results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Scrapers pour chaque agence

async function scrapeTawaf(html: string): Promise<any[]> {
  const offers: any[] = [];
  // Parser le HTML pour extraire les offres
  const offerMatches = html.matchAll(/<div[^>]*class="[^"]*offre[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
  
  for (const match of offerMatches) {
    try {
      const offerHtml = match[1];
      
      const priceMatch = offerHtml.match(/(\d+)\s*€/);
      const monthMatch = offerHtml.match(/(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i);
      const urlMatch = offerHtml.match(/href="([^"]*)"/);
      
      if (priceMatch && monthMatch) {
        offers.push({
          nomAgence: 'Tawaf',
          moisOmra: monthMatch[0],
          prixQuadruple: parseInt(priceMatch[1]),
          detailUrl: urlMatch ? urlMatch[1] : 'https://www.tawaf.fr',
          dateDepart: null,
          dateRetour: null,
          nombreJours: null,
          villeDepart: 'Paris',
          hotelMakkah: null,
          hotelMedine: null,
          airline: null,
        });
      }
    } catch (error) {
      console.error('Error parsing offer:', error);
    }
  }
  
  return offers;
}

async function scrapeSabile(html: string): Promise<any[]> {
  const offers: any[] = [];
  // Logique similaire adaptée à Sabile Voyages
  const priceMatches = html.matchAll(/(\d+)\s*€/g);
  
  // Extraction basique - à affiner selon la structure du site
  for (const match of priceMatches) {
    if (parseInt(match[1]) > 500 && parseInt(match[1]) < 5000) {
      offers.push({
        nomAgence: 'Sabile Voyages',
        moisOmra: null,
        prixQuadruple: parseInt(match[1]),
        detailUrl: 'https://sabilevoyages.com',
        dateDepart: null,
        dateRetour: null,
        nombreJours: null,
        villeDepart: 'Paris',
        hotelMakkah: null,
        hotelMedine: null,
        airline: null,
      });
    }
  }
  
  return offers;
}

async function scrapeOmraPourtous(html: string): Promise<any[]> {
  const offers: any[] = [];
  
  const priceMatches = html.matchAll(/(\d+)\s*€/g);
  
  for (const match of priceMatches) {
    const price = parseInt(match[1]);
    if (price > 500 && price < 5000) {
      offers.push({
        nomAgence: 'Omra Pour Tous',
        moisOmra: null,
        prixQuadruple: price,
        detailUrl: 'https://omrapourtous.com',
        dateDepart: null,
        dateRetour: null,
        nombreJours: null,
        villeDepart: 'Paris',
        hotelMakkah: null,
        hotelMedine: null,
        airline: null,
      });
    }
  }
  
  return offers;
}

async function scrapeOmraSounnah(html: string): Promise<any[]> {
  // Utiliser la logique existante
  return [];
}

async function scrapeAlhayat(html: string): Promise<any[]> {
  const offers: any[] = [];
  const priceMatches = html.matchAll(/(\d+)\s*€/g);
  
  for (const match of priceMatches) {
    const price = parseInt(match[1]);
    if (price > 500 && price < 5000) {
      offers.push({
        nomAgence: 'Alhayat Voyages',
        moisOmra: null,
        prixQuadruple: price,
        detailUrl: 'https://www.alhayat-voyages.com',
        dateDepart: null,
        dateRetour: null,
        nombreJours: null,
        villeDepart: 'Paris',
        hotelMakkah: null,
        hotelMedine: null,
        airline: null,
      });
    }
  }
  
  return offers;
}

async function scrapeAlbayt(html: string): Promise<any[]> {
  const offers: any[] = [];
  const priceMatches = html.matchAll(/(\d+)\s*€/g);
  
  for (const match of priceMatches) {
    const price = parseInt(match[1]);
    if (price > 500 && price < 5000) {
      offers.push({
        nomAgence: 'Albayt',
        moisOmra: null,
        prixQuadruple: price,
        detailUrl: 'https://www.albayt.fr',
        dateDepart: null,
        dateRetour: null,
        nombreJours: null,
        villeDepart: 'Paris',
        hotelMakkah: null,
        hotelMedine: null,
        airline: null,
      });
    }
  }
  
  return offers;
}

async function scrapePelerinHajj(html: string): Promise<any[]> {
  const offers: any[] = [];
  const priceMatches = html.matchAll(/(\d+)\s*€/g);
  
  for (const match of priceMatches) {
    const price = parseInt(match[1]);
    if (price > 500 && price < 5000) {
      offers.push({
        nomAgence: 'Pelerin Hajj',
        moisOmra: null,
        prixQuadruple: price,
        detailUrl: 'https://pelerinhajj.com',
        dateDepart: null,
        dateRetour: null,
        nombreJours: null,
        villeDepart: 'Paris',
        hotelMakkah: null,
        hotelMedine: null,
        airline: null,
      });
    }
  }
  
  return offers;
}

async function scrapeIslaVoyages(html: string): Promise<any[]> {
  const offers: any[] = [];
  const priceMatches = html.matchAll(/(\d+)\s*€/g);
  
  for (const match of priceMatches) {
    const price = parseInt(match[1]);
    if (price > 500 && price < 5000) {
      offers.push({
        nomAgence: 'Isla Voyages',
        moisOmra: null,
        prixQuadruple: price,
        detailUrl: 'https://islavoyages.com',
        dateDepart: null,
        dateRetour: null,
        nombreJours: null,
        villeDepart: 'Paris',
        hotelMakkah: null,
        hotelMedine: null,
        airline: null,
      });
    }
  }
  
  return offers;
}

async function scrapeOmraDuSavoir(html: string): Promise<any[]> {
  const offers: any[] = [];
  const priceMatches = html.matchAll(/(\d+)\s*€/g);
  
  for (const match of priceMatches) {
    const price = parseInt(match[1]);
    if (price > 500 && price < 5000) {
      offers.push({
        nomAgence: 'Omra du Savoir',
        moisOmra: null,
        prixQuadruple: price,
        detailUrl: 'https://www.omradusavoir.fr',
        dateDepart: null,
        dateRetour: null,
        nombreJours: null,
        villeDepart: 'Paris',
        hotelMakkah: null,
        hotelMedine: null,
        airline: null,
      });
    }
  }
  
  return offers;
}

async function scrapeAlmaqam(html: string): Promise<any[]> {
  const offers: any[] = [];
  const priceMatches = html.matchAll(/(\d+)\s*€/g);
  
  for (const match of priceMatches) {
    const price = parseInt(match[1]);
    if (price > 500 && price < 5000) {
      offers.push({
        nomAgence: 'Almaqam Voyages',
        moisOmra: null,
        prixQuadruple: price,
        detailUrl: 'https://almaqamvoyages.com',
        dateDepart: null,
        dateRetour: null,
        nombreJours: null,
        villeDepart: 'Paris',
        hotelMakkah: null,
        hotelMedine: null,
        airline: null,
      });
    }
  }
  
  return offers;
}

async function scrapeMedinVoyages(html: string): Promise<any[]> {
  // Utiliser la logique existante
  return [];
}