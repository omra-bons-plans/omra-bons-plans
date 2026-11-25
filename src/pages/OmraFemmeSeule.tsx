import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: "Une femme peut-elle faire l'Omra seule sans mahram en 2026 ?",
    answer: "Selon la loi saoudienne en vigueur depuis 2021, oui : les femmes de tout âge peuvent accomplir l'Omra sans mahram, à condition de voyager avec un groupe organisé par une agence agréée par le Ministère saoudien du Hajj et de l'Omra. Cette réforme a été officiellement annoncée par les autorités saoudiennes et est appliquée sans restriction depuis lors. D'un point de vue légal, aucun document attestant d'un mahram n'est requis à l'entrée en Arabie Saoudite pour l'Omra. Cependant, d'un point de vue religieux, la majorité des savants (hanafite, malikite, shafiite) considèrent que le mahram reste obligatoire pour le voyage de la femme. Il est recommandé de consulter votre référent religieux avant de prendre votre décision."
  },
  {
    question: "Quelles sont les conditions officielles pour une femme seule en Omra ?",
    answer: "Les conditions légales saoudiennes pour une femme voyageant sans mahram sont : (1) voyager avec un groupe organisé par une agence agréée par le Ministère saoudien du Hajj — cette agence doit fournir un encadrement; (2) rester avec le groupe lors des déplacements officiels vers le Masjid al-Haram et à Médine; (3) être titulaire d'un passeport valide ou d'une carte nationale d'identité française en cours de validité; (4) avoir au moins 18 ans (les mineures nécessitent une autorisation parentale notariée); (5) respecter les règles vestimentaires islamiques. Il n'y a plus d'obligation légale de présenter un acte de mariage ou de parenté avec un homme."
  },
  {
    question: "Y a-t-il des groupes spécialement pour femmes seules ?",
    answer: "Oui, plusieurs agences françaises ont développé des formules dédiées. Il existe deux types principaux : les groupes 100% féminins, composés exclusivement de femmes et accompagnés par une accompagnatrice désignée — disponibles chez certaines agences sur demande, souvent sur des dates spécifiques hors Ramadan; et les groupes mixtes avec accompagnatrice dédiée, qui est la formule la plus courante et la plus accessible tout au long de l'année. Les agences Tawaf, Medinvoyages, Pelerinhajj et Al Maqam proposent ces deux types de formules. Il est conseillé de préciser votre situation au moment de la réservation pour être orientée vers le groupe le plus adapté."
  },
  {
    question: "Quel est le prix d'une Omra pour femme seule ?",
    answer: "Le prix d'une Omra pour une femme seule est identique à celui d'une Omra standard — aucun surcoût lié au statut de voyageuse seule. Comptez 900€ à 1 400€ pour une formule économique (3★, 10 nuits) hors Ramadan, et 1 800€ à 4 000€ pendant le Ramadan. Pour réduire les coûts, de nombreuses agences proposent des chambres partagées (chambre double ou quadruple) avec d'autres femmes du groupe, ce qui peut économiser 200 à 400€ par rapport à une chambre individuelle. Réservez 3 à 4 mois à l'avance pour bénéficier des meilleurs tarifs."
  },
  {
    question: "Comment se passe la sécurité à La Mecque et Médine pour une femme ?",
    answer: "La Mecque et Médine sont parmi les villes les plus sécurisées au monde pour les femmes. Le Masjid al-Haram est surveillé 24h/24 par des milliers d'agents de sécurité saoudiens et des organisations bénévoles. Des sections séparées pour hommes et femmes existent dans la grande mosquée. Pratiquement, il est recommandé de : rester avec votre groupe lors des déplacements nocturnes, noter le nom et l'adresse de votre hôtel en arabe sur un papier, garder le numéro de votre guide à portée, éviter de porter des bijoux de valeur. En cas de perte dans la foule, les postes de sécurité du Haram disposent de personnel arabophone et francophone."
  }
];

