import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { InternalLinks } from '@/components/SEO/InternalLinks';

const faqs = [
  {
    question: "Comment préparer son premier pèlerinage Omra ?",
    answer: "Pour préparer votre première Omra : (1) Choisissez une agence agréée par le Ministère des Affaires Religieuses Saoudien. (2) Préparez les documents : passeport valide 6 mois, certificat de vaccination méningite ACWY, photos. (3) Apprenez les rites (Tawaf, Sa'i, Taqsir). (4) Emportez des vêtements appropriés, un tapis de prière, et des médicaments de base. (5) Prévoyez des riyals saoudiens en espèces."
  },
  {
    question: "Combien faut-il prévoir de budget pour une première Omra ?",
    answer: "Pour une première Omra, prévoyez entre 1000€ et 2000€ tout compris (vol + hôtel + visa) hors Ramadan. Ajoutez 300-500€ pour les dépenses sur place (repas, transports, achats). En Ramadan, multipliez par 1.5 à 2. Comparez les offres sur notre comparateur pour trouver le meilleur prix."
  },
  {
    question: "Quelle agence choisir pour sa première Omra ?",
    answer: "Choisissez une agence agréée par le Ministère Saoudien des Affaires Religieuses et référencée auprès des autorités françaises. Vérifiez les avis clients, la présence d'un accompagnateur francophone, et la qualité de l'hôtel proposé. Méfiez-vous des prix anormalement bas."
  },
  {
    question: "Faut-il parler arabe pour faire l'Omra ?",
    answer: "Non, il n'est pas nécessaire de parler arabe. Les agences françaises sérieuses proposent des accompagnateurs francophones qui guident les pèlerins. Les invocations (dua) peuvent être lues en français. Il est cependant utile d'apprendre quelques formules basiques en arabe (Talbiyah, formules du Tawaf)."
  },
  {
    question: "Quels documents sont obligatoires pour l'Omra ?",
    answer: "Documents obligatoires : passeport valide au moins 6 mois après la date de retour, visa Omra (délivré par l'agence), certificat de vaccination méningocoque ACWY (obligatoire), et acte de mariage pour les couples non-mahram. Les femmes de moins de 45 ans doivent partir en groupe organisé."
  }
];


const steps = [
  {
    num: "1",
    title: "Choisir son agence",
    desc: "Comparez les offres d'agences agréées. Vérifiez la qualité de l'hôtel (distance à la Masjid al-Haram), la présence d'un accompagnateur francophone, et les avis clients."
  },
  {
    num: "2",
    title: "Préparer les documents",
    desc: "Passeport valide 6 mois, vaccination méningocoque ACWY, photos d'identité, acte de mariage (si applicable). L'agence s'occupe du visa Omra."
  },
  {
    num: "3",
    title: "Apprendre les rites",
    desc: "Révisez les 4 rites : Ihram (état de pureté), Tawaf (7 tours autour de la Kaaba), Sa'i (7 allers-retours entre Safa et Marwa), Taqsir (coupe de cheveux). Des cours en ligne existent."
  },
  {
    num: "4",
    title: "Préparer ses bagages",
    desc: "Vêtements légers (abaya pour les femmes, 2 pièces de tissu blanc non cousus pour les hommes en ihram), tapis de prière, médicaments, crème solaire, confort de marche."
  },
  {
    num: "5",
    title: "Entrer en état d'Ihram",
    desc: "Avant d'atteindre le Miqat (frontière sacrée), vous devez vous purifier (ghusl), mettre les vêtements d'ihram, et prononcer l'intention (niyyah) : « Labbayk Allahumma Umratan »."
  },
  {
    num: "6",
    title: "Accomplir le Tawaf",
    desc: "7 tours autour de la Kaaba dans le sens anti-horaire, en commençant par la Pierre Noire. Récitez des dua et invocations. Le Tawaf peut prendre 30 min à 2h selon l'affluence."
  },
  {
    num: "7",
    title: "Accomplir le Sa'i",
    desc: "7 allers-retours entre les collines de Safa et Marwa (environ 450m chacun). Ce rite commémore la course de Hajar (Agar) à la recherche d'eau pour son fils Ismaïl."
  },
  {
    num: "8",
    title: "Le Taqsir (fin de l'Ihram)",
    desc: "Les hommes se rasent la tête (Halq) ou raccourcissent leurs cheveux (Taqsir). Les femmes coupent l'équivalent d'un doigt de cheveux. L'Omra est alors accomplie."
  }
];

