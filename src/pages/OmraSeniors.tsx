import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';

export default function OmraSeniors() {
  const faqItems = [
    {
      q: "Y a-t-il un âge limite pour faire l'Omra ?",
      a: "Il n'existe pas d'âge limite légal pour l'Omra. Des pèlerins de 80, 90 ans et plus font l'Omra chaque année. Cependant, les autorités saoudiennes peuvent refuser l'entrée à des personnes dont l'état de santé représente un risque. Un certificat médical attestant l'aptitude au voyage peut être demandé pour les seniors."
    },
    {
      q: "Peut-on faire le tawaf en fauteuil roulant ?",
      a: "Oui, absolument. La Grande Mosquée dispose de fauteuils roulants en location et d'un niveau spécialement aménagé pour les personnes à mobilité réduite. Des pousseurs professionnels sont disponibles sur place. Le tawaf en fauteuil roulant est parfaitement valide selon tous les savants islamiques. Le sa'i peut également être effectué en fauteuil roulant sur les niveaux aménagés."
    },
    {
      q: "Quels sont les risques médicaux à connaître pour les seniors ?",
      a: "Les principaux risques sont la déshydratation, l'insolation, l'aggravation des maladies cardio-vasculaires et respiratoires dans la foule et la chaleur. La vaccination obligatoire contre la méningite (ACYW135) est particulièrement importante pour les seniors immunodéprimés. Consultez votre médecin traitant et votre cardiologue avant le départ."
    },
    {
      q: "Quelle formule d'hébergement choisir pour les seniors ?",
      a: "Pour les seniors, nous recommandons vivement les hôtels à moins de 200m du Haram (très proches, pour limiter la marche), les établissements avec ascenseur et chambre accessible, et les formules pension complète pour éviter la fatigue liée à la recherche de nourriture. Les hôtels de la tour Abraj Al-Bait (Makkah Royal Clock Tower) offrent un accès direct au Haram."
    },
    {
      q: "Est-ce qu'une senior de plus de 45 ans peut faire l'Omra seule sans mahram ?",
      a: "Depuis 2021, l'Arabie Saoudite a levé l'obligation du mahram pour les femmes de tous âges faisant l'Omra en groupe organisé via une agence agréée. Les femmes seniors peuvent donc faire l'Omra sans mahram à condition de voyager avec un groupe agence officiel."
    }
  ];

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Omra Seniors 2026 — Guide pour Personnes Âgées, Mobilité Réduite & Fauteuil</title>
        <meta name="description" content="Guide complet Omra seniors 2026 : fauteuil roulant à La Mecque, conseils médicaux, formules adaptées, agences spécialisées. Faire l'Omra à tout âge avec sérénité." />
        <meta name="keywords" content="omra seniors, omra personnes âgées, omra fauteuil roulant, omra mobilité réduite, pèlerinage senior, omra 3ème âge" />
        <link rel="canonical" href="https://omrabonsplans.fr/omra-seniors" />
        <meta property="og:title" content="Omra Seniors 2026 — Guide Personnes Âgées & Mobilité Réduite" />
        <meta property="og:description" content="Comment faire l'Omra en étant senior ou à mobilité réduite ? Fauteuil roulant, conseils médicaux, formules adaptées." />
        <meta property="og:url" content="https://omrabonsplans.fr/omra-seniors" />
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
        { name: 'Omra Seniors', url: '/omra-seniors' }
      ]} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Omra Seniors 2026 : Guide Complet pour Personnes Âgées
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            L'Omra est accessible à tous, quel que soit l'âge. Des aménagements spéciaux existent à La Mecque pour les seniors et les personnes à mobilité réduite. Voici tout ce qu'il faut savoir pour préparer votre pèlerinage sereinement.
          </p>
        </header>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-8">
          <h2 className="font-bold text-blue-900 dark:text-blue-100 mb-3">✅ Ce que permet la Grande Mosquée pour les seniors</h2>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• <strong>Fauteuils roulants en location</strong> — disponibles 24h/24 à l'entrée du Haram</li>
            <li>• <strong>Pousseurs agréés</strong> — personnel formé pour le tawaf et le sa'i</li>
            <li>• <strong>Niveaux accessibles</strong> — tawaf et sa'i sur étages avec rampes et ascenseurs</li>
            <li>• <strong>Zone de repos climatisée</strong> — dans l'enceinte de la mosquée</li>
            <li>• <strong>Services médicaux permanents</strong> — postes de secours tout autour de la mosquée</li>
          </ul>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Préparation médicale avant le départ</h2>
          <div className="space-y-3">
            {[
              { title: 'Consultation médecin traitant (obligatoire)', body: 'Évaluez votre aptitude au voyage, obtenez votre ordonnance pour 3-4 semaines, et discutez des risques liés à votre condition.' },
              { title: 'Cardiologie si besoin', body: 'Si vous avez des antécédents cardio-vasculaires, consultez votre cardiologue. La foule et la chaleur peuvent aggraver certaines conditions.' },
              { title: 'Vaccination méningite ACYW135', body: 'Obligatoire pour obtenir le visa. Le vaccin doit être fait au moins 10 jours avant le départ. Vérifiez que vos autres vaccins sont à jour.' },
              { title: 'Trousse médicale complète', body: 'Apportez tous vos médicaments habituels pour 4-5 semaines (avec ordonnances en anglais/arabe), thermomètre, pression artérielle, médicaments contre la diarrhée.' },
              { title: 'Assurance rapatriement', body: 'Indispensable pour les seniors. Choisissez une assurance avec couverture médicale élevée (min. 150 000€) et rapatriement sanitaire inclus.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 bg-muted/30 rounded-lg">
                <span className="text-blue-500 font-bold mt-0.5">✓</span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Formules d'hébergement recommandées</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary/10">
                  <th className="p-3 text-left border">Critère</th>
                  <th className="p-3 text-left border">Recommandation pour seniors</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Distance au Haram', 'Moins de 200m — priorité absolue'],
                  ['Type de chambre', 'Chambre accessible PMR avec douche (pas de baignoire), lit côté accessible'],
                  ['Pension', 'Pension complète ou demi-pension — évite les sorties pour les repas'],
                  ['Étage', 'Ascenseur obligatoire. Chambre aux étages médians (ni trop bas bruyant, ni trop haut en cas de panne)'],
                  ['Services', 'Hôtels avec service médical ou infirmière de permanence, pharmacie proche'],
                ].map(([critere, reco], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-muted/20' : ''}>
                    <td className="p-3 border font-medium">{critere}</td>
                    <td className="p-3 border text-muted-foreground">{reco}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Questions fréquentes — Omra seniors</h2>
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
          <h2 className="text-2xl font-bold mb-3">Trouver une agence spécialisée seniors</h2>
          <p className="text-muted-foreground mb-5">Certaines agences proposent des formules "confort seniors" avec encadrement renforcé et hôtels accessibles</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/omra" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Comparer les offres Omra
            </Link>
            <Link to="/meilleure-agence-omra" className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">
              Meilleures agences Omra
            </Link>
          </div>
        </section>
      </main>
    </ResponsiveLayout>
  );
}
