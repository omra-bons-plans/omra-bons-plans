import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';

export default function OmraFamille() {
  const faqItems = [
    {
      q: "À quel âge un enfant peut-il faire l'Omra ?",
      a: "Il n'y a pas d'âge minimum légal pour l'Omra. Cependant, les familles amènent généralement leurs enfants à partir de 7-10 ans pour qu'ils puissent vivre l'expérience spirituellement. Les nourrissons et jeunes enfants peuvent techniquement faire l'Omra, mais les autorités saoudiennes et les agences recommandent d'attendre que l'enfant soit en mesure de supporter les foules et la chaleur."
    },
    {
      q: "Combien coûte une Omra en famille avec enfants ?",
      a: "Une Omra en famille (2 adultes + 2 enfants) coûte en moyenne entre 5 000€ et 14 000€ selon la période et le standing de l'hôtel. En dehors du Ramadan, comptez 1 200€ à 2 500€ par adulte et 800€ à 1 800€ par enfant. Les enfants de moins de 2 ans voyagent souvent gratuitement ou à tarif réduit sur les vols."
    },
    {
      q: "Quels documents faut-il pour emmener ses enfants en Omra ?",
      a: "Pour les enfants mineurs : passeport valide, visa Omra (inclus dans la plupart des forfaits), acte de naissance ou livret de famille, et en cas de voyage avec un seul parent, une autorisation de sortie du territoire signée par l'autre parent. Pour les enfants voyageant avec leurs deux parents, le livret de famille suffit généralement."
    },
    {
      q: "Peut-on faire l'Omra enceinte ?",
      a: "Il n'existe pas d'interdiction religieuse pour une femme enceinte de faire l'Omra. Cependant, les autorités saoudiennes déconseillent les voyages après le 6e mois de grossesse. Consultez votre médecin avant de partir. Certaines agences refusent les femmes enceintes à partir du 7e mois. Prévoyez une couverture médicale adaptée."
    },
    {
      q: "Quelle période choisir pour une Omra en famille ?",
      a: "La meilleure période pour une Omra en famille avec enfants est de septembre à novembre et de janvier à mars (hors Ramadan). Les températures sont plus douces (25-32°C), les foules moins denses, et les prix plus accessibles. Évitez juillet-août (45°C+) qui est difficile pour les enfants. Le Ramadan est spirituellement enrichissant mais très intense pour les plus jeunes."
    },
    {
      q: "Faut-il que les enfants soient en état de pureté pour faire l'Omra ?",
      a: "L'état de pureté (tahara) est requis pour le tawaf. Pour les nourrissons et très jeunes enfants qui ne contrôlent pas leurs besoins, les juristes islamiques ont des avis divergents. La plupart acceptent que le parent portant l'enfant puisse effectuer le tawaf tout en maintenant sa propre pureté. Consultez un imam ou un érudit islamique pour votre situation spécifique."
    }
  ];

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Omra en Famille 2026 — Guide Complet avec Enfants, Prix & Conseils</title>
        <meta name="description" content="Tout pour réussir votre Omra en famille en 2026 : prix (5 000€-14 000€ pour 4 personnes), documents enfants, meilleures périodes, conseils pratiques. Guide complet et actualisé." />
        <meta name="keywords" content="omra famille, omra avec enfants, omra famille prix, omra enfant mineur, voyage omra famille, pèlerinage famille france" />
        <link rel="canonical" href="https://omrabonsplans.fr/omra-famille" />
        <meta property="og:title" content="Omra en Famille 2026 — Guide Complet avec Enfants" />
        <meta property="og:description" content="Prix, documents, conseils : tout pour organiser votre Omra en famille avec enfants en 2026." />
        <meta property="og:url" content="https://omrabonsplans.fr/omra-famille" />
        <meta property="og:type" content="article" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Omra en Famille 2026 : Guide Complet avec Enfants",
          "description": "Comment organiser l'Omra en famille : prix, documents, conseils pratiques pour partir avec ses enfants en 2026.",
          "url": "https://omrabonsplans.fr/omra-famille",
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
        { name: 'Guides Omra', url: '/blog/general' },
        { name: 'Omra en Famille', url: '/omra-famille' }
      ]} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Omra en Famille 2026 : Guide Complet avec Enfants
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Organiser une Omra en famille est un projet magnifique mais qui demande une préparation rigoureuse. Prix, documents, meilleures périodes, conseils pratiques — voici tout ce qu'il faut savoir pour réussir ce voyage spirituel en famille en 2026.
          </p>
        </header>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 mb-8">
          <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">💡 Estimation budget famille (2 adultes + 2 enfants)</p>
          <div className="grid grid-cols-3 gap-3 text-center mt-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Économique</p>
              <p className="text-xl font-bold text-green-600">5 000€</p>
              <p className="text-xs">Hôtel 3★ · hors Ramadan</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border-2 border-amber-400">
              <p className="text-xs text-muted-foreground">Confort</p>
              <p className="text-xl font-bold text-amber-600">8 500€</p>
              <p className="text-xs">Hôtel 4★ · hors Ramadan</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Premium</p>
              <p className="text-xl font-bold text-purple-600">14 000€</p>
              <p className="text-xs">Hôtel 5★ · Ramadan</p>
            </div>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Meilleures périodes pour une Omra en famille</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { periode: 'Septembre – Novembre', note: '⭐⭐⭐⭐⭐', desc: 'Températures douces (28-33°C), foules réduites, prix accessibles. Idéal pour les familles avec jeunes enfants.', badge: 'Recommandé', color: 'green' },
              { periode: 'Janvier – Février', note: '⭐⭐⭐⭐', desc: 'Hiver saoudien, climat agréable (20-28°C). Avant le Ramadan : tarifs corrects, disponibilités bonnes.', badge: 'Très bien', color: 'blue' },
              { periode: 'Ramadan', note: '⭐⭐⭐', desc: 'Expérience spirituelle intense. Attention : foules très denses, chaleur, rythme inversé nuit/jour difficile pour les enfants.', badge: 'Intense', color: 'orange' },
              { periode: 'Juillet – Août', note: '⭐⭐', desc: 'Chaleur extrême (45-50°C). Très difficile avec des enfants. À éviter sauf si pas d\'autre choix.', badge: 'Déconseillé', color: 'red' },
            ].map((item, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{item.periode}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium bg-${item.color}-100 text-${item.color}-800`}>{item.badge}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.note}</p>
                <p className="text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Documents nécessaires pour les enfants</h2>
          <div className="space-y-3">
            {[
              { doc: 'Passeport valide', detail: 'Valide au moins 6 mois après la date de retour. Un passeport individuel est obligatoire pour chaque enfant, même nourrisson.' },
              { doc: 'Visa Omra', detail: 'Inclus dans la plupart des forfaits agence. En visa touristique, les enfants sont inclus dans la demande parentale.' },
              { doc: 'Livret de famille', detail: 'Indispensable pour prouver la filiation. Ou acte de naissance officiel si pas de livret de famille.' },
              { doc: 'Autorisation sortie territoire', detail: 'Obligatoire si l\'enfant voyage avec un seul parent. Signée par l\'autre parent devant notaire ou commissariat.' },
              { doc: 'Certificat de vaccination', detail: 'Méningite ACYW135 obligatoire (vaccin méningocoque). À faire au moins 10 jours avant le départ.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <div>
                  <p className="font-medium">{item.doc}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Conseils pratiques pour l'Omra en famille</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Choisir un hôtel proche du Haram', body: 'Avec des enfants, la proximité à la mosquée est cruciale. Un hôtel à moins de 300m évite les longues marches épuisantes pour les petits.' },
              { title: 'Prévoir des vêtements adaptés', body: 'Filles : abaya légère + hijab. Garçons : vêtements couvrants. Prévoyez plusieurs tenues — lavage quotidien ou en pension complète.' },
              { title: 'Médicaments et trousse de secours', body: 'Paracétamol, ibuprofène dosé enfants, sérum physiologique, crème solaire SPF50+, médicament anti-diarrhéique, solution réhydratation orale.' },
              { title: 'Pousette ou porte-bébé', body: 'Autorisés dans l\'enceinte de la mosquée mais le tawaf en poussette est très difficile en période de forte affluence. Privilégiez les horaires creux (après Fajr, milieu de nuit).' },
              { title: 'Préparer les enfants spirituellement', body: 'Expliquez aux enfants le sens des rites avant le départ. Ils vivront mieux l\'expérience s\'ils comprennent pourquoi ils font ce voyage.' },
              { title: 'Assurance santé complète', body: 'Incluse dans certains forfaits. Sinon, souscrivez une assurance voyage avec rapatriement sanitaire. La chaleur et les foules augmentent les risques de malaise, surtout pour les enfants.' },
            ].map((item, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2 text-primary">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Questions fréquentes — Omra en famille</h2>
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
          <h2 className="text-2xl font-bold mb-3">Comparez les offres Omra en famille</h2>
          <p className="text-muted-foreground mb-5">Utilisez notre comparateur pour trouver le meilleur prix famille parmi 20+ agences agréées</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Comparer les offres Omra
            </Link>
            <Link to="/agences-liste" className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">
              Voir les agences agréées
            </Link>
          </div>
        </section>
      </main>
    </ResponsiveLayout>
  );
}
