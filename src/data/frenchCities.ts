export interface FrenchCity {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
}

export const FRENCH_CITIES: FrenchCity[] = [
  // Île-de-France
  { slug: "paris", name: "Paris", lat: 48.8566, lng: 2.3522, region: "Île-de-France" },
  { slug: "saint-denis", name: "Saint-Denis", lat: 48.9362, lng: 2.3574, region: "Île-de-France" },
  { slug: "montreuil", name: "Montreuil", lat: 48.8638, lng: 2.4408, region: "Île-de-France" },
  { slug: "argenteuil", name: "Argenteuil", lat: 48.9472, lng: 2.2467, region: "Île-de-France" },
  { slug: "nanterre", name: "Nanterre", lat: 48.8913, lng: 2.2070, region: "Île-de-France" },
  { slug: "vitry-sur-seine", name: "Vitry-sur-Seine", lat: 48.7876, lng: 2.3929, region: "Île-de-France" },
  { slug: "creteil", name: "Créteil", lat: 48.7910, lng: 2.4570, region: "Île-de-France" },
  { slug: "aulnay-sous-bois", name: "Aulnay-sous-Bois", lat: 48.9374, lng: 2.5023, region: "Île-de-France" },
  { slug: "sarcelles", name: "Sarcelles", lat: 48.9955, lng: 2.3806, region: "Île-de-France" },
  { slug: "drancy", name: "Drancy", lat: 48.9218, lng: 2.4578, region: "Île-de-France" },
  { slug: "colombes", name: "Colombes", lat: 48.9235, lng: 2.2535, region: "Île-de-France" },
  { slug: "bobigny", name: "Bobigny", lat: 48.9094, lng: 2.4393, region: "Île-de-France" },
  { slug: "mantes-la-jolie", name: "Mantes-la-Jolie", lat: 48.9922, lng: 1.7173, region: "Île-de-France" },
  { slug: "meaux", name: "Meaux", lat: 48.9605, lng: 2.8844, region: "Île-de-France" },
  { slug: "evry", name: "Évry", lat: 48.6276, lng: 2.4331, region: "Île-de-France" },
  { slug: "trappes", name: "Trappes", lat: 48.7752, lng: 1.9900, region: "Île-de-France" },
  { slug: "cergy", name: "Cergy", lat: 49.0370, lng: 2.0801, region: "Île-de-France" },
  { slug: "versailles", name: "Versailles", lat: 48.8048, lng: 2.1203, region: "Île-de-France" },
  { slug: "boulogne-billancourt", name: "Boulogne-Billancourt", lat: 48.8352, lng: 2.2400, region: "Île-de-France" },
  { slug: "aubervilliers", name: "Aubervilliers", lat: 48.9139, lng: 2.3857, region: "Île-de-France" },
  { slug: "champigny-sur-marne", name: "Champigny-sur-Marne", lat: 48.8175, lng: 2.5156, region: "Île-de-France" },
  { slug: "noisy-le-grand", name: "Noisy-le-Grand", lat: 48.8485, lng: 2.5490, region: "Île-de-France" },
  { slug: "sevran", name: "Sevran", lat: 48.9514, lng: 2.5264, region: "Île-de-France" },
  { slug: "la-courneuve", name: "La Courneuve", lat: 48.9301, lng: 2.3923, region: "Île-de-France" },
  { slug: "pantin", name: "Pantin", lat: 48.8974, lng: 2.4022, region: "Île-de-France" },
  { slug: "bondy", name: "Bondy", lat: 48.9024, lng: 2.4858, region: "Île-de-France" },
  { slug: "orly", name: "Orly", lat: 48.7487, lng: 2.4021, region: "Île-de-France" },
  { slug: "corbeil-essonnes", name: "Corbeil-Essonnes", lat: 48.6144, lng: 2.4819, region: "Île-de-France" },
  // Auvergne-Rhône-Alpes
  { slug: "lyon", name: "Lyon", lat: 45.7640, lng: 4.8357, region: "Auvergne-Rhône-Alpes" },
  { slug: "villeurbanne", name: "Villeurbanne", lat: 45.7676, lng: 4.8798, region: "Auvergne-Rhône-Alpes" },
  { slug: "grenoble", name: "Grenoble", lat: 45.1885, lng: 5.7245, region: "Auvergne-Rhône-Alpes" },
  { slug: "saint-etienne", name: "Saint-Étienne", lat: 45.4397, lng: 4.3872, region: "Auvergne-Rhône-Alpes" },
  { slug: "annecy", name: "Annecy", lat: 45.8992, lng: 6.1294, region: "Auvergne-Rhône-Alpes" },
  { slug: "chambery", name: "Chambéry", lat: 45.5646, lng: 5.9178, region: "Auvergne-Rhône-Alpes" },
  { slug: "valence", name: "Valence", lat: 44.9334, lng: 4.8924, region: "Auvergne-Rhône-Alpes" },
  { slug: "clermont-ferrand", name: "Clermont-Ferrand", lat: 45.7797, lng: 3.0863, region: "Auvergne-Rhône-Alpes" },
  // Provence-Alpes-Côte d'Azur
  { slug: "marseille", name: "Marseille", lat: 43.2965, lng: 5.3698, region: "Provence-Alpes-Côte d'Azur" },
  { slug: "nice", name: "Nice", lat: 43.7102, lng: 7.2620, region: "Provence-Alpes-Côte d'Azur" },
  { slug: "toulon", name: "Toulon", lat: 43.1242, lng: 5.9280, region: "Provence-Alpes-Côte d'Azur" },
  { slug: "aix-en-provence", name: "Aix-en-Provence", lat: 43.5298, lng: 5.4474, region: "Provence-Alpes-Côte d'Azur" },
  { slug: "avignon", name: "Avignon", lat: 43.9493, lng: 4.8059, region: "Provence-Alpes-Côte d'Azur" },
  { slug: "cannes", name: "Cannes", lat: 43.5528, lng: 7.0174, region: "Provence-Alpes-Côte d'Azur" },
  { slug: "antibes", name: "Antibes", lat: 43.5804, lng: 7.1246, region: "Provence-Alpes-Côte d'Azur" },
  { slug: "frejus", name: "Fréjus", lat: 43.4328, lng: 6.7370, region: "Provence-Alpes-Côte d'Azur" },
  // Hauts-de-France
  { slug: "lille", name: "Lille", lat: 50.6292, lng: 3.0573, region: "Hauts-de-France" },
  { slug: "roubaix", name: "Roubaix", lat: 50.6942, lng: 3.1746, region: "Hauts-de-France" },
  { slug: "tourcoing", name: "Tourcoing", lat: 50.7239, lng: 3.1607, region: "Hauts-de-France" },
  { slug: "valenciennes", name: "Valenciennes", lat: 50.3574, lng: 3.5234, region: "Hauts-de-France" },
  { slug: "dunkerque", name: "Dunkerque", lat: 51.0344, lng: 2.3771, region: "Hauts-de-France" },
  { slug: "lens", name: "Lens", lat: 50.4310, lng: 2.8274, region: "Hauts-de-France" },
  { slug: "douai", name: "Douai", lat: 50.3713, lng: 3.0817, region: "Hauts-de-France" },
  { slug: "amiens", name: "Amiens", lat: 49.8941, lng: 2.2957, region: "Hauts-de-France" },
  { slug: "calais", name: "Calais", lat: 50.9511, lng: 1.8569, region: "Hauts-de-France" },
  { slug: "arras", name: "Arras", lat: 50.2916, lng: 2.7786, region: "Hauts-de-France" },
  { slug: "saint-quentin", name: "Saint-Quentin", lat: 49.8484, lng: 3.2870, region: "Hauts-de-France" },
  { slug: "creil", name: "Creil", lat: 49.2583, lng: 2.4833, region: "Hauts-de-France" },
  // Grand Est
  { slug: "strasbourg", name: "Strasbourg", lat: 48.5734, lng: 7.7521, region: "Grand Est" },
  { slug: "metz", name: "Metz", lat: 49.1193, lng: 6.1757, region: "Grand Est" },
  { slug: "nancy", name: "Nancy", lat: 48.6921, lng: 6.1844, region: "Grand Est" },
  { slug: "mulhouse", name: "Mulhouse", lat: 47.7508, lng: 7.3359, region: "Grand Est" },
  { slug: "reims", name: "Reims", lat: 49.2628, lng: 4.0347, region: "Grand Est" },
  { slug: "colmar", name: "Colmar", lat: 48.0793, lng: 7.3585, region: "Grand Est" },
  { slug: "belfort", name: "Belfort", lat: 47.6390, lng: 6.8630, region: "Grand Est" },
  { slug: "troyes", name: "Troyes", lat: 48.2975, lng: 4.0751, region: "Grand Est" },
  { slug: "epinal", name: "Épinal", lat: 48.1742, lng: 6.4535, region: "Grand Est" },
  // Occitanie
  { slug: "toulouse", name: "Toulouse", lat: 43.6047, lng: 1.4442, region: "Occitanie" },
  { slug: "montpellier", name: "Montpellier", lat: 43.6108, lng: 3.8767, region: "Occitanie" },
  { slug: "nimes", name: "Nîmes", lat: 43.8367, lng: 4.3601, region: "Occitanie" },
  { slug: "perpignan", name: "Perpignan", lat: 42.6986, lng: 2.8954, region: "Occitanie" },
  { slug: "beziers", name: "Béziers", lat: 43.3467, lng: 3.2168, region: "Occitanie" },
  { slug: "albi", name: "Albi", lat: 43.9292, lng: 2.1480, region: "Occitanie" },
  { slug: "tarbes", name: "Tarbes", lat: 43.2328, lng: 0.0780, region: "Occitanie" },
  // Nouvelle-Aquitaine
  { slug: "bordeaux", name: "Bordeaux", lat: 44.8378, lng: -0.5792, region: "Nouvelle-Aquitaine" },
  { slug: "limoges", name: "Limoges", lat: 45.8336, lng: 1.2611, region: "Nouvelle-Aquitaine" },
  { slug: "la-rochelle", name: "La Rochelle", lat: 46.1603, lng: -1.1511, region: "Nouvelle-Aquitaine" },
  { slug: "poitiers", name: "Poitiers", lat: 46.5802, lng: 0.3404, region: "Nouvelle-Aquitaine" },
  { slug: "pau", name: "Pau", lat: 43.2951, lng: -0.3708, region: "Nouvelle-Aquitaine" },
  { slug: "bayonne", name: "Bayonne", lat: 43.4929, lng: -1.4748, region: "Nouvelle-Aquitaine" },
  { slug: "angouleme", name: "Angoulême", lat: 45.6481, lng: 0.1556, region: "Nouvelle-Aquitaine" },
  { slug: "agen", name: "Agen", lat: 44.2000, lng: 0.6167, region: "Nouvelle-Aquitaine" },
  { slug: "niort", name: "Niort", lat: 46.3240, lng: -0.4592, region: "Nouvelle-Aquitaine" },
  // Pays de la Loire
  { slug: "nantes", name: "Nantes", lat: 47.2184, lng: -1.5536, region: "Pays de la Loire" },
  { slug: "le-mans", name: "Le Mans", lat: 48.0061, lng: 0.1996, region: "Pays de la Loire" },
  { slug: "angers", name: "Angers", lat: 47.4784, lng: -0.5632, region: "Pays de la Loire" },
  { slug: "saint-nazaire", name: "Saint-Nazaire", lat: 47.2734, lng: -2.2139, region: "Pays de la Loire" },
  { slug: "laval", name: "Laval", lat: 48.0745, lng: -0.7703, region: "Pays de la Loire" },
  // Bretagne
  { slug: "rennes", name: "Rennes", lat: 48.1173, lng: -1.6778, region: "Bretagne" },
  { slug: "brest", name: "Brest", lat: 48.3904, lng: -4.4861, region: "Bretagne" },
  { slug: "lorient", name: "Lorient", lat: 47.7486, lng: -3.3673, region: "Bretagne" },
  { slug: "quimper", name: "Quimper", lat: 47.9963, lng: -4.0935, region: "Bretagne" },
  { slug: "saint-brieuc", name: "Saint-Brieuc", lat: 48.5136, lng: -2.7653, region: "Bretagne" },
  // Normandie
  { slug: "rouen", name: "Rouen", lat: 49.4432, lng: 1.0993, region: "Normandie" },
  { slug: "caen", name: "Caen", lat: 49.1829, lng: -0.3707, region: "Normandie" },
  { slug: "le-havre", name: "Le Havre", lat: 49.4938, lng: 0.1079, region: "Normandie" },
  { slug: "cherbourg", name: "Cherbourg", lat: 49.6337, lng: -1.6227, region: "Normandie" },
  { slug: "evreux", name: "Évreux", lat: 49.0266, lng: 1.1504, region: "Normandie" },
  // Centre-Val de Loire
  { slug: "orleans", name: "Orléans", lat: 47.9029, lng: 1.9092, region: "Centre-Val de Loire" },
  { slug: "tours", name: "Tours", lat: 47.3941, lng: 0.6848, region: "Centre-Val de Loire" },
  { slug: "chartres", name: "Chartres", lat: 48.4547, lng: 1.4882, region: "Centre-Val de Loire" },
  { slug: "blois", name: "Blois", lat: 47.5861, lng: 1.3359, region: "Centre-Val de Loire" },
  // Bourgogne-Franche-Comté
  { slug: "dijon", name: "Dijon", lat: 47.3220, lng: 5.0415, region: "Bourgogne-Franche-Comté" },
  { slug: "besancon", name: "Besançon", lat: 47.2378, lng: 6.0241, region: "Bourgogne-Franche-Comté" },
];

export function getCityBySlug(slug: string): FrenchCity | undefined {
  return FRENCH_CITIES.find(c => c.slug === slug);
}
