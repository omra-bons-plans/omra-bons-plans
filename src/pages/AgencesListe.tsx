import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, TrendingUp, TrendingDown, Search, ExternalLink, Eye, ArrowRightLeft } from 'lucide-react';
import { SEOHead } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { useNavigate } from 'react-router-dom';

interface AgencyData {
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

const agenciesData: AgencyData[] = [
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

export default function AgencesListe() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const navigate = useNavigate();
  
  const filteredAgencies = agenciesData
    .filter(agency => 
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.googleRating - a.googleRating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.7) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (rating >= 4.3) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (rating >= 4.0) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
  };

  const handleViewDetails = (agencyName: string) => {
    navigate(`/agence-details/${encodeURIComponent(agencyName)}`);
  };

  const handleCompare = () => {
    navigate('/comparatif-visuel');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Liste Agences de Voyages Omra & Hajj 2025-2026"
        description="Découvrez la liste complète des meilleures agences de voyage pour Omra et Hajj : notes Google, avis clients, points forts et tarifs."
        keywords="agence omra, hajj 2025, agence voyage mecque, avis google"
      />

      <div className="container mx-auto px-4 py-8">
        <SEOBreadcrumb 
          items={[
            { name: 'Accueil', url: '/' },
            { name: 'Agences Liste', url: '/agences-liste' }
          ]}
        />

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Comparatif Agences de Voyages Omra & Hajj
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Analysez et comparez les meilleures agences de voyage pour votre pèlerinage. 
            Notes Google authentiques, avis clients et analyse détaillée des services.
          </p>
        </header>

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher une agence ou spécialité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'rating' ? 'default' : 'outline'}
              onClick={() => setSortBy('rating')}
              size="sm"
            >
              Par Note
            </Button>
            <Button
              variant={sortBy === 'reviews' ? 'default' : 'outline'}
              onClick={() => setSortBy('reviews')}
              size="sm"
            >
              Par Avis
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              onClick={() => setSortBy('name')}
              size="sm"
            >
              Par Nom
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgencies.map((agency) => (
            <Card key={agency.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{agency.name}</CardTitle>
                  <a 
                    href={agency.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(agency.googleRating)}</div>
                  <Badge className={getRatingColor(agency.googleRating)}>
                    {agency.googleRating}/5
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({agency.reviewCount} avis)
                  </span>
                </div>
                {agency.highlight && (
                  <p className="text-sm text-primary font-medium">{agency.highlight}</p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">{agency.priceRange}</Badge>
                  <div className="flex flex-wrap gap-1">
                    {agency.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    Points Forts
                  </h4>
                  <ul className="text-xs space-y-1">
                    {agency.strengths.slice(0, 3).map((strength, index) => (
                      <li key={index} className="text-muted-foreground">• {strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-orange-600" />
                    Points d'Attention
                  </h4>
                  <ul className="text-xs space-y-1">
                    {agency.weaknesses.slice(0, 2).map((weakness, index) => (
                      <li key={index} className="text-muted-foreground">• {weakness}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(agency.name)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir détail
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    onClick={handleCompare}
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    VS
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}