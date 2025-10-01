import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { sourcePath, targetPath, quality = 40, width, height } = await req.json();

    console.log('🔄 Converting image:', { sourcePath, targetPath, quality, width, height });

    // Download source image from Supabase Storage
    const { data: sourceData, error: downloadError } = await supabase.storage
      .from('ad-images')
      .download(sourcePath);

    if (downloadError) {
      console.error('❌ Download error:', downloadError);
      return new Response(JSON.stringify({ error: 'Failed to download source image' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Downloaded source image, size:', sourceData.size);

    // Convert to WebP using Supabase's built-in image transformation
    // We'll use the transformation API instead of processing locally
    const transformUrl = `${supabaseUrl}/storage/v1/render/image/public/ad-images/${sourcePath}`;
    const params = new URLSearchParams({
      width: width?.toString() || '1920',
      ...(height ? { height: height.toString() } : {}),
      quality: quality.toString(),
      format: 'webp',
      resize: 'cover'
    });

    console.log('🔧 Fetching transformed image from:', `${transformUrl}?${params}`);

    const transformResponse = await fetch(`${transformUrl}?${params}`);
    if (!transformResponse.ok) {
      console.error('❌ Transform error:', transformResponse.status);
      return new Response(JSON.stringify({ error: 'Failed to transform image' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const webpBlob = await transformResponse.blob();
    console.log('✅ Transformed to WebP, size:', webpBlob.size);

    // Upload WebP to storage
    const { error: uploadError } = await supabase.storage
      .from('ad-images')
      .upload(targetPath, webpBlob, {
        contentType: 'image/webp',
        upsert: true
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      return new Response(JSON.stringify({ error: 'Failed to upload WebP image' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ WebP uploaded successfully to:', targetPath);

    return new Response(
      JSON.stringify({ 
        success: true, 
        path: targetPath,
        originalSize: sourceData.size,
        webpSize: webpBlob.size,
        compression: Math.round((1 - webpBlob.size / sourceData.size) * 100)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});