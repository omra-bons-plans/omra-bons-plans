// Pré-rendu des pages statiques : génère dist/<route>/index.html pour que les
// robots (Googlebot, GPTBot, PerplexityBot…) voient le contenu sans JavaScript.
// Lancé automatiquement après `vite build` (npm postbuild).
import { preview } from 'vite';
import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

// Pages statiques à pré-rendre (alignées sur le sitemap — les pages SEO clés).
const ROUTES = [
  '/', '/hajj', '/bons-plans',
  '/comparateur-omra-france', '/agences-liste',
  '/guide-omra-pas-chere', '/guide-hajj-4-ecoles',
  '/definition-omra', '/conditions-omra', '/rites-omra',
  '/visa-omra-france', '/quand-partir-omra', '/prix-omra-2026',
  '/liste-bagages-omra', '/meilleure-agence-omra',
  '/omra-tout-compris', '/omra-debutant', '/omra-ramadan-2027',
  '/omra-femme-seule', '/omra-famille', '/omra-seniors', '/omra-enfants', '/omra-badal',
  '/10-derniers-jours-ramadan',
  '/omra-depuis-paris', '/omra-depuis-lyon', '/omra-depuis-marseille',
  '/omra-depuis-toulouse', '/omra-depuis-nice', '/omra-depuis-bordeaux',
  '/omra-depuis-strasbourg', '/omra-depuis-lille', '/omra-depuis-nantes',
  '/omra-depuis-rennes', '/omra-depuis-montpellier', '/omra-depuis-grenoble',
  '/omra-depuis-metz', '/omra-depuis-clermont-ferrand',
  '/omra-en-octobre-2026', '/omra-en-novembre-2026', '/omra-en-decembre-2026', '/omra-en-janvier-2027',
  '/ramadan-hajj-dates', '/about', '/contact', '/blog',
];

const previewServer = await preview({ preview: { port: PORT, host: 'localhost', strictPort: true } });

let browser;
try {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
} catch (e) {
  console.error('⚠ Échec du lancement de Chromium :', e.message);
  console.error('(le pré-rendu est sauté ; le build SPA reste fonctionnel)');
  await previewServer.close();
  process.exit(0);
}

let ok = 0;
let fail = 0;

for (const route of ROUTES) {
  const page = await browser.newPage();
  try {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2500)); // laisser React + react-helmet rendre
    const html = await page.content();
    const rel = route === '/' ? '' : route.replace(/^\//, '').replace(/\/$/, '');
    const outDir = path.join('dist', rel);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
    ok++;
  } catch (e) {
    console.error('✗', route, e.message);
    fail++;
  } finally {
    await page.close();
  }
}

await browser.close();
await previewServer.close();
console.log(`Pré-rendu terminé : ${ok} pages ok, ${fail} échec.`);
