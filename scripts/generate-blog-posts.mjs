/**
 * Blog auto-publication script
 * Usage: npm run blog:generate
 *
 * Publishes pre-written articles from blog-posts-data.json to Supabase.
 * No AI API key required — content is already written.
 *
 * Required env vars (add to .env):
 *   SUPABASE_SERVICE_ROLE_KEY — Supabase > Settings > API > service_role key
 *   UNSPLASH_ACCESS_KEY      — (optional) unsplash.com/developers — free tier
 *
 * Optional:
 *   POSTS_PER_RUN=30         — number of posts per execution (default: 30)
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env ────────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(__dirname, "..", ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const POSTS_PER_RUN = parseInt(process.env.POSTS_PER_RUN || "30", 10);

if (!SUPABASE_URL)
  throw new Error("Missing VITE_SUPABASE_URL in .env");
if (!SUPABASE_SERVICE_KEY)
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env — see Supabase > Settings > API");

// ─── Load pre-written articles ────────────────────────────────────────────────
const DATA_FILE = join(__dirname, "blog-posts-data.json");
if (!existsSync(DATA_FILE)) {
  throw new Error("Missing scripts/blog-posts-data.json — ask Claude to generate more articles");
}
const ALL_ARTICLES = JSON.parse(readFileSync(DATA_FILE, "utf8"));

// ─── Published tracking ───────────────────────────────────────────────────────
const USED_FILE = join(__dirname, ".blog-used-topics.json");

function getPublishedIds() {
  if (!existsSync(USED_FILE)) return [];
  try { return JSON.parse(readFileSync(USED_FILE, "utf8")); }
  catch { return []; }
}

function savePublishedIds(ids) {
  writeFileSync(USED_FILE, JSON.stringify(ids, null, 2));
}

// ─── Fallback photos (Unsplash static URLs — Mecque/pèlerinage) ───────────────
const FALLBACK_PHOTOS = [
  "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=80",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80",
  "https://images.unsplash.com/photo-1608138403869-17c4eb84a5e3?w=1200&q=80",
  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&q=80",
  "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=1200&q=80",
  "https://images.unsplash.com/photo-1544411047-c491d18a4524?w=1200&q=80",
  "https://images.unsplash.com/photo-1580127184576-b41f3df37e3a?w=1200&q=80",
];

async function fetchCoverPhoto(query) {
  if (UNSPLASH_ACCESS_KEY) {
    try {
      const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        if (data.urls?.regular) return data.urls.regular;
      }
    } catch {
      // fall through to fallback
    }
  }
  // Deterministic fallback based on query hash so same topic → same image
  const hash = [...query].reduce((a, c) => a + c.charCodeAt(0), 0);
  return FALLBACK_PHOTOS[hash % FALLBACK_PHOTOS.length];
}

// ─── Get author_id from existing posts ────────────────────────────────────────
async function getAuthorId() {
  if (process.env.SUPABASE_AUTHOR_ID) return process.env.SUPABASE_AUTHOR_ID;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?select=author_id&limit=1`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error(`Supabase error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  if (!data.length) {
    throw new Error(
      "No existing posts found to derive author_id.\n" +
      "Add SUPABASE_AUTHOR_ID=<your-user-uuid> to your .env file.\n" +
      "You can find it in Supabase > Authentication > Users."
    );
  }
  return data[0].author_id;
}

// ─── Check if slug already exists ─────────────────────────────────────────────
async function slugExists(slug) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&select=slug&limit=1`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data.length > 0;
}

// ─── Insert post to Supabase ──────────────────────────────────────────────────
async function insertPost(post) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(post),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase insert failed (${res.status}): ${body}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🕌 Blog auto-publication — ${new Date().toLocaleDateString("fr-FR")}`);
  console.log(`   Articles disponibles: ${ALL_ARTICLES.length}\n`);

  const publishedIds = getPublishedIds();
  const remaining = ALL_ARTICLES.filter((a) => !publishedIds.includes(a.id));

  if (remaining.length === 0) {
    console.log("✅ Tous les articles ont été publiés !");
    console.log("   Demande à Claude de générer un nouveau lot d'articles.");
    return;
  }

  console.log(`📋 Articles restants: ${remaining.length} | À publier ce run: ${Math.min(POSTS_PER_RUN, remaining.length)}`);

  const batch = remaining.slice(0, POSTS_PER_RUN);

  // Get author_id
  let authorId;
  try {
    authorId = await getAuthorId();
  } catch (err) {
    console.error(`\n❌ ${err.message}\n`);
    process.exit(1);
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < batch.length; i++) {
    const article = batch[i];
    const prefix = `[${i + 1}/${batch.length}]`;

    process.stdout.write(`${prefix} 📝 ${article.title} ... `);

    try {
      // Check/fix slug uniqueness
      let slug = article.slug;
      if (await slugExists(slug)) {
        slug = `${slug}-2026`;
        if (await slugExists(slug)) slug = `${slug}-${Date.now()}`;
      }

      // Fetch cover photo
      const coverImage = await fetchCoverPhoto(article.unsplashQuery);

      // Publish
      await insertPost({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        slug,
        category: article.category,
        tags: article.tags,
        cover_image: coverImage,
        author_id: authorId,
        is_published: true,
        published_at: new Date().toISOString(),
      });

      publishedIds.push(article.id);
      savePublishedIds(publishedIds);

      success++;
      console.log(`✅`);

      // Small pause between inserts
      if (i < batch.length - 1) {
        await new Promise((r) => setTimeout(r, 300));
      }
    } catch (err) {
      failed++;
      console.log(`❌ ${err.message}`);
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`✅ Publiés: ${success} | ❌ Échecs: ${failed}`);
  console.log(`📋 Restants pour les prochains runs: ${remaining.length - success}`);
  if (remaining.length - success === 0) {
    console.log(`\n💡 Tous les articles sont publiés.`);
    console.log(`   Demande à Claude de générer un nouveau lot avec :`);
    console.log(`   "Génère 30 nouveaux articles de blog Omra/Hajj"\n`);
  }
  console.log(`─────────────────────────────────────────\n`);
}

main().catch((err) => {
  console.error("\n💥 Erreur fatale:", err.message);
  process.exit(1);
});
