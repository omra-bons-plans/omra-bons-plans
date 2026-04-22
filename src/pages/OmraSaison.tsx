import { Helmet } from 'react-helmet-async';
import { Link, useLocation, Navigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const saisonsData: Record<string, {
  nom: string;
  mois: string;
  annee: string;
  periode: string;
  tempsMecque: string;
  tempsMedine: string;
  prixMin: string;
  prixMax: string;
  prixMinNum: number;
  prixMaxNum: number;
  affluence: string;
  avantages: string[];
  inconvenients: string[];
  conseils: string[];
  description: string;
  tendance: string;
}> = {
  'octobre-2026': {
    nom: "Octobre 2026",
    mois: "octobre",
    annee: "2026",
    periode: "Automne 2026",
    tempsMecque: "25°C – 35°C",
    tempsMedine: "20°C – 32°C",
    prixMin: "950€",
    prixMax: "2 000€",
    prixMinNum: 950,
    prixMaxNum: 2000,
    affluence: "Faible à modérée",
    avantages: [
      "Températures plus douces qu'en été (25–35°C)",
      "Affluence inférieure au Ramadan : moins d'attente",
      "Prix compétitifs hors vacances scolaires",
      "Bonne disponibilité hôtelière proche Haram",
      "Vols directs disponibles depuis Paris, Lyon, Marseille"
    ],
    inconvenients: [
      "Vacances de la Toussaint : hausse des prix mi-octobre",
      "Quelques journées encore chaudes (35°C+)",
      "Moins de groupes disponibles que janvier-février"
    ],
    conseils: [
      "Réservez 3 à 4 mois à l'avance pour les meilleures offres",
      "Évitez la semaine du 17–26 octobre (Toussaint) pour les tarifs réduits",
      "Prévoyez des vêtements légers et un léger pull pour les nuits",
      "Comparez les offres tout inclus vs vol seul — l'écart peut être important"
    ],
    description: "Octobre 2026 est une excellente période pour effectuer votre Omra. Le Ramadan 2026 étant terminé depuis mars, les prix ont significativement baissé et l'affluence autour de la Kaaba est bien moindre. Les températures commencent à devenir plus clémentes, autour de 30–35°C à La Mecque. C'est l'une des périodes préférées des pèlerins français pour allier spiritualité et confort.",
    tendance: "Croissante"
  },
  'novembre-2026': {
    nom: "Novembre 2026",
    mois: "novembre",
    annee: "2026",
    periode: "Automne-Hiver 2026",
    tempsMecque: "22°C – 32°C",
    tempsMedine: "16°C – 28°C",
    prixMin: "900€",
    prixMax: "1 900€",
    prixMinNum: 900,
    prixMaxNum: 1900,
    affluence: "Faible",
    avantages: [
      "Températures agréables : idéal pour marcher entre sites",
      "Affluence parmi les plus basses de l'année",
      "Meilleurs prix de l'année (hors Ramadan)",
      "Facilité d'accès à la Kaaba — moins de monde",
      "Parfait pour les seniors et personnes à mobilité réduite"
    ],
    inconvenients: [
      "Nuits fraîches à Médine (peut descendre à 12°C)",
      "Moins de vols charters directs depuis les villes secondaires",
      "Offres moins nombreuses — certaines agences réduisent les groupes"
    ],
    conseils: [
      "Novembre est souvent le mois le moins cher de l'année — profitez-en",
      "Prévoyez un manteau léger pour les soirées à Médine",
      "Idéal pour les familles avec seniors ou personnes fatiguables",
      "Réservez 2 à 3 mois à l'avance — bonne disponibilité"
    ],
    description: "Novembre 2026 offre les meilleures conditions pour une Omra sereine et abordable. Avec des températures douces (22–32°C à La Mecque), une affluence très limitée et les prix parmi les plus bas de l'année, c'est la période idéale pour les pèlerins qui souhaitent profiter pleinement des lieux saints sans la pression des foules. Les familles, seniors et débutants y trouveront particulièrement leur compte.",
    tendance: "Stable"
  },
  'decembre-2026': {
    nom: "Décembre 2026",
    mois: "décembre",
    annee: "2026",
    periode: "Hiver 2026",
    tempsMecque: "18°C – 28°C",
    tempsMedine: "12°C – 25°C",
    prixMin: "950€",
    prixMax: "2 500€",
    prixMinNum: 950,
    prixMaxNum: 2500,
    affluence: "Modérée (hausse fin décembre)",
    avantages: [
      "Températures les plus fraîches de l'année : très confortable",
      "Idéal pour effectuer les rites physiquement exigeants (Tawaf, Sa'i)",
      "Début de mois : prix encore bas",
      "Bonnes connections aériennes pour les fêtes de fin d'année"
    ],
    inconvenients: [
      "Vacances de Noël : forte hausse des prix du 20 au 31 décembre",
      "Nuits froides à Médine (peut descendre à 8°C)",
      "Certains hôtels complets sur les périodes de fêtes"
    ],
    conseils: [
      "Partez avant le 18 décembre pour éviter la flambée tarifaire",
      "Emportez un manteau chaud pour les nuits à Médine",
      "Profitez des températures pour allonger vos séances de Tawaf",
      "Comparez les formules 10, 14 et 21 nuits — le rapport qualité-prix varie"
    ],
    description: "Décembre 2026 est une période très appréciée pour l'Omra grâce à ses températures douces et fraîches — une rareté à La Mecque. Les pèlerins peuvent effectuer les rites (Tawaf, Sa'i, marche entre Safa et Marwa) dans des conditions climatiques idéales. Attention toutefois à la période des fêtes de fin d'année qui fait flamber les prix. Réservez tôt pour les meilleurs tarifs.",
    tendance: "Croissante"
  },
  'janvier-2027': {
    nom: "Janvier 2027",
    mois: "janvier",
    annee: "2027",
    periode: "Hiver 2027",
    tempsMecque: "18°C – 30°C",
    tempsMedine: "12°C – 26°C",
    prixMin: "900€",
    prixMax: "2 000€",
    prixMinNum: 900,
    prixMaxNum: 2000,
    affluence: "Faible à modérée",
    avantages: [
      "Début d'année : beaucoup d'offres promotionnelles",
      "Températures fraîches et agréables (18–28°C)",
      "Bonne disponibilité hôtelière après les fêtes",
      "Idéal avant le début du Ramadan 2027 (prévu fin janvier/février)",
      "Vols réguliers et nombreux depuis toutes les grandes villes"
    ],
    inconvenients: [
      "Vacances de février : légère hausse mi-janvier à anticiper",
      "Le Ramadan 2027 approche : certains prix remontent dès mi-janvier",
      "Nuits fraîches à Médine"
    ],
    conseils: [
      "Partez en première quinzaine de janvier pour les meilleurs prix",
      "Vérifiez les dates du Ramadan 2027 — il modifie les disponibilités",
      "Janvier est idéal pour les primo-pèlerins : rites plus faciles sans chaleur extrême",
      "Comparez les formules Omra + Hajj disponibles pour 2027"
    ],
    description: "Janvier 2027 représente une excellente opportunité pour partir en Omra avant le Ramadan 2027. Les prix restent compétitifs en début de mois, les températures sont agréables et l'affluence modérée. C'est aussi l'un des derniers mois pour effectuer l'Omra dans des conditions normales avant la haute saison du Ramadan. Les agences françaises proposent de nombreuses offres promotionnelles de début d'année.",
    tendance: "Stable"
  }
};

export default function OmraSaison() {
  const { pathname } = useLocation();
  const slug = pathname.replace('/omra-en-', '').toLowerCase();
  const data = saisonsData[slug] ?? null;

  if (!data) return <Navigate to="/" replace />;

  const faqs = [
    {
      question: `Est-ce une bonne période pour faire l'Omra en ${data.nom} ?`,
      answer: `${data.nom} est ${data.affluence === 'Faible' ? 'une excellente' : 'une très bonne'} période pour l'Omra. L'affluence est ${data.affluence.toLowerCase()} et les températures varient entre ${data.tempsMecque} à La Mecque. ${data.description.substring(0, 150)}...`
    },
    {
      question: `Quel est le prix d'une Omra en ${data.nom} ?`,
      answer: `Le prix d'une Omra en ${data.nom} varie entre ${data.prixMin} et ${data.prixMax} selon la formule (3★ ou 4★), la durée du séjour (10 à 21 nuits) et la ville de départ en France. Utilisez notre comparateur pour voir les tarifs en temps réel.`
    },
    {
      question: `Quelle est la météo à La Mecque en ${data.mois} ${data.annee} ?`,
      answer: `En ${data.mois} ${data.annee}, les températures à La Mecque oscillent entre ${data.tempsMecque}. À Médine, il fait entre ${data.tempsMedine}. Les nuits peuvent être fraîches — prévoyez une couche supplémentaire, surtout pour Médine.`
    },
    {
      question: `Combien de temps à l'avance réserver une Omra en ${data.nom} ?`,
      answer: `Nous recommandons de réserver votre Omra en ${data.nom} 2 à 4 mois à l'avance pour obtenir les meilleurs prix et avoir le choix des hôtels. Les meilleures offres partent souvent 3 mois avant le départ.`
    }
  ];

  const autresSaisons = Object.entries(saisonsData).filter(([key]) => key !== slug);

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Omra {data.nom} : Prix, Météo & Conseils | Guide Complet</title>
        <meta name="description" content={`Tout savoir sur l'Omra en ${data.mois} ${data.annee} : prix ${data.prixMin}–${data.prixMax}, météo ${data.tempsMecque}, affluence ${data.affluence.toLowerCase()}. Guide complet et comparateur d'offres.`} />
        <meta name="keywords" content={`omra ${data.mois} ${data.annee}, omra en ${data.mois}, prix omra ${data.mois} ${data.annee}, omra ${data.periode.toLowerCase()}, météo la mecque ${data.mois}`} />
        <link rel="canonical" href={`https://omrabonsplans.fr/omra-en-${slug}`} />
        <meta property="og:title" content={`Omra ${data.nom} : Guide Complet`} />
        <meta property="og:description" content={`Prix, météo et conseils pour l'Omra en ${data.mois} ${data.annee}. Affluence ${data.affluence.toLowerCase()}, températures ${data.tempsMecque}. Comparez les offres.`} />
        <meta property="og:url" content={`https://omrabonsplans.fr/omra-en-${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/hero-kaaba-optimized.webp" />
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
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `Omra ${data.nom} : Guide Complet Prix et Conseils`,
          "url": `https://omrabonsplans.fr/omra-en-${slug}`,
          "datePublished": "2026-02-01",
          "dateModified": "2026-04-01",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie", "jobTitle": "Expert en pèlerinage islamique" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "logo": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/logo.svg" } }
        })}</script>
      </Helmet>

      <SEOBreadcrumb items={[
        { name: 'Accueil', url: '/' },
        { name: 'Omra 2026', url: '/omra' },
        { name: `Omra ${data.nom}`, url: `/omra-en-${slug}` }
      ]} />

      <article className="max-w-4xl mx-auto px-4 py-8">

        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{data.periode}</Badge>
            <Badge variant="outline">Affluence : {data.affluence}</Badge>
            <Badge variant="secondary">À partir de {data.prixMin}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Omra {data.nom} : Prix, Météo et Conseils
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {data.description}
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link to="/">Comparer les offres Omra {data.nom} →</Link>
          </Button>
        </header>

        {/* Météo et conditions */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🌡️ Météo et conditions en {data.nom}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">La Mecque</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div className="text-2xl font-bold text-primary mb-1">{data.tempsMecque}</div>
                <div>Températures {data.mois} {data.annee}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Médine</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div className="text-2xl font-bold text-primary mb-1">{data.tempsMedine}</div>
                <div>Températures {data.mois} {data.annee}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Affluence</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div className="text-2xl font-bold text-primary mb-1">{data.affluence}</div>
                <div>Niveau de fréquentation</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Prix */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">💰 Prix d'une Omra en {data.nom}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border border-border p-3 text-left">Formule</th>
                  <th className="border border-border p-3 text-left">Durée</th>
                  <th className="border border-border p-3 text-left">Prix indicatif</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Économique (3★)", "10 nuits", `${data.prixMin} – ${(data.prixMinNum + 400).toLocaleString('fr-FR')}€`],
                  ["Confort (4★)", "14 nuits", `${(data.prixMinNum + 300).toLocaleString('fr-FR')}€ – ${(data.prixMaxNum - 200).toLocaleString('fr-FR')}€`],
                  ["Premium (5★)", "14–21 nuits", `${(data.prixMaxNum - 300).toLocaleString('fr-FR')}€ – ${data.prixMax}`],
                ].map(([formule, duree, prix], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="border border-border p-3 font-medium">{formule}</td>
                    <td className="border border-border p-3">{duree}</td>
                    <td className="border border-border p-3 text-green-700 font-semibold">{prix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Prix indicatifs par personne depuis Paris, en chambre double. Vérifiez les tarifs en temps réel.</p>
        </section>

        {/* Avantages et inconvénients */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">✅ Avantages et inconvénients de {data.nom}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-3">Points forts</h3>
              <ul className="space-y-2">
                {data.avantages.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-amber-700 mb-3">Points de vigilance</h3>
              <ul className="space-y-2">
                {data.inconvenients.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-600 mt-0.5 flex-shrink-0">⚠</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Conseils */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">💡 Nos conseils pour votre Omra en {data.nom}</h2>
          <div className="space-y-3">
            {data.conseils.map((conseil, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <span className="text-primary font-bold text-sm mt-0.5 flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-muted-foreground">{conseil}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">❓ Questions fréquentes : Omra en {data.nom}</h2>
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
        <section className="bg-primary/5 rounded-xl p-8 text-center mb-10">
          <h2 className="text-2xl font-bold mb-3">Trouvez votre Omra {data.nom}</h2>
          <p className="text-muted-foreground mb-6">
            Comparez les meilleures offres Omra pour {data.mois} {data.annee} — prix en temps réel, agences agréées.
          </p>
          <Button asChild size="lg"><Link to="/">Voir les offres →</Link></Button>
        </section>

        {/* Avis de l'expert */}
        <section className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">F</div>
            <div>
              <p className="font-bold text-foreground">Farid d'Arabie</p>
              <p className="text-sm text-primary mb-3">Expert en pèlerinage islamique · +10 ans à La Mecque · +5 000 pèlerins accompagnés</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                "On me demande souvent : 'Quelle est la meilleure saison pour l'Omra ?' Ma réponse est toujours : <strong>la meilleure saison, c'est celle où vous pouvez partir</strong>. Cela dit, si vous avez le choix, Mouharram et Safar (janvier-février) offrent les meilleures conditions : moins de monde, températures douces la nuit, et des prix qui peuvent être 40% moins chers qu'en Ramadan. Pour une première Omra, évitez absolument les 10 derniers jours du Ramadan — réservez cela pour quand vous maîtrisez les rites."
              </p>
            </div>
          </div>
        </section>

        {/* Liens internes */}
        <nav className="pt-6 border-t" aria-label="Autres périodes et pages associées">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Autres périodes</h3>
              <div className="flex flex-col gap-1">
                {autresSaisons.map(([key, s]) => (
                  <Link key={key} to={`/omra-en-${key}`} className="text-primary hover:underline text-sm">
                    Omra {s.nom}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Pages associées</h3>
              <div className="flex flex-col gap-1">
                <Link to="/prix-omra-2026" className="text-primary hover:underline text-sm">Prix Omra 2026</Link>
                <Link to="/omra-ramadan-2026" className="text-primary hover:underline text-sm">Omra Ramadan 2026</Link>
                <Link to="/ramadan-hajj-dates" className="text-primary hover:underline text-sm">Dates Ramadan & Hajj</Link>
                <Link to="/" className="text-primary hover:underline text-sm">Comparateur Omra</Link>
              </div>
            </div>
          </div>
        </nav>
      </article>
    </ResponsiveLayout>
  );
}
