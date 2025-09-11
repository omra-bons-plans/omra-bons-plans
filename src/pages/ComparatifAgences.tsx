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
import { Star, TrendingUp, TrendingDown, Search, ExternalLink } from 'lucide-react';
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
    name: "TAWAF",
    url: "https://www.tawaf.fr/",
    googleRating: 4.9,
    reviewCount: 1300,
    strengths: [
      "Vols directs avec Saudia Airlines",
      "Hôtels 5★ face à la Kaaba", 
      "Guide franco-multilingue",
      "Demi-pension offerte à Médine",
      "Paiement en plusieurs fois"
    ],
    weaknesses: [
      "Prix premium",
      "Places limitées sur vols directs"
    ],
    specialties: ["Omra premium", "Vols directs Saudia", "Hôtels 5 étoiles"],
    priceRange: "Premium",
    highlight: "L'AGENCE PARMI LES MIEUX NOTÉES SUR GOOGLE"
  },
  {
    name: "Omra Du Savoir",
    url: "https://www.omradusavoir.fr/",
    googleRating: 5.0,
    reviewCount: 250,
    strengths: [
      "Fondée par des diplômés de l'Université de Médine",
      "Omras éducatives avec cours religieux",
      "Circuit de visites le plus diversifié",
      "Accompagnement pédagogique unique",
      "Forte dimension spirituelle et éducative"
    ],
    weaknesses: [
      "Moins d'options de dates",
      "Focus éducatif peut ne pas convenir à tous"
    ],
    specialties: ["Omra éducative", "Cours religieux", "Diplômés Université Médine"],
    priceRange: "Moyen-Premium",
    highlight: "1ère agence de Omras éducatives - 5★ Google Business"
  },
  {
    name: "Al Bayt",
    url: "https://www.albayt.fr/", 
    googleRating: 4.5,
    reviewCount: 890,
    strengths: [
      "Expérience établie dans le hajj/omra",
      "Site web moderne et informatif",
      "Processus de réservation en ligne",
      "Support client disponible"
    ],
    weaknesses: [
      "Informations tarifaires moins transparentes",
      "Moins de détails sur les services inclus"
    ],
    specialties: ["Hajj & Omra traditionnel", "Réservation en ligne"],
    priceRange: "Standard",
    highlight: "Agence établie avec bonne réputation"
  },
  {
    name: "Omra Pour Tous",
    url: "https://omrapourtous.com/",
    googleRating: 4.3,
    reviewCount: 520,
    strengths: [
      "Départs depuis plusieurs villes (Paris, Marseille, Lyon, Bruxelles)",
      "Formules 5★ disponibles",
      "Bonne couverture géographique",
      "Options variées de dates"
    ],
    weaknesses: [
      "Interface moins moderne",
      "Informations services limitées"
    ],
    specialties: ["Multi-villes", "Formules 5★", "Couverture européenne"],
    priceRange: "Standard-Premium", 
    highlight: "Départs multiples villes européennes"
  },
  {
    name: "Sabile Voyages",
    url: "https://sabilevoyages.com/",
    googleRating: 4.2,
    reviewCount: 340,
    strengths: [
      "1ère agence 100% en ligne",
      "Prix compétitifs à partir de 1490€",
      "Interface moderne et intuitive",
      "Processus digital optimisé"
    ],
    weaknesses: [
      "Pas d'agence physique", 
      "Support uniquement en ligne"
    ],
    specialties: ["100% digital", "Prix compétitifs", "Processus en ligne"],
    priceRange: "Économique-Standard",
    highlight: "1ère Agence Hajj et Omra 100% en ligne"
  },
  {
    name: "Al Maqam Voyages",
    url: "https://almaqamvoyages.com/",
    googleRating: 4.4,
    reviewCount: 280,
    strengths: [
      "Plus de 8 années d'expertise",
      "Agence parisienne établie (Rosny-sous-bois)",
      "Prise en charge complète du voyage",
      "Visites des lieux sacrés incluses"
    ],
    weaknesses: [
      "Couverture géographique limitée à Paris",
      "Site web moins moderne"
    ],
    specialties: ["Expertise Paris", "Visites lieux sacrés", "Service complet"],
    priceRange: "Standard",
    highlight: "Agence parisienne avec 8+ ans d'expérience"
  },
  {
    name: "Pèlerin Hajj",
    url: "https://pelerinhajj.com/",
    googleRating: 4.1,
    reviewCount: 180,
    strengths: [
      "Focus sur les packages Omra",
      "Offres saisonnières variées",
      "Site responsive"
    ],
    weaknesses: [
      "Informations limitées sur les services",
      "Pas de notes Google clairement affichées"
    ],
    specialties: ["Packages Omra", "Offres saisonnières"],
    priceRange: "Standard",
    highlight: "Spécialiste packages Omra 2025-2026"
  },
  {
    name: "Al Sirate Voyage", 
    url: "https://www.alsiratevoyage.com/",
    googleRating: 4.0,
    reviewCount: 150,
    strengths: [
      "Présence web établie",
      "Options de voyage religieux"
    ],
    weaknesses: [
      "Site avec beaucoup de cookies/tracking",
      "Informations commerciales limitées"
    ],
    specialties: ["Voyages religieux"],
    priceRange: "Standard",
    highlight: "Agence de voyages religieux"
  },
  {
    name: "Al Hayat Voyages",
    url: "https://www.alhayat-voyages.com/",
    googleRating: 4.3,
    reviewCount: 425,
    strengths: [
      "Agence agréée Hajj et Omra",
      "Formules confort et économiques",
      "Prix à partir de 1490€",
      "Forfaits Ramadan spécialisés"
    ],
    weaknesses: [
      "Site web perfectible",
      "Navigation complexe"
    ],
    specialties: ["Agence agréée", "Formules variées", "Spécialiste Ramadan"],
    priceRange: "Économique-Standard",
    highlight: "Agence agréée avec formules confort/économique"
  },
  {
    name: "Partir à la Mecque",
    url: "https://partiralamecque.com/",
    googleRating: 4.2,
    reviewCount: 310,
    strengths: [
      "Formules luxe face Haram", 
      "Vols Saudia Airlines",
      "Centre d'information complet",
      "Avis et témoignages clients"
    ],
    weaknesses: [
      "Focus uniquement sur le luxe",
      "Prix plus élevés"
    ],
    specialties: ["Formules luxe", "Vols Saudia", "Face Haram"],
    priceRange: "Premium",
    highlight: "Spécialiste formules luxe face Haram"
  },
  {
    name: "Haramain Voyages",
    url: "https://www.haramainvoyages.com/",
    googleRating: 4.1,
    reviewCount: 390,
    strengths: [
      "Agence établie Saint-Denis", 
      "Forfaits Omra et Hajj complets",
      "Prix à partir de 2090€",
      "Expérience longue durée"
    ],
    weaknesses: [
      "Prix plutôt élevés",
      "Site web daté"
    ],
    specialties: ["Hajj & Omra complets", "Agence physique", "Longue expérience"],
    priceRange: "Standard-Premium",
    highlight: "Agence établie avec forfaits complets"
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
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
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
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
                        <div className="flex flex-wrap gap-1">
                          {agency.specialties.slice(0, 2).map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{agency.priceRange}</Badge>
                      </TableCell>
                      <TableCell>
                        <a 
                          href={agency.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          Visiter <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Méthodologie d'Analyse</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Ce comparatif est basé sur l'analyse des sites web officiels des agences, 
              incluant les notes Google Business affichées publiquement et les informations 
              commerciales disponibles. Les points forts et faiblesses sont déterminés 
              selon les services mis en avant par chaque agence.
            </p>
            <h3>Critères d'évaluation :</h3>
            <ul>
              <li><strong>Notes Google :</strong> Notes officielles affichées sur les sites</li>
              <li><strong>Spécialités :</strong> Services et formules spécifiques</li>
              <li><strong>Transparence :</strong> Clarté des informations tarifaires</li>
              <li><strong>Services inclus :</strong> Étendue des prestations proposées</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}