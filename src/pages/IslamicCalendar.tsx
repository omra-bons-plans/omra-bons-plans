import React, { useState } from 'react';
import { Calendar as CalendarIcon, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOHead, seoConfig } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Helmet } from "react-helmet-async";

interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
    ar: string;
  };
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
}

interface ConversionResult {
  gregorian: {
    date: string;
    day: string;
    month: {
      number: number;
      en: string;
    };
    year: string;
  };
  hijri: HijriDate;
}

const IslamicCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualDate, setManualDate] = useState('');

  const convertDate = async (date: Date) => {
    setLoading(true);
    try {
      const formattedDate = format(date, 'dd-MM-yyyy');
      const response = await fetch(`https://api.aladhan.com/v1/gToH/${formattedDate}`);
      const data = await response.json();
      
      if (data.code === 200) {
        setConversionResult(data.data);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de convertir la date",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      convertDate(date);
    }
  };

  const handleManualConversion = async () => {
    if (!manualDate) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une date",
        variant: "destructive",
      });
      return;
    }

    try {
      const date = new Date(manualDate);
      if (isNaN(date.getTime())) {
        throw new Error('Date invalide');
      }
      setSelectedDate(date);
      await convertDate(date);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Format de date invalide",
        variant: "destructive",
      });
    }
  };

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Calendrier Islamique - Conversion Hégire | Omra Bons Plans</title>
        <meta name="description" content="Convertissez facilement les dates grégoriennes en dates hégiriennes avec notre calendrier islamique. Outil de conversion précis pour vos dates religieuses." />
        <meta name="keywords" content="calendrier islamique, calendrier hégirien, conversion date islamique, hijri calendar" />
        <link rel="canonical" href="https://omrabonsplans.fr/islamic-calendar" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Calendrier Islamique - Conversion Hégire" />
        <meta property="og:description" content="Convertissez facilement les dates grégoriennes en dates hégiriennes avec notre calendrier islamique." />
        <meta property="og:url" content="https://omrabonsplans.fr/islamic-calendar" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Calendrier Islamique",
            "url": "https://omrabonsplans.fr/islamic-calendar",
            "description": "Outil de conversion des dates grégoriennes en dates hégiriennes",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web Browser"
          })}
        </script>
      </Helmet>
      <SEOHead {...seoConfig.islamicCalendar} />
      <SEOBreadcrumb className="container mx-auto px-4 pt-4" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Calendrier Islamique - Convertisseur de Dates Hégirien
          </h1>
          <h2 className="text-xl text-muted-foreground mb-2">
            Outil de conversion gratuit entre calendrier grégorien et calendrier hégirien islamique
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Convertissez facilement et instantanément les dates grégoriennes en dates hégiriennes islamiques. 
            Notre outil de conversion précis vous permet de planifier vos événements religieux, vérifier les dates 
            du Ramadan, du Hajj, de l&apos;Aïd et d&apos;autres occasions importantes selon le calendrier lunaire islamique. 
            Le calendrier hégirien, qui commence avec l&apos;Hégire du Prophète Muhammad (que la paix soit sur lui) en 622 CE, 
            est essentiel pour tout musulman souhaitant organiser ses pratiques religieuses et célébrations selon 
            les traditions islamiques authentiques.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Date Picker Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Sélectionner une date
              </CardTitle>
              <CardDescription>
                Choisissez une date dans le calendrier pour la convertir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Date grégorienne</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="manual-date">Ou entrez manuellement (AAAA-MM-JJ)</Label>
                <div className="flex gap-2">
                  <Input
                    id="manual-date"
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    placeholder="2024-01-15"
                  />
                  <Button onClick={handleManualConversion} disabled={loading}>
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Result */}
          <Card>
            <CardHeader>
              <CardTitle>Résultat de la conversion</CardTitle>
              <CardDescription>
                Date convertie en calendrier hégirien
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Conversion en cours...</p>
                </div>
              )}

              {conversionResult && !loading && (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-2">Date Grégorienne</h3>
                    <p className="text-2xl font-bold text-primary">
                      {conversionResult.gregorian.day} {conversionResult.gregorian.month.en} {conversionResult.gregorian.year}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="p-4 bg-secondary/5 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-2">Date Hégirienne</h3>
                    <p className="text-2xl font-bold text-secondary-foreground mb-1">
                      {conversionResult.hijri.day} {conversionResult.hijri.month.en} {conversionResult.hijri.year} {conversionResult.hijri.designation.abbreviated}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {conversionResult.hijri.weekday.en}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {conversionResult.hijri.date}
                    </p>
                  </div>
                </div>
              )}

              {!conversionResult && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Sélectionnez une date pour voir la conversion</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>À propos du calendrier islamique</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">
              Le calendrier islamique, également appelé calendrier hégirien, est un calendrier lunaire 
              basé sur l'observation de la lune. Il commence avec l'Hégire (migration du prophète Muhammad 
              de La Mecque à Médine) en l'an 622 de l'ère chrétienne.
            </p>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div>
                <h4 className="font-semibold mb-2">Caractéristiques :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 12 mois lunaires</li>
                  <li>• 354 ou 355 jours par an</li>
                  <li>• Commence avec Muharram</li>
                  <li>• Basé sur les cycles lunaires</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mois islamiques :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Muharram • Safar • Rabi' al-awwal</li>
                  <li>• Rabi' al-thani • Jumada al-awwal</li>
                  <li>• Jumada al-thani • Rajab • Sha'ban</li>
                  <li>• Ramadan • Shawwal • Dhu al-Qi'dah</li>
                  <li>• Dhu al-Hijjah</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liens utiles */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Ressources utiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/prayer-times" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <h3 className="font-semibold mb-1">Horaires de Prière</h3>
                <p className="text-sm text-muted-foreground">Trouvez les horaires de prière pour votre ville</p>
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
      </div>
    </ResponsiveLayout>
  );
};

export default IslamicCalendar;