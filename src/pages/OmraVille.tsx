import { Helmet } from 'react-helmet-async';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const villesData: Record<string, {
  nom: string; dep: string; aeroport: string; volDuree: string;
  prixSupplement: string; agences: string[]; popOmra: string;
  specificite: string; supplement: string;
}> = {
  paris: {
    nom: "Paris", dep: "Paris (CDG / Orly)", aeroport: "Charles de Gaulle (CDG) ou Orly (ORY)",
    volDuree: "6h30 à 8h", prixSupplement: "Prix de référence (le moins cher)",
    agences: ["Tawaf", "Medinvoyages", "Al Maqam", "Pelerinhajj", "Omra Sounnah", "Omra Pour Tous"],
    popOmra: "Paris est la ville avec le plus grand nombre d'offres Omra en France. Le choix d'agences y est maximal et les prix sont les plus compétitifs.",
    specificite: "Plus grand choix d'agences (15+). Vols directs fréquents vers Djeddah et Médine. Départs quasi quotidiens en haute saison.",
    supplement: "Prix de référence — aucun supplément"
  },
  lyon: {
    nom: "Lyon", dep: "Lyon (LYS)", aeroport: "Lyon-Saint Exupéry (LYS)",
    volDuree: "7h à 9h (souvent via Paris ou Djeddah)",
    prixSupplement: "+50 à +150€ par rapport à Paris",
    agences: ["Tawaf", "Medinvoyages", "Omra Pour Tous", "Al Maqam"],
    popOmra: "Lyon est la deuxième ville française en termes d'offres Omra. Plusieurs agences lyonnaises proposent des départs directs depuis Saint-Exupéry.",
    specificite: "Vols directs saisonniers vers Djeddah. Communauté musulmane importante. Agences locales en développement.",
    supplement: "+50 à +150€ selon les périodes"
  },
  marseille: {
    nom: "Marseille", dep: "Marseille (MRS)", aeroport: "Marseille Provence (MRS)",
    volDuree: "6h30 à 8h30",
    prixSupplement: "+30 à +100€ par rapport à Paris",
    agences: ["Tawaf", "Omra Sounnah", "Medinvoyages", "Omra Pour Tous"],
    popOmra: "Marseille a l'une des plus grandes communautés musulmanes de France. L'offre de voyages Omra y est conséquente avec plusieurs agences locales.",
    specificite: "Forte demande locale. Quelques vols charter directs en saison. Agences locales spécialisées.",
    supplement: "+30 à +100€ selon disponibilités"
  },
  toulouse: {
    nom: "Toulouse", dep: "Toulouse (TLS)", aeroport: "Toulouse-Blagnac (TLS)",
    volDuree: "7h à 9h30 (souvent via Paris ou Casablanca)",
    prixSupplement: "+80 à +200€ par rapport à Paris",
    agences: ["Tawaf", "Medinvoyages", "Al Maqam"],
    popOmra: "Toulouse dispose de nombreux pèlerins mais les vols directs sont plus rares. La plupart des départs se font via Paris ou Casablanca.",
    specificite: "Vols principalement via Paris CDG. Communauté en croissance. Quelques offres locales disponibles.",
    supplement: "+80 à +200€ en général"
  },
  nice: {
    nom: "Nice", dep: "Nice (NCE)", aeroport: "Nice Côte d'Azur (NCE)",
    volDuree: "7h à 9h",
    prixSupplement: "+100 à +300€ par rapport à Paris",
    agences: ["Tawaf", "Medinvoyages"],
    popOmra: "Nice et la Côte d'Azur ont une communauté musulmane active. La plupart des pèlerins de la région rejoignent Paris ou voyagent via Casablanca.",
    specificite: "Peu de vols directs. Souvent via Paris ou Casablanca. Moins d'agences locales.",
    supplement: "+100 à +300€ selon options"
  },
  bordeaux: {
    nom: "Bordeaux", dep: "Bordeaux (BOD)", aeroport: "Bordeaux-Mérignac (BOD)",
    volDuree: "7h30 à 10h (via Paris ou Casablanca)",
    prixSupplement: "+100 à +250€ par rapport à Paris",
    agences: ["Tawaf", "Omra Pour Tous", "Medinvoyages"],
    popOmra: "Bordeaux voit une croissance de sa communauté musulmane et de la demande pour l'Omra. Les pèlerins partent principalement via Paris.",
    specificite: "Vols principalement via Paris. Offres en développement. Moins d'options directs.",
    supplement: "+100 à +250€ en moyenne"
  },
  strasbourg: {
    nom: "Strasbourg", dep: "Strasbourg (SXB)", aeroport: "Strasbourg Entzheim (SXB)",
    volDuree: "8h à 10h (via Paris ou Francfort)",
    prixSupplement: "+80 à +200€ par rapport à Paris",
    agences: ["Tawaf", "Medinvoyages", "Al Maqam"],
    popOmra: "Strasbourg et l'Alsace ont une communauté musulmane importante, notamment d'origine turque et maghrébine. Des groupes partent régulièrement.",
    specificite: "Accès à Francfort également. Vols via Paris principalement. Communauté diverse.",
    supplement: "+80 à +200€ selon saison"
  },
  lille: {
    nom: "Lille", dep: "Lille (LIL)", aeroport: "Lille-Lesquin (LIL)",
    volDuree: "8h à 10h (via Paris)",
    prixSupplement: "+80 à +200€ par rapport à Paris",
    agences: ["Tawaf", "Omra Sounnah", "Medinvoyages"],
    popOmra: "Lille et le Nord de la France comptent de nombreux pèlerins. La proximité avec Paris facilite l'accès aux vols directs.",
    specificite: "Très proche de Paris (1h en TGV). Souvent plus avantageux de partir de Paris CDG.",
    supplement: "+80 à +200€ (ou partir de CDG)"
  }
};

