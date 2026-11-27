/**
 * Publication programmée des 10 articles SEO (1/semaine).
 * Usage : npm run blog:publish-2027
 *
 * Insère les articles dans Supabase avec is_published=false et une date
 * scheduled_publish_at (1 par semaine). La fonction Supabase
 * "publish-scheduled-posts" (déclenchée par un cron) les publie
 * automatiquement quand leur date arrive.
 *
 * Requiert dans .env :
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (Supabase > Settings > API > service_role)
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

if (!SUPABASE_URL) throw new Error("VITE_SUPABASE_URL manquant dans .env");
if (!SUPABASE_SERVICE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY manquant dans .env — Supabase > Settings > API");

const DATA_FILE = join(__dirname, "blog-posts-2027.json");
const ARTICLES = JSON.parse(readFileSync(DATA_FILE, "utf8"));

async function getAuthorId() {
  if (process.env.SUPABASE_AUTHOR_ID) return process.env.SUPABASE_AUTHOR_ID;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=author_id&limit=1`, {
    headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
  });
  const data = await res.json();
  if (!data.length) throw new Error("Aucun article existant pour déduire author_id. Ajoutez SUPABASE_AUTHOR_ID=<uuid> dans .env");
  return data[0].author_id;
}

async function slugExists(slug) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&select=slug&limit=1`, {
    headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
  });
  return res.ok && (await res.json()).length > 0;
}

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
  if (!res.ok) throw new Error(`Insert échoué (${res.status}): ${await res.text()}`);
}

async function main() {
  console.log(`🕌 Publication programmée — ${ARTICLES.length} articles\n`);
  const authorId = await getAuthorId();
  let ok = 0, fail = 0;

  for (let i = 0; i < ARTICLES.length; i++) {
    const a = ARTICLES[i];
    const date = a.scheduled_publish_at.slice(0, 10);
    process.stdout.write(`[${i + 1}/${ARTICLES.length}] ${date} — ${a.title} ... `);
    try {
      let slug = a.slug;
      if (await slugExists(slug)) slug = `${slug}-2027`;
      await insertPost({
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        slug,
        category: a.category || "general",
        tags: a.tags,
        cover_image: a.cover_image,
        author_id: authorId,
        is_published: false,
        scheduled_publish_at: a.scheduled_publish_at,
      });
      ok++;
      console.log("✅");
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      fail++;
      console.log(`❌ ${err.message}`);
    }
  }

  console.log(`\n✅ Insérés : ${ok} | ❌ Échecs : ${fail}`);
  console.log("Les articles seront publiés automatiquement chaque semaine (fonction publish-scheduled-posts).");
}

main().catch((err) => { console.error("💥 Erreur fatale:", err.message); process.exit(1); });
