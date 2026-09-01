/**
 * Netlify Edge Function — SEO meta-tag injection for all static public pages
 *
 * Why: As a SPA, the raw index.html is identical for every route. Googlebot's
 * pre-JS crawl therefore sees the same canonical/title/OG on /comparateur,
 * /hajj, etc. → flagged as "Duplicate without user-selected canonical".
 *
 * What it does: For known SEO routes, intercept the HTML response and rewrite
 * <title>, meta description/keywords, canonical, OG and Twitter tags so that
 * each route ships its own correct SEO signals BEFORE React hydrates.
 *
 * Applied to ALL visitors (not just bots) — that's the only way Googlebot's
 * initial fetch sees the right canonical without waiting for JS.
 */

import type { Context } from "netlify:edge";

interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

const SITE = "https://omrabonsplans.fr";
const DEFAULT_OG = `${SITE}/hero-kaaba-optimized.webp`;

const BOT_PATTERN = /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|perplexitybot|claudebot|gptbot|anthropic-ai|claude-web|google-extended|chatgpt-user|ccbot|cohere-ai|oai-searchbot/i;

const PAGES: Record<string, PageMeta> = {
  "/": {
    title: "Comparateur Omra & Hajj 2027 | Omra Ramadan — Omra Bons Plans",
    description: "Comparez les meilleures offres Omra 2027 & Hajj 2027 depuis la France 🇫🇷. Omra Ramadan, 10 derniers jours du Ramadan, séjours tout compris. Prix mis à jour quotidiennement.",
    keywords: "omra 2027, omra2027, hajj 2027, omra ramadan, 10 derniers jours ramadan, omra pas chère, séjour omra tout compris, agence omra France",
    canonical: `${SITE}/`,
  },
  "/omra": {
    title: "Comparateur Omra 2026 — Agences Agréées | Omra Bons Plans",
    description: "Comparez les offres Omra 2026 de toutes les agences agréées en France 🇫🇷. Filtres par dates, ville, hôtel, prix. Trouvez votre Omra idéale en quelques clics.",
    keywords: "comparateur omra, omra 2026, agences omra France, prix omra, séjour omra",
    canonical: `${SITE}/omra`,
  },
  "/hajj": {
    title: "Comparateur Hajj 2027 — Agences Agréées | Omra Bons Plans",
    description: "Comparez les offres Hajj 2027 des agences agréées en France 🇫🇷. Filtres par dates, hôtel, encadrement, prix. Trouvez votre Hajj idéal facilement.",
    keywords: "hajj 2027, comparateur hajj, agences hajj France, prix hajj, pèlerinage Mecque",
    canonical: `${SITE}/hajj`,
  },
  "/hajj-2027": {
    title: "Hajj 2027 : Dates (26-31 mai), Prix et Meilleures Agences | Omra Bons Plans",
    description: "Hajj 2027 : dates du 26 au 31 mai 2027 (Arafat 27 mai), prix 5 000€-15 000€+, inscription Nusuk et comparatif des meilleures agences agréées en France.",
    keywords: "hajj 2027, date hajj 2027, prix hajj 2027, inscription hajj 2027, agence hajj france",
    canonical: `${SITE}/hajj-2027`,
  },
  "/hajj-2026": {
    title: "Hajj 2026 : Dates, Prix et Meilleures Agences | Omra Bons Plans",
    description: "Tout sur le Hajj 2026 : dates officielles, prix, conditions et comparatif des meilleures agences agréées en France. Préparez votre pèlerinage.",
    canonical: `${SITE}/hajj-2026`,
  },
  "/comparateur-omra-france": {
    title: "Comparateur Omra France 2026 | Toutes les Agences Agréées",
    description: "Le comparateur Omra n°1 en France 🇫🇷. Comparez plus de 20 agences agréées, prix mis à jour quotidiennement. Trouvez votre Omra 2026.",
    keywords: "comparateur omra France, omra 2026, agences omra agréées",
    canonical: `${SITE}/comparateur-omra-france`,
  },
  "/comparatif-agences": {
    title: "Comparatif des Agences Omra 2026 | Avis et Notes | Omra Bons Plans",
    description: "Comparatif détaillé des agences Omra agréées en France : avis Google, notes, prix, services. Choisissez la meilleure agence pour votre Omra.",
    canonical: `${SITE}/comparatif-agences`,
  },
  "/comparatif-visuel": {
    title: "Comparatif Visuel des Offres Omra | Omra Bons Plans",
    description: "Comparez visuellement les offres Omra : hôtels, prix, dates côte à côte. Outil de comparaison pratique pour choisir votre voyage.",
    canonical: `${SITE}/comparatif-visuel`,
  },
  "/bons-plans": {
    title: "Bons Plans Omra & Hajj 2026 | Promotions | Omra Bons Plans",
    description: "Découvrez les meilleurs bons plans Omra et Hajj 2026 : promotions, offres limitées, prix réduits chez les agences agréées en France.",
    keywords: "bons plans omra, promo omra, omra pas chère, offres hajj",
    canonical: `${SITE}/bons-plans`,
  },
  "/agences-liste": {
    title: "Liste des Agences Omra & Hajj Agréées en France | Omra Bons Plans",
    description: "Annuaire complet des agences Omra & Hajj agréées en France 🇫🇷. Notes, avis, contacts et offres de chaque agence vérifiée.",
    canonical: `${SITE}/agences-liste`,
  },
  "/coran": {
    title: "Le Coran en Français — Les 114 Sourates | Omra Bons Plans",
    description: "Lisez le Coran en français et en arabe : les 114 sourates avec traduction complète de Mohammed Hamidullah. Texte arabe authentique et traduction française intégrale.",
    keywords: "coran en français, sourates coran, traduction coran français, lire coran, coran arabe français",
    canonical: `${SITE}/coran`,
  },
  "/les-hotels": {
    title: "Hôtels Omra 2026 : La Mecque & Médine — Guide Complet | Omra Bons Plans",
    description: "Tous les hôtels pour votre Omra 2026 : La Mecque et Médine. Distance au Haram, note Booking, prix par nuit, points forts et faibles. Comparez et choisissez.",
    keywords: "hôtels omra la mecque, hôtels médine, hébergement omra 2026, hotel haram, hotel masjid nabawi",
    canonical: `${SITE}/les-hotels`,
  },
  "/blog": {
    title: "Blog Omra & Hajj | Guides et Conseils | Omra Bons Plans",
    description: "Guides complets sur l'Omra et le Hajj : rites, préparation, visa, bagages, prix. Conseils d'experts pour réussir votre pèlerinage.",
    canonical: `${SITE}/blog`,
  },
  "/blog/general": {
    title: "Blog Général Omra & Hajj : Guides et Conseils | Omra Bons Plans",
    description: "Articles généraux sur l'Omra et le Hajj : guides pratiques, conseils spirituels, préparation du pèlerinage. Toute l'actualité islamique.",
    canonical: `${SITE}/blog/general`,
  },
  "/blog/restaurants": {
    title: "Restaurants Halal à La Mecque & Médine | Blog Omra Bons Plans",
    description: "Découvrez les meilleurs restaurants halal à La Mecque et Médine. Adresses, avis et conseils pour bien manger pendant votre Omra.",
    canonical: `${SITE}/blog/restaurants`,
    noindex: true,
  },
  "/blog/associations": {
    title: "Associations Islamiques en France | Blog Omra Bons Plans",
    description: "Annuaire des associations islamiques en France : mosquées, centres culturels, associations pèlerinage. Trouvez votre communauté.",
    canonical: `${SITE}/blog/associations`,
    noindex: true,
  },
  "/blog/vendeurs": {
    title: "Vendeurs & Artisans Islamiques | Blog Omra Bons Plans",
    description: "Découvrez les meilleurs vendeurs et artisans islamiques : souvenirs de La Mecque, produits halal, tapis de prière, livres islamiques.",
    canonical: `${SITE}/blog/vendeurs`,
    noindex: true,
  },
  "/about": {
    title: "À Propos - Omra Bons Plans | Notre Mission & Équipe",
    description: "Découvrez qui nous sommes : une équipe experte en pèlerinage qui facilite votre voyage religieux en Arabie Saoudite grâce à notre plateforme.",
    canonical: `${SITE}/about`,
  },
  "/contact": {
    title: "Contact - Omra Bons Plans | Nous Contacter",
    description: "Contactez notre équipe pour toute question sur votre Omra ou Hajj. Assistance personnalisée pour votre voyage religieux en Arabie Saoudite.",
    canonical: `${SITE}/contact`,
  },
  "/favoris": {
    title: "Mes Favoris | Omra Bons Plans",
    description: "Retrouvez toutes vos offres Omra et Hajj favorites en un seul endroit. Comparez et choisissez votre voyage.",
    canonical: `${SITE}/favoris`,
    ogType: "website",
    noindex: true,
  },
  "/discussions": {
    title: "Forum Omra & Hajj : Questions et Témoignages | Omra Bons Plans",
    description: "Posez vos questions sur l'Omra et le Hajj, partagez vos expériences et lisez les témoignages de pèlerins. Communauté francophone active.",
    canonical: `${SITE}/discussions`,
  },
  "/category/sejours": {
    title: "Annonces Séjours Omra & Hajj | Omra Bons Plans",
    description: "Toutes les annonces de séjours Omra et Hajj tout compris. Comparez les offres des agences agréées en France et réservez votre pèlerinage.",
    canonical: `${SITE}/category/sejours`,
  },
  "/category/vols": {
    title: "Annonces Vols Omra & Hajj | Omra Bons Plans",
    description: "Comparez les vols pour l'Omra et le Hajj au départ de France. Vols directs et avec escale vers Djeddah et Médine.",
    canonical: `${SITE}/category/vols`,
  },
  "/category/hebergements": {
    title: "Annonces Hébergements à La Mecque & Médine | Omra Bons Plans",
    description: "Hôtels et appartements pour votre Omra à La Mecque et Médine. Annonces triées par distance au Haram et note des pèlerins.",
    canonical: `${SITE}/category/hebergements`,
  },
  "/category/guides": {
    title: "Guides Francophones Omra & Hajj | Omra Bons Plans",
    description: "Trouvez un guide francophone expérimenté pour vous accompagner lors de votre Omra ou Hajj. Tarifs, disponibilités et avis.",
    canonical: `${SITE}/category/guides`,
  },
  "/category/chauffeurs": {
    title: "Chauffeurs & Transport Omra à La Mecque | Omra Bons Plans",
    description: "Réservez un chauffeur privé pour votre Omra entre La Mecque et Médine. Transport agréé, francophone, disponible 24h/24.",
    canonical: `${SITE}/category/chauffeurs`,
  },
  "/category/babysitting": {
    title: "Babysitting Omra & Hajj à La Mecque | Omra Bons Plans",
    description: "Garde d'enfants de confiance pendant votre Omra à La Mecque et Médine. Babysitters francophones vérifiés, disponibles sur réservation.",
    canonical: `${SITE}/category/babysitting`,
  },
  "/prayer-times": {
    title: "Heures de Prière - La Mecque & Médine | Omra Bons Plans",
    description: "Horaires de prière musulmane précis pour votre ville. Fajr, Dhuhr, Asr, Maghrib, Isha. Calendrier islamique et direction de la Qibla.",
    canonical: `${SITE}/prayer-times`,
  },
  "/islamic-calendar": {
    title: "Calendrier Islamique Hijri 2026 | Omra Bons Plans",
    description: "Calendrier islamique (Hijri) complet 2026 avec dates importantes. Planifiez votre Omra aux meilleures périodes spirituelles.",
    canonical: `${SITE}/islamic-calendar`,
  },
  "/ramadan-hajj-dates": {
    title: "Dates Ramadan & Hajj 2026-2028 | Omra Bons Plans",
    description: "Dates officielles du Ramadan et Hajj pour 2026, 2027 et 2028. Préparez vos voyages religieux à l'avance.",
    canonical: `${SITE}/ramadan-hajj-dates`,
  },
  "/10-derniers-jours-ramadan": {
    title: "Omra des 10 Derniers Jours du Ramadan 2026 | Omra Bons Plans",
    description: "Offres Omra pour les 10 derniers jours du Ramadan 2026 : Laylatul Qadr, prière à La Mecque. Réservez tôt, places limitées.",
    canonical: `${SITE}/10-derniers-jours-ramadan`,
  },
  "/omra-ramadan-2026": {
    title: "Omra Ramadan 2026 | Meilleures Offres et Prix | Omra Bons Plans",
    description: "Offres Omra Ramadan 2026 : prix, dates, hôtels. Vivez le Ramadan à La Mecque avec les meilleures agences agréées en France.",
    keywords: "omra ramadan 2026, omra ramadan, prix omra ramadan",
    canonical: `${SITE}/omra-ramadan-2026`,
  },
  "/omra-femme-seule": {
    title: "Omra Femme Seule 2026 : Guide Complet, Conditions et Conseils",
    description: "Omra femme seule en 2026 : la loi saoudienne autorise les femmes sans mahram depuis 2021. Visa, conditions, prix, conseils d'expert.",
    canonical: `${SITE}/omra-femme-seule`,
  },
  "/omra-famille": {
    title: "Omra en Famille 2026 : Guide Complet, Prix & Conseils",
    description: "Partir en Omra en famille 2026 : conseils pratiques, hôtels familiaux, prix. Accompagnez vos enfants pour cette expérience spirituelle.",
    canonical: `${SITE}/omra-famille`,
  },
  "/omra-enfants": {
    title: "Omra avec Enfants 2026 : Guide Pratique et Conseils",
    description: "Omra avec enfants en 2026 : âge, conditions, conseils pratiques, hôtels adaptés. Préparez sereinement le pèlerinage en famille.",
    canonical: `${SITE}/omra-enfants`,
  },
  "/omra-seniors": {
    title: "Omra Seniors 2026 : Guide Mobilité Réduite & Conseils Médicaux",
    description: "Omra pour seniors en 2026 : services adaptés (fauteuil, accompagnement), hôtels proches du Haram, conseils santé.",
    canonical: `${SITE}/omra-seniors`,
  },
  "/omra-debutant": {
    title: "Omra pour Débutant : Guide Complet pour une Première Omra",
    description: "Première Omra ? Notre guide complet : rites, préparation, visa, bagages, étapes pas à pas pour réussir votre pèlerinage.",
    canonical: `${SITE}/omra-debutant`,
  },
  "/omra-tout-compris": {
    title: "Omra Tout Compris 2026 : Forfaits et Meilleures Offres",
    description: "Omra tout compris 2026 : forfaits all-inclusive, comparatif agences, prix. Vol, hôtel, transport, repas inclus. Réservez le meilleur package.",
    canonical: `${SITE}/omra-tout-compris`,
  },
  "/omra-badal": {
    title: "Omra Badal 2026 — Guide Complet, Conditions & Agences",
    description: "Omra Badal : accomplir l'Omra pour un proche défunt ou incapable. Conditions religieuses, agences spécialisées et tarifs.",
    canonical: `${SITE}/omra-badal`,
  },
  "/omra-en-octobre-2026": {
    title: "Omra Octobre 2026 : Meilleures Offres et Prix",
    description: "Offres Omra pour octobre 2026 : prix, hôtels, dates. Comparez les agences agréées et réservez votre voyage.",
    canonical: `${SITE}/omra-en-octobre-2026`,
  },
  "/omra-en-novembre-2026": {
    title: "Omra Novembre 2026 : Meilleures Offres et Prix",
    description: "Offres Omra pour novembre 2026 : prix, hôtels, dates. Comparez les agences agréées et réservez votre voyage.",
    canonical: `${SITE}/omra-en-novembre-2026`,
  },
  "/omra-en-decembre-2026": {
    title: "Omra Décembre 2026 : Vacances Scolaires & Meilleures Offres",
    description: "Offres Omra pour décembre 2026 : idéal pour partir en famille pendant les vacances. Comparez les prix et réservez tôt.",
    canonical: `${SITE}/omra-en-decembre-2026`,
  },
  "/omra-en-janvier-2027": {
    title: "Omra Janvier 2027 : Meilleures Offres et Prix",
    description: "Offres Omra pour janvier 2027 : températures agréables, prix attractifs. Comparez les agences agréées en France.",
    canonical: `${SITE}/omra-en-janvier-2027`,
  },
  "/conditions-omra": {
    title: "Conditions pour Faire l'Omra 2026 : Qui Peut Partir ?",
    description: "Toutes les conditions pour faire l'Omra en 2026 : conditions religieuses, documents obligatoires, règles femmes seules, vaccins.",
    canonical: `${SITE}/conditions-omra`,
  },
  "/quand-partir-omra": {
    title: "Quand partir en Omra ? Meilleures Périodes & Prix 2026",
    description: "Meilleure période pour partir en Omra selon votre budget : Ramadan, hiver, hors saison. Comparatif des prix et conseils.",
    canonical: `${SITE}/quand-partir-omra`,
  },
  "/meilleure-agence-omra": {
    title: "Meilleure Agence Omra 2026 : Classement et Guide de Choix",
    description: "Meilleure agence omra 2026 : notre classement, critères de choix, questions essentielles à poser avant de réserver.",
    canonical: `${SITE}/meilleure-agence-omra`,
  },
  "/definition-omra": {
    title: "Définition de l'Omra : Rites, Signification et Différences Hajj",
    description: "Définition complète de l'Omra : signification, rites (Ihram, Tawaf, Sa'i), différences avec le Hajj. Le 'petit pèlerinage' expliqué.",
    canonical: `${SITE}/definition-omra`,
  },
  "/prix-omra-2026": {
    title: "Prix Omra 2026 : Tarifs par Période, Agence et Standing",
    description: "Prix Omra 2026 : de 800€ à 5 000€+ selon la période et l'hôtel. Comparatif détaillé des tarifs par saison, agence et confort.",
    canonical: `${SITE}/prix-omra-2026`,
  },
  "/visa-omra-france": {
    title: "Visa Omra depuis la France 2026 : Procédure et Prix",
    description: "Tout sur le visa Omra depuis la France : eVisa touristique, visa Omra agence, prix, délais et procédure complète 2026.",
    canonical: `${SITE}/visa-omra-france`,
  },
  "/liste-bagages-omra": {
    title: "Liste des Bagages pour l'Omra : Checklist Complète 2026",
    description: "Liste complète des bagages indispensables pour votre Omra : vêtements Ihram, médicaments, documents, accessoires.",
    canonical: `${SITE}/liste-bagages-omra`,
  },
  "/rites-omra": {
    title: "Les Rites de l'Omra : Guide Complet Étape par Étape",
    description: "Tous les rites de l'Omra expliqués : Ihram, Tawaf, Sa'i, Halq/Taqsir. Guide étape par étape pour accomplir votre pèlerinage.",
    canonical: `${SITE}/rites-omra`,
  },
  "/guide-omra-pas-chere": {
    title: "Omra Pas Chère 2027 : Guide Complet pour Économiser",
    description: "Comment partir en Omra pas chère en 2026 : meilleures périodes, agences low-cost, 10 astuces pour réduire votre budget pèlerinage.",
    canonical: `${SITE}/guide-omra-pas-chere`,
  },
  "/guide-hajj-4-ecoles": {
    title: "Guide Hajj selon les 4 Écoles : Hanafi, Maliki, Shafii, Hanbali",
    description: "Guide complet du Hajj selon les 4 écoles juridiques de l'Islam : différences de rites, conseils pratiques, sources.",
    canonical: `${SITE}/guide-hajj-4-ecoles`,
  },
};

