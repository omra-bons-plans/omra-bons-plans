/**
 * Netlify Edge Function — Pre-rendering for blog category pages
 *
 * Strategy:
 * - Bots (detected): return full standalone pre-rendered HTML (fast, complete)
 * - All visitors: also inject article links into the SPA HTML so Google can
 *   discover posts even when crawling in non-bot mode or when bot detection
 *   fails. The injected <nav> uses the standard visually-hidden SR pattern —
 *   same content for everyone, not cloaking.
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

type Post = { slug: string; title: string; excerpt?: string; created_at: string };

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeSlug(slug: string): string {
  return slug.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

async function fetchPosts(
  supabaseUrl: string,
  supabaseKey: string,
  category: string,
): Promise<Post[]> {
  try {
    const url =
      `${supabaseUrl}/rest/v1/blog_posts` +
      `?category=eq.${encodeURIComponent(category)}` +
      `&is_published=eq.true` +
      `&select=slug,title,excerpt,created_at` +
      `&order=created_at.desc` +
      `&limit=100`;

    const res = await fetch(url, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function buildBotHtml(category: string, posts: Post[]): Response {
  const categoryLabel = CATEGORY_LABELS[category];
  const canonicalUrl = `${SITE}/blog/${category}`;

  const articlesHtml = posts
    .map((post) => {
      const slug = normalizeSlug(post.slug);
      const date = post.created_at.split("T")[0];
      return `  <article>
    <h2><a href="${SITE}/blog/${category}/${slug}">${escHtml(post.title)}</a></h2>
    ${post.excerpt ? `<p>${escHtml(post.excerpt)}</p>` : ""}
    <time datetime="${date}">${date}</time>
  </article>`;
    })
    .join("\n");

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Blog ${categoryLabel} — Omra Bons Plans`,
    url: canonicalUrl,
    description: `Tous les articles sur ${categoryLabel}`,
    publisher: { "@type": "Organization", name: "Omra Bons Plans", url: SITE },
    hasPart: posts.map((p) => ({
      "@type": "Article",
      headline: p.title,
      url: `${SITE}/blog/${category}/${normalizeSlug(p.slug)}`,
      datePublished: p.created_at,
    })),
  });

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog ${escHtml(categoryLabel)} | Omra Bons Plans</title>
  <meta name="description" content="Tous les articles sur ${escHtml(categoryLabel)} : guides, conseils et actualités pour l'Omra et le Hajj.">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:title" content="Blog ${escHtml(categoryLabel)} | Omra Bons Plans">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <script type="application/ld+json">${schema}</script>
</head>
<body>
  <nav><a href="${SITE}">Omra Bons Plans</a> › <a href="${SITE}/blog">Blog</a> › <span>${escHtml(categoryLabel)}</span></nav>
  <main>
    <h1>Blog ${escHtml(categoryLabel)}</h1>
    <p>${posts.length} article${posts.length > 1 ? "s" : ""}</p>
    ${articlesHtml || "<p>Aucun article disponible.</p>"}
  </main>
  <footer>
    <p><a href="${SITE}/">Comparer les offres Omra</a> · <a href="${SITE}/comparatif-agences">Comparer les agences</a> · <a href="${SITE}/blog">Tous les articles</a></p>
  </footer>
  <div id="root"></div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-prerendered": "true",
      "cache-control": "public, max-age=300",
    },
  });
}

export default async function handler(req: Request, context: Context) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);

  if (parts.length !== 2 || parts[0] !== "blog") return context.next();

  const category = parts[1];
  if (!CATEGORY_LABELS[category]) return context.next();

  const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL");
  const supabaseKey = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY");
  if (!supabaseUrl || !supabaseKey) return context.next();

  const posts = await fetchPosts(supabaseUrl, supabaseKey, category);
  if (!posts.length) return context.next();

  const isBot = BOT_PATTERN.test(req.headers.get("user-agent") || "");

  // Bots: return full standalone pre-rendered HTML
  if (isBot) return buildBotHtml(category, posts);

  // Regular users: get the SPA HTML and inject article links
  // This ensures Google discovers articles even in non-bot crawl mode
  const response = await context.next();
  const ct = response.headers.get("content-type") || "";
  if (!ct.includes("text/html")) return response;

  const html = await response.text();
  if (!html.includes("</body>")) return response;

  const linkItems = posts
    .map((post) => {
      const slug = normalizeSlug(post.slug);
      return `<li><a href="${SITE}/blog/${category}/${slug}">${escHtml(post.title)}</a></li>`;
    })
    .join("");

  // Standard visually-hidden pattern (sr-only): accessible to screen readers
  // and crawlers, invisible to sighted users. Not cloaking — same links that
  // React renders, just available before JS executes.
  const nav = `<nav style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0" aria-label="Articles ${escHtml(CATEGORY_LABELS[category])}"><ul>${linkItems}</ul></nav>`;

  return new Response(html.replace("</body>", `${nav}</body>`), {
    status: response.status,
    headers: {
      ...Object.fromEntries(response.headers),
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
