import React from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Clock from 'lucide-react/dist/esm/icons/clock';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import { Helmet } from "react-helmet-async";
import { InternalLinks } from '@/components/SEO/InternalLinks';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "Quand commence le Ramadan 2026 ?",
    answer: "Le Ramadan 2026 commence le 18 février 2026 et se termine le 19 mars 2026. L'Aïd al-Fitr (fête de rupture du jeûne) est prévu le 19 mars 2026. Ces dates sont calculées par calcul astronomique et peuvent varier d'un jour selon l'observation locale de la lune croissante."
  },
  {
    question: "Quand a lieu le Hajj 2026 ?",
    answer: "Le Hajj 2026 se déroule du 26 au 31 mai 2026. Le jour d'Arafat (jour le plus important du pèlerinage) est le 27 mai 2026, et l'Aïd al-Adha (fête du sacrifice) est le 28 mai 2026. Si vous souhaitez accomplir le Hajj 2026, les inscriptions auprès des agences agréées commencent généralement 6 à 12 mois à l'avance."
  },
  {
    question: "Comment sont calculées les dates du Ramadan et du Hajj ?",
    answer: "Les dates du Ramadan et du Hajj sont basées sur le calendrier lunaire islamique (calendrier hégirien). Chaque mois commence à la nouvelle lune. Le Ramadan est le 9e mois, le Hajj a lieu au 12e mois (Dhu al-Hijja). Comme l'année lunaire compte 354 jours (contre 365 pour l'année grégorienne), les dates avancent d'environ 10-11 jours chaque année."
  },
  {
    question: "Peut-on faire l'Omra pendant le Ramadan 2026 ?",
    answer: "Oui, l'Omra pendant le Ramadan est particulièrement recommandée car le Prophète Muhammad ﷺ a dit qu'elle équivaut en récompense à un Hajj. Comptez entre 2 000 € et 5 000 € par personne pour l'Omra du Ramadan 2026 (18 février - 19 mars). Les prix sont plus élevés que hors Ramadan en raison de la très forte demande. Réservez au moins 6 mois à l'avance."
  },
  {
    question: "Quelle est la différence entre l'Omra et le Hajj ?",
    answer: "L'Omra est le 'petit pèlerinage' : on peut le faire à n'importe quelle période de l'année, il comprend le tawaf (7 tours autour de la Kaaba) et le sa'y (entre Safa et Marwa). Le Hajj est le 'grand pèlerinage', obligatoire une fois dans la vie pour tout musulman qui en a les moyens : il a lieu uniquement du 8 au 13 Dhu al-Hijja et comprend des rites supplémentaires comme le séjour à Mina, le jour d'Arafat et le jet des pierres à Muzdalifa."
  },
  {
    question: "Quand faut-il réserver son Omra pour le Ramadan 2026 ?",
    answer: "Pour l'Omra du Ramadan 2026 (18 février - 19 mars), il est conseillé de réserver entre juin et octobre 2025, soit 4 à 8 mois à l'avance. Les agences sérieuses ouvrent leurs inscriptions très tôt pour cette période. Les 10 derniers jours du Ramadan (nuits impaires) sont les plus demandés : les places partent en quelques semaines et les prix peuvent atteindre 4 000 à 8 000 €."
  },
  {
    question: "Quelles sont les dates du Ramadan et du Hajj pour 2027 et 2028 ?",
    answer: "Ramadan 2027 : du 7 février au 8 mars 2027. Hajj 2027 : du 15 au 20 mai 2027 (Arafat le 16 mai). Ramadan 2028 : du 27 janvier au 26 février 2028. Hajj 2028 : du 4 au 9 mai 2028 (Arafat le 5 mai). Les dates avancent d'environ 10-11 jours par an car le calendrier islamique est lunaire."
  }
];


