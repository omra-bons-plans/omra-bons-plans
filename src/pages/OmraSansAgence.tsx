import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InternalLinks } from '@/components/SEO/InternalLinks';

const faqs = [
  {
    question: "Peut-on faire l'Omra sans agence en 2027 ?",
    answer: "Oui, c'est tout à fait possible. Depuis 2019, l'Arabie saoudite délivre un visa de tourisme électronique (eVisa) qui autorise l'accomplissement de l'Omra, sans passer par une agence. Vous organisez vous-même votre visa, vos vols, votre hébergement et vos déplacements. Il faut simplement respecter les règles : réserver vos créneaux de visite (Rawdah à Médine) et votre Omra via les plateformes officielles Nusuk, et ne pas partir pendant la période du Hajj (le visa touristique est alors suspendu pour l'Omra)."
  },
  {
    question: "Comment obtenir un visa Omra sans agence ?",
    answer: "Le plus simple est le visa électronique de tourisme saoudien, disponible sur la plateforme officielle ksavisa.sa (ou via l'application Nusuk). Il coûte environ 535 SAR (≈ 130 €) plus une assurance santé obligatoire (≈ 60-90 €). Le visa est valable 1 an, permet des entrées multiples et un séjour cumulé de 90 jours. Aucune agence n'est nécessaire : vous remplissez le formulaire en ligne, vous téléversez un passeport valide et une photo, et le visa est généralement délivré en quelques minutes à quelques jours. Les ressortissants français, belges et suisses y sont éligibles."
  },
  {
    question: "Combien coûte une Omra sans agence ?",
    answer: "Le budget indicatif pour 10 nuits est : visa électronique ≈ 130-190 €, vol aller-retour 400-900 € selon la ville de départ et la saison, hôtel à La Mecque 40-150 €/nuit selon la distance au Haram, hôtel à Médine 30-100 €/nuit, transport interne (train Haramain ou transfert) 50-150 €, nourriture et divers 15-30 €/jour. Soit un total d'environ 900 € à 2 500 € par personne. À titre de comparaison, une Omra en agence démarre souvent autour de 999 € tout compris : l'écart n'est pas toujours en faveur du « sans agence », surtout en haute saison."
  },
  {
    question: "Est-ce vraiment moins cher de partir sans agence ?",
    answer: "Pas toujours. En basse saison et en réservant tôt, le « sans agence » peut faire économiser 100 à 300 € par personne. Mais en haute saison (Ramadan, vacances scolaires), les agences négocient des tarifs de groupe et des allotements d'hôtels proches du Haram que les particuliers n'obtiennent pas : le DIY peut alors coûter plus cher, avec en plus la charge mentale de tout gérer soi-même. C'est pourquoi beaucoup de pèlerins comparent les deux options avant de trancher."
  },
  {
    question: "Quelles sont les étapes pour partir en Omra sans agence ?",
    answer: "Les 6 étapes clés : (1) obtenir le visa électronique sur ksavisa.sa ; (2) réserver les vols aller-retour (Djeddah ou Médine) ; (3) réserver un hôtel à La Mecque et un à Médine, idéalement à distance de marche du Haram ; (4) réserver vos créneaux Omra et Rawdah sur l'application Nusuk ; (5) organiser le transport interne (train Haramain entre Djeddah, La Mecque et Médine) ; (6) préparer l'ihram, le transport depuis l'aéroport et votre budget de change. Chaque étape est gérable en ligne, mais demande du temps et de la rigueur."
  },
  {
    question: "Quels sont les risques d'une Omra sans agence ?",
    answer: "Les principaux risques : annulation de vol ou d'hôtel sans assistance (vous gérez seul les imprévus), difficulté à trouver un hôtel proche du Haram en haute saison, absence d'encadrement spirituel et pratique (une agence fournit un guide pour les rites), et méconnaissance des règles locales (créneaux Nusuk, tenue, transport). Le DIY convient aux pèlerins autonomes, à l'aise en anglais ou en arabe, et partant hors Ramadan. Pour une première Omra, l'accompagnement d'une agence reste souvent plus rassurant."
  }
];

