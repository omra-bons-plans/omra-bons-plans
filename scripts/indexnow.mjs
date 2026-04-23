const KEY = '538c181b1abec769ff76fbdf9f6e8f53';
const HOST = 'omrabonsplans.fr';

const urls = [
  `https://${HOST}/`,
  `https://${HOST}/omra-famille`,
  `https://${HOST}/omra-seniors`,
  `https://${HOST}/omra-enfants`,
  `https://${HOST}/omra-badal`,
  `https://${HOST}/10-derniers-jours-ramadan`,
  `https://${HOST}/hajj`,
  `https://${HOST}/about`,
  `https://${HOST}/contact`,
  `https://${HOST}/comparatif-agences`,
  `https://${HOST}/agences-liste`,
  `https://${HOST}/comparatif-visuel`,
  `https://${HOST}/comparateur-omra-france`,
  `https://${HOST}/definition-omra`,
  `https://${HOST}/quand-partir-omra`,
  `https://${HOST}/omra-debutant`,
  `https://${HOST}/conditions-omra`,
  `https://${HOST}/guide-omra-pas-chere`,
  `https://${HOST}/rites-omra`,
  `https://${HOST}/hajj-2026`,
  `https://${HOST}/omra-tout-compris`,
  `https://${HOST}/meilleure-agence-omra`,
  `https://${HOST}/liste-bagages-omra`,
  `https://${HOST}/prix-omra-2026`,
  `https://${HOST}/omra-ramadan-2026`,
  `https://${HOST}/omra-femme-seule`,
  `https://${HOST}/visa-omra-france`,
  `https://${HOST}/omra-depuis-paris`,
  `https://${HOST}/omra-depuis-lyon`,
  `https://${HOST}/omra-depuis-marseille`,
  `https://${HOST}/omra-depuis-toulouse`,
  `https://${HOST}/omra-depuis-nice`,
  `https://${HOST}/omra-depuis-bordeaux`,
  `https://${HOST}/omra-depuis-strasbourg`,
  `https://${HOST}/omra-depuis-lille`,
  `https://${HOST}/omra-en-octobre-2026`,
  `https://${HOST}/omra-en-novembre-2026`,
  `https://${HOST}/omra-en-decembre-2026`,
  `https://${HOST}/omra-en-janvier-2027`,
  `https://${HOST}/prayer-times`,
  `https://${HOST}/guide-hajj-4-ecoles`,
];

const body = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urls,
});

console.log(`Submitting ${urls.length} URLs to IndexNow...`);

const endpoints = [
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

let success = false;
for (const url of endpoints) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  });
  if (res.ok || res.status === 202) {
    console.log(`✓ ${url} accepted (HTTP ${res.status})`);
    success = true;
  } else {
    const text = await res.text();
    console.warn(`✗ ${url} rejected (HTTP ${res.status}): ${text}`);
  }
}

if (!success) process.exit(1);
