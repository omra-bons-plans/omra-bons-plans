import type { Env } from "./types";

/**
 * Netlify Edge Function — Dynamic rendering for /ad/[slug] pages
 *
 * Problem: React SPA fetches ad data via JS (Supabase). Googlebot sees
 * an empty <div id="root"> → "Google ne reconnaît pas cette URL" → refuses indexation.
 *
 * Solution: Detect bots, fetch ad from Supabase REST API, return pre-rendered HTML.
 * Regular users still get the React SPA.
 */


const BOT_PATTERN =
  /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|perplexitybot|claudebot|gptbot|anthropic-ai|claude-web|google-extended|chatgpt-user|ccbot|cohere-ai|oai-searchbot/i;

const SITE = "https://omrabonsplans.fr";

const CATEGORY_LABELS: Record<string, string> = {
  sejours: "Séjours Omra & Hajj",
  hebergement: "Hébergements à La Mecque & Médine",
  hebergements: "Hébergements à La Mecque & Médine",
  vols: "Vols pour l'Omra",
  guides: "Guides & Services Omra",
  chauffeurs: "Transport & Chauffeurs",
  babysitting: "Baby-sitting",
};

const CATEGORY_PATHS: Record<string, string> = {
  sejours: "/category/sejours",
  hebergement: "/category/hebergement",
  hebergements: "/category/hebergement",
  vols: "/category/vols",
  guides: "/category/guides",
  chauffeurs: "/category/chauffeurs",
  babysitting: "/category/babysitting",
};

function escHtml(s: string): string {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function renderAd(req: Request, env: Env): Promise<Response | null> {
  const userAgent = req.headers.get("user-agent") || "";
  if (!BOT_PATTERN.test(userAgent)) return null;

  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);

  // Only handle /ad/[slug-or-uuid]
  if (parts.length !== 2 || parts[0] !== "ad") return null;

  const idOrSlug = parts[1];
  if (!idOrSlug) return null;

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      idOrSlug
    );

  try {
    const field = isUuid ? "id" : "slug";
    const apiUrl =
      `${supabaseUrl}/rest/v1/ads` +
      `?${field}=eq.${encodeURIComponent(idOrSlug)}` +
      `&status=eq.active` +
      `&select=id,title,description,price,location,category,images,cover_image,slug,created_at,updated_at`;

    const res = await fetch(apiUrl, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!res.ok) return null;

    const ads = await res.json();
    if (!Array.isArray(ads) || !ads.length) return null;

    const ad = ads[0];

    // Redirect old UUID URLs to canonical slug URL
    if (isUuid && ad.slug) {
      return new Response(null, {
        status: 301,
        headers: {
          Location: `${SITE}/ad/${ad.slug}`,
          "cache-control": "public, max-age=86400",
        },
      });
    }

    const canonicalUrl = `${SITE}/ad/${ad.slug || ad.id}`;
    const title = escHtml(ad.title || "Annonce Omra");
    const rawDescription = (ad.description || "").substring(0, 300);
    const metaDescription = escHtml(
      rawDescription.length > 160
        ? rawDescription.substring(0, 157) + "..."
        : rawDescription
    );
    const categoryLabel = CATEGORY_LABELS[ad.category] || "Annonce";
    const categoryPath = CATEGORY_PATHS[ad.category] || "/";
    const image =
      ad.cover_image || (Array.isArray(ad.images) && ad.images[0]) || null;
    const priceFormatted = ad.price
      ? `${Number(ad.price).toLocaleString("fr-FR")} €`
      : null;

    const productSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: ad.title,
      description: (ad.description || "").substring(0, 500),
      url: canonicalUrl,
      ...(image ? { image: [image] } : {}),
      ...(ad.price
        ? {
            offers: {
              "@type": "Offer",
              price: ad.price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url: canonicalUrl,
            },
          }
        : {}),
    });

    const breadcrumbSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: SITE,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: categoryLabel,
          item: `${SITE}${categoryPath}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: ad.title,
          item: canonicalUrl,
        },
      ],
    });

    const descriptionHtml = escHtml(ad.description || "").replace(
      /\n/g,
      "<br>"
    );

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Omra Bons Plans</title>
  <meta name="description" content="${metaDescription}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="product">
  ${image ? `<meta property="og:image" content="${escHtml(image)}">` : ""}
  <script type="application/ld+json">${productSchema}</script>
  <script type="application/ld+json">${breadcrumbSchema}</script>
</head>
<body>
  <nav aria-label="Fil d'Ariane">
    <a href="${SITE}">Omra Bons Plans</a>
    › <a href="${SITE}${categoryPath}">${escHtml(categoryLabel)}</a>
    › <span>${title}</span>
  </nav>
  <main>
    <article>
      <h1>${title}</h1>
      ${priceFormatted ? `<p><strong>Prix : ${escHtml(priceFormatted)}</strong></p>` : ""}
      ${ad.location ? `<p><strong>Localisation :</strong> ${escHtml(ad.location)}</p>` : ""}
      ${ad.category ? `<p><strong>Catégorie :</strong> ${escHtml(categoryLabel)}</p>` : ""}
      <section>
        <h2>Description</h2>
        <p>${descriptionHtml}</p>
      </section>
      <p><a href="${canonicalUrl}">Voir l'annonce complète sur Omra Bons Plans</a></p>
    </article>
    <aside>
      <h2>Comparer d'autres offres</h2>
      <ul>
        <li><a href="${SITE}/comparatif-agences">Comparatif agences Omra</a></li>
        <li><a href="${SITE}${categoryPath}">Toutes les annonces ${escHtml(categoryLabel)}</a></li>
        <li><a href="${SITE}/prix-omra-2027">Prix d'une Omra 2027</a></li>
      </ul>
    </aside>
  </main>
  <footer>
    <p>
      <a href="${SITE}/">Omra Bons Plans</a> ·
      <a href="${SITE}/comparatif-agences">Comparatif agences</a> ·
      <a href="${SITE}/definition-omra">Qu'est-ce que l'Omra ?</a>
    </p>
  </footer>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-prerendered": "true",
        "cache-control": "private, no-store",
        "vary": "User-Agent",
        "x-robots-tag": "index, follow",
      },
    });
  } catch {
    return null;
  }
}
