#!/usr/bin/env node
// Google Indexing API — soumet les URLs prioritaires après chaque deploy sur main
// Nécessite la variable d'environnement GOOGLE_SERVICE_ACCOUNT_JSON (GitHub Secret)
import { createSign } from 'node:crypto';

const SITE = 'https://omrabonsplans.fr';

// URLs prioritaires — quota Google : 200/jour
const URLS = [
  // Pages principales
  '/',
  '/bons-plans',
  '/hajj',
  '/hajj-2026',
  '/comparateur-omra-france',
  '/agences-liste',
  '/comparatif-agences',
  '/les-hotels',

  // Guides
  '/meilleure-agence-omra',
  '/prix-omra-2026',
  '/omra-tout-compris',
  '/omra-femme-seule',
  '/omra-ramadan-2026',
  '/omra-en-janvier-2027',
  '/omra-en-decembre-2026',
  '/omra-en-novembre-2026',
  '/omra-en-octobre-2026',
  '/ramadan-hajj-dates',
  '/visa-omra-france',
  '/definition-omra',
  '/rites-omra',
  '/omra-debutant',
  '/omra-famille',
  '/omra-seniors',
  '/omra-enfants',
  '/omra-badal',
  '/guide-hajj-4-ecoles',
  '/liste-bagages-omra',
  '/guide-omra-pas-chere',
  '/10-derniers-jours-ramadan',

  // Omra depuis les villes
  '/omra-depuis-paris',
  '/omra-depuis-lyon',
  '/omra-depuis-marseille',
  '/omra-depuis-toulouse',
  '/omra-depuis-nice',
  '/omra-depuis-bordeaux',
  '/omra-depuis-strasbourg',
  '/omra-depuis-lille',
  '/omra-depuis-nantes',
  '/omra-depuis-rennes',
  '/omra-depuis-montpellier',
  '/omra-depuis-grenoble',
  '/omra-depuis-metz',
  '/omra-depuis-clermont-ferrand',

  // Horaires de prière — villes prioritaires
  '/horaires-priere/paris',
  '/horaires-priere/marseille',
  '/horaires-priere/lyon',
  '/horaires-priere/toulouse',
  '/horaires-priere/nice',
  '/horaires-priere/nantes',
  '/horaires-priere/bordeaux',
  '/horaires-priere/lille',
  '/horaires-priere/strasbourg',
  '/horaires-priere/rennes',
  '/horaires-priere/montpellier',
  '/horaires-priere/grenoble',
  '/horaires-priere/clermont-ferrand',
  '/horaires-priere/metz',
  '/horaires-priere/orleans',
  '/horaires-priere/dijon',
  '/horaires-priere/angers',
  '/horaires-priere/rouen',
  '/horaires-priere/caen',
  '/horaires-priere/saint-etienne',

  // Coran — index + sourates populaires
  '/coran',
  '/coran/al-fatiha',
  '/coran/al-baqara',
  '/coran/al-imran',
  '/coran/ya-sin',
  '/coran/ar-rahman',
  '/coran/al-kahf',
  '/coran/al-mulk',
  '/coran/al-ikhlas',
  '/coran/al-falaq',
  '/coran/an-nas',
  '/coran/al-asr',
  '/coran/al-fajr',
  '/coran/al-waqia',
  '/coran/al-muzzammil',
];

function b64url(str) {
  return Buffer.from(str).toString('base64url');
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const msg = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(msg);
  const jwt = `${msg}.${sign.sign(sa.private_key, 'base64url')}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Auth échouée : ${data.error_description ?? data.error}`);
  }
  return data.access_token;
}

async function notifyUrl(token, url) {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  });
  return { status: res.status, body: await res.json() };
}

const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
if (!raw) {
  console.log('GOOGLE_SERVICE_ACCOUNT_JSON non défini — étape ignorée.');
  process.exit(0);
}

const sa = JSON.parse(raw);
const token = await getAccessToken(sa);
console.log(`✓ Authentifié en tant que ${sa.client_email}\n`);

let ok = 0, quota = 0, err = 0;
for (const path of URLS) {
  const url = `${SITE}${path}`;
  try {
    const { status, body } = await notifyUrl(token, url);
    if (status === 200) {
      console.log(`✅ ${url}`);
      ok++;
    } else if (status === 429) {
      console.warn(`⚠️  ${url} → quota journalier dépassé (429)`);
      quota++;
    } else {
      console.warn(`⚠️  ${url} → HTTP ${status}: ${body.error?.message ?? JSON.stringify(body)}`);
      err++;
    }
  } catch (e) {
    console.error(`❌ ${url} → ${e.message}`);
    err++;
  }
  // Pause pour respecter le quota
  await new Promise(r => setTimeout(r, 150));
}

console.log(`\nRésultat : ${ok} soumises ✅  ${quota} quota dépassé ⚠️  ${err} erreurs ❌`);
if (quota > 0 && err === 0) console.log('ℹ️  Quota journalier Google atteint — les URLs restantes seront soumises au prochain déploiement.');
if (err > 0) process.exit(1);
