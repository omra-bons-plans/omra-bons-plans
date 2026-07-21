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

const PAGES: Record<string, PageMeta> = {
  "/": {
    title: "Comparateur Omra & Hajj 2026 | Omra Ramadan — Omra Bons Plans",
    description: "Comparez les meilleures offres Omra 2026 & Hajj 2026 depuis la France 🇫🇷. Omra Ramadan, 10 derniers jours du Ramadan, séjours tout compris. Prix mis à jour quotidiennement.",
    keywords: "omra 2026, omra2026, hajj 2026, omra ramadan, 10 derniers jours ramadan, omra pas chère, séjour omra tout compris, agence omra France",
    canonical: `${SITE}/`,
  },
  "/omra": {
    title: "Comparateur Omra 2026 — Agences Agréées | Omra Bons Plans",
    description: "Comparez les offres Omra 2026 de toutes les agences agréées en France 🇫🇷. Filtres par dates, ville, hôtel, prix. Trouvez votre Omra idéale en quelques clics.",
    keywords: "comparateur omra, omra 2026, agences omra France, prix omra, séjour omra",
    canonical: `${SITE}/omra`,
  },
  "/hajj": {
    title: "Comparateur Hajj 2026 — Agences Agréées | Omra Bons Plans",
    description: "Comparez les offres Hajj 2026 des agences agréées en France 🇫🇷. Filtres par dates, hôtel, encadrement, prix. Trouvez votre Hajj idéal facilement.",
    keywords: "hajj 2026, comparateur hajj, agences hajj France, prix hajj, pèlerinage Mecque",
    canonical: `${SITE}/hajj`,
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
    title: "Omra Pas Chère 2026 : Guide Complet pour Économiser",
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
    "omra 2026, hajj 2026, omra ramadan, pèlerinage, arabie saoudite, la mecque, médine";

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

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";

  let meta = PAGES[pathname];

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
    // /offre-omra/[id] and /offre-hajj/[id] — individual offers (index but with canonical)
    else if (/^\/(offre-omra|offre-hajj)\/.+$/.test(pathname)) {
      meta = {
        title: "Offre Omra & Hajj | Omra Bons Plans",
        description: "Détail d'une offre Omra ou Hajj depuis la France. Prix, dates, hôtel et agence.",
        canonical: `${SITE}${pathname}`,
      };
    }
  }

  if (!meta) {
    return; // let Netlify serve default index.html
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
