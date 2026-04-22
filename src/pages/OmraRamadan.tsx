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
    question: "Quel est le prix d'une Omra pendant le Ramadan 2026 ?",
    answer: "Le prix d'une Omra pendant le Ramadan 2026 varie entre 1 800€ et 4 500€ par personne selon la formule, la proximité de l'hôtel au Haram et la durée du séjour. Les 10 derniers jours du Ramadan sont les plus chers (2 500€ à 5 000€)."
  },
  {
    question: "Quand commence le Ramadan 2026 ?",
    answer: "Le Ramadan 2026 devrait commencer vers le 18 février 2026 (sous réserve de l'observation de la lune). Il se terminerait aux alentours du 19-20 mars 2026, avec Aïd el-Fitr autour du 20 mars."
  },
  {
    question: "Quand sont les 10 derniers jours du Ramadan 2026 ?",
    answer: "Les 10 derniers jours du Ramadan 2026 se situeraient du 10 au 19 mars 2026 environ. La nuit de Laylat al-Qadr (nuit du destin) se situe habituellement lors des nuits impaires : 21, 23, 25, 27 ou 29 du Ramadan."
  },
  {
    question: "Faut-il réserver longtemps à l'avance pour une Omra Ramadan ?",
    answer: "Oui, absolument. Les offres Omra Ramadan 2026 se remplissent très vite, parfois 6 à 12 mois à l'avance. Nous conseillons de réserver dès septembre-octobre 2025 pour les meilleures places et tarifs."
  },
  {
    question: "Quelle est la différence entre Omra début Ramadan et fin Ramadan ?",
    answer: "L'Omra en début de Ramadan est moins chère (1 800-2 500€) et un peu moins fréquentée. Les 10 derniers jours sont les plus spirituels (Laylat al-Qadr) mais aussi les plus chers et les plus bondés. Choisissez selon votre budget et votre objectif spirituel."
  },
  {
    question: "Quelle agence française choisir pour l'Omra Ramadan 2026 ?",
    answer: "Les principales agences françaises agréées pour l'Omra Ramadan 2026 sont : Tawaf, Medinvoyages, Al Maqam, Pelerinhajj, Omra Sounnah, Omra Pour Tous et Sabil Voyages. Comparez leurs offres sur notre comparateur."
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
    let s = document.querySelector('script[data-ramadan-faq]') as HTMLScriptElement;
    if (!s) {
      s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-ramadan-faq', 'true');
      document.head.appendChild(s);
    }
    s.textContent = JSON.stringify(schema);
    return () => { document.querySelector('script[data-ramadan-faq]')?.remove(); };
  }, [faqs]);
  return null;
}

