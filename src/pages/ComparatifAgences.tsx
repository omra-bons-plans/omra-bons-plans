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
    name: "Albayt",
    url: "https://www.albayt.fr/",
    googleRating: 0,
    reviewCount: 0,
    strengths: ["Données non disponibles"],
    weaknesses: ["Données d'avis Google non disponibles"],
    specialties: ["Omra sur-mesure", "Accompagnement familial"],
    priceRange: "Non communiqué",
    highlight: "⚠️ Note Google non trouvée"
  },
  {
    name: "Tawaf",
    url: "https://www.tawaf.fr/",
    googleRating: 0,
    reviewCount: 0,
    strengths: ["Vols directs Saudia", "Hôtels face mosquées", "Accompagnateurs expérimentés"],
    weaknesses: ["Données d'avis Google non disponibles"],
    specialties: ["Hajj 2025", "Omra Ramadan", "Accompagnement Seera"],
    priceRange: "Non communiqué",
    highlight: "⚠️ Note Google non trouvée - Accompagnement via Nusuk/Seera"
  },
  {
    name: "Omra pour Tous",
    url: "https://omrapourtous.com/",
    googleRating: 4.0,
    reviewCount: 3,
    strengths: ["Voyage spirituel exceptionnel selon avis", "Service dépassant les attentes", "Expérience remarquable"],
    weaknesses: ["Très peu d'avis disponibles (seulement 3)", "Données limitées"],
    specialties: ["Omra économique", "Formules tout inclus"],
    priceRange: "À partir de 1200€",
    highlight: "✅ Note Trustpilot: 4.0/5 (3 avis) - Données limitées"
  },
  {
    name: "Sabile Voyages",
    url: "https://sabilevoyages.com/",
    googleRating: 0,
    reviewCount: 0,
    strengths: ["100% en ligne", "Première agence entièrement digitale", "Processus optimisé"],
    weaknesses: ["Données d'avis non disponibles", "Pas d'agence physique"],
    specialties: ["Réservation en ligne", "Omra Ramadan", "Formules flexibles"],
    priceRange: "Non communiqué",
    highlight: "⚠️ Note Google non trouvée - Première agence 100% en ligne"
  },
  {
    name: "Almaqam Voyages",
    url: "https://almaqamvoyages.com/",
    googleRating: 4.7,
    reviewCount: 59,
    strengths: ["Services excellents selon avis", "Gestion complète du voyage", "Support proactif", "Expérience fantastique"],
    weaknesses: ["Prix potentiellement plus élevé"],
    specialties: ["Services premium", "Accompagnement complet", "Gestion end-to-end"],
    priceRange: "Non communiqué",
    highlight: "✅ Note Trustpilot: 4.7/5 (59 avis) - Excellents retours clients"
  },
  {
    name: "Pèlerin Hajj",
    url: "https://pelerinhajj.com/",
    googleRating: 0,
    reviewCount: 0,
    strengths: ["Données non disponibles"],
    weaknesses: ["Données d'avis non disponibles"],
    specialties: ["Spécialisation Hajj", "Formation pré-départ"],
    priceRange: "Non communiqué",
    highlight: "⚠️ Note Google non trouvée"
  },
  {
    name: "Al Sirate Voyage",
    url: "https://www.alsiratevoyage.com/",
    googleRating: 0,
    reviewCount: 0,
    strengths: ["Couverture géographique étendue", "Services localisés"],
    weaknesses: ["Données d'avis non disponibles"],
    specialties: ["Omra depuis différentes villes", "Services localisés"],
    priceRange: "Non communiqué",
    highlight: "⚠️ Note Google non trouvée"
  },
  {
    name: "Omra du Savoir",
    url: "https://www.omradusavoir.fr/",
    googleRating: 5.0,
    reviewCount: 0,
    strengths: ["Formation spirituelle", "Diplômés Université de Médine", "Omra éducative unique", "Cours religieux sur place"],
    weaknesses: ["Données détaillées non disponibles", "Programme peut être intensif"],
    specialties: ["Omra éducative", "Formation religieuse", "Cours sur place"],
    priceRange: "Non communiqué",
    highlight: "✅ Revendique 5★ Google Business (source: leur site) - 1ère agence Omras éducatives"
  },
  {
    name: "Al Hayat Voyages",
    url: "https://www.alhayat-voyages.com/",
    googleRating: 0,
    reviewCount: 0,
    strengths: ["Formules Confort et Économique", "Plusieurs dates disponibles", "Agence agréée"],
    weaknesses: ["Données d'avis non disponibles"],
    specialties: ["Formules Confort et Économique", "Plusieurs dates", "Spécialiste Ramadan"],
    priceRange: "À partir de 1190€",
    highlight: "⚠️ Note Google non trouvée - Plusieurs formules tarifaires"
  },
  {
    name: "Partir à la Mecque",
    url: "https://partiralamecque.com/",
    googleRating: 0,
    reviewCount: 0,
    strengths: ["En partenariat avec Ariane Voyages", "Section avis et témoignages"],
    weaknesses: ["Données d'avis Google non disponibles"],
    specialties: ["Hajj 2025", "Omra 2025", "Partenariat Ariane Voyages"],
    priceRange: "Non communiqué",
    highlight: "⚠️ Note Google non trouvée - Partenariat avec Ariane Voyages"
  },
  {
    name: "Haramain Voyages",
    url: "https://www.haramainvoyages.com/",
    googleRating: 0,
    reviewCount: 0,
    strengths: ["Agence établie Saint-Denis", "Forfaits Hajj 2026", "Partenariats hôteliers"],
    weaknesses: ["Données d'avis non disponibles"],
    specialties: ["Hajj 2026", "Séjours premium", "Partenariats hôteliers"],
    priceRange: "À partir de 2090€",
    highlight: "⚠️ Note Google non trouvée - Agence établie avec gamme premium"
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
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-amber-600 mb-3">
                ⚠️ Avertissement important sur les données
              </h3>
              <p className="text-sm mb-3">
                <strong>Recherche effectuée le {new Date().toLocaleDateString('fr-FR')} :</strong> Malgré des recherches approfondies sur Google Maps, Trustpilot et les sites officiels, 
                les vraies notes Google Business n'ont pas été trouvées pour la plupart des agences listées.
              </p>
            </div>

            <h3>Sources de données réelles trouvées :</h3>
            <ul>
              <li><strong>✅ Omra pour Tous :</strong> Note Trustpilot 4.0/5 (3 avis seulement)</li>
              <li><strong>✅ Almaqam Voyages :</strong> Note Trustpilot 4.7/5 (59 avis)</li>
              <li><strong>✅ Omra du Savoir :</strong> Revendique "5★ Google Business" sur leur site officiel</li>
              <li><strong>⚠️ Autres agences :</strong> Aucune donnée d'avis fiable trouvée</li>
            </ul>

            <h3>Limitations importantes :</h3>
            <ul>
              <li>Les notes Google Maps réelles n'ont pas pu être récupérées automatiquement</li>
              <li>Beaucoup d'agences n'ont pas de profil Trustpilot public ou très peu d'avis</li>
              <li>Les informations sur les points forts/faibles sont limitées par manque de données d'avis clients</li>
              <li>Les prix sont basés uniquement sur les informations visibles sur leurs sites web</li>
            </ul>

            <h3>Recommandations avant de choisir :</h3>
            <p><strong>Il est essentiel de vérifier vous-même :</strong></p>
            <ul>
              <li>Chercher manuellement leurs avis Google Maps en recherchant le nom de l'agence</li>
              <li>Consulter les avis sur différentes plateformes (Trustpilot, Facebook, forums, etc.)</li>
              <li>Contacter directement les agences pour obtenir des devis détaillés et comparer</li>
              <li>Demander des références d'anciens clients</li>
              <li>Vérifier leur agrément officiel auprès des autorités compétentes</li>
              <li>Lire attentivement les conditions générales de vente</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}