export interface AgencyData {
  name: string;
  url: string;
  googleRating: number;
  reviewCount: number;
  strengths: string[];
  weaknesses: string[];
  specialties: string[];
  priceRange: string;
  highlight: string;
}

export const agenciesData: AgencyData[] = [
  {
    name: "Al Sirate Voyage",
    url: "https://www.alsiratevoyage.com/",
    googleRating: 5.0,
    reviewCount: 1015,
    strengths: [
      "Organisation excellente",
      "Guides compétents et bienveillants", 
      "Hôtels bien situés et confortables",
      "Bon service client (disponible et réactif)"
    ],
    weaknesses: [
      "Peu d'avis négatifs visibles (manque de transparence)",
      "Prix parfois élevés",
      "Places limitées sur certaines dates"
    ],
    specialties: ["Omra premium", "Hajj VIP", "Voyages de groupe"],
    priceRange: "Premium",
    highlight: "Note parfaite 5/5 avec organisation d'excellence"
  },
  {
    name: "Omra Du Savoir",
    url: "https://www.omradusavoir.fr/",
    googleRating: 5.0,
    reviewCount: 337,
    strengths: [
      "Guides pédagogues et bienveillants",
      "Dimension spirituelle et éducative (cours, visites, livrets)",
      "Bonne organisation logistique",
      "Groupes à taille humaine, ambiance chaleureuse"
    ],
    weaknesses: [
      "Peu d'avis négatifs visibles (manque de transparence)",
      "Prix plus élevés que offres classiques",
      "Options de départ limitées"
    ],
    specialties: ["Omra éducative", "Séminaires spirituels", "Voyages d'apprentissage"],
    priceRange: "Premium",
    highlight: "Approche pédagogique unique avec note parfaite 5/5"
  },
  {
    name: "Omra Pour Tous",
    url: "https://omrapourtous.com/",
    googleRating: 4.9,
    reviewCount: 4822,
    strengths: [
      "Prix attractifs et clairs",
      "Départs depuis plusieurs villes (Paris, Lyon, Marseille, Bruxelles)",
      "Hôtels 4★/5★, visa inclus",
      "Agence agréée avec excellente réputation"
    ],
    weaknesses: [
      "Hausse des prix en périodes scolaires",
      "Peu de détails précis sur inclus/exclus",
      "Navigation du site peu optimisée",
      "Peu de témoignages clients détaillés visibles"
    ],
    specialties: ["Omra économique", "Séjours courts", "Départs régionaux"],
    priceRange: "Économique",
    highlight: "Leader avec plus de 4800 avis et départs multi-villes"
  },
  {
    name: "TAWAF",
    url: "https://www.tawaf.fr/",
    googleRating: 4.9,
    reviewCount: 1289,
    strengths: [
      "Guides très bienveillants, à l'écoute et pédagogues",
      "Organisation impeccable (administratif, transferts, hébergement)",
      "Hôtels de bon standing près des mosquées",
      "Expérience spirituelle forte et enrichissante"
    ],
    weaknesses: [
      "Quelques déceptions sur l'attitude du guide à certains moments",
      "Moments de stress en logistique/transit parfois",
      "Attentes non toujours satisfaites sur services secondaires"
    ],
    specialties: ["Omra premium", "Hajj VIP", "Séjours spirituels"],
    priceRange: "Premium",
    highlight: "Excellence dans l'accompagnement spirituel et l'organisation"
  },
  {
    name: "Sabile Voyages",
    url: "https://sabilevoyages.com/",
    googleRating: 4.9,
    reviewCount: 154,
    strengths: [
      "Équipe sérieuse et scrupuleuse",
      "Expérience jugée unique",
      "Implication dans l'accompagnement",
      "100% en ligne avec processus optimisé"
    ],
    weaknesses: [
      "Peu de critiques négatives visibles",
      "Difficulté à localiser détails d'avis Google",
      "Pas d'agence physique"
    ],
    specialties: ["100% digital", "Omra familiale", "Voyages sur mesure"],
    priceRange: "Standard",
    highlight: "1ère Agence 100% en ligne avec équipe scrupuleuse"
  },
  {
    name: "Al Maqam Voyages",
    url: "https://almaqamvoyages.com/",
    googleRating: 4.9,
    reviewCount: 349,
    strengths: [
      "Bonne expérience (8+ ans)",
      "Offres variées, départs réguliers",
      "Formules tout inclus (vol, hôtel, transferts, guides)",
      "Témoignages positifs sur organisation et encadrement"
    ],
    weaknesses: [
      "Prix élevés selon périodes",
      "Départs surtout depuis Paris",
      "Peu d'infos sur extras/options",
      "Avis négatifs peu visibles (transparence limitée)"
    ],
    specialties: ["Omra confort", "Hajj premium", "Circuits spirituels"],
    priceRange: "Standard",
    highlight: "8+ ans d'expérience avec formules tout inclus"
  },
  {
    name: "Pèlerin Hajj",
    url: "https://pelerinhajj.com/",
    googleRating: 4.9,
    reviewCount: 1200,
    strengths: [
      "Note élevée avec plus de 1200 avis sur réseaux sociaux",
      "Présence active sur réseaux (visibilité + retours clients)",
      "Tarifs clairs dès 999€",
      "Ancienneté depuis 2018"
    ],
    weaknesses: [
      "Peu de détails sur problèmes potentiels dans avis",
      "Manque d'information claire sur étapes post-paiement",
      "Départs/informations géographiques concentrés (Arcueil)"
    ],
    specialties: ["Omra accessible", "Hajj traditionnel", "Voyages spirituels"],
    priceRange: "Économique",
    highlight: "Forte présence digitale avec tarifs accessibles dès 999€"
  },
  {
    name: "Al Hayat Voyages",
    url: "https://www.alhayat-voyages.com/",
    googleRating: 4.9,
    reviewCount: 478,
    strengths: [
      "Agence agréée + bonne crédibilité",
      "Formules variées (économique/confort)",
      "Bons hôtels, transport sérieux",
      "Très bonne note client"
    ],
    weaknesses: [
      "Prix confort ou saison haute souvent élevés",
      "Manque parfois de clarté sur inclus/exclus",
      "Places limitées selon les dates"
    ],
    specialties: ["Agence agréée", "Formules variées", "Spécialiste Ramadan"],
    priceRange: "Économique-Standard",
    highlight: "Agence officiellement agréée avec formules confort/économique"
  },
  {
    name: "Partir à la Mecque",
    url: "https://partiralamecque.com/",
    googleRating: 4.8,
    reviewCount: 735,
    strengths: [
      "Agence agréée par ministère saoudien du Hajj (n°2386)",
      "Offres Luxe Face Haram, petit déjeuner + visa inclus",
      "Avis globalement positifs, bonne réputation",
      "Informations pratiques claires (paiement, assurance)"
    ],
    weaknesses: [
      "Prix élevés pour offres Luxe et saison haute",
      "Détails parfois limités sur options/inclus vs exclus",
      "Départs principalement depuis Paris"
    ],
    specialties: ["Formules luxe", "Hajj VIP", "Face Haram"],
    priceRange: "Premium",
    highlight: "Agréé officiellement par le ministère saoudien du Hajj"
  },
  {
    name: "Haramain Voyages",
    url: "https://www.haramainvoyages.com/",
    googleRating: 4.8,
    reviewCount: 651,
    strengths: [
      "Très bonne organisation de A à Z (logistique, réunion, suivi)",
      "Guides disponibles, bienveillants, accompagnement spirituel",
      "Communication claire/réactive (WhatsApp, réunions)",
      "Bonne crédibilité avec expériences clients positives"
    ],
    weaknesses: [
      "Occasionnels imprévus logistiques (transferts, hébergement)",
      "Guide prévu pas toujours présent comme prévu",
      "Prix formules premium/haute demande élevés"
    ],
    specialties: ["Hajj & Omra complets", "Omra organisée", "Voyages spirituels"],
    priceRange: "Standard-Premium",
    highlight: "Organisation complète de A à Z avec suivi personnalisé"
  },
  {
    name: "Al Bayt",
    url: "https://www.albayt.fr/",
    googleRating: 4.7,
    reviewCount: 930,
    strengths: [
      "Bonne réputation (13 ans, 98% satisfaction)",
      "Offres variées (Essentielle, Confort, VIP)",
      "Accompagnement complet (vols, hôtels, transferts)",
      "Identité spirituelle rassurante"
    ],
    weaknesses: [
      "Manque de détails clairs sur les formules",
      "Navigation et présentation peu comparatives",
      "Contenu limité (FAQ, blog)",
      "Peu d'outils de fidélisation"
    ],
    specialties: ["Hajj & Omra traditionnel", "Réservation en ligne", "Offres variées"],
    priceRange: "Standard",
    highlight: "Agence pionnière avec 13 ans d'expérience et 98% de satisfaction"
  }
];

// Fonction pour obtenir les informations d'une agence par son nom
export const getAgencyInfo = (agencyName: string): AgencyData | undefined => {
  return agenciesData.find(agency => agency.name === agencyName);
};

