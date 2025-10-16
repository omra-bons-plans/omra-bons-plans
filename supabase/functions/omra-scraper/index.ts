import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { createHash } from "https://deno.land/std@0.168.0/hash/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScraperConfig {
  agency_name: string;
  agency_url: string;
  scraper_type: 'html' | 'api' | 'csv';
  selectors?: any;
  api_config?: any;
  is_active: boolean;
  respect_robots: boolean;
  rate_limit_ms: number;
}

interface OfferData {
  agency_name: string;
  agency_url: string;
  offer_title: string;
  offer_url: string;
  price_eur: number;
  currency_raw?: string;
  duration_nights?: number;
  month_departure: string;
  date_start?: string;
  date_end?: string;
  departure_city: string;
  formula_type: 'standard' | 'confort' | 'premium' | 'elite' | 'autre';
  board?: 'bb' | 'hb' | 'fb' | 'ai';
  visa_included?: boolean;
  flights_included: boolean;
  medina_nights?: number;
  makkah_nights?: number;
  hotel_medinah?: string;
  hotel_makkah?: string;
  distance_to_haram_m?: number;
  guide_language?: string[];
  notes?: string;
}

function generateSourceHash(agencyName: string, offerUrl: string, dateStart?: string): string {
  const source = `${agencyName}${offerUrl}${dateStart || ''}`;
  return createHash("md5").update(source).toString();
}

function normalizeFormulaType(text: string): 'standard' | 'confort' | 'premium' | 'elite' | 'autre' {
  const lower = text.toLowerCase();
  if (lower.includes('elite') || lower.includes('excellence') || lower.includes('luxe')) return 'elite';
  if (lower.includes('premium') || lower.includes('supérieur')) return 'premium';
  if (lower.includes('confort') || lower.includes('comfort')) return 'confort';
  if (lower.includes('standard') || lower.includes('économique')) return 'standard';
  return 'autre';
}

function normalizeDepartureCity(city: string): string {
  return city.replace(/\s*\([^)]*\)/g, '').trim();
}

async function checkRobotsTxt(domain: string): Promise<boolean> {
  try {
    const response = await fetch(`${domain}/robots.txt`);
    if (!response.ok) return true; // Allow if robots.txt doesn't exist
    
    const text = await response.text();
    const lines = text.split('\n');
    let userAgentMatch = false;
    
    for (const line of lines) {
      if (line.toLowerCase().startsWith('user-agent:')) {
        userAgentMatch = line.includes('*') || line.includes('Googlebot');
      }
      if (userAgentMatch && line.toLowerCase().startsWith('disallow:')) {
        const path = line.split(':')[1]?.trim();
        if (path === '/' || path === '') return false; // Disallowed
      }
    }
    return true; // Allowed
  } catch (error) {
    console.error('Error checking robots.txt:', error);
    return true; // Allow by default if error
  }
}

async function scrapeAgency(config: ScraperConfig, supabase: any): Promise<any> {
  const runId = crypto.randomUUID();
  const startTime = Date.now();
  const stats = {
    offers_scraped: 0,
    offers_added: 0,
    offers_updated: 0,
    offers_errors: 0,
    errors: [] as any[],
  };

  try {
    console.log(`Starting scrape for ${config.agency_name}`);

    // Check robots.txt if required
    if (config.respect_robots) {
      const url = new URL(config.agency_url);
      const allowed = await checkRobotsTxt(`${url.protocol}//${url.host}`);
      if (!allowed) {
        throw new Error('Scraping disallowed by robots.txt');
      }
    }

    // Simulate scraping (replace with actual implementation)
    if (config.scraper_type === 'html') {
      // Rate limit delay
      await new Promise(resolve => setTimeout(resolve, config.rate_limit_ms + Math.random() * 1000));

      const response = await fetch(config.agency_url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; OmraBonsPlansScraper/1.0)',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse HTML and extract offers
      // This is a placeholder - actual implementation depends on agency structure
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      
      // TODO: Implement actual scraping logic using config.selectors
      console.log(`HTML parsed for ${config.agency_name}, implementing scraping logic...`);
      
    } else if (config.scraper_type === 'csv') {
      console.log(`CSV import mode for ${config.agency_name}`);
      // CSV handling will be done via admin interface
    }

    // Log successful run
    await supabase
      .from('omra_scraper_logs')
      .insert({
        agency_name: config.agency_name,
        run_id: runId,
        status: 'success',
        ...stats,
        duration_ms: Date.now() - startTime,
        started_at: new Date(startTime).toISOString(),
        completed_at: new Date().toISOString(),
      });

    // Update config
    await supabase
      .from('omra_scraper_config')
      .update({
        last_scrape_at: new Date().toISOString(),
        last_scrape_status: 'success',
        error_count: 0,
      })
      .eq('agency_name', config.agency_name);

    return { success: true, stats };

  } catch (error) {
    console.error(`Error scraping ${config.agency_name}:`, error);
    
    stats.errors.push({
      message: error.message,
      timestamp: new Date().toISOString(),
    });

    await supabase
      .from('omra_scraper_logs')
      .insert({
        agency_name: config.agency_name,
        run_id: runId,
        status: 'error',
        ...stats,
        error_details: stats.errors,
        duration_ms: Date.now() - startTime,
        started_at: new Date(startTime).toISOString(),
        completed_at: new Date().toISOString(),
      });

    await supabase
      .from('omra_scraper_config')
      .update({
        last_scrape_at: new Date().toISOString(),
        last_scrape_status: 'error',
        error_count: config.error_count + 1,
      })
      .eq('agency_name', config.agency_name);

    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get all active scraper configs
    const { data: configs, error: configError } = await supabaseClient
      .from('omra_scraper_config')
      .select('*')
      .eq('is_active', true);

    if (configError) throw configError;

    if (!configs || configs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active scrapers configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark stale offers before scraping
    await supabaseClient.rpc('mark_stale_omra_offers');

    // Run scrapers sequentially to respect rate limits
    const results = [];
    for (const config of configs) {
      const result = await scrapeAgency(config, supabaseClient);
      results.push({ agency: config.agency_name, ...result });
    }

    // Check for alert conditions
    const errorCount = results.filter(r => !r.success).length;
    const errorRate = errorCount / results.length;
    
    if (errorRate > 0.2) {
      console.warn(`High error rate detected: ${(errorRate * 100).toFixed(1)}%`);
      // TODO: Send Slack/Email alert
    }

    return new Response(
      JSON.stringify({
        message: 'Scraping completed',
        results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.success).length,
          failed: errorCount,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Scraper error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});