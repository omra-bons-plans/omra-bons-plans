import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminCodeRequest {
  email: string;
  ipAddress?: string;
  userAgent?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, ipAddress, userAgent }: AdminCodeRequest = await req.json();
    
    console.log("Admin code request for:", email);

    // Créer un client Supabase avec la clé service
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Vérifier que l'email est bien admin
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

    // Vérifier que l'utilisateur est admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      console.error("User is not admin:", email);
      return new Response(
        JSON.stringify({ error: "Accès non autorisé" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limiting : vérifier les tentatives récentes
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentCodes, error: recentError } = await supabase
      .from('admin_access_codes')
      .select('created_at')
      .eq('user_id', userData.id)
      .gte('created_at', oneHourAgo);

    if (!recentError && recentCodes && recentCodes.length >= 5) {
      return new Response(
        JSON.stringify({ error: "Trop de tentatives. Réessayez dans une heure." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Générer un code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Date d'expiration : 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Supprimer les anciens codes non utilisés de cet utilisateur
    await supabase
      .from('admin_access_codes')
      .delete()
      .eq('user_id', userData.id)
      .is('used_at', null);

    // Insérer le nouveau code
    const { error: insertError } = await supabase
      .from('admin_access_codes')
      .insert({
        user_id: userData.id,
        code,
        expires_at: expiresAt,
        ip_address: ipAddress,
        user_agent: userAgent
      });

    if (insertError) {
      console.error("Error inserting code:", insertError);
      throw insertError;
    }

    // Envoyer l'email avec le code
    const emailResponse = await resend.emails.send({
      from: "Omra Bons Plans Admin <onboarding@resend.dev>",
      to: [email],
      subject: "🔒 Code d'accès administrateur",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .code-box {
              background: #f8f9fa;
              border: 2px dashed #667eea;
              border-radius: 8px;
              padding: 20px;
              margin: 30px 0;
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              text-align: left;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #6c757d;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Accès Administrateur</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Voici votre code d'accès administrateur :</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>

              <div class="warning">
                <strong>⏱️ Attention :</strong> Ce code est valable pendant <strong>5 minutes seulement</strong>. 
                Après ce délai, vous devrez demander un nouveau code.
              </div>

              <p style="color: #6c757d; font-size: 14px;">
                Si vous n'avez pas demandé ce code, ignorez cet email.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Omra Bons Plans - Administration</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Code envoyé par email",
        expiresIn: 300 // 5 minutes en secondes
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
    console.error("Error in send-admin-code function:", error);
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