const escape = (s: string) =>
  s.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function buildHead(meta: PageMeta): string {
  const ogImage = meta.ogImage || DEFAULT_OG;
  const ogType = meta.ogType || "website";
  const keywords = meta.keywords ||
    "omra 2027, hajj 2027, omra ramadan, pèlerinage, arabie saoudite, la mecque, médine";

  return `
    <title>${escape(meta.title)}</title>
    <meta name="description" content="${escape(meta.description)}" />
    <meta name="keywords" content="${escape(keywords)}" />
    <meta name="author" content="Omra Bons Plans" />
    <meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}" />
    <link rel="canonical" href="${escape(meta.canonical)}" />
    <meta property="og:title" content="${escape(meta.title)}" />
    <meta property="og:description" content="${escape(meta.description)}" />
    <meta property="og:type" content="${escape(ogType)}" />
    <meta property="og:url" content="${escape(meta.canonical)}" />
    <meta property="og:image" content="${escape(ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escape(meta.title)}" />
    <meta property="og:site_name" content="Omra Bons Plans" />
    <meta property="og:locale" content="fr_FR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(meta.title)}" />
    <meta name="twitter:description" content="${escape(meta.description)}" />
    <meta name="twitter:image" content="${escape(ogImage)}" />
    <meta name="twitter:image:alt" content="${escape(meta.title)}" />
    <meta name="twitter:site" content="@omrabonsplans" />
  `;
}

