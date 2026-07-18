/**
 * Netlify Edge Function — SSR pour Googlebot sur les pages sans guide-prerender
 *
 * Problème : la page d'accueil (comparateur) et /agences-liste sont des SPA React
 * pures. Googlebot voit <div id="root"></div> vide avant JS — aucun contenu indexable.
 *
 * Solution : détecter les bots et servir du HTML statique riche pour ces pages.
 * Les visiteurs humains continuent de recevoir la SPA React normale.
 */

import type { Context } from "netlify:edge";

const BOT_PATTERN =
  /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|perplexitybot|claudebot|gptbot|anthropic-ai|claude-web|google-extended|chatgpt-user|ccbot|cohere-ai|oai-searchbot/i;

const SITE = "https://omrabonsplans.fr";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ─── Données agences ────────────────────────────────────────────────────────
const AGENCIES = [
  { name: "Medin Voyages",       rating: 5.0, reviews: 269,  highlight: "Agence spécialisée basée à Gennevilliers — note parfaite 5/5" },
  { name: "Al Sirate Voyage",    rating: 5.0, reviews: 1015, highlight: "1 015 avis vérifiés — organisation excellente, guides compétents" },
  { name: "Omra Du Savoir",      rating: 5.0, reviews: 89,   highlight: "Approche pédagogique unique avec note parfaite" },
  { name: "Omra Pour Tous",      rating: 4.9, reviews: 4800, highlight: "Leader du marché — 4 800+ avis, départs multi-villes dès 999€" },
  { name: "TAWAF",               rating: 4.9, reviews: 520,  highlight: "Excellence dans l'accompagnement spirituel et l'organisation" },
  { name: "Sabile Voyages",      rating: 4.9, reviews: 210,  highlight: "1ère agence 100% digitale — voyages sur mesure" },
  { name: "Al Maqam Voyages",    rating: 4.9, reviews: 380,  highlight: "8+ ans d'expérience, formules tout inclus depuis 1 200€" },
  { name: "Pelerinhajj",         rating: 4.9, reviews: 310,  highlight: "Tarifs accessibles dès 999€, forte présence digitale" },
  { name: "Al Hayat Voyages",    rating: 4.9, reviews: 192,  highlight: "Agence officiellement agréée — formules confort et économique" },
  { name: "Partir à la Mecque",  rating: 4.8, reviews: 214,  highlight: "Agrément officiel ministère saoudien du Hajj — formules luxe" },
  { name: "Haramain Voyages",    rating: 4.8, reviews: 237,  highlight: "Organisation complète A–Z avec suivi personnalisé" },
  { name: "Omra Sounnah",        rating: 4.9, reviews: 252,  highlight: "Accompagnement personnalisé — note 4.9/5" },
  { name: "Omra Discount",       rating: 4.9, reviews: 279,  highlight: "Meilleurs prix du marché — offres dès 850€" },
  { name: "Labbayk",             rating: 4.8, reviews: 301,  highlight: "Agence spécialisée reconnue, voyages spirituels de qualité" },
  { name: "MERIDIANIS",          rating: 4.7, reviews: 332,  highlight: "Voyages Omra et Hajj depuis plus de 10 ans" },
  { name: "OMRA GATE",           rating: 4.8, reviews: 180,  highlight: "Agence digitale innovante — réservation simplifiée" },
];

// ─── Pages ──────────────────────────────────────────────────────────────────

