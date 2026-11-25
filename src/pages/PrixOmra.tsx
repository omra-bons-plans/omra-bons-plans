import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: "Quel est le prix moyen d'une Omra en 2026 ?",
    answer: "En 2026, le prix moyen d'une Omra tout compris depuis la France est de 1 500€ à 2 000€ hors Ramadan, et de 2 000€ à 4 500€ pendant le Ramadan. Les prix varient selon la ville de départ, la formule (3★, 4★, 5★) et la durée du séjour."
  },
  {
    question: "Quelle est l'Omra la moins chère en 2026 ?",
    answer: "Les offres les moins chères (800€ à 1 200€) sont disponibles hors saison (septembre à novembre, janvier à février hors vacances). Ces formules proposent des hôtels 3 étoiles situés à 500m-1km du Haram, avec vol aller-retour et pension inclus."
  },
  {
    question: "Pourquoi les prix de l'Omra varient-ils autant ?",
    answer: "Le prix d'une Omra dépend de plusieurs facteurs : la proximité de l'hôtel au Masjid al-Haram (plus c'est proche, plus c'est cher), la catégorie de l'hôtel (3★ à 5★), la période (Ramadan, vacances scolaires), la ville de départ, et les services inclus (transferts, guides, excursions)."
  },
  {
    question: "Y a-t-il des coûts cachés dans les offres Omra ?",
    answer: "Certaines offres n'incluent pas : les pourboires pour les guides (20-30€/semaine), les excursions (Jabal al-Nour, Jabal Thour : 30-50€), les repas supplémentaires, ou les cartes de transport local. Vérifiez toujours ce qui est inclus dans le forfait avant de réserver."
  },
  {
    question: "Comment payer moins cher son Omra ?",
    answer: "Pour payer moins cher : réservez hors vacances scolaires et hors Ramadan, comparez plusieurs agences sur notre comparateur, optez pour un départ en semaine, choisissez un hôtel à 500m-1km du Haram plutôt que adjacent, et réservez 3 à 6 mois à l'avance pour les meilleures offres."
  }
];

function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer }
      }))
    };
    let s = document.querySelector('script[data-prix-faq]') as HTMLScriptElement;
    if (!s) {
      s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-prix-faq', 'true');
      document.head.appendChild(s);
    }
    s.textContent = JSON.stringify(schema);
    return () => { document.querySelector('script[data-prix-faq]')?.remove(); };
  }, [faqs]);
  return null;
}

