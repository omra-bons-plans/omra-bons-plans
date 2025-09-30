import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  email: string;
  device_fingerprint?: string;
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

    const { email, device_fingerprint }: RequestBody = await req.json();

    // Vérifier que l'email correspond à celui de l'utilisateur
    if (email !== user.email) {
      return new Response(
        JSON.stringify({ error: "L'email ne correspond pas à l'utilisateur connecté" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Générer un code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Récupérer les données de requête
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || null;
    const userAgent = req.headers.get("user-agent") || null;

    // 🔒 SÉCURITÉ 1: Vérifier le rate limiting (max 3 codes/heure)
    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_admin_code_rate_limit', { p_user_id: user.id });

    if (rateLimitError) {
      console.error("Rate limit check error:", rateLimitError);
      return new Response(
        JSON.stringify({ error: "Erreur de vérification de sécurité" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rateLimitResult = rateLimitCheck as { allowed: boolean; error?: string; retry_after?: string };
    if (!rateLimitResult.allowed) {
      console.warn(`🚨 Rate limit exceeded for user ${user.email}`);
      return new Response(
        JSON.stringify({ 
          error: rateLimitResult.error,
          retry_after: rateLimitResult.retry_after 
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 🔒 SÉCURITÉ 2: Détecter les nouveaux devices/IP
    const { data: deviceCheck, error: deviceError } = await supabase
      .rpc('check_admin_device_fingerprint', {
        p_user_id: user.id,
        p_ip_address: ipAddress,
        p_user_agent: userAgent,
        p_device_fingerprint: device_fingerprint
      });

    if (deviceError) {
      console.error("Device check error:", deviceError);
      return new Response(
        JSON.stringify({ error: "Erreur de vérification de sécurité" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const deviceResult = deviceCheck as { is_new_device: boolean; warning?: string; requires_confirmation?: boolean };
    
    // Si c'est un nouveau device, envoyer une alerte et bloquer
    if (deviceResult.is_new_device && deviceResult.requires_confirmation) {
      console.warn(`🚨 New device detected for user ${user.email}: IP=${ipAddress}, UA=${userAgent}`);
      
      // Envoyer une alerte de sécurité par email
      await resend.emails.send({
        from: "OmraBonsPlans Sécurité <onboarding@resend.dev>",
        to: [email],
        subject: "🚨 Alerte de sécurité: Tentative de connexion depuis un nouvel appareil",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff3cd; border: 2px solid #ffc107;">
            <h1 style="color: #856404;">🚨 Tentative de connexion suspecte détectée</h1>
            <p style="font-size: 16px; color: #856404;">Bonjour,</p>
            <p style="font-size: 16px; color: #856404;">
              Une tentative de connexion à votre compte admin a été détectée depuis un <strong>nouvel appareil ou une nouvelle adresse IP</strong>.
            </p>
            <div style="background-color: #fff; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p><strong>Adresse IP:</strong> ${ipAddress || 'Non disponible'}</p>
              <p><strong>Navigateur:</strong> ${userAgent || 'Non disponible'}</p>
              <p><strong>Date/Heure:</strong> ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
            </div>
            <p style="font-size: 14px; color: #856404;">
              <strong>Si c'était vous:</strong> Contactez l'administrateur système pour autoriser ce nouvel appareil.
            </p>
            <p style="font-size: 14px; color: #dc3545;">
              <strong>Si ce n'était PAS vous:</strong> Votre compte pourrait être compromis. Changez immédiatement votre mot de passe Supabase.
            </p>
            <hr style="border: none; border-top: 1px solid #ffc107; margin: 20px 0;" />
            <p style="font-size: 12px; color: #6c757d; text-align: center;">OmraBonsPlans - Système de sécurité avancé</p>
          </div>
        `,
      });

      return new Response(
        JSON.stringify({ 
          error: "🚨 Nouvel appareil détecté. Un email de sécurité vous a été envoyé. Contactez l'administrateur système pour autoriser ce device.",
          blocked: true,
          device_warning: deviceResult.warning
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Enregistrer le code en base de données avec device fingerprint
    const { error: insertError } = await supabase
      .from("admin_access_codes")
      .insert({
        user_id: user.id,
        code,
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent,
        device_fingerprint: device_fingerprint,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de l'enregistrement du code" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Envoyer l'email avec Resend
    const emailResponse = await resend.emails.send({
      from: "OmraBonsPlans Admin <onboarding@resend.dev>",
      to: [email],
      subject: "🔒 Code de vérification admin",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #0B1E3A; text-align: center;">🔒 Code de Vérification Admin</h1>
          <p style="font-size: 16px; color: #333;">Bonjour,</p>
          <p style="font-size: 16px; color: #333;">Voici votre code de vérification pour accéder à l'interface admin :</p>
          <div style="background-color: #f5f5f5; border: 2px solid #0B1E3A; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <h2 style="color: #0B1E3A; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h2>
          </div>
          <p style="font-size: 14px; color: #666;">⏱️ Ce code est valide pendant <strong>5 minutes</strong>.</p>
          <p style="font-size: 14px; color: #666;">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">OmraBonsPlans - Système de sécurité admin</p>
        </div>
      `,
    });

    console.log("Code envoyé avec succès:", { email, code_length: code.length });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Code envoyé par email",
        expiresAt: expiresAt.toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-admin-code function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
