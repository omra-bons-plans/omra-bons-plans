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
    question: "Quel visa faut-il pour faire l'Omra depuis la France ?",
    answer: "Pour l'Omra depuis la France, il vous faut un visa Omra (le plus courant, inclus dans les forfaits agences) ou un visa touristique saoudien (eVisa). Le visa Omra est spécifiquement pour le pèlerinage, tandis que le visa touristique permet de visiter l'Arabie Saoudite et d'effectuer l'Omra."
  },
  {
    question: "Combien coûte le visa Omra en 2027 ?",
    answer: "Le visa Omra est généralement inclus dans le prix du forfait agence (sa valeur est de 35 à 60€). Si vous faites une Omra via visa touristique (eVisa), celui-ci coûte environ 130 à 150€ et inclut une assurance obligatoire."
  },
  {
    question: "Combien de temps prend l'obtention d'un visa Omra ?",
    answer: "Via une agence agréée, le visa Omra est généralement obtenu en 3 à 7 jours ouvrables avant le départ. Le visa touristique saoudien (eVisa) est obtenu en 24 à 72 heures via le site officiel visa.visitsaudi.com."
  },
  {
    question: "Peut-on faire l'Omra avec un visa touristique ?",
    answer: "Oui, depuis 2019, les ressortissants français peuvent faire l'Omra avec un visa touristique saoudien. L'avantage est de pouvoir organiser son voyage librement. L'inconvénient est que vous ne bénéficiez pas du suivi et de l'accompagnement d'une agence agréée."
  },
  {
    question: "Y a-t-il des restrictions pour le visa Omra en 2027 ?",
    answer: "Le visa Omra standard permet généralement une entrée en Arabie Saoudite pendant une durée de 30 jours. Il est limité aux villes saintes (La Mecque, Médine). Pour visiter d'autres régions d'Arabie Saoudite, un visa touristique est préférable."
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
    let s = document.querySelector('script[data-visa-faq]') as HTMLScriptElement;
    if (!s) {
      s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-visa-faq', 'true');
      document.head.appendChild(s);
    }
    s.textContent = JSON.stringify(schema);
    return () => { document.querySelector('script[data-visa-faq]')?.remove(); };
  }, [faqs]);
  return null;
}

