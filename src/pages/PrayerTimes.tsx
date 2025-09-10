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
      
      // D'abord, obtenir les coordonnées de la ville via une API de géocodage
      const geocodeResponse = await fetch(`https://api.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);
      const geocodeData = await geocodeResponse.json();
      
      if (!geocodeData || geocodeData.length === 0) {
        throw new Error('Ville non trouvée');
      }
      
      const { lat, lon } = geocodeData[0];
      
      // Utilisation de l'API IslamicFinder avec méthode 2 (ISNA) qui utilise 15° pour Fajr et Isha
      const response = await fetch(`https://www.islamicfinder.us/index.php/api/prayer_times?latitude=${lat}&longitude=${lon}&timezone=auto&method=2&format=json`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des horaires');
      }
      
      const data = await response.json();
      
      if (!data || !data.results) {
        throw new Error('Impossible de récupérer les horaires pour cette ville');
      }
      
      // Adapter la structure des données pour correspondre à notre interface
      const adaptedData = {
        timings: {
          Fajr: data.results.Fajr,
          Sunrise: data.results.Sunrise,
          Dhuhr: data.results.Dhuhr,
          Asr: data.results.Asr,
          Maghrib: data.results.Maghrib,
          Isha: data.results.Isha
        },
        date: {
          readable: new Date().toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          hijri: data.results.hijri || {
            date: '',
            month: { ar: '', en: '' },
            year: ''
          }
        },
        meta: {
          timezone: data.results.timezone || 'Local'
        }
      };
      
      setPrayerData(adaptedData);
      toast.success('Horaires de prière récupérés avec succès via IslamicFinder');
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Horaires de Prière</h1>
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
                    <p><strong>Source :</strong> IslamicFinder API</p>
                    <p><strong>Méthode de calcul :</strong> ISNA (Islamic Society of North America)</p>
                    <p>Angle utilisé : <strong>15°</strong> pour Fajr et Isha</p>
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