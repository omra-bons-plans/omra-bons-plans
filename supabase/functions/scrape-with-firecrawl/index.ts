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
    // Skip blocks without Omra keywords
    if (!/(omra|umrah|pèlerinage)/i.test(block)) continue;
    
    const titleMatch = block.match(/#{2,3}\s*([^\n]+)/);
    const priceMatch = block.match(/(?:quadruple|quad|4\s*pers|prix).*?(\d{3,4})\s*€/i);
    
    if (priceMatch) {
      const price = parseInt(priceMatch[1]);
      if (price >= 900 && price <= 6000) {
        const dateMatch = block.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g);
        const monthMatch = block.match(/(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*\d{4}/i);
        const airlineMatch = block.match(/(Turkish|Emirates|Saudia|Air France|Egyptair|Qatar|Etihad|Lufthansa)/i);
        const hotelMakkahMatch = block.match(/(?:Makkah|Mecque|Mecca).*?([A-Z][a-zÀ-ÿ\s]{3,30}?)(?:\s+\d|\*|\n)/i);
        const hotelMedinaMatch = block.match(/(?:Medina|Médine|Madinah).*?([A-Z][a-zÀ-ÿ\s]{3,30}?)(?:\s+\d|\*|\n)/i);
        const starsMatch = block.match(/(\d)\s*(?:\*|étoile)/gi);
        const nightsMatch = block.match(/(\d+)\s*nuits?/gi);
        
        offers.push({
          nomAgence: 'Medin Voyages',
          titreOffre: titleMatch?.[1]?.trim() || 'Omra Medin Voyages',
          prixQuadruple: price,
          dateDepart: dateMatch?.[0] ? formatDateString(dateMatch[0]) : null,
          dateRetour: dateMatch?.[1] ? formatDateString(dateMatch[1]) : null,
          moisOmra: monthMatch?.[1]?.toLowerCase() || null,
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
    // Skip blocks without Omra keywords
    if (!/(omra|umrah|pèlerinage)/i.test(block)) continue;
    
    const priceMatch = block.match(/(?:prix|tarif|quadruple|quad|4\s*pers).*?(\d{3,4})\s*€/i);
    
    if (priceMatch) {
      const price = parseInt(priceMatch[1]);
      if (price >= 900 && price <= 6000) {
        const titleMatch = block.match(/#{2,3}\s*([^\n]+)/);
        const dateMatch = block.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g);
        const monthMatch = block.match(/(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*\d{4}/i);
        const formulaMatch = block.match(/(essentiel|confort|premium|luxury|economique)/i);
        const hotelMakkahMatch = block.match(/(?:Makkah|Mecque|Mecca).*?([A-Z][a-zÀ-ÿ\s]{3,30}?)(?:\s+\d|\*|\n)/i);
        const hotelMedinaMatch = block.match(/(?:Medina|Médine|Madinah).*?([A-Z][a-zÀ-ÿ\s]{3,30}?)(?:\s+\d|\*|\n)/i);
        const nightsMatch = block.match(/(\d+)\s*nuits?/gi);
        
        offers.push({
          nomAgence: 'Omra Sounnah',
          titreOffre: titleMatch?.[1]?.trim() || 'Omra Sounnah',
          prixQuadruple: price,
          dateDepart: dateMatch?.[0] ? formatDateString(dateMatch[0]) : null,
          dateRetour: dateMatch?.[1] ? formatDateString(dateMatch[1]) : null,
          moisOmra: monthMatch?.[1]?.toLowerCase() || null,
          formuleType: formulaMatch?.[1]?.toLowerCase() || 'essentiel',
          villeDepart: 'Paris',
          airline: null,
          hotelMakkah: hotelMakkahMatch?.[1]?.trim() || null,
          hotelMedine: hotelMedinaMatch?.[1]?.trim() || null,
          nuitsMecque: nightsMatch?.[0] ? parseInt(nightsMatch[0]) : null,
          nuitsMedine: nightsMatch?.[1] ? parseInt(nightsMatch[1]) : null,
          detailUrl: agencyUrl,
        });
      }
    }
  }
  
  return offers.slice(0, 20);
}

// Tawaf extraction - improved for their specific format
function extractTawaf(markdown: string, agencyUrl: string): any[] {
  const offers: any[] = [];
  
  console.log('🔍 Analyzing Tawaf markdown...');
  
  // Split by sections
  const sections = markdown.split(/(?=^#{1,4}\s)/gm);
  
  for (const section of sections) {
    // Look for Omra-related sections (skip FAQ, general info)
    if (/(omra|umrah|ramadan|mi-ramadan)/i.test(section) && 
        !/(faq|pourquoi|qu'est|experience)/i.test(section)) {
      
      console.log('\n📦 Tawaf section:', section.substring(0, 150));
      
      // Extract prices: match **1850€** or "à partir de 1850€" or "1850€"
      const priceMatches = [
        ...section.matchAll(/\*\*(\d{3,4})\s*€\*\*/g),
        ...section.matchAll(/(?:partir de\s+)?\*?\*?(\d{3,4})\s*€/gi)
      ];
      
      console.log(`  💰 Found ${priceMatches.length} prices`);
      
      if (priceMatches.length > 0) {
        const price = parseInt(priceMatches[0][1]);
        
        if (price >= 900 && price <= 6000) {
          // Extract title from section heading
          const titleMatch = section.match(/^#{1,3}\s*([^\n]+)/m);
          const title = titleMatch?.[1]?.replace(/\*/g, '').trim() || 'Omra Tawaf';
          
          // Extract dates: "**21 Fév.** au **03 Mar.** 2026" or "21 Fév au 03 Mar 2026"
          const dateRangeMatch = section.match(/\*?\*?\s*(\d{1,2})\s+(Jan|Janv|Fév|Févr|Mar|Mars|Avr|Avril|Mai|Juin|Juil|Juillet|Août|Aout|Sep|Sept|Oct|Octobre|Nov|Novembre|Déc|Décembre)[a-z\.]*\s*\*?\*?\s+au\s+\*?\*?\s*(\d{1,2})\s+(Jan|Janv|Fév|Févr|Mar|Mars|Avr|Avril|Mai|Juin|Juil|Juillet|Août|Aout|Sep|Sept|Oct|Octobre|Nov|Novembre|Déc|Décembre)[a-z\.]*\s*\*?\*?\s+(\d{4})/i);
          
          let dateDepart = null;
          let dateRetour = null;
          let moisOmra = null;
          
          if (dateRangeMatch) {
            const [_, day1, month1, day2, month2, year] = dateRangeMatch;
            const monthMap: Record<string, string> = {
              'jan': '01', 'janv': '01',
              'fév': '02', 'févr': '02',
              'mar': '03', 'mars': '03',
              'avr': '04', 'avril': '04',
              'mai': '05',
              'juin': '06',
              'juil': '07', 'juillet': '07',
              'août': '08', 'aout': '08',
              'sep': '09', 'sept': '09',
              'oct': '10', 'octobre': '10',
              'nov': '11', 'novembre': '11',
              'déc': '12', 'décembre': '12'
            };
            const monthNum1 = monthMap[month1.toLowerCase().substring(0, 3)] || '01';
            const monthNum2 = monthMap[month2.toLowerCase().substring(0, 3)] || '01';
            
            dateDepart = `${year}-${monthNum1}-${day1.padStart(2, '0')}`;
            dateRetour = `${year}-${monthNum2}-${day2.padStart(2, '0')}`;
            
            const monthNames: Record<string, string> = {
              '01': 'janvier', '02': 'février', '03': 'mars', '04': 'avril',
              '05': 'mai', '06': 'juin', '07': 'juillet', '08': 'août',
              '09': 'septembre', '10': 'octobre', '11': 'novembre', '12': 'décembre'
            };
            moisOmra = monthNames[monthNum1] || null;
            
            console.log(`  📅 Dates: ${dateDepart} → ${dateRetour} (${moisOmra})`);
          }
          
          // Extract duration: "11j" or "11 jours" or "11 nuits"
          const durationMatch = section.match(/(\d{1,2})\s*(?:jours?|nuits?|j)/i);
          const nombreJours = durationMatch ? parseInt(durationMatch[1]) : null;
          const durationNights = nombreJours ? nombreJours - 1 : null;
          
          console.log(`  🌙 Duration: ${nombreJours}j = ${durationNights} nights`);
          
          // Extract hotels
          const hotelMakkahMatch = section.match(/(?:makkah|mecque|mecca)[:\s]*([A-Z][a-zÀ-ÿ\s]{3,40}?)(?:\s+\d|\*|\n|hotel|hôtel|à)/i);
          const hotelMedinaMatch = section.match(/(?:medina|médine|madinah)[:\s]*([A-Z][a-zÀ-ÿ\s]{3,40}?)(?:\s+\d|\*|\n|hotel|hôtel|à)/i);
          
          // Extract stars
          const starsMatch = section.match(/(\d)\s*\*/g);
          const etoilesMakkah = starsMatch?.[0] ? parseInt(starsMatch[0]) : null;
          const etoilesMedine = starsMatch?.[1] ? parseInt(starsMatch[1]) : null;
          
          // Extract airline
          const airlineMatch = section.match(/(Turkish|Emirates|Saudia|Air France|Egyptair|Qatar|Etihad|Lufthansa|KLM)/i);
          
          offers.push({
            nomAgence: 'Tawaf',
            titreOffre: title,
            prixQuadruple: price,
            dateDepart,
            dateRetour,
            moisOmra,
            nombreJours,
            durationNights,
            villeDepart: 'Paris',
            airline: airlineMatch?.[1] || null,
            hotelMakkah: hotelMakkahMatch?.[1]?.trim() || null,
            hotelMedine: hotelMedinaMatch?.[1]?.trim() || null,
            etoilesMakkah,
            etoilesMedine,
            detailUrl: agencyUrl,
          });
          
          console.log(`  ✅ Extracted offer: ${title} - ${price}€`);
        }
      }
    }
  }
  
  // Remove duplicates by price
  const uniqueOffers = offers.filter((offer, index, self) => 
    index === self.findIndex(o => o.prixQuadruple === offer.prixQuadruple)
  );
  
  console.log(`📊 Total Tawaf offers: ${uniqueOffers.length}`);
  
  return uniqueOffers.slice(0, 20);
}

// Generic extraction - improved to extract real offers
function extractGeneric(markdown: string, agencyName: string, agencyUrl: string): any[] {
  const offers: any[] = [];
  
  // Split by headings or large sections
  const sections = markdown.split(/(?=^#{1,3}\s)/gm);
  
  for (const section of sections) {
    // Skip if section doesn't contain Omra/pilgrimage keywords
    const hasOmraKeyword = /omra|omrah|umrah|pèlerinage|pilgrimage|hajj/i.test(section);
    if (!hasOmraKeyword && section.length < 200) continue;
    
    // Look for prices with context (not just any price)
    const priceRegex = /(?:prix|tarif|partir|à partir|dès|chambre\s+quadruple|quad|4\s*pers)[:\s]*(\d{3,4})\s*€/gi;
    const priceMatches = [...section.matchAll(priceRegex)];
    
    if (priceMatches.length === 0) {
      // Fallback: look for prices near dates or hotel info
      const contextPriceRegex = /(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}.*?|hôtel.*?|hotel.*?)(\d{3,4})\s*€/gi;
      priceMatches.push(...section.matchAll(contextPriceRegex));
    }
    
    for (const match of priceMatches) {
      const price = parseInt(match[1]);
      if (price >= 900 && price <= 6000) {
        // Extract title from section heading
        const titleMatch = section.match(/^#{1,3}\s*([^\n]+)/m);
        const title = titleMatch?.[1]?.trim() || `Omra ${agencyName}`;
        
        // Extract dates
        const dateMatches = section.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g);
        const dateDepart = dateMatches?.[0] ? formatDateString(dateMatches[0]) : null;
        const dateRetour = dateMatches?.[1] ? formatDateString(dateMatches[1]) : null;
        
        // Extract month
        const monthMatch = section.match(/(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*\d{4}/i);
        const moisOmra = monthMatch?.[1]?.toLowerCase() || null;
        
        // Extract hotel info
        const hotelMakkahMatch = section.match(/(?:makkah|mecque|mecca)[:\s]*([A-Z][a-zÀ-ÿ\s]{3,30}?)(?:\s+\d|\*|\n|hotel)/i);
        const hotelMedinaMatch = section.match(/(?:medina|médine|madinah)[:\s]*([A-Z][a-zÀ-ÿ\s]{3,30}?)(?:\s+\d|\*|\n|hotel)/i);
        
        // Extract nights
        const nightsMatches = section.match(/(\d+)\s*nuits?/gi);
        const nuitsMecque = nightsMatches?.[0] ? parseInt(nightsMatches[0]) : null;
        const nuitsMedine = nightsMatches?.[1] ? parseInt(nightsMatches[1]) : null;
        
        // Extract airline
        const airlineMatch = section.match(/(Turkish|Emirates|Saudia|Air France|Egyptair|Qatar|Etihad|Lufthansa|KLM)/i);
        
        offers.push({
          nomAgence: agencyName,
          titreOffre: title,
          prixQuadruple: price,
          dateDepart,
          dateRetour,
          moisOmra,
          villeDepart: 'Paris',
          airline: airlineMatch?.[1] || null,
          hotelMakkah: hotelMakkahMatch?.[1]?.trim() || null,
          hotelMedine: hotelMedinaMatch?.[1]?.trim() || null,
          nuitsMecque,
          nuitsMedine,
          detailUrl: agencyUrl,
        });
      }
    }
  }
  
  // Remove duplicates by price
  const uniqueOffers = offers.filter((offer, index, self) => 
    index === self.findIndex(o => o.prixQuadruple === offer.prixQuadruple)
  );
  
  console.log(`  📊 Extracted ${uniqueOffers.length} unique offers from ${offers.length} total`);
  
  return uniqueOffers.slice(0, 15);
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
