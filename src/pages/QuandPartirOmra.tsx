import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { InternalLinks } from '@/components/SEO/InternalLinks';

const faqs = [
  {
    question: "Quelle est la meilleure période pour partir en Omra ?",
    answer: "La meilleure période dépend de votre budget et de vos priorités. Le Ramadan est la période la plus spirituelle mais aussi la plus chère (+50 à +100%). Les mois de Mouharram, Safar et Rajab offrent le meilleur rapport qualité-prix. Évitez les grandes chaleurs de juillet-août (45°C à La Mecque)."
  },
  {
    question: "Peut-on faire l'Omra en dehors du Ramadan ?",
    answer: "Oui, l'Omra peut être effectuée toute l'année (contrairement au Hajj). En dehors du Ramadan, l'affluence est moindre, les prix sont plus bas et les conditions sont souvent plus confortables pour accomplir les rites à votre rythme."
  },
  {
    question: "Combien coûte l'Omra selon la période ?",
    answer: "Le prix varie de 800€ à 4000€+ selon la période et le standing. Hors saison (Mouharram, Safar) : 800-1500€. Haute saison (Ramadan, vacances scolaires) : 2000-4000€. Le prix inclut généralement vols, hôtel et visa."
  },
  {
    question: "Faut-il partir en Omra à Ramadan ?",
    answer: "Partir en Omra pendant le Ramadan est très méritoire. Le Prophète Muhammad (ﷺ) a dit qu'une Omra en Ramadan équivaut à un Hajj en récompense. Cependant, les foules sont immenses et les prix très élevés. Si votre budget est limité, une Omra hors Ramadan est tout aussi valide spirituellement."
  },
  {
    question: "Quelle période éviter pour l'Omra ?",
    answer: "Évitez juillet et août (chaleur extrême, jusqu'à 50°C), les premières semaines du Ramadan (foules maximum) et les vacances scolaires françaises (prix gonflés). La semaine du Hajj (Dhul Hijja) est réservée aux pèlerins du Hajj uniquement — l'Omra est suspendue pour les étrangers."
  }
];


const seasons = [
  {
    name: "Mouharram & Safar",
    months: "Juillet – Sept (calendrier lunaire)",
    price: "€€",
    crowd: "Faible",
    temp: "45°C",
    note: "Meilleur prix",
    color: "text-green-400"
  },
  {
    name: "Rajab",
    months: "Mois sacré",
    price: "€€",
    crowd: "Modérée",
    temp: "30–40°C",
    note: "Très recommandé",
    color: "text-blue-400"
  },
  {
    name: "Sha'ban",
    months: "Avant Ramadan",
    price: "€€€",
    crowd: "Modérée",
    temp: "30–40°C",
    note: "Bon équilibre",
    color: "text-blue-400"
  },
  {
    name: "Ramadan",
    months: "Mois de jeûne",
    price: "€€€€",
    crowd: "Très élevée",
    temp: "Variable",
    note: "Plus méritoire",
    color: "text-yellow-400"
  },
  {
    name: "Hiver (déc – fév)",
    months: "Saison fraîche",
    price: "€€€",
    crowd: "Élevée",
    temp: "15–25°C",
    note: "Agréable",
    color: "text-blue-400"
  }
];

