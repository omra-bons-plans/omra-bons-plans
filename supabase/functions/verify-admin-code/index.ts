import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { AdminAlertEmail } from './_templates/admin-alert-email.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  code: string;
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
        JSON.stringify({ error: "Non authentifié" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Vérifier le token JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Authentification invalide" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Vérifier que l'utilisateur est admin
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      console.error("Role check error:", roleError);
      return new Response(
        JSON.stringify({ error: "Accès refusé: Rôle admin requis" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { code }: RequestBody = await req.json();

    if (!code || code.length !== 6) {
      return new Response(
        JSON.stringify({ error: "Code invalide (doit contenir 6 chiffres)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Récupérer le code le plus récent non utilisé pour cet utilisateur
    const { data: codeData, error: codeError } = await supabase
      .from("admin_access_codes")
      .select("*")
      .eq("user_id", user.id)
      .eq("code", code)
      .is("used_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (codeError || !codeData) {
      console.error("Code not found:", codeError);
      return new Response(
        JSON.stringify({ 
          valid: false,
          error: "Code invalide ou déjà utilisé" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Vérifier si le code n'a pas expiré
    const expiresAt = new Date(codeData.expires_at);
    const now = new Date();

    if (now > expiresAt) {
      console.log("Code expired:", { expiresAt, now });
      return new Response(
        JSON.stringify({ 
          valid: false,
          error: "Code expiré. Demandez un nouveau code." 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Générer un token de session sécurisé
    const sessionToken = crypto.randomUUID() + '-' + Date.now();
    const sessionExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                     req.headers.get("x-real-ip") || 
                     null;

    // Marquer le code comme utilisé et créer la session
    const { error: updateError } = await supabase
      .from("admin_access_codes")
      .update({ 
        used_at: new Date().toISOString(),
        session_token: sessionToken,
        session_ip: ipAddress,
        session_expires_at: sessionExpiresAt.toISOString(),
        last_activity_at: new Date().toISOString()
      })
      .eq("id", codeData.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la validation du code" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 🔒 SÉCURITÉ AUTO-AUTORISATION: Approuver automatiquement l'appareil après code valide
    if (codeData.device_fingerprint) {
      console.log("🔐 Auto-authorizing device after successful code verification");
      
      const { data: authResult, error: authError } = await supabase.rpc(
        "authorize_admin_device_auto",
        {
          p_admin_user_id: user.id,
          p_device_fingerprint: codeData.device_fingerprint,
          p_ip_address: ipAddress,
          p_user_agent: codeData.user_agent,
          p_expiry_days: 90
        }
      );

      if (authError) {
        console.error("❌ Failed to auto-authorize device:", authError);
      } else {
        console.log("✅ Device auto-authorized:", authResult);
      }
    }

    console.log("Code verified successfully for user:", user.id, "Session token created");

    // Envoyer l'alerte de sécurité par email en arrière-plan
    EdgeRuntime.waitUntil((async () => {
      try {
        const timestamp = new Date().toLocaleString('fr-FR', { 
          dateStyle: 'full', 
          timeStyle: 'long',
          timeZone: 'Europe/Paris'
        });

        const html = await renderAsync(
          React.createElement(AdminAlertEmail, {
            ipAddress: ipAddress || 'Non disponible',
            userAgent: req.headers.get("user-agent") || 'Non disponible',
            timestamp
          })
        );

        await resend.emails.send({
          from: "OmraBonsPlans Sécurité <onboarding@resend.dev>",
          to: [user.email!],
          subject: "🔒 Alerte: Connexion admin détectée",
          html,
        });

        console.log("Security alert email sent to:", user.email);
      } catch (emailError) {
        console.error("Failed to send alert email:", emailError);
      }
    })());

    return new Response(
      JSON.stringify({ 
        valid: true,
        message: "Code valide - Session sécurisée créée",
        sessionToken,
        sessionExpiresAt: sessionExpiresAt.toISOString(),
        sessionIp: ipAddress
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in verify-admin-code function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
