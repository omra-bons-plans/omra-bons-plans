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
  { loc: `${SITE}/`, changefreq: "daily", priority: "1.00", lastmod: "2026-09-01" },
  { loc: `${SITE}/bons-plans`, changefreq: "daily", priority: "0.80", lastmod: "2026-09-01" },
  { loc: `${SITE}/hajj`, changefreq: "daily", priority: "0.90", lastmod: "2026-09-01" },
  { loc: `${SITE}/hajj-2027`, changefreq: "weekly", priority: "0.95", lastmod: "2026-09-01" },
  { loc: `${SITE}/about`, changefreq: "monthly", priority: "0.60", lastmod: "2026-09-01" },
  { loc: `${SITE}/contact`, changefreq: "monthly", priority: "0.60", lastmod: "2026-09-01" },
  { loc: `${SITE}/comparateur-omra-france`, changefreq: "monthly", priority: "0.95", lastmod: "2026-09-01" },
  { loc: `${SITE}/comparatif-agences`, changefreq: "weekly", priority: "0.90", lastmod: "2026-09-01" },
  { loc: `${SITE}/agences-liste`, changefreq: "weekly", priority: "0.80", lastmod: "2026-09-01" },
  { loc: `${SITE}/comparatif-visuel`, changefreq: "monthly", priority: "0.60", lastmod: "2026-09-01" },
  { loc: `${SITE}/guide-omra-pas-chere`, changefreq: "monthly", priority: "0.90", lastmod: "2026-09-01" },
  { loc: `${SITE}/guide-hajj-4-ecoles`, changefreq: "monthly", priority: "0.85", lastmod: "2026-09-01" },
  { loc: `${SITE}/definition-omra`, changefreq: "monthly", priority: "0.90", lastmod: "2026-09-01" },
  { loc: `${SITE}/conditions-omra`, changefreq: "monthly", priority: "0.85", lastmod: "2026-09-01" },
  { loc: `${SITE}/rites-omra`, changefreq: "monthly", priority: "0.90", lastmod: "2026-09-01" },
  { loc: `${SITE}/visa-omra-france`, changefreq: "monthly", priority: "0.80", lastmod: "2026-09-01" },
  { loc: `${SITE}/quand-partir-omra`, changefreq: "monthly", priority: "0.88", lastmod: "2026-09-01" },
  { loc: `${SITE}/prix-omra-2027`, changefreq: "weekly", priority: "0.90", lastmod: "2026-11-12" },
  { loc: `${SITE}/liste-bagages-omra`, changefreq: "monthly", priority: "0.80", lastmod: "2026-09-01" },
  { loc: `${SITE}/meilleure-agence-omra`, changefreq: "monthly", priority: "0.85", lastmod: "2026-09-01" },
  { loc: `${SITE}/omra-tout-compris`, changefreq: "weekly", priority: "0.90", lastmod: "2026-09-01" },
  { loc: `${SITE}/omra-debutant`, changefreq: "monthly", priority: "0.88", lastmod: "2026-09-01" },
  { loc: `${SITE}/omra-ramadan-2027`, changefreq: "weekly", priority: "0.90", lastmod: "2026-09-01" },
  { loc: `${SITE}/omra-femme-seule`, changefreq: "monthly", priority: "0.80", lastmod: "2026-09-01" },
  { loc: `${SITE}/omra-famille`, changefreq: "monthly", priority: "0.85", lastmod: "2026-09-01" },
  { loc: `${SITE}/omra-seniors`, changefreq: "monthly", priority: "0.80", lastmod: "2026-09-01" },
  { loc: `${SITE}/omra-enfants`, changefreq: "monthly", priority: "0.80", lastmod: "2026-09-01" },
  { loc: `${SITE}/omra-badal`, changefreq: "monthly", priority: "0.75", lastmod: "2026-09-01" },
  { loc: `${SITE}/10-derniers-jours-ramadan`, changefreq: "yearly", priority: "0.90", lastmod: "2026-09-01" },
  { loc: `${SITE}/omra-depuis-paris`, changefreq: "monthly", priority: "0.85", lastmod: "2026-09-01" },
  { loc: `${SITE}/omra-depuis-lyon`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/omra-depuis-marseille`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/omra-depuis-toulouse`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/omra-depuis-nice`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/omra-depuis-bordeaux`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/omra-depuis-strasbourg`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/omra-depuis-lille`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/omra-depuis-nantes`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/omra-depuis-rennes`, changefreq: "monthly", priority: "0.68" },
  { loc: `${SITE}/omra-depuis-montpellier`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/omra-depuis-grenoble`, changefreq: "monthly", priority: "0.68" },
  { loc: `${SITE}/omra-depuis-metz`, changefreq: "monthly", priority: "0.65" },
  { loc: `${SITE}/omra-depuis-clermont-ferrand`, changefreq: "monthly", priority: "0.65" },
  { loc: `${SITE}/omra-en-novembre-2026`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/omra-en-decembre-2026`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/omra-en-janvier-2027`, changefreq: "monthly", priority: "0.85", lastmod: "2026-11-12" },
  { loc: `${SITE}/omra-en-fevrier-2027`, changefreq: "monthly", priority: "0.90", lastmod: "2026-11-12" },
  { loc: `${SITE}/omra-en-mars-2027`, changefreq: "monthly", priority: "0.90", lastmod: "2026-11-12" },
  { loc: `${SITE}/omra-en-mai-2027`, changefreq: "monthly", priority: "0.80", lastmod: "2026-11-12" },
  { loc: `${SITE}/omra-en-avril-2027`, changefreq: "monthly", priority: "0.85", lastmod: "2026-11-19" },
  { loc: `${SITE}/omra-en-juin-2027`, changefreq: "monthly", priority: "0.80", lastmod: "2026-11-19" },
  { loc: `${SITE}/omra-en-juillet-2027`, changefreq: "monthly", priority: "0.75", lastmod: "2026-11-19" },
  { loc: `${SITE}/omra-en-aout-2027`, changefreq: "monthly", priority: "0.75", lastmod: "2026-11-19" },
  { loc: `${SITE}/omra-en-septembre-2027`, changefreq: "monthly", priority: "0.80", lastmod: "2026-11-19" },
  { loc: `${SITE}/omra-en-octobre-2027`, changefreq: "monthly", priority: "0.85", lastmod: "2026-11-19" },
  { loc: `${SITE}/tenue-ihram`, changefreq: "monthly", priority: "0.85", lastmod: "2026-11-19" },
  { loc: `${SITE}/sante-omra`, changefreq: "monthly", priority: "0.85", lastmod: "2026-11-19" },
  { loc: `${SITE}/dua-omra`, changefreq: "monthly", priority: "0.80", lastmod: "2026-11-19" },
  // Coran — page principale + sourates populaires (noindex retiré le 2026-11-12)
  { loc: `${SITE}/coran`, changefreq: "monthly", priority: "0.95" },
  { loc: `${SITE}/coran/al-fatiha`, changefreq: "yearly", priority: "0.90" },
  { loc: `${SITE}/coran/ya-sin`, changefreq: "yearly", priority: "0.90" },
  { loc: `${SITE}/coran/ar-rahman`, changefreq: "yearly", priority: "0.90" },
  { loc: `${SITE}/coran/al-kahf`, changefreq: "yearly", priority: "0.90" },
  { loc: `${SITE}/coran/al-mulk`, changefreq: "yearly", priority: "0.85" },
  { loc: `${SITE}/coran/al-baqarah`, changefreq: "yearly", priority: "0.85" },
  { loc: `${SITE}/coran/al-imran`, changefreq: "yearly", priority: "0.80" },
  { loc: `${SITE}/coran/al-ikhlas`, changefreq: "yearly", priority: "0.85" },
  { loc: `${SITE}/coran/al-falaq`, changefreq: "yearly", priority: "0.80" },
  { loc: `${SITE}/coran/an-nas`, changefreq: "yearly", priority: "0.80" },
  { loc: `${SITE}/coran/al-asr`, changefreq: "yearly", priority: "0.80" },
  { loc: `${SITE}/prayer-times`, changefreq: "daily", priority: "0.80" },
  // Horaires de prière par ville (noindex retiré le 2026-11-12)
  { loc: `${SITE}/horaires-priere/paris`, changefreq: "daily", priority: "0.90" },
  { loc: `${SITE}/horaires-priere/marseille`, changefreq: "daily", priority: "0.85" },
  { loc: `${SITE}/horaires-priere/lyon`, changefreq: "daily", priority: "0.85" },
  { loc: `${SITE}/horaires-priere/toulouse`, changefreq: "daily", priority: "0.80" },
  { loc: `${SITE}/horaires-priere/nice`, changefreq: "daily", priority: "0.80" },
  { loc: `${SITE}/horaires-priere/nantes`, changefreq: "daily", priority: "0.80" },
  { loc: `${SITE}/horaires-priere/bordeaux`, changefreq: "daily", priority: "0.80" },
  { loc: `${SITE}/horaires-priere/lille`, changefreq: "daily", priority: "0.80" },
  { loc: `${SITE}/horaires-priere/strasbourg`, changefreq: "daily", priority: "0.78" },
  { loc: `${SITE}/horaires-priere/rennes`, changefreq: "daily", priority: "0.75" },
  { loc: `${SITE}/horaires-priere/montpellier`, changefreq: "daily", priority: "0.75" },
  { loc: `${SITE}/horaires-priere/grenoble`, changefreq: "daily", priority: "0.75" },
  { loc: `${SITE}/horaires-priere/clermont-ferrand`, changefreq: "daily", priority: "0.70" },
  { loc: `${SITE}/horaires-priere/metz`, changefreq: "daily", priority: "0.70" },
  { loc: `${SITE}/horaires-priere/orleans`, changefreq: "daily", priority: "0.70" },
  { loc: `${SITE}/islamic-calendar`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/ramadan-hajj-dates`, changefreq: "monthly", priority: "0.80" },
  { loc: `${SITE}/discussions`, changefreq: "daily", priority: "0.60" },
  { loc: `${SITE}/category/sejours`, changefreq: "daily", priority: "0.90" },
  { loc: `${SITE}/category/vols`, changefreq: "daily", priority: "0.90" },
  { loc: `${SITE}/category/hebergement`, changefreq: "weekly", priority: "0.80" },
  { loc: `${SITE}/category/guides`, changefreq: "weekly", priority: "0.80" },
  { loc: `${SITE}/category/chauffeurs`, changefreq: "weekly", priority: "0.80" },
  { loc: `${SITE}/category/babysitting`, changefreq: "weekly", priority: "0.70" },
  { loc: `${SITE}/blog`, changefreq: "daily", priority: "0.90" },
  { loc: `${SITE}/blog/general`, changefreq: "weekly", priority: "0.80" },
  // /blog/restaurants, /blog/associations, /blog/vendeurs are noindex — excluded from sitemap
  { loc: `${SITE}/agence-details/Al%20Maqam%20Voyages`, changefreq: "weekly", priority: "0.65" },
  { loc: `${SITE}/agence-details/Al%20Sirate%20Voyage`, changefreq: "weekly", priority: "0.65" },
  { loc: `${SITE}/agence-details/Al%20Hayat%20Voyages`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Haramain%20Voyages`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Labbayk`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Medin%20Voyages`, changefreq: "weekly", priority: "0.65" },
  { loc: `${SITE}/agence-details/MERIDIANIS`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Omra%20Discount`, changefreq: "weekly", priority: "0.65" },
  { loc: `${SITE}/agence-details/Omra%20Du%20Savoir`, changefreq: "weekly", priority: "0.65" },
  { loc: `${SITE}/agence-details/Omra%20Pour%20Tous`, changefreq: "weekly", priority: "0.65" },
  { loc: `${SITE}/agence-details/Omra%20Sounnah`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/OMRA%20GATE`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Partir%20%C3%A0%20la%20Mecque`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/Pelerinhajj`, changefreq: "weekly", priority: "0.65" },
  { loc: `${SITE}/agence-details/Sabile%20Voyages`, changefreq: "weekly", priority: "0.60" },
  { loc: `${SITE}/agence-details/TAWAF`, changefreq: "weekly", priority: "0.65" },
  // Hôtels Omra — La Mecque & Médine
  { loc: `${SITE}/les-hotels`, changefreq: "monthly", priority: "0.90" },
  { loc: `${SITE}/hotel/address-jabal-omar`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/anjum`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/conrad-jabal-omar`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/doubletree-jabal-omar`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/elaf-bakkah`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/emaar-al-noor`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/emaar-international`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/hyatt-regency-jabal-omar`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/hibatullah`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/hilton-convention`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/hilton-suites`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/jumeirah-jabal-omar`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/marriott-jabal-omar`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/al-marwa-rotana`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/mathaba`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/millennium-al-naseem`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/hotel/millennium-al-dana`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/hotel/montana-hotel`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/novotel-thakher`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/hotel/osturat-emmar`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/park-house-hotel`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/park-plaza`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/hotel/ponciana`, changefreq: "monthly", priority: "0.68" },
  { loc: `${SITE}/hotel/razana-al-rawda`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/safwat-al-talayie`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/shaza-makkah`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/sheraton-jabal-al-kaaba`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/shohada`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/taj-park`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/hotel/tilal-shaza`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/voco-makkah`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/hotel/zamzam-hotel`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/al-shakreen-golden-tulip`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/assafa-golden`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/bosphorus-waqf-safi`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/concord-dar-al-khair`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/crowne-plaza-madinah`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/diwan-rose`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/diyar-al-taqwa`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/hotel/emaar-royal`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/hotel/hilton-diyar-ajwa`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/jayden`, changefreq: "monthly", priority: "0.68" },
  { loc: `${SITE}/hotel/jewar-al-saha`, changefreq: "monthly", priority: "0.68" },
  { loc: `${SITE}/hotel/jiwar-al-madinah`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/maien`, changefreq: "monthly", priority: "0.68" },
  { loc: `${SITE}/hotel/maysan-al-harithia`, changefreq: "monthly", priority: "0.68" },
  { loc: `${SITE}/hotel/mias-madinah`, changefreq: "monthly", priority: "0.68" },
  { loc: `${SITE}/hotel/movenpick-madinah`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/musc-touch`, changefreq: "monthly", priority: "0.68" },
  { loc: `${SITE}/hotel/mysk-madinah`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/hotel/nusuk-al-eman`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/peninsula-worth`, changefreq: "monthly", priority: "0.68" },
  { loc: `${SITE}/hotel/pullman-zamzam-madinah`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/rotana-madinah`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/hotel/saafa`, changefreq: "monthly", priority: "0.68" },
  { loc: `${SITE}/hotel/shaza-regency-madinah`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/hotel/sofitel-shahd-madinah`, changefreq: "monthly", priority: "0.75" },
  { loc: `${SITE}/hotel/tabat-al-salam-swiss`, changefreq: "monthly", priority: "0.72" },
  { loc: `${SITE}/hotel/taiba-front`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/tulip-inn-madinah`, changefreq: "monthly", priority: "0.70" },
  { loc: `${SITE}/hotel/valy`, changefreq: "monthly", priority: "0.68" },
  { loc: `${SITE}/hotel/view-madinah`, changefreq: "monthly", priority: "0.68" },
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
          const normalizedSlug = post.slug.toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          const loc = `${SITE}/blog/${post.category}/${normalizedSlug}`;
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
