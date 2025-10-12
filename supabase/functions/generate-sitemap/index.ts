import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📍 Generating dynamic sitemap...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Static routes
    const staticRoutes = [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/about', changefreq: 'monthly', priority: 0.8 },
      { loc: '/contact', changefreq: 'monthly', priority: 0.7 },
      { loc: '/blog', changefreq: 'daily', priority: 0.9 },
      { loc: '/blog/restaurants', changefreq: 'weekly', priority: 0.8 },
      { loc: '/blog/associations', changefreq: 'weekly', priority: 0.8 },
      { loc: '/blog/vendeurs', changefreq: 'weekly', priority: 0.8 },
      { loc: '/blog/general', changefreq: 'weekly', priority: 0.8 },
      { loc: '/category/sejours', changefreq: 'daily', priority: 0.9 },
      { loc: '/category/vols', changefreq: 'daily', priority: 0.9 },
      { loc: '/category/hebergements', changefreq: 'weekly', priority: 0.8 },
      { loc: '/category/guides', changefreq: 'weekly', priority: 0.8 },
      { loc: '/category/chauffeurs', changefreq: 'weekly', priority: 0.8 },
      { loc: '/category/babysitting', changefreq: 'weekly', priority: 0.7 },
      { loc: '/prayer-times', changefreq: 'daily', priority: 0.8 },
      { loc: '/islamic-calendar', changefreq: 'monthly', priority: 0.7 },
      { loc: '/ramadan-hajj-dates', changefreq: 'yearly', priority: 0.8 },
      { loc: '/comparatif-agences', changefreq: 'monthly', priority: 0.7 },
      { loc: '/agences-liste', changefreq: 'weekly', priority: 0.8 },
      { loc: '/comparatif-visuel', changefreq: 'monthly', priority: 0.6 },
      { loc: '/discussions', changefreq: 'daily', priority: 0.6 },
    ];

    // Fetch published blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('slug, category, updated_at, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (blogError) {
      console.error('Error fetching blog posts:', blogError);
    }

    console.log(`📝 Found ${blogPosts?.length || 0} blog posts`);

    // Fetch active ads (non-expired)
    const { data: ads, error: adsError } = await supabase
      .from('ads')
      .select('id, type, updated_at')
      .gte('publish_end_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1000);

    if (adsError) {
      console.error('Error fetching ads:', adsError);
    }

    console.log(`📢 Found ${ads?.length || 0} active ads`);

    // Generate sitemap XML
    const baseUrl = 'https://omrabonsplans.fr';
    const today = new Date().toISOString().split('T')[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Static Routes -->
`;

    // Add static routes
    staticRoutes.forEach(route => {
      sitemap += `  <url>
    <loc>${baseUrl}${route.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>

`;
    });

    // Add blog posts
    if (blogPosts && blogPosts.length > 0) {
      sitemap += `  <!-- Blog Posts -->\n`;
      blogPosts.forEach(post => {
        const lastmod = post.updated_at 
          ? new Date(post.updated_at).toISOString().split('T')[0]
          : today;
        sitemap += `  <url>
    <loc>${baseUrl}/blog/${post.category}/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

`;
      });
    }

    // Add ads
    if (ads && ads.length > 0) {
      sitemap += `  <!-- Active Listings -->\n`;
      ads.forEach(ad => {
        const lastmod = ad.updated_at 
          ? new Date(ad.updated_at).toISOString().split('T')[0]
          : today;
        sitemap += `  <url>
    <loc>${baseUrl}/ad/${ad.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

`;
      });
    }

    sitemap += `</urlset>`;

    console.log('✅ Sitemap generated successfully');

    return new Response(sitemap, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
