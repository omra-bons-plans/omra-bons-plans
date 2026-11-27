// Base de données des hôtels Omra (La Mecque & Médine)
// Distances de référence : Masjid al-Haram (La Mecque), Masjid Nabawi (Médine)
// Prix moyens indicatifs en euros par nuit, hors période Ramadan (données 2026)
// Notes et nombres d'avis approximatifs (ordre de grandeur type Booking.com)

export interface HotelData {
  id: string;                    // slug kebab-case ex: "address-jabal-omar"
  name: string;                  // nom exact de l'Excel
  ville: "La Mecque" | "Médine";
  stars: number;
  distanceHaramM: number;        // en mètres
  bookingRating: number;         // ex: 8.5 (sur 10)
  bookingReviews: number;        // nombre d'avis approximatif
  prixMoyenNuit: number;         // en euros, hors Ramadan
  pointsForts: string[];         // 3-4 points
  pointsFaibles: string[];       // 2-3 points
  description: string;           // 2-3 phrases
  quartier: string;              // ex: "Jabal Omar", "Aziziyah", "Centre"
  url: string;                   // lien officiel
  amenities: string[];           // ex: ["Spa", "Piscine", "Restaurant halal"]
  imageUrl?: string;             // photo principale de l'hôtel
}

export function getHotelImage(hotel: HotelData): string | null {
  return hotel.imageUrl || null;
}

