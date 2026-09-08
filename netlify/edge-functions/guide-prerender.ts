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
    title: "Omra Femme Seule 2027 : Guide Complet, Conditions et Conseils",
    description: "Omra femme seule 2027 : autorisée sans mahram depuis 2021. Visa, conditions, prix (950€–2 200€), conseils d'expert pour réussir votre pèlerinage.",
    canonical: "https://omrabonsplans.fr/omra-femme-seule",
    h1: "Omra Femme Seule : Guide Complet 2027",
    intro: "Depuis 2021, l'Arabie Saoudite autorise les femmes de tout âge à effectuer l'Omra sans mahram (accompagnateur masculin), en groupe organisé via une agence agréée. Ce guide répond à toutes vos questions : conditions légales et religieuses, documents nécessaires, prix, et conseils pratiques de Farid d'Arabie, expert ayant accompagné plus de 5 000 pèlerins dont de nombreuses femmes seules.",
    sections: [
      { h2: "Les femmes seules peuvent-elles faire l'Omra ?", text: "Oui. La loi saoudienne a supprimé l'obligation du mahram pour l'Omra en 2021. Les femmes de tout âge peuvent voyager en groupe organisé avec une agence agréée par le Ministère Saoudien des Affaires Islamiques. D'un point de vue religieux, la majorité des savants maintiennent l'obligation du mahram — consultez votre référent religieux de confiance." },
      { h2: "Documents nécessaires", text: "Passeport valide 6 mois après le retour. Visa Omra inclus dans le forfait agence, ou eVisa touristique saoudien. Vaccin méningocoque ACWY obligatoire (certificat de vaccination). Aucun acte mahram requis depuis 2021 selon la réglementation saoudienne." },
      { h2: "Prix Omra femme seule 2027", text: "Basse saison (été) : 950€ à 1 400€ en chambre partagée. Hiver (déc-fév) : 1 200€ à 1 800€. Ramadan : 2 000€ à 2 800€. Ces prix incluent vol, hôtel, transferts et visa. Les agences proposent des chambres doubles ou individuelles à supplément." },
    ],
    faqs: [
      { q: "Une femme seule peut-elle faire l'Omra sans mahram ?", a: "Oui selon la loi saoudienne depuis 2021 — les femmes de tout âge peuvent partir en Omra en groupe organisé avec une agence agréée, sans mahram obligatoire légalement. D'un point de vue religieux, la majorité des savants maintiennent l'obligation du mahram. Consultez votre référent religieux." },
      { q: "Quelles agences proposent des voyages Omra pour femmes seules ?", a: "Toutes les grandes agences françaises agréées proposent des départs mixtes encadrés accessibles aux femmes seules : Tawaf, Medinvoyages, Al-Maqam, Pèlerinhajj, Omra Sounnah. Certaines proposent des groupes exclusivement féminins pendant le Ramadan." },
      { q: "Quel est le prix d'une Omra femme seule ?", a: "Entre 950€ et 2 800€ selon la période et le standing de l'hôtel. En basse saison (été), les forfaits démarrent à 950€ en chambre partagée. En chambre individuelle, comptez 300 à 500€ de supplément. Pendant le Ramadan, les prix doublent par rapport à la basse saison." },
    ],
  },

  "/conditions-omra": {
    title: "Conditions pour Faire l'Omra 2027 : Qui Peut Partir ?",
    description: "Toutes les conditions pour faire l'Omra en 2027 : conditions religieuses, documents obligatoires, règles pour les femmes seules, vaccins et conditions de santé.",
    canonical: "https://omrabonsplans.fr/conditions-omra",
    h1: "Conditions pour Faire l'Omra 2027",
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
    title: "Quand partir en Omra ? Meilleures Périodes & Prix 2027",
    description: "Découvrez la meilleure période pour partir en Omra selon votre budget : Ramadan, hiver, hors saison. Comparatif des prix et conseils pour choisir la bonne date en 2027.",
    canonical: "https://omrabonsplans.fr/quand-partir-omra",
    h1: "Quand partir en Omra ? Guide des Meilleures Périodes 2027",
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
    title: "Omra Tout Compris 2027 : Forfaits et Meilleures Offres",
    description: "Omra tout compris 2027 : forfaits all-inclusive, comparatif agences, prix (1 200€-4 000€). Vol, hôtel, transport, repas inclus. Réservez le meilleur package.",
    canonical: "https://omrabonsplans.fr/omra-tout-compris",
    h1: "Omra Tout Compris 2027 : Guide Complet et Meilleures Offres",
    intro: "Un forfait Omra tout compris inclut tout ce dont vous avez besoin pour votre pèlerinage : vol aller-retour, hébergement à La Mecque et Médine, pension complète, transferts, encadrement francophone et visa. C'est la solution idéale pour les primo-pèlerins, les personnes seules et tous ceux qui souhaitent se concentrer sur leur démarche spirituelle sans contrainte logistique.",
    sections: [
      { h2: "Ce qui est inclus dans un forfait tout compris", text: "Vol international aller-retour depuis la France. Hébergement 3 à 5 étoiles à La Mecque et Médine. Petit-déjeuner et dîner (pension complète). Transport terrestre en bus climatisé. Encadrement par guide francophone. Visa Omra. Transferts aéroport-hôtel. Assurance de base." },
      { h2: "Prix des forfaits Omra tout compris 2027", text: "Économique (3★) : 1 200 à 1 500€. Standard (4★) : 1 800 à 2 500€. Confort (4-5★, <500m du Haram) : 2 500 à 3 500€. Luxury (5★ vue Kaaba) : 3 500 à 4 000€+. Ces prix sont valables hors Ramadan pour un séjour de 10 nuits." },
      { h2: "Tout compris vs à la carte", text: "Tout compris : idéal pour primo-pèlerins, personnes seules, seniors — tranquillité d'esprit garantie. À la carte : pour voyageurs indépendants et groupes autonomes — 20 à 40% moins cher mais demande plus d'organisation. Notre comparateur vous permet de trouver la meilleure offre selon votre profil." },
    ],
    faqs: [
      { q: "Qu'est-ce que la Omra tout compris ?", a: "La Omra tout compris est un forfait où tous les frais principaux sont inclus : vol international, hébergement à La Mecque et Médine, pension complète, transport terrestre, encadrement francophone, visa Omra et assurance. Le pèlerin n'a à payer que les repas du midi et ses dépenses personnelles." },
      { q: "Quel est le prix moyen de la Omra tout compris ?", a: "De 1 200€ (économique 3★, basse saison) à 4 000€+ (luxury 5★). La majorité des packages se situent entre 1 800 et 2 500€ pour un hôtel 4 étoiles hors Ramadan. Pendant le Ramadan, les tarifs augmentent de 50 à 100%." },
      { q: "Peut-on voyager seul en tout compris ?", a: "Oui, absolument. La Omra tout compris est même recommandée pour les pèlerins solos. Vous rejoignez un groupe constitué par l'agence, avec encadrement dès l'aéroport français. Vous n'êtes jamais seul et toute la logistique est gérée pour vous." },
    ],
  },

  "/meilleure-agence-omra": {
    title: "Meilleure Agence Omra 2027 : Classement et Guide de Choix",
    description: "Meilleure agence omra 2027 : classement Tawaf, Medinvoyages, Al-Maqam. Critères de choix et questions essentielles avant de réserver votre pèlerinage.",
    canonical: "https://omrabonsplans.fr/meilleure-agence-omra",
    h1: "Meilleure Agence Omra 2027 : Guide de Choix et Classement",
    intro: "Choisir la bonne agence Omra est l'une des décisions les plus importantes de votre préparation. D'après les avis Google de milliers de pèlerins français, Tawaf (4,8/5), Medinvoyages (4,7/5) et Al-Maqam (4,6/5) se distinguent parmi les meilleures agences agréées en France. Voici notre guide complet pour bien choisir.",
    sections: [
      { h2: "Top 5 meilleures agences Omra 2027", text: "1. Tawaf (4,8/5 — 520 avis) : sérieux reconnu, encadrement excellent. 2. Medinvoyages (4,7/5 — 380 avis) : meilleur rapport qualité-prix. 3. Al-Maqam (4,6/5 — 310 avis) : hôtels 4-5 étoiles proches du Haram. 4. Omra Discount (4,5/5) : meilleurs prix dès 999€. 5. Pèlerinhajj (4,6/5) : expertise Hajj et séjours longs." },
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
    title: "Définition de l'Omra : Rites, Signification et Différences Hajj",
    description: "Définition complète de l'Omra : signification, rites (Ihram, Tawaf, Sa'i), différences avec le Hajj, et pourquoi l'Omra est le 'petit pèlerinage'.",
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
    title: "Prix Omra 2027 : Tarifs par Période, Agence et Standing",
    description: "Prix Omra 2027 : de 800€ à 5 000€+ selon la période et l'hôtel. Comparatif des tarifs par saison, agence et niveau de confort.",
    canonical: "https://omrabonsplans.fr/prix-omra-2026",
    h1: "Prix Omra 2027 : Guide Complet des Tarifs",
    intro: "Le prix d'une Omra en 2027 varie de 800€ à 5 000€+ selon la période de départ, le niveau de l'hôtel et la durée du séjour. Ce guide vous donne une vision complète des tarifs pratiqués par les agences françaises agréées pour vous aider à trouver le meilleur rapport qualité-prix.",
    sections: [
      { h2: "Prix Omra 2027 par période", text: "Basse saison (Mouharram, Safar) : 800-1 500€. Hiver (déc-fév) : 1 200-2 500€. Sha'ban (avant Ramadan) : 1 500-2 500€. Ramadan (début) : 2 000-3 500€. Ramadan (10 derniers jours) : 2 500-5 000€." },
      { h2: "Prix par niveau d'hôtel", text: "Hôtel 3★ (1-2 km du Haram) : 800-1 500€. Hôtel 4★ (<1 km) : 1 500-2 500€. Hôtel 4-5★ (<500m) : 2 500-3 500€. Hôtel 5★ vue Kaaba : 3 500-5 000€+. Tous ces prix incluent vol, hôtel, transferts et visa." },
    ],
    faqs: [
      { q: "Quel est le prix d'une Omra en 2027 ?", a: "Le prix d'une Omra en 2027 varie de 800€ (basse saison, hôtel 3★) à 5 000€+ (Ramadan, hôtel 5★ vue Kaaba). En moyenne, un forfait de qualité se situe entre 1 500 et 2 500€ hors Ramadan. Notre comparateur affiche en temps réel les tarifs de 20 agences agréées." },
      { q: "Pourquoi le prix de l'Omra varie-t-il autant ?", a: "Le prix dépend de 3 facteurs : la période (Ramadan coûte 50-100% plus cher), le niveau de l'hôtel (la distance au Haram impacte fortement le tarif) et la durée (10 à 21 nuits). Un hôtel à 500m du Haram coûte 2 à 3 fois plus cher qu'un hôtel à 2 km." },
    ],
  },

  "/rites-omra": {
    title: "Rites de l'Omra : Les 4 Étapes Expliquées Pas à Pas",
    description: "Les 4 rites de l'Omra expliqués : Ihram, Tawaf, Sa'i et Halq/Taqsir. Guide complet avec les prières, gestes et conseils pratiques pour accomplir l'Omra correctement.",
    canonical: "https://omrabonsplans.fr/rites-omra",
    h1: "Les 4 Rites de l'Omra : Guide Complet Pas à Pas",
    intro: "L'Omra comprend 4 rites fondamentaux à accomplir dans l'ordre : l'Ihram (état de consécration), le Tawaf (circumambulation autour de la Kaaba), le Sa'i (marche entre Safa et Marwa) et la coupe des cheveux (Halq ou Taqsir). Ce guide vous explique chaque étape avec les prières et gestes à accomplir.",
    sections: [
      { h2: "1. L'Ihram : l'état de consécration", text: "L'Ihram s'adopte au Miqat, la frontière sacrée délimitant l'accès à La Mecque. Pour les hommes : deux pièces de tissu blanc non cousu. Pour les femmes : tenue pudique couvrant tout le corps sauf le visage et les mains. On prononce le Talbiyah : 'Labbayka Allahumma labbayk...' L'Ihram interdit certains actes : relations conjugales, parfum, coupe de cheveux/ongles, chasse." },
      { h2: "2. Le Tawaf : 7 tours autour de la Kaaba", text: "Le Tawaf consiste en 7 circumambulations autour de la Kaaba dans le sens antihoraire. On commence et finit face à la Pierre Noire (Hajr al-Aswad). Les 3 premiers tours se font en courant légèrement (raml) pour les hommes. On peut toucher ou embrasser la Pierre Noire ou faire un signe de la main. Durée : 30 à 90 minutes selon l'affluence." },
      { h2: "3. Le Sa'i : marche entre Safa et Marwa", text: "Le Sa'i commémore la course d'Hajar (femme d'Ibrahim) à la recherche d'eau pour son fils Ismaël. Il consiste en 7 allers-retours entre les deux collines de Safa et Marwa, sur environ 450m. On commence à Safa et finit à Marwa. Les hommes courent entre les deux repères verts. Durée : 45 à 60 minutes." },
      { h2: "4. Halq ou Taqsir : la coupe des cheveux", text: "Dernier rite de l'Omra : le rasage complet (Halq, recommandé pour les hommes) ou la coupe d'au moins 2,5 cm de cheveux (Taqsir, obligatoire pour les femmes). Cet acte marque la sortie de l'état d'Ihram. Les hommes rasent la tête entière ou coupent uniformément. Après cela, toutes les restrictions de l'Ihram sont levées." },
    ],
    faqs: [
      { q: "Combien de temps dure l'Omra ?", a: "Les 4 rites de l'Omra prennent entre 3 et 6 heures en fonction de l'affluence. Le Tawaf : 30-90 min. La prière de 2 raka'at derrière Maqam Ibrahim : 10 min. Le Sa'i : 45-60 min. La coupe des cheveux : 10-15 min. En période de forte affluence (Ramadan), comptez jusqu'à 8 heures." },
      { q: "Peut-on faire l'Omra plusieurs fois dans la même journée ?", a: "Oui, l'Omra peut être répétée plusieurs fois lors d'un séjour. La plupart des savants recommandent une seule Omra par voyage, mais rien n'interdit d'en faire plusieurs. Entre deux Omras, on retourne au Miqat pour reprendre l'Ihram. La pratique varie selon les écoles juridiques." },
      { q: "Que faire si on commet une erreur pendant l'Omra ?", a: "Si un rite est oublié ou mal exécuté, renseignez-vous auprès de l'encadrant religieux de votre groupe. Certaines erreurs se corrigent par une Fidya (offrande expiatoire), d'autres en répétant le rite. Une Omra accomplie avec sincérité, même imparfaite, est acceptée par Allah selon la majorité des savants — l'intention prime." },
    ],
  },

  "/omra-debutant": {
    title: "Omra pour Débutant : Guide Complet Première Omra 2027",
    description: "Guide Omra débutant 2027 : comment préparer sa première Omra, les erreurs à éviter, le budget, les documents, et les conseils de pèlerins expérimentés.",
    canonical: "https://omrabonsplans.fr/omra-debutant",
    h1: "Omra pour Débutant : Tout Savoir pour sa Première Omra",
    intro: "La première Omra est souvent un moment de grand émoi et de nombreuses interrogations. Ce guide complet vous accompagne de la décision jusqu'au retour : documents, budget, préparation spirituelle, déroulement des rites, erreurs à éviter et conseils pratiques issus de l'expérience de milliers de primo-pèlerins.",
    sections: [
      { h2: "Les étapes de préparation (6 mois avant)", text: "1. Fixer la période et le budget (800-2 500€ selon la saison). 2. Choisir une agence agréée ATOUT FRANCE avec minimum 300 avis Google. 3. Renouveler le passeport si nécessaire (valide 6 mois après retour). 4. Faire le vaccin méningocoque ACWY (obligatoire). 5. Commencer la préparation spirituelle et religieuse. 6. Réserver 3 à 6 mois à l'avance en haute saison." },
      { h2: "Les erreurs classiques des débutants", text: "Ne pas s'entraîner physiquement (prévoyez 10-15 km/jour de marche). Ne pas s'hydrater suffisamment (chaleur de 35-45°C). Vouloir tout faire en une seule nuit sans repos. Oublier les documents dans l'hôtel. Porter des vêtements inadaptés à l'Ihram. Se séparer du groupe sans informer l'encadrant. Ne pas mémoriser les prières et invocations essentielles." },
      { h2: "Budget pour une première Omra", text: "Forfait agence (tout compris) : 1 200-2 500€. Dépenses personnelles sur place : 300-600€ (repas du midi, cadeaux, Zamzam). Vaccin méningocoque : 30-50€. Total estimé : 1 500-3 100€ pour un séjour de 10-14 nuits. Évitez les forfaits sous 1 200€ pour une première Omra — l'encadrement est crucial." },
    ],
    faqs: [
      { q: "Par où commencer pour organiser sa première Omra ?", a: "1. Fixez votre période et budget. 2. Choisissez une agence agréée ATOUT FRANCE avec de bons avis. 3. Renouvelez votre passeport si nécessaire. 4. Faites le vaccin méningocoque ACWY. 5. Commencez la préparation spirituelle (mémoriser les prières, apprendre les rites). Notre comparateur vous permet de trouver les meilleures offres en quelques clics." },
      { q: "Combien faut-il de temps pour préparer une Omra ?", a: "Idéalement 3 à 6 mois pour une première Omra : 1 à 2 mois pour choisir l'agence et réserver, 2 à 3 mois pour la préparation spirituelle et physique. En basse saison, vous pouvez partir avec 1 mois de préparation. Pendant le Ramadan, réservez 6 à 9 mois à l'avance car les places sont limitées." },
      { q: "Quelle agence choisir pour sa première Omra ?", a: "Pour une première Omra, privilégiez une agence avec encadrement francophone, un guide religieux compétent et de bons avis clients (300+ avis, 4,3+/5 sur Google). Tawaf, Medinvoyages et Al-Maqam sont reconnues pour leur qualité d'encadrement. Le prix ne doit pas être le seul critère — l'accompagnement est essentiel pour un débutant." },
    ],
  },

  "/visa-omra-france": {
    title: "Visa Omra France 2027 : Comment l'Obtenir, Prix et Délais",
    description: "Visa Omra France 2027 : via agence agréée ou eVisa touristique saoudien. Prix (110-150€), délais, documents requis et guide étape par étape pour obtenir votre visa.",
    canonical: "https://omrabonsplans.fr/visa-omra-france",
    h1: "Visa Omra France 2027 : Guide Complet pour l'Obtenir",
    intro: "Pour accomplir l'Omra depuis la France, vous avez besoin d'un visa pour entrer en Arabie Saoudite. Il existe deux options : le visa Omra délivré via une agence agréée (inclus dans la plupart des forfaits), ou le visa touristique saoudien (eVisa) obtenu en ligne. Ce guide vous explique les deux options, leurs avantages, prix et délais.",
    sections: [
      { h2: "Option 1 : Visa Omra via agence agréée", text: "Le visa Omra est obtenu par votre agence agréée par le Ministère Saoudien des Affaires Islamiques. Il est généralement inclus dans le forfait. L'agence gère toutes les démarches administratives. Délai : 1 à 4 semaines avant le départ. Documents fournis à l'agence : passeport valide 6 mois, photo d'identité, certificat de vaccination méningocoque ACWY." },
      { h2: "Option 2 : eVisa touristique saoudien", text: "Depuis 2019, les ressortissants français peuvent obtenir un visa touristique électronique sur visa.visitsaudi.com. Prix : environ 110€ (frais de visa) + 25€ d'assurance obligatoire. Délai : 24 à 72 heures. Validité : 1 an, séjours multiples, 90 jours maximum. Ce visa permet aussi d'accomplir les rites de l'Omra, avec plus de flexibilité qu'un visa Omra classique." },
      { h2: "Documents nécessaires pour le visa Omra", text: "Passeport valide au moins 6 mois après la date de retour. 1 photo d'identité récente (fond blanc, 3,5x4,5 cm). Certificat de vaccination méningocoque ACWY (administré 10 jours avant départ). Pour les couples : acte de mariage peut être demandé. Pour les femmes seules : le mahram n'est plus légalement requis depuis 2021." },
    ],
    faqs: [
      { q: "Comment obtenir un visa pour l'Omra depuis la France ?", a: "Deux options : 1) Via une agence agréée — le visa est inclus dans le forfait, l'agence gère tout. 2) Via le site visa.visitsaudi.com — eVisa touristique à 110€ + 25€ d'assurance, obtenu en 24-72h, valable 1 an. Le vaccin méningocoque ACWY est obligatoire dans les deux cas." },
      { q: "Quel est le prix du visa Omra ?", a: "Le visa Omra via agence est généralement inclus dans le forfait (sa valeur est de 80-120€). L'eVisa touristique saoudien coûte environ 135€ (110€ de visa + 25€ d'assurance obligatoire). À ces frais s'ajoutent les frais de service si vous passez par un intermédiaire." },
      { q: "Faut-il un mahram pour obtenir le visa Omra pour une femme ?", a: "Non. Depuis 2021, l'Arabie Saoudite n'exige plus de mahram pour les femmes souhaitant accomplir l'Omra. Les femmes de tout âge peuvent obtenir le visa seules et voyager en groupe organisé avec une agence agréée. Vérifiez les conditions spécifiques auprès de votre agence ou sur le site de l'ambassade d'Arabie Saoudite." },
    ],
  },

  "/guide-omra-pas-chere": {
    title: "Omra Pas Chère 2027 : Astuces pour Payer Moins Cher",
    description: "Guide Omra pas chère 2027 : 8 astuces pour économiser 30-50% sur votre Omra. Meilleures périodes, comparaison agences, hôtels, vols et erreurs à éviter.",
    canonical: "https://omrabonsplans.fr/guide-omra-pas-chere",
    h1: "Omra Pas Chère 2027 : 8 Astuces pour Économiser",
    intro: "Il est tout à fait possible d'accomplir l'Omra avec un budget limité. En choisissant la bonne période, en comparant plusieurs agences et en évitant les erreurs classiques, vous pouvez réduire le coût de votre Omra de 30 à 50%. Voici 8 astuces concrètes de pèlerins expérimentés.",
    sections: [
      { h2: "Astuce 1 : Partez en basse saison", text: "Les mois de Mouharram et Safar (juillet-septembre) offrent les prix les plus bas : dès 800€ tout compris. Évitez le Ramadan (2x plus cher), les vacances scolaires de Noël et les week-ends prolongés. La chaleur est plus forte (40-45°C) mais les foules sont réduites." },
      { h2: "Astuce 2 : Comparez au moins 5 agences", text: "Pour des dates et un hôtel identiques, les prix peuvent varier de 300 à 800€ d'une agence à l'autre. Notre comparateur affiche en temps réel les tarifs de 20+ agences agréées. Ne réservez jamais la première offre sans comparer. Demandez un devis détaillé et lisez les conditions d'annulation." },
      { h2: "Astuces 3 à 8 résumées", text: "3. Choisissez un hôtel à 1-2 km du Haram (2x moins cher). 4. Optez pour chambre quadruple ou dortoir (économie 200-400€). 5. Réservez 4-6 mois à l'avance pour les meilleures offres early bird. 6. Voyagez en semaine (vols mardi/mercredi 10-15% moins chers). 7. Comparez vol inclus vs vol séparé (parfois 150-200€ d'économie). 8. Négociez un supplément chambre individuelle plutôt qu'un package complet." },
    ],
    faqs: [
      { q: "Quel est le prix minimum pour faire l'Omra ?", a: "En basse saison (Mouharram, Safar), les forfaits démarrent à 800€ en chambre partagée. Avec des frais personnels de 200-300€, comptez 1 000-1 100€ minimum. En dessous, méfiez-vous : des économies excessives impliquent souvent des compromis importants sur l'hôtel, l'encadrement ou les conditions de voyage." },
      { q: "Quelle période est la moins chère pour l'Omra ?", a: "Les mois islamiques de Mouharram et Safar (correspondant en 2027 à environ juillet-septembre) sont les moins chers, avec des forfaits dès 800€. Suivent Rabi' al-Awwal et Rabi' al-Thani. Le Ramadan est la période la plus chère (2 000-5 000€). Les vacances scolaires de Noël et février sont 40-60% plus chères que la basse saison." },
      { q: "Comment comparer les agences Omra ?", a: "Notre comparateur omrabonsplans.fr affiche en temps réel les offres de 20+ agences agréées ATOUT FRANCE. Comparez les prix, la distance hôtel-Haram, le nombre de nuits à La Mecque et Médine, les repas inclus et les avis clients. Demandez toujours un devis détaillé et vérifiez les conditions d'annulation avant de réserver." },
    ],
  },

  "/omra-ramadan-2027": {
    title: "Omra Ramadan 2027 : Prix, Réservation et Conseils",
    description: "Omra Ramadan 2027 : dates (17 février - 18 mars 2027), prix (1 800-5 000€), réservation, et conseils pour les 10 derniers jours. Guide complet pour partir pendant le Ramadan.",
    canonical: "https://omrabonsplans.fr/omra-ramadan-2027",
    h1: "Omra Ramadan 2027 : Guide Complet et Meilleures Offres",
    intro: "Le Ramadan 2027 débutera vers le 17 février et se terminera vers le 18 mars (sous réserve de l'observation de la lune). C'est la période la plus méritoire pour accomplir l'Omra : le Prophète Muhammad (ﷺ) a dit qu'une Omra pendant le Ramadan équivaut à un Hajj. Ce guide vous aide à planifier votre Omra Ramadan 2027.",
    sections: [
      { h2: "Dates du Ramadan 2027", text: "Début estimé : 17 février 2027. Fin estimée : 18 mars 2027. Les 10 derniers jours (Laylat al-Qadr) : 9-18 mars 2027. Ces dates sont provisoires et seront confirmées par l'observation de la nouvelle lune. Prévoyez une flexibilité de ±1 jour dans vos réservations." },
      { h2: "Prix Omra Ramadan 2027", text: "Début de Ramadan (17 fév - 3 mars) : 1 800-3 500€. Mi-Ramadan : 2 500-4 000€. 10 derniers jours (9-18 mars) : 3 000-5 000€+. Ces prix sont 1,5 à 2 fois plus élevés qu'en dehors du Ramadan. Réservez impérativement 6 à 9 mois à l'avance — les places partent dès l'automne." },
      { h2: "Conseils pour l'Omra pendant le Ramadan", text: "Réservez avant octobre 2026 pour les meilleures places. Prévoyez un hôtel proche du Haram (<500m) pour les 10 derniers jours. Emportez des médicaments anti-fatigue et vitamines. Hydratez-vous abondamment entre le ftour et le suhoor. Les foules atteignent 2-3 millions de pèlerins — soyez patient et organisé." },
    ],
    faqs: [
      { q: "Quand a lieu le Ramadan 2027 ?", a: "Le Ramadan 2027 est estimé du 17 février au 18 mars 2027 (sous réserve de l'observation lunaire). Les 10 derniers jours, période de Laylat al-Qadr la plus valorisée spirituellement, seront du 9 au 18 mars 2027. Ces dates sont calculées à partir du calendrier lunaire islamique et peuvent varier d'un jour." },
      { q: "Combien coûte l'Omra pendant le Ramadan 2027 ?", a: "Entre 1 800€ (début Ramadan, hôtel 3★) et 5 000€+ (10 derniers jours, hôtel 5★). La majorité des forfaits de qualité pour les 10 derniers jours se situent entre 3 000 et 4 500€. Les prix sont 1,5 à 2 fois plus élevés qu'en dehors du Ramadan. Réservez au minimum 6 mois à l'avance." },
      { q: "Vaut-il mieux partir au début ou à la fin du Ramadan ?", a: "Spirituellement, les 10 derniers jours sont les plus méritoires (Laylat al-Qadr). Pratiquement, le début du Ramadan est moins cher et moins chargé, tout en étant spirituellement très valorisé. Si votre budget est limité, les 2e et 3e semaines offrent un bon équilibre. La règle d'or : la nuit est plus apaisante pour le Tawaf — profitez-en." },
    ],
  },

  "/hajj-2027": {
    title: "Hajj 2027 : Guide Complet, Dates (26-31 mai), Prix et Inscription",
    description: "Hajj 2027 : dates du 26 au 31 mai 2027 (Arafat 27 mai, 8-13 Dhul Hijja 1448), prix depuis la France (5 000-15 000€), inscription Nusuk et guide complet des rites.",
    canonical: "https://omrabonsplans.fr/hajj-2027",
    h1: "Hajj 2027 : Guide Complet du Grand Pèlerinage",
    intro: "Le Hajj 2027 aura lieu du 26 au 31 mai 2027 (8-13 Dhul Hijja 1448 AH). Cinquième pilier de l'Islam, le Hajj est obligatoire une fois dans la vie pour tout musulman physiquement et financièrement capable. Ce guide complet vous accompagne de l'inscription jusqu'au retour.",
    sections: [
      { h2: "Dates du Hajj 2027", text: "Ihram à Mina : 26 mai 2027. Arafat (Jour crucial, 9 Dhul Hijja) : 27 mai 2027. Aïd al-Adha (Sacrifice, 10 Dhul Hijja) : 28 mai 2027. Lapidation Jamarat : 28-31 mai 2027. Tawaf d'adieu : 31 mai 2027. Ces dates sont estimées (8-13 Dhul Hijja 1448) et seront confirmées officiellement par l'Arabie Saoudite." },
      { h2: "Prix du Hajj 2027 depuis la France", text: "Forfait économique (4★) : 5 000-7 000€. Forfait standard (4-5★) : 7 000-10 000€. Forfait confort (5★) : 10 000-13 000€. Forfait luxury (5★ vue Kaaba) : 13 000-15 000€+. Ces prix incluent vol, hébergement à La Mecque, Médine, Mina et Arafat, repas, transport et encadrement." },
      { h2: "Comment s'inscrire pour le Hajj 2027", text: "La France dispose d'un quota de pèlerins alloué par l'Arabie Saoudite. Les inscriptions se font via les agences agréées par le Ministère Saoudien des Affaires Islamiques via le portail Nusuk. Inscrivez-vous dès maintenant pour le Hajj 2027 — les places sont très limitées (quota par pays) et les meilleures agences ferment leurs listes rapidement." },
    ],
    faqs: [
      { q: "Quand a lieu le Hajj 2027 ?", a: "Le Hajj 2027 aura lieu du 26 au 31 mai 2027 (8-13 Dhul Hijja 1448 AH). La journée d'Arafat, la plus importante, est le 27 mai 2027. L'Aïd al-Adha (Fête du Sacrifice) est le 28 mai 2027. Ces dates sont estimées et seront confirmées officiellement par l'Arabie Saoudite." },
      { q: "Combien coûte le Hajj 2027 depuis la France ?", a: "Entre 5 000€ et 15 000€+ selon le standing. Un forfait de qualité se situe entre 7 000 et 10 000€ pour un hôtel 4-5★ à La Mecque et Médine. Les prix varient selon la distance au Haram, les hébergements à Mina et l'encadrement. Comparez impérativement plusieurs agences agréées." },
      { q: "Quelle est la différence entre le Hajj et l'Omra ?", a: "Le Hajj est le 5e pilier de l'Islam, obligatoire une fois dans la vie, et se déroule uniquement du 8 au 13 Dhul Hijja. Il inclut des rites à Arafat, Muzdalifa et Mina (lapidation). L'Omra est un pèlerinage recommandé, faisable toute l'année, plus court (2-4 heures de rites) et bien moins onéreux (800-5 000€ vs 5 000-15 000€)." },
    ],
  },

  "/guide-hajj-4-ecoles": {
    title: "Guide Hajj 4 Écoles Juridiques : Hanafi, Maliki, Shafi'i, Hanbali",
    description: "Guide complet du Hajj selon les 4 écoles juridiques islamiques : Hanafi, Maliki, Shafi'i et Hanbali. Différences dans les rites, les obligations et les recommandations.",
    canonical: "https://omrabonsplans.fr/guide-hajj-4-ecoles",
    h1: "Hajj selon les 4 Écoles Juridiques : Guide Comparatif",
    intro: "Les 4 écoles juridiques islamiques (madhabs) — Hanafi, Maliki, Shafi'i et Hanbali — s'accordent sur les obligations fondamentales du Hajj tout en différant sur certains points de détail. Ce guide comparatif vous aide à comprendre ces différences et à accomplir le Hajj selon votre école de jurisprudence.",
    sections: [
      { h2: "Les piliers du Hajj (consensus des 4 écoles)", text: "Toutes les écoles s'accordent sur : l'Ihram (état de consécration). La station d'Arafat (27 mai 2027). Le Tawaf al-Ifada (circumambulation autour de la Kaaba). Le Sa'i entre Safa et Marwa. La coupe des cheveux. Ces 5 piliers sont obligatoires selon les 4 madhabs — leur absence invalide le Hajj." },
      { h2: "Principales différences entre les 4 écoles", text: "Ihram : les Hanafis acceptent de porter l'Ihram avant le Miqat ; les Malikis recommandent de le mettre exactement au Miqat. Nuit à Muzdalifa : obligatoire selon Hanafi et Maliki, Sunnah selon Shafi'i. Sa'i : obligation selon Hanafi, Maliki et Shafi'i ; pilier selon Hanbali. Lapidation : les écoles diffèrent sur les jours et l'heure valide." },
      { h2: "Conseils pratiques selon votre école", text: "Hanafi (majoritaire en Turquie, Asie centrale, Inde, Pakistan) : suivez les recommandations de l'Association Hanafi agréée. Maliki (majoritaire en Afrique du Nord et Ouest) : de nombreuses agences françaises proposent des encadrants malikis. Shafi'i (Égypte, Asie du Sud-Est) et Hanbali (Arabie Saoudite) : les guides saoudiens suivent généralement l'école Hanbali." },
    ],
    faqs: [
      { q: "Est-ce que l'école juridique change les rites du Hajj ?", a: "Les piliers fondamentaux du Hajj sont les mêmes pour toutes les écoles (Ihram, Arafat, Tawaf, Sa'i, coupe de cheveux). Les différences portent sur des points secondaires : moment exact de l'Ihram, caractère obligatoire ou recommandé de la nuit à Muzdalifa, modalités de la lapidation, etc. Pour un pèlerin non spécialiste, ces différences sont mineures." },
      { q: "Quelle école juridique suivre pendant le Hajj ?", a: "En pratique, la majorité des pèlerins suivent leur école traditionnelle. En Arabie Saoudite, les autorités religieuses sont Hanbali. Les agences françaises proposent des guides de différentes écoles. Si vous n'avez pas de madhab spécifique, suivez les instructions de votre guide — les 4 écoles sont toutes valides et reconnues." },
      { q: "Quelles sont les 4 écoles juridiques islamiques ?", a: "Les 4 madhabs sunnites sont : Hanafi (fondé par l'Imam Abu Hanifa, majoritaire en Turquie, Asie centrale, Inde) ; Maliki (Imam Malik, majoritaire en Afrique) ; Shafi'i (Imam al-Shafi'i, Égypte, Asie du Sud-Est) ; Hanbali (Imam Ahmad ibn Hanbal, Arabie Saoudite). Toutes sont valides — elles représentent des interprétations légitimes du Coran et de la Sunnah." },
    ],
  },

  "/liste-bagages-omra": {
    title: "Liste Bagages Omra 2027 : Quoi Emporter (Checklist Complète)",
    description: "Liste bagages Omra complète : vêtements Ihram, médicaments, documents, accessoires spirituels. Checklist téléchargeable pour ne rien oublier pour votre Omra 2027.",
    canonical: "https://omrabonsplans.fr/liste-bagages-omra",
    h1: "Liste Bagages Omra 2027 : La Checklist Complète",
    intro: "Cette checklist complète vous aide à préparer votre valise pour l'Omra sans rien oublier d'essentiel. Elle couvre les documents officiels, les vêtements pour l'Ihram, les médicaments recommandés, les accessoires spirituels et les produits du quotidien adaptés aux conditions de La Mecque.",
    sections: [
      { h2: "Documents obligatoires", text: "Passeport original (valide 6 mois après retour). Billet d'avion imprimé et électronique. Voucher hôtel. Certificat de vaccination méningocoque ACWY. Assurance voyage. Acte de mariage (si couple, parfois demandé). Photocopies de tous les documents (à conserver séparément). Numéros d'urgence de l'agence et des autorités françaises en Arabie Saoudite." },
      { h2: "Vêtements pour l'Ihram (hommes)", text: "2 paires de draps blancs non cousus pour l'Ihram (prévoyez toujours 2 sets). Sandales ouvertes sans couture sur le dessus du pied. Vêtements normaux pour le reste du séjour (5-7 tenues légères). Chaussettes et sous-vêtements (non portés pendant l'Ihram). Ceinture ou sac banane pour les documents." },
      { h2: "Médicaments et santé recommandés", text: "Médicaments anti-diarrhée (Smecta, Imodium). Anti-douleurs (paracétamol, ibuprofène). Pommade anti-ampoules (pieds). Crème solaire SPF 50+. Spray nasal pour la sécheresse. Vitamine C et complexe vitaminique. Masque chirurgical (foules importantes). Médicaments personnels en quantité suffisante avec ordonnance." },
    ],
    faqs: [
      { q: "Que mettre dans sa valise pour l'Omra ?", a: "L'essentiel : passeport + certificat vaccin méningocoque + billets. Pour l'Ihram : 2 sets de draps blancs non cousus + sandales (hommes). Vêtements légers pour 10-14 jours. Médicaments : anti-diarrhée, anti-douleurs, pommade pieds, crème solaire. Accessoires : chapelet (Misbaha), livre de dou'as, chargeur adapté (prise saoudienne = Type G, identique UK)." },
      { q: "Quelle est la limite de bagages pour l'Omra ?", a: "Cela dépend de votre compagnie aérienne. Saudi Arabian Airlines et Air Arabia : généralement 23 kg en soute + 7 kg en cabine. Air France et compagnies européennes : 23 kg. Certains forfaits incluent 2 bagages en soute. Vérifiez les conditions spécifiques de votre billet. En cabine, les liquides sont limités à 100ml par contenant." },
      { q: "Peut-on emporter de l'eau de Zamzam de La Mecque ?", a: "Oui. L'Arabie Saoudite autorise les pèlerins à emporter de l'eau Zamzam en soute (pas en cabine — liquides interdits). Vous pouvez prendre jusqu'à 5 litres dans un bidon prévu à cet effet. Plusieurs agences organisent la livraison de Zamzam en France. Il est également distribué gratuitement aux pèlerins dans les mosquées." },
    ],
  },

  "/10-derniers-jours-ramadan": {
    title: "10 Derniers Jours du Ramadan 2027 à La Mecque : Guide Complet",
    description: "Omra pendant les 10 derniers jours du Ramadan 2027 (9-18 mars) : Laylat al-Qadr, prix (3 000-5 000€), réservation et conseils pour cette période spirituelle exceptionnelle.",
    canonical: "https://omrabonsplans.fr/10-derniers-jours-ramadan",
    h1: "10 Derniers Jours du Ramadan 2027 à La Mecque",
    intro: "Les 10 derniers jours du Ramadan 2027 (estimés du 9 au 18 mars 2027) sont la période la plus sacrée de l'année islamique. Laylat al-Qadr, la Nuit du Destin, se trouve parmi ces nuits — accomplir l'Omra ou la prière à La Mecque pendant cette période est d'une valeur spirituelle incomparable.",
    sections: [
      { h2: "Laylat al-Qadr : la Nuit du Destin", text: "Laylat al-Qadr est mentionnée dans le Coran comme 'meilleure que mille mois' (Sourate Al-Qadr). Elle se trouve dans l'une des nuits impaires des 10 derniers jours : 21e, 23e, 25e, 27e ou 29e nuit du Ramadan 2027. Être en prière à la Kaaba pendant cette nuit est considéré comme l'une des plus grandes grâces qu'un musulman peut recevoir." },
      { h2: "Organiser son séjour pour les 10 derniers jours", text: "Réservez impérativement avant octobre 2026. Optez pour un hôtel à moins de 500m du Haram — les déplacements nocturnes sont constants. Prévoyez 5-7 nuits minimum pour couvrir plusieurs nuits impaires. Le tarif varie de 3 000 à 5 000€ pour cette période. Les places sont extrêmement limitées et parties des mois à l'avance." },
      { h2: "Conseils pratiques", text: "Dormez le jour pour prier la nuit. Emportez des dates, eau et snacks légers pour les longues nuits de prière. Un tapis de prière pliable est indispensable. Protégez-vous de la foule : arrivez tôt le soir au Haram. L'I'tikaf (retraite spirituelle de 10 jours dans la mosquée) est pratiqué par de nombreux pèlerins — demandez à votre agence si possible." },
    ],
    faqs: [
      { q: "Quand sont les 10 derniers jours du Ramadan 2027 ?", a: "Les 10 derniers jours du Ramadan 2027 sont estimés du 9 au 18 mars 2027 (sous réserve de confirmation par l'observation lunaire). Laylat al-Qadr se cherche dans les nuits impaires : 21e (9 mars), 23e (11 mars), 25e (13 mars), 27e (15 mars) et 29e (17 mars) nuit du Ramadan 2027." },
      { q: "Combien coûte l'Omra pendant les 10 derniers jours du Ramadan 2027 ?", a: "Entre 3 000 et 5 000€+ pour un séjour de 7-10 nuits. Les hôtels proches du Haram (<500m) sont les plus demandés et les plus chers. Réservez dès maintenant — les places pour cette période s'épuisent généralement en octobre-novembre, soit 4 à 5 mois avant le Ramadan." },
      { q: "Peut-on faire l'I'tikaf en France pendant les 10 derniers jours ?", a: "Oui, l'I'tikaf peut être pratiqué dans n'importe quelle mosquée, pas nécessairement à La Mecque. De nombreuses mosquées en France organisent des I'tikaf pendant les 10 derniers jours. Cependant, accomplir l'I'tikaf à la Masjid al-Haram de La Mecque est considéré d'une valeur spirituelle exceptionnelle selon les savants islamiques." },
    ],
  },

  "/omra-famille": {
    title: "Omra en Famille 2027 : Guide, Prix et Conseils Pratiques",
    description: "Omra en famille 2027 : conditions pour les enfants, prix famille (2 500-6 000€), conseils pratiques et agences spécialisées. Tout pour réussir l'Omra avec femme et enfants.",
    canonical: "https://omrabonsplans.fr/omra-famille",
    h1: "Omra en Famille 2027 : Guide Complet",
    intro: "Partir en Omra en famille est une expérience spirituelle inoubliable pour parents et enfants. Ce guide vous aide à organiser votre voyage en famille : conditions pour les enfants, budget famille, logement adapté, conseils pratiques et précautions à prendre pour que ce voyage reste une expérience positive pour tous.",
    sections: [
      { h2: "Conditions et conseils pour les enfants", text: "L'Omra n'est pas obligatoire pour les enfants mais est autorisée dès le plus jeune âge. Les nourrissons et jeunes enfants peuvent accomplir le Tawaf et le Sa'i, portés par leurs parents. À partir de 7-8 ans, l'enfant peut participer activement. Les préados et ados vivent souvent l'expérience très intensément. Préparez les enfants : racontez l'histoire de la Kaaba, d'Ibrahim et d'Ismaël avant le départ." },
      { h2: "Prix Omra famille 2027", text: "Couple + 2 enfants (chambre familiale) : 2 500-4 000€ hors Ramadan. Couple + 2 enfants pendant le Ramadan : 4 000-7 000€. Les enfants de moins de 2 ans voyagent généralement gratuitement (sans siège avion). Les 2-11 ans bénéficient souvent de tarifs réduits (-20 à -30%). Privilégiez les chambres familiales (4 lits) ou les suites pour votre confort." },
      { h2: "Choisir le bon moment pour l'Omra en famille", text: "Pendant les vacances scolaires françaises (Noël, Pâques) : confort organisationnel mais prix plus élevés. L'été (juillet-août) : moins cher mais chaleur intense (40-45°C) peu adaptée aux jeunes enfants. Le Ramadan : spirituellement fort mais foules difficiles avec des enfants. Notre recommandation : les vacances de Noël ou de Pâques pour conjuguer spiritualité, confort thermique et organisation." },
    ],
    faqs: [
      { q: "À quel âge peut-on emmener ses enfants en Omra ?", a: "Il n'y a pas d'âge minimum légal pour l'Omra. Les nourrissons peuvent y participer, portés par leurs parents. Les enfants de moins de 2 ans voyagent souvent gratuitement (sans siège avion). À partir de 7-8 ans, les enfants peuvent comprendre et participer activement aux rites. Les adolescents vivent souvent l'expérience de manière très significative." },
      { q: "Quel est le prix d'une Omra en famille ?", a: "Pour un couple avec 2 enfants, comptez entre 2 500€ (basse saison, hôtel 3★) et 6 000€ (hiver, hôtel 4★ proche Haram). Les enfants de moins de 2 ans voyagent généralement gratuitement. Les 2-11 ans bénéficient souvent de tarifs réduits. Demandez spécifiquement les tarifs famille aux agences — certaines proposent des réductions spéciales." },
      { q: "Quelles précautions médicales pour les enfants en Omra ?", a: "Vaccin méningocoque ACWY obligatoire pour les enfants (vérifiez l'âge minimum auprès de votre médecin). Emportez un kit médical complet (fièvre, diarrhée, coupures). Hydratez les enfants en permanence (chaleur intense). Appliquez crème solaire SPF 50+ plusieurs fois par jour. Évitez les prières dans la foule dense avec de très jeunes enfants — la sécurité prime." },
    ],
  },

  "/omra-seniors": {
    title: "Omra Seniors 2027 : Conseils, Conditions Médicales et Agences",
    description: "Omra seniors 2027 : conseils médicaux, conditions physiques requises, agences spécialisées, prix et astuces pour partir en Omra après 60 ans. Guide complet.",
    canonical: "https://omrabonsplans.fr/omra-seniors",
    h1: "Omra Seniors 2027 : Guide Complet pour Partir Sereinement",
    intro: "Il n'y a pas d'âge maximum pour accomplir l'Omra. De nombreux pèlerins de 60, 70 ou 80 ans accomplissent ce voyage spirituel chaque année. Une bonne préparation médicale, le choix d'un forfait adapté et quelques précautions pratiques permettent aux seniors de vivre cette expérience dans les meilleures conditions.",
    sections: [
      { h2: "Conditions médicales et préparation", text: "Consultez votre médecin 2-3 mois avant le départ. Bilan cardiologique recommandé pour les personnes de 65+. Prévoyez vos médicaments habituels en quantité suffisante (avec ordonnance en français et en anglais). Le vaccin méningocoque ACWY est obligatoire quel que soit l'âge. Informez votre agence de votre état de santé pour adapter l'accompagnement." },
      { h2: "Choisir le bon forfait senior", text: "Privilégiez les forfaits avec chambre individuelle ou double (évitez les chambres partagées). Optez pour un hôtel ≤200m du Haram — distances réduites au maximum. Choisissez des groupes de taille modeste (15-25 personnes) avec un encadrant attentif. Certaines agences proposent des forfaits 'senior' avec chambre en rez-de-chaussée, fauteuil roulant disponible et rythme adapté." },
      { h2: "Conseils pratiques pour les seniors", text: "Partez en basse saison (évitez la chaleur extrême de juillet-août). Utilisez librement les fauteuils roulants mis à disposition par les autorités saoudiennes (gratuits au Haram). Ne portez pas de bagages lourds — les chariots sont disponibles. Reposez-vous entre les prières. Évitez les heures de pointe (midi) pour le Tawaf. L'ascenseur du Haram desserve tous les niveaux." },
    ],
    faqs: [
      { q: "Y a-t-il un âge maximum pour faire l'Omra ?", a: "Non. Il n'y a pas d'âge maximum légal ou religieux pour accomplir l'Omra. Des pèlerins de 80, 90 ans et plus font l'Omra chaque année. L'état de santé est plus important que l'âge. Une consultation médicale préalable est fortement recommandée. L'Arabie Saoudite met des fauteuils roulants à disposition gratuitement pour les personnes à mobilité réduite au Haram." },
      { q: "Comment choisir une agence pour une Omra senior ?", a: "Cherchez une agence proposant spécifiquement des 'séjours seniors' ou 'Omra confort'. Critères essentiels : hôtel très proche du Haram (<200m), groupe de taille réduite (15-25 personnes), guide attentif et francophone, chambre au rez-de-chaussée possible, fauteuil roulant disponible. Appelez l'agence et expliquez votre situation médicale pour vérifier leur capacité à vous accompagner." },
      { q: "Quelles précautions médicales avant une Omra pour senior ?", a: "Consultez votre médecin 2-3 mois avant pour un bilan général. Pour les personnes de 65+ : bilan cardiologique recommandé. Vaccin méningocoque ACWY obligatoire. Emportez tous vos médicaments habituels avec ordonnance (en français et anglais). Informez votre médecin des conditions : 5-10 km de marche quotidienne, chaleur intense, foules. Une assurance rapatriement médicale est fortement conseillée." },
    ],
  },

  "/omra-enfants": {
    title: "Omra avec Enfants 2027 : Âge, Préparation et Conseils Pratiques",
    description: "Guide Omra avec enfants 2027 : âge minimum, préparation spirituelle, documents nécessaires, précautions médicales et conseils pour une Omra réussie en famille.",
    canonical: "https://omrabonsplans.fr/omra-enfants",
    h1: "Omra avec Enfants : Guide Pratique 2027",
    intro: "Emmener ses enfants en Omra est un acte d'amour profond — les exposer dès l'enfance à la Maison d'Allah laisse une empreinte spirituelle pour la vie. Ce guide pratique couvre tout ce que vous devez savoir : âge minimum, préparation, documents, précautions et conseils pour que l'Omra avec enfants soit une expérience réussie.",
    sections: [
      { h2: "Âge minimum et conditions pour les enfants", text: "Pas d'âge minimum légal : les nourrissons peuvent accomplir l'Omra portés par leurs parents. Les moins de 2 ans voyagent généralement sans siège avion (tarif bébé, environ 10% du tarif adulte). Les enfants de 2-12 ans bénéficient souvent de tarifs réduits (-20 à -30%). Le vaccin méningocoque ACWY est obligatoire pour tous, quel que soit l'âge — vérifiez l'âge minimum auprès de votre médecin." },
      { h2: "Préparer l'Omra avec ses enfants", text: "Racontez l'histoire de la Kaaba, d'Ibrahim, de Hajar et d'Ismaël. Montrez des images et vidéos de La Mecque. Apprenez la Talbiyah ensemble ('Labbayka Allahumma labbayk'). Pour les jeunes enfants : expliquez qu'on va visiter la 'Maison d'Allah'. Pour les ados : impliquez-les dans la préparation et laissez-les exprimer leurs intentions (niyya)." },
      { h2: "Précautions pratiques", text: "Poussette légère pour les moins de 3 ans (disponible à louer sur place). Hydratation constante — les enfants se déshydratent rapidement par forte chaleur. Crème solaire SPF 50+. Kit médical complet (fièvre, diarrhée, coupures). Évitez les foules denses avec de jeunes enfants. Identifiant dans la poche de l'enfant (nom, hôtel, téléphone parent). Point de rendez-vous convenu en cas de séparation." },
    ],
    faqs: [
      { q: "Peut-on emmener un bébé en Omra ?", a: "Oui. Il n'y a pas d'âge minimum pour l'Omra. Les nourrissons peuvent accomplir le Tawaf et le Sa'i portés dans les bras ou dans un porte-bébé. Le vaccin méningocoque est obligatoire — vérifiez l'âge minimum avec votre médecin. Les bébés de moins de 2 ans voyagent en général sans siège avion (tarif bébé). Prévoyez une poussette légère pour les longues distances." },
      { q: "L'Omra d'un enfant est-elle valide ?", a: "Oui. L'Omra accomplie par ou pour un enfant est valide, bien que ne le dispensant pas d'en accomplir une autre à l'âge adulte. Les parents peuvent avoir l'intention (niyya) de l'Omra au nom de leur jeune enfant. Certains savants estiment que l'enfant doit répéter l'Omra une fois adulte — l'Omra de l'enfance est un acte de bienfaisance mais pas l'obligation islamique de l'adulte." },
      { q: "Quels documents faut-il pour un enfant en Omra ?", a: "Passeport valide 6 mois après le retour (obligatoire même pour les nourrissons). Certificat de vaccination méningocoque ACWY. Pour les enfants voyageant avec un seul parent : une autorisation de l'autre parent peut être demandée. Acte de naissance peut être requis par l'agence. Vérifiez les exigences spécifiques avec votre agence lors de la réservation." },
    ],
  },

  "/omra-badal": {
    title: "Omra Badal (par Procuration) : Règles, Conditions et Prix 2027",
    description: "Omra Badal 2027 : accomplir l'Omra par procuration pour une personne décédée ou dans l'incapacité. Conditions islamiques, qui peut faire le Badal et prix des services.",
    canonical: "https://omrabonsplans.fr/omra-badal",
    h1: "Omra Badal : Guide Complet de l'Omra par Procuration",
    intro: "L'Omra Badal (البدل) consiste à accomplir l'Omra au nom d'une personne décédée ou physiquement incapable de l'accomplir elle-même. Cette pratique est autorisée par la majorité des savants islamiques et peut être un acte d'amour et de bienfaisance envers un proche. Ce guide explique les conditions, règles et modalités.",
    sections: [
      { h2: "Conditions pour le Badal selon les savants", text: "Conditions pour le mandataire (celui qui accomplit l'Omra) : avoir déjà accompli sa propre Omra. Être physiquement capable. Être adulte et musulman. Conditions pour le mandant (celui au nom de qui on part) : être décédé, ou souffrir d'une maladie chronique l'empêchant définitivement de voyager, ou avoir une incapacité physique permanente. Les savants divergent sur le Badal pour une personne encore vivante mais incapable." },
      { h2: "Comment accomplir l'Omra Badal", text: "Formez l'intention (niyya) au Miqat : 'Je fais l'Ihram pour l'Omra au nom de [prénom de la personne].' Accomplissez tous les rites normalement (Tawaf, Sa'i, coupe des cheveux). L'Omra est accomplie au nom de la personne concernée. Vous pouvez ensuite accomplir votre propre Omra si vous le souhaitez. Il n'est pas nécessaire d'être un proche de la personne." },
      { h2: "Services Omra Badal et prix", text: "Certaines agences et particuliers proposent des services d'Omra Badal. Prix indicatif : 200 à 500€ pour faire accomplir l'Omra par procuration. Prudence : vérifiez la réputation et la fiabilité du prestataire. La personne qui accomplira l'Omra en votre nom doit respecter toutes les conditions ci-dessus. Une attestation écrite est recommandée." },
    ],
    faqs: [
      { q: "Peut-on faire l'Omra à la place d'un défunt ?", a: "Oui, selon la majorité des savants islamiques. L'Omra Badal pour un défunt est autorisée et constitue un acte de bienfaisance (sadaqa jariya). Le mandataire doit avoir accompli sa propre Omra au préalable. Il accomplit tous les rites normalement en formant l'intention au nom du défunt au Miqat. La récompense est pour le défunt, et le mandataire reçoit aussi une récompense selon certains savants." },
      { q: "Qui peut accomplir l'Omra Badal ?", a: "Tout adulte musulman physiquement capable ayant déjà accompli sa propre Omra. Il n'est pas nécessaire d'être un proche de la personne concernée. Certains savants estiment qu'il vaut mieux envoyer quelqu'un de confiance et pieux. La personne peut être rémunérée pour ce service, selon la majorité des juristes islamiques." },
      { q: "L'Omra Badal est-elle valide pour une personne vivante ?", a: "Les savants divergent sur ce point. La majorité autorise le Badal pour une personne vivante souffrant d'une incapacité physique permanente (paralysie, maladie chronique grave). Si la personne est simplement âgée mais encore capable de voyager avec aide, le Badal est plus contesté. Consultez un savant qualifié selon votre école juridique pour votre situation spécifique." },
    ],
  },

  "/comparateur-omra-france": {
    title: "Comparateur Omra France 2027 : Comparez 20+ Agences Agréées",
    description: "Comparateur Omra France : comparez en temps réel les offres de 20+ agences agréées. Prix, hôtels, dates de départ, avis clients. Trouvez la meilleure offre Omra 2027.",
    canonical: "https://omrabonsplans.fr/comparateur-omra-france",
    h1: "Comparateur Omra France : Trouvez la Meilleure Offre 2027",
    intro: "Notre comparateur Omra France vous permet de comparer en temps réel les offres de plus de 20 agences agréées ATOUT FRANCE. Filtrez par prix, dates, standing hôtel, distance au Haram et avis clients pour trouver le forfait Omra qui correspond exactement à vos besoins et votre budget.",
    sections: [
      { h2: "Comment fonctionne notre comparateur", text: "1. Saisissez vos dates de départ et de retour souhaitées. 2. Indiquez le nombre de pèlerins et le budget. 3. Filtrez par standing hôtel (3★ à 5★) et distance au Haram. 4. Comparez les offres triées par prix ou par note. 5. Accédez directement au site de l'agence pour réserver. Toutes les agences référencées sont agréées par ATOUT FRANCE et le Ministère Saoudien des Affaires Islamiques." },
      { h2: "Agences comparées sur notre plateforme", text: "Notre plateforme référence les principales agences agréées en France : Tawaf, Medinvoyages, Al-Maqam, Omra Discount, Pèlerinhajj, Omra Sounnah, et une vingtaine d'autres agences agréées. Chaque agence est vérifiée (agrément ATOUT FRANCE actif) et les avis sont collectés depuis Google. Mise à jour régulière des offres et prix." },
    ],
    faqs: [
      { q: "Comment comparer les offres Omra en France ?", a: "Notre comparateur omrabonsplans.fr centralise les offres de 20+ agences agréées. Comparez les prix pour les mêmes dates et le même standing hôtel. Vérifiez la distance au Haram (facteur clé du prix), le nombre de nuits à La Mecque et Médine, les repas inclus et les avis clients. Demandez toujours un devis détaillé avant de réserver." },
      { q: "Toutes les agences sont-elles agréées ?", a: "Oui. Toutes les agences référencées sur notre comparateur sont agréées par ATOUT FRANCE (licence obligatoire pour vendre des voyages en France) et autorisées par le Ministère Saoudien des Affaires Islamiques pour organiser des voyages Omra. Vérifiez toujours l'agrément ATOUT FRANCE sur le site officiel atout-france.fr avant de réserver." },
      { q: "Quelle est la meilleure période pour trouver une offre Omra pas chère ?", a: "Les prix les plus bas se trouvent en basse saison islamique (Mouharram, Safar — juillet-septembre). Notre comparateur affiche en temps réel les offres early bird disponibles — en réservant 4-6 mois à l'avance, vous économisez souvent 200-400€. Les offres de dernière minute existent mais sont rares et risquées (moins de choix, hôtels éloignés)." },
    ],
  },

  "/ramadan-hajj-dates": {
    title: "Dates Ramadan & Hajj 2027-2029 : Calendrier Islamique Officiel",
    description: "Dates officielles du Ramadan 2027 (17 fév–18 mars) et du Hajj 2027 (26-31 mai, Arafat 27 mai). Calendrier islamique 2027-2029, Aïd al-Fitr et Aïd al-Adha.",
    canonical: "https://omrabonsplans.fr/ramadan-hajj-dates",
    h1: "Dates Ramadan 2027 et Hajj 2027 — Calendrier Islamique",
    intro: "Ce calendrier récapitule les dates estimées du Ramadan, du Hajj et des principales fêtes islamiques pour les années 2027, 2028 et 2029. Le Hajj 2027 aura lieu du 26 au 31 mai 2027 (Arafat le 27 mai). Le Ramadan 2027 débutera le 17 février 2027. Ces dates sont basées sur le calendrier lunaire islamique (Hijri) et sont approximatives.",
    sections: [
      { h2: "Ramadan 2027 (1448 AH)", text: "Début estimé : 17 février 2027. Fin estimée : 18 mars 2027. Aïd al-Fitr : 19 mars 2027. Laylat al-Qadr (27e nuit) : estimée au 15 mars 2027. 10 derniers jours : du 9 au 18 mars 2027." },
      { h2: "Hajj et Aïd al-Adha 2027 (1448 AH)", text: "Ihram à Mina (8 Dhul Hijja) : 26 mai 2027. Jour d'Arafat (9 Dhul Hijja) : 27 mai 2027. Aïd al-Adha (10 Dhul Hijja) : 28 mai 2027. Journées de Tachrik : 29-31 mai 2027." },
      { h2: "Ramadan et Hajj 2028-2029", text: "Ramadan 2028 (1449 AH) : du 6 février au 7 mars 2028, Aïd al-Fitr 7 mars. Hajj 2028 : du 15 au 20 mai 2028, Arafat 16 mai, Aïd al-Adha 17 mai. Ramadan 2029 (1450 AH) : du 26 janvier au 24 février 2029. Le calendrier islamique avance de 10 à 11 jours chaque année par rapport au calendrier grégorien." },
    ],
    faqs: [
      { q: "Quand est le Ramadan 2027 ?", a: "Le Ramadan 2027 (1448 AH) est estimé du 17 février au 18 mars 2027. L'Aïd al-Fitr (fin du Ramadan) est estimé au 19 mars 2027. Les 10 derniers jours (recherche de Laylat al-Qadr) couvrent la période du 9 au 18 mars 2027, avec la Nuit du Destin cherchée dans les nuits impaires." },
      { q: "Quand est le Hajj 2027 ?", a: "Le Hajj 2027 aura lieu du 26 au 31 mai 2027 (8-13 Dhul Hijja 1448 AH). Le jour d'Arafat est le 27 mai 2027. L'Aïd al-Adha est le 28 mai 2027. Ces dates sont estimées et seront confirmées officiellement par les autorités saoudiennes." },
      { q: "Comment les dates islamiques sont-elles calculées ?", a: "Le calendrier islamique est lunaire : chaque mois commence avec la nouvelle lune. L'année islamique a 354 ou 355 jours (contre 365 pour le calendrier grégorien), ce qui explique que les dates islamiques avancent de 10-11 jours par an dans le calendrier grégorien. La confirmation officielle des dates se fait par l'observation de la lune par les autorités religieuses saoudiennes." },
    ],
  },

  "/agences-liste": {
    title: "Liste des Agences Omra Agréées en France 2027",
    description: "Liste complète des agences Omra agréées en France 2027 : coordonnées, avis clients, spécialités et villes de départ. Trouvez une agence Omra fiable près de chez vous.",
    canonical: "https://omrabonsplans.fr/agences-liste",
    h1: "Liste des Agences Omra Agréées en France 2027",
    intro: "Cette liste recense les principales agences de voyage Omra agréées ATOUT FRANCE et autorisées par le Ministère Saoudien des Affaires Islamiques. Toutes ces agences ont été vérifiées pour leur sérieux et leurs avis clients. Retrouvez aussi les agences disponibles sur notre comparateur pour comparer leurs offres en temps réel.",
    sections: [
      { h2: "Comment vérifier l'agrément d'une agence Omra", text: "Toute agence vendant des voyages Omra en France doit être titulaire de la licence ATOUT FRANCE (anciennement licence d'agence de voyage). Vérifiez l'agrément sur registre.atout-france.fr. L'agence doit aussi être habilitée par le Ministère Saoudien des Affaires Islamiques pour obtenir les visas Omra. Un numéro d'habilitation saoudien doit figurer dans les documents contractuels." },
      { h2: "Agences les mieux notées (avis Google)", text: "Tawaf (4,8/5 — 520+ avis) : Paris, Lyon, Marseille. Medinvoyages (4,7/5 — 380+ avis) : Paris, Lille, Strasbourg. Al-Maqam (4,6/5 — 310+ avis) : Paris, Nice, Bordeaux. Omra Sounnah (4,6/5 — 280+ avis) : Paris, Lyon. Pèlerinhajj (4,5/5 — 350+ avis) : Paris, Marseille. Ces notes sont indicatives et peuvent varier — vérifiez les avis récents." },
    ],
    faqs: [
      { q: "Comment trouver une agence Omra agréée près de chez moi ?", a: "Notre liste recense les agences agréées dans toute la France. Vous pouvez aussi chercher 'agence Omra + votre ville' sur Google et vérifier l'agrément ATOUT FRANCE sur registre.atout-france.fr. Pour les grandes villes, plusieurs agences opèrent localement. Notre comparateur vous permet de filtrer par ville de départ." },
      { q: "Une agence Omra doit-elle être agréée ?", a: "Oui, obligatoirement. En France, toute agence vendant des voyages doit être titulaire d'une licence ATOUT FRANCE. Pour les voyages Omra spécifiquement, l'agence doit aussi être habilitée par le Ministère Saoudien des Affaires Islamiques. Ne jamais réserver auprès d'une agence ne pouvant présenter ces deux agréments." },
      { q: "Peut-on faire l'Omra sans agence ?", a: "Oui, techniquement. Depuis 2019, le visa touristique saoudien (eVisa) permet d'entrer en Arabie Saoudite et d'accomplir l'Omra sans passer par une agence. Cela convient aux voyageurs expérimentés et autonomes. Pour une première Omra, les familles ou les seniors, passer par une agence est fortement recommandé pour l'encadrement, la logistique et la sécurité." },
    ],
  },

  "/omra-depuis-paris": {
    title: "Omra depuis Paris 2027 : Vols, Agences et Prix",
    description: "Omra depuis Paris 2027 : vols depuis CDG et Orly, agences spécialisées, prix (900-4 500€) et conseils pour partir en Omra depuis la région parisienne.",
    canonical: "https://omrabonsplans.fr/omra-depuis-paris",
    h1: "Omra depuis Paris 2027 : Guide Complet",
    intro: "Paris est le principal hub de départ pour l'Omra en France. Les aéroports Charles de Gaulle (CDG) et Orly desservent Djeddah et Médine avec de nombreuses compagnies. De nombreuses agences agréées sont basées en région parisienne. Ce guide vous aide à organiser votre Omra depuis Paris au meilleur prix.",
    sections: [
      { h2: "Vols Paris → Djeddah et Médine", text: "Compagnies au départ de CDG : Air France, Saudi Arabian Airlines, Saudia, Flynas. Au départ d'Orly : Air Arabia, Transavia. Durée : 6h30 à 7h30. Prix vols seuls : 250-700€ aller-retour selon la saison. Les forfaits agences incluent généralement le vol — comparez vol inclus vs à la carte pour votre période." },
      { h2: "Agences Omra basées à Paris et région", text: "De nombreuses agences agréées opèrent depuis Paris : Tawaf, Medinvoyages, Al-Maqam, Omra Discount et d'autres. Plusieurs sont concentrées dans les 18e, 19e et 20e arrondissements de Paris, ainsi qu'à Saint-Denis, Aubervilliers et Clichy. Notre comparateur vous permet de filtrer les offres avec départ depuis Paris." },
    ],
    faqs: [
      { q: "Quel aéroport pour partir en Omra depuis Paris ?", a: "CDG (Roissy) pour les vols Air France, Saudia, Saudi Arabian Airlines — le choix le plus large. Orly pour les compagnies low-cost (Air Arabia, Transavia) souvent moins chères. La plupart des agences parisiennes incluent le transport jusqu'à l'aéroport dans leur forfait. Comparez les deux aéroports — la différence de prix peut atteindre 100-200€." },
      { q: "Quel est le prix d'une Omra depuis Paris ?", a: "Les forfaits Omra depuis Paris varient de 900€ (basse saison, hôtel 3★) à 5 000€+ (Ramadan, hôtel 5★). En moyenne, comptez 1 500-2 500€ pour un forfait de qualité hors Ramadan. Paris bénéficie du plus grand choix d'agences et de vols, ce qui permet de trouver les meilleures offres. Utilisez notre comparateur pour comparer en temps réel." },
    ],
  },

  "/omra-depuis-lyon": {
    title: "Omra depuis Lyon 2027 : Vols, Agences et Prix",
    description: "Omra depuis Lyon 2027 : vols depuis l'aéroport Lyon-Saint Exupéry, agences lyonnaises agréées, prix et conseils pour partir en Omra depuis la région Rhône-Alpes.",
    canonical: "https://omrabonsplans.fr/omra-depuis-lyon",
    h1: "Omra depuis Lyon 2027 : Guide Complet",
    intro: "Lyon est le deuxième plus grand hub de départ pour l'Omra en France, avec une large communauté musulmane et plusieurs agences agréées. L'aéroport Lyon-Saint Exupéry propose des vols directs et avec escale vers Djeddah et Médine. Voici tout ce que vous devez savoir pour partir en Omra depuis Lyon.",
    sections: [
      { h2: "Vols Lyon → Djeddah et Médine", text: "Compagnies au départ de Lyon-Saint Exupéry : Saudia, Air Arabia Maroc (via Casablanca), Transavia (saisonnier). Certaines agences proposent des charters depuis Lyon pendant le Ramadan et l'été. Durée avec escale : 8 à 12 heures selon la correspondance. Vols directs moins fréquents qu'à Paris — planifiez à l'avance." },
      { h2: "Agences Omra à Lyon", text: "Plusieurs agences agréées opèrent depuis Lyon : certaines locales, d'autres filiales d'agences parisiennes. Les quartiers de la Guillotière et de Villeurbanne concentrent plusieurs agences spécialisées. Certaines agences proposent des départs en bus depuis Lyon jusqu'à CDG pour bénéficier de plus de vols." },
    ],
    faqs: [
      { q: "Peut-on partir en Omra directement depuis Lyon ?", a: "Oui, des vols au départ de Lyon-Saint Exupéry vers Djeddah existent, principalement en saison. Hors saison, il peut être nécessaire de transiter par Paris CDG, Casablanca ou Istanbul. Plusieurs agences lyonnaises proposent des départs en bus jusqu'à Paris pour bénéficier de plus de vols directs. Comparez les deux options sur notre plateforme." },
      { q: "Quelles agences Omra sont basées à Lyon ?", a: "Plusieurs agences agréées opèrent depuis Lyon et la région Rhône-Alpes. Consultez notre liste d'agences filtrée par ville sur omrabonsplans.fr/agences-liste. Les grandes agences nationales (Tawaf, Medinvoyages) proposent aussi des départs depuis Lyon. Vérifiez toujours l'agrément ATOUT FRANCE avant de réserver." },
    ],
  },

  "/omra-depuis-marseille": {
    title: "Omra depuis Marseille 2027 : Vols, Agences et Prix",
    description: "Omra depuis Marseille 2027 : vols depuis Marseille-Provence, agences agréées à Marseille, prix et guide complet pour partir en Omra depuis la région PACA.",
    canonical: "https://omrabonsplans.fr/omra-depuis-marseille",
    h1: "Omra depuis Marseille 2027 : Guide Complet",
    intro: "Marseille abrite l'une des plus grandes communautés musulmanes de France et dispose de nombreuses agences Omra agréées. L'aéroport Marseille-Provence propose des connexions vers les villes saintes. Voici comment organiser votre Omra depuis Marseille au meilleur prix.",
    sections: [
      { h2: "Vols Marseille → Djeddah et Médine", text: "Compagnies depuis Marseille-Provence : Saudia (vols saisonniers directs), Air Arabia (via Casablanca), Tunisair (via Tunis), Turkish Airlines (via Istanbul). Certaines agences marseilaises organisent des charters directs Marseille-Djeddah pendant le Ramadan. Prix estimés : 300-600€ aller-retour selon saison et compagnie." },
      { h2: "Agences Omra à Marseille", text: "Marseille dispose d'un réseau dense d'agences Omra agréées, notamment dans les quartiers du centre-ville et de la Porte d'Aix. Certaines agences proposent des départs en groupe depuis Marseille avec encadrement dès le départ. Notre comparateur liste les agences disponibles au départ de Marseille." },
    ],
    faqs: [
      { q: "Peut-on partir en Omra depuis Marseille ?", a: "Oui. Des vols au départ de Marseille-Provence existent vers Djeddah, notamment en saison (Ramadan, été). Hors saison, un transit peut être nécessaire (Paris, Casablanca, Istanbul). Des agences marseilaises proposent aussi des départs en bus/navette jusqu'à CDG pour accéder à plus de vols. Comparez les deux options." },
      { q: "Quel est le prix d'une Omra depuis Marseille ?", a: "Comparable aux prix depuis Paris (900-4 500€ selon la période), avec parfois un légèrement surcoût sur le vol (moins de vols directs). Pendant le Ramadan, certaines agences marseilaises proposent des charters directs Marseille-Djeddah compétitifs. Utilisez notre comparateur pour trouver les meilleures offres au départ de Marseille." },
    ],
  },

  "/omra-depuis-toulouse": {
    title: "Omra depuis Toulouse 2027 : Vols, Agences et Prix",
    description: "Omra depuis Toulouse 2027 : vols depuis Toulouse-Blagnac, agences agréées à Toulouse, prix et conseils pour partir en Omra depuis la région Occitanie.",
    canonical: "https://omrabonsplans.fr/omra-depuis-toulouse",
    h1: "Omra depuis Toulouse 2027 : Guide Complet",
    intro: "Toulouse et la région Occitanie disposent d'agences Omra agréées et de connexions aériennes vers les villes saintes. Ce guide vous aide à organiser votre Omra depuis Toulouse, avec les options de vols, les agences locales et les conseils pratiques.",
    sections: [
      { h2: "Vols depuis Toulouse-Blagnac", text: "Vols directs limités depuis Toulouse vers Djeddah/Médine — des correspondances via Paris CDG, Casablanca ou Istanbul sont généralement nécessaires. Compagnies : Air France (via CDG), Royal Air Maroc (via Casablanca), Turkish Airlines (via Istanbul). Durée totale avec escale : 9-14 heures. Certaines agences proposent des navettes Toulouse-CDG." },
      { h2: "Agences et départs depuis Toulouse", text: "Plusieurs agences agréées opèrent à Toulouse et en région Occitanie. Certaines grandes agences nationales proposent des départs collectifs depuis Toulouse avec transport jusqu'à l'aéroport de Paris inclus. Consultez notre liste d'agences filtrée par ville pour les options disponibles depuis Toulouse." },
    ],
    faqs: [
      { q: "Comment partir en Omra depuis Toulouse ?", a: "Depuis Toulouse-Blagnac, la plupart des itinéraires passent par une escale (Paris, Casablanca, Istanbul). Certaines agences toulousaines proposent des navettes jusqu'à CDG incluses dans le forfait. En saison, des vols charters peuvent être proposés directement depuis Toulouse. Comparez sur notre plateforme les offres avec départ depuis Toulouse ou via Paris." },
    ],
  },

  "/omra-depuis-nice": {
    title: "Omra depuis Nice 2027 : Vols, Agences et Prix",
    description: "Omra depuis Nice 2027 : vols depuis l'aéroport Nice Côte d'Azur, agences agréées à Nice, prix et conseils pour partir en Omra depuis la Côte d'Azur.",
    canonical: "https://omrabonsplans.fr/omra-depuis-nice",
    h1: "Omra depuis Nice 2027 : Guide Complet",
    intro: "La région Côte d'Azur dispose de connexions aériennes depuis l'aéroport Nice Côte d'Azur et d'agences Omra agréées. Ce guide vous aide à organiser votre départ en Omra depuis Nice et la région PACA-Est.",
    sections: [
      { h2: "Vols depuis Nice Côte d'Azur", text: "Des vols avec escale vers Djeddah et Médine sont disponibles depuis Nice via Paris, Casablanca, Istanbul ou Rome. Compagnies : Air France (via CDG), easyJet puis correspondance, Saudia (via CDG ou Riyad). Certaines agences proposent des forfaits avec transfert jusqu'à Marseille ou Paris pour bénéficier de vols plus directs." },
    ],
    faqs: [
      { q: "Comment partir en Omra depuis Nice ?", a: "Depuis l'aéroport Nice Côte d'Azur, des vols avec escale (généralement via Paris CDG, Casablanca ou Istanbul) permettent de rejoindre Djeddah ou Médine. Des agences opèrent depuis Nice et la Côte d'Azur. Certains forfaits incluent un transfert vers Marseille ou Paris pour accéder à plus de vols directs. Consultez notre comparateur pour les options disponibles." },
    ],
  },

  "/omra-depuis-bordeaux": {
    title: "Omra depuis Bordeaux 2027 : Vols, Agences et Prix",
    description: "Omra depuis Bordeaux 2027 : vols depuis l'aéroport Bordeaux-Mérignac, agences agréées à Bordeaux, prix et guide pour partir en Omra depuis la région Nouvelle-Aquitaine.",
    canonical: "https://omrabonsplans.fr/omra-depuis-bordeaux",
    h1: "Omra depuis Bordeaux 2027 : Guide Complet",
    intro: "Bordeaux et la Nouvelle-Aquitaine disposent d'agences Omra agréées et de connexions aériennes depuis l'aéroport Bordeaux-Mérignac. Ce guide vous aide à organiser votre Omra depuis Bordeaux.",
    sections: [
      { h2: "Vols et connexions depuis Bordeaux", text: "Des vols avec escale depuis Bordeaux-Mérignac permettent de rejoindre Djeddah ou Médine, généralement via Paris CDG, Casablanca ou Istanbul. Compagnies : Air France (via CDG), Transavia, Royal Air Maroc (via Casablanca). Des navettes vers Paris CDG sont parfois incluses dans les forfaits agences locales." },
    ],
    faqs: [
      { q: "Comment partir en Omra depuis Bordeaux ?", a: "Depuis Bordeaux-Mérignac, un transit est généralement nécessaire (Paris CDG, Casablanca ou Istanbul) pour rejoindre Djeddah ou Médine. Certaines agences bordelaises incluent la navette vers Paris dans leur forfait. Des départs groupés depuis Bordeaux peuvent être organisés en saison. Utilisez notre comparateur pour trouver les meilleures options." },
    ],
  },

  "/omra-depuis-strasbourg": {
    title: "Omra depuis Strasbourg 2027 : Vols, Agences et Prix",
    description: "Omra depuis Strasbourg 2027 : vols depuis l'aéroport Strasbourg-Entzheim, agences agréées à Strasbourg, prix et guide pour partir en Omra depuis l'Alsace.",
    canonical: "https://omrabonsplans.fr/omra-depuis-strasbourg",
    h1: "Omra depuis Strasbourg 2027 : Guide Complet",
    intro: "Strasbourg et l'Alsace disposent d'agences Omra agréées et de connexions aériennes. Ce guide vous aide à organiser votre Omra depuis Strasbourg ou la région Grand Est.",
    sections: [
      { h2: "Vols et connexions depuis Strasbourg", text: "Des vols avec escale depuis l'aéroport Strasbourg-Entzheim permettent de rejoindre Djeddah ou Médine, via Paris CDG, Frankfurt ou Istanbul. Certains pèlerins de la région préfèrent se rendre à l'aéroport de Bâle-Mulhouse (à 60 km) pour accéder à plus de vols directs. Des agences strasbourgeoises proposent des départs groupés avec navette incluse." },
    ],
    faqs: [
      { q: "Comment partir en Omra depuis Strasbourg ?", a: "Depuis Strasbourg-Entzheim ou Bâle-Mulhouse (à 60 km), des vols avec escale permettent de rejoindre Djeddah ou Médine. Des agences agréées opèrent depuis Strasbourg et le Grand Est. Certains forfaits incluent la navette jusqu'à Paris CDG pour accéder à plus de vols directs. Notre comparateur liste les options disponibles depuis Strasbourg." },
    ],
  },

  "/omra-depuis-lille": {
    title: "Omra depuis Lille 2027 : Vols, Agences et Prix",
    description: "Omra depuis Lille 2027 : vols depuis l'aéroport de Lille-Lesquin, agences agréées à Lille, prix et guide pour partir en Omra depuis les Hauts-de-France.",
    canonical: "https://omrabonsplans.fr/omra-depuis-lille",
    h1: "Omra depuis Lille 2027 : Guide Complet",
    intro: "Lille et la région Hauts-de-France disposent d'agences Omra agréées. La proximité avec Paris CDG (1h en Eurostar ou TGV) facilite l'accès à de nombreux vols vers Djeddah et Médine. Ce guide vous aide à organiser votre Omra depuis Lille.",
    sections: [
      { h2: "Vols et connexions depuis Lille", text: "L'aéroport Lille-Lesquin propose des vols avec escale vers Djeddah. La proximité de Paris CDG (1h en Eurostar ou TGV) en fait une option attractive pour les vols directs. Des agences lilloises proposent des navettes ou des forfaits avec départ depuis Lille via Paris. Bruxelles (45 min en train) offre aussi des connexions vers l'Arabie Saoudite." },
    ],
    faqs: [
      { q: "Comment partir en Omra depuis Lille ?", a: "Depuis Lille, les options incluent : l'aéroport Lille-Lesquin (vols avec escale), Paris CDG accessible en 1h par Eurostar/TGV (vols directs plus nombreux), ou l'aéroport de Bruxelles (45 min). Des agences lilloises proposent des forfaits avec navette vers Paris incluse. Notre comparateur liste les offres disponibles depuis la région." },
    ],
  },

  "/omra-depuis-nantes": {
    title: "Omra depuis Nantes 2027 : Vols, Agences et Prix",
    description: "Omra depuis Nantes 2027 : vols depuis Nantes Atlantique ou CDG (2h15 TGV), agences agréées, prix (1 000–4 700€) et conseils pour partir depuis les Pays de la Loire.",
    canonical: "https://omrabonsplans.fr/omra-depuis-nantes",
    h1: "Omra depuis Nantes 2027 : Guide Complet",
    intro: "Nantes et les Pays de la Loire comptent environ 100 000 musulmans. La 6e agglomération française est accessible à Paris CDG en 2h15 de TGV, ce qui ouvre l'accès aux nombreux vols directs vers Djeddah et Médine. Voici comment organiser votre Omra depuis Nantes au meilleur prix.",
    sections: [
      { h2: "Vols depuis Nantes vers l'Arabie Saoudite", text: "Depuis l'aéroport Nantes Atlantique (NTE) : Air France via CDG, Transavia, easyJet vers CDG, Royal Air Maroc via Casablanca. La plupart des pèlerins nantais choisissent de partir depuis Paris CDG (2h15 de TGV) pour accéder à plus de vols directs. Royal Air Maroc via Casablanca est une alternative compétitive depuis NTE. Supplément estimé : +100 à +250€ par rapport à Paris." },
      { h2: "Prix Omra depuis Nantes 2027", text: "Économique : 1 000–1 550€. Confort : 1 550–2 400€. Ramadan : 2 100–4 700€. Ces prix incluent généralement le vol, l'hôtel, les transferts et le visa Omra. Pour bénéficier des meilleures offres, comparez les départs depuis Nantes NTE et depuis Paris CDG — le TGV (60–90€) + vol Paris peut parfois être moins cher qu'un vol direct depuis Nantes." },
    ],
    faqs: [
      { q: "Comment partir en Omra depuis Nantes ?", a: "Deux options : vols directs depuis Nantes Atlantique (NTE) via Royal Air Maroc, Transavia ou easyJet, ou TGV Nantes–Paris CDG (2h15) + vol direct depuis CDG. La deuxième option offre souvent plus de choix et de meilleurs prix. Des agences de la région proposent des forfaits avec navette incluse. Utilisez notre comparateur pour trouver les meilleures offres au départ de Nantes." },
      { q: "Quel est le prix d'une Omra depuis Nantes ?", a: "Comptez entre 1 000€ et 1 550€ en économique hors Ramadan, et 2 100 à 4 700€ pendant le Ramadan. Les forfaits via Paris CDG peuvent être plus compétitifs. Réservez 3–4 mois à l'avance pour les meilleures disponibilités. Notre comparateur liste toutes les offres disponibles au départ de Nantes et de la région." },
    ],
  },

  "/omra-depuis-rennes": {
    title: "Omra depuis Rennes 2027 : Vols, Agences et Prix",
    description: "Omra depuis Rennes 2027 : vols depuis Rennes Saint-Jacques ou CDG (1h30 TGV), agences agréées, prix (980–4 500€) et guide pour partir en Omra depuis la Bretagne.",
    canonical: "https://omrabonsplans.fr/omra-depuis-rennes",
    h1: "Omra depuis Rennes 2027 : Guide Complet",
    intro: "Rennes et la Bretagne comptent environ 80 000 musulmans. La capitale bretonne, reliée à Paris CDG en seulement 1h30 de TGV, est l'une des villes les mieux connectées à CDG hors Île-de-France. Voici comment organiser votre Omra depuis Rennes au meilleur prix.",
    sections: [
      { h2: "Vols depuis Rennes vers l'Arabie Saoudite", text: "Depuis l'aéroport Rennes Saint-Jacques (RNS) : Air France via CDG, Transavia via CDG, Royal Air Maroc via Casablanca. La connexion TGV Rennes–CDG (1h30, souvent moins de 50€ en avance) est probablement votre meilleure option. L'aéroport de Nantes NTE (1h de route) offre des alternatives compétitives. Supplément estimé : +80 à +200€ par rapport à Paris." },
      { h2: "Prix Omra depuis Rennes 2027", text: "Économique : 980–1 500€. Confort : 1 500–2 300€. Ramadan : 2 000–4 500€. Ces tarifs s'entendent pour des forfaits tout compris (vol, hôtel, transferts, visa). La proximité avec Paris (1h30 TGV) permet souvent d'accéder aux meilleures offres parisienne avec un surcoût minimal." },
    ],
    faqs: [
      { q: "Comment partir en Omra depuis Rennes ?", a: "Le TGV Rennes–Paris CDG (1h30, ~50€) est généralement la meilleure option : il ouvre l'accès à tous les vols directs depuis CDG. Comparez aussi les vols depuis Nantes NTE (1h de route depuis Rennes). Arrivez à CDG 3h avant votre vol — la connexion train/aéroport est excellente. Notre comparateur liste toutes les offres disponibles." },
      { q: "Quel est le prix d'une Omra depuis Rennes ?", a: "Comptez entre 980€ et 1 500€ en économique hors Ramadan, et 2 000 à 4 500€ pendant le Ramadan. Grâce à la proximité de Paris (1h30 TGV), les pèlerins rennais accèdent facilement aux meilleurs prix parisiens avec un surcoût de transport minimal. Réservez 3–4 mois à l'avance." },
    ],
  },

  "/omra-depuis-montpellier": {
    title: "Omra depuis Montpellier 2027 : Vols, Agences et Prix",
    description: "Omra depuis Montpellier 2027 : vols depuis Montpellier Méditerranée, Air Algérie, agences agréées, prix (980–4 600€) et guide pour partir depuis l'Occitanie.",
    canonical: "https://omrabonsplans.fr/omra-depuis-montpellier",
    h1: "Omra depuis Montpellier 2027 : Guide Complet",
    intro: "Montpellier a l'une des plus fortes proportions de musulmans en France (estimée à 25–30% de la population). La ville universitaire dispose d'une forte demande pour l'Omra. Air Algérie propose des connexions depuis Montpellier via Alger vers Djeddah. Voici comment organiser votre Omra depuis Montpellier.",
    sections: [
      { h2: "Vols depuis Montpellier vers l'Arabie Saoudite", text: "Depuis l'aéroport Montpellier Méditerranée (MPL) : Air France via CDG, Transavia, Air Algérie via Alger, Royal Air Maroc via Casablanca. Air Algérie propose des connexions MPL–ALG–JED compétitives pour les ressortissants algériens. Marseille (1h30) offre des vols alternatifs dont des charters pendant le Ramadan. Supplément estimé : +80 à +200€ vs Paris." },
      { h2: "Prix Omra depuis Montpellier 2027", text: "Économique : 980–1 500€. Confort : 1 500–2 300€. Ramadan : 2 100–4 600€. Montpellier bénéficie des connexions Air Algérie pour des prix parfois compétitifs. Comparez aussi les départs depuis Marseille (1h30) qui propose des vols charters en haute saison." },
    ],
    faqs: [
      { q: "Comment partir en Omra depuis Montpellier ?", a: "Trois options : vols depuis MPL (Air France via CDG, Air Algérie via Alger), départ depuis Marseille à 1h30 de route (plus de vols, dont des charters Ramadan), ou train vers Paris CDG. Air Algérie via Alger peut être compétitif pour les détenteurs d'un passeport algérien. Notre comparateur liste les offres disponibles depuis Montpellier et la région." },
      { q: "Quel est le prix d'une Omra depuis Montpellier ?", a: "Comptez entre 980€ et 1 500€ en économique hors Ramadan. Le passage par Marseille ou Paris peut réduire le coût du vol. Pendant le Ramadan, les prix montent à 2 100–4 600€. Réservez tôt — la forte demande à Montpellier entraîne des ruptures de disponibilités rapides." },
    ],
  },

  "/omra-depuis-grenoble": {
    title: "Omra depuis Grenoble 2027 : Vols, Agences et Prix",
    description: "Omra depuis Grenoble 2027 : accès via Lyon-Saint Exupéry (1h), Turkish Airlines, agences agréées, prix (980–4 600€) et guide pour partir depuis l'Isère.",
    canonical: "https://omrabonsplans.fr/omra-depuis-grenoble",
    h1: "Omra depuis Grenoble 2027 : Guide Complet",
    intro: "Grenoble compte environ 100 000 musulmans et bénéficie d'une position avantageuse à 1h de Lyon-Saint Exupéry, qui propose des vols Turkish Airlines directs vers Istanbul puis La Mecque. Voici comment organiser votre Omra depuis Grenoble et l'Isère.",
    sections: [
      { h2: "Vols depuis Grenoble vers l'Arabie Saoudite", text: "Depuis Grenoble, Lyon-Saint Exupéry (LYS, à 1h) est votre meilleur aéroport : Turkish Airlines direct vers Istanbul, Air France, Transavia, Royal Air Maroc. L'aéroport Grenoble-Alpes Isère (GNB) est principalement pour les vols ski et offre peu de connexions Moyen-Orient. Paris CDG est accessible en 3h de TGV. Supplément estimé : +80 à +200€ vs Paris." },
      { h2: "Prix Omra depuis Grenoble 2027", text: "Économique : 980–1 500€. Confort : 1 500–2 350€. Ramadan : 2 100–4 600€. Depuis Lyon (1h de route), Turkish Airlines propose régulièrement de bons prix vers Istanbul et Djeddah. Les associations islamiques grenobloises organisent des départs groupés qui négocient en bloc et proposent souvent de bonnes offres." },
    ],
    faqs: [
      { q: "Comment partir en Omra depuis Grenoble ?", a: "Lyon-Saint Exupéry (LYS), à 1h de route de Grenoble, est votre meilleur aéroport de départ : il propose Turkish Airlines directs vers Istanbul, Air France vers CDG, et Transavia. L'aéroport de Grenoble GNB offre peu de vols long-courriers. Vérifiez aussi les départs groupés organisés par les associations islamiques de Grenoble." },
      { q: "Quel est le prix d'une Omra depuis Grenoble ?", a: "Comptez entre 980€ et 1 500€ en économique hors Ramadan, et 2 100 à 4 600€ pendant le Ramadan. Lyon est votre atout : Turkish Airlines via Istanbul depuis LYS propose régulièrement de bons prix. Réservez 3–4 mois à l'avance pour les meilleures disponibilités." },
    ],
  },

  "/omra-depuis-metz": {
    title: "Omra depuis Metz 2027 : Vols, Agences et Prix",
    description: "Omra depuis Metz 2027 : accès via Francfort (1h), Luxembourg (45 min) ou CDG (1h30 TGV), agences agréées, prix (980–4 600€) et guide pour partir depuis la Moselle.",
    canonical: "https://omrabonsplans.fr/omra-depuis-metz",
    h1: "Omra depuis Metz 2027 : Guide Complet",
    intro: "Metz et la Moselle comptent environ 80 000 musulmans. La position géographique de Metz est un atout unique : à 1h de Francfort (hub Lufthansa), 45 min de Luxembourg et 1h30 de TGV de Paris CDG. Ce guide vous aide à trouver les meilleures offres Omra depuis Metz.",
    sections: [
      { h2: "Vols depuis Metz et région Grand Est", text: "Depuis Francfort FRA (1h de route) : Lufthansa, Condor, Saudia — des centaines de vols vers Djeddah, souvent moins chers qu'à Paris. Depuis Luxembourg LUX (45 min) : Luxair, Condor. Depuis Paris CDG (1h30 TGV) : Air France, Saudia direct. L'aéroport Metz-Nancy ETZ offre peu de vols vers l'Arabie Saoudite. Supplément estimé : +80 à +200€ vs Paris." },
      { h2: "Prix Omra depuis Metz 2027", text: "Économique : 980–1 500€. Confort : 1 500–2 350€. Ramadan : 2 100–4 600€. L'accès à Francfort (1h) est un avantage : les prix FRA vers Djeddah sont souvent inférieurs à CDG. Vérifiez Condor depuis Francfort qui propose des offres très compétitives vers Djeddah, notamment en haute saison." },
    ],
    faqs: [
      { q: "Comment partir en Omra depuis Metz ?", a: "Francfort FRA (1h de route) est votre meilleur aéroport : hub majeur avec des centaines de vols vers Djeddah avec Lufthansa, Condor et Saudia, souvent moins chers qu'à Paris. Luxembourg LUX (45 min) est une alternative. Paris CDG est accessible en 1h30 de TGV. Notre comparateur liste les offres disponibles depuis la région Grand Est." },
      { q: "Quel est le prix d'une Omra depuis Metz ?", a: "Comptez entre 980€ et 1 500€ en économique hors Ramadan, et 2 100 à 4 600€ pendant le Ramadan. L'accès à Francfort (1h de route) permet souvent de trouver des tarifs inférieurs à ceux de Paris CDG. Condor depuis Francfort est particulièrement compétitif en haute saison." },
    ],
  },

  "/omra-depuis-clermont-ferrand": {
    title: "Omra depuis Clermont-Ferrand 2027 : Vols, Agences et Prix",
    description: "Omra depuis Clermont-Ferrand 2027 : accès via Lyon (1h30) ou CDG (3h TGV), agences agréées, prix (1 000–4 700€) et guide pour partir depuis l'Auvergne.",
    canonical: "https://omrabonsplans.fr/omra-depuis-clermont-ferrand",
    h1: "Omra depuis Clermont-Ferrand 2027 : Guide Complet",
    intro: "Clermont-Ferrand et l'Auvergne comptent environ 60 000 musulmans. L'aéroport CFE offre peu de vols long-courriers, mais Lyon-Saint Exupéry (1h30 de route) donne accès à Turkish Airlines et d'autres vols vers Djeddah. Voici comment organiser votre Omra depuis Clermont-Ferrand.",
    sections: [
      { h2: "Vols depuis Clermont-Ferrand vers l'Arabie Saoudite", text: "Depuis Lyon-Saint Exupéry LYS (1h30 de route) : Turkish Airlines direct vers Istanbul, Air France, Transavia. Depuis Paris CDG (3h de TGV) : Air France, Saudia, Saudi Arabian Airlines. L'aéroport Clermont-Ferrand CFE propose principalement des destinations de loisirs — peu de connexions directes vers l'Arabie Saoudite. Supplément estimé : +100 à +250€ vs Paris." },
      { h2: "Prix Omra depuis Clermont-Ferrand 2027", text: "Économique : 1 000–1 550€. Confort : 1 550–2 400€. Ramadan : 2 100–4 700€. Depuis Clermont, Lyon (1h30) est souvent préférable à Paris (3h de TGV) : Turkish Airlines via Istanbul depuis LYS propose de bons prix. Les associations islamiques locales organisent des départs groupés compétitifs." },
    ],
    faqs: [
      { q: "Comment partir en Omra depuis Clermont-Ferrand ?", a: "Lyon-Saint Exupéry (LYS, 1h30 de route) est généralement la meilleure option : Turkish Airlines directs vers Istanbul, plus de vols et souvent moins chers que depuis Paris. Paris CDG est accessible en 3h de TGV mais représente plus de 5h de trajet total. Vérifiez les départs groupés organisés par les associations islamiques de Clermont, qui négocient souvent de bons tarifs." },
      { q: "Quel est le prix d'une Omra depuis Clermont-Ferrand ?", a: "Comptez entre 1 000€ et 1 550€ en économique hors Ramadan, et 2 100 à 4 700€ pendant le Ramadan. Depuis Lyon (1h30), Turkish Airlines via Istanbul propose régulièrement des tarifs compétitifs. Réservez 3–4 mois à l'avance pour garantir les meilleures disponibilités." },
    ],
  },

  "/omra-en-octobre-2026": {
    title: "Omra en Octobre 2026 : Prix, Disponibilités et Conseils",
    description: "Omra en octobre 2026 : mois de Rabi' al-Awwal 1448 H. Prix (900-1 800€), températures, disponibilités et guide pour partir en Omra au mois d'octobre 2026.",
    canonical: "https://omrabonsplans.fr/omra-en-octobre-2026",
    h1: "Omra en Octobre 2026 : Guide et Meilleures Offres",
    intro: "Octobre 2026 correspond approximativement au mois de Rabi' al-Awwal 1448 H dans le calendrier islamique. C'est une période de moyenne saison pour l'Omra : les prix sont intermédiaires, les températures restent chaudes à La Mecque (32-38°C) et l'affluence est modérée. Ce guide vous aide à planifier votre Omra en octobre 2026.",
    sections: [
      { h2: "Conditions climatiques en octobre à La Mecque", text: "Températures diurnes : 32-38°C. Températures nocturnes : 22-28°C. Humidité : modérée. Les températures ont baissé par rapport à l'été mais restent importantes. La nuit est plus fraîche et agréable pour le Tawaf nocturne. Hydratation toujours essentielle — prévoyez 2-3 litres d'eau par jour minimum." },
      { h2: "Prix Omra octobre 2026", text: "Hôtel 3★ : 900-1 400€. Hôtel 4★ : 1 400-2 000€. Hôtel 4-5★ proche Haram : 2 000-2 800€. Octobre est une période intermédiaire — pas les prix les plus bas (juillet-septembre) ni les plus élevés (Ramadan). Bonne disponibilité dans la plupart des agences. Réservez 2-3 mois à l'avance pour les meilleures offres." },
    ],
    faqs: [
      { q: "Est-ce une bonne période pour partir en Omra en octobre 2026 ?", a: "Octobre 2026 est une bonne période de transition : plus fraîche que l'été, moins chargée que le Ramadan, avec des prix intermédiaires (900-2 000€). Les rites se déroulent dans de bonnes conditions. C'est une période idéale pour les personnes souhaitant éviter les extrêmes de chaleur et d'affluence, avec un bon équilibre spiritualité-confort-budget." },
      { q: "Quel est le prix d'une Omra en octobre 2026 ?", a: "Les forfaits Omra en octobre 2026 varient de 900€ (hôtel 3★, chambre partagée) à 2 800€ (hôtel 4-5★ proche Haram). En moyenne, un forfait de qualité se situe entre 1 400 et 2 000€. Ce sont des prix intermédiaires — moins chers qu'en hiver ou pendant le Ramadan, légèrement plus chers que la basse saison estivale." },
    ],
  },

  "/omra-en-novembre-2026": {
    title: "Omra en Novembre 2026 : Prix, Disponibilités et Conseils",
    description: "Omra en novembre 2026 : Rabi' al-Thani et Joumada al-Oula 1448 H. Prix (1 000-2 200€), températures agréables (25-32°C) et conseils pour cette période prisée.",
    canonical: "https://omrabonsplans.fr/omra-en-novembre-2026",
    h1: "Omra en Novembre 2026 : Guide et Meilleures Offres",
    intro: "Novembre 2026 est l'une des meilleures périodes pour l'Omra : les températures deviennent agréables à La Mecque (25-32°C), l'affluence est modérée et les prix restent raisonnables avant les pics de décembre. C'est aussi le début de la haute saison — les disponibilités se réduisent. Réservez tôt.",
    sections: [
      { h2: "Pourquoi novembre est une excellente période", text: "Températures diurnes : 25-32°C (très agréables). Températures nocturnes : 18-24°C. Pas de période spéciale (Ramadan ou Hajj) — foules raisonnables. Prix encore modérés avant les pics de décembre. Disponibilité dans la plupart des agences. Excellent compromis pour les familles et les seniors qui ne supportent pas la chaleur estivale." },
      { h2: "Prix Omra novembre 2026", text: "Hôtel 3★ : 1 000-1 600€. Hôtel 4★ : 1 600-2 200€. Hôtel 4-5★ proche Haram : 2 200-3 200€. Les prix de novembre sont légèrement plus élevés qu'en octobre, en raison de la meilleure météo et de la demande accrue. Réservez 2-3 mois à l'avance pour les meilleures offres." },
    ],
    faqs: [
      { q: "Novembre est-il un bon mois pour l'Omra ?", a: "Oui, novembre 2026 est excellent pour l'Omra : températures agréables (25-32°C), foules modérées et prix raisonnables (1 000-2 200€). C'est l'une des meilleures périodes de l'année, juste avant les pics de prix de décembre. Idéal pour les familles, les seniors et les primo-pèlerins qui souhaitent des conditions confortables." },
    ],
  },

  "/omra-en-decembre-2026": {
    title: "Omra en Décembre 2026 : Prix, Vacances Scolaires et Conseils",
    description: "Omra en décembre 2026 : périodes de vacances de Noël, prix élevés (1 800-3 500€), forte demande. Guide complet pour partir en Omra pendant les fêtes de fin d'année.",
    canonical: "https://omrabonsplans.fr/omra-en-decembre-2026",
    h1: "Omra en Décembre 2026 : Guide et Offres pour les Vacances",
    intro: "Décembre 2026 est une période de forte demande pour l'Omra, coïncidant avec les vacances scolaires de Noël. Les prix augmentent significativement mais les conditions climatiques sont excellentes (20-28°C à La Mecque). Beaucoup de familles et de salariés profitent des congés pour accomplir l'Omra. Réservez tôt.",
    sections: [
      { h2: "Avantages de l'Omra en décembre", text: "Températures idéales à La Mecque : 20-28°C le jour, 15-20°C la nuit. Vacances scolaires = famille entière disponible. Nombreux départs groupés organisés par les agences pour les vacances. Conditions climatiques les plus agréables de l'année pour accomplir les rites. La douceur du mois de Joumada al-Thani / Rajab 1448 H." },
      { h2: "Prix Omra décembre 2026", text: "Décembre hors vacances de Noël : 1 400-2 500€. Vacances de Noël (20-31 déc) : 1 800-3 500€. La demande est très forte pendant les vacances — les disponibilités s'amenuisent rapidement. Réservez impérativement 3 à 5 mois à l'avance. Les meilleures agences sont souvent complètes dès l'été pour les dates de Noël." },
    ],
    faqs: [
      { q: "Peut-on partir en Omra pendant les vacances de Noël 2026 ?", a: "Oui, décembre est une excellente période : températures idéales (20-28°C), vacances scolaires. Les prix sont plus élevés (1 800-3 500€ pour les semaines de Noël) et les places limitées. Réservez dès maintenant (idéalement 4-6 mois à l'avance) car les disponibilités s'épuisent rapidement pour cette période très prisée des familles françaises." },
    ],
  },

  "/omra-en-janvier-2027": {
    title: "Omra en Janvier 2027 : Prix, Disponibilités et Conseils",
    description: "Omra en janvier 2027 : mois de Rajab / Sha'ban 1448 H. Prix (1 200-2 800€), températures agréables et conseils pour partir en Omra au début 2027 avant le Ramadan.",
    canonical: "https://omrabonsplans.fr/omra-en-janvier-2027",
    h1: "Omra en Janvier 2027 : Guide et Meilleures Offres",
    intro: "Janvier 2027 correspond à Rajab/Sha'ban 1448 H dans le calendrier islamique — juste avant le Ramadan 2027 estimé en début de février. C'est une période intermédiaire avec des conditions climatiques excellentes à La Mecque. Pour les musulmans souhaitant se préparer spirituellement avant le Ramadan, janvier est une période privilégiée.",
    sections: [
      { h2: "Janvier 2027 : avant le Ramadan", text: "Le Ramadan 2027 est estimé à partir du 10 février 2027. Janvier 2027 est donc le mois de Sha'ban, considéré comme un mois de préparation spirituelle au Ramadan. La tradition islamique recommande d'intensifier les actes d'adoration en Sha'ban. Partir en Omra en janvier 2027 permet d'arriver bien préparé spirituellement pour le jeûne." },
      { h2: "Prix et disponibilités Omra janvier 2027", text: "Hôtel 3★ : 1 200-1 800€. Hôtel 4★ : 1 800-2 500€. Hôtel 5★ proche Haram : 2 500-3 500€. Janvier est une période de forte demande (vacances de début d'année, Sha'ban). Réservez 3-4 mois à l'avance. Température à La Mecque : 22-30°C le jour, 15-20°C la nuit — conditions idéales." },
    ],
    faqs: [
      { q: "Est-ce une bonne période pour partir en Omra en janvier 2027 ?", a: "Oui, janvier 2027 est excellent : températures agréables (22-30°C), mois de Sha'ban (préparation au Ramadan), bonne disponibilité. Si vous souhaitez profiter du Ramadan 2027 (estimé dès le 10 février), partir en Omra en janvier vous permet de vous préparer spirituellement. Les prix sont intermédiaires (1 200-2 500€)." },
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
    "dateModified": "2026-08-16",
  });

  const sectionsHtml = page.sections
    .map((s) => `<section><h2>${escHtml(s.h2)}</h2><p>${escHtml(s.text)}</p></section>`)
    .join("\n");

  const faqsHtml = page.faqs
    .map((f) => `<div><h3>${escHtml(f.q)}</h3><p>${escHtml(f.a)}</p></div>`)
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
  <script type="application/ld+json">${articleSchema}</script>
</head>
<body>
  <nav><a href="https://omrabonsplans.fr">Omra Bons Plans</a> › <a href="https://omrabonsplans.fr/comparatif-agences">Comparer les agences</a></nav>
  <article>
    <h1>${escHtml(page.h1)}</h1>
    <p>${escHtml(page.intro)}</p>
    ${sectionsHtml}
    <section>
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
      // Never cache bot-specific HTML at CDN level — real users would receive
      // the stripped bot page instead of the React SPA.
      "cache-control": "private, no-store",
      "vary": "User-Agent",
    },
  });
}
