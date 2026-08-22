import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Database {
  public: {
    Tables: {
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read: boolean;
          related_id?: string;
          related_type?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read?: boolean;
          related_id?: string;
          related_type?: string;
        };
      };
      ads: {
        Row: {
          id: string;
          title: string;
          user_id: string;
          publish_end_date?: string;
          is_published: boolean;
          is_draft: boolean;
          is_paused: boolean;
        };
      };
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Clean up old notifications (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error: cleanupError } = await supabase
      .from('notifications')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (cleanupError) {
      console.error('Error cleaning up old notifications:', cleanupError);
    } else {
      console.log('Old notifications cleaned up successfully');
    }

    // 2. Check for ads expiring in 3 days and send notifications
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

    // Get ads expiring in 3 days
    const { data: expiringAds, error: adsError } = await supabase
      .from('ads')
      .select('id, title, user_id, publish_end_date')
      .eq('is_published', true)
      .eq('is_draft', false)
      .eq('is_paused', false)
      .gte('publish_end_date', oneDayFromNow.toISOString())
      .lte('publish_end_date', threeDaysFromNow.toISOString());

    if (adsError) {
      console.error('Error fetching expiring ads:', adsError);
    } else if (expiringAds && expiringAds.length > 0) {
      console.log(`Found ${expiringAds.length} ads expiring soon`);

      for (const ad of expiringAds) {
        if (ad.publish_end_date) {
          const expiryDate = new Date(ad.publish_end_date);
          const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          // Check if we already sent a notification for this ad expiring
          const { data: existingNotification } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', ad.user_id)
            .eq('type', 'ad_expiring')
            .eq('related_id', ad.id)
            .gte('created_at', oneDayFromNow.toISOString())
            .single();

          if (!existingNotification && daysLeft > 0 && daysLeft <= 3) {
            const { error: notificationError } = await supabase
              .from('notifications')
              .insert({
                user_id: ad.user_id,
                type: 'ad_expiring',
                title: 'Annonce bientôt expirée',
                message: `Votre annonce "${ad.title}" expire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}`,
                related_id: ad.id,
                related_type: 'ad'
              });

            if (notificationError) {
              console.error('Error creating expiring notification:', notificationError);
            } else {
              console.log(`Notification sent for ad ${ad.id} expiring in ${daysLeft} days`);
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification maintenance completed'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in notification cleanup:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);