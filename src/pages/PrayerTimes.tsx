import React, { useState } from 'react';
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