export default function QuandPartirOmra() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Quand partir en Omra ? Meilleures Périodes & Prix 2026 | Omra Bons Plans</title>
        <meta name="description" content="Découvrez la meilleure période pour partir en Omra selon votre budget : Ramadan, hiver, hors saison. Comparatif des prix et conseils pour choisir la bonne date en 2026." />
        <meta name="keywords" content="quand partir en omra, meilleure période omra, omra ramadan, omra hiver, prix omra saison, omra 2026" />
        <link rel="canonical" href="https://omrabonsplans.fr/quand-partir-omra" />
        <meta property="og:title" content="Quand partir en Omra ? Guide des Meilleures Périodes 2026" />
        <meta property="og:description" content="Ramadan, hiver ou hors saison : quelle est la meilleure période pour votre Omra ? Comparatif complet des prix et de l'affluence." />
        <meta property="og:url" content="https://omrabonsplans.fr/quand-partir-omra" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/og-omra-debutant.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Quand partir en Omra ? Meilleures Périodes 2026" />
        <meta name="twitter:description" content="Ramadan, hiver ou hors saison : comparatif complet des prix et de l'affluence." />
        <meta name="twitter:image" content="https://omrabonsplans.fr/og-omra-debutant.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Quand partir en Omra ? Meilleures Périodes & Prix 2026",
          "description": "Guide complet pour choisir la meilleure période pour votre Omra selon votre budget, votre disponibilité et vos objectifs spirituels.",
          "url": "https://omrabonsplans.fr/quand-partir-omra",
          "author": { "@type": "Organization", "name": "Omra Bons Plans" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "url": "https://omrabonsplans.fr" },
          "datePublished": "2025-01-01",
          "dateModified": "2026-04-14",
          "image": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/og-omra-debutant.jpg", "width": 1200, "height": 630 },
          "inLanguage": "fr-FR"
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer }
          }))
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://omrabonsplans.fr" },
            { "@type": "ListItem", "position": 2, "name": "Guide Omra", "item": "https://omrabonsplans.fr/definition-omra" },
            { "@type": "ListItem", "position": 3, "name": "Quand partir en Omra", "item": "https://omrabonsplans.fr/quand-partir-omra" }
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/20 via-background to-background py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <nav className="text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary">Accueil</Link>
              <span className="mx-2">/</span>
              <Link to="/definition-omra" className="hover:text-primary">Guide Omra</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Quand partir en Omra</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Quand partir en Omra ?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meilleures périodes, prix par saison et conseils pour planifier votre pèlerinage 2026
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

          {/* Intro */}
          <section>
            <h2 className="text-2xl font-bold mb-4">L'Omra est possible toute l'année</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Contrairement au Hajj qui se déroule uniquement pendant le mois de Dhul Hijja, <strong>l'Omra peut être accomplie à n'importe quel moment de l'année</strong>. Cette flexibilité est une chance pour les musulmans qui souhaitent accomplir ce pèlerinage selon leurs disponibilités et leur budget.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cependant, toutes les périodes ne se valent pas. La période de l'année influe sur les prix, l'affluence à La Mecque, les conditions météorologiques et la valeur spirituelle perçue. Ce guide vous aide à choisir la meilleure période pour votre situation.
            </p>
          </section>

          {/* Tableau des saisons */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Comparatif des périodes pour l'Omra</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Période</th>
                    <th className="text-left p-4 font-semibold">Prix</th>
                    <th className="text-left p-4 font-semibold">Affluence</th>
                    <th className="text-left p-4 font-semibold">Température</th>
                    <th className="text-left p-4 font-semibold">Recommandation</th>
                  </tr>
                </thead>
                <tbody>
                  {seasons.map((s, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="p-4 font-medium">{s.name}<br /><span className="text-xs text-muted-foreground">{s.months}</span></td>
                      <td className="p-4">{s.price}</td>
                      <td className="p-4">{s.crowd}</td>
                      <td className="p-4">{s.temp}</td>
                      <td className={`p-4 font-medium ${s.color}`}>{s.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Ramadan */}
          <section>
            <h2 className="text-2xl font-bold mb-4">L'Omra pendant le Ramadan</h2>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-4">
              <p className="text-yellow-300 font-medium mb-2">Hadith du Prophète Muhammad (ﷺ)</p>
              <p className="italic text-muted-foreground">"Une Omra pendant le Ramadan vaut un Hajj — ou un Hajj accompli avec moi." (Bukhari et Muslim)</p>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Le Ramadan est la période la plus prisée pour l'Omra. L'atmosphère est incomparable : des millions de fidèles jeûnent ensemble, les mosquées sont bondées pour les tarawih, et la spiritualité atteint son apogée. La dernière décade (10 derniers jours) est particulièrement recherchée pour la nuit de Laylat al-Qadr.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>En contrepartie</strong>, les prix explosent (+50 à +100% par rapport à la basse saison) et les foules sont immenses. Réservez 6 à 9 mois à l'avance pour le Ramadan. Consultez nos offres <Link to="/omra-ramadan" className="text-primary hover:underline">Omra Ramadan</Link>.
            </p>
          </section>

          {/* Hiver */}
          <section>
            <h2 className="text-2xl font-bold mb-4">L'Omra en hiver (décembre – février)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              L'hiver est une excellente période pour l'Omra depuis la France. Les températures à La Mecque sont agréables (15 à 25°C), ce qui facilite les déplacements entre les lieux saints. C'est aussi la période des vacances scolaires de Noël et de février, ce qui attire les familles.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Les prix sont plus élevés que la basse saison mais inférieurs au Ramadan. Réservez 2 à 3 mois à l'avance. Pour les familles, consultez nos offres <Link to="/omra-famille" className="text-primary hover:underline">Omra en famille</Link>.
            </p>
          </section>

          {/* Basse saison */}
          <section>
            <h2 className="text-2xl font-bold mb-4">La basse saison : le bon plan budget</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Les mois de Mouharram, Safar et la période entre Ramadan et l'hiver offrent les meilleurs prix. On trouve des séjours Omra à partir de 800€ tout compris pendant ces périodes. L'affluence est moindre, ce qui permet d'accomplir le Tawaf et le Sa'i dans de meilleures conditions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Budget serré", rec: "Mouharram / Safar", price: "dès 800€" },
                { title: "Équilibre", rec: "Sha'ban / automne", price: "dès 1 200€" },
                { title: "Spiritualité max", rec: "Ramadan (10 derniers jours)", price: "dès 2 500€" }
              ].map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <p className="font-semibold mb-1">{item.title}</p>
                  <p className="text-primary font-bold mb-1">{item.rec}</p>
                  <p className="text-sm text-muted-foreground">{item.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Calendrier 2026 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Calendrier Omra 2026 : dates clés</h2>
            <div className="space-y-3">
              {[
                { date: "Fin fév – Fin mars 2026", event: "Ramadan 2026 (dates approximatives)", type: "important" },
                { date: "Déc 2025 – Jan 2026", event: "Vacances de Noël — forte demande", type: "warning" },
                { date: "Fév 2026", event: "Vacances scolaires — familles", type: "warning" },
                { date: "Juin – Août 2026", event: "Hajj 2026 — Omra suspendue pour étrangers", type: "danger" },
                { date: "Sept – Nov 2026", event: "Basse saison — meilleurs prix", type: "success" }
              ].map((item, i) => {
                const colors = {
                  important: "border-yellow-500/50 bg-yellow-500/10",
                  warning: "border-blue-500/50 bg-blue-500/10",
                  danger: "border-red-500/50 bg-red-500/10",
                  success: "border-green-500/50 bg-green-500/10"
                };
                return (
                  <div key={i} className={`flex items-start gap-4 p-4 rounded-lg border ${colors[item.type as keyof typeof colors]}`}>
                    <span className="font-medium min-w-[180px] text-sm">{item.date}</span>
                    <span className="text-muted-foreground text-sm">{item.event}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Trouvez votre Omra au meilleur prix</h2>
            <p className="text-muted-foreground mb-6">Comparez les offres de toutes les agences selon votre période de départ</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/omra" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Comparer les offres Omra
              </Link>
              <Link to="/prix-omra-2026" className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                Voir les prix 2026
              </Link>
            </div>
          </section>

          {/* Internal links */}
          <InternalLinks currentPage="/quand-partir-omra" />
        </div>
      </div>
    </ResponsiveLayout>
  );
}