function buildHomepage(): string {
  const agenciesHtml = AGENCIES.slice(0, 8).map(a =>
    `<div class="agency-card">
      <strong>${esc(a.name)}</strong>
      <span class="rating">⭐ ${a.rating}/5 (${a.reviews.toLocaleString("fr-FR")} avis)</span>
      <p>${esc(a.highlight)}</p>
      <a href="${SITE}/agence-details/${encodeURIComponent(a.name)}">Voir les avis et offres →</a>
    </div>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comparateur Omra &amp; Hajj 2026 | Omra Bons Plans</title>
  <meta name="description" content="Comparez les meilleures offres Omra 2026 &amp; Hajj 2026 depuis la France. Omra Ramadan, 10 derniers jours du Ramadan, séjours tout compris. Prix mis à jour quotidiennement.">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${SITE}/">
  <meta property="og:title" content="Comparateur Omra &amp; Hajj 2026 | Omra Bons Plans">
  <meta property="og:description" content="Comparez les meilleures offres Omra 2026 depuis la France.">
  <meta property="og:url" content="${SITE}/">
  <meta property="og:type" content="website">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Omra Bons Plans",
    "url": SITE,
    "description": "Comparateur d'offres Omra et Hajj depuis la France — agences agréées, prix, avis.",
    "potentialAction": { "@type": "SearchAction", "target": `${SITE}/comparateur-omra-france?q={search_term_string}`, "query-input": "required name=search_term_string" }
  })}</script>
</head>
<body>
<nav><a href="${SITE}">Omra Bons Plans</a></nav>
<main>
  <h1>Comparateur Omra &amp; Hajj 2026 — Meilleures Offres depuis la France</h1>

  <p>Omra Bons Plans est le premier comparateur français d'offres Omra et Hajj 2026. Comparez en temps réel les prix, dates, hôtels et services de plus de 15 agences agréées en France. Séjours tout compris, vols, hébergements à La Mecque et Médine — trouvez la meilleure offre pour votre pèlerinage.</p>

  <section>
    <h2>Catégories d'offres disponibles</h2>
    <ul>
      <li><a href="${SITE}/category/sejours">Séjours Omra tout compris 2026</a> — Vol + hôtel + transferts + encadrement francophone</li>
      <li><a href="${SITE}/category/vols">Vols pour l'Omra &amp; le Hajj</a> — Vols directs et avec escale vers Djeddah et Médine</li>
      <li><a href="${SITE}/category/hebergements">Hébergements à La Mecque &amp; Médine</a> — Hôtels 3 à 5 étoiles proches du Haram</li>
      <li><a href="${SITE}/category/guides">Guides francophones Omra</a> — Guides expérimentés pour accompagner votre pèlerinage</li>
      <li><a href="${SITE}/category/chauffeurs">Chauffeurs &amp; transport</a> — Transferts privés La Mecque–Médine</li>
      <li><a href="${SITE}/category/babysitting">Garde d'enfants pendant l'Omra</a> — Babysitters francophones à La Mecque</li>
    </ul>
  </section>

  <section>
    <h2>Prix Omra 2026 : à partir de combien ?</h2>
    <p>Les prix Omra 2026 depuis la France commencent à <strong>800€ en basse saison</strong> (Mouharram, Safar — été grégorien) pour un séjour de 10 nuits en hôtel 3 étoiles. En haute saison :</p>
    <ul>
      <li>Basse saison (été islamique) : 800€ à 1 400€ tout compris</li>
      <li>Hiver (décembre–février) : 1 200€ à 2 500€ en 4 étoiles</li>
      <li>Ramadan 2026 : 2 000€ à 5 000€ (10 derniers jours)</li>
      <li>Hajj 2026 : 4 500€ à 12 000€ selon la formule</li>
    </ul>
    <p>Utilisez notre <a href="${SITE}/comparateur-omra-france">comparateur d'offres Omra</a> pour trouver le meilleur prix selon votre ville de départ, vos dates et votre budget.</p>
  </section>

  <section>
    <h2>Agences Omra agréées en France 2026 — Top 8</h2>
    ${agenciesHtml}
    <p><a href="${SITE}/agences-liste">Voir toutes les agences agréées →</a></p>
  </section>

  <section>
    <h2>Guides pratiques Omra &amp; Hajj</h2>
    <ul>
      <li><a href="${SITE}/definition-omra">Qu'est-ce que l'Omra ? Définition et guide complet</a></li>
      <li><a href="${SITE}/conditions-omra">Conditions pour faire l'Omra 2026</a></li>
      <li><a href="${SITE}/rites-omra">Les rites de l'Omra étape par étape</a></li>
      <li><a href="${SITE}/prix-omra-2026">Prix Omra 2026 : tarifs par période et agence</a></li>
      <li><a href="${SITE}/quand-partir-omra">Quand partir en Omra ? Meilleures périodes</a></li>
      <li><a href="${SITE}/visa-omra-france">Visa Omra depuis la France 2026</a></li>
      <li><a href="${SITE}/liste-bagages-omra">Liste des bagages pour l'Omra</a></li>
      <li><a href="${SITE}/omra-femme-seule">Omra femme seule : guide complet</a></li>
      <li><a href="${SITE}/omra-famille">Omra en famille 2026</a></li>
      <li><a href="${SITE}/omra-ramadan-2026">Omra Ramadan 2026 : offres et conseils</a></li>
      <li><a href="${SITE}/hajj-2026">Hajj 2026 : guide complet</a></li>
      <li><a href="${SITE}/meilleure-agence-omra">Quelle est la meilleure agence Omra ?</a></li>
    </ul>
  </section>

  <section>
    <h2>Villes de départ pour l'Omra 2026</h2>
    <ul>
      <li><a href="${SITE}/omra-depuis-paris">Omra depuis Paris (CDG/ORY)</a> — Vols directs quotidiens, 15+ agences</li>
      <li><a href="${SITE}/omra-depuis-lyon">Omra depuis Lyon (LYS)</a></li>
      <li><a href="${SITE}/omra-depuis-marseille">Omra depuis Marseille (MRS)</a></li>
      <li><a href="${SITE}/omra-depuis-toulouse">Omra depuis Toulouse (TLS)</a></li>
      <li><a href="${SITE}/omra-depuis-nice">Omra depuis Nice (NCE)</a></li>
      <li><a href="${SITE}/omra-depuis-bordeaux">Omra depuis Bordeaux (BOD)</a></li>
      <li><a href="${SITE}/omra-depuis-lille">Omra depuis Lille (LIL)</a></li>
      <li><a href="${SITE}/omra-depuis-strasbourg">Omra depuis Strasbourg (SXB)</a></li>
      <li><a href="${SITE}/omra-depuis-nantes">Omra depuis Nantes (NTE)</a></li>
      <li><a href="${SITE}/omra-depuis-montpellier">Omra depuis Montpellier (MPL)</a></li>
    </ul>
  </section>

  <section>
    <h2>Questions fréquentes sur l'Omra 2026</h2>
    <div itemscope itemtype="https://schema.org/FAQPage">
      <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h3 itemprop="name">C'est quoi Omra Bons Plans ?</h3>
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <p itemprop="text">Omra Bons Plans est un comparateur indépendant d'offres Omra et Hajj depuis la France. Notre plateforme agrège les offres de plus de 15 agences agréées en temps réel, permettant aux pèlerins de comparer les prix, les hôtels, les vols et les services en un seul endroit. Nous affichons également les avis Google vérifiés de chaque agence.</p>
        </div>
      </div>
      <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h3 itemprop="name">Comment trouver la meilleure offre Omra 2026 ?</h3>
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <p itemprop="text">Utilisez notre comparateur pour filtrer les offres par ville de départ, période, budget et standing d'hôtel. Comparez au moins 3 devis pour les mêmes dates. Vérifiez que l'agence est agréée ATOUT FRANCE et a une note Google supérieure à 4,3/5 avec au moins 200 avis. Réservez 2 à 6 mois à l'avance pour les meilleures disponibilités.</p>
        </div>
      </div>
      <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h3 itemprop="name">Quel est le prix moyen d'une Omra depuis la France en 2026 ?</h3>
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <p itemprop="text">Le prix moyen d'une Omra depuis la France en 2026 est de 1 500€ à 2 000€ pour un séjour de 10 nuits en hôtel 4 étoiles, hors Ramadan. En basse saison, les offres commencent à 800€. Pendant le Ramadan, les prix doublent et atteignent 2 500 à 5 000€ pour les 10 derniers jours.</p>
        </div>
      </div>
      <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h3 itemprop="name">Quelles agences Omra sont recommandées en France ?</h3>
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <p itemprop="text">Les agences Omra les mieux notées en France selon les avis Google 2026 sont : Omra Pour Tous (4,9/5 — 4 800 avis), TAWAF (4,9/5), Sabile Voyages (4,9/5), Al Maqam Voyages (4,9/5), Medin Voyages (5,0/5). Toutes sont agréées et proposent des départs depuis Paris et les grandes villes françaises.</p>
        </div>
      </div>
      <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h3 itemprop="name">Peut-on faire l'Omra sans agence en 2026 ?</h3>
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <p itemprop="text">Oui, il est possible de faire l'Omra en autonomie avec le visa touristique saoudien (eVisa, environ 110€). Vous réservez vous-même le vol, l'hôtel et les transferts. Cette option est 20 à 40% moins chère mais demande plus d'organisation. Elle est déconseillée aux primo-pèlerins qui bénéficieront de l'encadrement d'une agence agréée.</p>
        </div>
      </div>
    </div>
  </section>
</main>
<footer>
  <nav>
    <a href="${SITE}/about">À propos</a> |
    <a href="${SITE}/contact">Contact</a> |
    <a href="${SITE}/blog">Blog Omra &amp; Hajj</a> |
    <a href="${SITE}/agences-liste">Agences agréées</a> |
    <a href="${SITE}/comparateur-omra-france">Comparateur Omra</a>
  </nav>
</footer>
</body>
</html>`;
}

function buildAgenciesPage(): string {
  const agenciesHtml = AGENCIES.map(a =>
    `<article>
      <h2><a href="${SITE}/agence-details/${encodeURIComponent(a.name)}">${esc(a.name)}</a></h2>
      <p>⭐ <strong>${a.rating}/5</strong> — ${a.reviews.toLocaleString("fr-FR")} avis Google vérifiés</p>
      <p>${esc(a.highlight)}</p>
    </article>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agences Omra &amp; Hajj Agréées en France 2026 | Omra Bons Plans</title>
  <meta name="description" content="Liste complète des agences Omra et Hajj agréées en France 2026. Avis Google vérifiés, notes, tarifs et spécialités. Trouvez l'agence idéale pour votre pèlerinage.">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${SITE}/agences-liste">
</head>
<body>
<nav>
  <a href="${SITE}">Omra Bons Plans</a> › <span>Agences agréées</span>
</nav>
<main>
  <h1>Agences Omra &amp; Hajj Agréées en France 2026</h1>
  <p>Retrouvez ci-dessous les <strong>${AGENCIES.length} agences Omra et Hajj agréées</strong> référencées sur Omra Bons Plans. Toutes disposent de l'agrément ATOUT FRANCE et sont autorisées à organiser des voyages de pèlerinage depuis la France. Les notes sont issues des avis Google vérifiés.</p>

  <p>Pour comparer leurs offres et prix en temps réel, utilisez notre <a href="${SITE}/comparateur-omra-france">comparateur d'offres Omra 2026</a>.</p>

  <section>
    ${agenciesHtml}
  </section>

  <section>
    <h2>Comment choisir son agence Omra ?</h2>
    <p>Avant de réserver, vérifiez systématiquement :</p>
    <ul>
      <li>L'agrément ATOUT FRANCE (obligatoire légalement)</li>
      <li>La note Google : minimum 4,3/5 avec au moins 200 avis récents</li>
      <li>L'existence d'une adresse physique en France et d'un numéro fixe</li>
      <li>L'assurance annulation incluse dans le contrat</li>
      <li>La qualité de l'hôtel et la distance au Masjid al-Haram</li>
    </ul>
    <p>Lisez notre guide complet : <a href="${SITE}/meilleure-agence-omra">Comment choisir la meilleure agence Omra</a>.</p>
  </section>
</main>
</body>
</html>`;
}

function buildComparateurPage(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comparateur Omra France 2026 — Comparez 15+ Agences | Omra Bons Plans</title>
  <meta name="description" content="Comparateur Omra France 2026 : comparez les offres de 15+ agences agréées. Prix, hôtels, vols, dates — trouvez le meilleur séjour Omra tout compris depuis votre ville.">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${SITE}/comparateur-omra-france">
</head>
<body>
<nav><a href="${SITE}">Omra Bons Plans</a> › <span>Comparateur Omra France</span></nav>
<main>
  <h1>Comparateur Omra France 2026 — 15+ Agences Agréées</h1>

  <p>Notre comparateur Omra France 2026 vous permet de comparer en temps réel les offres de plus de 15 agences agréées en France. Filtrez par ville de départ, période, budget, standing d'hôtel et formule (séjour, vol seul, hébergement). Trouvez le meilleur prix pour votre Omra 2026 ou Hajj 2026.</p>

  <section>
    <h2>Filtres disponibles sur notre comparateur</h2>
    <ul>
      <li><strong>Ville de départ</strong> : Paris, Lyon, Marseille, Toulouse, Nice, Bordeaux, Lille, Strasbourg, Nantes, Montpellier…</li>
      <li><strong>Période</strong> : juillet 2026, août 2026, Ramadan 2027, hiver 2026-2027…</li>
      <li><strong>Budget</strong> : de 800€ à 5 000€+</li>
      <li><strong>Formule</strong> : Omra tout compris, vol seul, hébergement seul, guide francophone</li>
      <li><strong>Standing hôtel</strong> : 3★, 4★, 5★, distance au Haram</li>
    </ul>
  </section>

  <section>
    <h2>Offres Omra disponibles par période (2026-2027)</h2>
    <ul>
      <li><a href="${SITE}/omra-en-octobre-2026">Omra Octobre 2026</a> — températures agréables, prix modérés</li>
      <li><a href="${SITE}/omra-en-novembre-2026">Omra Novembre 2026</a> — hors saison, idéal pour le recueillement</li>
      <li><a href="${SITE}/omra-en-decembre-2026">Omra Décembre 2026</a> — vacances scolaires, idéal en famille</li>
      <li><a href="${SITE}/omra-en-janvier-2027">Omra Janvier 2027</a> — début d'année, prix attractifs</li>
      <li><a href="${SITE}/omra-ramadan-2026">Omra Ramadan 2026</a> — période la plus méritoire spirituellement</li>
    </ul>
  </section>

  <section>
    <h2>Agences comparées sur notre plateforme</h2>
    <ul>
      ${AGENCIES.map(a => `<li><a href="${SITE}/agence-details/${encodeURIComponent(a.name)}">${esc(a.name)}</a> — ⭐ ${a.rating}/5 (${a.reviews} avis)</li>`).join("\n      ")}
    </ul>
    <p><a href="${SITE}/agences-liste">Voir toutes les agences →</a></p>
  </section>
</main>
</body>
</html>`;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req: Request, context: Context) {
  const userAgent = req.headers.get("user-agent") || "";
  if (!BOT_PATTERN.test(userAgent)) return context.next();

  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";

  let html: string;

  if (path === "/" || path === "/hajj" || path === "/hajj-2026" || path === "/bons-plans") {
    html = buildHomepage();
  } else if (path === "/agences-liste" || path === "/comparatif-agences" || path === "/comparatif-visuel") {
    html = buildAgenciesPage();
  } else if (path === "/comparateur-omra-france") {
    html = buildComparateurPage();
  } else {
    return context.next();
  }

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
      "x-robots-tag": "index, follow",
    },
  });
}

export const config = {
  path: ["/", "/hajj", "/hajj-2026", "/bons-plans", "/agences-liste", "/comparatif-agences", "/comparatif-visuel", "/comparateur-omra-france"],
};
