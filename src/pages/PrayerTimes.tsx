import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
// ⚡ PERF: Individual icon imports
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Search from 'lucide-react/dist/esm/icons/search';
import Sun from 'lucide-react/dist/esm/icons/sun';
import Sunset from 'lucide-react/dist/esm/icons/sunset';
import Star from 'lucide-react/dist/esm/icons/star';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Helmet } from "react-helmet-async";
import { supabase } from '@/integrations/supabase/client';
import { InternalLinks } from '@/components/SEO/InternalLinks';

interface PrayerTime {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
}

interface PrayerData {
  timings: PrayerTime;
  date: {
    readable: string;
    hijri: {
      date: string;
      month: { ar: string; en: string };
      year: string;
    };
  };
  meta: {
    timezone: string;
  };
}

interface FormData {
  city: string;
}

const PRAYER_ORDER: Array<keyof PrayerTime> = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_LABELS: Record<string, string> = {
  Fajr: 'Fajr', Sunrise: 'Shourouq', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha'
};
const DAILY_PRAYERS: Array<keyof PrayerTime> = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const getTimeParts = (value?: string) => {
  const match = value?.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return { hours: Number(match[1]), minutes: Number(match[2]) };
};

const formatPrayerTime = (value?: string) => value?.match(/\d{1,2}:\d{2}/)?.[0] ?? '--:--';

