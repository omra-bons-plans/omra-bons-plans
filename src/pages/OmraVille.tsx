import { Helmet } from 'react-helmet-async';
import { Link, useLocation, Navigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Plane from 'lucide-react/dist/esm/icons/plane';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Star from 'lucide-react/dist/esm/icons/star';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';

interface AgenceLocale {
  nom: string;
  adresse?: string;
  note?: number;
  presence: 'bureau' | 'partenaire' | 'agréée';
}

interface VilleData {
  nom: string;
  dep: string;
  aeroport: string;
  codeAero: string;
  volDuree: string;
  volCompagnies: string[];
  volEscale?: string;
  supplement: string;
  supplementNum: string;
  agences: AgenceLocale[];
  description: string;
  specificite: string;
  conseilPro: string;
  communaute: string;
  itineraireAero: string;
  prixEco: string;
  prixConfort: string;
  prixRamadan: string;
}

const SITE = 'https://omrabonsplans.fr';

const villesData: Record<string, VilleData> = {
  paris: {
    nom: 'Paris',
    dep: 'Paris — Île-de-France',
    aeroport: 'Charles de Gaulle (CDG) / Orly (ORY)',
    codeAero: 'CDG / ORY',
    volDuree: '6h30 à 7h30',
    volCompagnies: ['Air France', 'Saudia', 'Transavia', 'Air Algérie', 'Royal Air Maroc', 'Turkish Airlines'],
    supplement: 'Prix de référence — le moins cher de France',
    supplementNum: '0€',
    agences: [
      { nom: 'Tawaf', adresse: 'Paris 75012', note: 4.7, presence: 'bureau' },
      { nom: 'Medinvoyages', adresse: 'Clichy 92110', note: 4.5, presence: 'bureau' },
      { nom: 'Al Maqam Voyages', adresse: 'Paris 75011', note: 4.4, presence: 'bureau' },
      { nom: 'Pelerinhajj', adresse: 'Aubervilliers 93300', note: 4.6, presence: 'bureau' },
      { nom: 'Omra Sounnah', adresse: 'Sartrouville 78500', note: 4.3, presence: 'bureau' },
      { nom: 'Omra Pour Tous', adresse: 'Paris / Marseille', note: 4.5, presence: 'bureau' },
      { nom: 'Al Sirate Voyage', adresse: 'Paris 75010', note: 4.2, presence: 'bureau' },
      { nom: 'Haramain Voyages', adresse: 'Paris 75010', note: 4.4, presence: 'bureau' },
      { nom: 'Labbayk', adresse: 'Île-de-France', note: 4.3, presence: 'bureau' },
      { nom: 'TAWAF', adresse: 'Paris', note: 4.6, presence: 'bureau' },
    ],
    description: "Paris est la capitale du pèlerinage Omra en France. Avec plus de 2 millions de musulmans en Île-de-France, la ville concentre le plus grand nombre d'agences agréées (15+) et de départs quotidiens vers La Mecque. C'est depuis Paris que partent la majorité des pèlerins français.",
    specificite: "Vols directs quotidiens Saudia et Air France vers Djeddah et Médine. Plus de 15 agences agréées avec bureau physique. Départs de groupe réguliers depuis plusieurs points en Île-de-France. Prix les plus compétitifs de France.",
    conseilPro: "Depuis Paris, vous avez accès aux meilleurs prix ET au plus grand choix d'agences. Privilégiez les vols Saudia directs CDG-JED (Djeddah) : plus rapides et souvent moins chers. Évitez les escales longues (3h+) qui épuisent inutilement avant le pèlerinage.",
    communaute: "Île-de-France abrite la plus grande communauté musulmane de France avec +2 millions de fidèles. Grande Mosquée de Paris, Institut Musulman, mosquées dans chaque arrondissement. Regroupements et départs collectifs organisés régulièrement.",
    itineraireAero: "RER B → CDG (30 min depuis Paris Nord) · Orlyval → Orly · Navettes directes depuis Paris 13e (Chinatown) et Paris 18e",
    prixEco: '900€ – 1 400€',
    prixConfort: '1 400€ – 2 200€',
    prixRamadan: '2 000€ – 4 500€',
  },
  lyon: {
    nom: 'Lyon',
    dep: 'Lyon — Auvergne-Rhône-Alpes',
    aeroport: 'Lyon-Saint Exupéry (LYS)',
    codeAero: 'LYS',
    volDuree: '7h à 9h (via Paris ou Istanbul)',
    volCompagnies: ['Air France via CDG', 'Turkish Airlines via Istanbul', 'Transavia', 'Royal Air Maroc via Casablanca'],
    volEscale: 'Via Paris CDG, Istanbul ou Casablanca selon les offres',
    supplement: '+50 à +150€ par rapport à Paris',
    supplementNum: '+100€',
    agences: [
      { nom: 'Tawaf', adresse: 'Venissieux 69200', note: 4.6, presence: 'bureau' },
      { nom: 'Medinvoyages', note: 4.5, presence: 'partenaire' },
      { nom: 'Omra Pour Tous', adresse: 'Lyon 69007', note: 4.4, presence: 'bureau' },
      { nom: 'Al Maqam Voyages', note: 4.4, presence: 'partenaire' },
      { nom: 'Haramain Voyages', note: 4.3, presence: 'partenaire' },
    ],
    description: "Lyon est la deuxième ville française pour le pèlerinage Omra. La métropole lyonnaise abrite une communauté musulmane d'environ 300 000 personnes, principalement dans les communes de Vénissieux, Vaulx-en-Velin et Bron. Plusieurs agences locales proposent des départs organisés depuis Lyon.",
    specificite: "Vols directs saisonniers vers Djeddah disponibles en haute saison. Turkish Airlines propose d'excellentes correspondances via Istanbul. En basse saison, certains pèlerins rejoignent Paris en TGV (2h) pour accéder à plus d'offres.",
    conseilPro: "Turkish Airlines via Istanbul est souvent le meilleur rapport qualité-prix depuis Lyon. L'escale à Istanbul est courte (2-3h) et l'aéroport est confortable. Vérifiez aussi les vols Royal Air Maroc via Casablanca : moins connus mais très compétitifs.",
    communaute: "Forte communauté maghrébine et turque dans la métropole lyonnaise. Mosquée de Lyon (Gerland), Grande Mosquée de Vénissieux, mosquées dans Vaulx-en-Velin et Bron. Associations islamiques très actives organisant des voyages de groupe.",
    itineraireAero: "Tram T3 → Part-Dieu → Rhonexpress → LYS (30 min) · Navettes depuis Vénissieux, Vaulx-en-Velin",
    prixEco: '950€ – 1 450€',
    prixConfort: '1 500€ – 2 300€',
    prixRamadan: '2 100€ – 4 600€',
  },
  marseille: {
    nom: 'Marseille',
    dep: 'Marseille — Provence-Alpes-Côte d\'Azur',
    aeroport: 'Marseille Provence (MRS)',
    codeAero: 'MRS',
    volDuree: '6h30 à 8h30',
    volCompagnies: ['Air France via CDG', 'Transavia', 'Saudia via Djeddah', 'Royal Air Maroc via Casablanca', 'Air Algérie via Alger'],
    volEscale: 'Quelques vols directs Marseille-Djeddah en haute saison',
    supplement: '+30 à +100€ par rapport à Paris',
    supplementNum: '+60€',
    agences: [
      { nom: 'Omra Pour Tous', adresse: 'Marseille 13001', note: 4.5, presence: 'bureau' },
      { nom: 'Omra Sounnah', adresse: 'Marseille 13003', note: 4.3, presence: 'bureau' },
      { nom: 'Tawaf', note: 4.6, presence: 'partenaire' },
      { nom: 'Medinvoyages', note: 4.5, presence: 'partenaire' },
      { nom: 'Pelerinhajj', note: 4.4, presence: 'partenaire' },
    ],
    description: "Marseille est l'une des villes françaises avec la plus forte proportion de musulmans (estimée à 30-40% de la population). La demande pour l'Omra y est considérable et les agences locales proposent des offres adaptées. Certains vols charters directs Marseille-Djeddah sont disponibles en haute saison.",
    specificite: "Vols charters directs Marseille-Djeddah disponibles pendant le Ramadan et les grandes périodes. Air Algérie propose des connexions via Alger à prix compétitifs. Royal Air Maroc via Casablanca est très prisé par la communauté maghrébine marseillaise.",
    conseilPro: "Marseille a l'avantage de vols relativement directs grâce à Air Algérie et aux charters en saison. Surveillez aussi les offres de groupe organisées par les mosquées locales — elles négocient souvent de très bons tarifs bloc. En dehors du Ramadan, le passage par Paris reste souvent le plus économique.",
    communaute: "Communauté musulmane très importante : Grande Mosquée de Marseille (Castellane), mosquées dans les 1er, 3e, 13e, 14e arrondissements. Nombreuses associations islamiques actives (AEAM, Mosquée As-Salam). Départs de groupe très fréquents.",
    itineraireAero: "Navette Aéroport depuis la Gare St-Charles (25 min, 10€) · Métro M1 → Gare St-Charles · Navettes depuis Noailles et Belsunce",
    prixEco: '950€ – 1 400€',
    prixConfort: '1 450€ – 2 200€',
    prixRamadan: '2 000€ – 4 200€',
  },
  toulouse: {
    nom: 'Toulouse',
    dep: 'Toulouse — Occitanie',
    aeroport: 'Toulouse-Blagnac (TLS)',
    codeAero: 'TLS',
    volDuree: '7h à 9h30',
    volCompagnies: ['Air France via CDG', 'Transavia via CDG', 'Turkish Airlines via Istanbul', 'Royal Air Maroc via Casablanca'],
    volEscale: 'Via Paris CDG (principal), Istanbul ou Casablanca',
    supplement: '+80 à +200€ par rapport à Paris',
    supplementNum: '+130€',
    agences: [
      { nom: 'Tawaf', note: 4.6, presence: 'partenaire' },
      { nom: 'Medinvoyages', note: 4.5, presence: 'partenaire' },
      { nom: 'Al Maqam Voyages', note: 4.4, presence: 'partenaire' },
      { nom: 'Omra Sounnah', note: 4.3, presence: 'partenaire' },
    ],
    description: "Toulouse et l'Occitanie comptent une communauté musulmane de plus de 200 000 personnes. La ville rose voit une demande croissante pour l'Omra. Si les vols directs sont rares, les correspondances via Paris ou Istanbul permettent d'accéder facilement à La Mecque.",
    specificite: "Pas de vol direct Toulouse-La Mecque, mais excellentes correspondances Air France via CDG. Turkish Airlines offre de bonnes connexions via Istanbul avec des prix compétitifs. En dehors des vacances scolaires, certains pèlerins préfèrent prendre le TGV Paris puis partir de CDG.",
    conseilPro: "Turkish Airlines depuis Toulouse via Istanbul est souvent le meilleur deal : 2 bagages inclus, bon service, escale courte. Comparez avec Air France via CDG — parfois les deux billets (TLS-CDG + CDG-JED) séparés sont moins chers que le tout-en-un.",
    communaute: "Communauté maghrébine et africaine importante. Mosquée de Toulouse (Bellefontaine), Mosquée El Islah. Associations toulousaines organisant des voyages de groupe Omra, notamment pendant les vacances de printemps.",
    itineraireAero: "Tram T2 → Aéroport Blagnac (20 min) · Bus 66 · Navettes depuis le centre-ville",
    prixEco: '980€ – 1 500€',
    prixConfort: '1 500€ – 2 300€',
    prixRamadan: '2 100€ – 4 500€',
  },
  nice: {
    nom: 'Nice',
    dep: 'Nice — Côte d\'Azur',
    aeroport: 'Nice Côte d\'Azur (NCE)',
    codeAero: 'NCE',
    volDuree: '7h à 9h',
    volCompagnies: ['Air France via CDG', 'Transavia', 'EasyJet vers CDG', 'Turkish Airlines via Istanbul'],
    volEscale: 'Via Paris CDG ou Istanbul selon les périodes',
    supplement: '+100 à +250€ par rapport à Paris',
    supplementNum: '+170€',
    agences: [
      { nom: 'Tawaf', note: 4.6, presence: 'partenaire' },
      { nom: 'Medinvoyages', note: 4.5, presence: 'partenaire' },
      { nom: 'Omra Pour Tous', note: 4.4, presence: 'partenaire' },
    ],
    description: "Nice et la Côte d'Azur comptent environ 150 000 musulmans. La région abrite des communautés maghrébines actives notamment dans les quartiers de l'Ariane et Saint-Augustin. L'offre d'Omra y est plus limitée qu'à Marseille, mais les agences nationales couvrent bien la région.",
    specificite: "Peu de vols directs Nice-Arabie Saoudite. Turkish Airlines via Istanbul reste la meilleure option qualité-prix depuis NCE. Certains pèlerins de la région PACA préfèrent partir depuis Marseille (1h30 de route) pour accéder à plus de vols.",
    conseilPro: "Si vous habitez entre Nice et Monaco, comparez systématiquement les vols depuis NCE et depuis MRS (Marseille). Avec 1h30 de route, partir de Marseille peut vous faire économiser 100-200€ sur votre billet. Pensez aussi à Milan Malpensa pour les ressortissants proches de la frontière italienne.",
    communaute: "Mosquée El Khayr (Nice), Mosquée Es-Salat. Associations islamiques dans les Alpes-Maritimes. Départs de groupe organisés principalement pendant le Ramadan et les vacances estivales.",
    itineraireAero: "Bus 99 Aéroport → Nice Gare (30 min, 6€) · Tram T2 direct · Taxi (25-35€)",
    prixEco: '1 000€ – 1 550€',
    prixConfort: '1 550€ – 2 400€',
    prixRamadan: '2 200€ – 4 800€',
  },
  bordeaux: {
    nom: 'Bordeaux',
    dep: 'Bordeaux — Nouvelle-Aquitaine',
    aeroport: 'Bordeaux-Mérignac (BOD)',
    codeAero: 'BOD',
    volDuree: '7h30 à 10h',
    volCompagnies: ['Air France via CDG', 'Transavia', 'Royal Air Maroc via Casablanca', 'Turkish Airlines via Istanbul'],
    volEscale: 'Via Paris CDG principalement, ou Casablanca',
    supplement: '+100 à +250€ par rapport à Paris',
    supplementNum: '+160€',
    agences: [
      { nom: 'Tawaf', note: 4.6, presence: 'partenaire' },
      { nom: 'Omra Pour Tous', note: 4.4, presence: 'partenaire' },
      { nom: 'Medinvoyages', note: 4.5, presence: 'partenaire' },
      { nom: 'Pelerinhajj', note: 4.4, presence: 'partenaire' },
    ],
    description: "Bordeaux et la Nouvelle-Aquitaine connaissent une croissance de leur communauté musulmane, estimée à 120 000 personnes. La demande pour l'Omra augmente chaque année. Les agences nationales couvrent la région, et certaines mosquées bordelaises organisent des voyages de groupe.",
    specificite: "Vols principalement via Paris CDG avec Air France ou Transavia. Royal Air Maroc via Casablanca est une bonne alternative compétitive. La TGV Paris-Bordeaux (2h) permet à certains pèlerins de partir de CDG pour accéder au plus grand choix d'offres.",
    conseilPro: "Depuis Bordeaux, Royal Air Maroc via Casablanca est souvent moins cher que Air France via Paris. L'escale à Casablanca (2-3h) est agréable et l'aéroport bien équipé. Comparez avec les offres de départ depuis Paris — le TGV 2h peut valoir le coup si le vol est 200€ moins cher.",
    communaute: "Mosquée Bordeaux-Mériadeck, Mosquée Al-Ihsane. Associations islamiques en Gironde. Communauté marocaine et algérienne importante dans les quartiers de Bacalan et Bordeaux-Nord.",
    itineraireAero: "Bus 1 ou 45 → Mérignac Aéroport (40 min) · Navette Jet'Bus (25 min, 8€) depuis la Gare St-Jean",
    prixEco: '1 000€ – 1 550€',
    prixConfort: '1 550€ – 2 400€',
    prixRamadan: '2 100€ – 4 600€',
  },
  strasbourg: {
    nom: 'Strasbourg',
    dep: 'Strasbourg — Grand Est / Alsace',
    aeroport: 'Strasbourg Entzheim (SXB)',
    codeAero: 'SXB',
    volDuree: '8h à 10h',
    volCompagnies: ['Air France via CDG', 'Lufthansa via Francfort', 'Turkish Airlines via Istanbul', 'Royal Air Maroc via Casablanca'],
    volEscale: 'Via Paris CDG ou Francfort (FRA) — deux options de qualité',
    supplement: '+80 à +200€ par rapport à Paris',
    supplementNum: '+130€',
    agences: [
      { nom: 'Tawaf', note: 4.6, presence: 'partenaire' },
      { nom: 'Medinvoyages', note: 4.5, presence: 'partenaire' },
      { nom: 'Al Maqam Voyages', note: 4.4, presence: 'partenaire' },
      { nom: 'Haramain Voyages', note: 4.3, presence: 'bureau' },
    ],
    description: "Strasbourg et l'Alsace ont une communauté musulmane d'environ 200 000 personnes, l'une des plus importantes de l'Est de la France. La ville est à la frontière allemande, ce qui ouvre un accès facile à l'aéroport de Francfort (FRA), l'un des plus grands hubs d'Europe.",
    specificite: "Strasbourg a l'avantage unique d'avoir accès à Francfort (FRA) à seulement 1h de route. Lufthansa et Condor proposent d'excellents vols FRA-JED à des prix très compétitifs. En option française, l'accès à Paris CDG (2h30 de TGV) reste viable pour accéder aux vols directs.",
    conseilPro: "L'astuce de Strasbourg : comparez systématiquement les vols depuis SXB, FRA (Francfort, 1h de route) et CDG (2h30 de TGV). Francfort est souvent 15-30% moins cher que Paris pour les vols vers Djeddah. Lufthansa ou Condor depuis FRA offrent d'excellentes prestations.",
    communaute: "Mosquée Eyüp Sultan (Strasbourg, 1 300 places), Grande Mosquée de Schiltigheim, mosquées dans Hautepierre et Cronenbourg. Communauté turque, maghrébine et pakistanaise très active. Institut Musulman d'Alsace.",
    itineraireAero: "Train Navette TER → Gare de Strasbourg (20 min, 5€) · Bus 60 · Accès Francfort FRA par Flixbus ou voiture (1h)",
    prixEco: '980€ – 1 500€',
    prixConfort: '1 500€ – 2 300€',
    prixRamadan: '2 100€ – 4 500€',
  },
  lille: {
    nom: 'Lille',
    dep: 'Lille — Hauts-de-France',
    aeroport: 'Lille-Lesquin (LIL)',
    codeAero: 'LIL',
    volDuree: '7h30 à 9h30',
    volCompagnies: ['Air France via CDG', 'Transavia', 'Brussels Airlines via Bruxelles', 'Turkish Airlines via Istanbul'],
    volEscale: 'Via Paris CDG (1h en TGV) ou Bruxelles (35 min en train)',
    supplement: '+50 à +150€ (ou partir depuis Paris CDG)',
    supplementNum: '+80€',
    agences: [
      { nom: 'Omra Sounnah', adresse: 'Roubaix 59100', note: 4.3, presence: 'bureau' },
      { nom: 'Tawaf', note: 4.6, presence: 'partenaire' },
      { nom: 'Medinvoyages', note: 4.5, presence: 'partenaire' },
      { nom: 'Pelerinhajj', note: 4.4, presence: 'partenaire' },
    ],
    description: "Lille et les Hauts-de-France abritent une grande communauté musulmane d'environ 250 000 personnes, notamment dans les secteurs de Roubaix, Tourcoing, et Villeneuve-d'Ascq. La proximité avec Paris (1h en Eurostar/TGV) et Bruxelles (35 min) donne accès à deux grands hubs aériens.",
    specificite: "Lille a l'avantage géographique unique d'être à la fois proche de Paris CDG (1h de TGV) et de Bruxelles Zaventem (35 min en train). Brussels Airlines propose des vols vers Djeddah depuis Bruxelles à des tarifs parfois très compétitifs, avec le confort d'un grand hub européen.",
    conseilPro: "Depuis Lille, comparez toujours les trois options : vols depuis LIL, depuis Bruxelles BRU (35 min de train), et depuis CDG (1h de TGV). Bruxelles propose souvent les meilleurs prix grâce aux vols Brussels Airlines directs vers Djeddah. L'Eurostar ou le TGV Bruxelles-Midi sont rapides et confortables.",
    communaute: "Grande Mosquée de Lille (Wazemmes), Mosquée Al-Islah à Roubaix, Mosquée à Tourcoing. Communauté maghrébine très importante dans le secteur Roubaix-Tourcoing. Nombreux départs de groupe organisés depuis les mosquées locales.",
    itineraireAero: "Bus 68 → Lesquin Aéroport (30 min) · Accès Bruxelles BRU : Thalys ou train (35-45 min) · CDG : Eurostar direct (1h)",
    prixEco: '950€ – 1 450€',
    prixConfort: '1 450€ – 2 300€',
    prixRamadan: '2 000€ – 4 400€',
  },
  nantes: {
    nom: 'Nantes',
    dep: 'Nantes — Pays de la Loire',
    aeroport: 'Nantes Atlantique (NTE)',
    codeAero: 'NTE',
    volDuree: '7h30 à 10h',
    volCompagnies: ['Air France via CDG', 'Transavia', 'easyJet vers CDG', 'Royal Air Maroc via Casablanca'],
    volEscale: 'Via Paris CDG (2h15 de TGV) principalement',
    supplement: '+100 à +250€ par rapport à Paris',
    supplementNum: '+160€',
    agences: [
      { nom: 'Tawaf', note: 4.6, presence: 'partenaire' },
      { nom: 'Omra Pour Tous', note: 4.4, presence: 'partenaire' },
      { nom: 'Medinvoyages', note: 4.5, presence: 'partenaire' },
    ],
    description: "Nantes et les Pays de la Loire comptent environ 100 000 musulmans. La ville est la 6e agglomération française et connaît une croissance de sa communauté. La demande pour l'Omra augmente chaque année, portée notamment par les associations islamiques locales.",
    specificite: "Peu de vols directs depuis Nantes vers l'Arabie Saoudite. Paris CDG est accessible en 2h15 de TGV — beaucoup de pèlerins nantais choisissent de partir depuis Paris pour accéder à plus de vols et de prix. Royal Air Maroc via Casablanca est une alternative compétitive.",
    conseilPro: "Le TGV Nantes-Paris (2h15) ouvre l'accès à tous les vols CDG. Comparez : billet TGV (60-90€) + vol Paris-Djeddah vs vol direct Nantes (quand disponible). Souvent le passage par Paris est moins cher au total, surtout en réservant tôt. Vérifiez aussi Vueling via Barcelone qui propose parfois des connexions intéressantes.",
    communaute: "Mosquée Nantes-Doulon, Association Musulmane des Pays de la Loire. Communauté maghrébine et turque dans les quartiers de Bellevue et Malakoff. Départs de groupe organisés pendant le Ramadan.",
    itineraireAero: "Tram 3 → Aéroport (25 min) · Navette AirExpress depuis la Gare SNCF",
    prixEco: '1 000€ – 1 550€',
    prixConfort: '1 550€ – 2 400€',
    prixRamadan: '2 100€ – 4 700€',
  },
  rennes: {
    nom: 'Rennes',
    dep: 'Rennes — Bretagne',
    aeroport: 'Rennes Saint-Jacques (RNS)',
    codeAero: 'RNS',
    volDuree: '7h30 à 10h',
    volCompagnies: ['Air France via CDG', 'Transavia via CDG', 'Royal Air Maroc via Casablanca'],
    volEscale: 'Via Paris CDG (1h30 de TGV) principalement',
    supplement: '+80 à +200€ par rapport à Paris',
    supplementNum: '+130€',
    agences: [
      { nom: 'Tawaf', note: 4.6, presence: 'partenaire' },
      { nom: 'Medinvoyages', note: 4.5, presence: 'partenaire' },
      { nom: 'Omra Pour Tous', note: 4.4, presence: 'partenaire' },
    ],
    description: "Rennes et la Bretagne comptent environ 80 000 musulmans. La capitale bretonne, reliée à Paris en 1h30 de TGV, offre un excellent accès aux vols au départ de CDG. La communauté musulmane rennaise est principalement d'origine maghrébine et subsaharienne.",
    specificite: "La proximité de Rennes avec Paris (1h30 de TGV) en fait l'une des villes les mieux connectées à CDG en dehors de l'Île-de-France. Beaucoup de pèlerins bretons rejoignent Paris pour partir. Des vols depuis l'aéroport RNS sont disponibles mais rares.",
    conseilPro: "Depuis Rennes, le TGV vers Paris CDG (1h30, souvent moins de 50€ en avance) est probablement votre meilleure option. Arrivez à CDG 3h avant votre vol Omra — la connexion train/aéroport est excellente. Comparez aussi les vols depuis Nantes NTE (1h de route depuis Rennes).",
    communaute: "Mosquée de Rennes (Cleunay), Association Culturelle Islamique de Bretagne. Communauté en croissance avec des jeunes générations très pratiquantes. Départs de groupe pendant le Ramadan et les grandes vacances.",
    itineraireAero: "Bus 57 → Aéroport Saint-Jacques (25 min) · Gare Rennes → CDG en TGV (1h30)",
    prixEco: '980€ – 1 500€',
    prixConfort: '1 500€ – 2 300€',
    prixRamadan: '2 000€ – 4 500€',
  },
  montpellier: {
    nom: 'Montpellier',
    dep: 'Montpellier — Hérault / Occitanie',
    aeroport: 'Montpellier Méditerranée (MPL)',
    codeAero: 'MPL',
    volDuree: '7h à 9h30',
    volCompagnies: ['Air France via CDG', 'Transavia', 'Air Algérie via Alger', 'Royal Air Maroc via Casablanca'],
    volEscale: 'Via Paris CDG ou Alger/Casablanca selon les origines',
    supplement: '+80 à +200€ par rapport à Paris',
    supplementNum: '+130€',
    agences: [
      { nom: 'Omra Pour Tous', note: 4.4, presence: 'partenaire' },
      { nom: 'Tawaf', note: 4.6, presence: 'partenaire' },
      { nom: 'Medinvoyages', note: 4.5, presence: 'partenaire' },
      { nom: 'Omra Sounnah', note: 4.3, presence: 'partenaire' },
    ],
    description: "Montpellier a l'une des plus fortes proportions de musulmans en France (estimée à 25-30% de la population). La ville universitaire attire de nombreux étudiants musulmans et la demande pour l'Omra est en forte croissance. Air Algérie propose des connexions directes depuis Montpellier via Alger.",
    specificite: "Air Algérie vole directement de Montpellier vers Alger, depuis où des vols vers Djeddah sont disponibles. Cette option est compétitive pour les ressortissants algériens. Pour les autres, les vols via Paris CDG restent la principale option. Marseille (1h30) offre plus de vols alternatifs.",
    conseilPro: "Montpellier a une particularité : Air Algérie propose des connexions MPL-ALG-JED qui peuvent être très compétitives si vous avez un passeport algérien ou des bagages supplémentaires inclus. Comparez aussi avec des départs depuis Marseille (1h30 de route) qui propose des vols charters en haute saison.",
    communaute: "Mosquée de Montpellier (La Paillade), Mosquée Rahma, nombreuses salles de prière dans les quartiers populaires. Communauté maghrébine très importante notamment dans La Paillade et Croix-d'Argent. AMAL (Association Musulmane de l'Agglomération de Montpellier).",
    itineraireAero: "Tram L1 → Aéroport (20 min, terminus Aéroport) · Navette directe depuis la gare",
    prixEco: '980€ – 1 500€',
    prixConfort: '1 500€ – 2 300€',
    prixRamadan: '2 100€ – 4 600€',
  },
  grenoble: {
    nom: 'Grenoble',
    dep: 'Grenoble — Isère / Auvergne-Rhône-Alpes',
    aeroport: 'Grenoble-Alpes Isère (GNB) / Lyon-Saint Exupéry (LYS)',
    codeAero: 'GNB / LYS',
    volDuree: '7h à 9h30',
    volCompagnies: ['Air France via CDG', 'Turkish Airlines via Istanbul (depuis Lyon)', 'Transavia', 'Royal Air Maroc via Casablanca'],
    volEscale: 'Via Lyon LYS (1h) ou Paris CDG (3h de TGV)',
    supplement: '+80 à +200€ par rapport à Paris',
    supplementNum: '+130€',
    agences: [
      { nom: 'Tawaf', note: 4.6, presence: 'partenaire' },
      { nom: 'Medinvoyages', note: 4.5, presence: 'partenaire' },
      { nom: 'Al Maqam Voyages', note: 4.4, presence: 'partenaire' },
    ],
    description: "Grenoble est connue pour avoir l'une des plus grandes proportions de résidents d'origine étrangère en France. La ville compte environ 100 000 musulmans, notamment dans les quartiers de Villeneuve et Mistral. La proximité avec Lyon (1h) donne accès à un grand hub aérien.",
    specificite: "Grenoble a l'avantage d'être à 1h de Lyon Saint-Exupéry, qui propose des vols Turkish Airlines directs vers Istanbul puis La Mecque. L'aéroport de Grenoble GNB est principalement utilisé pour les vols charter ski mais dispose de quelques liaisons internationales.",
    conseilPro: "Depuis Grenoble, Lyon est votre meilleur aéroport de départ. Turkish Airlines via Istanbul depuis LYS propose régulièrement de bons prix et des vols pratiques. Vérifiez aussi les offres groupées organisées par les associations islamiques grenobloises qui négocient souvent en bloc avec les agences.",
    communaute: "Mosquée Al-Kawthar (Grenoble), Mosquée du Chemin Bas d'Echirolles, nombreuses associations islamiques dans l'agglomération. Communauté maghrébine et turque très importante dans les Hauts de Grenoble.",
    itineraireAero: "Bus 11X → Gare Grenoble → Navette LYS (1h) · Tramway → Grenoble Gare → GNB Aéroport (30 min)",
    prixEco: '980€ – 1 500€',
    prixConfort: '1 500€ – 2 350€',
    prixRamadan: '2 100€ – 4 600€',
  },
  metz: {
    nom: 'Metz',
    dep: 'Metz — Moselle / Grand Est',
    aeroport: 'Metz-Nancy Lorraine (ETZ)',
    codeAero: 'ETZ',
    volDuree: '8h à 10h30',
    volCompagnies: ['Air France via CDG', 'Lufthansa via Francfort', 'Turkish Airlines via Istanbul'],
    volEscale: 'Via Paris CDG (1h30 de TGV), Francfort FRA (1h de route) ou Luxembourg LUX (45 min)',
    supplement: '+80 à +200€ par rapport à Paris',
    supplementNum: '+130€',
    agences: [
      { nom: 'Tawaf', note: 4.6, presence: 'partenaire' },
      { nom: 'Haramain Voyages', note: 4.3, presence: 'partenaire' },
      { nom: 'Al Maqam Voyages', note: 4.4, presence: 'partenaire' },
    ],
    description: "Metz et la Moselle comptent une communauté musulmane d'environ 80 000 personnes, principalement d'origine maghrébine. La région Grand Est a la particularité d'être frontalière avec l'Allemagne et le Luxembourg, ouvrant l'accès à plusieurs aéroports internationaux.",
    specificite: "Metz a trois options aéroportuaires : ETZ local (peu de vols internationaux), Francfort FRA à 1h de route (hub Lufthansa majeur), et Luxembourg LUX à 45 min. CDG est accessible en 1h30 de TGV. Cette position géographique permet de comparer un large panel d'offres.",
    conseilPro: "Depuis Metz, Francfort est votre atout caché : à 1h de route, FRA propose des centaines de vols vers Djeddah avec Lufthansa, Condor, Saudia. Les prix depuis Francfort sont souvent inférieurs à ceux depuis Paris. Vérifiez aussi Luxembourg LUX (45 min) qui propose parfois des bonnes offres Luxair/Condor.",
    communaute: "Mosquée de Metz (Borny), Mosquée Essalam à Woippy. Communauté algérienne et marocaine importante dans les quartiers populaires de Metz. Associations islamiques actives en Moselle.",
    itineraireAero: "Bus → Gare Metz → Navette ETZ · Accès Francfort FRA par Flixbus ou voiture (1h) · TGV Metz → Paris CDG (1h30)",
    prixEco: '980€ – 1 500€',
    prixConfort: '1 500€ – 2 350€',
    prixRamadan: '2 100€ – 4 600€',
  },
  clermont: {
    nom: 'Clermont-Ferrand',
    dep: 'Clermont-Ferrand — Puy-de-Dôme / Auvergne',
    aeroport: 'Clermont-Ferrand Auvergne (CFE)',
    codeAero: 'CFE',
    volDuree: '7h30 à 10h',
    volCompagnies: ['Air France via CDG', 'Transavia via CDG'],
    volEscale: 'Via Paris CDG (3h de TGV) principalement',
    supplement: '+100 à +250€ par rapport à Paris',
    supplementNum: '+170€',
    agences: [
      { nom: 'Tawaf', note: 4.6, presence: 'partenaire' },
      { nom: 'Omra Pour Tous', note: 4.4, presence: 'partenaire' },
      { nom: 'Medinvoyages', note: 4.5, presence: 'partenaire' },
    ],
    description: "Clermont-Ferrand et l'Auvergne comptent environ 60 000 musulmans. La ville, connue pour ses universités et son industrie (Michelin), accueille de nombreux étudiants et travailleurs d'origine maghrébine qui souhaitent accomplir l'Omra depuis leur région.",
    specificite: "L'aéroport CFE est principalement utilisé pour des destinations de loisirs. Les pèlerins clermontois ont principalement deux options : le TGV vers Paris CDG (3h), ou rejoindre Lyon LYS (1h30 de route) pour accéder à plus de vols.",
    conseilPro: "Depuis Clermont, Lyon est souvent une meilleure option que Paris : 1h30 de route vs 3h de TGV, et l'aéroport LYS propose Turkish Airlines directs vers Istanbul. Comparez les deux options selon les dates — en haute saison, Lyon a souvent les meilleures offres pour l'Auvergne.",
    communaute: "Mosquée de Clermont-Ferrand (Secteur Montferrand), Association Culturelle Islamique d'Auvergne. Communauté algérienne et marocaine dans les quartiers populaires. Départs de groupe organisés par les associations locales.",
    itineraireAero: "Bus 44 → Aéroport CFE (30 min) · Accès Lyon LYS par autoroute A72 (1h30)",
    prixEco: '1 000€ – 1 550€',
    prixConfort: '1 550€ – 2 400€',
    prixRamadan: '2 100€ – 4 700€',
  },
};

const TOUTES_LES_VILLES = Object.keys(villesData);

function PresenceBadge({ presence }: { presence: AgenceLocale['presence'] }) {
  if (presence === 'bureau') return <Badge className="text-xs bg-green-100 text-green-800 border-green-200">Bureau local</Badge>;
  if (presence === 'partenaire') return <Badge variant="outline" className="text-xs">Agréée nationale</Badge>;
  return <Badge variant="secondary" className="text-xs">Agréée</Badge>;
}

export default function OmraVille() {
  const location = useLocation();
  const ville = location.pathname.replace('/omra-depuis-', '');
  const slug = ville.toLowerCase().replace(/-/g, '').replace(/é|è|ê|ë/g, 'e').replace(/à|â/g, 'a');

  // Mapping slug → key
  const keyMap: Record<string, string> = {
    paris: 'paris', lyon: 'lyon', marseille: 'marseille', toulouse: 'toulouse',
    nice: 'nice', bordeaux: 'bordeaux', strasbourg: 'strasbourg', lille: 'lille',
    nantes: 'nantes', rennes: 'rennes', montpellier: 'montpellier',
    grenoble: 'grenoble', metz: 'metz', clermontferrand: 'clermont', clermont: 'clermont',
  };
  const key = keyMap[slug] || slug;
  const data = villesData[key];

  if (!data) return <Navigate to="/" replace />;

  const urlSlug = ville.toLowerCase();
  const canonicalUrl = `${SITE}/omra-depuis-${urlSlug}`;

  const tableauPrix = [
    { periode: 'Automne (sept – nov)', eco: data.prixEco, confort: data.prixConfort },
    { periode: 'Hiver hors-Ramadan (janv – fév)', eco: data.prixEco, confort: data.prixConfort },
    { periode: 'Ramadan 2027', eco: data.prixRamadan, confort: data.prixRamadan },
    { periode: 'Printemps (avr – juin)', eco: data.prixEco, confort: data.prixConfort },
    { periode: 'Été (juil – août)', eco: data.prixEco, confort: data.prixConfort },
    { periode: 'Vacances scolaires', eco: data.prixConfort, confort: data.prixRamadan },
  ];

  const faqs = [
    {
      q: `Quelle est la meilleure agence Omra depuis ${data.nom} ?`,
      a: `Les meilleures agences agréées proposant des départs depuis ${data.nom} sont : ${data.agences.map(a => a.nom).join(', ')}. Certaines ont un bureau local à ${data.nom} ou dans l'agglomération. Comparez leurs offres en temps réel sur notre comparateur en filtrant par votre ville de départ.`,
    },
    {
      q: `Quel est le prix d'une Omra depuis ${data.nom} en 2026 ?`,
      a: `Le prix d'une Omra depuis ${data.nom} varie de ${data.prixEco} en formule économique 3 étoiles hors Ramadan, jusqu'à ${data.prixRamadan} pendant le Ramadan en confort. ${data.supplement}. Ces prix incluent le vol, l'hébergement et souvent le visa — vérifiez les inclusions de chaque offre.`,
    },
    {
      q: `Y a-t-il des vols directs depuis ${data.nom} vers La Mecque ?`,
      a: `${data.volEscale ? `Les vols depuis ${data.nom} font généralement escale. ${data.volEscale}.` : `Des vols directs sont disponibles depuis ${data.nom} vers Djeddah selon les périodes.`} La durée totale du trajet (${data.volDuree}) dépend de la compagnie et de la saison. Vols disponibles avec : ${data.volCompagnies.join(', ')}.`,
    },
    {
      q: `Comment rejoindre l'aéroport depuis ${data.nom} ?`,
      a: `${data.itineraireAero}. Prévoyez d'arriver à l'aéroport au minimum 3h avant votre vol international, car les formalités Omra (état d'ihram, vérification des documents) peuvent prendre du temps.`,
    },
    {
      q: `Peut-on faire l'Omra pas cher depuis ${data.nom} ?`,
      a: `Oui, des offres économiques sont disponibles depuis ${data.nom}. Les périodes les moins chères sont l'automne (septembre-novembre) et le début de l'année hors Ramadan. Le prix de base commence à ${data.prixEco.split('–')[0].trim()} en formule 3 étoiles. ${data.supplement}.`,
    },
  ];

  const autresVilles = TOUTES_LES_VILLES
    .filter(k => k !== key)
    .map(k => ({ key: k, nom: villesData[k].nom }));

  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Omra depuis ${data.nom} 2026 : Guide Complet et Offres`,
    description: `Comparez les meilleures offres Omra 2026 depuis ${data.nom}. Agences agréées, vols depuis ${data.codeAero}, prix et conseils pratiques.`,
    url: canonicalUrl,
    datePublished: '2026-01-15',
    dateModified: '2026-08-16',
    author: { '@type': 'Person', '@id': `${SITE}/about#farid`, name: "Farid d'Arabie", jobTitle: 'Expert en pèlerinage islamique' },
    publisher: { '@type': 'Organization', name: 'Omra Bons Plans', url: SITE },
    inLanguage: 'fr-FR',
  };

  const faqLdJson = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>{`Omra depuis ${data.nom} 2026 : Agences, Prix & Vols | Omra Bons Plans`}</title>
        <meta name="description" content={`Comparez les offres Omra 2026 depuis ${data.nom} (${data.codeAero}). ${data.supplement}. Agences agréées, vols ${data.volDuree}, conseils pratiques et prix par saison.`} />
        <meta name="keywords" content={`omra depuis ${data.nom.toLowerCase()}, omra ${data.nom.toLowerCase()} 2026, agence omra ${data.nom.toLowerCase()}, vol omra ${data.nom.toLowerCase()}, prix omra ${data.nom.toLowerCase()}, départ omra ${data.nom.toLowerCase()}`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`Omra depuis ${data.nom} 2026 : Prix, Agences & Vols`} />
        <meta property="og:description" content={`Offres Omra 2026 depuis ${data.nom}. ${data.supplement}. Comparez agences agréées, vols et prix en temps réel.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`${SITE}/hero-kaaba-optimized.webp`} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <script type="application/ld+json">{JSON.stringify(ldJson)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLdJson)}</script>
      </Helmet>

      <SEOBreadcrumb items={[
        { name: 'Accueil', url: '/' },
        { name: 'Omra 2026', url: '/' },
        { name: `Omra depuis ${data.nom}`, url: `/omra-depuis-${urlSlug}` },
      ]} />

      <article className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="gap-1"><MapPin className="h-3 w-3" />{data.nom}</Badge>
            <Badge variant="outline" className="gap-1"><Plane className="h-3 w-3" />{data.codeAero}</Badge>
            <Badge variant="secondary">{data.supplement}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Omra depuis {data.nom} en 2026 : Agences, Prix et Vols
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {data.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link to="/">Comparer les offres Omra →</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/agences-liste">Voir toutes les agences</Link>
            </Button>
          </div>
        </header>

        {/* Infos pratiques */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-5">✈️ Infos pratiques — Vols depuis {data.nom}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Plane className="h-4 w-4 text-primary" /> Aéroport
              </div>
              <p className="text-sm text-muted-foreground">{data.aeroport}</p>
              <div className="flex items-center gap-2 font-semibold text-foreground mt-3">
                <Clock className="h-4 w-4 text-primary" /> Durée du vol
              </div>
              <p className="text-sm text-muted-foreground">{data.volDuree}</p>
              {data.volEscale && (
                <>
                  <div className="flex items-center gap-2 font-semibold text-foreground mt-3">
                    <MapPin className="h-4 w-4 text-primary" /> Escales principales
                  </div>
                  <p className="text-sm text-muted-foreground">{data.volEscale}</p>
                </>
              )}
            </div>
            <div className="border rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Building2 className="h-4 w-4 text-primary" /> Compagnies disponibles
              </div>
              <ul className="space-y-1">
                {data.volCompagnies.map((c, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Accès à l'aéroport :</strong> {data.itineraireAero}
            </p>
          </div>
        </section>

        {/* Spécificités */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🏙️ Partir en Omra depuis {data.nom} — Ce qu'il faut savoir</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{data.specificite}</p>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Communauté locale</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">{data.communaute}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Agences locales */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-5">🏢 Agences Omra agréées — départs depuis {data.nom}</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Ces agences proposent des offres Omra au départ de {data.nom} ou des villes proches.
            Toutes sont agréées par les autorités françaises et saoudiennes.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.agences.map((agence, i) => (
              <div key={i} className="border rounded-xl p-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">{agence.nom}</p>
                  {agence.adresse && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{agence.adresse}
                    </p>
                  )}
                  {agence.note && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500" />{agence.note}/5
                    </p>
                  )}
                </div>
                <PresenceBadge presence={agence.presence} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <Button asChild variant="outline">
              <Link to="/agences-liste">Toutes les agences →</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/comparatif-agences">Comparer les agences</Link>
            </Button>
          </div>
        </section>

        {/* Tableau des prix */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-5">💰 Prix Omra depuis {data.nom} par saison (2026)</h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary/8 border-b">
                  <th className="p-4 text-left font-semibold">Période</th>
                  <th className="p-4 text-left font-semibold">Éco (3★)</th>
                  <th className="p-4 text-left font-semibold">Confort (4-5★)</th>
                </tr>
              </thead>
              <tbody>
                {tableauPrix.map((row, i) => (
                  <tr key={i} className={`border-b last:border-0 ${i % 2 === 0 ? 'bg-muted/20' : ''}`}>
                    <td className="p-4 font-medium">{row.periode}</td>
                    <td className="p-4 text-green-700 dark:text-green-400">{row.eco}</td>
                    <td className="p-4 text-amber-700 dark:text-amber-400">{row.confort}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Prix indicatifs tout compris (vol + hébergement + visa). {data.supplement}. Utilisez notre comparateur pour les tarifs en temps réel.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Voir les prix en temps réel →</Link>
          </Button>
        </section>

        {/* Conseil expert */}
        <section className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">F</div>
            <div>
              <p className="font-bold text-foreground">Farid d'Arabie — Expert pèlerinage</p>
              <p className="text-xs text-primary mb-3">+10 ans à La Mecque · +5 000 pèlerins accompagnés · Auteur du Guide Omra Bons Plans</p>
              <p className="text-muted-foreground text-sm leading-relaxed">"{data.conseilPro}"</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">❓ Questions fréquentes — Omra depuis {data.nom}</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <h3 className="font-semibold p-4 bg-muted/30 text-sm">{faq.q}</h3>
                <p className="p-4 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center mb-10">
          <h2 className="text-2xl font-bold mb-3">Comparez les offres Omra depuis {data.nom}</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Filtrez par ville de départ et trouvez la meilleure offre parmi 20+ agences agréées. Prix mis à jour quotidiennement.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg"><Link to="/">Comparer les offres →</Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/prix-omra-2026">Guide des prix 2026</Link></Button>
          </div>
        </section>

        {/* Liens internes — autres villes */}
        <nav aria-label="Omra depuis d'autres villes" className="border-t pt-8">
          <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
            Omra depuis d'autres villes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {autresVilles.map(({ key: k, nom }) => (
              <Link
                key={k}
                to={`/omra-depuis-${k === 'clermont' ? 'clermont-ferrand' : k}`}
                className="text-sm text-primary hover:underline py-1"
              >
                → Omra depuis {nom}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/meilleure-agence-omra" className="text-sm text-muted-foreground hover:text-primary">Meilleures agences Omra</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/prix-omra-2026" className="text-sm text-muted-foreground hover:text-primary">Prix Omra 2026</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/conditions-omra" className="text-sm text-muted-foreground hover:text-primary">Conditions Omra</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/quand-partir-omra" className="text-sm text-muted-foreground hover:text-primary">Quand partir</Link>
          </div>
        </nav>
      </article>
    </ResponsiveLayout>
  );
}
