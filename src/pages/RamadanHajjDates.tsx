import React from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';

const RamadanHajjDates = () => {
  const ramadanDates = [
    {
      year: '2025',
      startDate: '28 février 2025',
      endDate: '30 mars 2025',
      eidDate: '30 mars 2025',
      hijriYear: '1446'
    },
    {
      year: '2026',
      startDate: '18 février 2026',
      endDate: '19 mars 2026',
      eidDate: '19 mars 2026',
      hijriYear: '1447'
    },
    {
      year: '2027',
      startDate: '7 février 2027',
      endDate: '8 mars 2027',
      eidDate: '8 mars 2027',
      hijriYear: '1448'
    }
  ];

  const hajjDates = [
    {
      year: '2025',
      startDate: '5 juin 2025',
      endDate: '10 juin 2025',
      arafatDate: '6 juin 2025',
      eidDate: '7 juin 2025',
      hijriYear: '1446'
    },
    {
      year: '2026',
      startDate: '26 mai 2026',
      endDate: '31 mai 2026',
      arafatDate: '27 mai 2026',
      eidDate: '28 mai 2026',
      hijriYear: '1447'
    },
    {
      year: '2027',
      startDate: '15 mai 2027',
      endDate: '20 mai 2027',
      arafatDate: '16 mai 2027',
      eidDate: '17 mai 2027',
      hijriYear: '1448'
    }
  ];

  return (
    <ResponsiveLayout>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Dates du Ramadan et du Hajj
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calendrier des dates importantes du Ramadan et du Hajj pour les années 2025, 2026 et 2027
            </p>
          </div>

          {/* Important Note */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-2">
              <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">Important</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Ces dates sont approximatives et basées sur des calculs astronomiques. 
                  Les dates officielles peuvent varier selon l'observation de la lune et les autorités religieuses locales.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ramadan Section */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Ramadan</h2>
              </div>

              <div className="space-y-4">
                {ramadanDates.map((ramadan) => (
                  <Card key={ramadan.year} className="border shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Ramadan {ramadan.year}</CardTitle>
                        <Badge variant="secondary">{ramadan.hijriYear} H</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Début du Ramadan</span>
                        <span className="font-semibold text-green-600">{ramadan.startDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Fin du Ramadan</span>
                        <span className="font-semibold text-red-600">{ramadan.endDate}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3">
                        <span className="text-sm font-medium text-muted-foreground">Aïd al-Fitr</span>
                        <span className="font-bold text-primary">{ramadan.eidDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Hajj Section */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <MapPin className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Hajj</h2>
              </div>

              <div className="space-y-4">
                {hajjDates.map((hajj) => (
                  <Card key={hajj.year} className="border shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Hajj {hajj.year}</CardTitle>
                        <Badge variant="secondary">{hajj.hijriYear} H</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Début du Hajj</span>
                        <span className="font-semibold text-green-600">{hajj.startDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Jour d'Arafat</span>
                        <span className="font-semibold text-amber-600">{hajj.arafatDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Fin du Hajj</span>
                        <span className="font-semibold text-red-600">{hajj.endDate}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3">
                        <span className="text-sm font-medium text-muted-foreground">Aïd al-Adha</span>
                        <span className="font-bold text-primary">{hajj.eidDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Informations utiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Ramadan</h4>
                  <p className="text-sm text-muted-foreground">
                    Le Ramadan est le neuvième mois du calendrier lunaire islamique. C'est un mois de jeûne, 
                    de prière, de réflexion et de solidarité communautaire. Le jeûne est observé de l'aube au coucher du soleil.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Hajj</h4>
                  <p className="text-sm text-muted-foreground">
                    Le Hajj est le pèlerinage annuel à La Mecque, en Arabie Saoudite. C'est l'un des cinq piliers de l'Islam 
                    et doit être accompli au moins une fois dans la vie par tout musulman qui en a les moyens physiques et financiers.
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note :</strong> Ces dates sont calculées selon le calendrier lunaire islamique et peuvent varier 
                    d'un jour selon l'observation locale de la lune. Consultez toujours les autorités religieuses locales 
                    pour les dates officielles dans votre région.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </ResponsiveLayout>
  );
};

export default RamadanHajjDates;