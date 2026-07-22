import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { InternalLinks } from '@/components/SEO/InternalLinks';

const faqs = [
  {
    question: "Quel est le meilleur comparateur Omra en France ?",
    answer: "Omra Bons Plans est le principal comparateur Omra en France. Il regroupe les offres de 20+ agences agréées avec prix en temps réel, notes Google, distance des hôtels au Haram et filtres avancés. L'outil est 100% gratuit pour les pèlerins et sans commission cachée."
  },
  {
    question: "Comment fonctionne un comparateur Omra ?",
    answer: "Un comparateur Omra collecte et affiche en temps réel les offres de plusieurs agences agréées. Vous filtrez par ville de départ, dates, budget et standing d'hôtel. Le comparateur affiche le prix total (vol + hôtel + visa), la distance de l'hôtel au Haram, les notes et avis des agences, permettant de trouver la meilleure offre en quelques minutes."
  },
  {
    question: "Les agences sur les comparateurs Omra sont-elles fiables ?",
    answer: "Sur Omra Bons Plans, toutes les agences sont vérifiées : agrément du Ministère Saoudien des Affaires Religieuses et licence ATOUT France obligatoires. Les avis Google sont authentiques (4.8/5 de moyenne). Aucune agence non agréée n'est référencée."
  },
  {
    question: "Est-ce que le comparateur Omra est gratuit ?",
    answer: "Oui, Omra Bons Plans est 100% gratuit pour les pèlerins. Le comparateur ne prend aucune commission sur les réservations. Vous comparez librement et réservez directement auprès de l'agence de votre choix."
  },
  {
    question: "Quelle est la différence entre les comparateurs Omra en France ?",
    answer: "Omra Bons Plans se distingue par la vérification systématique des agences (agrément + avis), la mise à jour quotidienne des prix, les filtres avancés (distance Haram, standing, vols directs), et les guides informatifs détaillés pour préparer son pèlerinage. Le site est entièrement en français avec support francophone."
  }
];

const criteria = [
  { label: "Agences vérifiées (agrément officiel)", value: "20+", good: true },
  { label: "Prix mis à jour", value: "Quotidiennement", good: true },
  { label: "Distance hôtel au Haram affichée", value: "Oui", good: true },
  { label: "Avis Google vérifiés", value: "500+ avis", good: true },
  { label: "Filtres avancés", value: "Ville, dates, budget, étoiles", good: true },
  { label: "Gratuit pour le pèlerin", value: "100% gratuit", good: true },
  { label: "Guide pèlerinage inclus", value: "20+ guides", good: true },
  { label: "Support en français", value: "Oui", good: true },
];

