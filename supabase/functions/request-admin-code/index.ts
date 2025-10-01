import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, userEmail } = await req.json();

    if (!userId || !userEmail) {
      return new Response(
        JSON.stringify({ error: 'userId et userEmail sont requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Vérifier que l'utilisateur est admin
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Accès refusé: vous n\'êtes pas administrateur' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Générer un code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Calculer l'expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Invalider tous les codes précédents non utilisés pour cet utilisateur
    await supabase
      .from('admin_access_codes')
      .update({ expires_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('used_at', null);

    // Insérer le nouveau code
    const { error: insertError } = await supabase
      .from('admin_access_codes')
      .insert({
        user_id: userId,
        code: code,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error('Erreur insertion code:', insertError);
      throw insertError;
    }

    // Envoyer l'email avec le code
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px; }
            .code-box { background: #f7f7f7; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px; }
            .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Code d'accès administrateur</h1>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Vous avez demandé un accès à l'interface d'administration d'<strong>OmraBonsPlans.fr</strong>.</p>
              
              <div class="code-box">
                <p style="margin: 0; color: #666; font-size: 14px;">Votre code de vérification :</p>
                <div class="code">${code}</div>
              </div>

              <div class="warning">
                <strong>⏱️ Ce code expire dans 5 minutes</strong><br>
                Après ce délai, vous devrez demander un nouveau code.
              </div>

              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>Note de sécurité :</strong> Si vous n'avez pas demandé ce code, ignorez cet email. 
                Votre compte reste sécurisé et personne ne peut y accéder sans ce code.
              </p>
            </div>
            <div class="footer">
              <p>© 2025 OmraBonsPlans.fr - Tous droits réservés</p>
              <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'OmraBonsPlans.fr Admin <noreply@omrabonsplans.fr>',
      to: [userEmail],
      subject: '🔐 Votre code d\'accès administrateur - OmraBonsPlans.fr',
      html: emailHtml,
    });

    if (emailError) {
      console.error('Erreur envoi email:', emailError);
      throw emailError;
    }

    console.log(`✅ Code admin envoyé à ${userEmail}, expire dans 5 minutes`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Code envoyé par email',
        expiresAt 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Erreur request-admin-code:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
