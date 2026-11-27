/**
 * Cloudflare Pages Function — catch-all router for SEO pre-rendering.
 *
 * Migrated from the Netlify edge functions (netlify/edge-functions/*.ts).
 * Replicates the exact routing declared in netlify.toml:
 *
 *   /sitemap.xml            → functions/sitemap.xml.ts (separate file)
 *   /, /hajj, /bons-plans,
 *     /agences-liste, ...   → homepage-prerender   (bot only)
 *   ~50 guide pages         → guide-prerender      (bot only)
 *   /ad/*                   → ad-prerender         (bot only)
 *   /blog/{category}        → blog-category-prerender (bot only)
 *   /blog/{category}/{slug} → blog-prerender       (bot only)
 *   /* (everything else)    → seo-prerender        (all visitors)
 *
 * Order matters: homepage-prerender must run BEFORE guide-prerender (both
 * declare /agences-liste and /comparateur-omra-france), blog-category before
 * blog, and every specific function before the seo-prerender catch-all.
 *
 * Humans always receive the React SPA (context.next()); only crawlers receive
 * pre-rendered HTML. seo-prerender additionally rewrites the SPA's
 * <head> meta tags for every visitor so each route ships its own canonical
 * before React hydrates.
 */

import type { PagesFunctionContext } from "./_shared/types";
import { renderHomepage } from "./_shared/homepage";
import { renderGuide } from "./_shared/guide";
import { renderAd } from "./_shared/ad";
import { renderBlog } from "./_shared/blog";
import { renderBlogCategory } from "./_shared/blog-category";
import { renderSeo } from "./_shared/seo";

const BOT_PATTERN =
  /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|perplexitybot|claudebot|gptbot|anthropic-ai|claude-web|google-extended|chatgpt-user|ccbot|cohere-ai|oai-searchbot/i;

export async function onRequest(context: PagesFunctionContext) {
  const { request, env } = context;
  const userAgent = request.headers.get("user-agent") || "";
  const isBot = BOT_PATTERN.test(userAgent);

  // ── Bot-only pre-rendering (dynamic rendering) ─────────────────────────────
  // Each render* returns a Response when it matches AND produces HTML, or null
  // to fall through to the next handler / the SPA.
  if (isBot) {
    const homepage = await renderHomepage(request);
    if (homepage) return homepage;

    const guide = await renderGuide(request);
    if (guide) return guide;

    const ad = await renderAd(request, env);
    if (ad) return ad;

    const blogCategory = await renderBlogCategory(request, env);
    if (blogCategory) return blogCategory;

    const blog = await renderBlog(request, env);
    if (blog) return blog;
  }

  // ── SEO meta injection (all visitors) + bot fallback for dynamic routes ────
  const seo = await renderSeo(request, env, () => context.next());
  if (seo) return seo;

  // Human visitor / unmatched route → serve the React SPA (static asset or the
  // SPA fallback defined in public/_redirects).
  return context.next();
}