const formatApiDate = (date: Date) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const IP_LOCATION_PROVIDERS = [
  async () => {
    const response = await fetch('https://ipwho.is/?fields=success,latitude,longitude,city');
    const data = await response.json();
    if (!response.ok || data?.success === false || !data?.latitude || !data?.longitude) return null;
    return { latitude: Number(data.latitude), longitude: Number(data.longitude), city: data.city as string | undefined };
  },
  async () => {
    const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
    const data = await response.json();
    const latitude = Number(data?.latitude);
    const longitude = Number(data?.longitude);
    if (!response.ok || Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
    return { latitude, longitude, city: data.city as string | undefined };
  },
];

const NextPrayerHero: React.FC = () => {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    city?: string;
    source?: string;
    timings?: PrayerTime;
    tomorrowFajr?: string;
  }>({ loading: true, error: null });
  const [now, setNow] = useState(new Date());
  const [manualCity, setManualCity] = useState('');

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const loadFor = async (latitude: number, longitude: number, cityHint?: string, source = 'géolocalisation') => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);

    const [r1, r2, geo] = await Promise.all([
      fetch(`https://api.aladhan.com/v1/timings/${formatApiDate(today)}?latitude=${latitude}&longitude=${longitude}&method=3`),
      fetch(`https://api.aladhan.com/v1/timings/${formatApiDate(tomorrow)}?latitude=${latitude}&longitude=${longitude}&method=3`),
      cityHint
        ? Promise.resolve(null)
        : fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`).catch(() => null),
    ]);
    const j1 = await r1.json();
    const j2 = await r2.json();

    if (!r1.ok || !r2.ok || !j1?.data?.timings || !j2?.data?.timings?.Fajr) {
      throw new Error('Horaires indisponibles');
    }

    let city: string | undefined = cityHint;
    if (!city && geo) {
      try {
        const g = await (geo as Response).json();
        city = g?.address?.city || g?.address?.town || g?.address?.village || g?.address?.county;
      } catch {}
    }

    setState({
      loading: false,
      error: null,
      city,
      source,
      timings: j1.data.timings,
      tomorrowFajr: j2.data.timings.Fajr,
    });
  };

  const fallbackByIP = async () => {
    for (const provider of IP_LOCATION_PROVIDERS) {
      try {
        const location = await provider();
        if (location) {
          await loadFor(location.latitude, location.longitude, location.city, 'position approximative');
          return true;
        }
      } catch {}
    }
    return false;
  };

  const detectLocation = async () => {
    setState((current) => ({ ...current, loading: true, error: null }));

    const useFallback = async () => {
      const ok = await fallbackByIP();
      if (!ok) {
        setState({
          loading: false,
          error: "Impossible de détecter votre position automatiquement. Entrez votre ville ci-dessous.",
        });
      }
    };

    if (!('geolocation' in navigator)) {
      await useFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => loadFor(pos.coords.latitude, pos.coords.longitude),
      () => useFallback(),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  };

  const loadManualCity = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const city = manualCity.trim();
    if (!city) return;

    try {
      setState((current) => ({ ...current, loading: true, error: null }));
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`);
      const data = await response.json();
      const result = Array.isArray(data) ? data[0] : null;
      if (!response.ok || !result?.lat || !result?.lon) throw new Error('Ville introuvable');
      await loadFor(Number(result.lat), Number(result.lon), city, 'ville choisie');
    } catch {
      setState({ loading: false, error: "Ville introuvable. Essayez avec une ville proche." });
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const computeNext = () => {
    if (!state.timings) return null;
    const today = new Date();
    for (const key of PRAYER_ORDER) {
      const parts = getTimeParts(state.timings[key]);
      if (!parts) continue;
      const t = new Date(today);
      t.setHours(parts.hours, parts.minutes, 0, 0);
      if (t.getTime() > now.getTime()) {
        return { name: PRAYER_LABELS[key], time: formatPrayerTime(state.timings[key]), at: t, isTomorrow: false };
      }
    }
    if (state.tomorrowFajr) {
      const parts = getTimeParts(state.tomorrowFajr);
      if (!parts) return null;
      const t = new Date(today.getTime() + 86400000);
      t.setHours(parts.hours, parts.minutes, 0, 0);
      return { name: 'Fajr', time: formatPrayerTime(state.tomorrowFajr), at: t, isTomorrow: true };
    }
    return null;
  };

  const next = computeNext();
  const remaining = next ? Math.max(0, next.at.getTime() - now.getTime()) : 0;
  const hours = Math.floor(remaining / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
      <CardContent className="py-8 text-center">
        {state.loading && (
          <p className="text-muted-foreground">Détection de votre position…</p>
        )}
        {state.error && (
          <div className="mx-auto max-w-xl space-y-4">
            <p className="text-sm text-muted-foreground">{state.error}</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button type="button" variant="outline" onClick={detectLocation}>
                Réessayer ma position
              </Button>
            </div>
            <form onSubmit={loadManualCity} className="flex flex-col sm:flex-row gap-2">
              <Input
                value={manualCity}
                onChange={(event) => setManualCity(event.target.value)}
                placeholder="Votre ville"
                aria-label="Votre ville"
              />
              <Button type="submit">Afficher</Button>
            </form>
          </div>
        )}
        {next && (
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              Prochaine prière {state.city ? `à ${state.city}` : ''}{next.isTomorrow ? ' (demain)' : ''}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{next.name}</h2>
            <div className="text-6xl md:text-7xl font-bold text-primary tabular-nums">
              {next.time}
            </div>
            <p className="text-lg text-muted-foreground tabular-nums">
              dans {hours}h {String(mins).padStart(2, '0')}m {String(secs).padStart(2, '0')}s
            </p>
            {state.source && <p className="text-xs text-muted-foreground">Source : {state.source}</p>}
          </div>
        )}
        {state.timings && (
          <div className="mt-8 pt-6 border-t border-primary/20">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Horaires d'aujourd'hui</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {DAILY_PRAYERS.map((k) => {
                const isNext = next && !next.isTomorrow && next.name === PRAYER_LABELS[k];
                return (
                  <div
                    key={k}
                    className={`rounded-lg p-3 text-center ${isNext ? 'bg-primary text-primary-foreground' : 'bg-background border border-border'}`}
                  >
                    <div className={`text-xs font-medium ${isNext ? 'opacity-90' : 'text-muted-foreground'}`}>{PRAYER_LABELS[k]}</div>
                    <div className="text-xl font-bold tabular-nums mt-1">{formatPrayerTime(state.timings![k])}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PrayerTimes = () => {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      city: ''
    }
  });

  const fetchPrayerTimes = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching prayer times for:', city);
      
      // Utilisation de supabase.functions.invoke pour l'authentification automatique
      const { data, error: functionError } = await supabase.functions.invoke('prayer-times', {
        body: { city }
      });
      
      console.log('Response:', data, 'Error:', functionError);
      
      if (functionError) {
        throw new Error(functionError.message || 'Erreur lors de la récupération des horaires');
      }
      
      if (!data || data.code !== 200) {
        throw new Error('Impossible de récupérer les horaires pour cette ville');
      }
      
      setPrayerData(data.data);
      toast.success('Horaires de prière récupérés avec succès');
    } catch (err: any) {
      console.error('Prayer times error:', err);
      setError(err.message || 'Une erreur est survenue');
      toast.error(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: FormData) => {
    if (!data.city.trim()) {
      toast.error('Veuillez entrer le nom d\'une ville');
      return;
    }
    fetchPrayerTimes(data.city.trim());
  };

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return time;
    }
  };

  const getPrayerIcon = (prayer: string) => {
    switch (prayer) {
      case 'Fajr':
        return <Star className="w-5 h-5 text-blue-500" />;
      case 'Sunrise':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'Dhuhr':
        return <Sun className="w-5 h-5 text-orange-500" />;
      case 'Asr':
        return <Sun className="w-5 h-5 text-orange-400" />;
      case 'Maghrib':
        return <Sunset className="w-5 h-5 text-red-500" />;
      case 'Isha':
        return <Star className="w-5 h-5 text-indigo-500" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const prayerNames = {
    Fajr: 'Fajr (Aube)',
    Sunrise: 'Lever du soleil',
    Dhuhr: 'Dhuhr (Midi)',
    Asr: 'Asr (Après-midi)',
    Maghrib: 'Maghrib (Coucher)',
    Isha: 'Isha (Nuit)'
  };

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Horaires de Prière - Omra Bons Plans | Qibla et Prières Islamiques</title>
        <meta name="description" content="Trouvez les horaires de prière musulmane précis pour votre ville. Fajr, Dhuhr, Asr, Maghrib, Isha. Calendrier islamique et direction de la Qibla." />
        <meta name="keywords" content="horaires prière islam, qibla direction, prières musulmanes, calendrier islamique, salat times" />
        <link rel="canonical" href="https://omrabonsplans.fr/prayer-times" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Horaires de Prière - Omra Bons Plans" />
        <meta property="og:description" content="Trouvez les horaires de prière musulmane précis pour votre ville. Fajr, Dhuhr, Asr, Maghrib, Isha." />
        <meta property="og:url" content="https://omrabonsplans.fr/prayer-times" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Horaires de Prière",
            "url": "https://omrabonsplans.fr/prayer-times",
            "description": "Application pour trouver les horaires de prière musulmane selon votre ville",
            "applicationCategory": "ReligiousApplication",
            "operatingSystem": "Web Browser"
          })}
        </script>
      </Helmet>
      <SEOBreadcrumb className="container mx-auto px-4 pt-4" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Horaires de Prière Musulmane - Salat Times</h1>
            <h2 className="text-xl text-muted-foreground">Consultez les horaires des 5 prières quotidiennes pour votre ville : Fajr, Dhuhr, Asr, Maghrib et Isha</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trouvez les horaires de prière musulmane précis pour votre ville partout dans le monde. 
              Notre outil utilise les calculs astronomiques les plus précis pour vous fournir les horaires exacts 
              des cinq prières quotidiennes obligatoires. Que vous soyez à Paris, Londres, New York ou dans n&apos;importe 
              quelle ville, obtenez instantanément les horaires de Fajr (l&apos;aube), Dhuhr (midi), Asr (après-midi), 
              Maghrib (coucher du soleil) et Isha (nuit). Nos horaires sont calculés selon la méthode de la Ligue Islamique Mondiale 
              (MWL) avec des angles de 18° pour Fajr et 17° pour Isha, garantissant une précision optimale pour votre pratique religieuse.
            </p>
          </div>

          {/* Prochaine prière (géolocalisation) */}
          <NextPrayerHero />

          {/* Introduction détaillée */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p className="mb-4">
                  La prière (Salat) est le deuxième pilier de l&apos;Islam et constitue un acte d&apos;adoration fondamental 
                  pour tout musulman. Elle établit un lien direct entre le croyant et Allah, offrant des moments de 
                  recueillement spirituel tout au long de la journée. Les cinq prières quotidiennes sont réparties 
                  à des moments spécifiques basés sur la position du soleil.
                </p>
                <p className="mb-4">
                  <strong>Fajr</strong> : La prière de l&apos;aube commence lorsque la lueur blanche apparaît à l&apos;horizon 
                  et se termine juste avant le lever du soleil. C&apos;est un moment béni où le monde est encore calme.
                </p>
                <p className="mb-4">
                  <strong>Dhuhr</strong> : La prière de midi débute juste après que le soleil ait dépassé son zénith 
                  et dure jusqu&apos;au début de la prière d&apos;Asr. C&apos;est une pause spirituelle au milieu de la journée.
                </p>
                <p className="mb-4">
                  <strong>Asr</strong> : La prière de l&apos;après-midi commence lorsque l&apos;ombre d&apos;un objet est égale 
                  à sa hauteur et se termine juste avant le coucher du soleil.
                </p>
                <p className="mb-4">
                  <strong>Maghrib</strong> : La prière du coucher du soleil commence immédiatement après que le soleil 
                  soit complètement descendu sous l&apos;horizon et dure environ 15-20 minutes.
                </p>
                <p>
                  <strong>Isha</strong> : La prière de la nuit commence lorsque la lueur rouge du crépuscule disparaît 
                  et peut être accomplie jusqu&apos;à minuit ou avant l&apos;aube selon les écoles juridiques.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Rechercher par ville
              </CardTitle>
              <CardDescription>
                Entrez le nom de votre ville pour obtenir les horaires de prière d'aujourd'hui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Ex: Paris, Londres, Le Caire..."
                              {...field}
                              disabled={loading}
                            />
                            <Button type="submit" disabled={loading}>
                              {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent" />
                              ) : (
                                <Search className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <Clock className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prayer Times Display */}
          {prayerData && (
            <div className="space-y-6">
              {/* Date Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Horaires pour aujourd'hui</span>
                    <Badge variant="secondary">
                      {prayerData.date.readable}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Date hijri: {prayerData.date.hijri.date} {prayerData.date.hijri.month.ar} {prayerData.date.hijri.year}
                    {prayerData.meta.timezone && (
                      <span className="block mt-1">Fuseau horaire: {prayerData.meta.timezone}</span>
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Prayer Times Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(prayerNames).map(([key, name]) => (
                  <Card key={key} className="transition-all hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getPrayerIcon(key)}
                          <div>
                            <h3 className="font-semibold text-foreground">{name}</h3>
                            <p className="text-2xl font-bold text-primary">
                              {formatTime(prayerData.timings[key as keyof PrayerTime])}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Note */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground text-center">
                    <p><strong>Source :</strong> Aladhan API</p>
                    <p><strong>Méthode de calcul :</strong> MWL (Muslim World League)</p>
                    <p>Angles utilisés : <strong>18°</strong> pour Fajr et <strong>17°</strong> pour Isha</p>
                    <p className="mt-2">Pour plus de précision, vérifiez avec votre mosquée locale.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Liens utiles */}
        <Card className="mt-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Ressources utiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/islamic-calendar" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Calendrier Islamique</h3>
                <p className="text-sm text-muted-foreground">Convertissez les dates grégoriennes en dates hégiriennes</p>
              </a>
              <a href="/ramadan-hajj-dates" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Dates Ramadan & Hajj</h3>
                <p className="text-sm text-muted-foreground">Consultez les dates du Ramadan et du Hajj 2026-2028</p>
              </a>
              <a href="/category/sejours" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Séjours Omra</h3>
                <p className="text-sm text-muted-foreground">Découvrez nos packages complets pour l'Omra</p>
              </a>
            </div>
          </CardContent>
        </Card>
        
        {/* Liens internes SEO */}
        <InternalLinks currentPage="/prayer-times" variant="related" className="mt-8" />
      </div>
    </ResponsiveLayout>
  );
};

export default PrayerTimes;