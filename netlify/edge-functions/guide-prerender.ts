/**
 * Netlify Edge Function — Pre-rendering for static guide pages
 *
 * Problem: React SPA — bots see an empty <div id="root"> before JS executes.
 * Solution: Detect bots, return fully pre-rendered HTML for known guide routes.
 * Regular users still get the normal React SPA.
 */

import type { Context } from "netlify:edge";

const BOT_PATTERN =
  /googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|perplexitybot|claudebot|gptbot|anthropic-ai|claude-web|google-extended|chatgpt-user|ccbot|cohere-ai|oai-searchbot/i;

interface PageData {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { h2: string; text: string }[];
  faqs: { q: string; a: string }[];
  canonical: string;
}

const PAGES: Record<string, PageData> = {
  "/omra-femme-seule": {
    title: "Omra Femme Seule 2026 : Guide Complet, Conditions et Conseils",
    description: "Omra femme seule en 2026 : la loi saoudienne autorise les femmes sans mahram depuis 2021. Visa, conditions, prix (950€-2 200€), liste bagages et avis de l'expert.",
    canonical: "https://omrabonsplans.fr/omra-femme-seule",
    h1: "Omra Femme Seule : Guide Complet 2026",
    intro: "Depuis 2021, l'Arabie Saoudite autorise les femmes de tout âge à effectuer l'Omra sans mahram (accompagnateur masculin), en groupe organisé via une agence agréée. Ce guide répond à toutes vos questions : conditions légales et religieuses, documents nécessaires, prix, et conseils pratiques de Farid d'Arabie, expert ayant accompagné plus de 5 000 pèlerins dont de nombreuses femmes seules.",
    sections: [
      { h2: "Les femmes seules peuvent-elles faire l'Omra ?", text: "Oui. La loi saoudienne a supprimé l'obligation du mahram pour l'Omra en 2021. Les femmes de tout âge peuvent voyager en groupe organisé avec une agence agréée par le Ministère Saoudien des Affaires Islamiques. D'un point de vue religieux, la majorité des savants maintiennent l'obligation du mahram — consultez votre référent religieux de confiance." },
      { h2: "Documents nécessaires", text: "Passeport valide 6 mois après le retour. Visa Omra inclus dans le forfait agence, ou eVisa touristique saoudien. Vaccin méningocoque ACWY obligatoire (certificat de vaccination). Aucun acte mahram requis depuis 2021 selon la réglementation saoudienne." },
      { h2: "Prix Omra femme seule 2026", text: "Basse saison (été) : 950€ à 1 400€ en chambre partagée. Hiver (déc-fév) : 1 200€ à 1 800€. Ramadan : 2 000€ à 2 800€. Ces prix incluent vol, hôtel, transferts et visa. Les agences proposent des chambres doubles ou individuelles à supplément." },
    ],
    faqs: [
      { q: "Une femme seule peut-elle faire l'Omra sans mahram ?", a: "Oui selon la loi saoudienne depuis 2021 — les femmes de tout âge peuvent partir en Omra en groupe organisé avec une agence agréée, sans mahram obligatoire légalement. D'un point de vue religieux, la majorité des savants maintiennent l'obligation du mahram. Consultez votre référent religieux." },
      { q: "Quelles agences proposent des voyages Omra pour femmes seules ?", a: "Toutes les grandes agences françaises agréées proposent des départs mixtes encadrés accessibles aux femmes seules : Tawaf, Medinvoyages, Al-Maqam, Pèlerinhajj, Omra Sounnah. Certaines proposent des groupes exclusivement féminins pendant le Ramadan." },
      { q: "Quel est le prix d'une Omra femme seule ?", a: "Entre 950€ et 2 800€ selon la période et le standing de l'hôtel. En basse saison (été), les forfaits démarrent à 950€ en chambre partagée. En chambre individuelle, comptez 300 à 500€ de supplément. Pendant le Ramadan, les prix doublent par rapport à la basse saison." },
    ],
  },

  "/conditions-omra": {
    title: "Conditions pour Faire l'Omra 2026 : Qui Peut Partir ?",
    description: "Toutes les conditions pour faire l'Omra en 2026 : conditions religieuses, documents obligatoires, règles pour les femmes seules, vaccins et conditions de santé.",
    canonical: "https://omrabonsplans.fr/conditions-omra",
    h1: "Conditions pour Faire l'Omra 2026",
    intro: "Pour accomplir l'Omra, plusieurs conditions doivent être réunies : conditions religieuses (être musulman, avoir l'âge de raison, être en capacité physique et financière), conditions administratives (passeport valide, visa, vaccin méningocoque ACWY), et conditions spécifiques selon votre situation (femme, personne âgée, femme enceinte).",
    sections: [
      { h2: "Conditions religieuses (Chourout)", text: "Être musulman(e). Avoir l'âge de raison (bâligh). Être libre de toute contrainte. Avoir la capacité physique d'effectuer le voyage. Disposer des ressources financières nécessaires sans s'endetter. Que le chemin soit sûr." },
      { h2: "Documents obligatoires", text: "Passeport valide au moins 6 mois après la date de retour. Visa Omra (via agence agréée) ou eVisa touristique saoudien. Vaccin méningocoque ACWY obligatoire, administré au moins 10 jours avant le départ. Pour les couples : acte de mariage peut être demandé." },
      { h2: "Règles pour les femmes", text: "Depuis 2021, la loi saoudienne n'exige plus de mahram pour l'Omra. Les femmes de tout âge peuvent voyager en groupe organisé avec une agence agréée. D'un point de vue religieux, la majorité des savants maintiennent l'obligation du mahram. La femme enceinte peut partir avec certificat médical." },
    ],
    faqs: [
      { q: "Quelles sont les conditions pour faire l'Omra ?", a: "Être musulman(e), disposer d'un passeport valide 6 mois après le retour, avoir le vaccin méningocoque ACWY, obtenir un visa Omra ou eVisa touristique saoudien. Les femmes n'ont plus besoin de mahram selon la loi saoudienne depuis 2021. Une bonne condition physique est recommandée (5 à 15 km de marche par jour)." },
      { q: "Une femme seule peut-elle faire l'Omra ?", a: "Oui selon la loi saoudienne en vigueur depuis 2021. Les femmes de tout âge peuvent partir en Omra sans mahram, en groupe organisé avec une agence agréée. D'un point de vue religieux, la majorité des savants maintiennent l'obligation du mahram. Renseignez-vous auprès de votre référent religieux." },
      { q: "Quel visa faut-il pour faire l'Omra ?", a: "Deux options : le visa Omra délivré par une agence agréée (inclus dans la plupart des forfaits), ou le visa touristique saoudien (eVisa) obtenu en ligne sur visa.visitsaudi.com pour environ 110 euros. Les deux permettent d'accomplir les rites de l'Omra. Votre passeport doit être valide au moins 6 mois après le retour." },
    ],
  },

  "/quand-partir-omra": {
    title: "Quand partir en Omra ? Meilleures Périodes & Prix 2026",
    description: "Découvrez la meilleure période pour partir en Omra selon votre budget : Ramadan, hiver, hors saison. Comparatif des prix et conseils pour choisir la bonne date en 2026.",
    canonical: "https://omrabonsplans.fr/quand-partir-omra",
    h1: "Quand partir en Omra ? Guide des Meilleures Périodes 2026",
    intro: "L'Omra peut être accomplie à n'importe quel moment de l'année, contrairement au Hajj. Cependant, toutes les périodes ne se valent pas : les prix, l'affluence, les températures et la valeur spirituelle varient considérablement selon la saison. Ce guide vous aide à choisir la meilleure période selon votre budget et vos objectifs.",
    sections: [
      { h2: "Basse saison : le meilleur rapport qualité-prix", text: "Les mois de Mouharram et Safar (environ juillet-septembre selon le calendrier grégorien) offrent les prix les plus bas : dès 800€ tout compris. L'affluence est faible, permettant d'accomplir le Tawaf et le Sa'i dans de meilleures conditions." },
      { h2: "L'Omra pendant le Ramadan", text: "Période la plus méritoire spirituellement. Le Prophète Muhammad (ﷺ) a dit : 'Une Omra pendant le Ramadan vaut un Hajj.' Les prix augmentent de 50 à 100% et les foules sont immenses. Les 10 derniers jours sont les plus chargés mais aussi les plus spirituellement valorisés. Réservez 6 à 9 mois à l'avance." },
      { h2: "L'Omra en hiver (décembre-février)", text: "Températures agréables (15 à 25°C), idéal pour les familles pendant les vacances scolaires. Prix intermédiaires (1 200 à 2 500€). Forte demande en décembre — réservez 2 à 3 mois à l'avance." },
    ],
    faqs: [
      { q: "Quelle est la meilleure période pour partir en Omra ?", a: "Cela dépend de vos priorités. Pour le budget : Mouharram/Safar (juillet-septembre) dès 800€. Pour la spiritualité : le Ramadan, notamment les 10 derniers jours. Pour le confort thermique : l'hiver (décembre-février) avec 15-25°C à La Mecque. Évitez juillet-août (45-50°C) et la période du Hajj (Dhul Hijja) où l'Omra est suspendue pour les étrangers." },
      { q: "Peut-on faire l'Omra en dehors du Ramadan ?", a: "Oui, absolument. L'Omra peut être accomplie toute l'année sauf pendant les jours du Hajj (8 au 13 Dhul Hijja). Hors Ramadan, les prix sont inférieurs de 50%, l'affluence est moindre et les rites se déroulent plus sereinement. Chaque Omra accomplie avec sincérité a une grande valeur spirituelle." },
      { q: "Combien coûte l'Omra selon la période ?", a: "Basse saison (Mouharram, Safar) : 800-1 500€. Saison intermédiaire (hiver, Sha'ban) : 1 200-2 000€. Vacances scolaires (Noël, février) : 1 500-2 500€. Ramadan (10 derniers jours) : 2 500-5 000€. Ces prix incluent vol, hôtel, transferts et visa depuis la France." },
    ],
  },

  "/omra-tout-compris": {
    title: "Omra Tout Compris 2026 : Forfaits et Meilleures Offres",
    description: "Omra tout compris 2026 : forfaits all-inclusive, comparatif agences, prix (1 200€-4 000€). Vol, hôtel, transport, repas inclus. Réservez le meilleur package.",
    canonical: "https://omrabonsplans.fr/omra-tout-compris",
    h1: "Omra Tout Compris 2026 : Guide Complet et Meilleures Offres",
    intro: "Un forfait Omra tout compris inclut tout ce dont vous avez besoin pour votre pèlerinage : vol aller-retour, hébergement à La Mecque et Médine, pension complète, transferts, encadrement francophone et visa. C'est la solution idéale pour les primo-pèlerins, les personnes seules et tous ceux qui souhaitent se concentrer sur leur démarche spirituelle sans contrainte logistique.",
    sections: [
      { h2: "Ce qui est inclus dans un forfait tout compris", text: "Vol international aller-retour depuis la France. Hébergement 3 à 5 étoiles à La Mecque et Médine. Petit-déjeuner et dîner (pension complète). Transport terrestre en bus climatisé. Encadrement par guide francophone. Visa Omra. Transferts aéroport-hôtel. Assurance de base." },
      { h2: "Prix des forfaits Omra tout compris 2026", text: "Économique (3★) : 1 200 à 1 500€. Standard (4★) : 1 800 à 2 500€. Confort (4-5★, <500m du Haram) : 2 500 à 3 500€. Luxury (5★ vue Kaaba) : 3 500 à 4 000€+. Ces prix sont valables hors Ramadan pour un séjour de 10 nuits." },
      { h2: "Tout compris vs à la carte", text: "Tout compris : idéal pour primo-pèlerins, personnes seules, seniors — tranquillité d'esprit garantie. À la carte : pour voyageurs indépendants et groupes autonomes — 20 à 40% moins cher mais demande plus d'organisation. Notre comparateur vous permet de trouver la meilleure offre selon votre profil." },
    ],
    faqs: [
      { q: "Qu'est-ce que la Omra tout compris ?", a: "La Omra tout compris est un forfait où tous les frais principaux sont inclus : vol international, hébergement à La Mecque et Médine, pension complète, transport terrestre, encadrement francophone, visa Omra et assurance. Le pèlerin n'a à payer que les repas du midi et ses dépenses personnelles." },
      { q: "Quel est le prix moyen de la Omra tout compris ?", a: "De 1 200€ (économique 3★, basse saison) à 4 000€+ (luxury 5★). La majorité des packages se situent entre 1 800 et 2 500€ pour un hôtel 4 étoiles hors Ramadan. Pendant le Ramadan, les tarifs augmentent de 50 à 100%." },
      { q: "Peut-on voyager seul en tout compris ?", a: "Oui, absolument. La Omra tout compris est même recommandée pour les pèlerins solos. Vous rejoignez un groupe constitué par l'agence, avec encadrement dès l'aéroport français. Vous n'êtes jamais seul et toute la logistique est gérée pour vous." },
    ],
  },

  "/meilleure-agence-omra": {
    title: "Meilleure Agence Omra 2026 : Classement et Guide de Choix",
    description: "Meilleure agence omra 2026 : notre classement des 5 meilleures agences (Tawaf, Medinvoyages, Al-Maqam), critères de choix, questions essentielles à poser avant de réserver.",
    canonical: "https://omrabonsplans.fr/meilleure-agence-omra",
    h1: "Meilleure Agence Omra 2026 : Guide de Choix et Classement",
    intro: "Choisir la bonne agence Omra est l'une des décisions les plus importantes de votre préparation. D'après les avis Google de milliers de pèlerins français, Tawaf (4,8/5), Medinvoyages (4,7/5) et Al-Maqam (4,6/5) se distinguent parmi les meilleures agences agréées en France. Voici notre guide complet pour bien choisir.",
    sections: [
      { h2: "Top 5 meilleures agences Omra 2026", text: "1. Tawaf (4,8/5 — 520 avis) : sérieux reconnu, encadrement excellent. 2. Medinvoyages (4,7/5 — 380 avis) : meilleur rapport qualité-prix. 3. Al-Maqam (4,6/5 — 310 avis) : hôtels 4-5 étoiles proches du Haram. 4. Omra Discount (4,5/5) : meilleurs prix dès 999€. 5. Pèlerinhajj (4,6/5) : expertise Hajj et séjours longs." },
      { h2: "Comment vérifier qu'une agence est fiable", text: "Vérifiez l'agrément ATOUT FRANCE (obligatoire). Contrôlez les avis Google : minimum 300 avis récents, note ≥ 4,3/5. Confirmez l'adresse physique en France et un numéro de téléphone fixe. Demandez le document d'assurance annulation avant de signer." },
      { h2: "Budget recommandé pour une Omra de qualité", text: "Minimum 1 500€ pour une Omra correcte en hôtel 3-4★ hors Ramadan. De 1 800 à 2 500€ pour un bon rapport qualité-prix. Au-delà de 3 000€ : segment premium avec vue Kaaba et petits groupes. Évitez les offres sous 1 200€ — les compromis sont souvent importants." },
    ],
    faqs: [
      { q: "Quelle est la meilleure agence Omra en France ?", a: "Tawaf (4,8/5), Medinvoyages (4,7/5) et Al-Maqam (4,6/5) sont régulièrement classées parmi les meilleures selon les avis Google. La meilleure agence dépend de vos priorités : budget, standing hôtel, proximité Haram ou accompagnement religieux. Comparez toujours au moins 3 devis pour les mêmes dates." },
      { q: "Comment vérifier qu'une agence Omra est fiable ?", a: "Vérifiez l'agrément ATOUT FRANCE sur le site officiel. Contrôlez les avis Google (300+ avis, note ≥ 4,3/5). Confirmez une adresse physique en France et un numéro fixe. Demandez l'assurance annulation par écrit. Appelez et posez des questions précises — une agence sérieuse répond clairement sans pression." },
      { q: "Quel budget prévoir pour une Omra de qualité ?", a: "Minimum 1 500€ par personne hors Ramadan pour un hôtel 3-4★. Entre 1 800 et 2 500€ pour un bon rapport qualité-prix en 4★ proche du Haram. Pendant le Ramadan, multipliez les tarifs par 1,5 à 2. Les packages sous 1 200€ présentent généralement des compromis importants sur l'hôtel ou l'encadrement." },
    ],
  },

  "/definition-omra": {
    title: "Qu'est-ce que l'Omra ? Définition, Rites et Différences avec le Hajj",
    description: "Définition complète de l'Omra : signification, rites (Ihram, Tawaf, Sa'i), différences avec le Hajj, et pourquoi l'Omra est appelée le 'petit pèlerinage'.",
    canonical: "https://omrabonsplans.fr/definition-omra",
    h1: "Qu'est-ce que l'Omra ? Définition et Guide Complet",
    intro: "L'Omra (en arabe : العمرة) est un pèlerinage islamique à La Mecque, en Arabie Saoudite. Contrairement au Hajj, qui est obligatoire une fois dans la vie pour tout musulman en capacité, l'Omra est un acte d'adoration (ibada) recommandé mais non obligatoire. On l'appelle parfois le 'petit pèlerinage' ou 'pèlerinage mineur'.",
    sections: [
      { h2: "Les 4 rites de l'Omra", text: "1. L'Ihram : état de pureté rituelle adopté à la frontière sacrée (Miqat). Vêtement blanc pour les hommes, tenue pudique pour les femmes. 2. Le Tawaf : 7 circumambulations autour de la Kaaba dans le sens antihoraire. 3. Le Sa'i : 7 allers-retours entre les collines de Safa et Marwa. 4. La Halq ou Taqsir : rasage ou coupe des cheveux, symbolisant la fin de l'état d'Ihram." },
      { h2: "Différences entre l'Omra et le Hajj", text: "Le Hajj est obligatoire une fois dans la vie (5e pilier de l'Islam) et se déroule uniquement en Dhul Hijja. L'Omra est recommandée et peut être accomplie toute l'année. Le Hajj inclut des rites supplémentaires (Arafat, Muzdalifa, Mina, la lapidation des stèles). L'Omra prend généralement 2 à 4 heures." },
    ],
    faqs: [
      { q: "Qu'est-ce que l'Omra ?", a: "L'Omra est un pèlerinage islamique à La Mecque comprenant 4 rites : l'Ihram (état de pureté), le Tawaf (7 tours autour de la Kaaba), le Sa'i (7 allers-retours entre Safa et Marwa) et la coupe des cheveux. C'est un acte d'adoration très méritoire, appelé 'petit pèlerinage', que l'on peut accomplir toute l'année contrairement au Hajj." },
      { q: "Quelle est la différence entre l'Omra et le Hajj ?", a: "Le Hajj est le 5e pilier de l'Islam, obligatoire une fois dans la vie pour tout musulman en capacité, et se déroule uniquement pendant le mois de Dhul Hijja. L'Omra est un pèlerinage recommandé, faisable toute l'année, avec 4 rites principaux. Le Hajj comprend des rites supplémentaires à Arafat, Muzdalifa et Mina, et dure 5 jours minimum." },
    ],
  },

  "/prix-omra-2026": {
    title: "Prix Omra 2026 : Tarifs par Période, Agence et Standing",
    description: "Prix Omra 2026 : de 800€ à 5 000€+ selon la période et l'hôtel. Comparatif détaillé des tarifs par saison, agence et niveau de confort. Trouvez la meilleure offre.",
    canonical: "https://omrabonsplans.fr/prix-omra-2026",
    h1: "Prix Omra 2026 : Guide Complet des Tarifs",
    intro: "Le prix d'une Omra en 2026 varie de 800€ à 5 000€+ selon la période de départ, le niveau de l'hôtel et la durée du séjour. Ce guide vous donne une vision complète des tarifs pratiqués par les agences françaises agréées pour vous aider à trouver le meilleur rapport qualité-prix.",
    sections: [
      { h2: "Prix Omra 2026 par période", text: "Basse saison (Mouharram, Safar) : 800-1 500€. Hiver (déc-fév) : 1 200-2 500€. Sha'ban (avant Ramadan) : 1 500-2 500€. Ramadan (début) : 2 000-3 500€. Ramadan (10 derniers jours) : 2 500-5 000€." },
      { h2: "Prix par niveau d'hôtel", text: "Hôtel 3★ (1-2 km du Haram) : 800-1 500€. Hôtel 4★ (<1 km) : 1 500-2 500€. Hôtel 4-5★ (<500m) : 2 500-3 500€. Hôtel 5★ vue Kaaba : 3 500-5 000€+. Tous ces prix incluent vol, hôtel, transferts et visa." },
    ],
    faqs: [
      { q: "Quel est le prix d'une Omra en 2026 ?", a: "Le prix d'une Omra en 2026 varie de 800€ (basse saison, hôtel 3★) à 5 000€+ (Ramadan, hôtel 5★ vue Kaaba). En moyenne, un forfait de qualité se situe entre 1 500 et 2 500€ hors Ramadan. Notre comparateur affiche en temps réel les tarifs de 20 agences agréées." },
      { q: "Pourquoi le prix de l'Omra varie-t-il autant ?", a: "Le prix dépend de 3 facteurs : la période (Ramadan coûte 50-100% plus cher), le niveau de l'hôtel (la distance au Haram impacte fortement le tarif) et la durée (10 à 21 nuits). Un hôtel à 500m du Haram coûte 2 à 3 fois plus cher qu'un hôtel à 2 km." },
    ],
  },
};

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export default async function handler(req: Request, context: Context) {
  const userAgent = req.headers.get("user-agent") || "";

  if (!BOT_PATTERN.test(userAgent)) return context.next();

  const url = new URL(req.url);
  const page = PAGES[url.pathname];

  if (!page) return context.next();

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  });

  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.title,
    "description": page.description,
    "url": page.canonical,
    "author": {
      "@type": "Person",
      "@id": "https://omrabonsplans.fr/about#farid",
      "name": "Farid d'Arabie",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Omra Bons Plans",
      "logo": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/logo.svg" },
    },
    "dateModified": new Date().toISOString().split("T")[0],
  });

  const sectionsHtml = page.sections
    .map((s) => `<section><h2>${escHtml(s.h2)}</h2><p>${escHtml(s.text)}</p></section>`)
    .join("\n");

  const faqsHtml = page.faqs
    .map((f) => `<div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question"><h3 itemprop="name">${escHtml(f.q)}</h3><div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer"><p itemprop="text">${escHtml(f.a)}</p></div></div>`)
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(page.title)}</title>
  <meta name="description" content="${escHtml(page.description)}">
  <link rel="canonical" href="${page.canonical}">
  <meta property="og:title" content="${escHtml(page.title)}">
  <meta property="og:description" content="${escHtml(page.description)}">
  <meta property="og:url" content="${page.canonical}">
  <meta property="og:type" content="article">
  <script type="application/ld+json">${faqSchema}</script>
  <script type="application/ld+json">${articleSchema}</script>
</head>
<body>
  <nav><a href="https://omrabonsplans.fr">Omra Bons Plans</a> › <a href="https://omrabonsplans.fr/comparatif-agences">Comparer les agences</a></nav>
  <article>
    <h1>${escHtml(page.h1)}</h1>
    <p>${escHtml(page.intro)}</p>
    ${sectionsHtml}
    <section itemscope itemtype="https://schema.org/FAQPage">
      <h2>Questions fréquentes</h2>
      ${faqsHtml}
    </section>
  </article>
  <footer>
    <p><a href="https://omrabonsplans.fr/">Comparer les offres Omra</a> · <a href="https://omrabonsplans.fr/comparatif-agences">Comparatif agences</a> · <a href="https://omrabonsplans.fr/about">À propos de Farid d'Arabie</a></p>
  </footer>
  <div id="root"></div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-prerendered": "true",
      "cache-control": "public, max-age=86400",
    },
  });
}
