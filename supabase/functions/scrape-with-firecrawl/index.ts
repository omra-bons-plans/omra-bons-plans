import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgencyConfig {
  name: string;
  url: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }
    
    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY non configurée - Ajoutez-la dans les secrets Supabase');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const agencies: AgencyConfig[] = [
      { name: 'Tawaf', url: 'https://www.tawaf.fr' },
      { name: 'Sabile Voyages', url: 'https://sabilevoyages.com' },
      { name: 'Omra Pour Tous', url: 'https://omrapourtous.com/omra-2025-omra-2026/' },
      { name: 'Omra Sounnah', url: 'https://www.omrasounnah.com/omra/' },
      { name: 'Alhayat Voyages', url: 'https://www.alhayat-voyages.com/omra/' },
      { name: 'Albayt', url: 'https://www.albayt.fr/produit/omra/' },
      { name: 'Pelerin Hajj', url: 'https://pelerinhajj.com' },
      { name: 'Isla Voyages', url: 'https://islavoyages.com/omra/' },
      { name: 'Omra du Savoir', url: 'https://www.omradusavoir.fr' },
      { name: 'Almaqam Voyages', url: 'https://almaqamvoyages.com' },
      { name: 'Medin Voyages', url: 'https://medinvoyages.com/omras/' },
    ];

    console.log('🔥 Starting Firecrawl scraping for all agencies');
    
    let totalImported = 0;
    let totalErrors = 0;
    const results: any[] = [];

    for (const agency of agencies) {
      try {
        console.log(`\n📡 Scraping ${agency.name} with Firecrawl...`);
        
        // Call Firecrawl API to scrape the page
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
        
        const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firecrawlApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: agency.url,
            formats: ['markdown'],
            onlyMainContent: true,
            waitFor: 1500,
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!firecrawlResponse.ok) {
          const errorText = await firecrawlResponse.text();
          console.error(`❌ Firecrawl API error ${firecrawlResponse.status}:`, errorText);
          throw new Error(`Firecrawl API error: ${firecrawlResponse.status} - ${errorText.substring(0, 100)}`);
        }

        const firecrawlData = await firecrawlResponse.json();
        console.log(`✅ Firecrawl success for ${agency.name}`);
        
        // Extract offers from the scraped data
        const offers = extractOffersFromFirecrawl(
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
          });
        } else {
          results.push({
            agency: agency.name,
            success: true,
            offersFound: 0,
            imported: 0,
            message: 'No offers extracted',
          });
        }
        
        // Rate limiting réduit pour éviter les timeouts
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        details: 'Vérifiez que FIRECRAWL_API_KEY est configurée dans les secrets Supabase'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Extract offers from Firecrawl data with agency-specific parsing
function extractOffersFromFirecrawl(
  firecrawlData: any,
  agencyName: string,
  agencyUrl: string
): any[] {
  try {
    const markdown = firecrawlData.data?.markdown || '';
    const html = firecrawlData.data?.html || '';
    
    console.log(`🔍 Analyzing ${agencyName} (${markdown.length} chars)`);
    
    // Use agency-specific extraction
    switch (agencyName) {
      case 'Medin Voyages':
        return extractMedinVoyages(markdown, agencyUrl);
      case 'Omra Sounnah':
        return extractOmraSounnah(markdown, agencyUrl);
      case 'Tawaf':
        return extractTawaf(markdown, agencyUrl);
      default:
        return extractGeneric(markdown, agencyName, agencyUrl);
    }
  } catch (error) {
    console.error(`Error extracting for ${agencyName}:`, error);
    return [];
  }
}

