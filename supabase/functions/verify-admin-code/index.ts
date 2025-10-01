import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, code } = await req.json();

    if (!userId || !code) {
      return new Response(
        JSON.stringify({ error: 'userId et code sont requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Chercher le code dans la base
    const { data: codeData, error: fetchError } = await supabase
      .from('admin_access_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .is('used_at', null)
      .single();

    if (fetchError || !codeData) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Code invalide ou déjà utilisé' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier si le code a expiré
    const now = new Date();
    const expiresAt = new Date(codeData.expires_at);

    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Code expiré. Demandez un nouveau code.' 
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Marquer le code comme utilisé
    const { error: updateError } = await supabase
      .from('admin_access_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', codeData.id);

    if (updateError) {
      console.error('Erreur mise à jour code:', updateError);
      throw updateError;
    }

    console.log(`✅ Code vérifié avec succès pour l'utilisateur ${userId}`);

    // Créer un token de session admin (valable 24h)
    const sessionToken = crypto.randomUUID();
    const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Stocker le token de session
    const { error: sessionError } = await supabase
      .from('admin_access_codes')
      .update({ 
        session_token: sessionToken,
        session_expires_at: sessionExpiresAt 
      })
      .eq('id', codeData.id);

    if (sessionError) {
      console.error('Erreur création session:', sessionError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Code vérifié avec succès',
        sessionToken,
        sessionExpiresAt
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Erreur verify-admin-code:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