export default function OmraRamadan() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Omra Ramadan 2026 : Prix, Offres & 10 Derniers Jours | Guide Complet</title>
        <meta name="description" content="Tout sur l'Omra Ramadan 2026 : dates, prix (1800€-5000€), offres agences françaises, 10 derniers jours du Ramadan. Comparez et réservez votre séjour spirituel." />
        <meta name="keywords" content="omra ramadan 2026, omra pendant le ramadan, 10 derniers jours ramadan 2026, prix omra ramadan, offre omra ramadan, laylat al qadr 2026, omra ramadan pas chere" />
        <link rel="canonical" href="https://omrabonsplans.fr/omra-ramadan-2026" />
        <meta property="og:title" content="Omra Ramadan 2026 : Prix, Offres & 10 Derniers Jours" />
        <meta property="og:description" content="Guide complet pour l'Omra Ramadan 2026 : dates, prix, offres d'agences françaises agréées. Comparez les séjours pour les 10 derniers jours du Ramadan." />
        <meta property="og:url" content="https://omrabonsplans.fr/omra-ramadan-2026" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/hero-kaaba-optimized.webp" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Omra Ramadan 2026 : Guide Complet, Prix et Offres",
          "description": "Guide complet pour organiser votre Omra pendant le Ramadan 2026, avec les 10 derniers jours du Ramadan.",
          "url": "https://omrabonsplans.fr/omra-ramadan-2026",
          "datePublished": "2026-01-15",
          "dateModified": "2026-04-01",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "logo": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/logo.svg" } },
          "image": "https://omrabonsplans.fr/hero-kaaba-optimized.webp",
          "mainEntityOfPage": "https://omrabonsplans.fr/omra-ramadan-2026"
        })}</script>
      </Helmet>
      <FAQSchema faqs={faqs} />

      <SEOBreadcrumb items={[
        { name: 'Accueil', url: '/' },
        { name: 'Omra 2026', url: '/omra' },
        { name: 'Omra Ramadan 2026', url: '/omra-ramadan-2026' }
      ]} />

      <article className="max-w-4xl mx-auto px-4 py-8">

        {/* Hero */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-amber-500 text-white">Ramadan 2026</Badge>
            <Badge variant="outline">Mis à jour avril 2026</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Omra Ramadan 2026 : Guide Complet, Prix et Meilleures Offres
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            L'Omra pendant le Ramadan est l'expérience spirituelle la plus intense de l'année.
            Accomplir l'Omra pendant le mois béni du Ramadan — surtout lors des 10 derniers jours —
            équivaut, selon certains avis savants, à l'équivalent d'un Hajj accompli avec le Prophète ﷺ.
            Dans ce guide, on vous explique tout : <strong>dates, prix, agences, conseils de réservation</strong>.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="bg-primary text-white mr-3">
              <Link to="/">Comparer les offres Omra Ramadan →</Link>
            </Button>
          </div>
        </header>

        {/* Dates */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">📅 Dates du Ramadan 2026</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Calendrier Ramadan 2026</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>🌙 <strong>Début du Ramadan :</strong> ~18 février 2026</li>
                    <li>🕌 <strong>10 derniers jours :</strong> ~10 au 19 mars 2026</li>
                    <li>⭐ <strong>Laylat al-Qadr :</strong> Nuits du 21, 23, 25, 27 ou 29</li>
                    <li>🎉 <strong>Aïd el-Fitr :</strong> ~20 mars 2026</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">* Dates sous réserve de l'observation de la lune</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Périodes de l'Omra Ramadan</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✅ <strong>Début Ramadan :</strong> Plus calme, moins cher</li>
                    <li>✅ <strong>Mi-Ramadan :</strong> Bon compromis prix/spiritualité</li>
                    <li>⭐ <strong>10 derniers jours :</strong> Plus spirituel, plus cher</li>
                    <li>🔥 <strong>Nuit du 27 :</strong> Nuit la plus recherchée</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Prix */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">💰 Prix de l'Omra Ramadan 2026</h2>
          <p className="text-muted-foreground mb-4">
            Les prix varient considérablement selon la période du Ramadan choisie, la proximité de l'hôtel
            au Haram al-Sharif et la formule sélectionnée. Voici une grille tarifaire réaliste basée
            sur les offres 2026 des agences françaises agréées :
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border border-border p-3 text-left">Période</th>
                  <th className="border border-border p-3 text-left">Formule Eco (3★)</th>
                  <th className="border border-border p-3 text-left">Formule Confort (4★)</th>
                  <th className="border border-border p-3 text-left">Formule Premium (5★)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 font-medium">1ère semaine Ramadan</td>
                  <td className="border border-border p-3 text-green-600 font-semibold">1 800€ – 2 200€</td>
                  <td className="border border-border p-3 text-amber-600 font-semibold">2 500€ – 3 200€</td>
                  <td className="border border-border p-3 text-red-600 font-semibold">3 500€ – 4 500€</td>
                </tr>
                <tr className="bg-muted/30">
                  <td className="border border-border p-3 font-medium">2ème semaine Ramadan</td>
                  <td className="border border-border p-3 text-green-600 font-semibold">2 000€ – 2 500€</td>
                  <td className="border border-border p-3 text-amber-600 font-semibold">2 800€ – 3 500€</td>
                  <td className="border border-border p-3 text-red-600 font-semibold">4 000€ – 5 000€</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">10 derniers jours</td>
                  <td className="border border-border p-3 text-green-600 font-semibold">2 500€ – 3 000€</td>
                  <td className="border border-border p-3 text-amber-600 font-semibold">3 200€ – 4 200€</td>
                  <td className="border border-border p-3 text-red-600 font-semibold">4 500€ – 6 500€</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Prix par personne, au départ de Paris, vols + hôtel + transferts inclus.</p>
        </section>

        {/* Pourquoi Ramadan */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🌙 Pourquoi faire l'Omra pendant le Ramadan ?</h2>
          <p className="text-muted-foreground mb-4">
            Faire l'Omra pendant le Ramadan est l'une des expériences les plus recherchées par les musulmans du monde entier.
            Plusieurs raisons spirituelles et pratiques expliquent cet attrait exceptionnel.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">🕌 Récompense spirituelle multipliée</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                D'après un hadith authentique rapporté par Boukhari et Mouslim, le Prophète ﷺ a déclaré :
                <em>"L'Omra pendant le Ramadan équivaut à accomplir le Hajj avec moi."</em>
                Cette récompense exceptionnelle attire des millions de pèlerins chaque année.
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">⭐ La nuit du Destin (Laylat al-Qadr)</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Se trouver à La Mecque ou à Médine lors de Laylat al-Qadr — la nuit qui vaut mieux que mille mois —
                est un rêve pour tout croyant. Les 10 derniers jours du Ramadan concentrent cette nuit bénie.
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">🤲 Atmosphère unique et inoubliable</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Le Masjid al-Haram pendant le Ramadan dégage une atmosphère spirituelle incomparable :
                prières nocturnes (Tarawih), récitations du Coran, itikafs, foules du monde entier réunies
                dans un même élan de foi.
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">🌟 Pardon et purification</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Le Ramadan est le mois du pardon. Combiner le jeûne, la prière, la lecture du Coran ET
                l'accomplissement de l'Omra crée des conditions idéales pour obtenir le pardon d'Allah
                et se rapprocher de Lui.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 10 derniers jours */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">⭐ Omra pendant les 10 Derniers Jours du Ramadan 2026</h2>
          <p className="text-muted-foreground mb-4">
            Les <strong>10 derniers jours du Ramadan 2026</strong> (environ du 10 au 19 mars 2026) représentent
            la période la plus intense et la plus recherchée de l'année pour l'Omra. Voici ce qu'il faut savoir :
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-semibold mb-1">Affluence maximale</h3>
              <p className="text-sm text-muted-foreground">
                La Mosquée al-Haram accueille plusieurs millions de fidèles pendant les 10 derniers jours.
                Préparez-vous à des foules importantes, particulièrement lors des Tarawih et du Fajr.
                La pratique des tawaf peut prendre 2 à 4 heures au lieu de 30 minutes hors saison.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold mb-1">I'tikaf (retraite spirituelle)</h3>
              <p className="text-sm text-muted-foreground">
                Certaines agences proposent des formules spéciales I'tikaf (retraite spirituelle dans la mosquée)
                pendant les 10 derniers jours. Ces places sont très limitées et nécessitent une réservation
                6 à 12 mois à l'avance.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold mb-1">Tarif majoré</h3>
              <p className="text-sm text-muted-foreground">
                Attendez-vous à des tarifs 30 à 50% plus élevés que le reste du Ramadan.
                Les hôtels proches du Haram pratiquent des prix premium.
                Réservez très tôt (dès septembre 2025) pour obtenir les meilleurs tarifs.
              </p>
            </div>
          </div>
        </section>

        {/* Conseils réservation */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">📋 Comment bien réserver son Omra Ramadan 2026 ?</h2>
          <ol className="space-y-4">
            {[
              { step: "1", title: "Réservez le plus tôt possible", text: "Les offres Omra Ramadan partent en quelques semaines. Dès septembre-octobre 2025, les meilleures formules sont disponibles. Plus vous attendez, plus les prix montent et les disponibilités se réduisent." },
              { step: "2", title: "Comparez sur notre comparateur", text: "Utilisez notre comparateur Omra pour filtrer par mois, ville de départ, budget et formule. Vous verrez en temps réel les offres disponibles de 15+ agences françaises agréées." },
              { step: "3", title: "Vérifiez l'agrément de l'agence", text: "Assurez-vous que l'agence est agréée par le ministère saoudien du Hajj et qu'elle possède une autorisation ATOUT France. Notre liste d'agences agréées vous facilite la vérification." },
              { step: "4", title: "Choisissez votre formule", text: "Formule Essentiel (hôtel 3★ à 500m-1km du Haram) ou Confort (hôtel 4-5★ à moins de 300m) ? Votre budget et vos priorités déterminent ce choix. En Ramadan, la proximité au Haram vaut vraiment son prix." },
              { step: "5", title: "Vérifiez votre passeport et visa", text: "Assurez-vous que votre passeport est valide pour au moins 6 mois après votre retour. Le visa Omra est inclus dans la plupart des forfaits. Certaines agences proposent aussi des visas touristiques." }
            ].map(item => (
              <li key={item.step} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">{item.step}</span>
                <div>
                  <strong className="block mb-1">{item.title}</strong>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Agences */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🏢 Meilleures agences françaises pour l'Omra Ramadan 2026</h2>
          <p className="text-muted-foreground mb-4">
            Toutes ces agences sont agréées pour l'organisation d'Omra depuis la France et proposent des
            offres spéciales Ramadan 2026 :
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { name: "Tawaf", specialty: "10 derniers jours, hôtels proches", rating: "4.8/5" },
              { name: "Medinvoyages", specialty: "Formules tout compris", rating: "4.7/5" },
              { name: "Al Maqam", specialty: "Spécialiste Ramadan", rating: "4.6/5" },
              { name: "Pelerinhajj", specialty: "Accompagnement religieux inclus", rating: "4.9/5" },
              { name: "Omra Sounnah", specialty: "Budget et économique", rating: "4.5/5" },
              { name: "Omra Pour Tous", specialty: "Familles et groupes", rating: "4.6/5" }
            ].map(agency => (
              <div key={agency.name} className="border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{agency.name}</div>
                  <div className="text-xs text-muted-foreground">{agency.specialty}</div>
                </div>
                <Badge variant="secondary">⭐ {agency.rating}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link to="/agences-liste">Voir toutes les agences agréées →</Link>
            </Button>
          </div>
        </section>

        {/* Conseils pratiques */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">✅ Conseils pratiques pour l'Omra Ramadan</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Avant le départ</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Passeport valide 6 mois après retour</li>
                <li>✓ Vaccin méningite ACYW135 recommandé</li>
                <li>✓ Médicaments : paracétamol, anti-diarrhéiques</li>
                <li>✓ Tenue ihram pour les hommes</li>
                <li>✓ Vêtements amples et couvrants pour les femmes</li>
                <li>✓ Chaussures confortables (beaucoup de marche)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Sur place</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Restez bien hydraté (chaleur + jeûne)</li>
                <li>✓ Arrivez tôt pour la prière du Fajr</li>
                <li>✓ Évitez les heures de pointe pour le tawaf (14h-16h)</li>
                <li>✓ Numéro du guide toujours sur vous</li>
                <li>✓ Prenez des photos de l'hôtel (en cas de perte)</li>
                <li>✓ Soyez patient et gardez l'esprit serein</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">❓ Questions fréquentes sur l'Omra Ramadan 2026</h2>
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
          <h2 className="text-2xl font-bold mb-3">Prêt à réserver votre Omra Ramadan 2026 ?</h2>
          <p className="text-muted-foreground mb-6">
            Comparez les offres de 15+ agences françaises agréées. Filtrez par ville de départ,
            période du Ramadan et budget. Réservez en toute confiance.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/">Comparer les offres Omra →</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/guide-omra-pas-chere">Guide Omra Pas Chère</Link>
            </Button>
          </div>
        </section>

        {/* Avis de l'expert */}
        <section className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">F</div>
            <div>
              <p className="font-bold text-foreground">Farid d'Arabie</p>
              <p className="text-sm text-primary mb-3">Expert en pèlerinage islamique · +10 ans à La Mecque · +5 000 pèlerins accompagnés</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                "L'Omra du Ramadan est spirituellement incomparable — la Kaaba en pleine nuit, entouré de millions de pèlerins récitant le Coran, c'est une expérience qui vous change. <strong>Mais elle demande une préparation physique sérieuse</strong> : la foule pendant les 10 derniers jours peut être écrasante, et la chaleur du jour (35-40°C à La Mecque) épuise rapidement. Si c'est votre première Omra, je recommande Mouharram ou Safar pour une expérience plus sereine. Gardez le Ramadan pour quand vous connaissez déjà les rites et les lieux."
              </p>
            </div>
          </div>
        </section>

        {/* Liens internes */}
        <nav className="mt-10 pt-6 border-t" aria-label="Pages associées">
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Pages associées</h3>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="text-primary hover:underline text-sm">Comparateur Omra 2026</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/hajj" className="text-primary hover:underline text-sm">Comparateur Hajj 2026</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/prix-omra-2026" className="text-primary hover:underline text-sm">Prix Omra 2026</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/guide-omra-pas-chere" className="text-primary hover:underline text-sm">Guide Omra Pas Chère</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/agences-liste" className="text-primary hover:underline text-sm">Agences Omra France</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/ramadan-hajj-dates" className="text-primary hover:underline text-sm">Dates Ramadan 2026</Link>
          </div>
        </nav>

      </article>
    </ResponsiveLayout>
  );
}
