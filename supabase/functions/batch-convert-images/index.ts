import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
// @ts-ignore - Sharp pour Deno
import sharp from 'npm:sharp@0.33.2';

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

    console.log('🚀 Batch conversion démarrée, quality:', quality);

    // Lister tous les fichiers récursivement
    const allFiles: string[] = [];
    
    async function listRecursive(prefix: string = '') {
      const { data: items, error } = await supabase.storage
        .from('ad-images')
        .list(prefix, { limit: 1000 });

      if (error || !items) return;

      for (const item of items) {
        const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
        
        if (item.id) {
          const ext = item.name.split('.').pop()?.toLowerCase();
          if (['png', 'jpg', 'jpeg'].includes(ext || '')) {
            allFiles.push(fullPath);
          }
        } else {
          await listRecursive(fullPath);
        }
      }
    }

    await listRecursive();
    console.log(`📊 ${allFiles.length} images à convertir`);

    const results: ConversionResult[] = [];
    let converted = 0;
    let failed = 0;

    // Traiter par batch de 5 pour limiter la charge
    const BATCH_SIZE = 5;
    
    for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
      const batch = allFiles.slice(i, i + BATCH_SIZE);
      
      await Promise.all(batch.map(async (filePath) => {
        try {
          // Télécharger l'image
          const { data: originalData, error: downloadError } = await supabase.storage
            .from('ad-images')
            .download(filePath);

          if (downloadError) throw downloadError;
          const originalSize = originalData.size;

          // Convertir en WebP avec Sharp
          console.log(`🔄 Compression de ${filePath} avec Sharp (qualité: ${quality})`);
          const originalBuffer = await originalData.arrayBuffer();
          
          const webpBuffer = await sharp(Buffer.from(originalBuffer))
            .webp({ quality })
            .toBuffer();
          
          const webpBlob = new Blob([webpBuffer], { type: 'image/webp' });
          const webpSize = webpBlob.size;
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
          console.log(`✅ ${filePath} → ${webpPath} (${compressionPercent}%)`);

        } catch (error) {
          failed++;
          console.error(`❌ ${filePath}:`, error);
          results.push({
            path: filePath,
            success: false,
            originalSize: 0,
            webpSize: 0,
            compression: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }));
    }

    // Mise à jour des références BDD
    console.log('🔄 Mise à jour BDD...');
    
    const { data: ads } = await supabase
      .from('ads')
      .select('id, cover_image, images')
      .not('cover_image', 'is', null);

    if (ads) {
      for (const ad of ads) {
        const updates: any = {};
        if (ad.cover_image?.match(/\.(png|jpg|jpeg)$/i)) {
          updates.cover_image = ad.cover_image.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        }
        if (ad.images?.length) {
          updates.images = ad.images.map((img: string) => 
            img.replace(/\.(png|jpg|jpeg)$/i, '.webp')
          );
        }
        if (Object.keys(updates).length) {
          await supabase.from('ads').update(updates).eq('id', ad.id);
        }
      }
    }

    const { data: posts } = await supabase
      .from('blog_posts')
      .select('id, cover_image, images')
      .not('cover_image', 'is', null);

    if (posts) {
      for (const post of posts) {
        const updates: any = {};
        if (post.cover_image?.match(/\.(png|jpg|jpeg)$/i)) {
          updates.cover_image = post.cover_image.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        }
        if (post.images?.length) {
          updates.images = post.images.map((img: string) => 
            img.replace(/\.(png|jpg|jpeg)$/i, '.webp')
          );
        }
        if (Object.keys(updates).length) {
          await supabase.from('blog_posts').update(updates).eq('id', post.id);
        }
      }
    }

    const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalWebpSize = results.reduce((sum, r) => sum + r.webpSize, 0);
    const totalCompression = totalOriginalSize > 0 
      ? Math.round((1 - totalWebpSize / totalOriginalSize) * 100) 
      : 0;

    return new Response(
      JSON.stringify({
        success: true,
        converted,
        failed,
        total: allFiles.length,
        results,
        summary: {
          totalOriginalSize: Math.round(totalOriginalSize / 1024 / 1024),
          totalWebpSize: Math.round(totalWebpSize / 1024 / 1024),
          totalCompression
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('💥 Erreur:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
