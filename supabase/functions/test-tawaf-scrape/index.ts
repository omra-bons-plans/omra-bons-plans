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
    // Look for Omra-related sections
    if (/(omra|umrah|pèlerinage)/i.test(section)) {
      console.log('\n📦 Found Omra section:', section.substring(0, 200));
      
      // Extract all prices
      const priceMatches = [...section.matchAll(/(\d{3,4})\s*€/g)];
      console.log(`  💰 Found ${priceMatches.length} prices`);
      
      // Extract dates
      const dateMatches = [...section.matchAll(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g)];
      console.log(`  📅 Found ${dateMatches.length} dates`);
      
      // Extract hotels
      const hotelMakkahMatch = section.match(/(?:makkah|mecque|mecca)[:\s]*([A-Z][a-zÀ-ÿ\s]{3,40}?)(?:\s+\d|\*|\n|hotel|hôtel)/i);
      const hotelMedinaMatch = section.match(/(?:medina|médine|madinah)[:\s]*([A-Z][a-zÀ-ÿ\s]{3,40}?)(?:\s+\d|\*|\n|hotel|hôtel)/i);
      
      if (hotelMakkahMatch) console.log('  🏨 Makkah hotel:', hotelMakkahMatch[1]);
      if (hotelMedinaMatch) console.log('  🏨 Medina hotel:', hotelMedinaMatch[1]);
      
      // Extract nights
      const nightsMatches = [...section.matchAll(/(\d+)\s*nuits?/gi)];
      console.log(`  🌙 Found ${nightsMatches.length} nights mentions`);
      
      // Extract airline
      const airlineMatch = section.match(/(Turkish|Emirates|Saudia|Air France|Egyptair|Qatar|Etihad|Lufthansa)/i);
      if (airlineMatch) console.log('  ✈️ Airline:', airlineMatch[1]);
      
      if (priceMatches.length > 0) {
        const price = parseInt(priceMatches[0][1]);
        
        offers.push({
          section_preview: section.substring(0, 300),
          price_eur: price,
          dates_found: dateMatches.map(m => m[0]),
          hotel_makkah: hotelMakkahMatch?.[1]?.trim() || null,
          hotel_medina: hotelMedinaMatch?.[1]?.trim() || null,
          nights: nightsMatches.map(m => m[0]),
          airline: airlineMatch?.[1] || null,
        });
      }
    }
  }
  
  return offers;
}