function buildBotPage(meta: PageMeta, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${buildHead(meta)}
</head>
<body>
<nav><a href="${SITE}">Omra Bons Plans</a></nav>
<main>${bodyHtml}</main>
<footer>
<p><a href="${SITE}/">Comparateur Omra &amp; Hajj 2027</a> · <a href="${SITE}/hajj-2027">Hajj 2027</a> · <a href="${SITE}/agences-liste">Agences agréées</a> · <a href="${SITE}/coran">Coran en français</a></p>
</footer>
</body>
</html>`;
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  const userAgent = request.headers.get("user-agent") || "";
  const isBot = BOT_PATTERN.test(userAgent);

  let meta = PAGES[pathname];
  let botBodyHtml = "";

  // ── Dynamic route patterns ──────────────────────────────────────────────────
  // For routes not in the static PAGES map, we at minimum inject the correct
  // canonical so Google doesn't treat them as duplicates of the homepage.

  if (!meta) {
    // /blog/[category]/[slug] — blog-prerender handles bots; we cover WRS here
    if (/^\/blog\/(general|restaurants|associations|vendeurs)\/.+$/.test(pathname)) {
      meta = {
        title: "Blog Omra & Hajj | Omra Bons Plans",
        description: "Guides, conseils et actualités sur l'Omra et le Hajj.",
        canonical: `${SITE}${pathname}`,
      };
    }

    // /hotel/[id] — pages hôtels individuelles
    else if (/^\/hotel\/.+$/.test(pathname)) {
      const hotelId = pathname.replace("/hotel/", "");
      const HOTELS: Record<string, { name: string; ville: string; stars: number; dist: number }> = {
        "address-jabal-omar": { name: "Address Jabal Omar", ville: "La Mecque", stars: 5, dist: 700 },
        "anjum": { name: "ANJUM", ville: "La Mecque", stars: 4, dist: 450 },
        "conrad-jabal-omar": { name: "CONRAD", ville: "La Mecque", stars: 5, dist: 700 },
        "doubletree-jabal-omar": { name: "DOUBLE TREE", ville: "La Mecque", stars: 5, dist: 750 },
        "elaf-bakkah": { name: "Elaf Bakkah", ville: "La Mecque", stars: 5, dist: 300 },
        "emaar-al-noor": { name: "EMAAR AL NOOR", ville: "La Mecque", stars: 3, dist: 3500 },
        "emaar-international": { name: "EMAAR INTERNATIONAL", ville: "La Mecque", stars: 4, dist: 3500 },
        "hyatt-regency-jabal-omar": { name: "HAYAT REGENCY", ville: "La Mecque", stars: 5, dist: 800 },
        "hibatullah": { name: "HIBATULLAH", ville: "La Mecque", stars: 3, dist: 600 },
        "hilton-convention": { name: "HILTON CONVENTION", ville: "La Mecque", stars: 5, dist: 80 },
        "hilton-suites": { name: "HILTON SUITE", ville: "La Mecque", stars: 5, dist: 700 },
        "jumeirah-jabal-omar": { name: "JUMEIRAH", ville: "La Mecque", stars: 5, dist: 750 },
        "marriott-jabal-omar": { name: "MARIOTT", ville: "La Mecque", stars: 5, dist: 800 },
        "al-marwa-rotana": { name: "MARWA BY ROTANA", ville: "La Mecque", stars: 5, dist: 650 },
        "mathaba": { name: "MATHABA", ville: "La Mecque", stars: 3, dist: 500 },
        "millennium-al-naseem": { name: "MILLENIUM", ville: "La Mecque", stars: 4, dist: 1800 },
        "millennium-al-dana": { name: "MILLIENIUM AL DANA", ville: "La Mecque", stars: 4, dist: 1500 },
        "montana-hotel": { name: "MONTANA HOTEL", ville: "La Mecque", stars: 1, dist: 3000 },
        "novotel-thakher": { name: "NOVOTEL THAKHER", ville: "La Mecque", stars: 4, dist: 2600 },
        "osturat-emmar": { name: "OSTURAT EMMAR", ville: "La Mecque", stars: 4, dist: 3500 },
        "park-house-hotel": { name: "PARK HOUSE HOTEL", ville: "La Mecque", stars: 3, dist: 3000 },
        "park-plaza": { name: "PARK PLAZA", ville: "La Mecque", stars: 4, dist: 4000 },
        "ponciana": { name: "PONCIANA", ville: "La Mecque", stars: 3, dist: 1200 },
        "razana-al-rawda": { name: "RAZANA AL RAWDA", ville: "La Mecque", stars: 4, dist: 900 },
        "safwat-al-talayie": { name: "SAFWAT AL TALAYIE", ville: "La Mecque", stars: 1, dist: 3200 },
        "shaza-makkah": { name: "SHAZA", ville: "La Mecque", stars: 5, dist: 700 },
        "sheraton-jabal-al-kaaba": { name: "SHERATON", ville: "La Mecque", stars: 4, dist: 1000 },
        "shohada": { name: "SHOHADA", ville: "La Mecque", stars: 5, dist: 400 },
        "taj-park": { name: "TAJ PARK", ville: "La Mecque", stars: 3, dist: 3200 },
        "tilal-shaza": { name: "TILAL SHAZA", ville: "La Mecque", stars: 4, dist: 850 },
        "voco-makkah": { name: "VOCO", ville: "La Mecque", stars: 4, dist: 900 },
        "zamzam-hotel": { name: "ZAMZAM HOTEL", ville: "La Mecque", stars: 5, dist: 90 },
        "al-shakreen-golden-tulip": { name: "AL SHAKREEN GOLDEN TULIP", ville: "Médine", stars: 4, dist: 300 },
        "assafa-golden": { name: "ASSAFA GOLDEN HOTEL", ville: "Médine", stars: 4, dist: 350 },
        "bosphorus-waqf-safi": { name: "BOSPHORUS WAQF SAFI", ville: "Médine", stars: 3, dist: 400 },
        "concord-dar-al-khair": { name: "CONCORD DAR AL KHAIR", ville: "Médine", stars: 4, dist: 500 },
        "crowne-plaza-madinah": { name: "CROWN PLAZA", ville: "Médine", stars: 5, dist: 400 },
        "diwan-rose": { name: "DIWAN ROSE", ville: "Médine", stars: 3, dist: 600 },
        "diyar-al-taqwa": { name: "DIYAR AL TAQWA", ville: "Médine", stars: 3, dist: 500 },
        "emaar-royal": { name: "Emaar Royal", ville: "Médine", stars: 3, dist: 700 },
        "hilton-diyar-ajwa": { name: "Hilton Diyar Ajwa", ville: "Médine", stars: 4, dist: 1200 },
        "jayden": { name: "JAYDEN", ville: "Médine", stars: 4, dist: 350 },
        "jewar-al-saha": { name: "JEWAR AL SAHA", ville: "Médine", stars: 1, dist: 800 },
        "jiwar-al-madinah": { name: "Jiwar Al Madinah", ville: "Médine", stars: 4, dist: 500 },
        "maien": { name: "MAIEN", ville: "Médine", stars: 3, dist: 600 },
        "maysan-al-harithia": { name: "MAYSAN AL HARITHIA", ville: "Médine", stars: 4, dist: 1300 },
        "mias-madinah": { name: "MIAS MADINAH", ville: "Médine", stars: 4, dist: 500 },
        "movenpick-madinah": { name: "MOVENPICK", ville: "Médine", stars: 4, dist: 250 },
        "musc-touch": { name: "MUSC TOUCH", ville: "Médine", stars: 4, dist: 500 },
        "mysk-madinah": { name: "Mysk", ville: "Médine", stars: 4, dist: 400 },
        "nusuk-al-eman": { name: "NUSUK AL EMAN", ville: "Médine", stars: 3, dist: 600 },
        "peninsula-worth": { name: "PENINSULA WORTH", ville: "Médine", stars: 5, dist: 400 },
        "pullman-zamzam-madinah": { name: "PULLMAN ZAMZAM", ville: "Médine", stars: 5, dist: 200 },
        "rotana-madinah": { name: "ROTANA", ville: "Médine", stars: 4, dist: 400 },
        "saafa": { name: "SAAFA", ville: "Médine", stars: 3, dist: 500 },
        "shaza-regency-madinah": { name: "SHAZA REGENCY", ville: "Médine", stars: 5, dist: 350 },
        "sofitel-shahd-madinah": { name: "SOFITEL SHAHD", ville: "Médine", stars: 5, dist: 300 },
        "tabat-al-salam-swiss": { name: "TABAT AL SALAM SWISS", ville: "Médine", stars: 3, dist: 600 },
        "taiba-front": { name: "TAIBA FRONT", ville: "Médine", stars: 4, dist: 300 },
        "tulip-inn-madinah": { name: "Tulip Inn", ville: "Médine", stars: 3, dist: 600 },
        "valy": { name: "VALY", ville: "Médine", stars: 4, dist: 400 },
        "view-madinah": { name: "VIEW", ville: "Médine", stars: 4, dist: 450 },
      };
      const h = HOTELS[hotelId];
      const mosquee = h?.ville === "La Mecque" ? "Masjid al-Haram" : "Masjid Nabawi";
      const distLabel = h ? (h.dist < 1000 ? `${h.dist}m` : `${(h.dist / 1000).toFixed(1)}km`) : "";
      meta = h ? {
        title: `${h.name} ${h.ville} — ${h.stars}★, ${distLabel} du ${mosquee} | Omra Bons Plans`,
        description: `${h.name} (${h.stars}★) à ${h.ville} : à ${distLabel} du ${mosquee}. Note Booking, prix/nuit, points forts et points d'attention pour votre Omra 2026.`,
        keywords: `${h.name.toLowerCase()}, hôtel ${h.ville.toLowerCase()} omra, hébergement omra 2026, ${mosquee.toLowerCase()}`,
        canonical: `${SITE}/hotel/${hotelId}`,
      } : {
        title: "Hôtel Omra | Omra Bons Plans",
        description: "Détail hôtel pour votre Omra à La Mecque ou Médine : distance mosquée, note Booking, prix.",
        canonical: `${SITE}/hotel/${hotelId}`,
      };
    }
    // /omra-depuis-[ville]
    else if (/^\/omra-depuis-.+$/.test(pathname)) {
      const citySlug = pathname.replace("/omra-depuis-", "");
      const cityMeta: Record<string, { label: string; desc: string }> = {
        paris:            { label: "Paris", desc: "Comparez les meilleures offres Omra 2026 depuis Paris (CDG/ORY). +15 agences agréées, vols directs quotidiens vers Djeddah. Prix à partir de 900€." },
        lyon:             { label: "Lyon", desc: "Offres Omra 2026 depuis Lyon (LYS). Turkish Airlines via Istanbul, vols directs saisonniers. Agences agréées, prix 950€–1 450€ selon période." },
        marseille:        { label: "Marseille", desc: "Omra 2026 depuis Marseille (MRS). Vols via Air Algérie, charters directs en saison. Agences locales, prix à partir de 950€." },
        toulouse:         { label: "Toulouse", desc: "Omra 2026 depuis Toulouse (TLS). Vols via Paris CDG ou Istanbul. Agences agréées, prix 980€–1 500€ hors Ramadan." },
        nice:             { label: "Nice", desc: "Offres Omra 2026 depuis Nice (NCE). Turkish Airlines via Istanbul, Air France via CDG. Comparez agences et prix pour la Côte d'Azur." },
        bordeaux:         { label: "Bordeaux", desc: "Omra 2026 depuis Bordeaux (BOD). Royal Air Maroc via Casablanca, Air France via CDG. Agences agréées, prix à partir de 1 000€." },
        strasbourg:       { label: "Strasbourg", desc: "Omra 2026 depuis Strasbourg (SXB) ou Francfort. Lufthansa, Turkish Airlines. Alsace & Grand Est — comparez les offres agences." },
        lille:            { label: "Lille", desc: "Omra 2026 depuis Lille (LIL) ou Bruxelles. Brussels Airlines directs, Air France via CDG. Hauts-de-France, prix dès 950€." },
        nantes:           { label: "Nantes", desc: "Offres Omra 2026 depuis Nantes (NTE). Air France via CDG, Royal Air Maroc. Agences agréées Pays de la Loire, prix à partir de 1 000€." },
        rennes:           { label: "Rennes", desc: "Omra 2026 depuis Rennes (RNS) ou Paris CDG (1h30 TGV). Comparez les agences agréées et trouvez le meilleur vol pour votre pèlerinage." },
        montpellier:      { label: "Montpellier", desc: "Omra 2026 depuis Montpellier (MPL). Air Algérie via Alger, Air France via CDG. Occitanie — comparez agences agréées et prix." },
        grenoble:         { label: "Grenoble", desc: "Omra 2026 depuis Grenoble (GNB) ou Lyon (1h). Turkish Airlines, Air France. Isère & Alpes — agences agréées, prix dès 980€." },
        metz:             { label: "Metz", desc: "Omra 2026 depuis Metz (ETZ), Francfort FRA ou Luxembourg. Lufthansa, Turkish Airlines. Grand Est — comparez toutes les offres." },
        "clermont-ferrand": { label: "Clermont-Ferrand", desc: "Omra 2026 depuis Clermont-Ferrand (CFE) ou Lyon (1h30). Air France, Transavia. Auvergne — agences agréées, prix et conseils pratiques." },
      };
      const cm = cityMeta[citySlug];
      const cityLabel = cm ? cm.label : (citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, ' '));
      meta = {
        title: `Omra depuis ${cityLabel} 2026 : Agences, Prix & Vols | Omra Bons Plans`,
        description: cm ? cm.desc : `Partez en Omra depuis ${cityLabel} en 2026. Comparez les agences agréées, vols et séjours tout compris depuis votre ville.`,
        canonical: `${SITE}${pathname}`,
      };
    }
    // /agence-details/[nom] — agency detail pages
    else if (/^\/agence-details\/.+$/.test(pathname)) {
      const agencyRaw = decodeURIComponent(pathname.replace("/agence-details/", ""));
      meta = {
        title: `${agencyRaw} | Avis, Offres Omra & Hajj | Omra Bons Plans`,
        description: `Découvrez les offres Omra et Hajj de l'agence ${agencyRaw}. Avis clients, prix et contact sur Omra Bons Plans.`,
        canonical: `${SITE}${pathname}`,
      };
    }
    // /offre-omra/[id] and /offre-hajj/[id] — noindex: dynamic offers all share identical generic meta
    else if (/^\/(offre-omra|offre-hajj)\/.+$/.test(pathname)) {
      meta = {
        title: "Offre Omra & Hajj | Omra Bons Plans",
        description: "Détail d'une offre Omra ou Hajj depuis la France. Prix, dates, hôtel et agence.",
        canonical: `${SITE}${pathname}`,
        noindex: true,
      };
    }
    // /coran/[sourate] — individual surah pages
    else if (/^\/coran\/.+$/.test(pathname)) {
      const slug = pathname.replace("/coran/", "");
      const SURAHS: Record<string, { number: number; nameEn: string; nameFr: string; nameAr: string; verses: number; type: string }> = {
        "al-fatiha": { number: 1, nameEn: "Al-Fatiha", nameFr: "L'Ouverture", nameAr: "الفاتحة", verses: 7, type: "Mecquoise" },
        "al-baqarah": { number: 2, nameEn: "Al-Baqarah", nameFr: "La Vache", nameAr: "البقرة", verses: 286, type: "Médinoise" },
        "al-imran": { number: 3, nameEn: "Al-Imran", nameFr: "La Famille d'Imran", nameAr: "آل عمران", verses: 200, type: "Médinoise" },
        "an-nisa": { number: 4, nameEn: "An-Nisa", nameFr: "Les Femmes", nameAr: "النساء", verses: 176, type: "Médinoise" },
        "al-maida": { number: 5, nameEn: "Al-Ma'ida", nameFr: "La Table Servie", nameAr: "المائدة", verses: 120, type: "Médinoise" },
        "al-anam": { number: 6, nameEn: "Al-An'am", nameFr: "Les Troupeaux", nameAr: "الأنعام", verses: 165, type: "Mecquoise" },
        "al-araf": { number: 7, nameEn: "Al-A'raf", nameFr: "Les Hauteurs", nameAr: "الأعراف", verses: 206, type: "Mecquoise" },
        "al-anfal": { number: 8, nameEn: "Al-Anfal", nameFr: "Le Butin", nameAr: "الأنفال", verses: 75, type: "Médinoise" },
        "at-tawba": { number: 9, nameEn: "At-Tawba", nameFr: "Le Repentir", nameAr: "التوبة", verses: 129, type: "Médinoise" },
        "yunus": { number: 10, nameEn: "Yunus", nameFr: "Jonas", nameAr: "يونس", verses: 109, type: "Mecquoise" },
        "hud": { number: 11, nameEn: "Hud", nameFr: "Hûd", nameAr: "هود", verses: 123, type: "Mecquoise" },
        "yusuf": { number: 12, nameEn: "Yusuf", nameFr: "Joseph", nameAr: "يوسف", verses: 111, type: "Mecquoise" },
        "ar-rad": { number: 13, nameEn: "Ar-Ra'd", nameFr: "Le Tonnerre", nameAr: "الرعد", verses: 43, type: "Médinoise" },
        "ibrahim": { number: 14, nameEn: "Ibrahim", nameFr: "Abraham", nameAr: "إبراهيم", verses: 52, type: "Mecquoise" },
        "al-hijr": { number: 15, nameEn: "Al-Hijr", nameFr: "Al-Hijr", nameAr: "الحجر", verses: 99, type: "Mecquoise" },
        "an-nahl": { number: 16, nameEn: "An-Nahl", nameFr: "Les Abeilles", nameAr: "النحل", verses: 128, type: "Mecquoise" },
        "al-isra": { number: 17, nameEn: "Al-Isra", nameFr: "Le Voyage Nocturne", nameAr: "الإسراء", verses: 111, type: "Mecquoise" },
        "al-kahf": { number: 18, nameEn: "Al-Kahf", nameFr: "La Caverne", nameAr: "الكهف", verses: 110, type: "Mecquoise" },
        "maryam": { number: 19, nameEn: "Maryam", nameFr: "Marie", nameAr: "مريم", verses: 98, type: "Mecquoise" },
        "ta-ha": { number: 20, nameEn: "Ta-Ha", nameFr: "Tâ-Hâ", nameAr: "طه", verses: 135, type: "Mecquoise" },
        "al-anbiya": { number: 21, nameEn: "Al-Anbiya", nameFr: "Les Prophètes", nameAr: "الأنبياء", verses: 112, type: "Mecquoise" },
        "al-hajj": { number: 22, nameEn: "Al-Hajj", nameFr: "Le Pèlerinage", nameAr: "الحج", verses: 78, type: "Médinoise" },
        "al-muminun": { number: 23, nameEn: "Al-Mu'minun", nameFr: "Les Croyants", nameAr: "المؤمنون", verses: 118, type: "Mecquoise" },
        "an-nur": { number: 24, nameEn: "An-Nur", nameFr: "La Lumière", nameAr: "النور", verses: 64, type: "Médinoise" },
        "al-furqan": { number: 25, nameEn: "Al-Furqan", nameFr: "Le Discernement", nameAr: "الفرقان", verses: 77, type: "Mecquoise" },
        "ash-shuara": { number: 26, nameEn: "Ash-Shu'ara", nameFr: "Les Poètes", nameAr: "الشعراء", verses: 227, type: "Mecquoise" },
        "an-naml": { number: 27, nameEn: "An-Naml", nameFr: "Les Fourmis", nameAr: "النمل", verses: 93, type: "Mecquoise" },
        "al-qasas": { number: 28, nameEn: "Al-Qasas", nameFr: "Le Récit", nameAr: "القصص", verses: 88, type: "Mecquoise" },
        "al-ankabut": { number: 29, nameEn: "Al-Ankabut", nameFr: "L'Araignée", nameAr: "العنكبوت", verses: 69, type: "Mecquoise" },
        "ar-rum": { number: 30, nameEn: "Ar-Rum", nameFr: "Les Romains", nameAr: "الروم", verses: 60, type: "Mecquoise" },
        "luqman": { number: 31, nameEn: "Luqman", nameFr: "Luqmân", nameAr: "لقمان", verses: 34, type: "Mecquoise" },
        "as-sajda": { number: 32, nameEn: "As-Sajda", nameFr: "La Prosternation", nameAr: "السجدة", verses: 30, type: "Mecquoise" },
        "al-ahzab": { number: 33, nameEn: "Al-Ahzab", nameFr: "Les Coalisés", nameAr: "الأحزاب", verses: 73, type: "Médinoise" },
        "saba": { number: 34, nameEn: "Saba", nameFr: "Saba", nameAr: "سبأ", verses: 54, type: "Mecquoise" },
        "fatir": { number: 35, nameEn: "Fatir", nameFr: "Le Créateur", nameAr: "فاطر", verses: 45, type: "Mecquoise" },
        "ya-sin": { number: 36, nameEn: "Ya-Sin", nameFr: "Yâ-Sîn", nameAr: "يس", verses: 83, type: "Mecquoise" },
        "as-saffat": { number: 37, nameEn: "As-Saffat", nameFr: "Les Rangées", nameAr: "الصافات", verses: 182, type: "Mecquoise" },
        "sad": { number: 38, nameEn: "Sad", nameFr: "Sâd", nameAr: "ص", verses: 88, type: "Mecquoise" },
        "az-zumar": { number: 39, nameEn: "Az-Zumar", nameFr: "Les Groupes", nameAr: "الزمر", verses: 75, type: "Mecquoise" },
        "ghafir": { number: 40, nameEn: "Ghafir", nameFr: "Le Pardonneur", nameAr: "غافر", verses: 85, type: "Mecquoise" },
        "fussilat": { number: 41, nameEn: "Fussilat", nameFr: "Expliquées en Détail", nameAr: "فصلت", verses: 54, type: "Mecquoise" },
        "ash-shura": { number: 42, nameEn: "Ash-Shura", nameFr: "La Consultation", nameAr: "الشورى", verses: 53, type: "Mecquoise" },
        "az-zukhruf": { number: 43, nameEn: "Az-Zukhruf", nameFr: "L'Ornement", nameAr: "الزخرف", verses: 89, type: "Mecquoise" },
        "ad-dukhan": { number: 44, nameEn: "Ad-Dukhan", nameFr: "La Fumée", nameAr: "الدخان", verses: 59, type: "Mecquoise" },
        "al-jathiya": { number: 45, nameEn: "Al-Jathiya", nameFr: "L'Agenouillement", nameAr: "الجاثية", verses: 37, type: "Mecquoise" },
        "al-ahqaf": { number: 46, nameEn: "Al-Ahqaf", nameFr: "Les Dunes", nameAr: "الأحقاف", verses: 35, type: "Mecquoise" },
        "muhammad": { number: 47, nameEn: "Muhammad", nameFr: "Muhammad", nameAr: "محمد", verses: 38, type: "Médinoise" },
        "al-fath": { number: 48, nameEn: "Al-Fath", nameFr: "La Victoire", nameAr: "الفتح", verses: 29, type: "Médinoise" },
        "al-hujurat": { number: 49, nameEn: "Al-Hujurat", nameFr: "Les Appartements", nameAr: "الحجرات", verses: 18, type: "Médinoise" },
        "qaf": { number: 50, nameEn: "Qaf", nameFr: "Qâf", nameAr: "ق", verses: 45, type: "Mecquoise" },
        "adh-dhariyat": { number: 51, nameEn: "Adh-Dhariyat", nameFr: "Les Vents Dispersants", nameAr: "الذاريات", verses: 60, type: "Mecquoise" },
        "at-tur": { number: 52, nameEn: "At-Tur", nameFr: "Le Mont", nameAr: "الطور", verses: 49, type: "Mecquoise" },
        "an-najm": { number: 53, nameEn: "An-Najm", nameFr: "L'Étoile", nameAr: "النجم", verses: 62, type: "Mecquoise" },
        "al-qamar": { number: 54, nameEn: "Al-Qamar", nameFr: "La Lune", nameAr: "القمر", verses: 55, type: "Mecquoise" },
        "ar-rahman": { number: 55, nameEn: "Ar-Rahman", nameFr: "Le Tout Miséricordieux", nameAr: "الرحمن", verses: 78, type: "Médinoise" },
        "al-waqia": { number: 56, nameEn: "Al-Waqi'a", nameFr: "L'Événement", nameAr: "الواقعة", verses: 96, type: "Mecquoise" },
        "al-hadid": { number: 57, nameEn: "Al-Hadid", nameFr: "Le Fer", nameAr: "الحديد", verses: 29, type: "Médinoise" },
        "al-mujadila": { number: 58, nameEn: "Al-Mujadila", nameFr: "La Discussion", nameAr: "المجادلة", verses: 22, type: "Médinoise" },
        "al-hashr": { number: 59, nameEn: "Al-Hashr", nameFr: "L'Exode", nameAr: "الحشر", verses: 24, type: "Médinoise" },
        "al-mumtahana": { number: 60, nameEn: "Al-Mumtahana", nameFr: "L'Éprouvée", nameAr: "الممتحنة", verses: 13, type: "Médinoise" },
        "as-saf": { number: 61, nameEn: "As-Saf", nameFr: "Le Rang", nameAr: "الصف", verses: 14, type: "Médinoise" },
        "al-jumua": { number: 62, nameEn: "Al-Jumu'a", nameFr: "Le Vendredi", nameAr: "الجمعة", verses: 11, type: "Médinoise" },
        "al-munafiqun": { number: 63, nameEn: "Al-Munafiqun", nameFr: "Les Hypocrites", nameAr: "المنافقون", verses: 11, type: "Médinoise" },
        "at-taghabun": { number: 64, nameEn: "At-Taghabun", nameFr: "La Trahison Manifeste", nameAr: "التغابن", verses: 18, type: "Médinoise" },
        "at-talaq": { number: 65, nameEn: "At-Talaq", nameFr: "Le Divorce", nameAr: "الطلاق", verses: 12, type: "Médinoise" },
        "at-tahrim": { number: 66, nameEn: "At-Tahrim", nameFr: "L'Interdiction", nameAr: "التحريم", verses: 12, type: "Médinoise" },
        "al-mulk": { number: 67, nameEn: "Al-Mulk", nameFr: "La Royauté", nameAr: "الملك", verses: 30, type: "Mecquoise" },
        "al-qalam": { number: 68, nameEn: "Al-Qalam", nameFr: "Le Calame", nameAr: "القلم", verses: 52, type: "Mecquoise" },
        "al-haqqah": { number: 69, nameEn: "Al-Haqqah", nameFr: "L'Inévitable", nameAr: "الحاقة", verses: 52, type: "Mecquoise" },
        "al-maarij": { number: 70, nameEn: "Al-Ma'arij", nameFr: "Les Voies d'Ascension", nameAr: "المعارج", verses: 44, type: "Mecquoise" },
        "nuh": { number: 71, nameEn: "Nuh", nameFr: "Noé", nameAr: "نوح", verses: 28, type: "Mecquoise" },
        "al-jinn": { number: 72, nameEn: "Al-Jinn", nameFr: "Les Djinns", nameAr: "الجن", verses: 28, type: "Mecquoise" },
        "al-muzzammil": { number: 73, nameEn: "Al-Muzzammil", nameFr: "L'Enveloppé", nameAr: "المزمل", verses: 20, type: "Mecquoise" },
        "al-muddaththir": { number: 74, nameEn: "Al-Muddaththir", nameFr: "Le Revêtu", nameAr: "المدثر", verses: 56, type: "Mecquoise" },
        "al-qiyama": { number: 75, nameEn: "Al-Qiyama", nameFr: "La Résurrection", nameAr: "القيامة", verses: 40, type: "Mecquoise" },
        "al-insan": { number: 76, nameEn: "Al-Insan", nameFr: "L'Homme", nameAr: "الإنسان", verses: 31, type: "Médinoise" },
        "al-mursalat": { number: 77, nameEn: "Al-Mursalat", nameFr: "Les Envoyés", nameAr: "المرسلات", verses: 50, type: "Mecquoise" },
        "an-naba": { number: 78, nameEn: "An-Naba", nameFr: "La Nouvelle", nameAr: "النبأ", verses: 40, type: "Mecquoise" },
        "an-naziat": { number: 79, nameEn: "An-Nazi'at", nameFr: "Les Arracheurs", nameAr: "النازعات", verses: 46, type: "Mecquoise" },
        "abasa": { number: 80, nameEn: "Abasa", nameFr: "Il a Froncé les Sourcils", nameAr: "عبس", verses: 42, type: "Mecquoise" },
        "at-takwir": { number: 81, nameEn: "At-Takwir", nameFr: "L'Obscurcissement", nameAr: "التكوير", verses: 29, type: "Mecquoise" },
        "al-infitar": { number: 82, nameEn: "Al-Infitar", nameFr: "La Déchirure", nameAr: "الانفطار", verses: 19, type: "Mecquoise" },
        "al-mutaffifin": { number: 83, nameEn: "Al-Mutaffifin", nameFr: "Les Fraudeurs", nameAr: "المطففين", verses: 36, type: "Mecquoise" },
        "al-inshiqaq": { number: 84, nameEn: "Al-Inshiqaq", nameFr: "La Fissure", nameAr: "الانشقاق", verses: 25, type: "Mecquoise" },
        "al-buruj": { number: 85, nameEn: "Al-Buruj", nameFr: "Les Constellations", nameAr: "البروج", verses: 22, type: "Mecquoise" },
        "at-tariq": { number: 86, nameEn: "At-Tariq", nameFr: "L'Astre Nocturne", nameAr: "الطارق", verses: 17, type: "Mecquoise" },
        "al-ala": { number: 87, nameEn: "Al-A'la", nameFr: "Le Très-Haut", nameAr: "الأعلى", verses: 19, type: "Mecquoise" },
        "al-ghashiya": { number: 88, nameEn: "Al-Ghashiya", nameFr: "L'Enveloppante", nameAr: "الغاشية", verses: 26, type: "Mecquoise" },
        "al-fajr": { number: 89, nameEn: "Al-Fajr", nameFr: "L'Aube", nameAr: "الفجر", verses: 30, type: "Mecquoise" },
        "al-balad": { number: 90, nameEn: "Al-Balad", nameFr: "La Cité", nameAr: "البلد", verses: 20, type: "Mecquoise" },
        "ash-shams": { number: 91, nameEn: "Ash-Shams", nameFr: "Le Soleil", nameAr: "الشمس", verses: 15, type: "Mecquoise" },
        "al-layl": { number: 92, nameEn: "Al-Layl", nameFr: "La Nuit", nameAr: "الليل", verses: 21, type: "Mecquoise" },
        "ad-duha": { number: 93, nameEn: "Ad-Duha", nameFr: "Le Matin", nameAr: "الضحى", verses: 11, type: "Mecquoise" },
        "ash-sharh": { number: 94, nameEn: "Ash-Sharh", nameFr: "L'Expansion", nameAr: "الشرح", verses: 8, type: "Mecquoise" },
        "at-tin": { number: 95, nameEn: "At-Tin", nameFr: "Le Figuier", nameAr: "التين", verses: 8, type: "Mecquoise" },
        "al-alaq": { number: 96, nameEn: "Al-Alaq", nameFr: "Le Caillot de Sang", nameAr: "العلق", verses: 19, type: "Mecquoise" },
        "al-qadr": { number: 97, nameEn: "Al-Qadr", nameFr: "La Destinée", nameAr: "القدر", verses: 5, type: "Mecquoise" },
        "al-bayyina": { number: 98, nameEn: "Al-Bayyina", nameFr: "La Preuve", nameAr: "البينة", verses: 8, type: "Médinoise" },
        "az-zalzala": { number: 99, nameEn: "Az-Zalzala", nameFr: "Le Tremblement de Terre", nameAr: "الزلزلة", verses: 8, type: "Médinoise" },
        "al-adiyat": { number: 100, nameEn: "Al-Adiyat", nameFr: "Les Coursiers", nameAr: "العاديات", verses: 11, type: "Mecquoise" },
        "al-qaria": { number: 101, nameEn: "Al-Qari'a", nameFr: "La Calamité", nameAr: "القارعة", verses: 11, type: "Mecquoise" },
        "at-takathur": { number: 102, nameEn: "At-Takathur", nameFr: "La Course aux Richesses", nameAr: "التكاثر", verses: 8, type: "Mecquoise" },
        "al-asr": { number: 103, nameEn: "Al-Asr", nameFr: "Le Temps", nameAr: "العصر", verses: 3, type: "Mecquoise" },
        "al-humaza": { number: 104, nameEn: "Al-Humaza", nameFr: "Le Calomniateur", nameAr: "الهمزة", verses: 9, type: "Mecquoise" },
        "al-fil": { number: 105, nameEn: "Al-Fil", nameFr: "L'Éléphant", nameAr: "الفيل", verses: 5, type: "Mecquoise" },
        "quraysh": { number: 106, nameEn: "Quraysh", nameFr: "Quraysh", nameAr: "قريش", verses: 4, type: "Mecquoise" },
        "al-maun": { number: 107, nameEn: "Al-Ma'un", nameFr: "Les Ustensiles", nameAr: "الماعون", verses: 7, type: "Mecquoise" },
        "al-kawthar": { number: 108, nameEn: "Al-Kawthar", nameFr: "L'Abondance", nameAr: "الكوثر", verses: 3, type: "Mecquoise" },
        "al-kafirun": { number: 109, nameEn: "Al-Kafirun", nameFr: "Les Infidèles", nameAr: "الكافرون", verses: 6, type: "Mecquoise" },
        "an-nasr": { number: 110, nameEn: "An-Nasr", nameFr: "Le Secours", nameAr: "النصر", verses: 3, type: "Médinoise" },
        "al-masad": { number: 111, nameEn: "Al-Masad", nameFr: "La Corde de Fibres", nameAr: "المسد", verses: 5, type: "Mecquoise" },
        "al-ikhlas": { number: 112, nameEn: "Al-Ikhlas", nameFr: "La Sincérité", nameAr: "الإخلاص", verses: 4, type: "Mecquoise" },
        "al-falaq": { number: 113, nameEn: "Al-Falaq", nameFr: "L'Aube Naissante", nameAr: "الفلق", verses: 5, type: "Mecquoise" },
        "an-nas": { number: 114, nameEn: "An-Nas", nameFr: "Les Hommes", nameAr: "الناس", verses: 6, type: "Mecquoise" },
      };
      const s = SURAHS[slug];
      const nameLabel = s ? `${s.nameEn} (${s.nameAr})` : (slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '));
      const nameFr = s?.nameFr ?? '';
      const verses = s?.verses ?? 0;
      const type = s?.type ?? '';
      meta = {
        title: `Sourate ${s?.nameEn ?? nameLabel} en Français — ${nameFr} | Coran | Omra Bons Plans`,
        description: `Lire la Sourate ${s?.nameEn ?? nameLabel} (${s?.nameAr ?? ''}) — ${verses ? `${verses} versets, ` : ''}révélée ${type === 'Mecquoise' ? 'à La Mecque' : type === 'Médinoise' ? 'à Médine' : ''}. Texte arabe avec traduction française de Mohammed Hamidullah.`,
        keywords: `sourate ${(s?.nameEn ?? slug).toLowerCase()}, ${(s?.nameEn ?? slug).toLowerCase()} en français, coran français, traduction ${(s?.nameEn ?? slug).toLowerCase()}`,
        canonical: `${SITE}/coran/${slug}`,
      };
      if (isBot && s) {
        const ordinal = s.number === 1 ? 'ère' : 'ème';
        const revelation = s.type === 'Mecquoise' ? "à La Mecque avant l'Hégire" : "à Médine après l'Hégire";
        botBodyHtml = `
<h1>Sourate ${escape(s.nameEn)} (${s.nameAr}) — ${escape(s.nameFr)} | Coran en Français</h1>
<p>La Sourate ${escape(s.nameEn)} est la ${s.number}${ordinal} sourate du Coran. Elle comprend ${s.verses} versets et a été révélée ${revelation} (sourate ${s.type.toLowerCase()}).</p>
<section>
  <h2>Informations sur la Sourate ${escape(s.nameEn)}</h2>
  <ul>
    <li><strong>Numéro :</strong> ${s.number}/114</li>
    <li><strong>Nom arabe :</strong> ${s.nameAr}</li>
    <li><strong>Nom français :</strong> ${escape(s.nameFr)}</li>
    <li><strong>Nombre de versets :</strong> ${s.verses}</li>
    <li><strong>Type :</strong> ${s.type} (révélée ${revelation})</li>
  </ul>
</section>
<section>
  <h2>Comment lire la Sourate ${escape(s.nameEn)} ?</h2>
  <p>La Sourate ${escape(s.nameEn)} (${s.nameAr}) se lit de droite à gauche en arabe. Elle compte ${s.verses} verset${s.verses > 1 ? 's' : ''}. La traduction française ci-dessous est celle de Mohammed Hamidullah, référence pour les musulmans francophones.</p>
</section>
<section>
  <h2>Questions fréquentes</h2>
  <div><h3>Combien de versets compte la Sourate ${escape(s.nameEn)} ?</h3><p>La Sourate ${escape(s.nameEn)} compte ${s.verses} verset${s.verses > 1 ? 's' : ''}. C'est la ${s.number}${ordinal} sourate du Saint Coran.</p></div>
  <div><h3>La Sourate ${escape(s.nameEn)} est-elle mecquoise ou médinoise ?</h3><p>La Sourate ${escape(s.nameEn)} est ${s.type === 'Mecquoise' ? 'mecquoise' : 'médinoise'}, révélée ${revelation}.</p></div>
  <div><h3>Que signifie ${escape(s.nameEn)} en français ?</h3><p>${escape(s.nameEn)} se traduit en français par « ${escape(s.nameFr)} ».</p></div>
</section>
<nav aria-label="Autres sourates populaires">
  <h2>Autres sourates à lire</h2>
  <ul>
    <li><a href="${SITE}/coran/al-fatiha">Sourate Al-Fatiha (L'Ouverture) — 7 versets</a></li>
    <li><a href="${SITE}/coran/ya-sin">Sourate Ya-Sin (Yâ-Sîn) — 83 versets</a></li>
    <li><a href="${SITE}/coran/ar-rahman">Sourate Ar-Rahman (Le Tout Miséricordieux) — 78 versets</a></li>
    <li><a href="${SITE}/coran/al-mulk">Sourate Al-Mulk (La Royauté) — 30 versets</a></li>
    <li><a href="${SITE}/coran/al-kahf">Sourate Al-Kahf (La Caverne) — 110 versets</a></li>
    <li><a href="${SITE}/coran">Voir les 114 sourates du Coran →</a></li>
  </ul>
</nav>`;
      }
    }
    // /search — noindex: search results page has no unique content
    else if (pathname === "/search") {
      meta = {
        title: "Recherche | Omra Bons Plans",
        description: "Résultats de recherche Omra Bons Plans.",
        canonical: `${SITE}/search`,
        noindex: true,
      };
    }
    // /horaires-priere/[ville] — per-city prayer times pages
    else if (/^\/horaires-priere\/.+$/.test(pathname)) {
      const villeSlug = pathname.replace("/horaires-priere/", "");
      const CITIES: Record<string, { name: string; region: string }> = {
        "paris": { name: "Paris", region: "Île-de-France" },
        "saint-denis": { name: "Saint-Denis", region: "Île-de-France" },
        "montreuil": { name: "Montreuil", region: "Île-de-France" },
        "argenteuil": { name: "Argenteuil", region: "Île-de-France" },
        "nanterre": { name: "Nanterre", region: "Île-de-France" },
        "vitry-sur-seine": { name: "Vitry-sur-Seine", region: "Île-de-France" },
        "creteil": { name: "Créteil", region: "Île-de-France" },
        "aulnay-sous-bois": { name: "Aulnay-sous-Bois", region: "Île-de-France" },
        "sarcelles": { name: "Sarcelles", region: "Île-de-France" },
        "drancy": { name: "Drancy", region: "Île-de-France" },
        "colombes": { name: "Colombes", region: "Île-de-France" },
        "bobigny": { name: "Bobigny", region: "Île-de-France" },
        "mantes-la-jolie": { name: "Mantes-la-Jolie", region: "Île-de-France" },
        "meaux": { name: "Meaux", region: "Île-de-France" },
        "evry": { name: "Évry", region: "Île-de-France" },
        "trappes": { name: "Trappes", region: "Île-de-France" },
        "cergy": { name: "Cergy", region: "Île-de-France" },
        "versailles": { name: "Versailles", region: "Île-de-France" },
        "boulogne-billancourt": { name: "Boulogne-Billancourt", region: "Île-de-France" },
        "aubervilliers": { name: "Aubervilliers", region: "Île-de-France" },
        "champigny-sur-marne": { name: "Champigny-sur-Marne", region: "Île-de-France" },
        "noisy-le-grand": { name: "Noisy-le-Grand", region: "Île-de-France" },
        "sevran": { name: "Sevran", region: "Île-de-France" },
        "la-courneuve": { name: "La Courneuve", region: "Île-de-France" },
        "pantin": { name: "Pantin", region: "Île-de-France" },
        "bondy": { name: "Bondy", region: "Île-de-France" },
        "orly": { name: "Orly", region: "Île-de-France" },
        "corbeil-essonnes": { name: "Corbeil-Essonnes", region: "Île-de-France" },
        "lyon": { name: "Lyon", region: "Auvergne-Rhône-Alpes" },
        "villeurbanne": { name: "Villeurbanne", region: "Auvergne-Rhône-Alpes" },
        "grenoble": { name: "Grenoble", region: "Auvergne-Rhône-Alpes" },
        "saint-etienne": { name: "Saint-Étienne", region: "Auvergne-Rhône-Alpes" },
        "annecy": { name: "Annecy", region: "Auvergne-Rhône-Alpes" },
        "chambery": { name: "Chambéry", region: "Auvergne-Rhône-Alpes" },
        "valence": { name: "Valence", region: "Auvergne-Rhône-Alpes" },
        "clermont-ferrand": { name: "Clermont-Ferrand", region: "Auvergne-Rhône-Alpes" },
        "marseille": { name: "Marseille", region: "Provence-Alpes-Côte d'Azur" },
        "nice": { name: "Nice", region: "Provence-Alpes-Côte d'Azur" },
        "toulon": { name: "Toulon", region: "Provence-Alpes-Côte d'Azur" },
        "aix-en-provence": { name: "Aix-en-Provence", region: "Provence-Alpes-Côte d'Azur" },
        "avignon": { name: "Avignon", region: "Provence-Alpes-Côte d'Azur" },
        "cannes": { name: "Cannes", region: "Provence-Alpes-Côte d'Azur" },
        "antibes": { name: "Antibes", region: "Provence-Alpes-Côte d'Azur" },
        "frejus": { name: "Fréjus", region: "Provence-Alpes-Côte d'Azur" },
        "lille": { name: "Lille", region: "Hauts-de-France" },
        "roubaix": { name: "Roubaix", region: "Hauts-de-France" },
        "tourcoing": { name: "Tourcoing", region: "Hauts-de-France" },
        "valenciennes": { name: "Valenciennes", region: "Hauts-de-France" },
        "dunkerque": { name: "Dunkerque", region: "Hauts-de-France" },
        "lens": { name: "Lens", region: "Hauts-de-France" },
        "douai": { name: "Douai", region: "Hauts-de-France" },
        "amiens": { name: "Amiens", region: "Hauts-de-France" },
        "calais": { name: "Calais", region: "Hauts-de-France" },
        "arras": { name: "Arras", region: "Hauts-de-France" },
        "saint-quentin": { name: "Saint-Quentin", region: "Hauts-de-France" },
        "creil": { name: "Creil", region: "Hauts-de-France" },
        "strasbourg": { name: "Strasbourg", region: "Grand Est" },
        "metz": { name: "Metz", region: "Grand Est" },
        "nancy": { name: "Nancy", region: "Grand Est" },
        "mulhouse": { name: "Mulhouse", region: "Grand Est" },
        "reims": { name: "Reims", region: "Grand Est" },
        "colmar": { name: "Colmar", region: "Grand Est" },
        "belfort": { name: "Belfort", region: "Grand Est" },
        "troyes": { name: "Troyes", region: "Grand Est" },
        "epinal": { name: "Épinal", region: "Grand Est" },
        "toulouse": { name: "Toulouse", region: "Occitanie" },
        "montpellier": { name: "Montpellier", region: "Occitanie" },
        "nimes": { name: "Nîmes", region: "Occitanie" },
        "perpignan": { name: "Perpignan", region: "Occitanie" },
        "beziers": { name: "Béziers", region: "Occitanie" },
        "albi": { name: "Albi", region: "Occitanie" },
        "tarbes": { name: "Tarbes", region: "Occitanie" },
        "bordeaux": { name: "Bordeaux", region: "Nouvelle-Aquitaine" },
        "limoges": { name: "Limoges", region: "Nouvelle-Aquitaine" },
        "la-rochelle": { name: "La Rochelle", region: "Nouvelle-Aquitaine" },
        "poitiers": { name: "Poitiers", region: "Nouvelle-Aquitaine" },
        "pau": { name: "Pau", region: "Nouvelle-Aquitaine" },
        "bayonne": { name: "Bayonne", region: "Nouvelle-Aquitaine" },
        "angouleme": { name: "Angoulême", region: "Nouvelle-Aquitaine" },
        "agen": { name: "Agen", region: "Nouvelle-Aquitaine" },
        "niort": { name: "Niort", region: "Nouvelle-Aquitaine" },
        "nantes": { name: "Nantes", region: "Pays de la Loire" },
        "le-mans": { name: "Le Mans", region: "Pays de la Loire" },
        "angers": { name: "Angers", region: "Pays de la Loire" },
        "saint-nazaire": { name: "Saint-Nazaire", region: "Pays de la Loire" },
        "laval": { name: "Laval", region: "Pays de la Loire" },
        "rennes": { name: "Rennes", region: "Bretagne" },
        "brest": { name: "Brest", region: "Bretagne" },
        "lorient": { name: "Lorient", region: "Bretagne" },
        "quimper": { name: "Quimper", region: "Bretagne" },
        "saint-brieuc": { name: "Saint-Brieuc", region: "Bretagne" },
        "rouen": { name: "Rouen", region: "Normandie" },
        "caen": { name: "Caen", region: "Normandie" },
        "le-havre": { name: "Le Havre", region: "Normandie" },
        "cherbourg": { name: "Cherbourg", region: "Normandie" },
        "evreux": { name: "Évreux", region: "Normandie" },
        "orleans": { name: "Orléans", region: "Centre-Val de Loire" },
        "tours": { name: "Tours", region: "Centre-Val de Loire" },
        "chartres": { name: "Chartres", region: "Centre-Val de Loire" },
        "blois": { name: "Blois", region: "Centre-Val de Loire" },
        "dijon": { name: "Dijon", region: "Bourgogne-Franche-Comté" },
        "besancon": { name: "Besançon", region: "Bourgogne-Franche-Comté" },
      };
      const c = CITIES[villeSlug];
      const cityName = c?.name ?? (villeSlug.charAt(0).toUpperCase() + villeSlug.slice(1).replace(/-/g, ' '));
      const regionLabel = c?.region ? ` (${c.region})` : '';
      meta = {
        title: `Horaires de Prière ${cityName} — Fajr, Dhuhr, Asr, Maghrib, Isha | Omra Bons Plans`,
        description: `Horaires de prière à ${cityName}${regionLabel} aujourd'hui : Fajr, Dhuhr, Asr, Maghrib et Isha. Calcul selon la méthode UOIF. Mis à jour quotidiennement.`,
        keywords: `horaires prière ${cityName.toLowerCase()}, heure prière ${cityName.toLowerCase()}, salat ${cityName.toLowerCase()}, fajr ${cityName.toLowerCase()}, isha ${cityName.toLowerCase()}, mosquée ${cityName.toLowerCase()}`,
        canonical: `${SITE}/horaires-priere/${villeSlug}`,
      };
      if (isBot) {
        botBodyHtml = `
<h1>Horaires de Prière à ${escape(cityName)}${escape(regionLabel)} — 5 Prières du Jour</h1>
<p>Retrouvez les horaires de prière (salat) à ${escape(cityName)}${escape(regionLabel)} pour aujourd'hui. Les cinq prières quotidiennes sont calculées selon la méthode de l'UOIF (Union des Organisations Islamiques de France), référence pour les musulmans de France.</p>
<section>
  <h2>Les 5 prières du jour à ${escape(cityName)}</h2>
  <table>
    <thead><tr><th>Prière</th><th>Nom arabe</th><th>Signification</th></tr></thead>
    <tbody>
      <tr><td><strong>Fajr</strong></td><td>الفجر</td><td>Prière de l'aube (avant le lever du soleil)</td></tr>
      <tr><td><strong>Dhuhr</strong></td><td>الظهر</td><td>Prière du midi</td></tr>
      <tr><td><strong>Asr</strong></td><td>العصر</td><td>Prière de l'après-midi</td></tr>
      <tr><td><strong>Maghrib</strong></td><td>المغرب</td><td>Prière du coucher du soleil</td></tr>
      <tr><td><strong>Isha</strong></td><td>العشاء</td><td>Prière de la nuit</td></tr>
    </tbody>
  </table>
  <p><em>Les horaires exacts sont calculés dynamiquement sur la page en fonction de la date et de la position géographique de ${escape(cityName)}.</em></p>
</section>
<section>
  <h2>Comment sont calculés les horaires de prière à ${escape(cityName)} ?</h2>
  <p>Les horaires de prière à ${escape(cityName)}${escape(regionLabel)} sont calculés selon la méthode de l'UOIF (angle de 12° pour Fajr et Isha), utilisée par la majorité des mosquées de France. Les calculs tiennent compte des coordonnées géographiques exactes de ${escape(cityName)} et de l'équation du temps solaire.</p>
</section>
<section>
  <h2>Questions fréquentes</h2>
  <div><h3>Quelle est l'heure de Fajr à ${escape(cityName)} ?</h3><p>L'heure de Fajr à ${escape(cityName)} varie selon la saison. En été elle peut être vers 3h30-4h30, en hiver vers 6h-7h. Consultez la page pour l'heure exacte du jour.</p></div>
  <div><h3>Quelle méthode de calcul est utilisée ?</h3><p>Nous utilisons la méthode UOIF (angle 12°), qui est la référence officielle pour les musulmans de France et recommandée par le Conseil Français du Culte Musulman.</p></div>
  <div><h3>Les horaires changent-ils chaque jour ?</h3><p>Oui, les horaires de prière changent chaque jour en fonction de la position du soleil. Ils varient aussi selon les saisons : plus tôt en été, plus tard en hiver.</p></div>
</section>
<nav aria-label="Autres villes">
  <h2>Horaires de prière dans d'autres villes</h2>
  <ul>
    <li><a href="${SITE}/horaires-priere/paris">Horaires de prière Paris</a></li>
    <li><a href="${SITE}/horaires-priere/lyon">Horaires de prière Lyon</a></li>
    <li><a href="${SITE}/horaires-priere/marseille">Horaires de prière Marseille</a></li>
    <li><a href="${SITE}/horaires-priere/lille">Horaires de prière Lille</a></li>
    <li><a href="${SITE}/horaires-priere/toulouse">Horaires de prière Toulouse</a></li>
    <li><a href="${SITE}/horaires-priere/strasbourg">Horaires de prière Strasbourg</a></li>
  </ul>
</nav>`;
      }
    }
    // /search — noindex: search results page has no unique content
    else if (pathname === "/search") {
      meta = {
        title: "Recherche | Omra Bons Plans",
        description: "Résultats de recherche Omra Bons Plans.",
        canonical: `${SITE}/search`,
        noindex: true,
      };
    }
  }

  if (!meta) {
    return; // let Netlify serve default index.html
  }

  // For bots on content-rich dynamic pages, serve a full HTML page directly
  // instead of injecting into the SPA shell (which has empty body pre-JS).
  if (isBot && botBodyHtml) {
    return new Response(buildBotPage(meta, botBodyHtml), {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        // Never cache bot-specific HTML at CDN level — real users would receive
        // the stripped bot page instead of the React SPA.
        "cache-control": "private, no-store",
        "vary": "User-Agent",
        "x-robots-tag": "index, follow",
      },
    });
  }

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();

  // Remove existing tags we are replacing (defensive — cover both the static
  // ones in index.html and any potential duplicates).
  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, "")
    .replace(/<meta\s+name=["']keywords["'][^>]*>/gi, "")
    .replace(/<meta\s+name=["']robots["'][^>]*>/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<meta\s+property=["']og:title["'][^>]*>/gi, "")
    .replace(/<meta\s+property=["']og:description["'][^>]*>/gi, "")
    .replace(/<meta\s+property=["']og:type["'][^>]*>/gi, "")
    .replace(/<meta\s+property=["']og:url["'][^>]*>/gi, "")
    .replace(/<meta\s+property=["']og:image[^"']*["'][^>]*>/gi, "")
    .replace(/<meta\s+property=["']og:site_name["'][^>]*>/gi, "")
    .replace(/<meta\s+property=["']og:locale["'][^>]*>/gi, "")
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, "");

  // Inject our SEO block right after <head>
  html = html.replace(/<head>/i, `<head>${buildHead(meta)}`);

  return new Response(html, {
    status: response.status,
    headers: {
      ...Object.fromEntries(response.headers),
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
};

export const config = { path: "/*" };