export default function OmraSansAgence() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Omra Sans Agence 2027 : Comment Faire, Visa, Prix & Démarches</title>
        <meta name="description" content="Partir en Omra sans agence : visa électronique, budget détaillé, démarches étape par étape et risques. Comparez avec les offres d'agences dès 999 €." />
        <meta name="keywords" content="omra sans agence, visa omra sans agence, faire une omra sans agence, omra sans agence prix, partir en omra sans agence, comment faire omra sans agence" />
        <link rel="canonical" href="https://omrabonsplans.fr/omra-sans-agence" />
        <meta property="og:title" content="Omra Sans Agence 2027 : Guide Complet, Visa et Prix" />
        <meta property="og:description" content="Comment organiser son Omra sans agence : visa électronique, budget, démarches et risques. Le guide complet + comparateur d'offres d'agences." />
        <meta property="og:url" content="https://omrabonsplans.fr/omra-sans-agence" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/hero-kaaba-optimized.webp" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Omra Sans Agence 2027 : Comment Faire, Visa, Prix et Démarches",
          "url": "https://omrabonsplans.fr/omra-sans-agence",
          "datePublished": "2026-11-26",
          "dateModified": "2026-11-26",
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
        { name: 'Omra Sans Agence', url: '/omra-sans-agence' }
      ]} />

      <article className="max-w-4xl mx-auto px-4 py-8">
        <Badge className="mb-4">Guide pratique</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Omra sans agence : le guide complet pour partir en autonomie</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Partir en Omra sans passer par une agence est possible et de plus en plus courant. Visa électronique, vols, hôtels, transport : voici tout ce qu'il faut savoir pour organiser votre Omra vous-même — budget, démarches et pièges à éviter.
        </p>

        <h2 className="text-2xl font-bold mb-4">Est-il possible de faire l'Omra sans agence ?</h2>
        <p className="mb-4">
          Oui. Depuis l'ouverture du visa de tourisme électronique saoudien en 2019, n'importe quel pèlerin peut organiser son Omra de A à Z sans intermédiaire. Le visa touristique autorise l'Omra, à condition de réserver ses créneaux (Omra et visite de la Rawdah) sur la plateforme officielle <strong>Nusuk</strong> et de ne pas voyager pendant la période du Hajj.
        </p>
        <p className="mb-8">
          Concrètement, « Omra sans agence » signifie que vous gérez vous-même : le visa, les billets d'avion, l'hébergement à La Mecque et à Médine, et les déplacements. C'est parfaitement légal et réalisable en ligne — mais cela demande du temps, de la rigueur et une bonne dose d'autonomie.
        </p>

        <h2 className="text-2xl font-bold mb-4">Le visa Omra sans agence : l'étape clé</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader><CardTitle>Visa électronique de tourisme</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm mb-3">La solution la plus simple pour l'Omra sans agence.</p>
              <ul className="text-sm space-y-2 list-disc pl-4">
                <li>Demande en ligne sur <strong>ksavisa.sa</strong> (plateforme officielle)</li>
                <li>Coût : ≈ 535 SAR (130 €) + assurance obligatoire (60-90 €)</li>
                <li>Validité : 1 an, entrées multiples, 90 jours cumulés</li>
                <li>Délivrance : quelques minutes à quelques jours</li>
                <li>Éligibles : ressortissants France, Belgique, Suisse et +60 pays</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Ce qu'il faut savoir</CardTitle></CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 list-disc pl-4">
                <li>Le visa touristique couvre l'Omra, sauf pendant le Hajj</li>
                <li>Réservation des créneaux via l'application <strong>Nusuk</strong></li>
                <li>Passeport valide + photo numérique requises</li>
                <li>Aucune agence ni attestation de mahram exigée</li>
                <li>Consultez notre guide <Link to="/visa-omra-france" className="text-primary underline">Visa Omra France</Link> pour le détail</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4">Combien coûte une Omra sans agence ?</h2>
        <Card className="mb-8">
          <CardContent className="pt-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Poste de dépense</th>
                  <th className="py-2 text-right">Budget indicatif</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2">Visa électronique + assurance</td><td className="py-2 text-right">130 – 190 €</td></tr>
                <tr className="border-b"><td className="py-2">Vol aller-retour</td><td className="py-2 text-right">400 – 900 €</td></tr>
                <tr className="border-b"><td className="py-2">Hôtel à La Mecque (par nuit)</td><td className="py-2 text-right">40 – 150 €</td></tr>
                <tr className="border-b"><td className="py-2">Hôtel à Médine (par nuit)</td><td className="py-2 text-right">30 – 100 €</td></tr>
                <tr className="border-b"><td className="py-2">Transport interne (train Haramain)</td><td className="py-2 text-right">50 – 150 €</td></tr>
                <tr className="border-b"><td className="py-2">Nourriture et divers (par jour)</td><td className="py-2 text-right">15 – 30 €</td></tr>
                <tr><td className="py-2 font-semibold">Total indicatif (10 nuits)</td><td className="py-2 text-right font-semibold">900 – 2 500 €</td></tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
        <p className="mb-8 text-muted-foreground">
          À titre de comparaison, une Omra en agence démarre souvent autour de 999 € tout compris. L'écart n'est pas toujours en faveur du « sans agence », surtout pendant le Ramadan où les agences obtiennent de meilleurs tarifs d'hôtels proches du Haram.
        </p>

        <h2 className="text-2xl font-bold mb-4">Les 6 étapes pour partir sans agence</h2>
        <ol className="list-decimal pl-6 space-y-3 mb-8">
          <li><strong>Obtenir le visa</strong> sur ksavisa.sa (tourisme électronique).</li>
          <li><strong>Réserver les vols</strong> aller-retour vers Djeddah ou Médine.</li>
          <li><strong>Réserver les hôtels</strong> à La Mecque et Médine, au plus près du Haram.</li>
          <li><strong>Réserver les créneaux</strong> Omra et Rawdah sur l'application Nusuk.</li>
          <li><strong>Organiser le transport</strong> : train Haramain ou transfert entre les villes.</li>
          <li><strong>Préparer</strong> l'ihram, le budget de change et les documents.</li>
        </ol>

        <h2 className="text-2xl font-bold mb-4">Sans agence vs avec agence : le comparatif honnête</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader><CardTitle>✅ Sans agence</CardTitle></CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 list-disc pl-4">
                <li>Liberté totale sur les dates et les hôtels</li>
                <li>Potentiellement moins cher en basse saison</li>
                <li>Rythme 100 % à votre main</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>✅ Avec agence</CardTitle></CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 list-disc pl-4">
                <li>Guide et encadrement spirituel inclus</li>
                <li>Hôtels proches du Haram négociés (même en Ramadan)</li>
                <li>Assistance en cas d'imprévu (vol, annulation)</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <p className="font-semibold mb-3">Le meilleur des deux mondes ?</p>
            <p className="text-sm text-muted-foreground mb-4">
              Comparez les offres d'agences agréées avant de vous lancer dans le DIY : vous saurez immédiatement si l'autonomie vaut vraiment le coup pour votre budget et vos dates.
            </p>
            <Link to="/">
              <Button>Comparer les offres Omra</Button>
            </Link>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-6">Questions fréquentes sur l'Omra sans agence</h2>
        <div className="space-y-4 mb-8">
          {faqs.map((f, i) => (
            <Card key={i}>
              <CardHeader><CardTitle className="text-base">{f.question}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{f.answer}</p></CardContent>
            </Card>
          ))}
        </div>

        <InternalLinks currentPage="/omra-sans-agence" />
      </article>
    </ResponsiveLayout>
  );
}