export default function VisaOmra() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Visa Omra France 2027 : Types, Prix, Démarches & eVisa Saoudien</title>
        <meta name="description" content="Tout sur le visa Omra depuis la France en 2027 : visa Omra agence vs eVisa touristique, prix, délais, documents requis. Guide complet et actualisé." />
        <meta name="keywords" content="visa omra, visa omra france 2027, evisa arabie saoudite, visa touristique omra, demande visa omra, visa omra prix, visa omra délai" />
        <link rel="canonical" href="https://omrabonsplans.fr/visa-omra-france" />
        <meta property="og:title" content="Visa Omra France 2027 : Guide Complet des Démarches" />
        <meta property="og:description" content="Comment obtenir votre visa Omra depuis la France ? Types de visas, prix, délais, documents nécessaires. Tout ce qu'il faut savoir pour 2027." />
        <meta property="og:url" content="https://omrabonsplans.fr/visa-omra-france" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/hero-kaaba-optimized.webp" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Visa Omra France 2027 : Types, Prix et Démarches",
          "url": "https://omrabonsplans.fr/visa-omra-france",
          "datePublished": "2026-01-25",
          "dateModified": "2026-11-24",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie", "jobTitle": "Expert en pèlerinage islamique" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "logo": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/logo.svg" } },
          "image": "https://omrabonsplans.fr/hero-kaaba-optimized.webp"
        })}</script>
      </Helmet>
      <FAQSchema faqs={faqs} />

      <SEOBreadcrumb items={[
        { name: 'Accueil', url: '/' },
        { name: 'Omra 2027', url: '/omra' },
        { name: 'Visa Omra France', url: '/visa-omra-france' }
      ]} />

      <article className="max-w-4xl mx-auto px-4 py-8">

        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-blue-600 text-white">Mis à jour 2027</Badge>
            <Badge variant="outline">Procédure officielle</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Visa Omra depuis la France en 2027 : Guide Complet des Démarches
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Pour accomplir l'Omra, les ressortissants français doivent obtenir un <strong>visa saoudien</strong>.
            Il en existe deux types : le <strong>visa Omra</strong> (via une agence agréée) et
            le <strong>visa touristique eVisa</strong> (individuel). Ce guide vous explique tout
            pour 2027 : types de visas, prix, délais et documents nécessaires.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link to="/">Trouver une agence avec visa inclus →</Link>
          </Button>
        </header>

        {/* Comparaison visas */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🔍 Visa Omra vs eVisa Touristique : Comparatif 2027</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border border-border p-3 text-left">Critère</th>
                  <th className="border border-border p-3 text-left">Visa Omra (via agence)</th>
                  <th className="border border-border p-3 text-left">eVisa Touristique</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Prix", "Inclus dans le forfait (~35-60€)", "~130-150€ (assurance incluse)"],
                  ["Délai", "3 à 7 jours ouvrables", "24 à 72 heures"],
                  ["Validité", "30 jours (entrée unique)", "365 jours (entrées multiples)"],
                  ["Accès La Mecque", "✅ Autorisé", "✅ Autorisé"],
                  ["Accès Médine", "✅ Autorisé", "✅ Autorisé"],
                  ["Accès autres villes", "❌ Limité", "✅ Oui (Riyadh, Djeddah…)"],
                  ["Organisation", "Agence s'occupe de tout", "Vous gérez vous-même"],
                  ["Recommandé pour", "Premier voyage, groupe", "Voyageurs expérimentés"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-border p-3">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Visa Omra via agence */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">🏢 Option 1 : Visa Omra via une agence agréée (recommandé)</h2>
          <p className="text-muted-foreground mb-4">
            La grande majorité des pèlerins français optent pour cette solution : l'agence de voyage
            se charge de toutes les formalités de visa. C'est la solution la plus simple et la plus sécurisée.
          </p>
          <h3 className="font-semibold mb-3">Documents requis par l'agence :</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">Documents obligatoires</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Passeport valide 6 mois après le retour</li>
                  <li>✓ 2 photos d'identité récentes (fond blanc)</li>
                  <li>✓ Acte de mariage (pour les couples)</li>
                  <li>✓ Certificat de vaccination méningite ACYW135</li>
                  <li>✓ Formulaire de demande (fourni par l'agence)</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Selon votre situation</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Pour femme seule : passeport suffit (depuis 2021)</li>
                  <li>✓ Pour enfant : acte de naissance + autorisation parentale</li>
                  <li>✓ Pour converti(e) : certificat de conversion ou shahada</li>
                  <li>✓ Pour nationalisé(e) : carte de nationalité française</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* eVisa */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">💻 Option 2 : eVisa Touristique Saoudien (individuel)</h2>
          <p className="text-muted-foreground mb-4">
            Depuis 2019, les Français peuvent obtenir un visa touristique saoudien en ligne (eVisa),
            qui permet également de faire l'Omra. Idéal pour ceux qui souhaitent organiser leur voyage librement.
          </p>
          <div className="space-y-3">
            <h3 className="font-semibold">Procédure étape par étape :</h3>
            <ol className="space-y-3">
              {[
                { step: "1", title: "Rendez-vous sur le site officiel", text: "Accédez à visa.visitsaudi.com (site officiel du gouvernement saoudien). Choisissez 'Tourist Visa' et 'Apply Now'." },
                { step: "2", title: "Remplissez le formulaire", text: "Données personnelles, numéro de passeport, adresse en Arabie Saoudite (celle de votre hôtel). Durée du séjour souhaitée." },
                { step: "3", title: "Payez en ligne", text: "Paiement par carte bancaire d'environ 130-150€ (inclut une assurance médicale obligatoire valable 1 an)." },
                { step: "4", title: "Recevez votre visa par e-mail", text: "Le visa électronique est envoyé par e-mail en 24 à 72 heures. Imprimez-le ou gardez-le sur votre téléphone." }
              ].map(item => (
                <li key={item.step} className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">{item.step}</span>
                  <div>
                    <strong className="block text-sm mb-1">{item.title}</strong>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Vaccins */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">💉 Vaccinations obligatoires pour l'Omra 2027</h2>
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-4">
              <h3 className="font-semibold text-amber-800 mb-2">Vaccin méningite ACYW135 : OBLIGATOIRE</h3>
              <p className="text-sm text-amber-700 mb-3">
                La vaccination contre la méningite à méningocoque (vaccin tétravalent ACYW135 ou MenACWY)
                est <strong>obligatoire</strong> pour entrer en Arabie Saoudite pour l'Omra.
                Elle doit être administrée au minimum <strong>10 jours avant le départ</strong>.
              </p>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>✓ Validité : 3 à 5 ans selon le vaccin (Menveo, Nimenrix, Menactra)</li>
                <li>✓ Disponible en pharmacie sur ordonnance ou chez votre médecin</li>
                <li>✓ Prix : 50 à 80€ (partiellement remboursé par certaines mutuelles)</li>
                <li>✓ Certificat de vaccination à apporter impérativement</li>
              </ul>
            </CardContent>
          </Card>
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-sm mb-2">Vaccinations recommandées</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Hépatite A et B</li>
                  <li>• Typhoïde</li>
                  <li>• Grippe saisonnière</li>
                  <li>• COVID-19 (selon recommandations en vigueur)</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-sm mb-2">Conseil médical</h3>
                <p className="text-xs text-muted-foreground">
                  Consultez votre médecin ou un centre de vaccination internationale (certains aéroports proposent ce service) au moins 4 semaines avant votre départ.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">❓ Questions fréquentes sur le visa Omra</h2>
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
          <h2 className="text-2xl font-bold mb-3">Réservez avec visa inclus</h2>
          <p className="text-muted-foreground mb-6">
            La solution la plus simple : réservez un forfait Omra tout compris avec visa inclus.
            L'agence s'occupe de tout. Comparez 15+ agences françaises agréées.
          </p>
          <Button asChild size="lg"><Link to="/">Comparer les offres avec visa inclus →</Link></Button>
        </section>

        <section className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">F</div>
            <div>
              <p className="font-bold text-foreground">Farid d'Arabie</p>
              <p className="text-sm text-primary mb-3">Expert en pèlerinage islamique · +10 ans à La Mecque · +5 000 pèlerins accompagnés</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                "Le visa Omra est aujourd'hui très simple à obtenir via les agences agréées — c'est un e-Visa traité en quelques jours. <strong>Le point que les pèlerins oublient le plus souvent : le vaccin méningocoque ACWY est obligatoire</strong>, et certains centres de vaccination ont des délais. Faites-le dès que vous réservez. L'autre erreur courante : un passeport valide moins de 6 mois après la date de retour — vérifiez cela avant d'envoyer vos documents à l'agence."
              </p>
            </div>
          </div>
        </section>

        <nav className="mt-10 pt-6 border-t" aria-label="Pages associées">
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Pages associées</h3>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="text-primary hover:underline text-sm">Comparateur Omra 2027</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/prix-omra-2027" className="text-primary hover:underline text-sm">Prix Omra 2027</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/omra-ramadan-2027" className="text-primary hover:underline text-sm">Omra Ramadan 2027</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/guide-omra-pas-chere" className="text-primary hover:underline text-sm">Guide Omra Pas Chère</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/omra-femme-seule" className="text-primary hover:underline text-sm">Omra Femme Seule</Link>
          </div>
        </nav>
      </article>
    </ResponsiveLayout>
  );
}