export default function OmraDebutant() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Guide Omra pour Débutant : Premier Pèlerinage 2026 | Omra Bons Plans</title>
        <meta name="description" content="Tout ce qu'il faut savoir pour réussir son premier pèlerinage Omra : préparation, documents, rites étape par étape, budget et conseils pratiques pour 2026." />
        <meta name="keywords" content="omra débutant, premier pèlerinage omra, guide omra, préparer omra, comment faire omra, rites omra étapes" />
        <link rel="canonical" href="https://omrabonsplans.fr/omra-debutant" />
        <meta property="og:title" content="Guide Omra pour Débutant : Tout pour Réussir son Premier Pèlerinage" />
        <meta property="og:description" content="Guide complet étape par étape pour préparer et réussir votre première Omra : documents, rites, budget et conseils pratiques." />
        <meta property="og:url" content="https://omrabonsplans.fr/omra-debutant" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "Comment faire l'Omra : Guide pour débutant",
          "description": "Guide complet pour préparer et accomplir son premier pèlerinage Omra",
          "url": "https://omrabonsplans.fr/omra-debutant",
          "step": steps.map(s => ({
            "@type": "HowToStep",
            "name": s.title,
            "text": s.desc,
            "position": parseInt(s.num)
          }))
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://omrabonsplans.fr" },
            { "@type": "ListItem", "position": 2, "name": "Guide Omra", "item": "https://omrabonsplans.fr/definition-omra" },
            { "@type": "ListItem", "position": 3, "name": "Omra pour débutant", "item": "https://omrabonsplans.fr/omra-debutant" }
          ]
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

      <div className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/20 via-background to-background py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <nav className="text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary">Accueil</Link>
              <span className="mx-2">/</span>
              <Link to="/definition-omra" className="hover:text-primary">Guide Omra</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Omra pour débutant</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Guide Omra pour Débutant
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tout ce qu'il faut savoir pour préparer et réussir votre premier pèlerinage Omra en 2026
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

          {/* Intro */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Votre première Omra : par où commencer ?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Partir en Omra pour la première fois peut sembler intimidant. Entre le choix de l'agence, les documents à préparer, les rites à apprendre et l'organisation du voyage, de nombreuses questions se posent. Ce guide vous accompagne pas à pas pour que votre premier pèlerinage soit une expérience inoubliable.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
              <p className="text-primary font-medium mb-1">Bonne nouvelle !</p>
              <p className="text-muted-foreground">L'Omra est accessible à tous les musulmans en bonne santé, sans condition d'âge ou de niveau religieux. Avec une bonne préparation, votre premier pèlerinage se passera sereinement.</p>
            </div>
          </section>

          {/* Checklist documents */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Documents obligatoires pour l'Omra</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Passeport valide", detail: "Au moins 6 mois après la date de retour, avec des pages vierges disponibles" },
                { title: "Visa Omra", detail: "Délivré par votre agence agréée. Ne partez jamais sans visa valide" },
                { title: "Vaccin méningocoque ACWY", detail: "Obligatoire pour l'entrée en Arabie Saoudite. Faites-le au moins 10 jours avant le départ" },
                { title: "Photos d'identité", detail: "Fond blanc, format biométrique. Prévoyez 4-6 exemplaires" },
                { title: "Acte de mariage", detail: "Obligatoire si vous voyagez avec votre épouse (preuve de mahram)" },
                { title: "Attestation de groupe", detail: "Pour les femmes de moins de 45 ans : attestation de voyage en groupe organisé" }
              ].map((doc, i) => (
                <div key={i} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{doc.title}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{doc.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Étapes des rites */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Les 8 étapes de l'Omra expliquées</h2>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Budget */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Budget pour sa première Omra</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Poste de dépense</th>
                    <th className="text-left p-4 font-semibold">Budget économique</th>
                    <th className="text-left p-4 font-semibold">Budget confort</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: "Vol aller-retour", eco: "300 – 500€", confort: "500 – 900€" },
                    { item: "Hôtel (7 nuits)", eco: "400 – 700€", confort: "700 – 1500€" },
                    { item: "Visa Omra", eco: "Inclus agence", confort: "Inclus agence" },
                    { item: "Repas sur place", eco: "150 – 250€", confort: "300 – 500€" },
                    { item: "Transports locaux", eco: "50 – 100€", confort: "100 – 200€" },
                    { item: "Achats / souvenirs", eco: "100 – 200€", confort: "200 – 500€" },
                    { item: "TOTAL estimé", eco: "1 000 – 1 750€", confort: "1 800 – 3 600€" }
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="p-4 font-medium">{row.item}</td>
                      <td className="p-4 text-green-400">{row.eco}</td>
                      <td className="p-4 text-blue-400">{row.confort}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Conseils pratiques */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Conseils pratiques pour les débutants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { emoji: "👟", title: "Chaussures confortables", desc: "Vous marcherez des kilomètres. Portez des sandales faciles à enlever pour la mosquée." },
                { emoji: "💧", title: "Restez hydraté", desc: "La chaleur à La Mecque peut être intense. L'eau Zamzam est disponible partout dans la mosquée." },
                { emoji: "📱", title: "Applications utiles", desc: "Téléchargez une boussole Qibla, une app de prière (Athan) et un guide des rites avec dua." },
                { emoji: "🏨", title: "Hôtel proche de la Haram", desc: "Choisissez un hôtel à moins de 500m de Masjid al-Haram pour les nouveaux pèlerins." },
                { emoji: "💶", title: "Emportez des espèces", desc: "Prévoyez des riyals saoudiens en espèces pour les petites dépenses et les marchés." },
                { emoji: "📋", title: "Apprenez les dua", desc: "Mémorisez la Talbiyah et quelques dua basiques avant le départ. Des livrets sont disponibles." }
              ].map((tip, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
                  <span className="text-2xl">{tip.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{tip.title}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Questions fréquentes des débutants</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Prêt pour votre première Omra ?</h2>
            <p className="text-muted-foreground mb-6">Comparez les offres et trouvez le séjour idéal pour votre premier pèlerinage</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/omra" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Comparer les offres Omra
              </Link>
              <Link to="/conditions-omra" className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                Conditions pour partir
              </Link>
            </div>
          </section>

          {/* Internal links */}
          <InternalLinks
            currentPage="/omra-debutant"
            links={[
              { href: "/definition-omra", label: "Qu'est-ce que l'Omra ?", description: "Définition complète" },
              { href: "/quand-partir-omra", label: "Quand partir ?", description: "Meilleures périodes et prix" },
              { href: "/conditions-omra", label: "Conditions requises", description: "Qui peut faire l'Omra ?" },
              { href: "/rites-omra", label: "Les rites de l'Omra", description: "Guide détaillé des rites" },
              { href: "/visa-omra", label: "Visa Omra", description: "Démarches et documents" },
              { href: "/omra", label: "Comparer les offres", description: "Trouver son séjour" }
            ]}
          />
        </div>
      </div>
    </ResponsiveLayout>
  );
}