const RamadanHajjDates = () => {
  const ramadanDates = [
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
    },
    {
      year: '2028',
      startDate: '27 janvier 2028',
      endDate: '26 février 2028',
      eidDate: '26 février 2028',
      hijriYear: '1449'
    }
  ];

  const hajjDates = [
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
    },
    {
      year: '2028',
      startDate: '4 mai 2028',
      endDate: '9 mai 2028',
      arafatDate: '5 mai 2028',
      eidDate: '6 mai 2028',
      hijriYear: '1449'
    }
  ];

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Dates Ramadan & Hajj 2026-2028 | Calendrier Pèlerinage Islam</title>
        <meta name="description" content="Découvrez les dates officielles du Ramadan et du Hajj 2026-2028 : début et fin du jeûne, jour d'Arafat, Aïd al-Fitr et Aïd al-Adha. Planifiez votre pèlerinage." />
        <meta name="keywords" content="dates ramadan 2026, hajj 2027, calendrier hajj, arafat date, eid dates" />
        <link rel="canonical" href="https://omrabonsplans.fr/ramadan-hajj-dates" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Dates Ramadan & Hajj 2026-2028 | Calendrier Pèlerinage" />
        <meta property="og:description" content="Calendrier officiel des dates du Ramadan et du Hajj 2026-2028. Dates Arafat, Eid al-Fitr, Eid al-Adha." />
        <meta property="og:url" content="https://omrabonsplans.fr/ramadan-hajj-dates" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
          }))
        })}</script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Dates Ramadan & Hajj 2026-2028",
            "description": "Calendrier officiel des dates du Ramadan et du Hajj 2026-2028 avec dates exactes pour Arafat, Eid al-Fitr et Eid al-Adha",
            "url": "https://omrabonsplans.fr/ramadan-hajj-dates",
            "image": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp",
            "publisher": {
              "@type": "Organization",
              "name": "Omra Bons Plans",
              "url": "https://omrabonsplans.fr",
              "logo": {
                "@type": "ImageObject",
                "url": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp"
              }
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "Calendrier Islamique 2026-2028",
              "itemListElement": [
                {
                  "@type": "Event",
                  "name": "Ramadan 2026",
                  "description": "Mois sacré du jeûne musulman du 18 février au 19 mars 2026 avec l'Aïd al-Fitr le 19 mars 2026",
                  "startDate": "2026-02-18",
                  "endDate": "2026-03-19",
                  "location": {
                    "@type": "Place",
                    "name": "Observance mondiale",
                    "address": {
                      "@type": "PostalAddress",
                      "addressCountry": "Monde"
                    }
                  }
                },
                {
                  "@type": "Event",
                  "name": "Hajj 2026",
                  "description": "Pèlerinage annuel à La Mecque du 26 au 31 mai 2026 avec le jour d'Arafat le 27 mai et l'Aïd al-Adha le 28 mai 2026",
                  "startDate": "2026-05-26",
                  "endDate": "2026-05-31",
                  "location": {
                    "@type": "Place",
                    "name": "La Mecque",
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": "La Mecque",
                      "addressCountry": "Arabie Saoudite"
                    }
                  }
                },
                {
                  "@type": "Event",
                  "name": "Ramadan 2027",
                  "description": "Mois sacré du jeûne musulman du 7 février au 8 mars 2027 avec l'Aïd al-Fitr le 8 mars 2027",
                  "startDate": "2027-02-07",
                  "endDate": "2027-03-08",
                  "location": {
                    "@type": "Place",
                    "name": "Observance mondiale",
                    "address": {
                      "@type": "PostalAddress",
                      "addressCountry": "Monde"
                    }
                  }
                },
                {
                  "@type": "Event",
                  "name": "Hajj 2027",
                  "description": "Pèlerinage annuel à La Mecque du 15 au 20 mai 2027 avec le jour d'Arafat le 16 mai et l'Aïd al-Adha le 17 mai 2027",
                  "startDate": "2027-05-15",
                  "endDate": "2027-05-20",
                  "location": {
                    "@type": "Place",
                    "name": "La Mecque",
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": "La Mecque",
                      "addressCountry": "Arabie Saoudite"
                    }
                  }
                },
                {
                  "@type": "Event",
                  "name": "Ramadan 2028",
                  "description": "Mois sacré du jeûne musulman du 27 janvier au 26 février 2028 avec l'Aïd al-Fitr le 26 février 2028",
                  "startDate": "2028-01-27",
                  "endDate": "2028-02-26",
                  "location": {
                    "@type": "Place",
                    "name": "Observance mondiale",
                    "address": {
                      "@type": "PostalAddress",
                      "addressCountry": "Monde"
                    }
                  }
                },
                {
                  "@type": "Event",
                  "name": "Hajj 2028",
                  "description": "Pèlerinage annuel à La Mecque du 4 au 9 mai 2028 avec le jour d'Arafat le 5 mai et l'Aïd al-Adha le 6 mai 2028",
                  "startDate": "2028-05-04",
                  "endDate": "2028-05-09",
                  "location": {
                    "@type": "Place",
                    "name": "La Mecque",
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": "La Mecque",
                      "addressCountry": "Arabie Saoudite"
                    }
                  }
                }
              ]
            }
          })}
        </script>
      </Helmet>
      <SEOBreadcrumb className="container mx-auto px-6 pt-4" />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Dates du Ramadan 2026 et du Hajj 2026
            </h1>
            <h2 className="text-2xl text-muted-foreground mb-4 font-semibold">
              Calendrier complet des dates officielles du Ramadan et du Hajj pour 2026, 2027 et 2028
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Planifiez dès maintenant votre voyage spirituel avec notre calendrier détaillé des dates du Ramadan 
              et du Hajj pour les prochaines années. Le Ramadan est le mois sacré du jeûne musulman, un pilier 
              fondamental de l&apos;Islam où les croyants s&apos;abstiennent de manger et de boire de l&apos;aube au coucher du soleil. 
              Le Hajj, pèlerinage annuel à La Mecque, est une obligation religieuse que tout musulman doit accomplir 
              au moins une fois dans sa vie s&apos;il en a les moyens. Ces dates vous permettront de préparer votre 
              pèlerinage Omra ou Hajj en réservant vos billets d&apos;avion et votre hébergement au meilleur moment, 
              tout en évitant les périodes de forte affluence.
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
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Dates du Ramadan 2026-2028</h2>
                  <p className="text-sm text-muted-foreground mt-1">Calendrier complet des dates de jeûne et de l'Aïd al-Fitr</p>
                </div>
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
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Dates du Hajj 2026-2028</h2>
                  <p className="text-sm text-muted-foreground mt-1">Calendrier des dates officielles du pèlerinage à La Mecque et de l'Aïd al-Adha</p>
                </div>
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

          {/* Liens utiles */}
          <Card className="bg-muted/30 mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Ressources utiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/prayer-times" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">Horaires de Prière</h3>
                  <p className="text-sm text-muted-foreground">Trouvez les horaires de prière pour votre ville</p>
                </a>
                <a href="/islamic-calendar" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">Calendrier Islamique</h3>
                  <p className="text-sm text-muted-foreground">Convertissez les dates grégoriennes en dates hégiriennes</p>
                </a>
                <a href="/category/sejours" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">Séjours Omra</h3>
                  <p className="text-sm text-muted-foreground">Découvrez nos packages complets pour l'Omra</p>
                </a>
              </div>
            </CardContent>
          </Card>
          
          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Questions fréquentes sur les dates du Ramadan et du Hajj</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border">
              <p className="text-sm text-muted-foreground">
                Vous souhaitez accomplir l'Omra pendant le Ramadan 2026 ?{' '}
                <Link to="/" className="text-primary hover:underline font-medium">
                  Comparez les offres des agences agréées →
                </Link>
              </p>
            </div>
          </div>

          {/* Liens internes SEO */}
          <InternalLinks currentPage="/ramadan-hajj-dates" variant="related" className="mt-8" />
        </div>
      </main>
    </ResponsiveLayout>
  );
};

export default RamadanHajjDates;