import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  request_id: string;
  action: "approve" | "reject";
  notes?: string;
  expiry_days?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authentifier l'utilisateur
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Authentication failed");
    }

    // Vérifier que l'utilisateur est admin
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: "Accès refusé: Super-admin requis" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { request_id, action, notes, expiry_days = 90 }: RequestBody = await req.json();

    // Appeler la fonction PostgreSQL
    const { data: result, error: funcError } = await supabase.rpc(
      "authorize_admin_device",
      {
        p_request_id: request_id,
        p_authorizer_id: user.id,
        p_action: action,
        p_notes: notes,
        p_expiry_days: expiry_days,
      }
    );

    if (funcError) {
      throw funcError;
    }

    if (!result?.success) {
      return new Response(JSON.stringify({ error: result?.error || "Erreur inconnue" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Récupérer les détails de la demande pour l'email
    const { data: authRequest, error: fetchError } = await supabase
      .from("admin_device_authorizations")
      .select(`
        *,
        admin_user:admin_user_id (email),
        authorizer:authorized_by (email)
      `)
      .eq("id", request_id)
      .single();

    if (!fetchError && authRequest) {
      // Envoyer un email de notification à l'admin qui a fait la demande
      const adminEmail = authRequest.admin_user?.email;
      const actionText = action === "approve" ? "APPROUVÉE" : "REFUSÉE";
      const statusEmoji = action === "approve" ? "✅" : "❌";

      if (adminEmail) {
        try {
          await resend.emails.send({
            from: "MRA Omra <onboarding@resend.dev>",
            to: [adminEmail],
            subject: `${statusEmoji} Autorisation appareil ${actionText}`,
            html: `
              <h2>${statusEmoji} Votre demande d'autorisation a été ${actionText.toLowerCase()}</h2>
              
              <p><strong>Détails de l'appareil :</strong></p>
              <ul>
                <li>IP: ${authRequest.ip_address || "N/A"}</li>
                <li>User Agent: ${authRequest.user_agent || "N/A"}</li>
                <li>Fingerprint: ${authRequest.device_fingerprint}</li>
              </ul>
              
              ${action === "approve" ? `
                <p><strong>Validité:</strong> ${expiry_days} jours</p>
                <p>Vous pouvez maintenant accéder à l'interface admin depuis cet appareil.</p>
              ` : ""}
              
              ${notes ? `<p><strong>Note de l'administrateur:</strong> ${notes}</p>` : ""}
              
              <p>Demande traitée par: ${authRequest.authorizer?.email || "Système"}</p>
              <p>Date: ${new Date().toLocaleString("fr-FR")}</p>
            `,
          });
        } catch (emailError) {
          console.error("Erreur envoi email:", emailError);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Erreur authorize-admin-device:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
