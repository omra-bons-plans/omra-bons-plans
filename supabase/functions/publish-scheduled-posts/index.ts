import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('Starting scheduled posts publication check...')

    // Récupérer tous les articles programmés dont la date de publication est passée
    const { data: scheduledPosts, error: fetchError } = await supabaseClient
      .from('blog_posts')
      .select('*')
      .eq('is_published', false)
      .not('scheduled_publish_at', 'is', null)
      .lte('scheduled_publish_at', new Date().toISOString())

    if (fetchError) {
      console.error('Error fetching scheduled posts:', fetchError)
      throw fetchError
    }

    console.log(`Found ${scheduledPosts?.length || 0} posts to publish`)

    if (scheduledPosts && scheduledPosts.length > 0) {
      // Publier tous les articles dont l'heure est arrivée
      const { error: updateError } = await supabaseClient
        .from('blog_posts')
        .update({ 
          is_published: true,
          published_at: new Date().toISOString(),
          scheduled_publish_at: null // Nettoyer la date programmée
        })
        .in('id', scheduledPosts.map(post => post.id))

      if (updateError) {
        console.error('Error updating posts:', updateError)
        throw updateError
      }

      console.log(`Successfully published ${scheduledPosts.length} posts`)

      // Créer des notifications pour les auteurs
      for (const post of scheduledPosts) {
        try {
          await supabaseClient
            .from('notifications')
            .insert({
              user_id: post.author_id,
              type: 'system',
              title: 'Article publié',
              message: `Votre article "${post.title}" a été publié automatiquement comme programmé.`,
              related_type: 'blog_post',
              related_id: post.id
            })
        } catch (notifError) {
          console.error('Error creating notification for post', post.id, ':', notifError)
          // Continue même si la notification échoue
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        published_count: scheduledPosts?.length || 0,
        message: `Successfully processed ${scheduledPosts?.length || 0} scheduled posts`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in publish-scheduled-posts function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: (error as Error).message,
        success: false 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})