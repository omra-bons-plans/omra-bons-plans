import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  sessionToken: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Vérifier l'authentification
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ valid: false, error: "Non authentifié" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Vérifier le token JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ valid: false, error: "Authentification invalide" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { sessionToken }: RequestBody = await req.json();

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ valid: false, error: "Token de session requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Récupérer l'IP actuelle
    const currentIp = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                     req.headers.get("x-real-ip") || 
                     null;

    // Appeler la fonction PostgreSQL pour vérifier la session
    const { data: validationResult, error: validationError } = await supabase
      .rpc('verify_admin_session', {
        p_session_token: sessionToken,
        p_user_id: user.id,
        p_current_ip: currentIp
      });

    if (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ valid: false, error: "Erreur lors de la validation de la session" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = validationResult as { valid: boolean; error?: string; warning?: string; expired?: boolean; session_expires_at?: string };

    if (!result.valid) {
      console.log("Session invalid:", result.error);
      return new Response(
        JSON.stringify({ 
          valid: false,
          error: result.error,
          expired: result.expired || false
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Alerte si changement d'IP
    if (result.warning) {
      console.warn(`⚠️ Security Alert for user ${user.email}: ${result.warning}`);
    }

    console.log("Session validated successfully for user:", user.id);

    return new Response(
      JSON.stringify({ 
        valid: true,
        warning: result.warning,
        sessionExpiresAt: result.session_expires_at
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in validate-admin-session function:", error);
    return new Response(
      JSON.stringify({ valid: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
