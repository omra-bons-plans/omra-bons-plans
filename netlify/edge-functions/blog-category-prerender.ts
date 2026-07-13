/**
 * Netlify Edge Function — Pre-rendering for blog category pages
 *
 * Problem: Googlebot visits /blog/general and gets an empty <div id="root">.
 * It cannot follow links to individual articles → "Aucune page d'origine"
 * in GSC for every article.
 *
 * Solution: For bots, fetch the article list from Supabase and return real
 * HTML with clickable links. Regular users still get the React SPA.
 * This is standard Dynamic Rendering, explicitly allowed by Google.
 */

import type { Context } from "netlify:edge";

const BOT_PATTERN =
  /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|perplexitybot|claudebot|gptbot|anthropic-ai|claude-web|google-extended|chatgpt-user|ccbot|cohere-ai|oai-searchbot/i;

const SITE = "https://omrabonsplans.fr";

const CATEGORY_LABELS: Record<string, string> = {
  general: "Général — Omra & Hajj",
  restaurants: "Restaurants halal",
  associations: "Associations islamiques",
  vendeurs: "Vendeurs & artisans",
};

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req: Request, context: Context) {
  const userAgent = req.headers.get("user-agent") || "";

  if (!BOT_PATTERN.test(userAgent)) return context.next();

  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);

  // Only handle /blog/[category] (exactly 2 segments)
  if (parts.length !== 2 || parts[0] !== "blog") return context.next();

  const category = parts[1];
  if (!CATEGORY_LABELS[category]) return context.next();

  const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL");
  const supabaseKey = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY");

  if (!supabaseUrl || !supabaseKey) return context.next();

  try {
    const apiUrl =
      `${supabaseUrl}/rest/v1/blog_posts` +
      `?category=eq.${encodeURIComponent(category)}` +
      `&is_published=eq.true` +
      `&select=slug,title,excerpt,created_at` +
      `&order=created_at.desc` +
      `&limit=100`;

    const res = await fetch(apiUrl, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!res.ok) return context.next();

    const posts = await res.json();
    if (!Array.isArray(posts)) return context.next();

    const categoryLabel = CATEGORY_LABELS[category];
    const canonicalUrl = `${SITE}/blog/${category}`;

    const articlesHtml = posts
      .map((post: { slug: string; title: string; excerpt?: string; created_at: string }) => {
        const postUrl = `${SITE}/blog/${category}/${post.slug}`;
        const date = post.created_at.split("T")[0];
        return `  <article>
    <h2><a href="${postUrl}">${escHtml(post.title)}</a></h2>
    ${post.excerpt ? `<p>${escHtml(post.excerpt)}</p>` : ""}
    <time datetime="${date}">${date}</time>
  </article>`;
      })
      .join("\n");

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog ${escHtml(categoryLabel)} | Omra Bons Plans</title>
  <meta name="description" content="Tous les articles sur ${escHtml(categoryLabel)} : guides, conseils et actualités pour l'Omra et le Hajj.">
  <meta name="robots" content="${['restaurants', 'associations', 'vendeurs'].includes(category) ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:title" content="Blog ${escHtml(categoryLabel)} | Omra Bons Plans">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Blog ${categoryLabel} — Omra Bons Plans`,
    "url": canonicalUrl,
    "description": `Tous les articles sur ${categoryLabel}`,
    "publisher": {
      "@type": "Organization",
      "name": "Omra Bons Plans",
      "url": SITE,
    },
    "hasPart": posts.map((p: { slug: string; title: string; created_at: string }) => ({
      "@type": "Article",
      "headline": p.title,
      "url": `${SITE}/blog/${category}/${p.slug}`,
      "datePublished": p.created_at,
    })),
  })}</script>
</head>
<body>
  <nav>
    <a href="${SITE}">Omra Bons Plans</a> ›
    <a href="${SITE}/blog">Blog</a> ›
    <span>${escHtml(categoryLabel)}</span>
  </nav>
  <main>
    <h1>Blog ${escHtml(categoryLabel)}</h1>
    <p>${posts.length} article${posts.length > 1 ? "s" : ""}</p>
    ${articlesHtml || "<p>Aucun article disponible.</p>"}
  </main>
  <footer>
    <p>
      <a href="${SITE}/">Comparer les offres Omra</a> ·
      <a href="${SITE}/comparatif-agences">Comparer les agences</a> ·
      <a href="${SITE}/blog">Tous les articles</a>
    </p>
  </footer>
  <div id="root"></div>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-prerendered": "true",
        "cache-control": "public, max-age=3600",
      },
    });
  } catch (_err) {
    return context.next();
  }
}
