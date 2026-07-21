import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Search, Hotel as HotelIcon, ExternalLink } from 'lucide-react';
import { invalidateHotelUrlCache } from '@/hooks/useHotelUrlMap';

interface HotelRow {
  id: string;
  hotel_name: string;
  city: string;
  stars: number | null;
  usage_count: number | null;
  website_url: string | null;
}

const AdminHotels = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [hotels, setHotels] = useState<HotelRow[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState<'all' | 'makkah' | 'medina'>('all');

  useEffect(() => {
    if (!adminLoading && !isAdmin) navigate('/');
  }, [isAdmin, adminLoading, navigate]);

  const fetchHotels = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hotel_presets')
      .select('id, hotel_name, city, stars, usage_count, website_url')
      .order('city')
      .order('hotel_name');
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } else {
      setHotels((data || []) as HotelRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSave = async (hotel: HotelRow) => {
    const newUrl = (edits[hotel.id] ?? hotel.website_url ?? '').trim();
    if (newUrl && !/^https?:\/\//i.test(newUrl)) {
      toast({
        title: 'Lien invalide',
        description: 'Le lien doit commencer par http:// ou https://',
        variant: 'destructive',
      });
      return;
    }
    setSavingId(hotel.id);
    const { error } = await supabase
      .from('hotel_presets')
      .update({ website_url: newUrl || null })
      .eq('id', hotel.id);
    setSavingId(null);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return;
    }
    invalidateHotelUrlCache();
    toast({ title: 'Enregistré', description: `Lien mis à jour pour ${hotel.hotel_name}` });
    setEdits((e) => {
      const c = { ...e };
      delete c[hotel.id];
      return c;
    });
    setHotels((hs) => hs.map((h) => (h.id === hotel.id ? { ...h, website_url: newUrl || null } : h)));
  };

  const filtered = hotels.filter((h) => {
    if (cityFilter !== 'all' && h.city !== cityFilter) return false;
    if (search && !h.hotel_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const withUrl = hotels.filter((h) => !!h.website_url).length;

  if (adminLoading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center gap-2">
            <HotelIcon className="h-5 w-5 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold">Gestion des hôtels</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total hôtels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hotels.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Avec lien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{withUrl}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Sans lien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{hotels.length - withUrl}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un hôtel…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'makkah', 'medina'] as const).map((c) => (
                <Button
                  key={c}
                  variant={cityFilter === c ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCityFilter(c)}
                >
                  {c === 'all' ? 'Toutes' : c === 'makkah' ? 'La Mecque' : 'Médine'}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Hôtels enregistrés{' '}
              <span className="text-sm font-normal text-muted-foreground">({filtered.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Chargement…</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Aucun hôtel trouvé</div>
            ) : (
              <div className="space-y-3">
                {filtered.map((hotel) => {
                  const current = edits[hotel.id] ?? hotel.website_url ?? '';
                  const dirty = edits[hotel.id] !== undefined && edits[hotel.id] !== (hotel.website_url ?? '');
                  return (
                    <div
                      key={hotel.id}
                      className="flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold truncate">{hotel.hotel_name}</span>
                          <Badge variant="outline" className="text-xs">
                            {hotel.city === 'makkah' ? 'La Mecque' : hotel.city === 'medina' ? 'Médine' : hotel.city}
                          </Badge>
                          {hotel.stars ? (
                            <span className="text-yellow-500 text-xs">{'⭐'.repeat(hotel.stars)}</span>
                          ) : null}
                          {hotel.usage_count ? (
                            <span className="text-xs text-muted-foreground">
                              {hotel.usage_count} utilisation{hotel.usage_count > 1 ? 's' : ''}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 md:w-[520px]">
                        <Input
                          placeholder="https://site-officiel-hotel.com"
                          value={current}
                          onChange={(e) =>
                            setEdits((prev) => ({ ...prev, [hotel.id]: e.target.value }))
                          }
                          className="flex-1"
                        />
                        {hotel.website_url ? (
                          <a
                            href={hotel.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-primary"
                            title="Ouvrir le lien actuel"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : null}
                        <Button
                          size="sm"
                          onClick={() => handleSave(hotel)}
                          disabled={!dirty || savingId === hotel.id}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          {savingId === hotel.id ? '…' : 'Enregistrer'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHotels;
