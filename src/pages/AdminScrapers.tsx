import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DynamicSEO } from '@/components/SEO/DynamicSEO';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Play from 'lucide-react/dist/esm/icons/play';
import Pause from 'lucide-react/dist/esm/icons/pause';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import Activity from 'lucide-react/dist/esm/icons/activity';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import XCircle from 'lucide-react/dist/esm/icons/x-circle';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Database from 'lucide-react/dist/esm/icons/database';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminScrapers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRunning, setIsRunning] = useState(false);
  const [isWeeklyRefreshing, setIsWeeklyRefreshing] = useState(false);

  // Fetch scraper configs
  const { data: configs, isLoading: configsLoading } = useQuery({
    queryKey: ['scraper-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('omra_scraper_config')
        .select('*')
        .order('agency_name');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch recent logs
  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ['scraper-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('omra_scraper_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch recent scraped offers
  const { data: recentOffers, isLoading: offersLoading } = useQuery({
    queryKey: ['recent-scraped-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('omra_offers')
        .select('*')
        .order('scraped_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch last successful update info
  const { data: lastUpdate, isLoading: lastUpdateLoading } = useQuery({
    queryKey: ['last-successful-update'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_last_successful_update');
      if (error) throw error;
      return data as {
        last_update: string | null;
        offers_count: number;
        offers_rejected: number;
        message?: string;
      };
    }
  });

  // Fetch update runs history
  const { data: updateRuns, isLoading: updateRunsLoading } = useQuery({
    queryKey: ['omra-update-runs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('omra_update_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // Run scraper mutation
  const runScraperMutation = useMutation({
    mutationFn: async (agencyName?: string) => {
      setIsRunning(true);
      const { data, error } = await supabase.functions.invoke('scrape-omra-offers', {
        body: { agency_name: agencyName }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Scraping terminé',
        description: `${data.total_agencies} agence(s) scrapée(s) avec succès`,
      });
      queryClient.invalidateQueries({ queryKey: ['scraper-logs'] });
      queryClient.invalidateQueries({ queryKey: ['omra-offers'] });
      setIsRunning(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur de scraping',
        description: error.message,
        variant: 'destructive',
      });
      setIsRunning(false);
    }
  });

  // Weekly refresh mutation
  const weeklyRefreshMutation = useMutation({
    mutationFn: async () => {
      setIsWeeklyRefreshing(true);
      const { data, error } = await supabase.functions.invoke('weekly-omra-refresh', {
        body: { run_type: 'manual' }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Rafraîchissement terminé',
        description: `${data.stats.offers_validated} offres validées, ${data.stats.offers_rejected} rejetées. Swap: ${data.stats.swap_executed ? 'Réussi ✅' : 'Non exécuté ⚠️'}`,
      });
      queryClient.invalidateQueries({ queryKey: ['omra-offers'] });
      queryClient.invalidateQueries({ queryKey: ['omra-update-runs'] });
      queryClient.invalidateQueries({ queryKey: ['last-successful-update'] });
      setIsWeeklyRefreshing(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur de rafraîchissement',
        description: error.message,
        variant: 'destructive',
      });
      setIsWeeklyRefreshing(false);
    }
  });

  // Toggle config active status
  const toggleConfigMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('omra_scraper_config')
        .update({ is_active: !is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scraper-configs'] });
      toast({
        title: 'Configuration mise à jour',
        description: 'Le statut du scraper a été modifié',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <DynamicSEO
        title="Gestion des Scrapers Omra"
        description="Administration des scrapers d'offres Omra"
        path="/admin/scrapers"
      />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Scrapers Omra</h1>
            <p className="text-muted-foreground">
              Gérez les scrapers d'offres pour le comparateur
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              size="lg"
              onClick={() => weeklyRefreshMutation.mutate()}
              disabled={isWeeklyRefreshing || isRunning}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {isWeeklyRefreshing ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Rafraîchissement...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Rafraîchir maintenant
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => runScraperMutation.mutate(undefined)}
              disabled={isRunning || isWeeklyRefreshing}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Scraping simple
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Last Update Info */}
        {!lastUpdateLoading && lastUpdate && (
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Dernière mise à jour hebdomadaire</h3>
                  {lastUpdate.last_update ? (
                    <>
                      <p className="text-muted-foreground">
                        {format(new Date(lastUpdate.last_update), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <Badge variant="outline" className="bg-green-500/10">
                          {lastUpdate.offers_count} offres actives
                        </Badge>
                        {lastUpdate.offers_rejected > 0 && (
                          <Badge variant="outline" className="bg-orange-500/10">
                            {lastUpdate.offers_rejected} rejetées
                          </Badge>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">{lastUpdate.message}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Prochain rafraîchissement</p>
                <p className="font-semibold">Jeudi à 06:00</p>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scrapers actifs</p>
                <p className="text-2xl font-bold">
                  {configs?.filter(c => c.is_active).length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Succès (24h)</p>
                <p className="text-2xl font-bold">
                  {logs?.filter(l => l.status === 'success').length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Erreurs (24h)</p>
                <p className="text-2xl font-bold">
                  {logs?.filter(l => l.status === 'error').length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Offres scrapées</p>
                <p className="text-2xl font-bold">
                  {logs?.reduce((sum, l) => sum + (l.offers_scraped || 0), 0) || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Scraper Configs */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Configuration des scrapers</h2>
          
          {configsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : configs && configs.length > 0 ? (
            <div className="space-y-4">
              {configs.map((config: any) => (
                <Card key={config.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <Globe className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{config.agency_name}</h3>
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {config.agency_url}
                        </p>
                      </div>
                      <Badge variant={config.is_active ? 'default' : 'secondary'}>
                        {config.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                      {config.last_scrape_at && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(config.last_scrape_at).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runScraperMutation.mutate(config.agency_name)}
                        disabled={isRunning}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Lancer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleConfigMutation.mutate({
                          id: config.id,
                          is_active: config.is_active
                        })}
                      >
                        {config.is_active ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucun scraper configuré
            </p>
          )}
        </Card>

        {/* Recent Scraped Offers */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Offres scrapées récemment</h2>
            <Button
              variant="outline"
              onClick={() => window.open('/comparateur-omra', '_blank')}
            >
              Voir toutes les offres
            </Button>
          </div>
          
          {offersLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : recentOffers && recentOffers.length > 0 ? (
            <div className="space-y-3">
              {recentOffers.slice(0, 10).map((offer: any) => (
                <div
                  key={offer.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-1">{offer.offer_title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="font-medium text-primary">{offer.price_eur}€</span>
                      <span>•</span>
                      <span>{offer.agency_name}</span>
                      <span>•</span>
                      <span>{offer.departure_city}</span>
                      <span>•</span>
                      <span>{offer.month_departure}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{offer.formula_type}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Scrapé: {new Date(offer.scraped_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucune offre scrapée pour le moment
            </p>
          )}
        </Card>

        {/* Weekly Update Runs History */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Historique des mises à jour hebdomadaires</h2>
          
          {updateRunsLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : updateRuns && updateRuns.length > 0 ? (
            <div className="space-y-3">
              {updateRuns.map((run: any) => (
                <Card key={run.id} className={`p-4 ${run.swap_executed ? 'border-green-500/30' : 'border-orange-500/30'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {run.status === 'success' && run.swap_executed ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                      ) : run.status === 'success' && !run.swap_executed ? (
                        <AlertCircle className="h-6 w-6 text-orange-500 mt-1" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">
                            {format(new Date(run.started_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                          </h3>
                          <Badge variant={run.run_type === 'manual' ? 'default' : 'secondary'}>
                            {run.run_type === 'manual' ? 'Manuel' : 'Planifié'}
                          </Badge>
                          {run.swap_executed && (
                            <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                              Swap réussi
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Récupérées</p>
                            <p className="font-semibold">{run.offers_fetched}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Validées</p>
                            <p className="font-semibold text-green-600">{run.offers_validated}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Rejetées</p>
                            <p className="font-semibold text-orange-600">{run.offers_rejected}</p>
                          </div>
                        </div>
                        {run.error_message && (
                          <p className="text-sm text-orange-600 mt-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {run.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucune mise à jour effectuée pour le moment
            </p>
          )}
        </Card>

        {/* Recent Logs */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Logs de scraping (anciens)</h2>
          
          {logsLoading ? (
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : logs && logs.length > 0 ? (
            <div className="space-y-2">
              {logs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {log.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{log.agency_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.offers_scraped} offres • {log.offers_added} ajoutées • {log.offers_updated} mises à jour
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.started_at).toLocaleString('fr-FR')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.duration_ms}ms
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucun log disponible
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
