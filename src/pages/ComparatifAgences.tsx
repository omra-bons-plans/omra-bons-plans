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
import { agenciesData } from '@/utils/agenciesData';

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
        title="Comparatif Agences de Voyages Omra & Hajj 2026-2027"
        description="Comparatif complet des meilleures agences de voyage pour Omra et Hajj : notes Google, avis clients, points forts et tarifs. Trouvez l'agence idéale pour votre pèlerinage."
        keywords="comparatif agence omra 2026, hajj 2026, agence voyage mecque, avis google, tawaf, omra du savoir"
        canonical="https://omrabonsplans.fr/comparatif-agences"
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
            Comparatif Détaillé des Agences de Voyages Omra & Hajj 2026-2027
          </h1>
          <h2 className="text-2xl text-muted-foreground mb-4 font-semibold">
            Tableau comparatif complet : tarifs, services, notes Google et avis clients vérifiés
          </h2>
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