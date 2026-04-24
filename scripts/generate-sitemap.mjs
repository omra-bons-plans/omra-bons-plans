#!/usr/bin/env node
/**
 * Génère public/sitemap.xml en synchronisant :
 *  - les routes publiques statiques déclarées dans src/App.tsx
 *  - les articles de blog publiés (table blog_posts)
 *  - les fiches agences (table agencies)
 *
 * Usage : node scripts/generate-sitemap.mjs
 *         node scripts/generate-sitemap.mjs --check   (mode contrôle, exit 1 si désync)
 *
 * Variables d'env requises pour récupérer blog/agences :
 *   VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY (ou SUPABASE_ANON_KEY)
 * Si elles sont absentes, le script garde les sections dynamiques telles quelles.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const APP_TSX = path.join(ROOT, 'src/App.tsx');
const SITEMAP_PATH = path.join(ROOT, 'public/sitemap.xml');
const SITE = 'https://omrabonsplans.fr';

const CHECK_ONLY = process.argv.includes('--check');

// ──────────────────────────────────────────────────────────────
// 1. Routes publiques explicitement listées (source de vérité)
//    Toute nouvelle page publique DOIT être ajoutée ici.
// ──────────────────────────────────────────────────────────────
const STATIC_ROUTES = [
  // Pages principales
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/bons-plans', priority: 0.8, changefreq: 'daily' },
  { path: '/hajj', priority: 0.9, changefreq: 'daily' },
  { path: '/hajj-2026', priority: 0.95, changefreq: 'weekly' },
  { path: '/about', priority: 0.6, changefreq: 'monthly' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },

  // Comparateurs & agences
  { path: '/comparateur-omra-france', priority: 0.95, changefreq: 'monthly' },
  { path: '/comparatif-agences', priority: 0.9, changefreq: 'weekly' },
  { path: '/agences-liste', priority: 0.8, changefreq: 'weekly' },
  { path: '/comparatif-visuel', priority: 0.6, changefreq: 'monthly' },

  // Guides & contenu SEO
  { path: '/guide-omra-pas-chere', priority: 0.9, changefreq: 'monthly' },
  { path: '/guide-hajj-4-ecoles', priority: 0.85, changefreq: 'monthly' },
  { path: '/definition-omra', priority: 0.9, changefreq: 'monthly' },
  { path: '/conditions-omra', priority: 0.85, changefreq: 'monthly' },
  { path: '/rites-omra', priority: 0.9, changefreq: 'monthly' },
  { path: '/visa-omra-france', priority: 0.8, changefreq: 'monthly' },
  { path: '/quand-partir-omra', priority: 0.88, changefreq: 'monthly' },
  { path: '/prix-omra-2026', priority: 0.9, changefreq: 'weekly' },
  { path: '/liste-bagages-omra', priority: 0.8, changefreq: 'monthly' },
  { path: '/meilleure-agence-omra', priority: 0.85, changefreq: 'monthly' },

  // Variantes Omra
  { path: '/omra-tout-compris', priority: 0.9, changefreq: 'weekly' },
  { path: '/omra-debutant', priority: 0.88, changefreq: 'monthly' },
  { path: '/omra-ramadan-2026', priority: 0.9, changefreq: 'weekly' },
  { path: '/omra-femme-seule', priority: 0.8, changefreq: 'monthly' },
  { path: '/omra-famille', priority: 0.85, changefreq: 'monthly' },
  { path: '/omra-seniors', priority: 0.8, changefreq: 'monthly' },
  { path: '/omra-enfants', priority: 0.8, changefreq: 'monthly' },
  { path: '/omra-badal', priority: 0.75, changefreq: 'monthly' },
  { path: '/10-derniers-jours-ramadan', priority: 0.9, changefreq: 'yearly' },

  // Omra par ville (route paramétrée /omra-depuis-:ville)
  { path: '/omra-depuis-paris', priority: 0.7, changefreq: 'monthly' },
  { path: '/omra-depuis-lyon', priority: 0.7, changefreq: 'monthly' },
  { path: '/omra-depuis-marseille', priority: 0.7, changefreq: 'monthly' },
  { path: '/omra-depuis-toulouse', priority: 0.7, changefreq: 'monthly' },
  { path: '/omra-depuis-nice', priority: 0.7, changefreq: 'monthly' },
  { path: '/omra-depuis-bordeaux', priority: 0.7, changefreq: 'monthly' },
  { path: '/omra-depuis-strasbourg', priority: 0.7, changefreq: 'monthly' },
  { path: '/omra-depuis-lille', priority: 0.7, changefreq: 'monthly' },

  // Omra par mois
  { path: '/omra-en-octobre-2026', priority: 0.8, changefreq: 'monthly' },
  { path: '/omra-en-novembre-2026', priority: 0.8, changefreq: 'monthly' },
  { path: '/omra-en-decembre-2026', priority: 0.8, changefreq: 'monthly' },
  { path: '/omra-en-janvier-2027', priority: 0.8, changefreq: 'monthly' },

  // Outils islamiques
  { path: '/prayer-times', priority: 0.8, changefreq: 'daily' },
  { path: '/islamic-calendar', priority: 0.7, changefreq: 'monthly' },
  { path: '/ramadan-hajj-dates', priority: 0.7, changefreq: 'monthly' },

  // Communauté
  { path: '/discussions', priority: 0.6, changefreq: 'daily' },

  // Blog (index + catégories)
  { path: '/blog', priority: 0.9, changefreq: 'daily' },
  { path: '/blog/general', priority: 0.8, changefreq: 'weekly' },
  { path: '/blog/restaurants', priority: 0.7, changefreq: 'weekly' },
  { path: '/blog/associations', priority: 0.7, changefreq: 'weekly' },
  { path: '/blog/vendeurs', priority: 0.7, changefreq: 'weekly' },

  // Catégories d'annonces
  { path: '/category/sejours', priority: 0.9, changefreq: 'daily' },
  { path: '/category/vols', priority: 0.9, changefreq: 'daily' },
  { path: '/category/hebergements', priority: 0.8, changefreq: 'weekly' },
  { path: '/category/guides', priority: 0.8, changefreq: 'weekly' },
  { path: '/category/chauffeurs', priority: 0.8, changefreq: 'weekly' },
  { path: '/category/babysitting', priority: 0.7, changefreq: 'weekly' },
];

// Routes du router à IGNORER (privées, dynamiques, redirections, techniques)
const IGNORED_PATTERNS = [
  /^\/sitemap\.xml$/,
  /^\/auth/, /^\/profile/, /^\/my-ads/, /^\/settings/, /^\/admin/,
  /^\/publish/, /^\/notifications/, /^\/favoris/, /^\/search/,
  /^\/ad-summary/, /^\/ad\/:/, /^\/offre-(omra|hajj)\/:/,
  /^\/agence-details\/:/,         // généré dynamiquement plus bas
  /^\/blog\/:/,                   // catégories listées explicitement
  /^\/category\/:/,               // catégories listées explicitement
  /^\/profile\/:/,
  /^\/omra-depuis-:/,             // villes listées explicitement
  /^\/omra$/,                     // redirige vers /
  /^\/comparateur-omra$/,         // redirige vers /omra
  /^\/a-propos|^\/calendrier-islamique|^\/dates-ramadan-hajj|^\/horaires-prieres/,
  /^\/services\//,
  /^\/home$|^\/test$|^\/checkout$|^\/all-ads$/,
  /^\/2019/,
  /^\/guide-hajj-4-écoles$/,      // version accentuée redirigée
  /^\/competitive-|^\/five-ways|^\/how-to-|^\/increase-|^\/three-|^\/use-the-|^\/why-online/, // anciens slugs blog EN
];

// ──────────────────────────────────────────────────────────────
// 2. Extraction des routes du router (pour contrôle de cohérence)
// ──────────────────────────────────────────────────────────────
function extractRouterPaths() {
  const src = fs.readFileSync(APP_TSX, 'utf-8');
  const re = /<Route\s+path="([^"]+)"/g;
  const paths = new Set();
  let m;
  while ((m = re.exec(src)) !== null) paths.add(m[1]);
  return [...paths];
}

function isIgnored(p) {
  return IGNORED_PATTERNS.some((re) => re.test(p));
}

function expectedPublicPaths() {
  const router = extractRouterPaths();
  return router.filter((p) => !isIgnored(p));
}

// ──────────────────────────────────────────────────────────────
// 3. Récupération des données dynamiques (blog + agences)
// ──────────────────────────────────────────────────────────────
async function fetchSupabase(table, query) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    console.warn(`⚠️  Supabase fetch ${table}: ${res.status}`);
    return null;
  }
  return res.json();
}

async function fetchBlogPosts() {
  const rows = await fetchSupabase(
    'blog_posts',
    'select=slug,category,updated_at,published_at,created_at&is_published=eq.true&order=updated_at.desc'
  );
  if (!rows) return null;
  const now = Date.now();
  return rows
    .filter((r) => !r.published_at || new Date(r.published_at).getTime() <= now)
    .map((r) => ({
      path: `/blog/${r.category || 'general'}/${r.slug}`,
      lastmod: (r.updated_at || r.published_at || r.created_at || '').slice(0, 10),
      priority: 0.7,
      changefreq: 'monthly',
    }));
}

async function fetchAgencies() {
  const rows = await fetchSupabase('agencies', 'select=name,updated_at&order=name.asc');
  if (!rows) return null;
  return rows.map((r) => ({
    // ⚠️ doit matcher AgenceDetails.tsx → encodeURIComponent(agency.name)
    path: `/agence-details/${encodeURIComponent(r.name)}`,
    lastmod: (r.updated_at || '').slice(0, 10) || today(),
    priority: 0.6,
    changefreq: 'weekly',
  }));
}

// ──────────────────────────────────────────────────────────────
// 4. Génération du XML
// ──────────────────────────────────────────────────────────────
function today() {
  return new Date().toISOString().slice(0, 10);
}

function urlBlock({ path: p, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${lastmod || today()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(2)}</priority>
  </url>`;
}

function buildXml(sections) {
  const blocks = [];
  for (const [title, urls] of sections) {
    if (!urls.length) continue;
    blocks.push(`  <!-- ${title} -->`);
    blocks.push(urls.map(urlBlock).join('\n'));
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blocks.join('\n\n')}
</urlset>
`;
}

// ──────────────────────────────────────────────────────────────
// 5. Contrôle de cohérence
// ──────────────────────────────────────────────────────────────
function runCheck() {
  const expected = expectedPublicPaths();
  const declared = new Set(STATIC_ROUTES.map((r) => r.path));
  // Sections dynamiques connues (pas dans STATIC_ROUTES)
  const dynamicPrefixes = ['/agence-details/', '/blog/', '/category/', '/omra-depuis-'];

  const missing = expected.filter((p) => {
    if (p === '*') return false;                              // route NotFound catch-all
    if (declared.has(p)) return false;
    if (dynamicPrefixes.some((pre) => p.startsWith(pre))) return false;
    return true;
  });

  const obsolete = [...declared].filter((p) => {
    // routes paramétrées du router qui matchent ces chemins
    if (p.startsWith('/omra-depuis-')) return true && false;  // matched by /omra-depuis-:ville
    if (p.startsWith('/omra-en-')) return false;              // chaque mois a sa Route explicite
    if (p.startsWith('/blog/')) return false;                 // matched by /blog/:category
    if (p.startsWith('/category/')) return false;             // matched by /category/:category
    return !expected.includes(p);
  });

  if (missing.length) {
    console.error('❌ Routes publiques absentes du sitemap :');
    missing.forEach((p) => console.error('   -', p));
  }
  if (obsolete.length) {
    console.error('❌ Entrées du sitemap sans route correspondante :');
    obsolete.forEach((p) => console.error('   -', p));
  }
  if (!missing.length && !obsolete.length) {
    console.log('✅ sitemap.xml synchronisé avec le router');
    return 0;
  }
  return 1;
}

// ──────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────
(async () => {
  if (CHECK_ONLY) {
    process.exit(runCheck());
  }

  const code = runCheck();
  if (code !== 0) {
    console.warn('⚠️  Désynchronisation détectée — génération malgré tout.');
  }

  const blog = (await fetchBlogPosts()) ?? [];
  const agencies = (await fetchAgencies()) ?? [];

  const staticUrls = STATIC_ROUTES.map((r) => ({ ...r, lastmod: today() }));

  const sections = [
    ['Pages principales & comparateurs', staticUrls.filter((u) => !u.path.startsWith('/blog') && !u.path.startsWith('/category/'))],
    ['Catégories d\'annonces', staticUrls.filter((u) => u.path.startsWith('/category/'))],
    ['Blog (index & catégories)', staticUrls.filter((u) => u.path.startsWith('/blog'))],
    ['Articles de blog', blog],
    ['Fiches agences', agencies],
  ];

  const xml = buildXml(sections);
  fs.writeFileSync(SITEMAP_PATH, xml, 'utf-8');
  const total = sections.reduce((acc, [, u]) => acc + u.length, 0);
  console.log(`✅ sitemap.xml généré — ${total} URLs`);
})().catch((e) => {
  console.error('💥 Erreur génération sitemap :', e);
  process.exit(1);
});
