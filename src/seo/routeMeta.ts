/**
 * Source unique des balises <title> / meta description par page.
 * Utilisée à la fois :
 *  - au build (plugin Vite) pour écrire un HTML statique par page → visible par Google sans JS
 *  - côté navigateur (RouteMetaSync) pour garder le même titre après chargement
 * Règle : aucun nombre d'offres ; seul prix d'appel autorisé : « dès 999 € ».
 */
import { FRENCH_CITIES } from "../data/frenchCities";
import { QURAN_SURAHS } from "../data/quranSurahs";
import { hotelsData } from "../utils/hotelsData";

export interface RouteMeta {
  title: string;
  description: string;
}

export const SITE_SUFFIX = " — Omra Bons Plans";
const t = (subject: string) => `${subject}${SITE_SUFFIX}`;

const VILLES_DEPART: Record<string, string> = {
  paris: "Paris", lyon: "Lyon", marseille: "Marseille", toulouse: "Toulouse", nice: "Nice",
  bordeaux: "Bordeaux", strasbourg: "Strasbourg", lille: "Lille", nantes: "Nantes", rennes: "Rennes",
  montpellier: "Montpellier", grenoble: "Grenoble", metz: "Metz", "clermont-ferrand": "Clermont-Ferrand",
};

const MOIS: Record<string, string> = {
  "octobre-2026": "octobre 2026", "novembre-2026": "novembre 2026",
  "decembre-2026": "décembre 2026", "janvier-2027": "janvier 2027",
};

