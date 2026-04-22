import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';

export default function DixDerniersJoursRamadan() {
  const faqItems = [
    {
      q: "Pourquoi les 10 derniers jours du Ramadan sont-ils si importants ?",
      a: "Les 10 derniers jours du Ramadan sont les plus sacrés de l'année islamique car ils contiennent la Nuit du Destin (Laylat al-Qadr), une nuit meilleure que mille mois (83 ans) de dévotion. Le Prophète Muhammad (ﷺ) intensifiait son adoration et pratiquait l'i'tikaf (retraite spirituelle) pendant ces 10 jours. Faire l'Omra pendant cette période est considéré comme équivalant à accompagner le Prophète dans un Hajj selon certains hadiths."
    },
    {
      q: "Quand sont exactement les 10 derniers jours du Ramadan 2026 ?",
      a: "Le Ramadan 2026 devrait débuter autour du 18 février 2026. Les 10 derniers jours correspondraient donc approximativement au 10 au 19 mars 2026. La Nuit du Destin est traditionnellement cherchée dans les nuits impaires : 21, 23, 25, 27 et 29 du Ramadan — soit autour du 12, 14, 16, 18 et 20 mars 2026. Ces dates sont indicatives et peuvent varier d'un jour selon l'observation de la lune."
    },
    {
      q: "Combien coûte une Omra pendant les 10 derniers jours du Ramadan 2026 ?",
      a: "Les 10 derniers jours sont la période la plus chère et la plus demandée de l'année. Les prix atteignent leur maximum : de 2 500€ à 6 000€ par personne en hôtel 3-4 étoiles. Les séjours de 10 jours couvrant toute la période coûtent entre 3 000€ et 8 000€. Les places sont limitées et se réservent souvent dès septembre-octobre pour le Ramadan de l'année suivante."
    },
    {
      q: "Quelle est la quelle nuit est Laylat al-Qadr (Nuit du Destin) ?",
      a: "La date exacte de Laylat al-Qadr n'est pas fixée par le Coran ou la Sunna. Elle est cachée dans les nuits impaires des 10 derniers jours du Ramadan. Traditionnellement, la nuit du 27 du Ramadan est la plus souvent mentionnée. Mais le Prophète (ﷺ) recommandait de la chercher dans toutes les nuits impaires : 21, 23, 25, 27 et 29."
    },
    {
      q: "Comment se préparer spirituellement pour les 10 derniers jours à La Mecque ?",
      a: "Avant le départ : mémorisez les invocations (dua) importantes, apprenez les rites de l'Omra, lisez des sourates du Coran à réciter lors du tawaf. Sur place : intensifiez la récitation du Coran (objectif : khatm/lecture complète), priez le Tahajjud (prière de nuit), faites l'i'tikaf si possible, multipliez le dhikr (Subhanallah, Alhamdulillah, Allahu Akbar), et suppliez intensément lors de Laylat al-Qadr."
    }
  ];

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>10 Derniers Jours Ramadan 2026 à La Mecque — Omra, Prix & Guide</title>
        <meta name="description" content="Omra 10 derniers jours Ramadan 2026 : dates, prix (2 500-8 000€), Laylat al-Qadr, conseils de préparation et agences spécialisées. Réservez tôt." />
        <meta name="keywords" content="10 derniers jours ramadan, omra 10 derniers jours, laylat al-qadr, nuit du destin, omra ramadan prix, ramadan mecque 2026, dernières nuits ramadan" />
        <link rel="canonical" href="https://omrabonsplans.fr/10-derniers-jours-ramadan" />
        <meta property="og:title" content="10 Derniers Jours Ramadan 2026 à La Mecque — Omra & Guide" />
        <meta property="og:description" content="Dates, prix et conseils pour l'Omra pendant les 10 derniers jours du Ramadan 2026 incluant Laylat al-Qadr." />
        <meta property="og:url" content="https://omrabonsplans.fr/10-derniers-jours-ramadan" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Les 10 Derniers Jours du Ramadan 2026 à La Mecque — Omra, Prix & Guide",
          "description": "Guide complet sur l'Omra pendant les 10 derniers jours du Ramadan 2026 : dates, Laylat al-Qadr, prix et préparation.",
          "url": "https://omrabonsplans.fr/10-derniers-jours-ramadan",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie", "jobTitle": "Expert en pèlerinage islamique" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "url": "https://omrabonsplans.fr" },
          "datePublished": "2025-11-01",
          "dateModified": "2026-04-14",
          "image": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/og-omra-debutant.jpg", "width": 1200, "height": 630 },
          "inLanguage": "fr-FR"
        })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": { "@type": "Answer", "text": item.a }
            }))
          })}
        </script>
      </Helmet>

      <SEOBreadcrumb items={[
        { name: 'Accueil', url: '/' },
        { name: 'Omra Ramadan', url: '/omra-ramadan-2026' },
        { name: '10 Derniers Jours', url: '/10-derniers-jours-ramadan' }
      ]} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Les 10 Derniers Jours du Ramadan 2026 à La Mecque
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Les 10 derniers jours du Ramadan sont la période la plus sacrée pour accomplir l'Omra. Laylat al-Qadr — la Nuit du Destin — s'y cache. Voici comment préparer votre séjour, les dates clés et les prix à anticiper pour 2026.
          </p>
        </header>

        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-5 mb-8">
          <h2 className="font-bold text-purple-900 dark:text-purple-100 mb-3">📅 Dates indicatives Ramadan 2026</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            {[
              { label: 'Début Ramadan', date: '~18 fév. 2026', color: 'purple' },
              { label: 'Début 10 derniers jours', date: '~10 mars 2026', color: 'orange' },
              { label: 'Laylat al-Qadr (27ème)', date: '~18 mars 2026', color: 'yellow' },
              { label: 'Eid al-Fitr', date: '~20 mars 2026', color: 'green' },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="font-bold text-sm">{item.date}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">⚠️ Dates approximatives — confirmation après observation de la lune</p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Prix des séjours Omra — 10 derniers jours du Ramadan 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="p-3 text-left border">Formule</th>
                  <th className="p-3 text-left border">Hôtel</th>
                  <th className="p-3 text-left border">Distance Haram</th>
                  <th className="p-3 text-left border">Prix / pers.</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Économique', '3★', '500m – 1km', '2 500€ – 3 500€'],
                  ['Confort', '4★', '200 – 500m', '3 500€ – 5 000€'],
                  ['Premium', '5★', 'Moins de 200m', '5 000€ – 8 000€'],
                  ['Suite / Luxe', '5★ deluxe', 'Vue Kaaba', '8 000€ – 15 000€+'],
                ].map(([formule, hotel, distance, prix], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-muted/20' : ''}>
                    <td className="p-3 border font-medium">{formule}</td>
                    <td className="p-3 border">{hotel}</td>
                    <td className="p-3 border text-muted-foreground">{distance}</td>
                    <td className="p-3 border font-semibold text-primary">{prix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Prix indicatifs pour 10 nuits, vol inclus depuis Paris. Les disponibilités s'épuisent rapidement.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Les nuits à ne pas manquer : Laylat al-Qadr</h2>
          <div className="space-y-3">
            {[
              { nuit: '21ème nuit (~ 10 mars)', importance: 'Première nuit impaire des 10 derniers jours' },
              { nuit: '23ème nuit (~ 12 mars)', importance: 'Nuit très recherchée par les pèlerins' },
              { nuit: '25ème nuit (~ 14 mars)', importance: 'Nombreux savants la mentionnent' },
              { nuit: '27ème nuit (~ 16 mars)', importance: 'La plus citée dans les textes islamiques ⭐', highlight: true },
              { nuit: '29ème nuit (~ 18 mars)', importance: 'Dernière nuit impaire avant la fin du Ramadan' },
            ].map((item, i) => (
              <div key={i} className={`flex gap-3 p-4 rounded-lg border ${item.highlight ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300' : 'bg-muted/30'}`}>
                <span className="text-2xl">{item.highlight ? '⭐' : '🌙'}</span>
                <div>
                  <p className="font-semibold">{item.nuit}</p>
                  <p className="text-sm text-muted-foreground">{item.importance}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Questions fréquentes — 10 derniers jours du Ramadan</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <h3 className="font-semibold p-4 bg-muted/30">{item.q}</h3>
                <p className="p-4 text-muted-foreground text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold mb-3">Réservez votre Omra Ramadan maintenant</h2>
          <p className="text-muted-foreground mb-2">Les places pour les 10 derniers jours s'épuisent en quelques semaines. Réservez dès maintenant.</p>
          <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-5">⚡ Places très limitées pour les 10 derniers jours</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Comparer les offres Ramadan
            </Link>
            <Link to="/omra-ramadan-2026" className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">
              Guide Omra Ramadan 2026
            </Link>
          </div>
        </section>
      </main>
    </ResponsiveLayout>
  );
}
