import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🧹 Suppression de TOUTES les offres Omra en cours...')

    // Supprimer TOUTES les offres Omra
    const { data: deletedOffers, error: deleteError } = await supabaseClient
      .from('omra_offers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Supprime tout
      .select('id, agency_name, offer_title')

    if (deleteError) {
      console.error('❌ Erreur lors de la suppression:', deleteError)
      throw deleteError
    }

    const deletedCount = deletedOffers?.length || 0
    console.log(`✅ ${deletedCount} offres supprimées`)

    // Grouper par agence
    const byAgency: Record<string, number> = {}
    deletedOffers?.forEach(offer => {
      byAgency[offer.agency_name] = (byAgency[offer.agency_name] || 0) + 1
    })

    return new Response(
      JSON.stringify({
        success: true,
        deleted: deletedCount,
        byAgency,
        message: `${deletedCount} offres supprimées`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Erreur:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: (error as Error).message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
