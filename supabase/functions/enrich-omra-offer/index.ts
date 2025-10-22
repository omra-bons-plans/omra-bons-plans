import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, agency } = await req.json();

    console.log(`🔍 Enriching offer from: ${url}`);

    // Fetch la page de détail
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    if (!doc) {
      throw new Error('Failed to parse HTML');
    }

    // Enrichir selon l'agence
    let enrichedData = {};

    if (agency === 'Medin Voyages') {
      enrichedData = enrichMedinVoyages(doc, html);
    } else if (agency === 'Omra Sounnah') {
      enrichedData = enrichOmraSounnah(doc, html);
    }

    console.log('✅ Enriched data:', enrichedData);

    return new Response(
      JSON.stringify({ success: true, data: enrichedData }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Enrichment error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function enrichMedinVoyages(doc: Document, html: string): any {
  const enriched: any = {};

  // Extraire les dates précises
  const datePattern = /(\d{1,2})\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\s+(\d{4})/gi;
  const dateMatches = [...html.matchAll(datePattern)];
  
  if (dateMatches.length >= 2) {
    enriched.dateStart = formatDate(dateMatches[0][1], dateMatches[0][2], dateMatches[0][3]);
    enriched.dateEnd = formatDate(dateMatches[1][1], dateMatches[1][2], dateMatches[1][3]);
  }

  // Extraire la durée
  const durationMatch = html.match(/(\d+)\s*(?:jours?|nuits?)/i);
  if (durationMatch) {
    enriched.durationNights = parseInt(durationMatch[1]) - 1; // jours -> nuits
  }

  // Extraire les nuits par ville
  const makkahMatch = html.match(/(\d+)\s*(?:nuits?|j)\s*(?:à|a)?\s*(?:La\s*)?Mecque|Makkah/i);
  const medinaMatch = html.match(/(\d+)\s*(?:nuits?|j)\s*(?:à|a)?\s*Médine|Medina/i);
  
  if (makkahMatch) enriched.makkahNights = parseInt(makkahMatch[1]);
  if (medinaMatch) enriched.medinaNights = parseInt(medinaMatch[1]);

  // Extraire les distances (chercher "mètres" ou "m" près de "Haram")
  const distancePattern = /(\d+)\s*(?:mètres?|m)\s*(?:du|de|depuis)?\s*(?:la)?\s*Haram/gi;
  const distanceMatch = html.match(distancePattern);
  if (distanceMatch) {
    const dist = distanceMatch[0].match(/(\d+)/);
    if (dist) enriched.distanceToHaram = parseInt(dist[1]);
  }

  // Extraire la pension
  if (html.includes('pension complète')) {
    enriched.board = 'Pension complète';
  } else if (html.includes('demi-pension')) {
    enriched.board = 'Demi-pension';
  } else if (html.includes('petit déjeuner') || html.includes('petit-déjeuner')) {
    enriched.board = 'Petit déjeuner';
  }

  // Extraire les inclusions
  enriched.visaIncluded = html.toLowerCase().includes('visa inclus') || html.toLowerCase().includes('visa compris');
  enriched.flightsIncluded = html.toLowerCase().includes('vol inclus') || html.toLowerCase().includes('billet d\'avion');

  return enriched;
}

function enrichOmraSounnah(doc: Document, html: string): any {
  const enriched: any = {};

  // Extraire les dates précises
  const datePattern = /(\d{1,2})\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)\s+(\d{4})/gi;
  const dateMatches = [...html.matchAll(datePattern)];
  
  if (dateMatches.length >= 2) {
    enriched.dateStart = formatDate(dateMatches[0][1], dateMatches[0][2], dateMatches[0][3]);
    enriched.dateEnd = formatDate(dateMatches[1][1], dateMatches[1][2], dateMatches[1][3]);
  }

  // Extraire la durée
  const durationMatch = html.match(/(\d+)\s*(?:jours?|nuits?)/i);
  if (durationMatch) {
    enriched.durationNights = parseInt(durationMatch[1]);
  }

  // Extraire les nuits par ville
  const makkahMatch = html.match(/(\d+)\s*(?:nuits?|j)\s*(?:à|a)?\s*(?:La\s*)?Mecque|Makkah/i);
  const medinaMatch = html.match(/(\d+)\s*(?:nuits?|j)\s*(?:à|a)?\s*Médine|Medina/i);
  
  if (makkahMatch) enriched.makkahNights = parseInt(makkahMatch[1]);
  if (medinaMatch) enriched.medinaNights = parseInt(medinaMatch[1]);

  // Extraire le prix (si manquant dans JSON)
  const priceMatch = html.match(/(\d+(?:\s?\d+)*)\s*€/);
  if (priceMatch) {
    enriched.price = parseFloat(priceMatch[1].replace(/\s/g, ''));
  }

  // Extraire les distances
  const distancePattern = /(\d+)\s*(?:mètres?|m)\s*(?:du|de|depuis)?\s*(?:la)?\s*Haram/gi;
  const distanceMatch = html.match(distancePattern);
  if (distanceMatch) {
    const dist = distanceMatch[0].match(/(\d+)/);
    if (dist) enriched.distanceToHaram = parseInt(dist[1]);
  }

  // Extraire la formule
  if (html.toLowerCase().includes('confort')) {
    enriched.formula = 'confort';
  } else if (html.toLowerCase().includes('essentiel')) {
    enriched.formula = 'essentiel';
  } else if (html.toLowerCase().includes('premium')) {
    enriched.formula = 'premium';
  }

  // Extraire les hôtels complets (si génériques dans JSON)
  const hotelPattern = /hôtel\s+([A-Za-zÀ-ÿ\s]+?)(?:\s+\d+\s*(?:étoiles?|★|\*))/gi;
  const hotelMatches = [...html.matchAll(hotelPattern)];
  
  if (hotelMatches.length > 0) {
    enriched.hotelMakkah = hotelMatches[0][0];
    if (hotelMatches.length > 1) {
      enriched.hotelMedine = hotelMatches[1][0];
    }
  }

  // Extraire la pension
  if (html.includes('pension complète')) {
    enriched.board = 'Pension complète';
  } else if (html.includes('demi-pension')) {
    enriched.board = 'Demi-pension';
  } else if (html.includes('petit déjeuner')) {
    enriched.board = 'Petit déjeuner';
  }

  enriched.visaIncluded = html.toLowerCase().includes('visa inclus') || html.toLowerCase().includes('visa compris');
  enriched.flightsIncluded = html.toLowerCase().includes('vol inclus') || html.toLowerCase().includes('billet');

  return enriched;
}

function formatDate(day: string, month: string, year: string): string {
  const monthMap: Record<string, string> = {
    'janvier': '01', 'février': '02', 'fevrier': '02', 'mars': '03', 'avril': '04',
    'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08', 'aout': '08',
    'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12', 'decembre': '12'
  };
  
  const monthNum = monthMap[month.toLowerCase()];
  return `${year}-${monthNum}-${day.padStart(2, '0')}`;
}
