import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { DynamicSEO } from '@/components/SEO/DynamicSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: 'ad' | 'blog';
  slug?: string;
  location?: string;
  price?: number;
  created_at: string;
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    // Simulation de recherche - en production, remplacer par l'API Supabase
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: `Résultat d'exemple pour "${query}"`,
          description: 'Ceci est un exemple de résultat de recherche. En production, cette page rechercherait dans la base de données.',
          category: 'sejours',
          type: 'ad',
          location: 'Paris',
          price: 1500,
          created_at: new Date().toISOString()
        }
      ];
      
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case 'ad':
        return `/ad/${result.id}`;
      case 'blog':
        return `/blog/${result.category}/${result.slug}`;
      default:
        return '/';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ad':
        return 'Annonce';
      case 'blog':
        return 'Article';
      default:
        return type;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'sejours': 'Séjours',
      'vols': 'Vols',
      'hebergements': 'Hébergements',
      'guides': 'Guides',
      'chauffeurs': 'Transport',
      'babysitting': 'Babysitting'
    };
    return labels[category] || category;
  };

  return (
    <ResponsiveLayout>
      <DynamicSEO
        title={searchQuery ? `Recherche: ${searchQuery}` : 'Recherche'}
        description={searchQuery ? `Résultats de recherche pour "${searchQuery}" sur Omra Bons Plans` : 'Recherchez des annonces, articles et services pour votre Omra'}
        keywords={['recherche', 'omra', 'annonces', searchQuery].filter(Boolean)}
        path="/search"
      />
      
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header et barre de recherche */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {searchQuery ? `Résultats de recherche pour "${searchQuery}"` : 'Moteur de Recherche Omra & Hajj'}
            </h1>
            <h2 className="text-xl text-muted-foreground mb-4 font-semibold">
              {searchQuery 
                ? `Explorez toutes les annonces, articles et services correspondant à votre recherche` 
                : 'Trouvez rapidement les meilleures offres de séjours, vols, hébergements et services pour votre pèlerinage'}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Trouvez des annonces, articles et services pour votre Omra
            </p>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher des annonces, articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Recherche...' : 'Rechercher'}
                </Button>
              </div>
            </form>
          </div>

          {/* Résultats */}
          {hasSearched && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {loading ? 'Recherche en cours...' : `${results.length} résultat${results.length !== 1 ? 's' : ''} trouvé${results.length !== 1 ? 's' : ''}`}
                </h2>
              </div>

              {results.length === 0 && !loading && (
                <Card>
                  <CardContent className="text-center py-12">
                    <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
                    <p className="text-muted-foreground">
                      Essayez avec d'autres mots-clés ou vérifiez l'orthographe
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {results.map((result) => (
                  <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">
                              {getTypeLabel(result.type)}
                            </Badge>
                            <Badge variant="outline">
                              {getCategoryLabel(result.category)}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">
                            <Link 
                              to={getResultLink(result)}
                              className="hover:text-primary transition-colors flex items-center gap-2"
                            >
                              {result.title}
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {result.description && (
                        <CardDescription className="mb-4">
                          {result.description.length > 200 
                            ? `${result.description.substring(0, 200)}...` 
                            : result.description}
                        </CardDescription>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(result.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        
                        {result.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {result.location}
                          </div>
                        )}
                        
                        {result.price && (
                          <div className="font-semibold text-primary">
                            {result.price}€
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </ResponsiveLayout>
  );
};

export default Search;