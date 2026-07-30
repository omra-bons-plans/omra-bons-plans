import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import Search from 'lucide-react/dist/esm/icons/search';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import { QURAN_SURAHS } from '@/data/quranSurahs';

export default function QuranIndex() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'Mecquoise' | 'Médinoise'>('all');

  const filtered = useMemo(() => {
    return QURAN_SURAHS.filter(s => {
      const q = query.toLowerCase();
      const matchQ = !q || s.nameFr.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q) || s.nameAr.includes(q) || String(s.number).includes(q);
      const matchF = filter === 'all' || s.type === filter;
      return matchQ && matchF;
    });
  }, [query, filter]);

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Le Coran en Français — Les 114 Sourates | Omra Bons Plans</title>
        <meta name="description" content="Lisez le Coran en français et en arabe : les 114 sourates avec traduction complète de Mohammed Hamidullah. Texte arabe authentique et traduction française." />
        <meta name="keywords" content="coran en français, sourates coran, traduction coran français, lire coran, coran arabe français, sourate traduction" />
        <link rel="canonical" href="https://omrabonsplans.fr/coran" />
        <meta property="og:title" content="Le Coran en Français — 114 Sourates | Omra Bons Plans" />
        <meta property="og:description" content="Lisez les 114 sourates du Coran en arabe avec traduction française complète." />
        <meta property="og:url" content="https://omrabonsplans.fr/coran" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Book",
          "name": "Le Coran",
          "inLanguage": ["ar", "fr"],
          "url": "https://omrabonsplans.fr/coran",
          "description": "Le Coran en arabe avec traduction française — 114 sourates, 6236 versets.",
          "numberOfPages": 604,
          "bookFormat": "EBook"
        })}</script>
      </Helmet>

      <SEOBreadcrumb className="container mx-auto px-4 pt-4" />

      <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Traduction Mohammed Hamidullah</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Le Coran en Français</h1>
          <p className="text-muted-foreground">Les 114 sourates — texte arabe et traduction française</p>
          <p className="text-4xl font-arabic mt-1" dir="rtl">القرآن الكريم</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Sourates', value: '114' },
            { label: 'Versets', value: '6 236' },
            { label: 'Pages', value: '604' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-muted/30 p-3">
              <div className="text-xl font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher une sourate…"
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'Mecquoise', 'Médinoise'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${filter === f ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}
              >
                {f === 'all' ? 'Toutes' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Surah grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map(s => (
            <Link
              key={s.number}
              to={`/coran/${s.slug}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {s.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{s.nameEn}</span>
                  <Badge variant={s.type === 'Mecquoise' ? 'secondary' : 'outline'} className="text-[9px] px-1 py-0 h-4 flex-shrink-0">{s.type === 'Mecquoise' ? 'M' : 'Md'}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{s.nameFr} · {s.verses}v</div>
              </div>
              <div className="text-base font-arabic text-muted-foreground flex-shrink-0" dir="rtl">{s.nameAr}</div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Aucune sourate trouvée pour "{query}"</p>
        )}

        {/* SEO text */}
        <div className="prose prose-sm max-w-none text-muted-foreground border-t border-border pt-6">
          <p>Le Coran (القرآن الكريم) est le livre saint de l'Islam, révélé au Prophète Muhammad ﷺ sur une période de 23 ans. Il est composé de <strong>114 sourates</strong> et <strong>6 236 versets</strong>. Les sourates révélées avant l'Hégire sont dites <em>Mecquoises</em>, celles révélées après sont dites <em>Médinoises</em>.</p>
          <p>La traduction française utilisée est celle de <strong>Mohammed Hamidullah</strong>, l'une des plus reconnues par les musulmans francophones. Pour votre Omra ou Hajj, la récitation coranique tient une place centrale — consultez nos <Link to="/horaires-priere/paris" className="text-primary">horaires de prière</Link> et nos <Link to="/omra" className="text-primary">offres Omra 2026</Link>.</p>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
