/**
 * Blog auto-generation script
 * Usage: npm run blog:generate
 *
 * Required env vars (add to .env):
 *   ANTHROPIC_API_KEY        — console.anthropic.com
 *   SUPABASE_SERVICE_ROLE_KEY — Supabase > Settings > API > service_role key
 *   UNSPLASH_ACCESS_KEY      — (optional) unsplash.com/developers
 *
 * Optional:
 *   POSTS_PER_RUN=30         — number of posts per execution (default: 30)
 */

import Anthropic from "@anthropic-ai/sdk";
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

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const POSTS_PER_RUN = parseInt(process.env.POSTS_PER_RUN || "30", 10);

if (!ANTHROPIC_API_KEY)
  throw new Error("Missing ANTHROPIC_API_KEY in .env — see console.anthropic.com");
if (!SUPABASE_URL)
  throw new Error("Missing VITE_SUPABASE_URL in .env");
if (!SUPABASE_SERVICE_KEY)
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env — see Supabase > Settings > API");

// ─── Topics (500+) ────────────────────────────────────────────────────────────
// Each topic: { id, title, category, unsplashQuery }
const ALL_TOPICS = [
  // ── Préparation Omra ──
  { id: "prep-01", title: "Comment préparer son Omra pour la première fois", category: "general", unsplashQuery: "mecca kaaba pilgrimage" },
  { id: "prep-02", title: "Liste complète de ce qu'il faut emporter pour l'Omra", category: "general", unsplashQuery: "travel luggage mosque" },
  { id: "prep-03", title: "Combien de temps à l'avance réserver son voyage Omra", category: "general", unsplashQuery: "planning calendar travel" },
  { id: "prep-04", title: "Les vaccins obligatoires pour l'Omra en 2026", category: "general", unsplashQuery: "health medicine travel" },
  { id: "prep-05", title: "Comment choisir la bonne agence de voyage Omra", category: "general", unsplashQuery: "travel agency office" },
  { id: "prep-06", title: "Les documents nécessaires pour obtenir le visa Omra", category: "general", unsplashQuery: "passport documents official" },
  { id: "prep-07", title: "Comment se préparer spirituellement avant l'Omra", category: "general", unsplashQuery: "prayer quran spiritual" },
  { id: "prep-08", title: "Le budget moyen d'une Omra depuis la France en 2026", category: "general", unsplashQuery: "budget money travel savings" },
  { id: "prep-09", title: "Quelle tenue porter pour l'Omra : conseils pour hommes et femmes", category: "general", unsplashQuery: "ihram white pilgrimage clothing" },
  { id: "prep-10", title: "Apprendre les du'as essentielles avant de partir en Omra", category: "general", unsplashQuery: "quran prayer dua mosque" },
  { id: "prep-11", title: "Comment expliquer l'Omra à ses enfants avant le voyage", category: "general", unsplashQuery: "family children mosque" },
  { id: "prep-12", title: "Les erreurs à éviter lors de la préparation de son Omra", category: "general", unsplashQuery: "mistake warning checklist" },
  { id: "prep-13", title: "Faut-il prendre une assurance voyage pour l'Omra ?", category: "general", unsplashQuery: "insurance travel protection" },
  { id: "prep-14", title: "Comment gérer sa monnaie et ses paiements en Arabie Saoudite", category: "general", unsplashQuery: "money currency riyal" },
  { id: "prep-15", title: "Quelle carte SIM utiliser en Arabie Saoudite pour l'Omra", category: "general", unsplashQuery: "smartphone sim card travel" },
  { id: "prep-16", title: "Les applications indispensables pour réussir son Omra", category: "general", unsplashQuery: "smartphone app mobile" },
  { id: "prep-17", title: "Comment réserver son hôtel à La Mecque près du Haram", category: "general", unsplashQuery: "hotel mecca masjid al haram" },
  { id: "prep-18", title: "Itinéraire type pour une Omra de 10 jours", category: "general", unsplashQuery: "itinerary travel schedule" },
  { id: "prep-19", title: "Itinéraire Omra de 7 jours : La Mecque et Médine", category: "general", unsplashQuery: "mecca medina mosque travel" },
  { id: "prep-20", title: "Comment préparer sa valise Omra en 10 étapes", category: "general", unsplashQuery: "suitcase packing travel" },

  // ── Rites et pratiques ──
  { id: "rite-01", title: "Le Tawaf : guide complet pour tourner autour de la Kaaba", category: "general", unsplashQuery: "tawaf kaaba circumambulation" },
  { id: "rite-02", title: "Le Sa'i entre Safa et Marwa : déroulement et conseils", category: "general", unsplashQuery: "safa marwa pilgrimage running" },
  { id: "rite-03", title: "Comment enfiler l'Ihram : guide étape par étape", category: "general", unsplashQuery: "ihram white cloth pilgrimage" },
  { id: "rite-04", title: "Les miqats : où et comment entrer en état d'Ihram", category: "general", unsplashQuery: "mosque miqat pilgrimage entry" },
  { id: "rite-05", title: "La tonte des cheveux (Halq et Taqsir) : règles et pratique", category: "general", unsplashQuery: "haircut ritual religious" },
  { id: "rite-06", title: "La prière au Masjid al-Haram : guide du pèlerin", category: "general", unsplashQuery: "prayer masjid al haram mecca" },
  { id: "rite-07", title: "Prier derrière le Maqam Ibrahim : signification et conseils", category: "general", unsplashQuery: "maqam ibrahim kaaba prayer" },
  { id: "rite-08", title: "La zamzam : vertus et comment boire cette eau sacrée", category: "general", unsplashQuery: "zamzam water well sacred" },
  { id: "rite-09", title: "Niyyah (intention) pour l'Omra : formules et importance", category: "general", unsplashQuery: "intention prayer quran" },
  { id: "rite-10", title: "Le Talbiyah : paroles et moment où les prononcer", category: "general", unsplashQuery: "pilgrimage chanting dua" },
  { id: "rite-11", title: "Les interdictions en état d'Ihram à connaître absolument", category: "general", unsplashQuery: "prohibition rules islamic" },
  { id: "rite-12", title: "Comment effectuer un Tawaf de Qudum (bienvenue)", category: "general", unsplashQuery: "tawaf kaaba arrival" },
  { id: "rite-13", title: "La Hijr Ismaïl : signification et comment y prier", category: "general", unsplashQuery: "hijr ismail kaaba prayer" },
  { id: "rite-14", title: "La Pierre Noire (Hajar al-Aswad) : histoire et comment l'embrasser", category: "general", unsplashQuery: "black stone kaaba hajarul aswad" },
  { id: "rite-15", title: "Différences entre Omra et Hajj : ce que vous devez savoir", category: "general", unsplashQuery: "hajj omra pilgrimage compare" },
  { id: "rite-16", title: "Les du'as recommandées pendant le Tawaf", category: "general", unsplashQuery: "dua prayer kaaba tawaf" },
  { id: "rite-17", title: "Le Tawaf al-Wada : le tawaf d'adieu avant de quitter La Mecque", category: "general", unsplashQuery: "farewell mecca pilgrimage" },
  { id: "rite-18", title: "Comment enchaîner les rites de l'Omra efficacement", category: "general", unsplashQuery: "pilgrimage steps rituals" },
  { id: "rite-19", title: "Les prières spéciales à effectuer à la Kaaba", category: "general", unsplashQuery: "kaaba prayer night mosque" },
  { id: "rite-20", title: "L'Omra Mufradah vs l'Omra du Hajj Tamattu' : différences", category: "general", unsplashQuery: "hajj omra types pilgrimage" },

  // ── Budget et économies ──
  { id: "budget-01", title: "Comment faire l'Omra avec un petit budget", category: "general", unsplashQuery: "budget savings coins money" },
  { id: "budget-02", title: "Les meilleures périodes pour une Omra pas chère", category: "general", unsplashQuery: "calendar cheap travel deals" },
  { id: "budget-03", title: "Comparaison des prix des packages Omra en 2026", category: "general", unsplashQuery: "price comparison travel" },
  { id: "budget-04", title: "Prix d'un billet d'avion Paris-Jeddah : comment trouver les meilleures offres", category: "general", unsplashQuery: "airplane flight ticket price" },
  { id: "budget-05", title: "Les forfaits Omra économiques : que comprennent-ils vraiment ?", category: "general", unsplashQuery: "package travel budget value" },
  { id: "budget-06", title: "Combien prévoir pour les dépenses sur place en Omra", category: "general", unsplashQuery: "shopping market saudi arabia" },
  { id: "budget-07", title: "Les arnaques aux pèlerins Omra et comment les éviter", category: "general", unsplashQuery: "warning scam tourist protection" },
  { id: "budget-08", title: "Économiser sur l'hébergement lors de l'Omra : nos conseils", category: "general", unsplashQuery: "hotel savings budget accommodation" },
  { id: "budget-09", title: "Faut-il réserver l'Omra en groupe ou individuellement ?", category: "general", unsplashQuery: "group travel individual booking" },
  { id: "budget-10", title: "Les aides financières disponibles pour financer son Omra", category: "general", unsplashQuery: "financial aid support community" },
  { id: "budget-11", title: "Comment épargner pour l'Omra : stratégies et conseils pratiques", category: "general", unsplashQuery: "saving money piggy bank" },
  { id: "budget-12", title: "Omra en basse saison : avantages et inconvénients", category: "general", unsplashQuery: "low season travel empty mosque" },
  { id: "budget-13", title: "Le coût réel d'une Omra tout compris depuis Lyon", category: "general", unsplashQuery: "lyon france travel departure" },
  { id: "budget-14", title: "Vols directs vs vols avec escale pour l'Omra : le calcul", category: "general", unsplashQuery: "direct flight stopover comparison" },
  { id: "budget-15", title: "Les meilleures offres Omra du mois de Ramadan 2026", category: "general", unsplashQuery: "ramadan mosque night lights" },

  // ── Logistique voyage ──
  { id: "logi-01", title: "Comment se déplacer entre La Mecque et Médine pendant l'Omra", category: "general", unsplashQuery: "train haramain high speed" },
  { id: "logi-02", title: "Le train Haramain : tout savoir pour voyager entre Jeddah et La Mecque", category: "general", unsplashQuery: "haramain express train saudi" },
  { id: "logi-03", title: "Les transports en commun à La Mecque : bus, taxi, VTC", category: "general", unsplashQuery: "bus transport mecca city" },
  { id: "logi-04", title: "L'aéroport de Jeddah (King Abdulaziz) : guide d'arrivée pour pèlerins", category: "general", unsplashQuery: "airport arrival jeddah saudi" },
  { id: "logi-05", title: "L'aéroport de Médine (Prince Mohammad bin Abdulaziz) : guide pratique", category: "general", unsplashQuery: "airport medina saudi arabia" },
  { id: "logi-06", title: "Comment aller de l'aéroport de Jeddah à La Mecque", category: "general", unsplashQuery: "transfer airport mecca transport" },
  { id: "logi-07", title: "Les bus de la SAPTCO : transport économique en Arabie Saoudite", category: "general", unsplashQuery: "public bus saudi arabia" },
  { id: "logi-08", title: "Uber et Careem en Arabie Saoudite : utilisation pendant l'Omra", category: "general", unsplashQuery: "rideshare car taxi app" },
  { id: "logi-09", title: "La Maison d'Allah : comment se repérer dans l'enceinte du Masjid al-Haram", category: "general", unsplashQuery: "masjid al haram map interior" },
  { id: "logi-10", title: "Carte de La Mecque pour pèlerins : les lieux essentiels", category: "general", unsplashQuery: "mecca map holy sites" },
  { id: "logi-11", title: "Comment se rendre à Médine depuis La Mecque à moindre coût", category: "general", unsplashQuery: "mecca medina travel route" },
  { id: "logi-12", title: "Omra en hiver : vols, températures et conseils pratiques", category: "general", unsplashQuery: "winter travel cold mosque" },
  { id: "logi-13", title: "Omra en été : chaleur, foules et comment s'y préparer", category: "general", unsplashQuery: "summer heat crowd pilgrims" },
  { id: "logi-14", title: "Checklist J-30 avant le départ en Omra", category: "general", unsplashQuery: "checklist planning countdown" },
  { id: "logi-15", title: "Ce qu'il faut savoir sur la douane saoudienne pour les pèlerins", category: "general", unsplashQuery: "customs border passport control" },
  { id: "logi-16", title: "Comment s'organiser pour prier aux 5 prières au Masjid al-Haram", category: "general", unsplashQuery: "prayer schedule mosque timetable" },
  { id: "logi-17", title: "Gérer le décalage horaire entre la France et l'Arabie Saoudite", category: "general", unsplashQuery: "jet lag time zones clock" },
  { id: "logi-18", title: "Que faire si on perd son passeport en Arabie Saoudite", category: "general", unsplashQuery: "lost passport embassy emergency" },
  { id: "logi-19", title: "Les consulats et ambassades françaises en Arabie Saoudite", category: "general", unsplashQuery: "embassy consulate french flag" },
  { id: "logi-20", title: "Omra solo vs Omra en groupe organisé : avantages et inconvénients", category: "general", unsplashQuery: "solo travel group organized" },

  // ── Hébergement ──
  { id: "hotel-01", title: "Les meilleurs hôtels près du Masjid al-Haram à La Mecque", category: "general", unsplashQuery: "hotel mecca haram view" },
  { id: "hotel-02", title: "Abraj Al-Bait (Clock Tower) : l'hôtel face à la Kaaba", category: "general", unsplashQuery: "abraj al bait tower mecca" },
  { id: "hotel-03", title: "Les hôtels économiques à La Mecque pour l'Omra", category: "general", unsplashQuery: "budget hotel accommodation mecca" },
  { id: "hotel-04", title: "Où séjourner à Médine pendant l'Omra : guide des meilleurs quartiers", category: "general", unsplashQuery: "medina hotel masjid nabawi" },
  { id: "hotel-05", title: "Différence entre les catégories d'hôtels dans les packages Omra", category: "general", unsplashQuery: "hotel stars category luxury" },
  { id: "hotel-06", title: "Logement en résidence à La Mecque : une alternative aux hôtels", category: "general", unsplashQuery: "apartment residence accommodation" },
  { id: "hotel-07", title: "Les hôtels les plus proches du Masjid an-Nabawi à Médine", category: "general", unsplashQuery: "masjid nabawi medina green dome" },
  { id: "hotel-08", title: "Partager sa chambre d'hôtel en Omra : conseils et précautions", category: "general", unsplashQuery: "shared room hotel accommodation" },
  { id: "hotel-09", title: "Quels services attendre d'un hôtel dans un package Omra", category: "general", unsplashQuery: "hotel services breakfast included" },
  { id: "hotel-10", title: "Hôtels avec navette gratuite vers le Haram : les meilleures options", category: "general", unsplashQuery: "shuttle bus hotel service" },
  { id: "hotel-11", title: "La Mecque vs Médine : où passer le plus de nuits pendant l'Omra ?", category: "general", unsplashQuery: "mecca medina nights pilgrimage" },
  { id: "hotel-12", title: "Réserver son hébergement Omra directement ou via une agence ?", category: "general", unsplashQuery: "booking direct agency hotel" },
  { id: "hotel-13", title: "Les appartements à La Mecque pour familles en Omra", category: "general", unsplashQuery: "apartment family mecca accommodation" },
  { id: "hotel-14", title: "Top 5 des hôtels 5 étoiles pour une Omra de luxe à La Mecque", category: "general", unsplashQuery: "luxury hotel 5 stars mecca" },
  { id: "hotel-15", title: "Guide des quartiers de La Mecque pour choisir son hébergement", category: "general", unsplashQuery: "mecca district neighborhood map" },

  // ── Familles et groupes spéciaux ──
  { id: "fam-01", title: "Omra en famille avec enfants en bas âge : guide complet", category: "general", unsplashQuery: "family children pilgrimage mosque" },
  { id: "fam-02", title: "L'Omra pour les seniors : conseils médicaux et pratiques", category: "general", unsplashQuery: "elderly senior pilgrimage mosque" },
  { id: "fam-03", title: "Omra avec un proche handicapé : accessibilité et aides disponibles", category: "general", unsplashQuery: "wheelchair accessibility mosque" },
  { id: "fam-04", title: "L'Omra pour les convertis : ce que vous devez savoir", category: "general", unsplashQuery: "convert muslim new faith mosque" },
  { id: "fam-05", title: "Omra avec ses parents âgés : conseils pour un voyage serein", category: "general", unsplashQuery: "elderly parents family mosque" },
  { id: "fam-06", title: "L'Omra de la femme enceinte : est-ce possible et comment ?", category: "general", unsplashQuery: "pregnant woman mosque prayer" },
  { id: "fam-07", title: "Omra pour adolescents : comment les impliquer et les préparer", category: "general", unsplashQuery: "teenager youth mosque prayer" },
  { id: "fam-08", title: "Les forfaits Omra familiaux : avantages et ce qu'ils incluent", category: "general", unsplashQuery: "family package travel group" },
  { id: "fam-09", title: "Comment gérer les horaires de prière avec de jeunes enfants en Omra", category: "general", unsplashQuery: "family prayer children mosque" },
  { id: "fam-10", title: "Omra Badal : accomplir le pèlerinage à la place d'un défunt", category: "general", unsplashQuery: "memorial prayer mosque commemoration" },
  { id: "fam-11", title: "Les groupes d'Omra féminins sans mahram : règles et agences", category: "general", unsplashQuery: "women group pilgrimage mosque" },
  { id: "fam-12", title: "Omra avec des amis : organiser un voyage de groupe", category: "general", unsplashQuery: "friends group travel mosque" },
  { id: "fam-13", title: "L'Omra de la personne diabétique : précautions et conseils médicaux", category: "general", unsplashQuery: "diabetes health medical travel" },
  { id: "fam-14", title: "Voyager en Omra avec un bébé : tout ce qu'il faut savoir", category: "general", unsplashQuery: "baby infant travel pilgrimage" },
  { id: "fam-15", title: "L'Omra Mou'allaq (suspendue) : que faire si on ne peut pas la compléter", category: "general", unsplashQuery: "incomplete pilgrimage rules" },

  // ── Santé ──
  { id: "sante-01", title: "Les précautions médicales à prendre avant l'Omra", category: "general", unsplashQuery: "medical health doctor travel" },
  { id: "sante-02", title: "Comment éviter les coups de chaleur pendant l'Omra en été", category: "general", unsplashQuery: "heat sun protection hydration" },
  { id: "sante-03", title: "La méningite et l'Omra : vaccin et obligation saoudienne", category: "general", unsplashQuery: "vaccine injection medical protection" },
  { id: "sante-04", title: "Comment rester en bonne santé pendant l'Omra : alimentation et hygiène", category: "general", unsplashQuery: "healthy food hydration water" },
  { id: "sante-05", title: "Trousse à pharmacie pour l'Omra : la liste complète", category: "general", unsplashQuery: "first aid kit medicine travel" },
  { id: "sante-06", title: "Gérer la fatigue lors de l'Omra : conseils pour rester en forme", category: "general", unsplashQuery: "fatigue rest sleep pilgrimage" },
  { id: "sante-07", title: "Les maladies courantes pendant l'Omra et comment les prévenir", category: "general", unsplashQuery: "illness prevention health mosque" },
  { id: "sante-08", title: "Omra et asthme : conseils pour les pèlerins ayant des problèmes respiratoires", category: "general", unsplashQuery: "asthma respiratory health inhaler" },
  { id: "sante-09", title: "Rester hydraté à La Mecque : combien boire et quoi éviter", category: "general", unsplashQuery: "water hydration bottle drinking" },
  { id: "sante-10", title: "Comment gérer ses médicaments en Arabie Saoudite", category: "general", unsplashQuery: "medicine pharmacy medication travel" },
  { id: "sante-11", title: "Les hôpitaux et cliniques pour pèlerins à La Mecque et Médine", category: "general", unsplashQuery: "hospital clinic medical care" },
  { id: "sante-12", title: "Omra et hypertension artérielle : ce que disent les médecins", category: "general", unsplashQuery: "blood pressure health medical" },
  { id: "sante-13", title: "Protection solaire pendant l'Omra : crèmes, vêtements et parapluie", category: "general", unsplashQuery: "sun protection sunscreen umbrella" },
  { id: "sante-14", title: "La nourriture en Arabie Saoudite : que manger pendant l'Omra ?", category: "general", unsplashQuery: "food arabic cuisine meal" },
  { id: "sante-15", title: "Soins des pieds pendant l'Omra : éviter les ampoules et blessures", category: "general", unsplashQuery: "feet walking blister care" },

  // ── Spiritualité ──
  { id: "spirit-01", title: "Les bienfaits spirituels de l'Omra selon le Coran et la Sunnah", category: "general", unsplashQuery: "quran spirituality faith prayer" },
  { id: "spirit-02", title: "Comment vivre l'Omra comme une véritable renaissance spirituelle", category: "general", unsplashQuery: "spiritual rebirth mosque prayer night" },
  { id: "spirit-03", title: "Les du'as les plus puissantes à réciter à La Mecque", category: "general", unsplashQuery: "dua supplication prayer mosque" },
  { id: "spirit-04", title: "Comment maximiser ses ibadats (actes d'adoration) pendant l'Omra", category: "general", unsplashQuery: "ibadah worship prayer mosque" },
  { id: "spirit-05", title: "La nuit du Qadr : quand et comment la chercher à La Mecque", category: "general", unsplashQuery: "laylat al qadr night ramadan mosque" },
  { id: "spirit-06", title: "Pourquoi l'Omra transforme la vie : témoignages de pèlerins français", category: "general", unsplashQuery: "testimony spiritual experience mosque" },
  { id: "spirit-07", title: "Comment rester concentré spirituellement malgré les foules", category: "general", unsplashQuery: "crowd pilgrims concentration prayer" },
  { id: "spirit-08", title: "La signification profonde des rites de l'Omra", category: "general", unsplashQuery: "meaning symbolism pilgrimage rites" },
  { id: "spirit-09", title: "Méditation et dhikr pendant l'Omra : guide pratique", category: "general", unsplashQuery: "dhikr meditation quran prayer" },
  { id: "spirit-10", title: "Les sourates du Coran à mémoriser avant l'Omra", category: "general", unsplashQuery: "quran memorization surah learning" },
  { id: "spirit-11", title: "Comment faire du Tawaf une expérience spirituelle intense", category: "general", unsplashQuery: "tawaf kaaba spiritual circumambulation" },
  { id: "spirit-12", title: "L'importance de la sincérité (Ikhlas) dans le pèlerinage", category: "general", unsplashQuery: "sincerity faith pure heart mosque" },
  { id: "spirit-13", title: "Comment se repentir (Tawbah) pendant l'Omra", category: "general", unsplashQuery: "repentance tawba prayer forgiveness" },
  { id: "spirit-14", title: "Les vertus de la prière dans le Masjid al-Haram", category: "general", unsplashQuery: "prayer reward masjid haram virtue" },
  { id: "spirit-15", title: "Ramener les bénédictions de l'Omra dans sa vie quotidienne", category: "general", unsplashQuery: "blessing spiritual daily life" },
  { id: "spirit-16", title: "Comment formuler ses du'as à La Mecque : conseils pratiques", category: "general", unsplashQuery: "dua supplication raising hands prayer" },
  { id: "spirit-17", title: "L'Omra comme cure spirituelle : gérer ses émotions lors du pèlerinage", category: "general", unsplashQuery: "emotion spiritual healing mosque" },
  { id: "spirit-18", title: "Le Istilam de la Pierre Noire : geste, du'a et signification", category: "general", unsplashQuery: "black stone kaaba sacred touch" },
  { id: "spirit-19", title: "Pleurer devant Allah à La Mecque : une grâce inestimable", category: "general", unsplashQuery: "tears cry prayer emotional mosque" },
  { id: "spirit-20", title: "Comment partager son expérience spirituelle de l'Omra à son retour", category: "general", unsplashQuery: "sharing story family friends mosque" },

  // ── Lieux saints ──
  { id: "lieu-01", title: "La Kaaba : histoire complète et signification islamique", category: "general", unsplashQuery: "kaaba cube black cloth mecca" },
  { id: "lieu-02", title: "Le Masjid an-Nabawi de Médine : guide du pèlerin", category: "general", unsplashQuery: "masjid nabawi medina prophet mosque" },
  { id: "lieu-03", title: "La grotte de Hira (Jabal an-Nour) : comment y accéder", category: "general", unsplashQuery: "hira cave mountain mecca" },
  { id: "lieu-04", title: "Jabal Thawr : la grotte de l'Hégire (Hijra)", category: "general", unsplashQuery: "cave mountain history islamic" },
  { id: "lieu-05", title: "Le cimetière d'Al-Baqi à Médine : guide et règles de visite", category: "general", unsplashQuery: "cemetery baqi medina islamic" },
  { id: "lieu-06", title: "La mosquée de Quba : la première mosquée de l'Islam", category: "general", unsplashQuery: "quba mosque medina first" },
  { id: "lieu-07", title: "La mosquée des Deux Qiblas (Masjid al-Qiblatayn) à Médine", category: "general", unsplashQuery: "qiblatayn mosque medina two qibla" },
  { id: "lieu-08", title: "Jabal Abu Qubays et Jabal al-Ka'ba : les collines de La Mecque", category: "general", unsplashQuery: "mountain hill mecca view" },
  { id: "lieu-09", title: "Les mosquées des 7 à Médine : lesquelles visiter et pourquoi", category: "general", unsplashQuery: "seven mosques medina islam" },
  { id: "lieu-10", title: "Le puits de Zamzam : histoire et vertus de cette eau bénie", category: "general", unsplashQuery: "zamzam well water sacred mecca" },
  { id: "lieu-11", title: "Musée de Médine : découvrir l'histoire de l'Islam", category: "general", unsplashQuery: "museum medina islamic history" },
  { id: "lieu-12", title: "La bibliothèque du Roi Fahd à La Mecque", category: "general", unsplashQuery: "library book mecca quran" },
  { id: "lieu-13", title: "Le marché Ajyad et les souks de La Mecque", category: "general", unsplashQuery: "market souk shopping mecca" },
  { id: "lieu-14", title: "Maison de Khadija (ra) : lieu historique à La Mecque", category: "general", unsplashQuery: "historic site khadija mecca house" },
  { id: "lieu-15", title: "Le lieu de naissance du Prophète (ﷺ) à La Mecque", category: "general", unsplashQuery: "birth place prophet muhammad mecca" },
  { id: "lieu-16", title: "La montagne de Abou Qubays et la vue sur la Kaaba", category: "general", unsplashQuery: "mountain view kaaba panorama" },
  { id: "lieu-17", title: "Les portes du Masjid al-Haram : noms, histoire et localisation", category: "general", unsplashQuery: "gate door masjid haram mecca" },
  { id: "lieu-18", title: "Le quartier Ajyad historique de La Mecque", category: "general", unsplashQuery: "historic district neighborhood mecca" },
  { id: "lieu-19", title: "La Makkah Royal Clock Tower : symbole moderne de La Mecque", category: "general", unsplashQuery: "clock tower mecca modern" },
  { id: "lieu-20", title: "Les sites historiques de Médine à ne pas manquer", category: "general", unsplashQuery: "historic sites medina islamic" },

  // ── Hajj ──
  { id: "hajj-01", title: "Guide complet du Hajj 2026 : étapes et conseils", category: "general", unsplashQuery: "hajj pilgrimage arafat crowd" },
  { id: "hajj-02", title: "S'inscrire sur Nusuk pour le Hajj 2026 : guide étape par étape", category: "general", unsplashQuery: "online registration hajj nusuk" },
  { id: "hajj-03", title: "Le coût du Hajj 2026 depuis la France : tout détailler", category: "general", unsplashQuery: "hajj cost budget france" },
  { id: "hajj-04", title: "Les rites du Hajj selon le Coran et la Sunnah", category: "general", unsplashQuery: "hajj rites pilgrimage arafat" },
  { id: "hajj-05", title: "La journée d'Arafat (Yawm Arafah) : le cœur du Hajj", category: "general", unsplashQuery: "arafat mountain hajj pilgrims" },
  { id: "hajj-06", title: "Mina et la lapidation des piliers (Rami) : guide pratique", category: "general", unsplashQuery: "mina tents hajj stoning pillars" },
  { id: "hajj-07", title: "Muzdalifah : nuit en plein air lors du Hajj", category: "general", unsplashQuery: "muzdalifah night open air hajj" },
  { id: "hajj-08", title: "L'Aïd al-Adha et le sacrifice (Hady) pendant le Hajj", category: "general", unsplashQuery: "eid al adha sacrifice hajj" },
  { id: "hajj-09", title: "Différences entre le Hajj Tamattu, Ifrad et Qiran", category: "general", unsplashQuery: "hajj types pilgrim types" },
  { id: "hajj-10", title: "Comment se préparer physiquement pour le Hajj", category: "general", unsplashQuery: "physical fitness training walk" },
  { id: "hajj-11", title: "Les obligations et recommandations du Hajj selon les 4 madhabs", category: "general", unsplashQuery: "islamic school madhab fiqh" },
  { id: "hajj-12", title: "Chronologie complète des 5 jours du Hajj (8-13 Dhu al-Hijjah)", category: "general", unsplashQuery: "hajj calendar days schedule" },
  { id: "hajj-13", title: "Hajj Badal : peut-on faire le Hajj à la place d'une autre personne ?", category: "general", unsplashQuery: "hajj badal proxy pilgrimage" },
  { id: "hajj-14", title: "Les quotas de Hajj pour la France : comment fonctionnent-ils ?", category: "general", unsplashQuery: "hajj quota france allocation" },
  { id: "hajj-15", title: "Les conditions requises pour effectuer le Hajj", category: "general", unsplashQuery: "conditions requirements hajj eligibility" },
  { id: "hajj-16", title: "Omra avant ou après le Hajj : que recommandent les savants ?", category: "general", unsplashQuery: "omra before after hajj order" },
  { id: "hajj-17", title: "Le sacrifice du Hajj (Udhiyah) : règles et déroulement", category: "general", unsplashQuery: "sacrifice animal eid islamic ritual" },
  { id: "hajj-18", title: "Comment gérer la foule immense du Hajj en toute sécurité", category: "general", unsplashQuery: "crowd safety hajj pilgrims" },
  { id: "hajj-19", title: "Les tentes de Mina : confort et organisation pour les pèlerins", category: "general", unsplashQuery: "mina tents air conditioning hajj" },
  { id: "hajj-20", title: "Retour d'un Hajj accompli : que change vraiment ce pèlerinage ?", category: "general", unsplashQuery: "returning hajj pilgrim home france" },

  // ── Ramadan ──
  { id: "ram-01", title: "Omra pendant le Ramadan 2026 : guide complet", category: "general", unsplashQuery: "ramadan mosque night lights" },
  { id: "ram-02", title: "Pourquoi l'Omra en Ramadan équivaut à un Hajj", category: "general", unsplashQuery: "ramadan omra night kaaba" },
  { id: "ram-03", title: "Les prix de l'Omra pendant le Ramadan 2026", category: "general", unsplashQuery: "ramadan prices travel packages" },
  { id: "ram-04", title: "Les 10 derniers jours du Ramadan à La Mecque", category: "general", unsplashQuery: "last 10 days ramadan mecca mosque" },
  { id: "ram-05", title: "Iftar à La Mecque : les meilleures tables pour les pèlerins", category: "general", unsplashQuery: "iftar breaking fast mecca food" },
  { id: "ram-06", title: "Les prières Tarawih au Masjid al-Haram : guide du visiteur", category: "general", unsplashQuery: "tarawih prayer night ramadan mosque" },
  { id: "ram-07", title: "Ramadan à Médine : atmosphère et activités spirituelles", category: "general", unsplashQuery: "medina ramadan night spiritual" },
  { id: "ram-08", title: "Comment jeûner et faire l'Omra en même temps", category: "general", unsplashQuery: "fasting pilgrimage ramadan water" },
  { id: "ram-09", title: "Laylat al-Qadr à La Mecque : comment la vivre intensément", category: "general", unsplashQuery: "laylat al qadr night of power mosque" },
  { id: "ram-10", title: "Les affluences pendant le Ramadan à La Mecque : s'y préparer", category: "general", unsplashQuery: "ramadan crowd mecca pilgrims" },
  { id: "ram-11", title: "Sahour à La Mecque : restaurants et options disponibles", category: "general", unsplashQuery: "sahour suhoor meal early morning" },
  { id: "ram-12", title: "Calendrier islamique 2026 : dates du Ramadan et du Hajj", category: "general", unsplashQuery: "islamic calendar 2026 dates" },
  { id: "ram-13", title: "Les avantages de partir en Omra hors Ramadan", category: "general", unsplashQuery: "off season omra quiet mosque" },
  { id: "ram-14", title: "Omra fin Ramadan / début Chawwal : astuce pour combiner", category: "general", unsplashQuery: "ramadan shawwal eid transition" },
  { id: "ram-15", title: "L'atmosphère unique du Ramadan à La Mecque et Médine", category: "general", unsplashQuery: "ramadan atmosphere mecca medina" },

  // ── Femmes en Omra ──
  { id: "femme-01", title: "La femme seule en Omra : nouvelles règles saoudiennes 2026", category: "general", unsplashQuery: "woman pilgrimage alone mosque" },
  { id: "femme-02", title: "Comment s'habiller en femme pour l'Omra : guide vestimentaire", category: "general", unsplashQuery: "women islamic dress abaya modesty" },
  { id: "femme-03", title: "L'Omra pendant les règles (hayd) : que faire ?", category: "general", unsplashQuery: "women health islamic rules" },
  { id: "femme-04", title: "Les droits de la femme pèlerine en Arabie Saoudite", category: "general", unsplashQuery: "women rights saudi arabia mosque" },
  { id: "femme-05", title: "Omra sans mahram pour les femmes : historique et conditions", category: "general", unsplashQuery: "women without mahram group pilgrimage" },
  { id: "femme-06", title: "Les espaces réservés aux femmes au Masjid al-Haram", category: "general", unsplashQuery: "women section mosque prayer area" },
  { id: "femme-07", title: "Du'as spéciales pour les femmes pendant l'Omra", category: "general", unsplashQuery: "women prayer dua supplication" },
  { id: "femme-08", title: "Omra et mariage : l'Omra de lune de miel, une belle tradition", category: "general", unsplashQuery: "honeymoon couple mosque marriage" },
  { id: "femme-09", title: "Les agences françaises spécialisées dans l'Omra pour femmes seules", category: "general", unsplashQuery: "women travel agency specialized" },
  { id: "femme-10", title: "Les précautions de sécurité pour les femmes en Arabie Saoudite", category: "general", unsplashQuery: "safety security women travel" },

  // ── Villes françaises ──
  { id: "ville-01", title: "Omra depuis Paris : les vols, agences et prix en 2026", category: "general", unsplashQuery: "paris france airport flight" },
  { id: "ville-02", title: "Omra depuis Lyon : meilleures offres et agences locales", category: "general", unsplashQuery: "lyon france mosque community" },
  { id: "ville-03", title: "Omra depuis Marseille : départs directs et packages disponibles", category: "general", unsplashQuery: "marseille france port mosque" },
  { id: "ville-04", title: "Omra depuis Lille : agences du Nord et offres groupées", category: "general", unsplashQuery: "lille nord france mosque community" },
  { id: "ville-05", title: "Omra depuis Strasbourg : vols et communauté musulmane alsacienne", category: "general", unsplashQuery: "strasbourg alsace france mosque" },
  { id: "ville-06", title: "Omra depuis Bordeaux : les meilleures agences de Nouvelle-Aquitaine", category: "general", unsplashQuery: "bordeaux france mosque community" },
  { id: "ville-07", title: "Omra depuis Nice et la Côte d'Azur : offres et conseils", category: "general", unsplashQuery: "nice cote azur france travel" },
  { id: "ville-08", title: "Omra depuis Toulouse : départs du Sud-Ouest et forfaits complets", category: "general", unsplashQuery: "toulouse france mosque south" },
  { id: "ville-09", title: "Omra depuis Nantes : agences et vols depuis Pays de la Loire", category: "general", unsplashQuery: "nantes france mosque community" },
  { id: "ville-10", title: "Omra depuis Rennes et la Bretagne : options de voyage", category: "general", unsplashQuery: "rennes brittany france mosque" },
  { id: "ville-11", title: "Omra depuis Grenoble et les Alpes : meilleures offres 2026", category: "general", unsplashQuery: "grenoble alps france mosque" },
  { id: "ville-12", title: "Omra depuis Montpellier : départs du Sud de la France", category: "general", unsplashQuery: "montpellier france south mosque" },
  { id: "ville-13", title: "Omra depuis Metz et la Lorraine : votre guide de départ", category: "general", unsplashQuery: "metz lorraine france mosque" },
  { id: "ville-14", title: "Omra depuis Clermont-Ferrand : vols et packages Auvergne", category: "general", unsplashQuery: "clermont ferrand auvergne france" },
  { id: "ville-15", title: "Omra depuis Saint-Étienne : communauté et agences locales", category: "general", unsplashQuery: "saint etienne france mosque community" },

  // ── Saisons ──
  { id: "saison-01", title: "Omra en octobre 2026 : climat, affluence et prix", category: "general", unsplashQuery: "autumn october travel mosque" },
  { id: "saison-02", title: "Omra en novembre 2026 : la période idéale pour les pèlerins", category: "general", unsplashQuery: "november autumn mild weather travel" },
  { id: "saison-03", title: "Omra en décembre 2026 : hiver doux à La Mecque", category: "general", unsplashQuery: "december winter mild mecca mosque" },
  { id: "saison-04", title: "Omra en janvier 2027 : fraîcheur et faible affluence", category: "general", unsplashQuery: "january winter low season mosque" },
  { id: "saison-05", title: "Omra en février 2027 : bonne période pour partir", category: "general", unsplashQuery: "february winter travel pilgrimage" },
  { id: "saison-06", title: "Omra en mars 2027 : avant le Ramadan", category: "general", unsplashQuery: "march spring travel mosque" },
  { id: "saison-07", title: "Omra en été (juin-août) : chaleur extrême et organisation", category: "general", unsplashQuery: "summer heat mecca crowd pilgrims" },
  { id: "saison-08", title: "La meilleure saison pour faire l'Omra selon les experts", category: "general", unsplashQuery: "best season travel pilgrimage" },
  { id: "saison-09", title: "Omra pendant les vacances scolaires : avantages et défauts", category: "general", unsplashQuery: "school holidays family travel" },
  { id: "saison-10", title: "Omra pendant les fêtes de fin d'année : que prévoir ?", category: "general", unsplashQuery: "holidays december year end travel" },

  // ── Histoire islamique ──
  { id: "hist-01", title: "L'histoire de la Kaaba : des origines à nos jours", category: "general", unsplashQuery: "kaaba history ancient islamic" },
  { id: "hist-02", title: "Ibrahim (as) et la construction de la Kaaba", category: "general", unsplashQuery: "ibrahim kaaba construction ancient" },
  { id: "hist-03", title: "La vie du Prophète Muhammad (ﷺ) à La Mecque", category: "general", unsplashQuery: "prophet muhammad mecca history" },
  { id: "hist-04", title: "L'Hégire : le voyage historique de La Mecque à Médine", category: "general", unsplashQuery: "hijra migration mecca medina history" },
  { id: "hist-05", title: "La conquête de La Mecque (Fath Makkah) : récit historique", category: "general", unsplashQuery: "conquest mecca fath makkah history" },
  { id: "hist-06", title: "L'histoire du premier Hajj du Prophète (ﷺ) : le Hajj al-Wada", category: "general", unsplashQuery: "farewell hajj prophet history" },
  { id: "hist-07", title: "L'évolution du Masjid al-Haram au fil des siècles", category: "general", unsplashQuery: "masjid al haram history expansion" },
  { id: "hist-08", title: "L'histoire de Zamzam : la source miraculeuse d'Hajar", category: "general", unsplashQuery: "zamzam well hajar history miracle" },
  { id: "hist-09", title: "La révélation du Coran : la grotte de Hira et le début de l'Islam", category: "general", unsplashQuery: "quran revelation hira cave history" },
  { id: "hist-10", title: "Les Compagnons enterrés à Médine : histoire de Baqi", category: "general", unsplashQuery: "companions sahaba medina cemetery baqi" },
  { id: "hist-11", title: "L'histoire de la construction du Masjid an-Nabawi", category: "general", unsplashQuery: "masjid nabawi construction history" },
  { id: "hist-12", title: "Les grandes rénovations de La Mecque au XXe siècle", category: "general", unsplashQuery: "mecca renovation construction modern" },
  { id: "hist-13", title: "Bilal ibn Rabah : le premier muezzin de l'Islam", category: "general", unsplashQuery: "bilal muezzin call to prayer history" },
  { id: "hist-14", title: "La mosquée de Quba : première mosquée construite en Islam", category: "general", unsplashQuery: "quba mosque first islam medina" },
  { id: "hist-15", title: "L'histoire de la Pierre Noire (Hajar al-Aswad)", category: "general", unsplashQuery: "black stone hajar aswad history" },
  { id: "hist-16", title: "Les 99 noms d'Allah et leur signification", category: "general", unsplashQuery: "99 names allah arabic calligraphy" },
  { id: "hist-17", title: "Les Quatre Imams et l'école juridique pour l'Omra", category: "general", unsplashQuery: "four imams madhab islamic school" },
  { id: "hist-18", title: "L'Empire Ottoman et la protection des lieux saints", category: "general", unsplashQuery: "ottoman empire mecca medina history" },
  { id: "hist-19", title: "La modernisation de La Mecque et ses controverses", category: "general", unsplashQuery: "mecca modernization skyscrapers debate" },
  { id: "hist-20", title: "Ibn Battuta et son pèlerinage : le récit d'un grand voyageur", category: "general", unsplashQuery: "ibn battuta travel history medieval" },

  // ── Questions pratiques ──
  { id: "qa-01", title: "Peut-on faire l'Omra sans maîtriser l'arabe ?", category: "general", unsplashQuery: "arabic language learning mosque" },
  { id: "qa-02", title: "L'Omra est-elle obligatoire ? Ce qu'enseigne l'Islam", category: "general", unsplashQuery: "obligatory duty islamic ruling" },
  { id: "qa-03", title: "Combien de fois peut-on faire l'Omra dans sa vie ?", category: "general", unsplashQuery: "multiple times pilgrimage omra" },
  { id: "qa-04", title: "Peut-on faire l'Omra pendant ses études ou au travail ?", category: "general", unsplashQuery: "student work leave travel omra" },
  { id: "qa-05", title: "Faut-il être en état de pureté rituelle pour entrer à La Mecque ?", category: "general", unsplashQuery: "ritual purity wudu mosque" },
  { id: "qa-06", title: "Peut-on prendre des photos à La Mecque et Médine ?", category: "general", unsplashQuery: "photography mosque allowed rules" },
  { id: "qa-07", title: "Que faire si on rate une prière pendant l'Omra ?", category: "general", unsplashQuery: "missed prayer qada make up" },
  { id: "qa-08", title: "Est-il permis de parler au téléphone en état d'Ihram ?", category: "general", unsplashQuery: "phone call ihram permission" },
  { id: "qa-09", title: "Comment faire ses ablutions (Wudu) en voyage à La Mecque", category: "general", unsplashQuery: "wudu ablution water mosque ritual" },
  { id: "qa-10", title: "Les non-musulmans peuvent-ils entrer à La Mecque ?", category: "general", unsplashQuery: "non muslim forbidden mecca enter" },
  { id: "qa-11", title: "Quelle langue parle-t-on en Arabie Saoudite ? Guide pour pèlerins", category: "general", unsplashQuery: "arabic language saudi arabia" },
  { id: "qa-12", title: "Comment appeler en France depuis l'Arabie Saoudite ?", category: "general", unsplashQuery: "phone call international communication" },
  { id: "qa-13", title: "Les règles de comportement en Arabie Saoudite pour les pèlerins", category: "general", unsplashQuery: "behavior rules etiquette saudi arabia" },
  { id: "qa-14", title: "Peut-on fumer en Arabie Saoudite pendant l'Omra ?", category: "general", unsplashQuery: "smoking prohibited rules islamic" },
  { id: "qa-15", title: "Acheter des souvenirs à La Mecque : que ramener pour la famille ?", category: "general", unsplashQuery: "souvenirs gifts mecca shopping" },
  { id: "qa-16", title: "Les règles pour entrer dans le Masjid al-Haram", category: "general", unsplashQuery: "enter mosque rules etiquette" },
  { id: "qa-17", title: "Comment prier la Janaza (prière funèbre) à La Mecque", category: "general", unsplashQuery: "janaza funeral prayer mosque" },
  { id: "qa-18", title: "Peut-on offrir une Omra à quelqu'un comme cadeau ?", category: "general", unsplashQuery: "gift omra offer present" },
  { id: "qa-19", title: "Les change d'argent en Arabie Saoudite : où et comment", category: "general", unsplashQuery: "currency exchange riyal bureau" },
  { id: "qa-20", title: "Comment rester connecté avec sa famille depuis La Mecque", category: "general", unsplashQuery: "wifi internet connected family abroad" },

  // ── Retour d'Omra ──
  { id: "retour-01", title: "Que faire à son retour d'Omra : conseils spirituels", category: "general", unsplashQuery: "return home spiritual journey end" },
  { id: "retour-02", title: "Comment maintenir la spiritualité après l'Omra dans sa vie quotidienne", category: "general", unsplashQuery: "spirituality daily life after pilgrimage" },
  { id: "retour-03", title: "Les cadeaux à ramener de La Mecque pour sa famille", category: "general", unsplashQuery: "gifts souvenirs mecca family" },
  { id: "retour-04", title: "Partager son expérience d'Omra sur les réseaux sociaux : oui ou non ?", category: "general", unsplashQuery: "social media sharing experience" },
  { id: "retour-05", title: "Reconnaître les signes d'un Omra accepté (Maqbul)", category: "general", unsplashQuery: "accepted pilgrimage signs blessing" },
  { id: "retour-06", title: "Comment remercier Allah après son Omra : du'as et actes", category: "general", unsplashQuery: "gratitude thankful prayer dua" },
  { id: "retour-07", title: "La quarantaine spirituelle après l'Omra : 40 jours de bonne conduite", category: "general", unsplashQuery: "40 days spiritual practice after" },
  { id: "retour-08", title: "Comment transmettre les bénédictions de l'Omra à sa famille", category: "general", unsplashQuery: "family blessing sharing omra" },
  { id: "retour-09", title: "Écrire le récit de son Omra : une mémoire précieuse à préserver", category: "general", unsplashQuery: "journal writing memory pilgrimage" },
  { id: "retour-10", title: "Aider les autres à partir en Omra après son retour", category: "general", unsplashQuery: "help others community pilgrimage" },

  // ── Agences et services ──
  { id: "agence-01", title: "Top 10 des agences Omra agréées en France en 2026", category: "general", unsplashQuery: "travel agency office france" },
  { id: "agence-02", title: "Comment vérifier qu'une agence Omra est agréée et sérieuse", category: "general", unsplashQuery: "certification approved agency check" },
  { id: "agence-03", title: "Les agences Omra à éviter : signaux d'alarme à repérer", category: "general", unsplashQuery: "warning danger scam agency" },
  { id: "agence-04", title: "Comparatif des packages Omra : ce que les agences ne vous disent pas", category: "general", unsplashQuery: "comparison packages hidden costs" },
  { id: "agence-05", title: "Les services inclus vs payants dans un forfait Omra", category: "general", unsplashQuery: "included services extras travel package" },
  { id: "agence-06", title: "Agences Omra en ligne vs agences physiques : avantages et risques", category: "general", unsplashQuery: "online offline booking travel agency" },
  { id: "agence-07", title: "Réserver son Omra en dernière minute : est-ce possible ?", category: "general", unsplashQuery: "last minute booking travel deal" },
  { id: "agence-08", title: "Les garanties à exiger d'une agence Omra avant de réserver", category: "general", unsplashQuery: "guarantee contract protection booking" },
  { id: "agence-09", title: "Visa Omra en ligne (Nusuk) : comment le faire soi-même", category: "general", unsplashQuery: "visa online application self service" },
  { id: "agence-10", title: "Les meilleurs sites de comparaison de packages Omra", category: "general", unsplashQuery: "comparison website travel omra" },

  // ── Cuisine et alimentation ──
  { id: "cuisine-01", title: "Les meilleurs restaurants halal à La Mecque pour les pèlerins français", category: "restaurants", unsplashQuery: "halal restaurant mecca food arabic" },
  { id: "cuisine-02", title: "Manger à Médine : guide des restaurants près du Masjid an-Nabawi", category: "restaurants", unsplashQuery: "restaurant medina halal food" },
  { id: "cuisine-03", title: "La cuisine saoudienne : plats traditionnels à goûter pendant l'Omra", category: "restaurants", unsplashQuery: "saudi food cuisine kabsa rice" },
  { id: "cuisine-04", title: "Restaurants français à La Mecque : sont-ils vraiment disponibles ?", category: "restaurants", unsplashQuery: "french cuisine abroad restaurant" },
  { id: "cuisine-05", title: "Les chaînes de fast-food disponibles à La Mecque (Al Baik, etc.)", category: "restaurants", unsplashQuery: "fast food restaurant saudi chain" },
  { id: "cuisine-06", title: "Livraison de repas à l'hôtel pendant l'Omra : options disponibles", category: "restaurants", unsplashQuery: "food delivery hotel room service" },
  { id: "cuisine-07", title: "Allergies alimentaires en Arabie Saoudite : comment communiquer", category: "restaurants", unsplashQuery: "food allergy restaurant arabic" },
  { id: "cuisine-08", title: "Les souks d'alimentation à La Mecque : fruits secs et spécialités", category: "restaurants", unsplashQuery: "market souk dried fruits dates" },
  { id: "cuisine-09", title: "Le café saoudien (Qahwa) et le thé à la menthe : traditions culinaires", category: "restaurants", unsplashQuery: "arabic coffee qahwa mint tea" },
  { id: "cuisine-10", title: "Les dattes de Médine : variétés, vertus et où les acheter", category: "restaurants", unsplashQuery: "dates medina ajwa fruits market" },
  { id: "cuisine-11", title: "Manger végétarien/vegan en Arabie Saoudite pendant l'Omra", category: "restaurants", unsplashQuery: "vegetarian vegan food arabic" },
  { id: "cuisine-12", title: "Le Kabsa : plat national saoudien à ne pas manquer", category: "restaurants", unsplashQuery: "kabsa rice lamb saudi national dish" },
  { id: "cuisine-13", title: "Cuisiner dans son appartement à La Mecque : est-ce possible ?", category: "restaurants", unsplashQuery: "apartment kitchen cooking mecca" },
  { id: "cuisine-14", title: "Restaurants avec vue sur la Kaaba : une expérience inoubliable", category: "restaurants", unsplashQuery: "restaurant view kaaba mecca rooftop" },
  { id: "cuisine-15", title: "Les restaurants Balad à Jeddah : escale gourmande avant l'Omra", category: "restaurants", unsplashQuery: "jeddah balad old city restaurant food" },

  // ── Associations ──
  { id: "asso-01", title: "Les associations islamiques qui organisent des voyages Omra en France", category: "associations", unsplashQuery: "association community mosque france" },
  { id: "asso-02", title: "Comment rejoindre un groupe Omra via votre mosquée locale", category: "associations", unsplashQuery: "local mosque community group" },
  { id: "asso-03", title: "Les associations qui aident les personnes défavorisées à partir en Omra", category: "associations", unsplashQuery: "charity help poor pilgrimage aid" },
  { id: "asso-04", title: "Financer son Omra grâce à sa communauté : modèles de tontines", category: "associations", unsplashQuery: "community savings tontine finance" },
  { id: "asso-05", title: "Les associations franco-arabes et leur rôle dans l'organisation de l'Omra", category: "associations", unsplashQuery: "french arab association mosque" },

  // ── Vendeurs ──
  { id: "vendor-01", title: "Les meilleures boutiques de vêtements islamiques pour l'Omra en France", category: "vendeurs", unsplashQuery: "islamic clothing store abaya hijab" },
  { id: "vendor-02", title: "Où acheter son Ihram en France avant le départ en Omra", category: "vendeurs", unsplashQuery: "ihram white cloth buy store" },
  { id: "vendor-03", title: "Matériel de pèlerinage : sacs de Tawaf, sandales, ceintures", category: "vendeurs", unsplashQuery: "pilgrimage gear equipment bag belt" },
  { id: "vendor-04", title: "Les boutiques islamiques à Paris pour préparer son Omra", category: "vendeurs", unsplashQuery: "islamic shop paris france religious" },
  { id: "vendor-05", title: "Acheter des souvenirs islamiques authentiques à La Mecque", category: "vendeurs", unsplashQuery: "souvenirs gifts islamic authentic mecca" },
];