export default function OmraFemmeSeule() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Omra Femme Seule 2027 : Règles, Conseils & Agences Sans Mahram</title>
        <meta name="description" content="Tout sur l'Omra pour femme seule en 2026 : règles actualisées, peut-on partir sans mahram, meilleures agences, conseils sécurité et prix. Guide complet et fiable." />
        <meta name="keywords" content="omra femme seule, omra sans mahram, omra femme 2026, omra pour femme seule france, omra groupe femmes, omra sans mahram 2026, règle omra femme" />
        <link rel="canonical" href="https://omrabonsplans.fr/omra-femme-seule" />
        <meta property="og:title" content="Omra Femme Seule 2027 : Guide Complet Sans Mahram" />
        <meta property="og:description" content="Peut-on faire l'Omra sans mahram en 2026 ? Oui ! Découvrez les règles, les meilleures agences et tous nos conseils pour une Omra sereine en tant que femme seule." />
        <meta property="og:url" content="https://omrabonsplans.fr/omra-femme-seule" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/hero-kaaba-optimized.webp" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Omra Femme Seule 2027 : Guide Complet, Règles et Conseils",
          "url": "https://omrabonsplans.fr/omra-femme-seule",
          "datePublished": "2026-01-20",
          "dateModified": "2026-08-16",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie", "jobTitle": "Expert en pèlerinage islamique" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "logo": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/logo.svg" } },
          "image": "https://omrabonsplans.fr/hero-kaaba-optimized.webp"
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
      </Helmet>

      <SEOBreadcrumb items={[
        { name: 'Accueil', url: '/' },
        { name: 'Omra 2026', url: '/omra' },
        { name: 'Omra Femme Seule', url: '/omra-femme-seule' }
      ]} />

      <article className="max-w-4xl mx-auto px-4 py-8">

        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-rose-500 text-white">Guide Femmes</Badge>
            <Badge variant="outline">Règles 2026 actualisées</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Omra Femme Seule en 2026 : Tout Ce Qu'il Faut Savoir
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Depuis la réforme saoudienne de 2021, la loi saoudienne n'exige plus de <strong>mahram</strong>
            (tuteur masculin) pour accomplir l'Omra. Les femmes de tout âge peuvent voyager en groupe organisé.
            Cependant, d'un point de vue religieux, le mahram reste obligatoire selon la majorité des savants.
            Voici le guide complet et actualisé pour 2026.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link to="/">Voir les offres Omra pour femmes →</Link>
          </Button>
        </header>

        {/* Règles actuelles */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">📋 Règles concernant le mahram en 2026</h2>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">⚖️</span>
                <div>
                  <h3 className="font-bold text-green-800 mb-2">Loi saoudienne : le mahram n'est plus exigé</h3>
                  <p className="text-green-700 text-sm">
                    Depuis août 2021, l'Arabie Saoudite a officiellement levé l'obligation légale de mahram pour l'Omra et le Hajj.
                    Les femmes de tout âge peuvent désormais voyager pour accomplir l'Omra,
                    à condition de passer par une <strong>agence agréée</strong> avec un groupe organisé.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50 mt-4">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🕌</span>
                <div>
                  <h3 className="font-bold text-amber-800 mb-2">Point de vue religieux : le mahram reste obligatoire</h3>
                  <p className="text-amber-700 text-sm">
                    D'un point de vue religieux, la majorité des savants considèrent que le mahram (mari, père, frère, oncle paternel, fils majeur)
                    reste <strong>obligatoire</strong> pour le voyage de la femme. Il est recommandé de consulter
                    votre référent religieux avant de prendre une décision.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 space-y-3">
            <h3 className="font-semibold text-lg">Conditions à respecter :</h3>
            <ul className="space-y-2">
              {[
                "Voyager avec un groupe organisé par une agence agréée par le Ministère du Hajj saoudien",
                "Rester avec le groupe lors des déplacements officiels (Masjid al-Haram, Médine)",
                "Avoir un passeport ou une carte nationale d'identité en cours de validité",
                "Être âgée de 18 ans minimum (pour les mineures, l'accord parental est requis)",
                "Suivre les règles vestimentaires islamiques (hijab, vêtements couvrants)"
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Groupes femmes */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">👩 Groupes spéciaux pour femmes seules</h2>
          <p className="text-muted-foreground mb-4">
            Plusieurs agences françaises ont développé des offres adaptées aux femmes voyageant seules.
            Ces groupes offrent un accompagnement renforcé et une atmosphère de sœurs dans la foi.
          </p>
          <div className="space-y-4">
            {[
              {
                type: "Groupe 100% féminin",
                desc: "Groupe exclusivement composé de femmes, accompagné par une accompagnatrice. Idéal pour celles qui préfèrent un cadre exclusivement féminin. Disponible chez certaines agences sur demande.",
                avantages: ["Ambiance fraternelle entre sœurs", "Guide accompagnatrice femme", "Programme adapté"],
                inconvenients: ["Moins fréquent, dates limitées", "Parfois légèrement plus cher"]
              },
              {
                type: "Groupe mixte avec accompagnatrice",
                desc: "Groupe mixte (hommes et femmes) avec une accompagnatrice dédiée aux femmes voyageant seules. Le choix le plus courant et le plus accessible.",
                avantages: ["Plus de dates disponibles", "Tarifs standard", "Sécurité en groupe"],
                inconvenients: ["Groupe plus grand", "Programme partagé avec hommes"]
              }
            ].map(item => (
              <Card key={item.type}>
                <CardHeader><CardTitle className="text-base">{item.type}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-semibold text-green-600 mb-1">Avantages</div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {item.avantages.map(a => <li key={a}>✓ {a}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-amber-600 mb-1">Points de vigilance</div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {item.inconvenients.map(a => <li key={a}>• {a}</li>)}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Agences recommandées */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🏢 Agences françaises recommandées pour femmes seules</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { name: "Tawaf", note: "Groupes femmes disponibles", rating: "4.8/5" },
              { name: "Medinvoyages", note: "Accompagnatrices dédiées", rating: "4.7/5" },
              { name: "Pelerinhajj", note: "Spécialiste accompagnement féminin", rating: "4.6/5" },
              { name: "Al Maqam", note: "Groupes mixtes sécurisés", rating: "4.6/5" },
              { name: "Omra Pour Tous", note: "Idéal pour voyageuses seules", rating: "4.6/5" },
              { name: "Sabil Voyages", note: "Petits groupes, suivi personnalisé", rating: "4.7/5" }
            ].map(a => (
              <div key={a.name} className="border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-sm">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.note}</div>
                </div>
                <Badge variant="secondary" className="text-xs">⭐ {a.rating}</Badge>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/comparatif-agences">Comparer toutes les agences →</Link>
          </Button>
        </section>

        {/* Conseils pratiques */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">💡 Conseils pratiques pour une Omra sereine en tant que femme</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Avant le départ</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Informez un proche de votre itinéraire</li>
                <li>✓ Prenez le numéro de votre guide et de votre agence</li>
                <li>✓ Préparez vos vêtements : robe/abaya ample, hijab, chaussures confortables</li>
                <li>✓ Évitez les bijoux voyants</li>
                <li>✓ Emportez une petite pharmacie personnelle</li>
                <li>✓ Téléchargez les plans du Haram en mode hors-ligne</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Sur place</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Restez toujours avec votre groupe lors des déplacements</li>
                <li>✓ Notez le nom et l'adresse de votre hôtel en arabe</li>
                <li>✓ Évitez de sortir seule après 22h</li>
                <li>✓ En cas de perte : rejoignez un poste de sécurité du Haram</li>
                <li>✓ Gardez une copie de votre passeport dans votre chambre</li>
                <li>✓ Ayez toujours de la monnaie saoudienne (SAR) sur vous</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tenue */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">👗 Tenue vestimentaire pour l'Omra (femme)</h2>
          <div className="space-y-3">
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-2">Pendant l'Omra (tenue d'ihram pour femme)</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Contrairement aux hommes, les femmes n'ont pas de tenue d'ihram spécifique obligatoire.
                  Elles doivent porter des vêtements islamiques couvrants qui ne ressemblent pas à une tenue de deuil.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Vêtements couvrants (tout sauf le visage et les mains)</li>
                  <li>✓ Hijab obligatoire</li>
                  <li>✓ Pas de niqab obligatoire (mais autorisé)</li>
                  <li>✓ Couleurs sobres recommandées (blanc, noir, gris, marron)</li>
                  <li>⚠ Pas de parfum sur les vêtements pendant l'état d'ihram</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">❓ Questions fréquentes : Omra femme seule</h2>
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

        {/* Visa et documents */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">📄 Visa et documents nécessaires pour une femme seule</h2>
          <p className="text-muted-foreground mb-4">
            Depuis 2019, les ressortissantes françaises peuvent obtenir un visa Omra électronique (e-visa) sans passer par une agence.
            Cependant, dans la pratique, les agences agréées incluent généralement le visa dans leur package.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border border-border p-3 text-left">Document</th>
                  <th className="border border-border p-3 text-left">Obligatoire ?</th>
                  <th className="border border-border p-3 text-left">Remarque</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Passeport français valide", "Oui", "Valide au moins 6 mois après le retour"],
                  ["Visa Omra (e-visa)", "Oui", "Inclus dans la plupart des packages agence"],
                  ["Acte de mahram", "Non (depuis 2021)", "Plus requis par la loi saoudienne"],
                  ["Acte de mariage / naissance", "Non", "Plus exigé aux frontières"],
                  ["Certificat vaccin méningite ACYW", "Oui", "Obligatoire — à faire avant départ"],
                  ["Assurance voyage", "Recommandée", "Couvre rapatriement, frais médicaux"],
                ].map(([doc, obligatoire, remarque], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="border border-border p-3 font-medium">{doc}</td>
                    <td className="border border-border p-3">
                      <span className={obligatoire === "Oui" ? "text-green-600 font-semibold" : obligatoire.startsWith("Non") ? "text-amber-600" : "text-muted-foreground"}>
                        {obligatoire}
                      </span>
                    </td>
                    <td className="border border-border p-3 text-muted-foreground">{remarque}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Source : Ministère saoudien du Hajj et de l'Omra — réforme de 2021. Vérifiez les conditions actualisées auprès de votre agence.
          </p>
        </section>

        {/* Prix détaillé */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">💰 Prix Omra pour femme seule en 2026 : tableau détaillé</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border border-border p-3 text-left">Période</th>
                  <th className="border border-border p-3 text-left">Chambre partagée</th>
                  <th className="border border-border p-3 text-left">Chambre double</th>
                  <th className="border border-border p-3 text-left">Chambre individuelle</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Hors saison (sept-nov)", "850 – 1 100€", "950 – 1 300€", "1 200 – 1 700€"],
                  ["Hiver (janv-fév)", "900 – 1 200€", "1 000 – 1 400€", "1 300 – 1 800€"],
                  ["Vacances scolaires", "1 100 – 1 500€", "1 300 – 1 800€", "1 600 – 2 200€"],
                  ["Ramadan 2027", "1 600 – 2 500€", "1 900 – 3 000€", "2 500 – 4 500€"],
                ].map(([periode, partage, double_, individuelle], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="border border-border p-3 font-medium">{periode}</td>
                    <td className="border border-border p-3 text-green-700 font-semibold">{partage}</td>
                    <td className="border border-border p-3 text-amber-700">{double_}</td>
                    <td className="border border-border p-3 text-muted-foreground">{individuelle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Prix par personne depuis Paris, hôtel 3★, vols inclus. La chambre partagée avec d'autres femmes du groupe est l'option la plus économique.</p>
        </section>

        {/* Bagages spécifiques femme */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🧳 Liste de bagages spécifique pour une femme en Omra</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Vêtements obligatoires</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ 2-3 abayas ou robes longues amples (couleurs sobres)</li>
                <li>✓ 3-4 hijabs (coton léger recommandé)</li>
                <li>✓ Sous-vêtements respirants</li>
                <li>✓ Chaussettes pour les prières</li>
                <li>✓ Chaussures confortables à enfiler/enlever facilement</li>
                <li>✓ Vêtements de nuit couvrants</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Indispensables sur place</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Crème solaire SPF50+ (chaleur intense)</li>
                <li>✓ Brumisateur (utile autour du Haram)</li>
                <li>✓ Médicaments habituels + anti-douleur</li>
                <li>✓ Serviettes hygiéniques (disponibles sur place)</li>
                <li>✓ Coran numérique ou petit Coran de poche</li>
                <li>✓ Carnet et stylo (dou'as, notes spirituelles)</li>
                <li>✓ Batterie externe pour téléphone</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <strong>⚠ À ne pas emporter :</strong> parfum pendant l'état d'ihram, bijoux voyants, valise trop lourde (vous marcherez beaucoup).
          </div>
        </section>

        {/* L'avis de l'expert */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🎙️ L'avis de l'expert : Farid d'Arabie</h2>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">F</div>
                <div>
                  <p className="text-sm font-semibold text-primary mb-1">Farid d'Arabie — Expert pèlerinage</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "Au fil des années, j'ai accompagné des centaines de femmes en Omra — des mères de famille, des retraitées, des jeunes femmes. La réforme de 2021 a changé les choses légalement, mais sur le terrain, ce qui fait la différence c'est le choix de l'agence et la qualité de l'accompagnement. Une bonne agence avec une accompagnatrice compétente vaut mille fois mieux qu'un groupe anonyme. Mon conseil : demandez systématiquement si un guide ou une accompagnatrice sera présent(e) lors des rites, pas seulement à l'aéroport. Et partez avec une copie de tous vos documents sur vous — pas seulement dans votre valise."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="bg-rose-50 border border-rose-200 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Trouvez votre offre Omra pour femme</h2>
          <p className="text-muted-foreground mb-6">
            Comparez les offres de 20+ agences agréées proposant des groupes adaptés aux femmes voyageant seules.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg"><Link to="/">Comparer les offres →</Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/comparatif-agences">Comparer les agences</Link></Button>
          </div>
        </section>

        <nav className="mt-10 pt-6 border-t" aria-label="Pages associées">
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Pages associées</h3>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="text-primary hover:underline text-sm">Comparateur Omra 2026</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/prix-omra-2026" className="text-primary hover:underline text-sm">Prix Omra 2026</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/omra-ramadan-2027" className="text-primary hover:underline text-sm">Omra Ramadan</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/guide-omra-pas-chere" className="text-primary hover:underline text-sm">Guide Omra Pas Chère</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/visa-omra-france" className="text-primary hover:underline text-sm">Visa Omra 2026</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/blog/general/omra-sans-mahram-pour-femme-seule-en-2026-guide-complet" className="text-primary hover:underline text-sm">Omra sans Mahram : Guide détaillé</Link>
          </div>
        </nav>
      </article>
    </ResponsiveLayout>
  );
}