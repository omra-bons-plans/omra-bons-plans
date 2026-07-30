import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import { QURAN_SURAHS, getSurahBySlug } from '@/data/quranSurahs';

interface Ayah {
  numberInSurah: number;
  text: string;
}

interface ApiSurah {
  ayahs: Ayah[];
}

export default function SourateDetail() {
  const { sourate } = useParams<{ sourate: string }>();
  const surah = getSurahBySlug(sourate ?? '');

  const [arabic, setArabic] = useState<Ayah[]>([]);
  const [french, setFrench] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!surah) return;
    setLoading(true);
    setError(false);
    setArabic([]);
    setFrench([]);

    fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,fr.hamidullah`)
      .then(r => r.json())
      .then(json => {
        if (json.code === 200 && Array.isArray(json.data) && json.data.length === 2) {
          setArabic((json.data[0] as ApiSurah).ayahs);
          setFrench((json.data[1] as ApiSurah).ayahs);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [surah?.number]);

  if (!surah) return <Navigate to="/coran" replace />;

  const prev = surah.number > 1 ? QURAN_SURAHS[surah.number - 2] : null;
  const next = surah.number < 114 ? QURAN_SURAHS[surah.number] : null;

  const hasBismillah = surah.number !== 1 && surah.number !== 9;

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Sourate {surah.nameEn} ({surah.nameAr}) en Français — {surah.number}. {surah.nameFr} | Omra Bons Plans</title>
        <meta name="description" content={`Lire la Sourate ${surah.nameEn} (${surah.nameAr}) — ${surah.number}ème sourate du Coran, ${surah.verses} versets, révélée à ${surah.type === 'Mecquoise' ? 'La Mecque' : 'Médine'}. Texte arabe avec traduction française complète de Mohammed Hamidullah.`} />
        <meta name="keywords" content={`sourate ${surah.nameEn.toLowerCase()}, ${surah.nameEn.toLowerCase()} en français, sourate ${surah.number}, ${surah.nameFr.toLowerCase()}, coran français`} />
        <link rel="canonical" href={`https://omrabonsplans.fr/coran/${surah.slug}`} />
        <meta property="og:title" content={`Sourate ${surah.nameEn} — Coran en Français | Omra Bons Plans`} />
        <meta property="og:description" content={`${surah.nameEn} (${surah.nameFr}) — ${surah.verses} versets. Texte arabe et traduction française.`} />
        <meta property="og:url" content={`https://omrabonsplans.fr/coran/${surah.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Chapter",
          "name": `Sourate ${surah.nameEn}`,
          "position": surah.number,
          "description": `${surah.nameFr} — ${surah.verses} versets — ${surah.type}`,
          "url": `https://omrabonsplans.fr/coran/${surah.slug}`,
          "isPartOf": {
            "@type": "Book",
            "name": "Le Coran",
            "url": "https://omrabonsplans.fr/coran"
          }
        })}</script>
      </Helmet>

      <SEOBreadcrumb className="container mx-auto px-4 pt-4" />

      <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <Link to="/coran" className="hover:text-primary transition-colors">Le Coran</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Sourate {surah.number}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">{surah.nameEn}</h1>
          <p className="text-3xl font-arabic text-primary" dir="rtl">{surah.nameAr}</p>
          <p className="text-muted-foreground">{surah.nameFr}</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant={surah.type === 'Mecquoise' ? 'secondary' : 'outline'}>{surah.type}</Badge>
            <Badge variant="outline">{surah.verses} versets</Badge>
            <Badge variant="outline">Sourate {surah.number}</Badge>
          </div>
        </div>

        {/* Bismillah */}
        {hasBismillah && (
          <div className="text-center py-4 border-y border-border/50">
            <p className="text-2xl md:text-3xl font-arabic text-foreground leading-loose" dir="rtl">
              بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-sm text-muted-foreground mt-2">Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="py-6 text-center text-destructive">
              Impossible de charger les versets. Vérifiez votre connexion et rechargez la page.
            </CardContent>
          </Card>
        )}

        {/* Verses */}
        {!loading && !error && arabic.length > 0 && (
          <div className="space-y-4">
            {arabic.map((ayah, i) => {
              const frAyah = french[i];
              return (
                <div key={ayah.numberInSurah} className="rounded-xl border border-border hover:border-primary/30 transition-colors overflow-hidden">
                  {/* Arabic */}
                  <div className="bg-muted/20 px-4 py-3 border-b border-border/50">
                    <p className="text-xl md:text-2xl font-arabic leading-loose text-right text-foreground" dir="rtl">
                      {ayah.text}
                      <span className="text-primary text-lg ml-2">﴿{ayah.numberInSurah}﴾</span>
                    </p>
                  </div>
                  {/* French */}
                  <div className="px-4 py-3 flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                      {ayah.numberInSurah}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{frAyah?.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {prev ? (
            <Link to={`/coran/${prev.slug}`} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm">
              <ChevronLeft className="w-4 h-4" />
              <div>
                <div className="text-xs text-muted-foreground">{prev.number}.</div>
                <div className="font-medium">{prev.nameEn}</div>
              </div>
            </Link>
          ) : <div />}

          <Link to="/coran" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Toutes les sourates
          </Link>

          {next ? (
            <Link to={`/coran/${next.slug}`} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm text-right">
              <div>
                <div className="text-xs text-muted-foreground">{next.number}.</div>
                <div className="font-medium">{next.nameEn}</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </div>

        {/* Related links */}
        <Card className="bg-muted/20">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link to="/horaires-priere/paris" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <div className="font-semibold text-sm">Horaires de Prière</div>
                <div className="text-xs text-muted-foreground mt-0.5">Paris, Lyon, Marseille…</div>
              </Link>
              <Link to="/omra" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <div className="font-semibold text-sm">Offres Omra 2026</div>
                <div className="text-xs text-muted-foreground mt-0.5">Comparez les agences</div>
              </Link>
              <Link to="/ramadan-hajj-dates" className="p-3 bg-background rounded-lg border hover:border-primary transition-colors">
                <div className="font-semibold text-sm">Dates Ramadan & Hajj</div>
                <div className="text-xs text-muted-foreground mt-0.5">Calendrier islamique</div>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </ResponsiveLayout>
  );
}