export const STATIC_ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    title: "Omra pas chère : comparez les offres dès 999 € — Omra Bons Plans",
    description: "Comparez les offres Omra des agences françaises, dès 999 €, mises à jour régulièrement. Départs depuis plusieurs villes de France, hôtels et pensions détaillés.",
  },
  "/comparateur-omra-france": {
    title: "Comparateur Omra : comparez les prix des agences — Omra Bons Plans",
    description: "Comparez les offres Omra des agences françaises, dès 999 €. Filtrez par ville de départ, hôtel et pension. Prix mis à jour régulièrement.",
  },
  "/omra-ramadan-2027": {
    title: "Omra Ramadan 2027 : offres, prix et dates — Omra Bons Plans",
    description: "Comparez les offres Omra Ramadan 2027 des agences françaises, dès 999 €. Dates, prix et conseils pour les 10 derniers jours.",
  },
  "/hajj": { title: t("Comparateur Hajj 2027 : offres des agences françaises"), description: "Comparez les offres Hajj 2027 des agences françaises : prix, hôtels à La Mecque et Médine, camps de Mina et vols." },
  "/hajj-2027": { title: t("Hajj 2027 : dates, prix et inscription"), description: "Hajj 2027 depuis la France : dates prévues, budget, démarches d'inscription et conseils pour choisir une agence agréée." },
  "/bons-plans": { title: t("Bons plans Omra : annonces séjours, guides et hébergements"), description: "Annonces de séjours, vols, hébergements, guides et chauffeurs pour votre Omra à La Mecque et Médine." },
  "/about": { title: t("À propos : notre mission"), description: "Découvrez Omra Bons Plans, le comparateur indépendant qui aide les pèlerins de France à trouver une Omra adaptée à leur budget." },
  "/contact": { title: t("Contact"), description: "Contactez l'équipe Omra Bons Plans pour une question sur une offre, une agence ou un partenariat." },
  "/prayer-times": { title: t("Horaires de prière selon votre position"), description: "Heure de la prochaine prière et les 5 horaires du jour (Fajr, Dhuhr, Asr, Maghrib, Isha) selon votre localisation." },
  "/islamic-calendar": { title: t("Calendrier hégirien : date du jour et mois islamiques"), description: "Date du jour en calendrier grégorien et hégirien, mois islamiques et grandes fêtes de l'année." },
  "/ramadan-hajj-dates": { title: t("Dates du Ramadan et du Hajj 2027-2028"), description: "Dates prévues du Ramadan, de l'Aïd et du Hajj pour les prochaines années, pour planifier votre Omra ou votre pèlerinage." },
  "/coran": { title: t("Le Coran en français : les 114 sourates"), description: "Lisez les 114 sourates du Coran en arabe et en français, avec leur nom, leur nombre de versets et leur révélation." },
  "/comparatif-agences": { title: t("Comparatif des agences Omra : avis et notes"), description: "Comparez les agences Omra françaises selon leurs avis Google, leurs services et leurs formules." },
  "/agences-liste": { title: t("Liste des agences Omra et Hajj en France"), description: "Annuaire des agences Omra et Hajj en France : coordonnées, avis et offres de chaque agence." },
  "/comparatif-visuel": { title: t("Comparatif visuel des offres Omra"), description: "Visualisez et comparez d'un coup d'œil les offres Omra : prix, hôtels, distance au Haram et durée." },
  "/guide-omra-pas-chere": { title: t("Omra pas chère : astuces pour payer moins"), description: "Nos conseils pour réserver une Omra pas chère : meilleures périodes, choix des hôtels, vols et agences, dès 999 €." },
  "/rites-omra": { title: t("Les rites de l'Omra étape par étape"), description: "Ihram, Tawaf, Sa'i et Halq : les rites de l'Omra expliqués simplement, étape par étape." },
  "/omra-tout-compris": { title: t("Omra tout compris : vols, hôtels et visa"), description: "Ce que comprend une Omra tout compris : vol, visa, hôtels, transferts et accompagnement. Comparez les formules des agences." },
  "/meilleure-agence-omra": { title: t("Meilleure agence Omra : comment bien choisir"), description: "Critères pour choisir la meilleure agence Omra : agrément, avis, hôtels, encadrement et transparence des prix." },
  "/liste-bagages-omra": { title: t("Liste des bagages pour l'Omra : checklist"), description: "Checklist complète des affaires à emporter pour l'Omra : tenue d'Ihram, papiers, santé et objets pratiques." },
  "/prix-omra-2026": { title: t("Prix de l'Omra 2027 par période et standing"), description: "Combien coûte une Omra ? Tarifs selon la période, la durée, le standing des hôtels et la ville de départ, dès 999 €." },
  "/omra-femme-seule": { title: t("Omra femme seule : conditions et conseils"), description: "Partir en Omra en tant que femme seule : règles saoudiennes, avis religieux, agences et conseils pratiques." },
  "/visa-omra-france": { title: t("Visa Omra depuis la France : démarches et délais"), description: "Comment obtenir son visa Omra depuis la France : documents, délais, coût et rôle de l'agence." },
  "/omra-famille": { title: t("Omra en famille : préparation et conseils"), description: "Organiser une Omra en famille : budget, hébergement, rythme et conseils pour voyager avec ses proches." },
  "/omra-seniors": { title: t("Omra pour les seniors : santé et confort"), description: "Omra pour les personnes âgées : mobilité réduite, conseils médicaux, hôtels proches et agences adaptées." },
  "/omra-enfants": { title: t("Omra avec des enfants : âge et préparation"), description: "Faire l'Omra avec des enfants : âge conseillé, formalités, santé et astuces pour un séjour serein." },
  "/omra-badal": { title: t("Omra Badal : l'Omra par procuration"), description: "Omra Badal (par procuration) : définition, conditions, déroulement et agences qui la proposent." },
  "/10-derniers-jours-ramadan": { title: t("Omra des 10 derniers jours du Ramadan"), description: "Vivre les 10 derniers jours du Ramadan à La Mecque : Laylat al-Qadr, affluence, prix et conseils de réservation." },
  "/definition-omra": { title: t("Définition de l'Omra et différences avec le Hajj"), description: "Qu'est-ce que l'Omra ? Signification, rites, mérites et différences avec le Hajj." },
  "/quand-partir-omra": { title: t("Quand partir en Omra : meilleures périodes"), description: "Meilleures périodes pour partir en Omra selon le prix, la météo, l'affluence et les vacances scolaires." },
  "/omra-debutant": { title: t("Première Omra : guide du débutant"), description: "Guide pour une première Omra : préparation, rites, invocations, budget et erreurs à éviter." },
  "/conditions-omra": { title: t("Conditions pour faire l'Omra"), description: "Qui peut faire l'Omra ? Conditions religieuses, administratives et de santé pour partir depuis la France." },
  "/guide-hajj-4-ecoles": { title: t("Guide du Hajj selon les 4 écoles"), description: "Le Hajj selon les écoles hanafite, malikite, chafiite et hanbalite : différences de rites et conseils pratiques." },
  "/les-hotels": { title: t("Hôtels de La Mecque et Médine pour l'Omra"), description: "Comparez les hôtels de La Mecque et Médine : distance au Haram, note, prix par nuit, points forts et points faibles." },
  "/blog": { title: t("Blog Omra et Hajj : guides et conseils"), description: "Articles, guides pratiques et conseils pour préparer votre Omra ou votre Hajj depuis la France." },
  "/blog/general": { title: t("Articles Omra et Hajj : conseils pratiques"), description: "Tous nos articles pratiques sur l'Omra et le Hajj : préparation, rites, santé, budget et démarches." },
  "/blog/restaurants": { title: t("Restaurants à La Mecque et Médine"), description: "Nos adresses de restaurants à La Mecque et Médine pour bien manger pendant votre Omra." },
  "/blog/associations": { title: t("Associations islamiques en France"), description: "Découvrez des associations islamiques en France et leurs actions." },
  "/blog/vendeurs": { title: t("Vendeurs et artisans pour l'Omra"), description: "Vendeurs et artisans : tenues d'Ihram, articles religieux et produits utiles pour l'Omra." },
  "/discussions": { title: t("Forum Omra et Hajj : questions et témoignages"), description: "Posez vos questions et partagez votre expérience de l'Omra et du Hajj avec la communauté." },
  "/category/sejours": { title: t("Annonces de séjours Omra"), description: "Annonces de séjours Omra et Hajj publiées par des particuliers et des professionnels." },
  "/category/vols": { title: t("Annonces de vols pour l'Omra"), description: "Annonces de vols vers Djeddah et Médine pour votre Omra ou votre Hajj." },
  "/category/hebergement": { title: t("Annonces d'hébergement à La Mecque et Médine"), description: "Annonces de logements et chambres à La Mecque et Médine pour votre Omra." },
  "/category/hebergements": { title: t("Hébergements à La Mecque et Médine"), description: "Logements et chambres à La Mecque et Médine proposés pour votre Omra." },
  "/category/guides": { title: t("Guides francophones pour l'Omra"), description: "Trouvez un guide francophone pour vous accompagner pendant votre Omra à La Mecque et Médine." },
  "/category/chauffeurs": { title: t("Chauffeurs et transport pour l'Omra"), description: "Chauffeurs privés à La Mecque, Médine et Djeddah : transferts aéroport et visites (ziyarat)." },
  "/category/babysitting": { title: t("Babysitting pendant l'Omra"), description: "Trouvez une baby-sitter à La Mecque ou Médine pour accomplir vos rites sereinement." },
  "/favoris": { title: t("Mes offres favorites"), description: "Retrouvez les offres Omra et Hajj que vous avez enregistrées en favoris." },
  "/search": { title: t("Recherche"), description: "Recherchez une offre, une agence, un article ou un guide sur Omra Bons Plans." },
  "/auth": { title: t("Connexion"), description: "Connectez-vous ou créez votre compte Omra Bons Plans." },
};

