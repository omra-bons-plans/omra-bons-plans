import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { requireAdmin } from '../_shared/auth.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportOffer {
  nomAgence: string;
  titreOffre?: string | null;
  moisOmra?: string | null;
  dateDepart: string | null;
  dateRetour: string | null;
  nombreJours?: string | null;
  prixQuadruple: number | null;
  villeDepart: string | null;
  hotelMakkah: string | null;
  hotelMedine: string | null;
  etoilesMakkah?: number | null;
  etoilesMedine?: number | null;
  nuitsMecque?: number | null;
  nuitsMedine?: number | null;
  airline: string | null;
  detailUrl: string;
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

    const { offers } = await req.json() as { offers: ImportOffer[] };

    if (!offers || !Array.isArray(offers)) {
      throw new Error('Invalid data format');
    }

    console.log(`📥 Starting import of ${offers.length} offers`);

    let imported = 0;
    let updated = 0;
    let skipped = 0;
    let enriched = 0;

    for (const offer of offers) {
      try {
        // Validation de base
        if (!offer.nomAgence || !offer.detailUrl || !offer.prixQuadruple) {
          console.log(`⚠️ Skipping invalid offer: missing agency, URL, or price`);
          skipped++;
          continue;
        }

        // Normaliser les données
        let normalizedOffer = normalizeOffer(offer);
        
        // Enrichir l'offre si des infos manquent
        if (!normalizedOffer.date_start || !normalizedOffer.distance_to_haram_m || !normalizedOffer.hotel_makkah) {
          try {
            console.log(`🔍 Enriching offer from ${offer.detailUrl}`);
            
            const enrichResponse = await fetch(`${supabaseUrl}/functions/v1/enrich-omra-offer`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`
              },
              body: JSON.stringify({ 
                url: offer.detailUrl, 
                agency: offer.nomAgence 
              })
            });

            if (enrichResponse.ok) {
              const enrichResult = await enrichResponse.json();
              if (enrichResult.success && enrichResult.data) {
                // Fusionner les données enrichies
                Object.assign(normalizedOffer, enrichResult.data);
                enriched++;
                console.log(`✅ Offer enriched with scraped data`);
              }
            }
          } catch (enrichError) {
            console.warn(`⚠️ Failed to enrich offer:`, enrichError);
          }
        }
        
        // Générer un hash unique
        const sourceHash = generateHash(
          `${normalizedOffer.agency_name}-${normalizedOffer.offer_url}-${normalizedOffer.date_start}`
        );

        // Vérifier si l'offre existe déjà
        const { data: existing } = await supabase
          .from('omra_offers')
          .select('id')
          .eq('source_hash', sourceHash)
          .single();

        if (existing) {
          // Mettre à jour l'offre existante
          const { error: updateError } = await supabase
            .from('omra_offers')
            .update({
              ...normalizedOffer,
              updated_at: new Date().toISOString(),
            })
            .eq('source_hash', sourceHash);

          if (updateError) {
            console.error(`❌ Error updating offer:`, updateError);
            skipped++;
          } else {
            updated++;
          }
        } else {
          // Insérer une nouvelle offre
          const { error: insertError } = await supabase
            .from('omra_offers')
            .insert({
              ...normalizedOffer,
              source_hash: sourceHash,
            });

          if (insertError) {
            console.error(`❌ Error inserting offer:`, insertError);
            skipped++;
          } else {
            imported++;
          }
        }
      } catch (err) {
        console.error(`❌ Error processing offer:`, err);
        skipped++;
      }
    }

    const result = {
      success: true,
      imported,
      updated,
      skipped,
      enriched,
      total: offers.length,
    };

    console.log(`✅ Import completed:`, result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Import error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function normalizeOffer(offer: ImportOffer): any {
  // Extraire le mois de départ
  let monthDeparture = offer.moisOmra?.toLowerCase() || '';
  if (!monthDeparture && offer.dateDepart) {
    monthDeparture = extractMonthFromDate(offer.dateDepart);
  }

  // Normaliser les dates
  const dateStart = parseFrenchDate(offer.dateDepart);
  const dateEnd = parseFrenchDate(offer.dateRetour);

  // Extraire la durée
  const durationNights = extractDuration(offer.nombreJours);

  // Déterminer la formule
  const formula = detectFormula(offer.hotelMakkah, offer.hotelMedine);

  // Nettoyer le nom de la ville
  const departureCity = normalizeCityName(offer.villeDepart);

  // Mapper le nom de l'agence
  const agencyName = mapAgencyName(offer.nomAgence);
  const agencyUrl = getAgencyUrl(agencyName);

  // Extraire les étoiles des hôtels (utiliser les données fournies ou extraire du nom)
  const makkahInfo = offer.etoilesMakkah !== null && offer.etoilesMakkah !== undefined
    ? { hotelName: offer.hotelMakkah, stars: offer.etoilesMakkah }
    : extractHotelStars(offer.hotelMakkah);
  
  const medinaInfo = offer.etoilesMedine !== null && offer.etoilesMedine !== undefined
    ? { hotelName: offer.hotelMedine, stars: offer.etoilesMedine }
    : extractHotelStars(offer.hotelMedine);

  // Utiliser les nuits spécifiques ou calculer
  const makkahNights = offer.nuitsMecque || Math.floor((durationNights || 0) / 2);
  const medinaNights = offer.nuitsMedine || Math.floor((durationNights || 0) / 2);

  return {
    agency_name: agencyName,
    agency_url: agencyUrl,
    offer_title: offer.titreOffre || generateTitle(offer),
    offer_url: offer.detailUrl,
    price_eur: offer.prixQuadruple,
    month_departure: monthDeparture,
    date_start: dateStart,
    date_end: dateEnd,
    departure_city: departureCity,
    formula_type: formula,
    duration_nights: durationNights || (makkahNights + medinaNights),
    makkah_nights: makkahNights,
    medina_nights: medinaNights,
    hotel_makkah: makkahInfo.hotelName,
    hotel_medinah: medinaInfo.hotelName,
    hotel_makkah_stars: makkahInfo.stars,
    hotel_medina_stars: medinaInfo.stars,
    distance_to_haram_m: null,
    board: null,
    flights_included: true,
    visa_included: false,
    airline: offer.airline,
    status: 'active',
    guide_language: ['fr'],
  };
}

function parseFrenchDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  
  const frenchMonths: Record<string, string> = {
    'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
    'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
    'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
  };

  // Format: "24 octobre 2025" ou "24/10/2025"
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const match = dateStr.match(/(\d+)\s+(\w+)\s+(\d{4})/);
  if (match) {
    const [, day, month, year] = match;
    const monthNum = frenchMonths[month.toLowerCase()];
    if (monthNum) {
      return `${year}-${monthNum}-${day.padStart(2, '0')}`;
    }
  }

  return null;
}

function extractMonthFromDate(dateStr: string | null): string {
  if (!dateStr) return '';
  
  const frenchMonths: Record<string, string> = {
    'janvier': 'janvier', 'février': 'fevrier', 'mars': 'mars', 'avril': 'avril',
    'mai': 'mai', 'juin': 'juin', 'juillet': 'juillet', 'août': 'aout',
    'septembre': 'septembre', 'octobre': 'octobre', 'novembre': 'novembre', 'décembre': 'decembre'
  };

  for (const [french, normalized] of Object.entries(frenchMonths)) {
    if (dateStr.toLowerCase().includes(french)) {
      return normalized;
    }
  }

  return '';
}

function extractDuration(durationStr: string | null): number | null {
  if (!durationStr) return null;
  
  const match = durationStr.match(/(\d+)\s*(?:jours|nuits)/i);
  return match ? parseInt(match[1]) : null;
}

function detectFormula(hotelMakkah: string | null, hotelMedine: string | null): string {
  const text = `${hotelMakkah || ''} ${hotelMedine || ''}`.toLowerCase();
  
  if (text.includes('5 étoiles') || text.includes('5*') || text.includes('luxury') || text.includes('prestige')) {
    return 'confort';
  }
  
  return 'essentiel';
}

function normalizeCityName(city: string | null): string {
  if (!city) return 'Paris';
  
  // Nettoyer seulement les préfixes "de" et "depuis", garder le reste
  let cleaned = city.trim()
    .replace(/^de\s+/i, '')
    .replace(/^depuis\s+/i, '');
  
  // Capitaliser la première lettre
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  
  return cleaned;
}

function mapAgencyName(name: string): string {
  const normalized = name.toLowerCase().replace(/\s+/g, '');
  
  if (normalized.includes('omrasounnah')) return 'Omra Sounnah';
  if (normalized.includes('medinvoyages') || normalized.includes('medin')) return 'Medin Voyages';
  if (normalized.includes('albayt')) return 'Albayt Voyages';
  
  return name;
}

function getAgencyUrl(agencyName: string): string {
  const urls: Record<string, string> = {
    'Omra Sounnah': 'https://www.omrasounnah.com',
    'Medin Voyages': 'https://medinvoyages.com',
    'Albayt Voyages': 'https://www.albayt.fr',
  };
  
  return urls[agencyName] || '';
}

function generateTitle(offer: ImportOffer): string {
  const month = offer.moisOmra || 'Omra';
  let city = offer.villeDepart || 'Paris';
  // Nettoyer le préfixe "de " ou "depuis " s'il existe
  city = city.replace(/^de\s+/i, '').replace(/^depuis\s+/i, '');
  return `Omra ${month} depuis ${city}`;
}

// Extraire les étoiles du nom d'hôtel
function extractHotelStars(hotelName: string | null): { hotelName: string | null, stars: number | null } {
  if (!hotelName) return { hotelName: null, stars: null };
  
  // Chercher le pattern "X étoile(s)" ou "(X étoiles)"
  const starsMatch = hotelName.match(/\((\d)\s*étoiles?\)|(\d)\s*étoiles?/i);
  if (starsMatch) {
    const stars = parseInt(starsMatch[1] || starsMatch[2]);
    // Nettoyer le nom en enlevant la mention des étoiles
    const cleanName = hotelName.replace(/\s*\(\d\s*étoiles?\)|\d\s*étoiles?/gi, '').trim();
    return { hotelName: cleanName, stars };
  }
  
  return { hotelName: hotelName.trim(), stars: null };
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
