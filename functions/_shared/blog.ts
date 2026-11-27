import type { Env } from "./types";

/**
 * Netlify Edge Function — Dynamic Rendering for blog posts
 *
 * Problem: React SPA loads blog content via JS (Supabase fetch).
 * Google crawls BEFORE JS executes → sees empty page → Soft 404.
 *
 * Solution: Detect bots by User-Agent, fetch post from Supabase REST API,
 * return fully pre-rendered HTML. Regular users get the normal React SPA.
 */


const BOT_PATTERN =
  /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|perplexitybot|claudebot|gptbot|anthropic-ai|claude-web|google-extended|chatgpt-user|ccbot|cohere-ai/i;

export async function renderBlog(req: Request, env: Env): Promise<Response | null> {
  const userAgent = req.headers.get("user-agent") || "";

  // Regular users → pass through to React SPA
  if (!BOT_PATTERN.test(userAgent)) {
    return null;
  }

  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);

  // Only handle /blog/[category]/[slug]
  if (parts.length !== 3 || parts[0] !== "blog") {
    return null;
  }

  const [, category, slug] = parts;

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  try {
    const apiUrl =
      `${supabaseUrl}/rest/v1/blog_posts` +
      `?slug=eq.${encodeURIComponent(slug)}` +
      `&is_published=eq.true` +
      `&select=id,title,content,excerpt,cover_image,tags,created_at,updated_at,category`;

    const res = await fetch(apiUrl, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!res.ok) return null;

    const posts = await res.json();
    if (!posts?.length) return null;

    const post = posts[0];
    const description = escHtml(
      post.excerpt || post.content?.substring(0, 160) || ""
    );
    const title = escHtml(post.title);
    const canonicalUrl = `https://omrabonsplans.fr/blog/${category}/${slug}`;

    const schema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt || "",
      url: canonicalUrl,
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      author: { "@type": "Organization", name: "Omra Bons Plans" },
      publisher: {
        "@type": "Organization",
        name: "Omra Bons Plans",
        logo: {
          "@type": "ImageObject",
          url: "https://omrabonsplans.fr/logo.svg",
        },
      },
      image: post.cover_image || "https://omrabonsplans.fr/hero-kaaba-optimized.webp",
    });

    const contentHtml = mdToHtml(post.content || "");

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Omra Bons Plans</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${post.cover_image || "https://omrabonsplans.fr/hero-kaaba-optimized.webp"}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <script type="application/ld+json">${schema}</script>
</head>
<body>
  <nav><a href="https://omrabonsplans.fr">Omra Bons Plans</a> › <a href="https://omrabonsplans.fr/blog">Blog</a></nav>
  <article>
    <h1>${title}</h1>
    ${post.excerpt ? `<p><strong>${escHtml(post.excerpt)}</strong></p>` : ""}
    <div>${contentHtml}</div>
  </article>
  <footer>
    <p><a href="https://omrabonsplans.fr/">Comparer les offres Omra</a> · <a href="https://omrabonsplans.fr/comparatif-agences">Comparer les agences</a></p>
  </footer>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-prerendered": "true",
        "cache-control": "public, max-age=3600",
        "x-robots-tag": "index, follow",
      },
    });
  } catch (err) {
    console.error("[blog-prerender] error:", err);
    return null;
  }
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mdToHtml(md: string): string {
  return md
    // Code blocks (before other replacements)
    .replace(/```[\s\S]*?```/g, "")
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Unordered lists
    .replace(/((?:^- .+\n?)+)/gm, (match) => {
      const items = match
        .trim()
        .split("\n")
        .map((l) => `<li>${l.replace(/^- /, "")}</li>`)
        .join("");
      return `<ul>${items}</ul>`;
    })
    // Ordered lists
    .replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
      const items = match
        .trim()
        .split("\n")
        .map((l) => `<li>${l.replace(/^\d+\. /, "")}</li>`)
        .join("");
      return `<ol>${items}</ol>`;
    })
    // Tables (basic)
    .replace(/^\|.+\|$/gm, (row) => {
      if (/^[\|\s\-:]+$/.test(row)) return "";
      const cells = row
        .split("|")
        .filter((c) => c.trim())
        .map((c) => `<td>${c.trim()}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    })
    // Paragraphs
    .replace(/\n{2,}/g, "\n</p>\n<p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>")
    // Clean up empty paragraphs and misplaced tags
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<p>(<h[1-6]>)/g, "$1")
    .replace(/(<\/h[1-6]>)<\/p>/g, "$1")
    .replace(/<p>(<ul>|<ol>|<blockquote>)/g, "$1")
    .replace(/(<\/ul>|<\/ol>|<\/blockquote>)<\/p>/g, "$1")
    .replace(/<p>(<tr>)/g, "<table>$1")
    .replace(/(<\/tr>)<\/p>/g, "$1</table>");
}
