import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckRequest {
  path: string;
  userAgent?: string;
}

// Liste de user agents suspects (bots connus)
const SUSPICIOUS_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'java',
  'node', 'axios', 'requests', 'scrapy', 'headless', 'phantom', 'selenium'
];

// Vérifier si le user agent est suspect
const isSuspiciousUserAgent = (userAgent: string): boolean => {
  const lowerUA = userAgent.toLowerCase();
  return SUSPICIOUS_USER_AGENTS.some(suspect => lowerUA.includes(suspect));
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { path, userAgent } = await req.json() as CheckRequest;
    
    // Extraire l'IP du client
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    const actualUserAgent = userAgent || req.headers.get('user-agent') || 'unknown';

    console.log(`Checking request from IP: ${clientIP}, User-Agent: ${actualUserAgent}, Path: ${path}`);

    // Vérifier si cette IP est déjà bloquée
    const { data: existingAttempts, error: fetchError } = await supabase
      .from('scraping_attempts')
      .select('*')
      .eq('ip_address', clientIP)
      .eq('is_blocked', true)
      .order('last_seen_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error('Error fetching scraping attempts:', fetchError);
    }

    // Si IP bloquée récemment (dans les dernières 24h)
    if (existingAttempts && existingAttempts.length > 0) {
      const lastAttempt = existingAttempts[0];
      const lastSeenDate = new Date(lastAttempt.last_seen_at);
      const hoursSinceLastAttempt = (Date.now() - lastSeenDate.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastAttempt < 24) {
        console.log(`IP ${clientIP} is blocked`);
        return new Response(
          JSON.stringify({ 
            blocked: true, 
            reason: 'IP temporarily blocked due to suspicious activity',
            retryAfter: Math.ceil(24 - hoursSinceLastAttempt)
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Vérifier le user agent
    const isSuspicious = isSuspiciousUserAgent(actualUserAgent);
    
    if (isSuspicious) {
      console.log(`Suspicious user agent detected: ${actualUserAgent}`);
      
      // Logger la tentative suspecte
      await supabase.from('scraping_attempts').insert({
        ip_address: clientIP,
        user_agent: actualUserAgent,
        request_path: path,
        is_blocked: true,
        blocked_reason: 'Suspicious user agent detected'
      });

      return new Response(
        JSON.stringify({ 
          blocked: true, 
          reason: 'Suspicious user agent detected',
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Compter les requêtes de cette IP dans les dernières 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: recentAttempts, error: countError } = await supabase
      .from('scraping_attempts')
      .select('request_count', { count: 'exact' })
      .eq('ip_address', clientIP)
      .gte('last_seen_at', fiveMinutesAgo);

    if (countError) {
      console.error('Error counting recent attempts:', countError);
    }

    const requestCount = recentAttempts?.reduce((sum, attempt) => sum + (attempt.request_count || 0), 0) || 0;

    // Rate limiting: plus de 50 requêtes en 5 minutes = suspect
    if (requestCount > 50) {
      console.log(`Rate limit exceeded for IP ${clientIP}: ${requestCount} requests`);
      
      await supabase.from('scraping_attempts').insert({
        ip_address: clientIP,
        user_agent: actualUserAgent,
        request_path: path,
        request_count: requestCount,
        is_blocked: true,
        blocked_reason: `Rate limit exceeded: ${requestCount} requests in 5 minutes`
      });

      return new Response(
        JSON.stringify({ 
          blocked: true, 
          reason: 'Rate limit exceeded',
          requestCount,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Logger la requête normale
    const { data: existingLog } = await supabase
      .from('scraping_attempts')
      .select('*')
      .eq('ip_address', clientIP)
      .gte('last_seen_at', fiveMinutesAgo)
      .limit(1)
      .single();

    if (existingLog) {
      // Mettre à jour le compteur
      await supabase
        .from('scraping_attempts')
        .update({
          request_count: (existingLog.request_count || 0) + 1,
          last_seen_at: new Date().toISOString(),
        })
        .eq('id', existingLog.id);
    } else {
      // Créer un nouveau log
      await supabase.from('scraping_attempts').insert({
        ip_address: clientIP,
        user_agent: actualUserAgent,
        request_path: path,
        request_count: 1,
        is_blocked: false,
      });
    }

    return new Response(
      JSON.stringify({ 
        blocked: false,
        message: 'Request allowed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in check-scraping function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