// Medin Voyages extraction
function extractMedinVoyages(markdown: string, agencyUrl: string): any[] {
  const offers: any[] = [];
  const blocks = markdown.split(/(?=#{2,3}\s)/);
  
  for (const block of blocks) {
    const titleMatch = block.match(/#{2,3}\s*([^\n]+)/);
    const priceMatch = block.match(/(?:quadruple|4\s*pers).*?(\d{3,4})\s*€/i);
    
    if (priceMatch) {
      const price = parseInt(priceMatch[1]);
      if (price >= 800 && price <= 8000) {
        const dateMatch = block.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g);
        const airlineMatch = block.match(/(Turkish|Emirates|Saudia|Air France|Egyptair|Qatar|Etihad)/i);
        const hotelMakkahMatch = block.match(/(?:Makkah|Mecque).*?([A-Z][a-zÀ-ÿ\s]{3,20}?)(?:\s+\d|\*)/i);
        const hotelMedinaMatch = block.match(/(?:Medina|Médine).*?([A-Z][a-zÀ-ÿ\s]{3,20}?)(?:\s+\d|\*)/i);
        const starsMatch = block.match(/(\d)\s*(?:\*|étoile)/gi);
        const nightsMatch = block.match(/(\d+)\s*nuits?/gi);
        
        offers.push({
          nomAgence: 'Medin Voyages',
          titreOffre: titleMatch?.[1]?.trim() || 'Omra Medin Voyages',
          prixQuadruple: price,
          dateDepart: dateMatch?.[0] ? formatDateString(dateMatch[0]) : null,
          dateRetour: dateMatch?.[1] ? formatDateString(dateMatch[1]) : null,
          villeDepart: 'Paris',
          airline: airlineMatch?.[1] || null,
          hotelMakkah: hotelMakkahMatch?.[1]?.trim() || null,
          hotelMedine: hotelMedinaMatch?.[1]?.trim() || null,
          etoilesMakkah: starsMatch?.[0] ? parseInt(starsMatch[0]) : null,
          etoilesMedine: starsMatch?.[1] ? parseInt(starsMatch[1]) : null,
          nuitsMecque: nightsMatch?.[0] ? parseInt(nightsMatch[0]) : null,
          nuitsMedine: nightsMatch?.[1] ? parseInt(nightsMatch[1]) : null,
          detailUrl: agencyUrl,
        });
      }
    }
  }
  
  return offers.slice(0, 20);
}

// Omra Sounnah extraction
function extractOmraSounnah(markdown: string, agencyUrl: string): any[] {
  const offers: any[] = [];
  const blocks = markdown.split(/(?=#{2,3}\s)/);
  
  for (const block of blocks) {
    const priceMatch = block.match(/(\d{3,4})\s*€/);
    
    if (priceMatch) {
      const price = parseInt(priceMatch[1]);
      if (price >= 800 && price <= 8000) {
        const titleMatch = block.match(/#{2,3}\s*([^\n]+)/);
        const dateMatch = block.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g);
        
        offers.push({
          nomAgence: 'Omra Sounnah',
          titreOffre: titleMatch?.[1]?.trim() || 'Omra Sounnah',
          prixQuadruple: price,
          dateDepart: dateMatch?.[0] ? formatDateString(dateMatch[0]) : null,
          dateRetour: dateMatch?.[1] ? formatDateString(dateMatch[1]) : null,
          villeDepart: 'Paris',
          airline: null,
          hotelMakkah: null,
          hotelMedine: null,
          etoilesMakkah: null,
          etoilesMedine: null,
          nuitsMecque: null,
          nuitsMedine: null,
          detailUrl: agencyUrl,
        });
      }
    }
  }
  
  return offers.slice(0, 20);
}

// Tawaf extraction
function extractTawaf(markdown: string, agencyUrl: string): any[] {
  const offers: any[] = [];
  const priceMatches = [...markdown.matchAll(/(\d{3,4})\s*€/g)];
  
  for (const match of priceMatches) {
    const price = parseInt(match[1]);
    if (price >= 800 && price <= 8000) {
      offers.push({
        nomAgence: 'Tawaf',
        titreOffre: 'Omra Tawaf',
        prixQuadruple: price,
        dateDepart: null,
        dateRetour: null,
        villeDepart: 'Paris',
        airline: null,
        hotelMakkah: null,
        hotelMedine: null,
        etoilesMakkah: null,
        etoilesMedine: null,
        nuitsMecque: null,
        nuitsMedine: null,
        detailUrl: agencyUrl,
      });
    }
  }
  
  return offers.slice(0, 15);
}

// Generic extraction
function extractGeneric(markdown: string, agencyName: string, agencyUrl: string): any[] {
  const offers: any[] = [];
  const priceMatches = [...markdown.matchAll(/(\d{3,4})\s*€/g)];
  
  for (const match of priceMatches) {
    const price = parseInt(match[1]);
    if (price >= 800 && price <= 8000) {
      offers.push({
        nomAgence: agencyName,
        titreOffre: `Omra ${agencyName}`,
        prixQuadruple: price,
        dateDepart: null,
        dateRetour: null,
        villeDepart: 'Paris',
        airline: null,
        hotelMakkah: null,
        hotelMedine: null,
        etoilesMakkah: null,
        etoilesMedine: null,
        nuitsMecque: null,
        nuitsMedine: null,
        detailUrl: agencyUrl,
      });
    }
  }
  
  return offers.slice(0, 10);
}

// Helper to format date strings
function formatDateString(dateStr: string): string | null {
  const match = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (match) {
    const [_, day, month, year] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return null;
}