export default function PrixOmra() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Prix Omra 2027 : Tarifs par Saison, Ville & Agence | Comparatif Complet</title>
        <meta name="description" content="Tableau complet des prix Omra 2027 : de 800€ à 6 500€ selon la période, la ville de départ et l'agence. Comparez les tarifs et trouvez l'offre la moins chère." />
        <meta name="keywords" content="prix omra 2027, tarif omra 2027, combien coute une omra, prix omra ramadan 2027, omra pas chere, cout omra france, tarif hajj 2027" />
        <link rel="canonical" href="https://omrabonsplans.fr/prix-omra-2026" />
        <meta property="og:title" content="Prix Omra 2027 : Tarifs Complets par Saison et Agence" />
        <meta property="og:description" content="Découvrez les prix réels de l'Omra 2027. Tableaux de tarifs par saison, ville de départ et catégorie d'hôtel. De 800€ à 6 500€." />
        <meta property="og:url" content="https://omrabonsplans.fr/prix-omra-2026" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/hero-kaaba-optimized.webp" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Prix Omra 2027 : Guide Complet des Tarifs",
          "description": "Tableau complet des prix Omra 2027 par saison, ville de départ et formule.",
          "url": "https://omrabonsplans.fr/prix-omra-2026",
          "datePublished": "2026-01-10",
          "dateModified": "2026-08-16",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie", "jobTitle": "Expert en pèlerinage islamique" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "logo": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/logo.svg" } },
          "image": "https://omrabonsplans.fr/hero-kaaba-optimized.webp"
        })}</script>
      </Helmet>
      <FAQSchema faqs={faqs} />

      <SEOBreadcrumb items={[
        { name: 'Accueil', url: '/' },
        { name: 'Omra 2026', url: '/omra' },
        { name: 'Prix Omra 2026', url: '/prix-omra-2026' }
      ]} />

      <article className="max-w-4xl mx-auto px-4 py-8">

        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-green-600 text-white">Mis à jour avril 2027</Badge>
            <Badge variant="outline">20+ agences analysées</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Prix Omra 2027 : Tableau Complet des Tarifs par Saison et Agence
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Combien coûte une Omra en 2026 depuis la France ? Le prix varie de <strong>800€ à plus de 6 500€</strong>
            selon la saison, la formule choisie et la ville de départ. Nous avons analysé les offres de 20+ agences
            françaises agréées pour vous donner les tarifs les plus précis et actualisés.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link to="/">Voir les offres disponibles →</Link>
          </Button>
        </header>

        {/* Résumé rapide */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">📊 Résumé : Les prix Omra 2026 en un coup d'œil</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Omra économique", price: "800€ – 1 200€", color: "bg-green-50 border-green-200", badge: "Hors saison" },
              { label: "Omra standard", price: "1 200€ – 2 000€", color: "bg-blue-50 border-blue-200", badge: "Toute l'année" },
              { label: "Omra Ramadan", price: "1 800€ – 4 500€", color: "bg-amber-50 border-amber-200", badge: "Ramadan" },
              { label: "Omra premium 5★", price: "3 500€ – 6 500€", color: "bg-purple-50 border-purple-200", badge: "Tout compris" }
            ].map(item => (
              <div key={item.label} className={`border rounded-xl p-4 text-center ${item.color}`}>
                <Badge variant="secondary" className="mb-2 text-xs">{item.badge}</Badge>
                <div className="font-bold text-lg">{item.price}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Tableau par saison */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">📅 Prix Omra 2026 par saison et mois</h2>
          <p className="text-muted-foreground mb-4">
            Le facteur le plus important dans le prix d'une Omra est la période du voyage.
            Voici les tarifs moyens par période pour un séjour de 10 nuits au départ de Paris :
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border border-border p-3 text-left">Mois / Période</th>
                  <th className="border border-border p-3 text-left">3 étoiles</th>
                  <th className="border border-border p-3 text-left">4 étoiles</th>
                  <th className="border border-border p-3 text-left">5 étoiles</th>
                  <th className="border border-border p-3 text-left">Affluence</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { period: "Septembre", p3: "900 – 1 200€", p4: "1 300 – 1 700€", p5: "2 000 – 2 800€", crowd: "🟢 Faible" },
                  { period: "Octobre", p3: "950 – 1 300€", p4: "1 400 – 1 800€", p5: "2 100 – 2 900€", crowd: "🟢 Faible" },
                  { period: "Novembre", p3: "900 – 1 200€", p4: "1 300 – 1 700€", p5: "2 000 – 2 800€", crowd: "🟢 Faible" },
                  { period: "Décembre", p3: "1 200 – 1 600€", p4: "1 700 – 2 200€", p5: "2 500 – 3 500€", crowd: "🟡 Moyenne" },
                  { period: "Janvier", p3: "950 – 1 300€", p4: "1 400 – 1 800€", p5: "2 100 – 3 000€", crowd: "🟢 Faible" },
                  { period: "Février (hors Ramadan)", p3: "1 000 – 1 400€", p4: "1 500 – 2 000€", p5: "2 200 – 3 200€", crowd: "🟡 Moyenne" },
                  { period: "Ramadan (fév.-mars 2027)", p3: "1 800 – 2 500€", p4: "2 500 – 3 500€", p5: "3 500 – 5 500€", crowd: "🔴 Très forte" },
                  { period: "10 derniers jours Ramadan", p3: "2 500 – 3 200€", p4: "3 200 – 4 500€", p5: "4 500 – 6 500€", crowd: "🔴 Maximale" },
                  { period: "Avril – Mai", p3: "1 000 – 1 400€", p4: "1 500 – 2 000€", p5: "2 200 – 3 200€", crowd: "🟡 Moyenne" },
                  { period: "Juin – Août (été)", p3: "1 300 – 1 700€", p4: "1 800 – 2 400€", p5: "2 800 – 4 000€", crowd: "🟡 Moyenne" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="border border-border p-3 font-medium">{row.period}</td>
                    <td className="border border-border p-3 text-green-700">{row.p3}</td>
                    <td className="border border-border p-3 text-amber-700">{row.p4}</td>
                    <td className="border border-border p-3 text-red-700">{row.p5}</td>
                    <td className="border border-border p-3">{row.crowd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Prix indicatifs par personne, vol + hôtel + transferts inclus, au départ de Paris.</p>
        </section>

        {/* Prix par ville */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">✈️ Prix Omra 2026 par ville de départ</h2>
          <p className="text-muted-foreground mb-4">
            La ville de départ influence le prix du vol, donc le prix total du forfait.
            Voici les différences habituellement constatées (par rapport à Paris) :
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { city: "Paris (CDG)", diff: "Prix de référence", note: "Plus grand choix d'agences" },
              { city: "Lyon", diff: "+50 à +150€", note: "Plusieurs vols directs" },
              { city: "Marseille", diff: "+30 à +100€", note: "Communauté importante, bon choix" },
              { city: "Toulouse", diff: "+80 à +200€", note: "Offres en augmentation" },
              { city: "Bordeaux", diff: "+100 à +250€", note: "Via Paris souvent" },
              { city: "Nice / Montpellier", diff: "+100 à +300€", note: "Moins d'offres directes" },
              { city: "Nantes / Rennes", diff: "+150 à +350€", note: "Principalement via Paris" },
              { city: "Strasbourg / Lille", diff: "+80 à +200€", note: "Tarifs variables" },
            ].map(item => (
              <div key={item.city} className="border rounded-lg p-3 flex justify-between items-start">
                <div>
                  <div className="font-semibold text-sm">{item.city}</div>
                  <div className="text-xs text-muted-foreground">{item.note}</div>
                </div>
                <Badge variant={item.diff === "Prix de référence" ? "default" : "outline"} className="text-xs">{item.diff}</Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Ce qui est inclus */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">📦 Que comprend le prix d'un forfait Omra ?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base text-green-700">✅ Généralement inclus</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Vol aller-retour depuis la France</li>
                  <li>✓ Hébergement à La Mecque (7-15 nuits)</li>
                  <li>✓ Hébergement à Médine (5-7 nuits)</li>
                  <li>✓ Pension complète ou demi-pension</li>
                  <li>✓ Transferts aéroport ↔ hôtel</li>
                  <li>✓ Transport La Mecque ↔ Médine</li>
                  <li>✓ Visa Omra (ou visa touristique)</li>
                  <li>✓ Assurance voyage de base</li>
                  <li>✓ Accompagnement d'un guide (plupart des agences)</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base text-red-700">❌ Non inclus habituellement</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✗ Excursions (Jabal al-Nour, Musée Hajj…)</li>
                  <li>✗ Repas supplémentaires / snacks</li>
                  <li>✗ Achats personnels, souvenirs</li>
                  <li>✗ Téléphone / Wi-Fi supplémentaire</li>
                  <li>✗ Pourboires guides (20-30€/semaine)</li>
                  <li>✗ Carte de transport local (bus, métro)</li>
                  <li>✗ Soins médicaux sur place</li>
                  <li>✗ Surbagage aérien</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Conseils économies */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">💡 5 conseils pour payer moins cher son Omra en 2026</h2>
          <ol className="space-y-4">
            {[
              { t: "Voyagez hors vacances scolaires", d: "Les prix baissent de 20 à 40% en septembre, octobre, novembre et janvier par rapport aux vacances de février ou de printemps. Un séjour en octobre peut coûter 900€ là où le même séjour en février coûte 1 400€." },
              { t: "Comparez via notre comparateur", d: "Notre comparateur agrège les offres de 20+ agences en temps réel. Même pour une même période, les prix peuvent varier de 200 à 500€ d'une agence à l'autre pour des prestations similaires." },
              { t: "Réservez 3 à 6 mois à l'avance", d: "Les premières offres publiées sont souvent les moins chères ('early bird'). En attendant le dernier moment, vous risquez de payer 20 à 30% plus cher ou de ne plus trouver de disponibilités." },
              { t: "Optez pour un hôtel à 500m-1km du Haram", d: "Les hôtels adjacents au Masjid al-Haram coûtent 2 à 3 fois plus cher que des hôtels à 10 minutes à pied. Pour la plupart des pèlerins, la marche est tout à fait faisable." },
              { t: "Choisissez une durée optimale (10-14 nuits)", d: "Les séjours de 10-14 nuits offrent le meilleur rapport qualité/prix. Les séjours courts (7 nuits) coûtent presque autant que les séjours plus longs en raison des frais fixes (vol, visa)." }
            ].map((item, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">{i + 1}</span>
                <div>
                  <strong className="block mb-1">{item.t}</strong>
                  <p className="text-sm text-muted-foreground">{item.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">❓ Questions fréquentes sur le prix de l'Omra 2026</h2>
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
        </section>

        {/* CTA */}
        <section className="bg-primary/5 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Comparez les prix Omra 2026 maintenant</h2>
          <p className="text-muted-foreground mb-6">
            Utilisez notre comparateur pour voir en temps réel les prix de 20+ agences françaises agréées.
            Filtrez par ville, mois et budget.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg"><Link to="/">Comparer les prix →</Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/omra-ramadan-2027">Prix Omra Ramadan</Link></Button>
          </div>
        </section>

        <section className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">F</div>
            <div>
              <p className="font-bold text-foreground">Farid d'Arabie</p>
              <p className="text-sm text-primary mb-3">Expert en pèlerinage islamique</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                "Le piège classique : comparer uniquement le prix affiché sans regarder la distance de l'hôtel au Haram. <strong>Un hôtel à 2 km peut vous coûter plus cher en taxi et en fatigue</strong> qu'un hôtel à 500 mètres légèrement plus onéreux. Mon conseil : divisez le budget par le nombre de nuits, comparez le coût total en incluant les transports sur place. Une Omra réussie n'est pas la moins chère — c'est celle où vous arrivez à la Kaaba reposé, sans stress logistique, avec l'énergie pour vous concentrer sur l'essentiel."
              </p>
            </div>
          </div>
        </section>

        <nav className="mt-10 pt-6 border-t" aria-label="Pages associées">
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Pages associées</h3>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="text-primary hover:underline text-sm">Comparateur Omra 2026</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/omra-ramadan-2027" className="text-primary hover:underline text-sm">Omra Ramadan 2027</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/guide-omra-pas-chere" className="text-primary hover:underline text-sm">Guide Omra Pas Chère</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/agences-liste" className="text-primary hover:underline text-sm">Agences Omra Agréées</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/omra-femme-seule" className="text-primary hover:underline text-sm">Omra Femme Seule</Link>
          </div>
        </nav>
      </article>
    </ResponsiveLayout>
  );
}
