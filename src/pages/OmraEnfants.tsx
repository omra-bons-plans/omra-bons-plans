import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';

export default function OmraEnfants() {
  const faqItems = [
    {
      q: "Les enfants doivent-ils faire l'Omra ?",
      a: "L'Omra n'est pas obligatoire (fard) pour les enfants non encore pubères. Elle est cependant très méritoire (sunnah) et des hadiths authentiques rapportent que le Prophète Muhammad (ﷺ) encourageait les parents à emmener leurs enfants en pèlerinage. Si un enfant accomplit l'Omra avant la puberté, cette Omra est valable mais ne remplace pas celle qu'il devra accomplir après sa puberté."
    },
    {
      q: "Quel est l'âge idéal pour emmener un enfant en Omra ?",
      a: "La plupart des spécialistes et agences recommandent d'attendre que l'enfant ait au moins 7 à 10 ans pour qu'il puisse comprendre et vivre pleinement l'expérience. Entre 5 et 7 ans, un enfant peut techniquement faire l'Omra mais la fatigue et les foules peuvent rendre le voyage difficile. Les bébés et tout-petits peuvent aller à La Mecque mais l'Omra elle-même reste symbolique."
    },
    {
      q: "Comment expliquer l'Omra à un enfant ?",
      a: "Utilisez des histoires islamiques adaptées à l'âge (l'histoire d'Ibrahim et Hajar, la construction de la Kaaba). Montrez des vidéos et photos de La Mecque. Expliquez pourquoi la Kaaba est la maison d'Allah. Parlez du tawaf comme d'un grand cercle autour de la maison d'Allah en signe d'amour. Plus l'enfant comprend, plus l'expérience sera significative et mémorable."
    },
    {
      q: "Quels vêtements prévoir pour les enfants lors de l'Omra ?",
      a: "Pour les garçons : pendant l'état d'ihram, un petit garçon met 2 pièces de tissu blanc non cousu (même principe que l'adulte). Des petits kits ihram pour enfants sont disponibles dans les magasins islamiques. Pour les filles : elles doivent couvrir tout le corps sauf le visage et les mains — robes amples, hijab léger. Prévoyez des tenues légères, claires et respirantes."
    },
    {
      q: "Comment gérer les files d'attente et les foules avec des enfants ?",
      a: "Planifiez les rites aux heures creuses : tôt le matin après Fajr ou tard la nuit. Évitez les heures de pointe (après Dhuhr et Asr). Utilisez un porte-bébé ou un harnais de sécurité pour les plus petits. Pour le tawaf, les niveaux supérieurs sont moins encombrés. Commencez tôt le matin pour le sa'i. Prévoyez des collations et de l'eau en permanence."
    }
  ];

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Omra avec Enfants 2026 — Guide Pratique, Vêtements Ihram & Conseils</title>
        <meta name="description" content="Comment faire l'Omra avec des enfants en 2026 : âge idéal, vêtements ihram enfants, documents nécessaires, conseils pour gérer les foules. Guide complet pour parents." />
        <meta name="keywords" content="omra enfants, omra avec enfants, omra enfant ihram, vêtement ihram enfant, pèlerinage avec enfants, omra famille enfant, omra mineur" />
        <link rel="canonical" href="https://omrabonsplans.fr/omra-enfants" />
        <meta property="og:title" content="Omra avec Enfants 2026 — Guide Pratique & Conseils Parents" />
        <meta property="og:description" content="Âge idéal, vêtements ihram, documents, conseils pratiques pour l'Omra avec enfants en 2026." />
        <meta property="og:url" content="https://omrabonsplans.fr/omra-enfants" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Omra avec Enfants 2026 : Guide Complet pour les Parents",
          "description": "Tout pour préparer l'Omra avec des enfants : âge idéal, vêtements, documents, conseils pratiques.",
          "url": "https://omrabonsplans.fr/omra-enfants",
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
        { name: 'Omra en Famille', url: '/omra-famille' },
        { name: 'Omra Enfants', url: '/omra-enfants' }
      ]} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Omra avec Enfants 2026 : Guide Complet pour les Parents
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Emmener ses enfants en Omra est une expérience spirituelle inoubliable. Mais elle demande une préparation spécifique. Voici tous nos conseils pratiques pour que ce voyage soit une réussite pour toute la famille.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Vêtements ihram pour enfants</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">👦 Garçons (ihram)</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>2 pièces de tissu blanc non cousu</strong> — même règle que les adultes</li>
                <li>• Des petits kits ihram pour enfants sont disponibles dans les boutiques islamiques (10-25€)</li>
                <li>• Choisir du tissu léger et respirant (coton ou éponge fine)</li>
                <li>• Sandales ou chaussures ouvertes (pas de chaussures fermées)</li>
                <li>• Prévoir 2-3 kits en cas de souillure</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">👧 Filles</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Corps entier couvert sauf visage et mains</strong></li>
                <li>• Robe ample légère + hijab léger de couleur claire</li>
                <li>• Pas de niqab obligatoire pour les filles mineures</li>
                <li>• Vêtements synthétiques légers (polyester microfibre) — sèchent vite</li>
                <li>• Prévoyez 3-4 tenues propres pour la durée du séjour</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Checklist — ce qu'il faut emporter pour les enfants</h2>
          <div className="space-y-2">
            {[
              ['Documents', ['Passeport valide', 'Livret de famille', 'Autorisation sortie territoire (si 1 seul parent)', 'Carnet de vaccination (méningite obligatoire)']],
              ['Santé', ['Paracétamol dosé enfants', 'Ibuprofène dosé enfants', 'Sérum physiologique', 'Crème solaire SPF50', 'Solution réhydratation orale', 'Médicament anti-diarrhée']],
              ['Confort', ['Porte-bébé / sling (pour les tout-petits)', 'Harnais de sécurité anti-perte', 'Collations légères (dattes, barres céréales)', 'Gourde isotherme 500ml', 'Lunettes de soleil', 'Chapeau large']],
              ['Vêtements', ['3-4 tenues légères (coton/microfibre)', 'Kit ihram pour garçons', 'Sandales confortables et rodées', 'Chaussettes légères (pour les sols chauds)', 'Sous-vêtements de rechange']],
            ].map(([category, items], i) => (
              <div key={i} className="p-4 bg-muted/30 rounded-lg">
                <p className="font-semibold mb-2">{category}</p>
                <div className="grid grid-cols-2 gap-1">
                  {(items as string[]).map((item, j) => (
                    <p key={j} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-green-500">✓</span> {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Questions fréquentes — Omra avec enfants</h2>
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
          <h2 className="text-2xl font-bold mb-3">Planifiez votre Omra en famille</h2>
          <p className="text-muted-foreground mb-5">Comparez les offres de 20+ agences et trouvez la formule idéale pour votre famille</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Comparer les offres Omra
            </Link>
            <Link to="/omra-famille" className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">
              Guide Omra en Famille
            </Link>
          </div>
        </section>
      </main>
    </ResponsiveLayout>
  );
}