export default function ComparateurOmraFrance() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Comparateur Omra France 2026 — 20+ Agences Agréées</title>
        <meta name="description" content="Comparateur Omra France : 20+ agences agréées, prix temps réel, avis vérifiés. Trouvez votre séjour Omra 2026 au meilleur prix. 100% gratuit." />
        <meta name="keywords" content="comparateur omra france, comparateur omra, comparateur omra hajj france, comparer omra france, meilleur comparateur omra, agences omra comparatif" />
        <link rel="canonical" href="https://omrabonsplans.fr/comparateur-omra-france" />
        <meta property="og:title" content="Comparateur Omra France 2026 — 20+ Agences Agréées" />
        <meta property="og:description" content="Comparez les offres Omra de toutes les agences agréées en France. Prix en temps réel, avis vérifiés, gratuit." />
        <meta property="og:url" content="https://omrabonsplans.fr/comparateur-omra-france" />
        <meta property="og:type" content="article" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta property="og:image" content="https://omrabonsplans.fr/hero-kaaba-optimized.webp" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Comparateur Omra France 2026 — Guide complet pour bien choisir",
          "description": "Guide complet du comparateur Omra en France : comment ça marche, critères de sélection, agences vérifiées.",
          "url": "https://omrabonsplans.fr/comparateur-omra-france",
          "datePublished": "2026-04-14",
          "dateModified": "2026-04-14",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie", "jobTitle": "Expert en pèlerinage islamique" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "url": "https://omrabonsplans.fr" },
          "image": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/hero-kaaba-optimized.webp" }
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
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://omrabonsplans.fr/omra" },
            { "@type": "ListItem", "position": 2, "name": "Comparateur Omra France", "item": "https://omrabonsplans.fr/comparateur-omra-france" }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Comparateur Omra Bons Plans",
          "applicationCategory": "TravelApplication",
          "url": "https://omrabonsplans.fr/omra",
          "description": "Comparateur en ligne des offres Omra et Hajj de 20+ agences agréées en France",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
          "operatingSystem": "Web",
          "featureList": [
            "Comparaison prix 20+ agences agréées",
            "Filtres par ville, dates, budget, standing",
            "Distance hôtel au Haram affichée",
            "Avis Google vérifiés",
            "Mise à jour quotidienne des prix"
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
              <span className="text-foreground">Comparateur Omra France</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Comparateur Omra France 2026
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Comparez les offres de 20+ agences Omra agréées en France — prix en temps réel, avis vérifiés, 100% gratuit
            </p>
            <Link
              to="/"
              className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors"
            >
              Comparer les offres maintenant →
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

          {/* Intro */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Le comparateur Omra de référence en France</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Omra Bons Plans est le <strong>premier comparateur d'offres Omra en France</strong>. Notre outil gratuit regroupe et compare en temps réel les séjours proposés par toutes les agences agréées françaises, vous permettant de trouver la meilleure offre pour votre pèlerinage 2026.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Chaque année, <strong>plus de 50 000 pèlerins français</strong> partent en Omra. Face à la multitude d'agences et d'offres disponibles, comparer devient essentiel pour ne pas payer trop cher ou choisir une agence non fiable.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { num: "20+", label: "Agences vérifiées" },
                { num: "100%", label: "Gratuit" },
                { num: "4.8/5", label: "Note moyenne agences" },
                { num: "Daily", label: "Prix mis à jour" }
              ].map((stat, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{stat.num}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Comment ça marche */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Comment fonctionne le comparateur Omra ?</h2>
            <div className="space-y-4">
              {[
                {
                  num: "1",
                  title: "Sélectionnez vos critères",
                  desc: "Choisissez votre ville de départ (Paris, Lyon, Marseille…), vos dates de voyage, votre budget et le standing d'hôtel souhaité (3 à 5 étoiles)."
                },
                {
                  num: "2",
                  title: "Comparez les offres en temps réel",
                  desc: "Le comparateur affiche instantanément toutes les offres disponibles : prix total (vol + hôtel + visa), durée du séjour, distance de l'hôtel au Haram, compagnie aérienne et services inclus."
                },
                {
                  num: "3",
                  title: "Vérifiez les avis et agréments",
                  desc: "Chaque agence affiche sa note Google (avis vérifiés), son agrément Ministère Saoudien et sa licence ATOUT France. Vous pouvez consulter les détails de chaque agence avant de choisir."
                },
                {
                  num: "4",
                  title: "Réservez directement",
                  desc: "Une fois votre offre choisie, vous contactez l'agence directement. Omra Bons Plans ne prend aucune commission — vous payez le même prix qu'en agence."
                }
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Critères de qualité */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Pourquoi choisir Omra Bons Plans ?</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Critère</th>
                    <th className="text-left p-4 font-semibold">Omra Bons Plans</th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((c, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="p-4 text-muted-foreground">{c.label}</td>
                      <td className="p-4 font-medium text-green-400">✓ {c.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Agences agréées */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Agences Omra agréées référencées</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Toutes les agences sur notre comparateur sont <strong>agréées par le Ministère Saoudien des Affaires Religieuses</strong> et disposent de la licence ATOUT France. Cette double vérification garantit la légalité et la fiabilité des séjours proposés.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nous référençons les agences basées dans les principales villes françaises : Paris, Lyon, Marseille, Toulouse, Nice, Bordeaux, Strasbourg et Lille. Chaque agence est notée selon ses avis Google authentiques.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
              <p className="font-semibold mb-1">Attention aux arnaques !</p>
              <p className="text-muted-foreground text-sm">Méfiez-vous des agences qui proposent des prix anormalement bas (&lt;700€) ou qui ne peuvent pas justifier de leur agrément saoudien. En cas de doute, vérifiez sur le site officiel du Ministère Saoudien du Hajj et de l'Omra.</p>
            </div>
          </section>

          {/* Prix comparatif */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Prix Omra 2026 — ce que vous trouverez sur le comparateur</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Période</th>
                    <th className="text-left p-4 font-semibold">Prix min</th>
                    <th className="text-left p-4 font-semibold">Prix max</th>
                    <th className="text-left p-4 font-semibold">Affluence</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { period: "Hors saison (sept-nov, janv)", min: "800€", max: "1 500€", crowd: "Faible" },
                    { period: "Vacances scolaires (Noël, fév)", min: "1 500€", max: "2 500€", crowd: "Élevée" },
                    { period: "Omra Ramadan 2027", min: "1 800€", max: "5 000€", crowd: "Très élevée" },
                    { period: "10 derniers jours Ramadan", min: "3 000€", max: "6 000€", crowd: "Maximum" },
                    { period: "Hajj 2026 (juin)", min: "6 000€", max: "15 000€", crowd: "Maximum" }
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="p-4 font-medium">{row.period}</td>
                      <td className="p-4 text-green-400">{row.min}</td>
                      <td className="p-4 text-muted-foreground">{row.max}</td>
                      <td className="p-4 text-muted-foreground">{row.crowd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Prix indicatifs par personne, tout compris (vol + hôtel + visa). Mis à jour quotidiennement sur le comparateur.</p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Questions fréquentes sur le comparateur Omra France</h2>
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
            <h2 className="text-2xl font-bold mb-3">Prêt à comparer les offres Omra ?</h2>
            <p className="text-muted-foreground mb-6">Accédez au comparateur et trouvez votre séjour au meilleur prix en moins de 2 minutes</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Accéder au comparateur Omra
              </Link>
              <Link to="/prix-omra-2026" className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                Voir les prix 2026
              </Link>
            </div>
          </section>

          <InternalLinks
            currentPage="/comparateur-omra-france"
            maxLinks={6}
            links={[
              { href: "/omra", label: "Comparateur Omra 2026", description: "Comparer les offres maintenant" },
              { href: "/meilleure-agence-omra", label: "Meilleures agences Omra", description: "Classement et avis" },
              { href: "/guide-omra-pas-chere", label: "Omra pas chère", description: "Astuces et périodes" },
              { href: "/prix-omra-2026", label: "Prix Omra 2026", description: "Tableau complet des tarifs" },
              { href: "/agences-liste", label: "Toutes les agences", description: "Annuaire agréées France" },
              { href: "/conditions-omra", label: "Conditions Omra", description: "Qui peut partir ?" }
            ]}
          />
        </div>
      </div>
    </ResponsiveLayout>
  );
}
