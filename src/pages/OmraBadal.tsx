import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';

export default function OmraBadal() {
  const faqItems = [
    {
      q: "Qu'est-ce que l'Omra Badal (Omra par procuration) ?",
      a: "L'Omra Badal, aussi appelée Omra par procuration, consiste à accomplir l'Omra au nom et à la place d'une personne décédée ou dans l'incapacité physique permanente de le faire elle-même. Le pèlerin effectue tous les rites de l'Omra (ihram, tawaf, sa'i, tahallul) en formulant l'intention au nom de la personne concernée."
    },
    {
      q: "L'Omra Badal est-elle licite en Islam ?",
      a: "Oui, l'Omra Badal est permise selon la majorité des savants islamiques (Hanafi, Shafi'i, Hanbali), par analogie avec le hadith du Hajj Badal. Le pèlerin doit avoir déjà accompli sa propre Omra avant de la faire au nom d'un autre. Les malékites ont un avis plus restrictif sur ce point."
    },
    {
      q: "Pour qui peut-on faire l'Omra Badal ?",
      a: "L'Omra Badal peut être accomplie : 1) Pour une personne décédée avant d'avoir pu faire l'Omra, 2) Pour une personne vivante dans l'incapacité physique permanente de la faire (maladie grave, handicap sévère). Elle n'est pas prévue pour compenser simplement le manque de moyens financiers ou la paresse."
    },
    {
      q: "Comment formuler l'intention (niyya) pour l'Omra Badal ?",
      a: "Au moment de prendre l'ihram (au miqat), le pèlerin formule l'intention en disant : 'Allahumma, inni uridu al-Umrata 'an [nom de la personne], fayassirha li wa taqabbalha minni wa minhu/minha' (Ô Allah, j'ai l'intention d'accomplir l'Omra au nom de [prénom], facilite-la moi et accepte-la de moi et de lui/elle)."
    },
    {
      q: "Combien coûte une Omra Badal via une agence ?",
      a: "Certaines agences proposent des services d'Omra Badal pour environ 300€ à 600€. Le pèlerin mandaté accomplit l'Omra à La Mecque et vous envoie une attestation. Attention : vérifiez sérieusement la fiabilité de l'agence et demandez des preuves photographiques ou vidéo. Il existe des arnaques dans ce domaine."
    },
    {
      q: "Peut-on faire soi-même l'Omra Badal sans passer par une agence ?",
      a: "Oui, si vous voyagez à La Mecque pour votre propre Omra, vous pouvez effectuer une Omra Badal supplémentaire lors du même voyage. Il suffit de prendre un nouvel ihram depuis le miqat ou depuis la Masjid al-Tan'im (Mosquée Aïcha) à La Mecque, de formuler l'intention au nom de la personne, et d'accomplir les rites complets."
    }
  ];

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Omra Badal (Omra pour un Défunt) 2026 — Guide Complet & Agences</title>
        <meta name="description" content="Tout sur l'Omra Badal en 2026 : définition, conditions islamiques, comment formuler l'intention, agences fiables, prix (300-600€). Faire l'Omra au nom d'un défunt ou d'un malade." />
        <meta name="keywords" content="omra badal, omra défunt, omra par procuration, omra pour mort, omra pour malade, omra au nom de quelqu'un, pèlerinage défunt" />
        <link rel="canonical" href="https://omrabonsplans.fr/omra-badal" />
        <meta property="og:title" content="Omra Badal 2026 — Omra pour un Défunt ou par Procuration" />
        <meta property="og:description" content="Comment faire l'Omra Badal (par procuration) ? Conditions islamiques, intention, prix agences, arnaques à éviter." />
        <meta property="og:url" content="https://omrabonsplans.fr/omra-badal" />
        <meta property="og:type" content="article" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
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
        { name: 'Omra Badal', url: '/omra-badal' }
      ]} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Omra Badal 2026 : Guide Complet de l'Omra pour un Défunt
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            L'Omra Badal permet d'accomplir l'Omra au nom d'un proche décédé ou dans l'incapacité physique de le faire. Voici tout ce que vous devez savoir sur les conditions islamiques, comment la pratiquer, et comment choisir une agence fiable.
          </p>
        </header>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-5 mb-8">
          <h2 className="font-bold text-green-900 dark:text-green-100 mb-3">📋 Conditions pour l'Omra Badal</h2>
          <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
            <li>• Le mandataire (celui qui fait l'Omra) doit <strong>avoir déjà fait sa propre Omra</strong> au préalable</li>
            <li>• La personne au nom de qui on fait l'Omra doit être <strong>décédée</strong> ou dans l'<strong>incapacité physique permanente</strong></li>
            <li>• Le mandataire doit <strong>formuler explicitement l'intention</strong> au nom de la personne au miqat</li>
            <li>• Tous les rites doivent être accomplis <strong>complètement et correctement</strong></li>
          </ul>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Comment formuler l'intention (Niyya) pour l'Omra Badal</h2>
          <div className="bg-muted/30 rounded-xl p-6">
            <p className="font-semibold mb-3">Au miqat, avant de prendre l'ihram, dites :</p>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3">
              <p className="text-right font-arabic text-xl mb-2 text-gray-700 dark:text-gray-300">اللَّهُمَّ إِنِّي أُرِيدُ الْعُمْرَةَ عَنْ [اسم المتوفى] فَيَسِّرْهَا لِي وَتَقَبَّلْهَا مِنِّي وَمِنْهُ</p>
              <p className="text-sm text-muted-foreground italic">"Allahumma inni uridu al-Umrata 'an [nom du défunt] fayassirha li wa taqabbalha minni wa minhu"</p>
            </div>
            <p className="text-sm text-muted-foreground">Traduction : "Ô Allah, j'ai l'intention d'accomplir l'Omra au nom de [prénom du défunt], facilite-la moi et accepte-la de moi et de lui."</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Faire l'Omra Badal soi-même vs via une agence</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-green-700 dark:text-green-400 mb-3">✅ Faire soi-même (recommandé)</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Vous avez la certitude que l'Omra est accomplie</li>
                <li>• Vous vivez l'expérience spirituelle en première personne</li>
                <li>• Lors d'un voyage à La Mecque, prenez un nouvel ihram depuis Masjid Aïcha (à 7km du Haram)</li>
                <li>• Coût : inclus dans votre voyage</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-3">⚠️ Via une agence (avec précautions)</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Prix : 300€ à 600€ selon l'agence</li>
                <li>• <strong>Risque d'arnaque élevé</strong> — vérifiez sérieusement</li>
                <li>• Demandez : nom du pèlerin, date, preuve vidéo/photo avec votre signe</li>
                <li>• Préférez une agence connue (Tawaf, Medin Voyages, etc.)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Questions fréquentes — Omra Badal</h2>
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
          <h2 className="text-2xl font-bold mb-3">Planifier votre Omra ou Omra Badal</h2>
          <p className="text-muted-foreground mb-5">Comparez les offres de 20+ agences agréées pour organiser votre voyage</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/omra" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Comparer les offres Omra
            </Link>
            <Link to="/rites-omra" className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">
              Guide des rites de l'Omra
            </Link>
          </div>
        </section>
      </main>
    </ResponsiveLayout>
  );
}
