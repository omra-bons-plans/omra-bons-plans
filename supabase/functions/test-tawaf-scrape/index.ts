import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY non configurée');
    }

    console.log('🔥 Testing Firecrawl with Tawaf...');
    
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://www.tawaf.fr',
        formats: ['markdown', 'html'],
        onlyMainContent: true,
        waitFor: 2000,
      }),
    });

    if (!firecrawlResponse.ok) {
      const errorText = await firecrawlResponse.text();
      throw new Error(`Firecrawl API error: ${firecrawlResponse.status} - ${errorText}`);
    }

    const firecrawlData = await firecrawlResponse.json();
    const markdown = firecrawlData.data?.markdown || '';
    const html = firecrawlData.data?.html || '';
    
    console.log(`📄 Markdown length: ${markdown.length} chars`);
    console.log(`📄 HTML length: ${html.length} chars`);
    
    // Extract offers
    const offers = extractTawafOffers(markdown);
    
    console.log(`✅ Extracted ${offers.length} offers`);

    return new Response(
      JSON.stringify({
        success: true,
        markdown_preview: markdown.substring(0, 2000),
        html_preview: html.substring(0, 1000),
        markdown_length: markdown.length,
        html_length: html.length,
        offers: offers,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractTawafOffers(markdown: string): any[] {
  const offers: any[] = [];
  
  console.log('🔍 Analyzing Tawaf markdown...');
  console.log('First 500 chars:', markdown.substring(0, 500));
  
  // Split by sections
  const sections = markdown.split(/(?=^#{1,4}\s)/gm);
  
  for (const section of sections) {
    // Look for Omra-related sections (skip FAQ, general info)
    if (/(omra|umrah|ramadan|mi-ramadan)/i.test(section) && 
        !/(faq|pourquoi|qu'est|experience)/i.test(section)) {
      
      console.log('\n📦 Found Omra section:', section.substring(0, 200));
      
      // Extract prices in Tawaf format: "à partir de **1850€**" or "**1850€**" or "1850€"
      const priceMatches = [
        ...section.matchAll(/\*\*(\d{3,4})\s*€\*\*/g),
        ...section.matchAll(/(?:partir de\s+)?\*?\*?(\d{3,4})\s*€/gi)
      ];
      
      console.log(`  💰 Found ${priceMatches.length} prices`);
      
      if (priceMatches.length > 0) {
        const price = parseInt(priceMatches[0][1]);
        console.log(`  💵 Price: ${price}€`);
        
        // Extract dates in Tawaf format: "**21 Fév.** au **03 Mar.** 2026" or "21 Fév au 03 Mar 2026"
        const dateRangeMatch = section.match(/\*?\*?\s*(\d{1,2})\s+(Jan|Janv|Fév|Févr|Mar|Mars|Avr|Avril|Mai|Juin|Juil|Juillet|Août|Aout|Sep|Sept|Oct|Octobre|Nov|Novembre|Déc|Décembre)[a-z\.]*\s*\*?\*?\s+au\s+\*?\*?\s*(\d{1,2})\s+(Jan|Janv|Fév|Févr|Mar|Mars|Avr|Avril|Mai|Juin|Juil|Juillet|Août|Aout|Sep|Sept|Oct|Octobre|Nov|Novembre|Déc|Décembre)[a-z\.]*\s*\*?\*?\s+(\d{4})/i);
        
        let dates_found = [];
        if (dateRangeMatch) {
          const [_, day1, month1, day2, month2, year] = dateRangeMatch;
          dates_found.push(`${day1} ${month1} → ${day2} ${month2} ${year}`);
          console.log(`  📅 Date range: ${dates_found[0]}`);
        }
        
        // Extract duration: "11j" or "11 jours" or "11 nuits" format
        const durationMatch = section.match(/(\d{1,2})\s*(?:jours?|nuits?|j)/i);
        const duration = durationMatch ? `${durationMatch[1]}j` : null;
        if (duration) console.log(`  ⏱️ Duration: ${duration}`);
        
        // Extract hotels
        const hotelMakkahMatch = section.match(/(?:makkah|mecque|mecca)[:\s]*([A-Z][a-zÀ-ÿ\s]{3,40}?)(?:\s+\d|\*|\n|hotel|hôtel|à)/i);
        const hotelMedinaMatch = section.match(/(?:medina|médine|madinah)[:\s]*([A-Z][a-zÀ-ÿ\s]{3,40}?)(?:\s+\d|\*|\n|hotel|hôtel|à)/i);
        
        if (hotelMakkahMatch) console.log('  🏨 Makkah hotel:', hotelMakkahMatch[1]);
        if (hotelMedinaMatch) console.log('  🏨 Medina hotel:', hotelMedinaMatch[1]);
        
        // Extract airline
        const airlineMatch = section.match(/(Turkish|Emirates|Saudia|Air France|Egyptair|Qatar|Etihad|Lufthansa)/i);
        if (airlineMatch) console.log('  ✈️ Airline:', airlineMatch[1]);
        
        offers.push({
          section_preview: section.substring(0, 300),
          price_eur: price,
          dates_found,
          duration,
          hotel_makkah: hotelMakkahMatch?.[1]?.trim() || null,
          hotel_medina: hotelMedinaMatch?.[1]?.trim() || null,
          airline: airlineMatch?.[1] || null,
        });
      }
    }
  }
  
  console.log(`\n📊 Total offers extracted: ${offers.length}`);
  
  return offers;
}
