import { useState } from 'react';
import { useAgencies } from '@/hooks/useAgencies';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, RefreshCw, Star, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminAgencies = () => {
  const { data: agencies, isLoading, refetch } = useAgencies();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('');
  const [newReviewCount, setNewReviewCount] = useState<string>('');
  const [updatingReviewCount, setUpdatingReviewCount] = useState(false);

  const handleUpdateReviewCount = async () => {
    if (!selectedAgencyId || !newReviewCount) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une agence et entrer un nombre d\'avis',
        variant: 'destructive',
      });
      return;
    }

    const count = parseInt(newReviewCount, 10);
    if (isNaN(count) || count < 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer un nombre valide',
        variant: 'destructive',
      });
      return;
    }

    setUpdatingReviewCount(true);
    try {
      const { error } = await supabase
        .from('agencies')
        .update({ 
          review_count: count,
          last_review_update: new Date().toISOString()
        })
        .eq('id', selectedAgencyId);

      if (error) throw error;

      const selectedAgency = agencies?.find(a => a.id === selectedAgencyId);
      toast({
        title: 'Mise à jour réussie',
        description: `${selectedAgency?.name} : ${count.toLocaleString()} avis`,
      });

      setNewReviewCount('');
      refetch();
    } catch (error) {
      console.error('Error updating review count:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le nombre d\'avis',
        variant: 'destructive',
      });
    } finally {
      setUpdatingReviewCount(false);
    }
  };

  const handleManualUpdate = async () => {
    setUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-agency-reviews');

      if (error) throw error;

      toast({
        title: 'Mise à jour réussie',
        description: `${data.updated} agences ont été mises à jour`,
      });

      // Rafraîchir les données
      refetch();
    } catch (error) {
      console.error('Error updating agencies:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour les avis des agences',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Agences</h1>
          <p className="text-muted-foreground mt-2">
            {agencies?.length || 0} agences enregistrées
          </p>
        </div>
        <Button
          onClick={handleManualUpdate}
          disabled={updating}
          className="gap-2"
        >
          {updating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Mise à jour...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Mettre à jour les avis
            </>
          )}
        </Button>
      </div>

      {/* Section mise à jour manuelle du nombre d'avis */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Mise à jour manuelle du nombre d'avis</CardTitle>
          <CardDescription>
            Sélectionnez une agence et entrez le nouveau nombre d'avis Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Agence</label>
              <select
                value={selectedAgencyId}
                onChange={(e) => setSelectedAgencyId(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled hidden>
                  
                </option>
                {agencies?.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name} ({agency.review_count.toLocaleString()} avis)
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-[150px]">
              <label className="text-sm font-medium mb-2 block">Nombre d'avis</label>
              <Input
                type="number"
                min="0"
                placeholder="Ex: 1500"
                value={newReviewCount}
                onChange={(e) => setNewReviewCount(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleUpdateReviewCount}
              disabled={updatingReviewCount || !selectedAgencyId || !newReviewCount}
              className="gap-2"
            >
              {updatingReviewCount ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Mettre à jour
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agencies?.map((agency) => (
          <Card key={agency.id}>
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <span className="pr-2">{agency.name}</span>
                <Badge variant={agency.price_range === 'Premium' ? 'default' : 'secondary'}>
                  {agency.price_range}
                </Badge>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {agency.highlight}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{agency.google_rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({agency.review_count.toLocaleString()} avis)
                </span>
              </div>

              {agency.last_review_update && (
                <div className="text-xs text-muted-foreground">
                  Dernière mise à jour :{' '}
                  {format(new Date(agency.last_review_update), 'PPP à HH:mm', { locale: fr })}
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium mb-1">Spécialités</p>
                  <div className="flex flex-wrap gap-1">
                    {agency.specialties.map((spec, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={agency.url} target="_blank" rel="noopener noreferrer">
                  Visiter le site
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAgencies;
