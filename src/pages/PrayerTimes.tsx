import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Search, Sun, Sunset, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOHead, seoConfig } from '@/components/SEO/SEOHead';
import { Helmet } from "react-helmet-async";

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
      
      // Utilisation de l'API Aladhan avec méthode 3 (MWL) qui utilise 18° pour Fajr et 17° pour Isha
      const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=3`);
      
      if (!response.ok) {
        throw new Error('Ville non trouvée ou erreur de réseau');
      }
      
      const data = await response.json();
      
      if (data.code !== 200) {
        throw new Error('Impossible de récupérer les horaires pour cette ville');
      }
      
      setPrayerData(data.data);
      toast.success('Horaires de prière récupérés avec succès');
    } catch (err: any) {
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
        <link rel="canonical" href="https://omrabonsplans.fr/horaires-prieres" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Horaires de Prière - Omra Bons Plans" />
        <meta property="og:description" content="Trouvez les horaires de prière musulmane précis pour votre ville. Fajr, Dhuhr, Asr, Maghrib, Isha." />
        <meta property="og:url" content="https://omrabonsplans.fr/horaires-prieres" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Horaires de Prière",
            "url": "https://omrabonsplans.fr/horaires-prieres",
            "description": "Application pour trouver les horaires de prière musulmane selon votre ville",
            "applicationCategory": "ReligiousApplication",
            "operatingSystem": "Web Browser"
          })}
        </script>
      </Helmet>
      <SEOHead {...seoConfig.prayerTimes} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Horaires de Prière Musulmane - Salat Times</h1>
            <h2 className="text-xl text-muted-foreground">Consultez les horaires des 5 prières quotidiennes pour votre ville : Fajr, Dhuhr, Asr, Maghrib et Isha</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trouvez les horaires de prière musulmane précis pour votre ville. 
              Entrez simplement le nom de votre ville pour obtenir les horaires quotidiens.
            </p>
          </div>

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
      </div>
    </ResponsiveLayout>
  );
};

export default PrayerTimes;