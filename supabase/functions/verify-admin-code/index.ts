import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyCodeRequest {
  email: string;
  code: string;
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code, ipAddress, userAgent, deviceFingerprint }: VerifyCodeRequest = await req.json();
    
    console.log("Verify admin code for:", email);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Récupérer l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.error("User not found:", email);
      return new Response(
        JSON.stringify({ error: "Utilisateur non trouvé" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Vérifier le code
    const { data: codeData, error: codeError } = await supabase
      .from('admin_access_codes')
      .select('*')
      .eq('user_id', userData.id)
      .eq('code', code)
      .is('used_at', null)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (codeError || !codeData) {
      console.error("Invalid or expired code");
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Code invalide ou expiré" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Générer un token de session
    const sessionToken = crypto.randomUUID();
    const sessionExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes

    // Marquer le code comme utilisé et créer la session
    const { error: updateError } = await supabase
      .from('admin_access_codes')
      .update({
        used_at: new Date().toISOString(),
        session_token: sessionToken,
        session_ip: ipAddress,
        session_expires_at: sessionExpiresAt,
        device_fingerprint: deviceFingerprint,
        last_activity_at: new Date().toISOString()
      })
      .eq('id', codeData.id);

    if (updateError) {
      console.error("Error updating code:", updateError);
      throw updateError;
    }

    console.log("Code verified successfully, session created");

    return new Response(
      JSON.stringify({ 
        success: true,
        sessionToken,
        expiresAt: sessionExpiresAt,
        message: "Accès accordé"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-admin-code function:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);