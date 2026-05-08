/**
 * Netlify Edge Function — Dynamic sitemap.xml
 *
 * Why: The static public/sitemap.xml is manually maintained and misses new
 * blog posts added via the admin. Googlebot then reports "no referring sitemap"
 * for those pages and refuses to index them.
 *
 * What it does: Fetches all published blog posts from Supabase on each request
 * and returns a fresh sitemap that always includes every article.
 */

import type { Context } from "netlify:edge";

const SITE = "https://omrabonsplans.fr";

const STATIC_URLS: Array<{ loc: string; changefreq: string; priority: string; lastmod?: string }> = [
  { loc: `${SITE}/`, changefreq: "daily", priority: "1.00" },
  { loc: `${SITE}/bons-plans`, changefreq: "daily", priority: "0.80" },
  { loc: `${SITE}/hajj`, changefreq: "daily", priority: "0.90" },
  { loc: `${SITE}/hajj-2026`, changefreq: "weekly", priority: "0.95" },
  { loc: `${SITE}/about`, changefreq: "monthly", priority: "0.60" },
  { loc: `${SITE}/contact`, changefreq: "monthly", priority: "0.60" },
  { loc: `${SITE}/comparateur-omra-france`, changefreq: "monthly", priority: "0.95" },
  { loc: `${SITE}/comparatif-agences`, changefreq: "weekly", priority: "0.90" },
  { loc: `${SITE}/agences-liste`, changefreq: "weekly", priority: "0.80" },
  { loc: `${SITE}/comparatif-visuel`, changefreq: "monthly", priority: "0.60" },
  { loc: `${SITE}/guide-omra-pas-chere`, changefreq: "monthly", priority: "0.90" },
  { loc: `${SITE}/guide-hajj-4-ecoles`, changefreq: "monthly", priority: "0.85" },
  { loc: `${SITE}/definition-omra`, changefreq: "monthly", priority: "0.90" },
  { loc: `${SITE}/conditions-omra`, changefreq: "monthly", priority: "0.85" },
  { loc: `${SITE}/rites-omra`, changefreq: "monthly", priority: "0.90" },
  { loc: `${SITE}/visa-omra-france`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/quand-partir-omra`, changefreq: "monthly", priority: "0.88" },
  { loc: `${SITE}/prix-omra-2026`, changefreq: "weekly", priority: "0.90" },
  { loc: `${SITE}/liste-bagages-omra`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/meilleure-agence-omra`, changefreq: "monthly", priority: "0.85" },
  { loc: `${SITE}/omra-tout-compris`, changefreq: "weekly", priority: "0.90" },
  { loc: `${SITE}/omra-debutant`, changefreq: "monthly", priority: "0.88" },
  { loc: `${SITE}/omra-ramadan-2026`, changefreq: "weekly", priority: "0.90" },
  { loc: `${SITE}/omra-femme-seule`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/omra-famille`, changefreq: "monthly", priority: "0.85" },
  { loc: `${SITE}/omra-seniors`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/omra-enfants`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/omra-badal`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/10-derniers-jours-ramadan`, changefreq: "yearly", priority: "0.90" },
  { loc: `${SITE}/omra-depuis-paris`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/omra-depuis-lyon`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/omra-depuis-marseille`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/omra-depuis-toulouse`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/omra-depuis-nice`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/omra-depuis-bordeaux`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/omra-depuis-strasbourg`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/omra-depuis-lille`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/omra-en-octobre-2026`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/omra-en-novembre-2026`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/omra-en-decembre-2026`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/omra-en-janvier-2027`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/prayer-times`, changefreq: "daily", priority: "0.80" },
  { loc: `${SITE}/islamic-calendar`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/ramadan-hajj-dates`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/discussions`, changefreq: "daily", priority: "0.60" },
  { loc: `${SITE}/category/sejours`, changefreq: "daily", priority: "0.90" },
  { loc: `${SITE}/category/vols`, changefreq: "daily", priority: "0.90" },
  { loc: `${SITE}/category/hebergements`, changefreq: "weekly", priority: "0.80" },
  { loc: `${SITE}/category/guides`, changefreq: "weekly", priority: "0.80" },
  { loc: `${SITE}/category/chauffeurs`, changefreq: "weekly", priority: "0.80" },
  { loc: `${SITE}/category/babysitting`, changefreq: "weekly", priority: "0.70" },
  { loc: `${SITE}/blog`, changefreq: "daily", priority: "0.90" },
  { loc: `${SITE}/blog/general`, changefreq: "weekly", priority: "0.80" },
  { loc: `${SITE}/blog/restaurants`, changefreq: "weekly", priority: "0.70" },
  { loc: `${SITE}/blog/associations`, changefreq: "weekly", priority: "0.70" },
  { loc: `${SITE}/blog/vendeurs`, changefreq: "weekly", priority: "0.70" },
  { loc: `${SITE}/agence-details/Al%20Maqam%20Voyages`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Al%20Sirate%20Voyage`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Haramain%20Voyages`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Labbayk`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Medin%20Voyages`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/MERIDIANIS`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Omra%20Discount`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Omra%20Pour%20Tous`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Omra%20Sounnah`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Pelerinhajj`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Sabile%20Voyages`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/TAWAF`, changefreq: "weekly", priority: "0.60" },
];

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export default async function handler(req: Request, _context: Context) {
  const today = new Date().toISOString().split("T")[0];

  const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL");
  const supabaseKey = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY");

  // Fetch all published blog posts
  let blogEntries: string[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const apiUrl =
        `${supabaseUrl}/rest/v1/blog_posts` +
        `?is_published=eq.true` +
        `&select=slug,category,updated_at,created_at` +
        `&order=created_at.desc`;

      const res = await fetch(apiUrl, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });

      if (res.ok) {
        const posts = await res.json();
        blogEntries = posts.map((post: { slug: string; category: string; updated_at?: string; created_at: string }) => {
          const lastmod = (post.updated_at || post.created_at).split("T")[0];
          const loc = `${SITE}/blog/${post.category}/${post.slug}`;
          return urlEntry(loc, lastmod, "monthly", "0.70");
        });
      }
    } catch (_err) {
      // Fall through — static entries will still be served
    }
  }

  const staticEntries = STATIC_URLS.map((u) =>
    urlEntry(u.loc, u.lastmod || today, u.changefreq, u.priority)
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries.join("\n")}
${blogEntries.join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
      "x-robots-tag": "noindex",
    },
  });
}
