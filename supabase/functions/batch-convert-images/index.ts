import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversionResult {
  path: string;
  success: boolean;
  originalSize: number;
  webpSize: number;
  compression: number;
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { quality = 40 } = await req.json();

    console.log('🚀 Starting batch conversion with quality:', quality);

    // List all files in ad-images bucket
    const { data: files, error: listError } = await supabase.storage
      .from('ad-images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (listError) {
      throw listError;
    }

    console.log(`📁 Found ${files?.length || 0} items in root`);

    // Recursively list all files
    const allFiles: string[] = [];
    
    async function listRecursive(prefix: string = '') {
      const { data: items, error } = await supabase.storage
        .from('ad-images')
        .list(prefix, { limit: 1000 });

      if (error || !items) return;

      for (const item of items) {
        const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
        
        if (item.metadata) {
          // It's a file
          const ext = item.name.split('.').pop()?.toLowerCase();
          if (['png', 'jpg', 'jpeg'].includes(ext || '')) {
            allFiles.push(fullPath);
          }
        } else {
          // It's a folder, recurse
          await listRecursive(fullPath);
        }
      }
    }

    await listRecursive();
    console.log(`📊 Total images to convert: ${allFiles.length}`);

    // Convert each image
    const results: ConversionResult[] = [];
    let converted = 0;
    let failed = 0;

    for (const filePath of allFiles) {
      try {
        console.log(`🔄 Converting ${converted + 1}/${allFiles.length}: ${filePath}`);

        // Download original
        const { data: originalData, error: downloadError } = await supabase.storage
          .from('ad-images')
          .download(filePath);

        if (downloadError) throw downloadError;

        const originalSize = originalData.size;

        // Determine dimensions based on file path
        let width = 800;
        let height = 600;
        
        if (filePath.includes('hero') || filePath.includes('lovable-uploads')) {
          if (filePath.includes('desktop')) {
            width = 1920;
            height = 1080;
          } else if (filePath.includes('mobile') || filePath.includes('d5128689')) {
            width = 640;
            height = 960;
          }
        }

        // Convert via Supabase transformation API
        const transformUrl = `${supabaseUrl}/storage/v1/render/image/public/ad-images/${filePath}`;
        const params = new URLSearchParams({
          width: width.toString(),
          height: height.toString(),
          quality: quality.toString(),
          format: 'webp',
          resize: 'cover'
        });

        const transformResponse = await fetch(`${transformUrl}?${params}`);
        if (!transformResponse.ok) throw new Error('Transform failed');

        const webpBlob = await transformResponse.blob();
        const webpSize = webpBlob.size;

        // Generate WebP path
        const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

        // Upload WebP
        const { error: uploadError } = await supabase.storage
          .from('ad-images')
          .upload(webpPath, webpBlob, {
            contentType: 'image/webp',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const compressionPercent = Math.round((1 - webpSize / originalSize) * 100);

        results.push({
          path: filePath,
          success: true,
          originalSize,
          webpSize,
          compression: compressionPercent
        });

        converted++;
        console.log(`✅ Converted ${filePath} -> ${webpPath} (${compressionPercent}% compression)`);

      } catch (error) {
        failed++;
        console.error(`❌ Failed to convert ${filePath}:`, error);
        results.push({
          path: filePath,
          success: false,
          originalSize: 0,
          webpSize: 0,
          compression: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Update database references
    console.log('🔄 Updating database references...');
    
    // Update ads table
    const { data: ads } = await supabase
      .from('ads')
      .select('id, cover_image, images')
      .not('cover_image', 'is', null);

    if (ads) {
      for (const ad of ads) {
        let updated = false;
        const updates: any = {};

        if (ad.cover_image?.match(/\.(png|jpg|jpeg)$/i)) {
          updates.cover_image = ad.cover_image.replace(/\.(png|jpg|jpeg)$/i, '.webp');
          updated = true;
        }

        if (ad.images && Array.isArray(ad.images)) {
          updates.images = ad.images.map((img: string) => 
            img.replace(/\.(png|jpg|jpeg)$/i, '.webp')
          );
          updated = true;
        }

        if (updated) {
          await supabase
            .from('ads')
            .update(updates)
            .eq('id', ad.id);
        }
      }
    }

    // Update blog_posts table
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('id, cover_image, images')
      .not('cover_image', 'is', null);

    if (posts) {
      for (const post of posts) {
        let updated = false;
        const updates: any = {};

        if (post.cover_image?.match(/\.(png|jpg|jpeg)$/i)) {
          updates.cover_image = post.cover_image.replace(/\.(png|jpg|jpeg)$/i, '.webp');
          updated = true;
        }

        if (post.images && Array.isArray(post.images)) {
          updates.images = post.images.map((img: string) => 
            img.replace(/\.(png|jpg|jpeg)$/i, '.webp')
          );
          updated = true;
        }

        if (updated) {
          await supabase
            .from('blog_posts')
            .update(updates)
            .eq('id', post.id);
        }
      }
    }

    console.log('✅ Database references updated');

    const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalWebpSize = results.reduce((sum, r) => sum + r.webpSize, 0);
    const totalCompression = Math.round((1 - totalWebpSize / totalOriginalSize) * 100);

    return new Response(
      JSON.stringify({
        success: true,
        converted,
        failed,
        total: allFiles.length,
        results,
        summary: {
          totalOriginalSize: Math.round(totalOriginalSize / 1024 / 1024), // MB
          totalWebpSize: Math.round(totalWebpSize / 1024 / 1024), // MB
          totalCompression
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Batch conversion error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});