function FAQSchema({ ville, faqs }: { ville: string; faqs: { question: string; answer: string }[] }) {
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
    const key = `script[data-ville-faq-${ville}]`;
    let s = document.querySelector(key) as HTMLScriptElement;
    if (!s) {
      s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute(`data-ville-faq-${ville}`, 'true');
      document.head.appendChild(s);
    }
    s.textContent = JSON.stringify(schema);
    return () => { document.querySelector(key)?.remove(); };
  }, [ville, faqs]);
  return null;
}

export default function OmraVille() {
  const { ville } = useParams<{ ville: string }>();
  const data = ville ? villesData[ville.toLowerCase()] : null;

  if (!data) return <Navigate to="/" replace />;

  const faqs = [
    {
      question: `Quelle est la meilleure agence Omra depuis ${data.nom} ?`,
      answer: `Les meilleures agences proposant des départs depuis ${data.nom} sont : ${data.agences.join(", ")}. Comparez leurs offres sur notre comparateur pour trouver les meilleurs prix.`
    },
    {
      question: `Quel est le prix d'une Omra depuis ${data.nom} en 2026 ?`,
      answer: `Le prix d'une Omra depuis ${data.nom} varie de 900€ à 3 000€+ selon la période et la formule. ${data.supplement}. Utilisez notre comparateur pour les tarifs en temps réel.`
    },
    {
      question: `Combien de temps dure le vol de ${data.nom} vers La Mecque ?`,
      answer: `Le vol depuis ${data.nom} vers Djeddah (puis transfert vers La Mecque) dure environ ${data.volDuree}. Certains vols sont directs, d'autres transitent par Paris ou Casablanca.`
    },
    {
      question: `Peut-on trouver des offres Omra pas chères au départ de ${data.nom} ?`,
      answer: `Oui, des offres économiques sont disponibles au départ de ${data.nom}, surtout hors vacances scolaires et hors Ramadan. Le prix de base commence à partir de 900-1 100€ pour un séjour de 10 nuits.`
    }
  ];

  const slug = ville!.toLowerCase();

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Omra depuis {data.nom} 2026 : Prix, Offres & Agences Agréées</title>
        <meta name="description" content={`Comparez les meilleures offres Omra 2026 au départ de ${data.nom}. Prix à partir de 900€, agences agréées, vols depuis ${data.aeroport}. Guide complet.`} />
        <meta name="keywords" content={`omra depuis ${data.nom.toLowerCase()}, omra ${data.nom.toLowerCase()} 2026, départ omra ${data.nom.toLowerCase()}, agence omra ${data.nom.toLowerCase()}, prix omra ${data.nom.toLowerCase()}`} />
        <link rel="canonical" href={`https://omrabonsplans.fr/omra-depuis-${slug}`} />
        <meta property="og:title" content={`Omra depuis ${data.nom} 2026 : Prix et Offres`} />
        <meta property="og:description" content={`Offres Omra 2026 au départ de ${data.nom}. ${data.prixSupplement}. Agences agréées, vols depuis ${data.aeroport}.`} />
        <meta property="og:url" content={`https://omrabonsplans.fr/omra-depuis-${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/hero-kaaba-optimized.webp" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `Omra depuis ${data.nom} 2026 : Guide et Offres`,
          "url": `https://omrabonsplans.fr/omra-depuis-${slug}`,
          "datePublished": "2026-02-01",
          "dateModified": "2026-04-01",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "logo": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/logo.svg" } }
        })}</script>
      </Helmet>
      <FAQSchema ville={slug} faqs={faqs} />

      <SEOBreadcrumb items={[
        { name: 'Accueil', url: '/' },
        { name: 'Omra 2026', url: '/omra' },
        { name: `Omra depuis ${data.nom}`, url: `/omra-depuis-${slug}` }
      ]} />

      <article className="max-w-4xl mx-auto px-4 py-8">

        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>Départ {data.nom}</Badge>
            <Badge variant="outline">{data.prixSupplement}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Omra depuis {data.nom} en 2026 : Offres, Prix et Agences Agréées
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Vous êtes à {data.nom} et souhaitez partir en Omra en 2026 ?
            Découvrez toutes les offres disponibles au départ de <strong>{data.dep}</strong>,
            les meilleures agences françaises agréées, les prix et conseils pratiques pour organiser
            votre pèlerinage depuis {data.nom}.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link to="/">Voir les offres disponibles →</Link>
          </Button>
        </header>

        {/* Infos pratiques */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">✈️ Infos pratiques : Omra depuis {data.nom}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Informations de vol</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div><strong>Aéroport de départ :</strong> {data.aeroport}</div>
                <div><strong>Durée du vol :</strong> {data.volDuree}</div>
                <div><strong>Destination :</strong> Djeddah (JED) ou Médine (MED)</div>
                <div><strong>Compagnies :</strong> Air France, Saudia, Transavia, Turkish Airlines</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Tarifs indicatifs 2026</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div><strong>Hors saison (3★) :</strong> 900€ – 1 400€</div>
                <div><strong>Haute saison (3★) :</strong> 1 300€ – 1 900€</div>
                <div><strong>Ramadan (3★) :</strong> 1 900€ – 3 000€</div>
                <div><strong>Supplément vs Paris :</strong> {data.prixSupplement}</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Spécificités */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🏙️ Omra depuis {data.nom} : Ce qu'il faut savoir</h2>
          <p className="text-muted-foreground mb-4">{data.popOmra}</p>
          <div className="border-l-4 border-primary pl-4">
            <p className="text-sm text-muted-foreground">{data.specificite}</p>
          </div>
        </section>

        {/* Agences */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🏢 Agences Omra proposant des départs depuis {data.nom}</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {data.agences.map(agence => (
              <div key={agence} className="border rounded-lg p-3 flex justify-between items-center">
                <div className="font-semibold text-sm">{agence}</div>
                <Badge variant="secondary" className="text-xs">Agréée</Badge>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/agences-liste">Voir toutes les agences →</Link>
          </Button>
        </section>

        {/* Prix par saison */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">💰 Prix Omra depuis {data.nom} selon la période</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border border-border p-3 text-left">Période</th>
                  <th className="border border-border p-3 text-left">Formule Eco (3★)</th>
                  <th className="border border-border p-3 text-left">Formule Confort (4★)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Automne (sept-nov)", "900 – 1 300€", "1 300 – 1 800€"],
                  ["Hiver (janv-fév)", "950 – 1 300€", "1 400 – 1 900€"],
                  ["Ramadan 2026", "1 900 – 2 800€", "2 800 – 4 000€"],
                  ["Printemps (avr-mai)", "1 000 – 1 400€", "1 500 – 2 000€"],
                  ["Vacances scolaires", "1 300 – 1 800€", "1 800 – 2 500€"],
                ].map(([period, eco, confort], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="border border-border p-3 font-medium">{period}</td>
                    <td className="border border-border p-3 text-green-700">{eco}</td>
                    <td className="border border-border p-3 text-amber-700">{confort}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Prix indicatifs. {data.supplement}. Vérifiez les tarifs en temps réel sur notre comparateur.</p>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">❓ Questions fréquentes : Omra depuis {data.nom}</h2>
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
          <h2 className="text-2xl font-bold mb-3">Comparez les offres Omra depuis {data.nom}</h2>
          <p className="text-muted-foreground mb-6">
            Filtrez par ville de départ "{data.nom}" sur notre comparateur pour voir toutes les offres disponibles.
          </p>
          <Button asChild size="lg"><Link to="/">Voir les offres →</Link></Button>
        </section>

        <section className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">F</div>
            <div>
              <p className="font-bold text-foreground">Farid d'Arabie</p>
              <p className="text-sm text-primary mb-3">Expert en pèlerinage islamique · +10 ans à La Mecque · +5 000 pèlerins accompagnés</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                "Partir en Omra depuis sa ville de région est souvent possible sans transiter par Paris. <strong>Vérifiez toujours les vols en correspondance via Istanbul, Casablanca ou Dubaï</strong> — ils sont parfois moins chers et plus pratiques que les vols directs depuis Roissy. Les agences sérieuses proposent des points de regroupement en province. N'hésitez pas à demander : beaucoup de pèlerins ne savent pas que l'option régionale existe."
              </p>
            </div>
          </div>
        </section>

        <nav className="mt-10 pt-6 border-t" aria-label="Autres villes">
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Omra depuis d'autres villes</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(villesData).filter(([key]) => key !== slug).map(([key, v]) => (
              <Link key={key} to={`/omra-depuis-${key}`} className="text-primary hover:underline text-sm">
                Omra depuis {v.nom}
              </Link>
            )).reduce((acc: JSX.Element[], el, i, arr) => {
              acc.push(el);
              if (i < arr.length - 1) acc.push(<span key={`sep-${i}`} className="text-muted-foreground">·</span>);
              return acc;
            }, [])}
          </div>
        </nav>
      </article>
    </ResponsiveLayout>
  );
}