for (const [slug, ville] of Object.entries(VILLES_DEPART)) {
  STATIC_ROUTE_META[`/omra-depuis-${slug}`] = {
    title: t(`Omra au départ de ${ville}`),
    description: `Comparez les offres Omra au départ de ${ville}, dès 999 € : agences, vols, hôtels et pensions détaillés.`,
  };
}
for (const [slug, mois] of Object.entries(MOIS)) {
  STATIC_ROUTE_META[`/omra-en-${slug}`] = {
    title: t(`Omra en ${mois} : prix et conseils`),
    description: `Partir en Omra en ${mois} : prix, météo, affluence et offres des agences françaises, dès 999 €.`,
  };
}

const formatDist = (m: number) => (m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1).replace(".", ",")} km`);

/** Meta d'une page, ou null si la page gère elle-même ses balises (ex : articles de blog). */
export function getRouteMeta(rawPath: string): RouteMeta | null {
  let path = rawPath.replace(/\/+$/, "") || "/";
  try { path = decodeURIComponent(path); } catch { /* ignore */ }
  if (STATIC_ROUTE_META[path]) return STATIC_ROUTE_META[path];

  let m = path.match(/^\/horaires-priere\/([^/]+)$/);
  if (m) {
    const city = FRENCH_CITIES.find((c) => c.slug === m![1]);
    if (city) return {
      title: t(`Horaires de prière à ${city.name}`),
      description: `Horaires de prière du jour à ${city.name} : Fajr, Dhuhr, Asr, Maghrib et Isha, mis à jour chaque jour.`,
    };
  }
  m = path.match(/^\/coran\/([^/]+)$/);
  if (m) {
    const s = QURAN_SURAHS.find((x) => x.slug === m![1]);
    if (s) return {
      title: t(`Sourate ${s.nameEn} (${s.nameFr}) en français`),
      description: `Sourate ${s.number}, ${s.nameEn} (${s.nameAr}) : ${s.verses} versets, révélation ${s.type.toLowerCase()}. Texte arabe et traduction française.`,
    };
  }
  m = path.match(/^\/hotel\/([^/]+)$/);
  if (m) {
    const h = hotelsData.find((x) => x.id === m![1]);
    if (h) return {
      title: t(`${h.name}, hôtel à ${h.ville}`),
      description: `${h.name} (${h.stars}★) à ${h.ville}, à ${formatDist(h.distanceHaramM)} du Haram : avis, prix par nuit, points forts et points faibles.`,
    };
  }
  return null;
}
