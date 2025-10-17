import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Liste de user agents suspects
const SUSPICIOUS_USER_AGENTS = [
  'python-requests',
  'curl',
  'wget',
  'scrapy',
  'selenium',
  'puppeteer',
  'phantomjs',
  'bot',
  'crawler',
  'spider',
  'scraper',
  'axios',
  'node-fetch',
  'postman',
  'httpie',
];

// Seuils de détection
const RATE_LIMIT = {
  maxRequestsPerMinute: 60,
  maxRequestsPer5Minutes: 200,
  maxRequestsPerHour: 500,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      ip_address, 
      user_agent, 
      request_path,
      request_count = 1
    } = await req.json();

    console.log('🔍 Vérification anti-scraping:', { ip_address, user_agent, request_path });

    // Vérifier si le user agent est suspect
    const isSuspiciousUserAgent = SUSPICIOUS_USER_AGENTS.some(
      suspicious => user_agent?.toLowerCase().includes(suspicious.toLowerCase())
    );

    // Récupérer l'historique des requêtes de cette IP
    const { data: existingAttempts, error: fetchError } = await supabaseClient
      .from('scraping_attempts')
      .select('*')
      .eq('ip_address', ip_address)
      .order('last_seen_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('Erreur lors de la récupération des tentatives:', fetchError);
    }

    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const fiveMinutesAgo = new Date(now.getTime() - 300000);
    const oneHourAgo = new Date(now.getTime() - 3600000);

    // Compter les requêtes récentes
    const { count: recentCount } = await supabaseClient
      .from('scraping_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip_address)
      .gte('last_seen_at', oneMinuteAgo.toISOString());

    let isBlocked = false;
    let blockedReason = '';

    // Déterminer si l'IP doit être bloquée
    if (isSuspiciousUserAgent) {
      isBlocked = true;
      blockedReason = 'User agent suspect détecté';
    } else if (recentCount && recentCount > RATE_LIMIT.maxRequestsPerMinute) {
      isBlocked = true;
      blockedReason = `Trop de requêtes (${recentCount} en 1 minute)`;
    }

    // Mettre à jour ou créer l'enregistrement
    if (existingAttempts && existingAttempts.length > 0) {
      const existing = existingAttempts[0];
      const { error: updateError } = await supabaseClient
        .from('scraping_attempts')
        .update({
          request_count: existing.request_count + request_count,
          last_seen_at: now.toISOString(),
          is_blocked: isBlocked || existing.is_blocked,
          blocked_reason: isBlocked ? blockedReason : existing.blocked_reason,
          user_agent: user_agent || existing.user_agent,
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour:', updateError);
      }
    } else {
      const { error: insertError } = await supabaseClient
        .from('scraping_attempts')
        .insert({
          ip_address,
          user_agent,
          request_path,
          request_count,
          is_blocked: isBlocked,
          blocked_reason: isBlocked ? blockedReason : null,
          first_seen_at: now.toISOString(),
          last_seen_at: now.toISOString(),
        });

      if (insertError) {
        console.error('Erreur lors de l\'insertion:', insertError);
      }
    }

    return new Response(
      JSON.stringify({
        allowed: !isBlocked,
        blocked: isBlocked,
        reason: blockedReason,
        warning: recentCount && recentCount > 30 ? 'Taux de requêtes élevé détecté' : null,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erreur dans detect-scraping:', error);
    return new Response(
      JSON.stringify({ error: error.message, allowed: true }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
