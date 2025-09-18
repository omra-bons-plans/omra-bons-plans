import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Star, Search, ExternalLink } from 'lucide-react';
import { SEOHead } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';

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

export default function ComparatifAgences() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  
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

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Comparatif Agences de Voyages Omra & Hajj 2025-2026"
        description="Comparatif complet des meilleures agences de voyage pour Omra et Hajj : notes Google, avis clients, points forts et tarifs. Trouvez l'agence idéale pour votre pèlerinage."
        keywords="comparatif agence omra, hajj 2025, agence voyage mecque, avis google, tawaf, omra du savoir"
      />

      <div className="container mx-auto px-4 py-8">
        <SEOBreadcrumb 
          items={[
            { name: 'Accueil', url: '/' },
            { name: 'Comparatif Agences', url: '/comparatif-agences' }
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

        <div className="mb-6 flex flex-col gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher une agence ou spécialité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortBy === 'rating' ? 'default' : 'outline'}
              onClick={() => setSortBy('rating')}
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              Par Note
            </Button>
            <Button
              variant={sortBy === 'reviews' ? 'default' : 'outline'}
              onClick={() => setSortBy('reviews')}
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              Par Avis
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              onClick={() => setSortBy('name')}
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              Par Nom
            </Button>
          </div>
        </div>

        {/* Mobile Card View (visible on small screens) */}
        <div className="block lg:hidden space-y-4">
          {filteredAgencies.map((agency) => (
            <Card key={agency.name} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{agency.name}</h3>
                    {agency.highlight && (
                      <p className="text-sm text-primary mt-1">{agency.highlight}</p>
                    )}
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      agency.priceRange === 'Premium' ? 'border-purple-500 text-purple-700' :
                      agency.priceRange === 'Économique' ? 'border-green-500 text-green-700' :
                      'border-blue-500 text-blue-700'
                    }
                  >
                    {agency.priceRange}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(agency.googleRating)}</div>
                    <Badge className={getRatingColor(agency.googleRating)}>
                      {agency.googleRating}
                    </Badge>
                  </div>
                  <Badge variant="outline">{agency.reviewCount} avis</Badge>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {agency.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {agency.specialties.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{agency.specialties.length - 3}
                    </Badge>
                  )}
                </div>
                
                <Button 
                  className="w-full"
                  asChild
                >
                  <a 
                    href={agency.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2"
                  >
                    Visiter l'agence
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Table View (hidden on small screens) */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Tableau Comparatif Détaillé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agence</TableHead>
                    <TableHead>Note Google</TableHead>
                    <TableHead>Nb d'Avis</TableHead>
                    <TableHead>Spécialités</TableHead>
                    <TableHead>Gamme Prix</TableHead>
                    <TableHead>Site Web</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgencies.map((agency) => (
                    <TableRow key={agency.name}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{agency.name}</div>
                          {agency.highlight && (
                            <div className="text-xs text-primary mt-1">{agency.highlight}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(agency.googleRating)}</div>
                          <Badge className={getRatingColor(agency.googleRating)}>
                            {agency.googleRating}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{agency.reviewCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {agency.specialties.slice(0, 2).map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {agency.specialties.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{agency.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            agency.priceRange === 'Premium' ? 'border-purple-500 text-purple-700' :
                            agency.priceRange === 'Économique' ? 'border-green-500 text-green-700' :
                            'border-blue-500 text-blue-700'
                          }
                        >
                          {agency.priceRange}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a 
                          href={agency.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          Visiter
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}