// ─── Topic tracking ────────────────────────────────────────────────────────────
const USED_FILE = join(__dirname, ".blog-used-topics.json");

function getUsedIds() {
  if (!existsSync(USED_FILE)) return [];
  try { return JSON.parse(readFileSync(USED_FILE, "utf8")); }
  catch { return []; }
}

function saveUsedIds(ids) {
  writeFileSync(USED_FILE, JSON.stringify(ids, null, 2));
}

// ─── Slug helper ──────────────────────────────────────────────────────────────
function toSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// ─── Unsplash photo ───────────────────────────────────────────────────────────
const FALLBACK_PHOTOS = [
  "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=80",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80",
  "https://images.unsplash.com/photo-1608138403869-17c4eb84a5e3?w=1200&q=80",
  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&q=80",
  "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=1200&q=80",
];

async function fetchCoverPhoto(query) {
  if (!UNSPLASH_ACCESS_KEY) {
    return FALLBACK_PHOTOS[Math.floor(Math.random() * FALLBACK_PHOTOS.length)];
  }
  try {
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Unsplash ${res.status}`);
    const data = await res.json();
    return data.urls?.regular ?? FALLBACK_PHOTOS[0];
  } catch {
    return FALLBACK_PHOTOS[Math.floor(Math.random() * FALLBACK_PHOTOS.length)];
  }
}

// ─── Get author_id from existing posts ────────────────────────────────────────
async function getAuthorId() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?select=author_id&limit=1`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error(`Supabase error fetching author_id: ${res.status}`);
  const data = await res.json();
  if (!data.length) throw new Error("No existing posts found — cannot derive author_id. Please add SUPABASE_AUTHOR_ID to .env");
  return data[0].author_id;
}

// ─── Check slug uniqueness ────────────────────────────────────────────────────
async function slugExists(slug) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&select=slug&limit=1`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data.length > 0;
}

// ─── Generate content with Claude ─────────────────────────────────────────────
async function generatePost(topic) {
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2500,
    messages: [
      {
        role: "user",
        content: `Tu es un expert en voyages spirituels islamiques (Omra, Hajj) qui écrit pour des musulmans francophones souhaitant partir en pèlerinage.

Écris un article de blog complet et utile en français sur : "${topic.title}"

Exigences :
- Langue : français courant et naturel, adapté à un large public
- Longueur : 900-1300 mots
- Structure : titres H2 (##) et H3 (###) clairs en markdown
- Contenu : pratique, concret, avec des conseils applicables
- SEO : intégrer naturellement le mot-clé principal dans les titres et le texte
- Ton : bienveillant, informatif, rassurant pour les futurs pèlerins

Réponds UNIQUEMENT en JSON valide, sans markdown autour, au format suivant :
{
  "title": "Titre accrocheur et SEO-friendly (max 65 caractères)",
  "excerpt": "Résumé clair et incitatif de 140-160 caractères",
  "content": "# Titre principal\\n\\n[contenu complet en markdown...]",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "slug": "slug-sans-accents-ni-majuscules"
}`,
      },
    ],
  });

  const text = message.content[0].text.trim();

  // Extract JSON even if wrapped in markdown code block
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`No JSON found in Claude response: ${text.slice(0, 200)}`);
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Validate required fields
  if (!parsed.title || !parsed.content) {
    throw new Error("Generated post missing title or content");
  }

  return parsed;
}

// ─── Insert post to Supabase ──────────────────────────────────────────────────
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

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase insert failed (${res.status}): ${body}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🕌 Blog auto-generation — ${new Date().toLocaleDateString("fr-FR")}`);
  console.log(`   Model: claude-opus-4-8 | Target: ${POSTS_PER_RUN} posts\n`);

  // Load used topics
  const usedIds = getUsedIds();
  const remaining = ALL_TOPICS.filter((t) => !usedIds.includes(t.id));

  if (remaining.length === 0) {
    console.log("♻️  All topics used! Resetting tracking file...");
    saveUsedIds([]);
    console.log("   Run the script again to start a new cycle.");
    return;
  }

  console.log(`📋 Topics available: ${remaining.length} / ${ALL_TOPICS.length}`);

  const batch = remaining.slice(0, POSTS_PER_RUN);
  console.log(`   Generating ${batch.length} posts this run...\n`);

  // Get author_id from existing posts
  let authorId;
  try {
    authorId = process.env.SUPABASE_AUTHOR_ID || (await getAuthorId());
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < batch.length; i++) {
    const topic = batch[i];
    const prefix = `[${i + 1}/${batch.length}]`;

    console.log(`${prefix} ✍️  ${topic.title}`);

    try {
      // 1. Generate content
      const generated = await generatePost(topic);

      // 2. Build slug (ensure unique)
      let slug = generated.slug
        ? toSlug(generated.slug)
        : toSlug(generated.title);
      if (await slugExists(slug)) {
        slug = `${slug}-${Date.now()}`;
      }

      // 3. Fetch cover photo
      const coverImage = await fetchCoverPhoto(topic.unsplashQuery);

      // 4. Insert to Supabase
      await insertPost({
        title: generated.title,
        excerpt: generated.excerpt || generated.title,
        content: generated.content,
        slug,
        category: topic.category,
        tags: generated.tags || [],
        cover_image: coverImage,
        author_id: authorId,
        is_published: true,
        published_at: new Date().toISOString(),
      });

      // 5. Mark topic as used
      usedIds.push(topic.id);
      saveUsedIds(usedIds);

      success++;
      console.log(`${prefix} ✅ Published: /blog/${topic.category}/${slug}`);

      // Rate-limit: 1.5s between posts to avoid API throttling
      if (i < batch.length - 1) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    } catch (err) {
      failed++;
      console.error(`${prefix} ❌ Failed: ${err.message}`);
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`✅ Success: ${success} | ❌ Failed: ${failed}`);
  console.log(`📋 Topics remaining: ${remaining.length - success}`);
  console.log(`─────────────────────────────────────\n`);
}

main().catch((err) => {
  console.error("\n💥 Fatal error:", err.message);
  process.exit(1);
});
