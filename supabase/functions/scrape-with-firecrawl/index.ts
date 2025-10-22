import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgencyConfig {
  name: string;
  url: string;
  extractionRules: {
    titleSelector?: string;
    priceSelector?: string;
    dateSelector?: string;
    hotelSelector?: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY not configured');
    }

    const agencies: AgencyConfig[] = [
      { name: 'Tawaf', url: 'https://www.tawaf.fr', extractionRules: {} },
      { name: 'Sabile Voyages', url: 'https://sabilevoyages.com', extractionRules: {} },
      { name: 'Omra Pour Tous', url: 'https://omrapourtous.com/omra-2025-omra-2026/', extractionRules: {} },
      { name: 'Omra Sounnah', url: 'https://www.omrasounnah.com/omra/', extractionRules: {} },
      { name: 'Alhayat Voyages', url: 'https://www.alhayat-voyages.com/omra/', extractionRules: {} },
      { name: 'Albayt', url: 'https://www.albayt.fr/produit/omra/', extractionRules: {} },
      { name: 'Pelerin Hajj', url: 'https://pelerinhajj.com', extractionRules: {} },
      { name: 'Isla Voyages', url: 'https://islavoyages.com/omra/', extractionRules: {} },
      { name: 'Omra du Savoir', url: 'https://www.omradusavoir.fr', extractionRules: {} },
      { name: 'Almaqam Voyages', url: 'https://almaqamvoyages.com', extractionRules: {} },
      { name: 'Medin Voyages', url: 'https://medinvoyages.com/omras/', extractionRules: {} },
    ];

    console.log('🚀 Starting Firecrawl scraping for all agencies');
    
    let totalImported = 0;
    let totalErrors = 0;
    const results: any[] = [];

    for (const agency of agencies) {
      try {
        console.log(`\n📡 Scraping ${agency.name} with Firecrawl...`);
        
        // Call Firecrawl API to scrape the page
        const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: agency.url,
            formats: ['markdown', 'html'],
            onlyMainContent: true,
            waitFor: 2000, // Wait for JavaScript to load
          }),
        });

        if (!firecrawlResponse.ok) {
          throw new Error(`Firecrawl API error: ${firecrawlResponse.status}`);
        }

        const firecrawlData = await firecrawlResponse.json();
        console.log(`✅ Firecrawl success for ${agency.name}`);
        
        // Extract offers from the scraped data
        const offers = await extractOffersFromFirecrawl(
          firecrawlData,
          agency.name,
          agency.url
        );
        
        console.log(`✅ Found ${offers.length} offers for ${agency.name}`);

        // Import offers via import-omra-data function
        if (offers.length > 0) {
          const importResponse = await supabase.functions.invoke('import-omra-data', {
            body: { offers },
          });

          if (importResponse.error) {
            throw importResponse.error;
          }

          const importResult = importResponse.data;
          totalImported += importResult.imported || 0;
          
          results.push({
            agency: agency.name,
            success: true,
            offersFound: offers.length,
            imported: importResult.imported,
            updated: importResult.updated,
            scrapedData: {
              markdown: firecrawlData.data?.markdown?.substring(0, 500) + '...',
              url: firecrawlData.data?.metadata?.url,
            }
          });
        } else {
          results.push({
            agency: agency.name,
            success: true,
            offersFound: 0,
            imported: 0,
            message: 'No offers extracted from Firecrawl data',
          });
        }
        
        // Rate limiting between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
        
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
        message: `Scraped ${agencies.length} agencies with Firecrawl`,
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

// Extract offers from Firecrawl scraped data
async function extractOffersFromFirecrawl(
  firecrawlData: any,
  agencyName: string,
  agencyUrl: string
): Promise<any[]> {
  const offers: any[] = [];
  
  try {
    const html = firecrawlData.data?.html || '';
    const markdown = firecrawlData.data?.markdown || '';
    
    // Extract prices (looking for patterns like \"1990€\", \"2.450 €\", etc.)
    const priceMatches = [...html.matchAll(/(\d[\d\s,.]*)\s*€/g)];
    
    // Extract months (looking for French month names)
    const monthMatches = [...markdown.matchAll(/\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\b/gi)];
    
    // Extract dates (looking for date patterns)
    const dateMatches = [...markdown.matchAll(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/g)];
    
    // Extract hotel names (looking for common patterns)
    const hotelMatches = [...markdown.matchAll(/hôtel\s+([A-Za-zÀ-ÿ\s]+?)(?:\s+\d|\s+€|\n)/gi)];
    
    console.log(`Found ${priceMatches.length} prices, ${monthMatches.length} months, ${dateMatches.length} dates, ${hotelMatches.length} hotels`);
    
    // Create offers based on price matches
    for (let i = 0; i < Math.min(priceMatches.length, 20); i++) {
      const priceStr = priceMatches[i][1].replace(/[\s,.]/g, '');
      const price = parseInt(priceStr);
      
      // Only keep realistic Omra prices
      if (price >= 800 && price <= 8000) {
        const month = monthMatches[i]?.[0] || null;
        
        offers.push({
          nomAgence: agencyName,
          moisOmra: month,
          prixQuadruple: price,
          detailUrl: agencyUrl,
          dateDepart: null,
          dateRetour: null,
          nombreJours: null,
          villeDepart: 'Paris',
          hotelMakkah: hotelMatches[i * 2]?.[1]?.trim() || null,
          hotelMedine: hotelMatches[i * 2 + 1]?.[1]?.trim() || null,
          airline: null,
        });
      }
    }
    
  } catch (error) {
    console.error('Error extracting offers:', error);
  }
  
  return offers;
}
