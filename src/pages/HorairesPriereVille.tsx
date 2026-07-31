import { useState, useEffect, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Clock from 'lucide-react/dist/esm/icons/clock';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import { FRENCH_CITIES, getCityBySlug } from '@/data/frenchCities';

const PRAYER_LABELS: Record<string, string> = {
  Fajr: 'Fajr', Sunrise: 'Shourouq', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha',
};

const PRAYER_ARABIC: Record<string, string> = {
  Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء',
};

const DAILY_PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
const OBLIGATORY = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

type PrayerKey = typeof DAILY_PRAYERS[number];

interface DayData {
  date: { readable: string; timestamp: string; hijri: { date: string; month: { ar: string }; year: string } };
  timings: Record<string, string>;
}

const fmt = (v?: string) => v?.match(/\d{1,2}:\d{2}/)?.[0] ?? '--:--';

const getTimestamp = (v: string, base: Date): Date | null => {
  const m = v.match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const d = new Date(base);
  d.setHours(+m[1], +m[2], 0, 0);
  return d;
};

const WEEKDAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export default function HorairesPriereVille() {
  const { ville } = useParams<{ ville: string }>();
  const city = getCityBySlug(ville ?? '');

  const [monthData, setMonthData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(new Date());

  const today = useRef(new Date());
  const todayDay = today.current.getDate(); // 1-based

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!city) return;
    const yr = today.current.getFullYear();
    const mo = today.current.getMonth() + 1;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/calendar/${yr}/${mo}?latitude=${city.lat}&longitude=${city.lng}&method=12`
        );
        const json = await res.json();
        if (json.code === 200 && Array.isArray(json.data)) {
          setMonthData(json.data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [city]);

  if (!city) return <Navigate to="/prayer-times" replace />;

  const todayData: DayData | undefined = monthData[todayDay - 1];
  const timings = todayData?.timings ?? {};
  const hijri = todayData?.date?.hijri;

  // Next 7 days (including today)
  const weekSlice = monthData.slice(todayDay - 1, todayDay + 6);

  // Compute next prayer
  const computeNext = () => {
    for (const key of DAILY_PRAYERS) {
      const at = getTimestamp(timings[key] ?? '', now);
      if (at && at.getTime() > now.getTime()) {
        return { key, time: fmt(timings[key]), at, isTomorrow: false };
      }
    }
    // Fajr tomorrow
    const tomorrowData = monthData[todayDay]; // todayDay is 1-based, so index=todayDay = tomorrow
    if (tomorrowData) {
      const at = getTimestamp(tomorrowData.timings.Fajr ?? '', new Date(now.getTime() + 86400000));
      if (at) return { key: 'Fajr', time: fmt(tomorrowData.timings.Fajr), at, isTomorrow: true };
    }
    return null;
  };

  const next = timings.Fajr ? computeNext() : null;
  const remaining = next ? Math.max(0, next.at.getTime() - now.getTime()) : 0;
  const remH = Math.floor(remaining / 3600000);
  const remM = Math.floor((remaining % 3600000) / 60000);
  const remS = Math.floor((remaining % 60000) / 1000);

  // 8 nearby cities for internal links
  const otherCities = FRENCH_CITIES.filter(c => c.slug !== city.slug).slice(0, 20);

  const dateLabel = today.current.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>{`Horaires de Prière ${city.name} ${today.current.getFullYear()} — Fajr, Dhuhr, Asr, Maghrib, Isha | Omra Bons Plans`}</title>
        <meta name="description" content={`Horaires de prière à ${city.name} (${city.region}) aujourd'hui. Fajr, Dhuhr, Asr, Maghrib et Isha calculés selon la méthode UOIF. Horaires précis mis à jour quotidiennement.`} />
        <meta name="keywords" content={`horaires prière ${city.name.toLowerCase()}, heure prière ${city.name.toLowerCase()}, salat ${city.name.toLowerCase()}, fajr ${city.name.toLowerCase()}, isha ${city.name.toLowerCase()}`} />
        <link rel="canonical" href={`https://omrabonsplans.fr/horaires-priere/${city.slug}`} />
        <meta property="og:title" content={`Horaires de Prière ${city.name} — Omra Bons Plans`} />
        <meta property="og:description" content={`Horaires de prière à ${city.name} aujourd'hui : Fajr, Dhuhr, Asr, Maghrib, Isha. Méthode UOIF.`} />
        <meta property="og:url" content={`https://omrabonsplans.fr/horaires-priere/${city.slug}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": `Horaires de Prière ${city.name}`,
          "description": `Horaires de prière musulmane à ${city.name} (${city.region}). Fajr, Dhuhr, Asr, Maghrib, Isha.`,
          "url": `https://omrabonsplans.fr/horaires-priere/${city.slug}`,
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://omrabonsplans.fr/" },
              { "@type": "ListItem", "position": 2, "name": "Horaires de Prière", "item": "https://omrabonsplans.fr/prayer-times" },
              { "@type": "ListItem", "position": 3, "name": city.name, "item": `https://omrabonsplans.fr/horaires-priere/${city.slug}` },
            ]
          }
        })}</script>
      </Helmet>

      <SEOBreadcrumb className="container mx-auto px-4 pt-4" />

      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4" />
            <span>{city.region}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Horaires de Prière à {city.name}
          </h1>
          <p className="text-muted-foreground capitalize">{dateLabel}</p>
          {hijri && (
            <p className="text-sm text-muted-foreground">
              {hijri.date} {hijri.month.ar} {hijri.year} H
            </p>
          )}
          <Badge variant="outline" className="text-xs">Méthode UOIF — France</Badge>
        </div>

        {/* Next prayer hero */}
        {loading && (
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
            <CardContent className="py-10 text-center text-muted-foreground">Chargement des horaires…</CardContent>
          </Card>
        )}
        {error && (
          <Card className="border-destructive">
            <CardContent className="py-6 text-center text-destructive">Impossible de charger les horaires. Vérifiez votre connexion.</CardContent>
          </Card>
        )}
        {next && (
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
            <CardContent className="py-8 text-center space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {next.isTomorrow ? 'Prochaine prière (demain)' : 'Prochaine prière'}
              </p>
              <div>
                <span className="text-lg font-semibold text-foreground">{PRAYER_LABELS[next.key]}</span>
                <span className="text-muted-foreground ml-2 text-sm">{PRAYER_ARABIC[next.key]}</span>
              </div>
              <div className="text-5xl md:text-6xl font-bold text-primary tabular-nums">{next.time}</div>
              <p className="text-muted-foreground tabular-nums text-lg">
                dans {remH}h {String(remM).padStart(2, '0')}m {String(remS).padStart(2, '0')}s
              </p>
            </CardContent>
          </Card>
        )}

        {/* Today's prayer times grid */}
        {timings.Fajr && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Horaires du jour</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {DAILY_PRAYERS.map(key => {
                const isNext = next && !next.isTomorrow && next.key === key;
                const isPassed = !isNext && (() => {
                  const at = getTimestamp(timings[key] ?? '', now);
                  return at ? at.getTime() <= now.getTime() : false;
                })();
                return (
                  <div
                    key={key}
                    className={`rounded-xl p-3 text-center border transition-all ${
                      isNext
                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                        : isPassed
                        ? 'bg-muted/40 text-muted-foreground border-border/40'
                        : 'bg-background border-border'
                    }`}
                  >
                    <div className="text-[10px] font-medium uppercase tracking-wider opacity-80 mb-0.5">
                      {PRAYER_LABELS[key]}
                    </div>
                    <div className="text-xs opacity-60 mb-1">{PRAYER_ARABIC[key]}</div>
                    <div className="text-lg font-bold tabular-nums">{fmt(timings[key])}</div>
                    {!OBLIGATORY.includes(key as typeof OBLIGATORY[number]) && (
                      <div className="text-[9px] mt-0.5 opacity-50">lever soleil</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7-day schedule */}
        {weekSlice.length > 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Horaires de la semaine</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Jour</th>
                    {OBLIGATORY.map(k => (
                      <th key={k} className="px-2 py-2 text-center font-medium text-muted-foreground">{PRAYER_LABELS[k]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weekSlice.map((day, i) => {
                    const d = new Date(parseInt(day.date.timestamp) * 1000);
                    const isToday = i === 0;
                    return (
                      <tr key={day.date.readable} className={`border-t border-border/50 ${isToday ? 'bg-primary/5 font-semibold' : 'hover:bg-muted/30'}`}>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`text-xs ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                            {WEEKDAYS[d.getDay()]}
                          </span>
                          <span className="ml-1">{d.getDate()}/{d.getMonth() + 1}</span>
                          {isToday && <Badge className="ml-1 text-[9px] px-1 py-0 h-4" variant="default">Auj.</Badge>}
                        </td>
                        {OBLIGATORY.map(k => (
                          <td key={k} className="px-2 py-2 text-center tabular-nums">{fmt(day.timings[k])}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Méthode de calcul : UOIF (Union des Organisations Islamiques de France). Vérifiez avec votre mosquée locale.</p>
          </div>
        )}

        {/* Informational content */}
        <Card className="bg-muted/30">
          <CardContent className="pt-5 space-y-3 text-sm text-muted-foreground">
            <h2 className="text-base font-semibold text-foreground">Prière à {city.name}</h2>
            <p>
              Ces horaires de prière pour <strong>{city.name}</strong> ({city.region}) sont calculés selon la méthode
              de l'<strong>Union des Organisations Islamiques de France (UOIF)</strong>, la référence la plus utilisée
              par les musulmans de France. Les horaires varient chaque jour selon la position astronomique du soleil.
            </p>
            <p>
              Les cinq prières quotidiennes — <strong>Fajr</strong> (aube), <strong>Dhuhr</strong> (midi),{' '}
              <strong>Asr</strong> (après-midi), <strong>Maghrib</strong> (coucher du soleil) et <strong>Isha</strong>{' '}
              (nuit) — constituent le deuxième pilier de l'Islam. Consulter les horaires précis pour votre ville
              permet de pratiquer dans les meilleurs délais.
            </p>
            <p>
              Pour les voyageurs en Omra ou Hajj, les horaires de prière à La Mecque (Masjid al-Haram) et à Médine
              (Masjid Nabawi) sont communiqués par l'autorité saoudienne. Consultez notre{' '}
              <Link to="/omra" className="text-primary underline underline-offset-2">comparateur d'offres Omra 2026</Link>{' '}
              pour préparer votre pèlerinage.
            </p>
          </CardContent>
        </Card>

        {/* Other cities */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Horaires dans d'autres villes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {otherCities.map(c => (
              <Link
                key={c.slug}
                to={`/horaires-priere/${c.slug}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm"
              >
                <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{c.name}</span>
              </Link>
            ))}
          </div>
          <Link to="/prayer-times" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ChevronRight className="w-3 h-3" />
            Toutes les villes →
          </Link>
        </div>

        {/* Internal links */}
        <Card className="bg-muted/20">
          <CardContent className="pt-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Liens utiles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link to="/omra" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <div className="font-semibold text-sm">Offres Omra 2026</div>
                <div className="text-xs text-muted-foreground mt-0.5">Comparez les agences agréées</div>
              </Link>
              <Link to="/ramadan-hajj-dates" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <div className="font-semibold text-sm">Dates Ramadan & Hajj</div>
                <div className="text-xs text-muted-foreground mt-0.5">Calendrier 2026-2027</div>
              </Link>
              <Link to="/hajj-2026" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <div className="font-semibold text-sm">Hajj 2026</div>
                <div className="text-xs text-muted-foreground mt-0.5">Dates, prix et agences</div>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </ResponsiveLayout>
  );
}