export const hotelsData: HotelData[] = [
  // ===================== LA MECQUE =====================
  {
    id: "address-jabal-omar",
    name: "Address Jabal Omar",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 700,
    bookingRating: 8.9,
    bookingReviews: 2600,
    prixMoyenNuit: 290,
    pointsForts: [
      "Établissement de luxe signé Address (Emaar) avec service haut de gamme",
      "Nombreuses chambres avec vue directe sur la Kaaba et le Haram",
      "Accès piéton couvert vers le Masjid al-Haram via le complexe Jabal Omar",
      "Restaurants et lounges de standing international"
    ],
    pointsFaibles: [
      "Tarifs élevés, surtout pour les chambres avec vue Haram",
      "Marche légèrement montante jusqu'à l'esplanade du Haram"
    ],
    description: "Hôtel 5 étoiles de la marque Address (groupe Emaar) au cœur du complexe Jabal Omar. Il combine luxe contemporain, vues spectaculaires sur la Kaaba et accès direct couvert vers le Haram.",
    quartier: "Jabal Omar",
    url: "https://www.addresshotels.com/fr/hotels/address-jabal-omar-makkah/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Vue Haram", "Restaurant halal", "Salle de prière", "Wifi gratuit", "Salle de sport", "Service de conciergerie"]
  },
  {
    id: "anjum",
    name: "ANJUM",
    ville: "La Mecque",
    stars: 4,
    distanceHaramM: 450,
    bookingRating: 8.4,
    bookingReviews: 11000,
    prixMoyenNuit: 130,
    pointsForts: [
      "Très proche du Haram, accès piéton rapide via Ajyad",
      "Très grand nombre d'avis positifs, valeur sûre pour les groupes",
      "Bon rapport qualité-prix pour un 4 étoiles si proche du Haram",
      "Nombreux restaurants et buffets adaptés aux pèlerins"
    ],
    pointsFaibles: [
      "Très grand hôtel, affluence et attentes aux ascenseurs en haute saison",
      "Chambres au design fonctionnel plutôt que luxueux"
    ],
    description: "Grand hôtel 4 étoiles très prisé des pèlerins pour sa proximité avec le Haram. Il offre un excellent compromis entre emplacement, capacité et prix maîtrisé.",
    quartier: "Ajyad",
    url: "https://anjumhotels.com/en/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Buffet", "Salle de prière", "Wifi gratuit", "Navette", "Blanchisserie"]
  },
  {
    id: "conrad-jabal-omar",
    name: "CONRAD",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 700,
    bookingRating: 8.7,
    bookingReviews: 3200,
    prixMoyenNuit: 250,
    pointsForts: [
      "Marque de luxe Conrad (groupe Hilton) au service impeccable",
      "Chambres spacieuses et modernes, certaines avec vue Haram",
      "Accès couvert au Haram via les galeries de Jabal Omar",
      "Restauration internationale de qualité"
    ],
    pointsFaibles: [
      "Prix premium",
      "Distance de marche non négligeable vers l'entrée du Haram"
    ],
    description: "Hôtel 5 étoiles Conrad au sein du complexe Jabal Omar, référence du luxe à La Mecque. Il séduit par ses prestations soignées et son accès facilité vers la Grande Mosquée.",
    quartier: "Jabal Omar",
    url: "https://www.hilton.com/fr/hotels/makcici-conrad-jabal-omar-makkah/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Vue Haram", "Restaurant halal", "Salle de sport", "Salle de prière", "Wifi gratuit", "Conciergerie"]
  },
  {
    id: "doubletree-jabal-omar",
    name: "DOUBLE TREE",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 750,
    bookingRating: 8.5,
    bookingReviews: 6000,
    prixMoyenNuit: 180,
    pointsForts: [
      "Marque Hilton fiable avec bon niveau de service",
      "Bon rapport qualité-prix dans le complexe Jabal Omar",
      "Accès couvert vers le Haram",
      "Chambres confortables et bien équipées"
    ],
    pointsFaibles: [
      "Vue Haram limitée à quelques chambres",
      "Complexe très fréquenté en haute saison"
    ],
    description: "Hôtel DoubleTree by Hilton situé dans le complexe Jabal Omar. Il offre le confort d'une grande marque internationale à un tarif plus accessible que les 5 étoiles de luxe voisins.",
    quartier: "Jabal Omar",
    url: "https://www.hilton.com/fr/hotels/makdmdi-doubletree-jabal-omar-makkah/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Salle de sport", "Salle de prière", "Wifi gratuit", "Navette"]
  },
  {
    id: "elaf-bakkah",
    name: "Elaf Bakkah",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 300,
    bookingRating: 8.0,
    bookingReviews: 4500,
    prixMoyenNuit: 160,
    pointsForts: [
      "Emplacement très proche du Haram, accès piéton rapide",
      "Chaîne Elaf bien connue des pèlerins",
      "Bon confort pour un tarif raisonnable vu la proximité",
      "Restauration adaptée aux groupes Omra"
    ],
    pointsFaibles: [
      "Prestations un peu en deçà d'un vrai 5 étoiles international",
      "Chambres parfois de taille modeste"
    ],
    description: "Hôtel de la chaîne Elaf situé à proximité immédiate du Haram. Apprécié pour son emplacement stratégique et son accueil orienté pèlerins.",
    quartier: "Ajyad",
    url: "https://www.elafhotels.com/elaf-bakkah",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie", "Navette"]
  },
  {
    id: "emaar-al-noor",
    name: "EMAAR AL NOOR",
    ville: "La Mecque",
    stars: 3,
    distanceHaramM: 3500,
    bookingRating: 7.5,
    bookingReviews: 2000,
    prixMoyenNuit: 55,
    pointsForts: [
      "Tarif économique adapté aux budgets serrés",
      "Chambres correctes pour un 3 étoiles",
      "Navette vers le Haram",
      "Quartier calme avec commerces à proximité"
    ],
    pointsFaibles: [
      "Éloigné du Haram, dépendance à la navette ou au taxi",
      "Prestations basiques"
    ],
    description: "Hôtel économique 3 étoiles situé dans le quartier d'Aziziyah. Choix pertinent pour les pèlerins au budget limité qui acceptent l'éloignement du Haram.",
    quartier: "Aziziyah",
    url: "https://emaaralnoorhotel.sa-makkah.com/fr/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Navette", "Wifi gratuit", "Salle de prière"]
  },
  {
    id: "emaar-international",
    name: "EMAAR INTERNATIONAL",
    ville: "La Mecque",
    stars: 4,
    distanceHaramM: 3500,
    bookingRating: 7.7,
    bookingReviews: 2200,
    prixMoyenNuit: 70,
    pointsForts: [
      "Bon rapport qualité-prix pour un 4 étoiles",
      "Chambres spacieuses adaptées aux familles",
      "Service de navette régulier vers le Haram",
      "Environnement calme à Aziziyah"
    ],
    pointsFaibles: [
      "Distance importante du Haram",
      "Temps de trajet variable selon le trafic"
    ],
    description: "Hôtel 4 étoiles du quartier d'Aziziyah offrant confort et espace à prix contenu. Adapté aux groupes et familles acceptant un transfert vers le Haram.",
    quartier: "Aziziyah",
    url: "https://emaaralnoorhotel.sa-makkah.com/fr/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Navette", "Wifi gratuit", "Salle de prière", "Parking"]
  },
  {
    id: "hyatt-regency-jabal-omar",
    name: "HAYAT REGENCY",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 800,
    bookingRating: 8.6,
    bookingReviews: 3000,
    prixMoyenNuit: 200,
    pointsForts: [
      "Marque Hyatt Regency, service international constant",
      "Chambres modernes et confortables",
      "Accès couvert vers le Haram via Jabal Omar",
      "Restaurants variés et lounge"
    ],
    pointsFaibles: [
      "Distance de marche jusqu'au Haram",
      "Tarifs élevés en périodes de forte affluence"
    ],
    description: "Hôtel Hyatt Regency au sein du complexe Jabal Omar, alliant confort international et bon accès au Haram. Valeur sûre pour un séjour 5 étoiles.",
    quartier: "Jabal Omar",
    url: "https://www.hyatt.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Salle de sport", "Salle de prière", "Wifi gratuit", "Conciergerie"]
  },
  {
    id: "hibatullah",
    name: "HIBATULLAH",
    ville: "La Mecque",
    stars: 3,
    distanceHaramM: 600,
    bookingRating: 7.6,
    bookingReviews: 1500,
    prixMoyenNuit: 80,
    pointsForts: [
      "Emplacement raisonnable à distance de marche du Haram",
      "Tarif accessible pour un séjour proche du centre",
      "Chambres fonctionnelles",
      "Proximité de commerces et restaurants"
    ],
    pointsFaibles: [
      "Prestations simples de catégorie 3 étoiles",
      "Confort et insonorisation perfectibles"
    ],
    description: "Hôtel 3 étoiles économique situé dans le secteur de Jarwal, à distance de marche du Haram. Option pratique pour les pèlerins recherchant un bon compromis prix/emplacement.",
    quartier: "Jarwal",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Wifi gratuit", "Salle de prière", "Blanchisserie"]
  },
  {
    id: "hilton-convention",
    name: "HILTON CONVENTION",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 80,
    bookingRating: 8.6,
    bookingReviews: 5000,
    prixMoyenNuit: 300,
    pointsForts: [
      "Emplacement exceptionnel dans la tour Abraj Al-Bait, face au Haram",
      "Accès quasi immédiat à l'esplanade du Masjid al-Haram",
      "Nombreuses chambres avec vue directe sur la Kaaba",
      "Service et restauration de standing Hilton"
    ],
    pointsFaibles: [
      "Tarifs parmi les plus élevés de La Mecque",
      "Affluence importante autour du complexe Abraj Al-Bait"
    ],
    description: "Hôtel Hilton Makkah Convention situé dans le complexe Abraj Al-Bait, à quelques dizaines de mètres du Haram. Emplacement premium imbattable pour un accès ultra-rapide à la Grande Mosquée.",
    quartier: "Abraj Al-Bait",
    url: "https://www.hilton.com/fr/hotels/makhitw-makkah-hotel/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Vue Haram", "Restaurant halal", "Centre commercial", "Salle de prière", "Wifi gratuit", "Conciergerie"]
  },
  {
    id: "hilton-suites",
    name: "HILTON SUITE",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 700,
    bookingRating: 8.5,
    bookingReviews: 2800,
    prixMoyenNuit: 220,
    pointsForts: [
      "Suites spacieuses idéales pour les familles",
      "Confort et service de la marque Hilton",
      "Accès couvert au Haram via Jabal Omar",
      "Cuisine dans certaines suites"
    ],
    pointsFaibles: [
      "Prix élevé pour les grandes suites",
      "Marche jusqu'au Haram"
    ],
    description: "Hilton Suites Makkah propose de grandes suites au sein du complexe Jabal Omar. Format apprécié des familles souhaitant espace et confort de marque internationale.",
    quartier: "Jabal Omar",
    url: "https://www.hilton.com/fr/hotels/makhstw-hilton-suites-makkah/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Suites familiales", "Restaurant halal", "Salle de sport", "Salle de prière", "Wifi gratuit"]
  },
  {
    id: "jumeirah-jabal-omar",
    name: "JUMEIRAH",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 750,
    bookingRating: 8.8,
    bookingReviews: 1800,
    prixMoyenNuit: 300,
    pointsForts: [
      "Luxe raffiné signé Jumeirah, service haut de gamme",
      "Chambres élégantes avec vues sur le Haram pour certaines",
      "Accès couvert vers la Grande Mosquée",
      "Restauration gastronomique et lounges"
    ],
    pointsFaibles: [
      "Tarifs premium",
      "Distance de marche jusqu'au Haram"
    ],
    description: "Hôtel Jumeirah Jabal Omar Makkah, adresse de luxe à l'élégance orientale contemporaine. Il offre un séjour 5 étoiles raffiné avec accès facilité vers le Haram.",
    quartier: "Jabal Omar",
    url: "https://www.jumeirah.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Vue Haram", "Restaurant halal", "Spa", "Salle de sport", "Salle de prière", "Conciergerie"]
  },
  {
    id: "marriott-jabal-omar",
    name: "MARIOTT",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 800,
    bookingRating: 8.6,
    bookingReviews: 2500,
    prixMoyenNuit: 200,
    pointsForts: [
      "Marque Marriott fiable et service constant",
      "Chambres modernes et confortables",
      "Accès couvert au Haram via Jabal Omar",
      "Restaurants variés et programme de fidélité Marriott Bonvoy"
    ],
    pointsFaibles: [
      "Distance de marche jusqu'au Haram",
      "Peu de chambres avec vue Kaaba directe"
    ],
    description: "Hôtel Marriott Jabal Omar Makkah offrant le confort et le service d'une grande enseigne internationale. Bon choix 5 étoiles au cœur du complexe Jabal Omar.",
    quartier: "Jabal Omar",
    url: "https://www.marriott.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Salle de sport", "Salle de prière", "Wifi gratuit", "Conciergerie"]
  },
  {
    id: "al-marwa-rotana",
    name: "MARWA BY ROTANA",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 650,
    bookingRating: 8.7,
    bookingReviews: 3500,
    prixMoyenNuit: 190,
    pointsForts: [
      "Al Marwa Rayhaan by Rotana, service soigné et cuisine réputée",
      "Chambres spacieuses, certaines avec vue Haram",
      "Accès couvert vers le Masjid al-Haram",
      "Buffets généreux appréciés des pèlerins"
    ],
    pointsFaibles: [
      "Prix en hausse en haute saison",
      "Marche jusqu'à l'esplanade du Haram"
    ],
    description: "Al Marwa Rayhaan by Rotana, hôtel 5 étoiles du complexe Jabal Omar réputé pour sa restauration et son confort. Une valeur sûre pour un séjour Omra haut de gamme.",
    quartier: "Jabal Omar",
    url: "https://www.rotana.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Buffet", "Salle de sport", "Salle de prière", "Wifi gratuit"]
  },
  {
    id: "mathaba",
    name: "MATHABA",
    ville: "La Mecque",
    stars: 3,
    distanceHaramM: 500,
    bookingRating: 7.5,
    bookingReviews: 1200,
    prixMoyenNuit: 70,
    pointsForts: [
      "Emplacement proche du Haram à distance de marche",
      "Tarif économique",
      "Chambres fonctionnelles",
      "Accès facile aux commerces"
    ],
    pointsFaibles: [
      "Prestations basiques de catégorie 3 étoiles",
      "Confort et équipements limités"
    ],
    description: "Hôtel 3 étoiles économique situé à distance de marche du Haram. Option pratique pour un séjour Omra à petit budget sans dépendre systématiquement d'une navette.",
    quartier: "Misfalah",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Wifi gratuit", "Salle de prière", "Blanchisserie"]
  },
  {
    id: "millennium-al-naseem",
    name: "MILLENIUM",
    ville: "La Mecque",
    stars: 4,
    distanceHaramM: 1800,
    bookingRating: 8.0,
    bookingReviews: 4000,
    prixMoyenNuit: 90,
    pointsForts: [
      "Grand hôtel 4 étoiles de la zone Al Naseem",
      "Bon rapport qualité-prix pour les groupes",
      "Service de navette vers le Haram",
      "Restaurants et buffets adaptés aux pèlerins"
    ],
    pointsFaibles: [
      "Éloigné du Haram, navette nécessaire",
      "Affluence importante en haute saison"
    ],
    description: "Millennium Makkah Al Naseem, grand hôtel 4 étoiles situé dans le nouveau secteur Al Naseem. Bon choix pour les groupes recherchant confort et prix maîtrisé avec navette.",
    quartier: "Al Naseem",
    url: "https://www.millenniumhotels.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Navette", "Salle de sport", "Salle de prière", "Wifi gratuit"]
  },
  {
    id: "millennium-al-dana",
    name: "MILLIENIUM AL DANA",
    ville: "La Mecque",
    stars: 4,
    distanceHaramM: 1500,
    bookingRating: 7.9,
    bookingReviews: 2000,
    prixMoyenNuit: 95,
    pointsForts: [
      "Confort 4 étoiles de la marque Millennium",
      "Chambres spacieuses",
      "Service de navette vers le Haram",
      "Restauration halal complète"
    ],
    pointsFaibles: [
      "Distance du Haram nécessitant une navette",
      "Prestations standardisées"
    ],
    description: "Hôtel 4 étoiles de la gamme Millennium offrant confort et espace à distance du Haram. Adapté aux pèlerins privilégiant le rapport qualité-prix avec transfert.",
    quartier: "Al Naseem",
    url: "https://www.millenniumhotels.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Navette", "Salle de prière", "Wifi gratuit", "Parking"]
  },
  {
    id: "montana-hotel",
    name: "MONTANA HOTEL",
    ville: "La Mecque",
    stars: 1,
    distanceHaramM: 3000,
    bookingRating: 6.8,
    bookingReviews: 600,
    prixMoyenNuit: 40,
    pointsForts: [
      "Tarif très économique",
      "Dépannage pratique pour petit budget",
      "Proximité des commerces d'Aziziyah",
      "Navette possible vers le Haram"
    ],
    pointsFaibles: [
      "Éloigné du Haram",
      "Prestations très basiques",
      "Confort minimal"
    ],
    description: "Hôtel économique 1 étoile du quartier d'Aziziyah. Solution d'appoint pour les budgets très serrés, avec un niveau de confort minimal.",
    quartier: "Aziziyah",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Wifi gratuit", "Salle de prière", "Navette"]
  },
  {
    id: "novotel-thakher",
    name: "NOVOTEL THAKHER",
    ville: "La Mecque",
    stars: 4,
    distanceHaramM: 2600,
    bookingRating: 8.1,
    bookingReviews: 3500,
    prixMoyenNuit: 60,
    pointsForts: [
      "Marque Novotel (Accor) fiable et moderne",
      "Excellent rapport qualité-prix",
      "Navette gratuite 24h/24 vers le Haram toutes les 30 min",
      "Chambres neuves et confortables à Thakher City"
    ],
    pointsFaibles: [
      "Éloigné du Haram (env. 2,6 km), navette indispensable",
      "Environnement encore en développement"
    ],
    description: "Novotel Makkah Thakher City, hôtel 4 étoiles moderne du groupe Accor. Il séduit par son excellent rapport qualité-prix et sa navette gratuite fréquente vers le Haram.",
    quartier: "Thakher City",
    url: "https://all.accor.com/hotel/B1J6/index.fr.shtml",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Navette gratuite", "Salle de sport", "Salle de prière", "Wifi gratuit", "Parking"]
  },
  {
    id: "osturat-emmar",
    name: "OSTURAT EMMAR",
    ville: "La Mecque",
    stars: 4,
    distanceHaramM: 3500,
    bookingRating: 7.6,
    bookingReviews: 900,
    prixMoyenNuit: 65,
    pointsForts: [
      "Confort 4 étoiles à prix économique",
      "Chambres spacieuses pour familles",
      "Navette vers le Haram",
      "Quartier calme"
    ],
    pointsFaibles: [
      "Éloigné du Haram",
      "Notoriété et services limités"
    ],
    description: "Hôtel 4 étoiles économique du quartier d'Aziziyah. Adapté aux familles et groupes recherchant de l'espace à petit prix avec transfert vers le Haram.",
    quartier: "Aziziyah",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Navette", "Wifi gratuit", "Salle de prière", "Parking"]
  },
  {
    id: "park-house-hotel",
    name: "PARK HOUSE HOTEL",
    ville: "La Mecque",
    stars: 3,
    distanceHaramM: 3000,
    bookingRating: 7.4,
    bookingReviews: 800,
    prixMoyenNuit: 60,
    pointsForts: [
      "Tarif économique",
      "Chambres correctes pour un 3 étoiles",
      "Navette vers le Haram",
      "Proximité des commerces"
    ],
    pointsFaibles: [
      "Éloigné du Haram",
      "Prestations simples"
    ],
    description: "Hôtel 3 étoiles économique du secteur d'Aziziyah. Choix pratique pour un séjour Omra à budget maîtrisé avec navette vers le Haram.",
    quartier: "Aziziyah",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Navette", "Wifi gratuit", "Salle de prière"]
  },
  {
    id: "park-plaza",
    name: "PARK PLAZA",
    ville: "La Mecque",
    stars: 4,
    distanceHaramM: 4000,
    bookingRating: 7.8,
    bookingReviews: 1500,
    prixMoyenNuit: 75,
    pointsForts: [
      "Marque internationale Park Plaza",
      "Chambres modernes et confortables",
      "Navette vers le Haram",
      "Bon rapport qualité-prix"
    ],
    pointsFaibles: [
      "Distance importante du Haram",
      "Temps de trajet variable selon le trafic"
    ],
    description: "Hôtel 4 étoiles Park Plaza situé à Aziziyah. Il offre un confort de marque internationale à prix raisonnable, avec navette vers la Grande Mosquée.",
    quartier: "Aziziyah",
    url: "https://www.radissonhotels.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Navette", "Salle de sport", "Salle de prière", "Wifi gratuit"]
  },
  {
    id: "ponciana",
    name: "PONCIANA",
    ville: "La Mecque",
    stars: 3,
    distanceHaramM: 1200,
    bookingRating: 7.5,
    bookingReviews: 1100,
    prixMoyenNuit: 70,
    pointsForts: [
      "Tarif économique proche du centre",
      "Chambres fonctionnelles",
      "Navette vers le Haram",
      "Accès aux commerces à proximité"
    ],
    pointsFaibles: [
      "Prestations basiques",
      "Distance de marche non négligeable jusqu'au Haram"
    ],
    description: "Hôtel 3 étoiles économique offrant un bon compromis prix/emplacement. Adapté aux pèlerins recherchant une option abordable à distance raisonnable du Haram.",
    quartier: "Shubaikah",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Navette", "Wifi gratuit", "Salle de prière"]
  },
  {
    id: "razana-al-rawda",
    name: "RAZANA AL RAWDA",
    ville: "La Mecque",
    stars: 4,
    distanceHaramM: 900,
    bookingRating: 7.9,
    bookingReviews: 1300,
    prixMoyenNuit: 85,
    pointsForts: [
      "Bon emplacement à distance de marche du Haram",
      "Confort 4 étoiles à prix contenu",
      "Chambres spacieuses",
      "Restauration halal"
    ],
    pointsFaibles: [
      "Prestations un peu en deçà des grandes marques",
      "Affluence en haute saison"
    ],
    description: "Hôtel 4 étoiles offrant un bon rapport qualité-prix à distance de marche du Haram. Choix pertinent pour un séjour confortable sans dépenses excessives.",
    quartier: "Jarwal",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Navette", "Blanchisserie"]
  },
  {
    id: "safwat-al-talayie",
    name: "SAFWAT AL TALAYIE HOTEL",
    ville: "La Mecque",
    stars: 1,
    distanceHaramM: 3200,
    bookingRating: 6.7,
    bookingReviews: 400,
    prixMoyenNuit: 40,
    pointsForts: [
      "Tarif très économique",
      "Option de dépannage pour petit budget",
      "Proximité des commerces d'Aziziyah",
      "Navette possible vers le Haram"
    ],
    pointsFaibles: [
      "Éloigné du Haram",
      "Confort et prestations très basiques",
      "Équipements limités"
    ],
    description: "Hôtel économique 1 étoile du quartier d'Aziziyah. Solution d'appoint pour les budgets très serrés, avec un confort minimal.",
    quartier: "Aziziyah",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Wifi gratuit", "Salle de prière", "Navette"]
  },
  {
    id: "shaza-makkah",
    name: "SHAZA",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 700,
    bookingRating: 8.7,
    bookingReviews: 2200,
    prixMoyenNuit: 230,
    pointsForts: [
      "Luxe à l'esprit oriental raffiné signé Shaza",
      "Service personnalisé et ambiance feutrée",
      "Accès couvert au Haram via Jabal Omar",
      "Restauration soignée et thé traditionnel"
    ],
    pointsFaibles: [
      "Tarifs élevés",
      "Marche jusqu'au Haram"
    ],
    description: "Shaza Makkah, hôtel 5 étoiles à l'élégance orientale au sein du complexe Jabal Omar. Il propose un séjour luxueux et raffiné avec un service très personnalisé.",
    quartier: "Jabal Omar",
    url: "https://www.shazahotels.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Spa", "Salle de sport", "Salle de prière", "Wifi gratuit", "Conciergerie"]
  },
  {
    id: "sheraton-jabal-al-kaaba",
    name: "SHERATON",
    ville: "La Mecque",
    stars: 4,
    distanceHaramM: 1000,
    bookingRating: 8.3,
    bookingReviews: 4000,
    prixMoyenNuit: 160,
    pointsForts: [
      "Marque Sheraton (Marriott) fiable",
      "Chambres spacieuses et confortables",
      "Navette vers le Haram",
      "Bonne restauration et espaces communs agréables"
    ],
    pointsFaibles: [
      "Distance de marche/navette jusqu'au Haram",
      "Situé sur les hauteurs de Jabal Al Kaaba"
    ],
    description: "Sheraton Makkah Jabal Al Kaaba, hôtel de bon standing offrant confort et service d'une grande marque. Bon compromis entre qualité et prix à distance modérée du Haram.",
    quartier: "Jabal Al Kaaba",
    url: "https://www.marriott.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Navette", "Salle de sport", "Salle de prière", "Wifi gratuit"]
  },
  {
    id: "shohada",
    name: "SHOHADA",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 400,
    bookingRating: 8.2,
    bookingReviews: 2600,
    prixMoyenNuit: 150,
    pointsForts: [
      "Emplacement très proche du Haram",
      "Bon rapport qualité-prix pour un 5 étoiles",
      "Chambres confortables, certaines avec vue Haram",
      "Restauration adaptée aux pèlerins"
    ],
    pointsFaibles: [
      "Prestations légèrement en deçà des marques internationales",
      "Affluence dans le secteur en haute saison"
    ],
    description: "Hôtel 5 étoiles Shohada situé à proximité immédiate du Haram. Apprécié pour son emplacement stratégique et son bon rapport qualité-prix.",
    quartier: "Ajyad",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Vue Haram", "Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie"]
  },
  {
    id: "taj-park",
    name: "TAJ PARK",
    ville: "La Mecque",
    stars: 3,
    distanceHaramM: 3200,
    bookingRating: 7.3,
    bookingReviews: 700,
    prixMoyenNuit: 55,
    pointsForts: [
      "Tarif économique",
      "Chambres correctes pour un 3 étoiles",
      "Navette vers le Haram",
      "Quartier calme d'Aziziyah"
    ],
    pointsFaibles: [
      "Éloigné du Haram",
      "Prestations simples"
    ],
    description: "Hôtel 3 étoiles économique du quartier d'Aziziyah. Option pratique pour les pèlerins au budget limité avec navette vers le Haram.",
    quartier: "Aziziyah",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Navette", "Wifi gratuit", "Salle de prière"]
  },
  {
    id: "tilal-shaza",
    name: "TILAL SHAZA",
    ville: "La Mecque",
    stars: 4,
    distanceHaramM: 850,
    bookingRating: 7.9,
    bookingReviews: 1000,
    prixMoyenNuit: 130,
    pointsForts: [
      "Confort 4 étoiles associé à l'esprit Shaza",
      "Chambres élégantes",
      "Accès facilité vers le Haram",
      "Restauration halal soignée"
    ],
    pointsFaibles: [
      "Distance de marche jusqu'au Haram",
      "Notoriété plus limitée que le Shaza principal"
    ],
    description: "Hôtel 4 étoiles de la gamme Shaza au sein du secteur Jabal Omar. Il propose un confort élégant à tarif intermédiaire pour un séjour Omra agréable.",
    quartier: "Jabal Omar",
    url: "https://www.shazahotels.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Salle de sport", "Wifi gratuit", "Navette"]
  },
  {
    id: "voco-makkah",
    name: "VOCO",
    ville: "La Mecque",
    stars: 4,
    distanceHaramM: 900,
    bookingRating: 8.2,
    bookingReviews: 1600,
    prixMoyenNuit: 140,
    pointsForts: [
      "Marque voco (IHG) moderne et conviviale",
      "Chambres design et confortables",
      "Accès facilité vers le Haram",
      "Restauration de qualité"
    ],
    pointsFaibles: [
      "Distance de marche jusqu'au Haram",
      "Enseigne récente, notoriété en construction"
    ],
    description: "Hôtel voco (groupe IHG) offrant un cadre moderne et un bon niveau de confort à La Mecque. Bon choix 4 étoiles à tarif intermédiaire.",
    quartier: "Jabal Omar",
    url: "https://www.ihg.com/voco/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Restaurant halal", "Salle de sport", "Salle de prière", "Wifi gratuit", "Navette"]
  },
  {
    id: "zamzam-hotel",
    name: "ZAMZAM HOTEL",
    ville: "La Mecque",
    stars: 5,
    distanceHaramM: 90,
    bookingRating: 8.5,
    bookingReviews: 6500,
    prixMoyenNuit: 280,
    pointsForts: [
      "Emplacement exceptionnel dans la tour Abraj Al-Bait (Swissôtel/Zamzam)",
      "Accès quasi immédiat au Haram",
      "Nombreuses chambres avec vue sur la Kaaba",
      "Centre commercial et restaurants dans le complexe"
    ],
    pointsFaibles: [
      "Tarifs élevés, surtout pour les vues Haram",
      "Forte affluence autour d'Abraj Al-Bait"
    ],
    description: "Hôtel Zamzam (Swissôtel Al Maqam / Abraj Al-Bait) situé au pied de la tour de l'horloge, à quelques mètres du Haram. Emplacement premium pour un accès ultra-rapide à la Grande Mosquée.",
    quartier: "Abraj Al-Bait",
    url: "https://www.swissotel.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Find-the-qibla.jpg?width=800",
    amenities: ["Vue Haram", "Restaurant halal", "Centre commercial", "Salle de prière", "Wifi gratuit", "Conciergerie"]
  },

  // ===================== MÉDINE =====================
  {
    id: "al-shakreen-golden-tulip",
    name: "AL SHAKREEN GOLDEN TULIP",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 300,
    bookingRating: 8.2,
    bookingReviews: 2500,
    prixMoyenNuit: 100,
    pointsForts: [
      "Marque Golden Tulip fiable",
      "Très proche du Masjid Nabawi, accès piéton rapide",
      "Chambres confortables et modernes",
      "Bonne restauration halal"
    ],
    pointsFaibles: [
      "Affluence dans le secteur central en haute saison",
      "Vue variable selon les chambres"
    ],
    description: "Hôtel 4 étoiles Golden Tulip situé dans le secteur central de Médine, à courte distance de marche de la Mosquée du Prophète. Bon compromis confort/emplacement.",
    quartier: "Centre",
    url: "https://www.goldentulip.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie", "Navette"]
  },
  {
    id: "assafa-golden",
    name: "ASSAFA GOLDEN HOTEL",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 350,
    bookingRating: 8.0,
    bookingReviews: 1800,
    prixMoyenNuit: 90,
    pointsForts: [
      "Proche du Masjid Nabawi",
      "Chambres confortables 4 étoiles",
      "Bon rapport qualité-prix",
      "Restauration halal"
    ],
    pointsFaibles: [
      "Prestations standardisées",
      "Affluence en haute saison"
    ],
    description: "Hôtel 4 étoiles du secteur central de Médine, à courte distance de la Mosquée du Prophète. Choix pratique alliant emplacement et prix raisonnable.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie"]
  },
  {
    id: "bosphorus-waqf-safi",
    name: "BOSPHORUS WAQF SAFI",
    ville: "Médine",
    stars: 3,
    distanceHaramM: 400,
    bookingRating: 7.8,
    bookingReviews: 1400,
    prixMoyenNuit: 70,
    pointsForts: [
      "Bon emplacement proche du Masjid Nabawi",
      "Tarif économique",
      "Chambres fonctionnelles",
      "Accueil orienté pèlerins"
    ],
    pointsFaibles: [
      "Prestations basiques de catégorie 3 étoiles",
      "Confort perfectible"
    ],
    description: "Hôtel 3 étoiles économique du secteur central de Médine, à distance de marche de la Mosquée du Prophète. Bon compromis prix/emplacement pour l'Omra.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie"]
  },
  {
    id: "concord-dar-al-khair",
    name: "CONCORD DAR AL KHAIR",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 500,
    bookingRating: 8.0,
    bookingReviews: 2000,
    prixMoyenNuit: 85,
    pointsForts: [
      "Confort 4 étoiles à prix raisonnable",
      "Distance de marche modérée jusqu'au Masjid Nabawi",
      "Chambres spacieuses",
      "Restauration halal complète"
    ],
    pointsFaibles: [
      "Un peu plus éloigné du sanctuaire que les hôtels de première ligne",
      "Prestations standardisées"
    ],
    description: "Hôtel 4 étoiles Concord Dar Al Khair du secteur intermédiaire de Médine. Bon rapport qualité-prix pour un séjour confortable à distance de marche de la Mosquée du Prophète.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Salle de sport", "Blanchisserie"]
  },
  {
    id: "crowne-plaza-madinah",
    name: "CROWN PLAZA",
    ville: "Médine",
    stars: 5,
    distanceHaramM: 400,
    bookingRating: 8.3,
    bookingReviews: 4000,
    prixMoyenNuit: 180,
    pointsForts: [
      "Marque Crowne Plaza (IHG), service international",
      "Proche du Masjid Nabawi (env. 8 min à pied)",
      "Chambres modernes et spacieuses",
      "Restauration de qualité et espaces communs agréables"
    ],
    pointsFaibles: [
      "Tarifs premium",
      "Affluence dans le secteur central"
    ],
    description: "Crowne Plaza Madinah, hôtel 5 étoiles IHG situé à courte distance de la Mosquée du Prophète. Confort international et service constant pour un séjour haut de gamme.",
    quartier: "Centre",
    url: "https://www.ihg.com/crowneplaza/hotels/us/en/madinah/medcp/hoteldetail",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de sport", "Salle de prière", "Wifi gratuit", "Conciergerie", "Navette"]
  },
  {
    id: "diwan-rose",
    name: "DIWAN ROSE",
    ville: "Médine",
    stars: 3,
    distanceHaramM: 600,
    bookingRating: 7.6,
    bookingReviews: 900,
    prixMoyenNuit: 65,
    pointsForts: [
      "Tarif économique",
      "Distance de marche raisonnable du Masjid Nabawi",
      "Chambres fonctionnelles",
      "Restauration halal"
    ],
    pointsFaibles: [
      "Prestations simples",
      "Confort perfectible"
    ],
    description: "Hôtel 3 étoiles économique du secteur intermédiaire de Médine. Choix pratique pour un séjour Omra à budget maîtrisé, à distance de marche de la mosquée.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie"]
  },
  {
    id: "diyar-al-taqwa",
    name: "DIYAR AL TAQWA",
    ville: "Médine",
    stars: 3,
    distanceHaramM: 500,
    bookingRating: 7.7,
    bookingReviews: 1100,
    prixMoyenNuit: 60,
    pointsForts: [
      "Bon emplacement pour un 3 étoiles économique",
      "Distance de marche modérée du Masjid Nabawi",
      "Chambres correctes",
      "Restauration halal"
    ],
    pointsFaibles: [
      "Prestations basiques",
      "Équipements limités"
    ],
    description: "Hôtel 3 étoiles économique de Médine à distance de marche de la Mosquée du Prophète. Option abordable pour les pèlerins soucieux de leur budget.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie"]
  },
  {
    id: "emaar-royal",
    name: "Emaar Royal",
    ville: "Médine",
    stars: 3,
    distanceHaramM: 700,
    bookingRating: 7.5,
    bookingReviews: 800,
    prixMoyenNuit: 60,
    pointsForts: [
      "Tarif économique",
      "Chambres correctes pour un 3 étoiles",
      "Navette possible vers le Masjid Nabawi",
      "Environnement calme"
    ],
    pointsFaibles: [
      "Un peu éloigné du sanctuaire",
      "Prestations simples"
    ],
    description: "Hôtel 3 étoiles économique de Médine, à distance de marche modérée de la Mosquée du Prophète. Choix pratique pour un séjour à petit budget.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Navette"]
  },
  {
    id: "hilton-diyar-ajwa",
    name: "Hilton Diyar Ajwa",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 1200,
    bookingRating: 8.1,
    bookingReviews: 1500,
    prixMoyenNuit: 90,
    pointsForts: [
      "Marque Hilton, service fiable",
      "Chambres modernes et confortables",
      "Navette vers le Masjid Nabawi",
      "Bon rapport qualité-prix pour un Hilton"
    ],
    pointsFaibles: [
      "Situé à Al-Harithia, éloigné du sanctuaire",
      "Navette nécessaire"
    ],
    description: "Hôtel Hilton du secteur Al-Harithia à Médine. Il offre le confort d'une grande marque internationale à distance du sanctuaire, avec service de navette.",
    quartier: "Al-Harithia",
    url: "https://www.hilton.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Navette", "Salle de sport", "Salle de prière", "Wifi gratuit"]
  },
  {
    id: "jayden",
    name: "JAYDEN",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 350,
    bookingRating: 8.2,
    bookingReviews: 1300,
    prixMoyenNuit: 100,
    pointsForts: [
      "Proche du Masjid Nabawi",
      "Chambres modernes et confortables",
      "Bon niveau de service 4 étoiles",
      "Restauration halal soignée"
    ],
    pointsFaibles: [
      "Affluence dans le secteur central",
      "Vue variable selon les chambres"
    ],
    description: "Hôtel 4 étoiles Jayden situé dans le secteur central de Médine, à courte distance de la Mosquée du Prophète. Bon compromis confort et emplacement.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Salle de sport", "Blanchisserie"]
  },
  {
    id: "jewar-al-saha",
    name: "JEWAR AL SAHA",
    ville: "Médine",
    stars: 1,
    distanceHaramM: 800,
    bookingRating: 6.9,
    bookingReviews: 500,
    prixMoyenNuit: 40,
    pointsForts: [
      "Tarif très économique",
      "Solution d'appoint pour petit budget",
      "Distance de marche vers le Masjid Nabawi",
      "Proximité des commerces"
    ],
    pointsFaibles: [
      "Confort très basique",
      "Prestations et équipements limités",
      "Insonorisation perfectible"
    ],
    description: "Hôtel économique 1 étoile de Médine. Solution d'appoint pour les budgets très serrés, avec un confort minimal à distance de marche de la mosquée.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Wifi gratuit", "Salle de prière", "Blanchisserie"]
  },
  {
    id: "jiwar-al-madinah",
    name: "Jiwar Al Madinah",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 500,
    bookingRating: 8.0,
    bookingReviews: 1600,
    prixMoyenNuit: 85,
    pointsForts: [
      "Confort 4 étoiles à prix raisonnable",
      "Distance de marche modérée du Masjid Nabawi",
      "Chambres spacieuses",
      "Restauration halal"
    ],
    pointsFaibles: [
      "Prestations standardisées",
      "Vue variable selon les chambres"
    ],
    description: "Hôtel 4 étoiles Jiwar Al Madinah offrant un bon rapport qualité-prix à distance de marche de la Mosquée du Prophète. Adapté aux groupes et familles.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Salle de sport", "Navette"]
  },
  {
    id: "maien",
    name: "MAIEN",
    ville: "Médine",
    stars: 3,
    distanceHaramM: 600,
    bookingRating: 7.6,
    bookingReviews: 900,
    prixMoyenNuit: 60,
    pointsForts: [
      "Tarif économique",
      "Distance de marche raisonnable du Masjid Nabawi",
      "Chambres correctes",
      "Restauration halal"
    ],
    pointsFaibles: [
      "Prestations basiques",
      "Équipements limités"
    ],
    description: "Hôtel 3 étoiles économique de Médine à distance de marche de la Mosquée du Prophète. Option abordable pour un séjour Omra à petit budget.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie"]
  },
  {
    id: "maysan-al-harithia",
    name: "MAYSAN AL HARITHIA",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 1300,
    bookingRating: 7.9,
    bookingReviews: 1200,
    prixMoyenNuit: 80,
    pointsForts: [
      "Confort 4 étoiles à prix raisonnable",
      "Chambres spacieuses adaptées aux familles",
      "Navette vers le Masjid Nabawi",
      "Environnement calme"
    ],
    pointsFaibles: [
      "Situé à Al-Harithia, éloigné du sanctuaire",
      "Navette nécessaire"
    ],
    description: "Hôtel 4 étoiles du secteur Al-Harithia à Médine. Il offre espace et confort à prix contenu, avec navette vers la Mosquée du Prophète.",
    quartier: "Al-Harithia",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Navette", "Salle de prière", "Wifi gratuit", "Parking"]
  },
  {
    id: "mias-madinah",
    name: "MIAS MADINAH",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 500,
    bookingRating: 8.1,
    bookingReviews: 1400,
    prixMoyenNuit: 90,
    pointsForts: [
      "Confort 4 étoiles moderne",
      "Distance de marche modérée du Masjid Nabawi",
      "Chambres bien équipées",
      "Restauration halal soignée"
    ],
    pointsFaibles: [
      "Prestations standardisées",
      "Affluence en haute saison"
    ],
    description: "Hôtel 4 étoiles Mias Madinah offrant confort moderne et bon emplacement à distance de marche de la Mosquée du Prophète. Bon choix pour un séjour Omra.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Salle de sport", "Blanchisserie"]
  },
  {
    id: "movenpick-madinah",
    name: "MOVENPICK",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 250,
    bookingRating: 8.6,
    bookingReviews: 5500,
    prixMoyenNuit: 150,
    pointsForts: [
      "Marque Mövenpick (Accor), service haut de gamme",
      "Emplacement premium face au Masjid Nabawi",
      "Chambres élégantes, certaines avec vue mosquée",
      "Restauration réputée et buffets de qualité"
    ],
    pointsFaibles: [
      "Tarifs supérieurs à la moyenne des 4 étoiles",
      "Affluence dans le secteur central"
    ],
    description: "Mövenpick Hotel Madinah, établissement de la place de la mosquée offrant un accès quasi immédiat au sanctuaire. Confort et service de standing international pour un séjour privilégié.",
    quartier: "Centre",
    url: "https://all.accor.com/hotel/7222/index.en.shtml",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Vue mosquée", "Restaurant halal", "Buffet", "Salle de sport", "Salle de prière", "Wifi gratuit", "Conciergerie"]
  },
  {
    id: "musc-touch",
    name: "MUSC TOUCH",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 500,
    bookingRating: 8.0,
    bookingReviews: 1000,
    prixMoyenNuit: 85,
    pointsForts: [
      "Confort 4 étoiles moderne",
      "Distance de marche modérée du Masjid Nabawi",
      "Chambres soignées",
      "Restauration halal"
    ],
    pointsFaibles: [
      "Notoriété plus limitée",
      "Prestations standardisées"
    ],
    description: "Hôtel 4 étoiles Musc Touch offrant confort et cadre soigné à distance de marche de la Mosquée du Prophète. Bon rapport qualité-prix pour l'Omra.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Salle de sport", "Blanchisserie"]
  },
  {
    id: "mysk-madinah",
    name: "Mysk",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 400,
    bookingRating: 8.3,
    bookingReviews: 1200,
    prixMoyenNuit: 100,
    pointsForts: [
      "Marque Mysk (Shaza), design contemporain",
      "Proche du Masjid Nabawi",
      "Chambres élégantes et modernes",
      "Restauration halal soignée"
    ],
    pointsFaibles: [
      "Enseigne plus récente à Médine",
      "Affluence dans le secteur central"
    ],
    description: "Hôtel Mysk (gamme lifestyle de Shaza) au design contemporain, situé à courte distance de la Mosquée du Prophète. Bon choix 4 étoiles moderne pour l'Omra.",
    quartier: "Centre",
    url: "https://www.shazahotels.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Salle de sport", "Conciergerie"]
  },
  {
    id: "nusuk-al-eman",
    name: "NUSUK AL EMAN HOTEL",
    ville: "Médine",
    stars: 3,
    distanceHaramM: 600,
    bookingRating: 7.7,
    bookingReviews: 800,
    prixMoyenNuit: 65,
    pointsForts: [
      "Tarif économique",
      "Distance de marche raisonnable du Masjid Nabawi",
      "Chambres correctes",
      "Restauration halal"
    ],
    pointsFaibles: [
      "Prestations basiques",
      "Équipements limités"
    ],
    description: "Hôtel 3 étoiles économique de Médine à distance de marche de la Mosquée du Prophète. Option abordable pour un séjour Omra à budget maîtrisé.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie"]
  },
  {
    id: "peninsula-worth",
    name: "PENINSULA WORTH",
    ville: "Médine",
    stars: 5,
    distanceHaramM: 400,
    bookingRating: 8.4,
    bookingReviews: 1500,
    prixMoyenNuit: 130,
    pointsForts: [
      "Confort 5 étoiles à prix contenu",
      "Proche du Masjid Nabawi",
      "Chambres spacieuses et modernes",
      "Restauration de qualité"
    ],
    pointsFaibles: [
      "Notoriété plus limitée que les grandes marques",
      "Affluence dans le secteur central"
    ],
    description: "Hôtel 5 étoiles Peninsula Worth offrant confort haut de gamme à courte distance de la Mosquée du Prophète. Bon rapport qualité-prix pour la catégorie.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de sport", "Salle de prière", "Wifi gratuit", "Conciergerie"]
  },
  {
    id: "pullman-zamzam-madinah",
    name: "PULLMAN ZAMZAM",
    ville: "Médine",
    stars: 5,
    distanceHaramM: 200,
    bookingRating: 8.5,
    bookingReviews: 4500,
    prixMoyenNuit: 190,
    pointsForts: [
      "Marque Pullman (Accor), service haut de gamme",
      "Emplacement premium à proximité immédiate du Masjid Nabawi",
      "Chambres élégantes, certaines avec vue mosquée",
      "Restauration internationale de qualité"
    ],
    pointsFaibles: [
      "Tarifs premium",
      "Forte affluence dans le secteur central"
    ],
    description: "Pullman Zamzam Madina, hôtel 5 étoiles Accor situé à proximité immédiate de la Mosquée du Prophète. Confort et service de standing pour un séjour privilégié.",
    quartier: "Centre",
    url: "https://all.accor.com/hotel/9963/index.en.shtml",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Vue mosquée", "Restaurant halal", "Salle de sport", "Salle de prière", "Wifi gratuit", "Conciergerie"]
  },
  {
    id: "rotana-madinah",
    name: "ROTANA",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 400,
    bookingRating: 8.3,
    bookingReviews: 2800,
    prixMoyenNuit: 110,
    pointsForts: [
      "Marque Rotana réputée pour sa restauration",
      "Proche du Masjid Nabawi",
      "Chambres spacieuses et confortables",
      "Buffets généreux appréciés des pèlerins"
    ],
    pointsFaibles: [
      "Affluence dans le secteur central",
      "Tarifs en hausse en haute saison"
    ],
    description: "Hôtel Rotana de Médine, réputé pour son confort et sa restauration, situé à courte distance de la Mosquée du Prophète. Valeur sûre pour un séjour 4 étoiles.",
    quartier: "Centre",
    url: "https://www.rotana.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Buffet", "Salle de sport", "Salle de prière", "Wifi gratuit"]
  },
  {
    id: "saafa",
    name: "SAAFA",
    ville: "Médine",
    stars: 3,
    distanceHaramM: 500,
    bookingRating: 7.6,
    bookingReviews: 700,
    prixMoyenNuit: 60,
    pointsForts: [
      "Tarif économique",
      "Distance de marche modérée du Masjid Nabawi",
      "Chambres correctes",
      "Restauration halal"
    ],
    pointsFaibles: [
      "Prestations basiques",
      "Équipements limités"
    ],
    description: "Hôtel 3 étoiles économique de Médine à distance de marche de la Mosquée du Prophète. Option pratique pour un séjour Omra à petit budget.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie"]
  },
  {
    id: "shaza-regency-madinah",
    name: "SHAZA REGENCY",
    ville: "Médine",
    stars: 5,
    distanceHaramM: 350,
    bookingRating: 8.5,
    bookingReviews: 1600,
    prixMoyenNuit: 150,
    pointsForts: [
      "Luxe oriental raffiné signé Shaza",
      "Proche du Masjid Nabawi",
      "Service personnalisé et ambiance feutrée",
      "Restauration soignée"
    ],
    pointsFaibles: [
      "Tarifs élevés",
      "Affluence dans le secteur central"
    ],
    description: "Shaza Regency, hôtel 5 étoiles à l'élégance orientale situé à courte distance de la Mosquée du Prophète. Séjour luxueux avec un service très personnalisé.",
    quartier: "Centre",
    url: "https://www.shazahotels.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Spa", "Salle de sport", "Salle de prière", "Wifi gratuit", "Conciergerie"]
  },
  {
    id: "sofitel-shahd-madinah",
    name: "SOFITEL SHAHD",
    ville: "Médine",
    stars: 5,
    distanceHaramM: 300,
    bookingRating: 8.7,
    bookingReviews: 1800,
    prixMoyenNuit: 250,
    pointsForts: [
      "Luxe à la française signé Sofitel (Accor)",
      "Emplacement premium proche du Masjid Nabawi",
      "Chambres élégantes, certaines avec vue mosquée",
      "Restauration gastronomique et service impeccable"
    ],
    pointsFaibles: [
      "Tarifs parmi les plus élevés de Médine",
      "Affluence dans le secteur central"
    ],
    description: "Sofitel Shahd Al Madinah, adresse de luxe Accor à courte distance de la Mosquée du Prophète. Elle allie raffinement à la française, confort et service haut de gamme.",
    quartier: "Centre",
    url: "https://all.accor.com/hotel/A5J3/index.en.shtml",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Vue mosquée", "Restaurant halal", "Spa", "Salle de sport", "Salle de prière", "Wifi gratuit", "Conciergerie"]
  },
  {
    id: "tabat-al-salam-swiss",
    name: "TABAT AL SALAM SWISS INTERNATIONAL",
    ville: "Médine",
    stars: 3,
    distanceHaramM: 600,
    bookingRating: 7.7,
    bookingReviews: 900,
    prixMoyenNuit: 65,
    pointsForts: [
      "Marque Swiss International",
      "Tarif économique",
      "Distance de marche raisonnable du Masjid Nabawi",
      "Chambres correctes"
    ],
    pointsFaibles: [
      "Prestations basiques de catégorie 3 étoiles",
      "Équipements limités"
    ],
    description: "Hôtel 3 étoiles Swiss International de Médine, à distance de marche de la Mosquée du Prophète. Option abordable et fiable pour un séjour Omra.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie"]
  },
  {
    id: "taiba-front",
    name: "TAIBA FRONT",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 300,
    bookingRating: 8.2,
    bookingReviews: 2000,
    prixMoyenNuit: 95,
    pointsForts: [
      "Emplacement très proche du Masjid Nabawi",
      "Chambres confortables 4 étoiles",
      "Certaines chambres avec vue mosquée",
      "Restauration halal"
    ],
    pointsFaibles: [
      "Affluence dans le secteur central",
      "Prestations standardisées"
    ],
    description: "Hôtel 4 étoiles Taiba Front situé en première ligne du secteur central de Médine, à courte distance de la Mosquée du Prophète. Excellent emplacement pour l'Omra.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Vue mosquée", "Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie"]
  },
  {
    id: "tulip-inn-madinah",
    name: "Tulip Inn",
    ville: "Médine",
    stars: 3,
    distanceHaramM: 600,
    bookingRating: 7.7,
    bookingReviews: 1200,
    prixMoyenNuit: 65,
    pointsForts: [
      "Marque Tulip Inn (Louvre Hotels) fiable",
      "Tarif économique",
      "Distance de marche raisonnable du Masjid Nabawi",
      "Chambres correctes et propres"
    ],
    pointsFaibles: [
      "Prestations basiques de catégorie 3 étoiles",
      "Équipements limités"
    ],
    description: "Hôtel 3 étoiles Tulip Inn de Médine, à distance de marche de la Mosquée du Prophète. Bon rapport qualité-prix d'une marque internationale reconnue.",
    quartier: "Centre",
    url: "https://www.louvrehotels.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Blanchisserie"]
  },
  {
    id: "valy",
    name: "VALY",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 400,
    bookingRating: 8.0,
    bookingReviews: 1100,
    prixMoyenNuit: 85,
    pointsForts: [
      "Confort 4 étoiles à prix raisonnable",
      "Proche du Masjid Nabawi",
      "Chambres bien équipées",
      "Restauration halal"
    ],
    pointsFaibles: [
      "Notoriété plus limitée",
      "Affluence en haute saison"
    ],
    description: "Hôtel 4 étoiles Valy offrant confort et bon emplacement à courte distance de la Mosquée du Prophète. Bon rapport qualité-prix pour un séjour Omra.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Salle de sport", "Blanchisserie"]
  },
  {
    id: "view-madinah",
    name: "VIEW",
    ville: "Médine",
    stars: 4,
    distanceHaramM: 450,
    bookingRating: 8.1,
    bookingReviews: 1300,
    prixMoyenNuit: 90,
    pointsForts: [
      "Confort 4 étoiles moderne",
      "Proche du Masjid Nabawi",
      "Chambres soignées, certaines avec vue dégagée",
      "Restauration halal"
    ],
    pointsFaibles: [
      "Prestations standardisées",
      "Affluence dans le secteur central"
    ],
    description: "Hôtel 4 étoiles View offrant confort moderne et bon emplacement à distance de marche de la Mosquée du Prophète. Choix pertinent pour l'Omra.",
    quartier: "Centre",
    url: "https://www.booking.com/",
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Al-Masjid%20An-Nabawi%20(Bird%27s%20Eye%20View).jpg?width=800",
    amenities: ["Restaurant halal", "Salle de prière", "Wifi gratuit", "Salle de sport", "Blanchisserie"]
  }
];

// Helpers
export const hotelsLaMecque = hotelsData.filter((h) => h.ville === "La Mecque");
export const hotelsMedine = hotelsData.filter((h) => h.ville === "Médine");

export const getHotelById = (id: string): HotelData | undefined =>
  hotelsData.find((h) => h.id === id);
