import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { InternalLinks } from '@/components/SEO/InternalLinks';

const faqs = [
  {
    question: "Quelles sont les conditions pour faire l'Omra ?",
    answer: "Pour accomplir l'Omra, plusieurs conditions doivent être réunies. Sur le plan religieux (les 'chourout') : être musulman(e), être en état de pureté rituelle, avoir atteint l'âge de raison (bâligh), et être libre de toute contrainte majeure. Sur le plan pratique : disposer d'un passeport valide au moins 6 mois après votre retour, obtenir un visa (visa Omra via une agence agréée ou eVisa touristique saoudien), et avoir reçu le vaccin méningocoque ACWY obligatoire au moins 10 jours avant le départ. Sur le plan financier : avoir les ressources nécessaires sans s'endetter et sans négliger ses obligations envers sa famille. Concernant le mahram : selon la loi saoudienne depuis 2021, les femmes de tout âge peuvent partir en Omra sans accompagnateur masculin, en groupe organisé avec une agence agréée. D'un point de vue religieux, la majorité des savants maintiennent l'obligation du mahram. Consultez votre référent religieux pour votre situation personnelle."
  },
  {
    question: "Une femme seule peut-elle faire l'Omra ?",
    answer: "Oui, selon la réglementation saoudienne en vigueur depuis 2021. L'Arabie Saoudite a officiellement levé l'obligation du mahram pour les femmes souhaitant accomplir l'Omra, sans restriction d'âge. Les femmes peuvent désormais voyager en groupe organisé via une agence agréée par le Ministère Saoudien des Affaires Islamiques. En pratique, toutes les grandes agences françaises proposent des départs spéciaux pour femmes seules ou en groupe mixte accompagné. Sur le plan religieux, la situation est plus nuancée. La majorité des savants traditionnels — notamment les écoles hanafite, malékite et hanbalite — maintiennent que le mahram (mari, père, frère, fils majeur ou oncle paternel) est obligatoire pour le voyage de la femme, quelle que soit la distance. D'autres savants contemporains, s'appuyant sur la sécurité des voyages modernes, considèrent que cette obligation est allégée quand la sécurité est garantie par une agence agréée. Il est recommandé de consulter votre référent religieux de confiance avant de prendre votre décision. Retrouvez notre guide complet : Omra pour femme seule."
  },
  {
    question: "Faut-il être en bonne santé pour faire l'Omra ?",
    answer: "L'Omra est un pèlerinage physiquement exigeant que vous devez aborder avec préparation. Sur place, vous marcherez entre 5 et 15 kilomètres par jour selon votre programme — le Tawaf (7 tours autour de la Kaaba), le Sa'i (7 allers-retours entre Safa et Marwa) et les déplacements entre les lieux saints. Ces efforts se déroulent dans un environnement chaud (25 à 45°C selon la saison) et souvent très bondé. Une bonne condition physique générale est donc recommandée. Pour les personnes âgées, les femmes enceintes, les cardiaques, les diabétiques ou les personnes à mobilité réduite, un avis médical préalable est indispensable. Votre médecin traitant peut vous délivrer un certificat d'aptitude au voyage. Pensez à choisir un hébergement proche de la Masjid al-Haram (dans un rayon de 500 mètres) pour limiter les distances à pied. Certaines agences françaises proposent des accompagnements médicaux avec des médecins francophones intégrés au groupe, ce qui est rassurant pour les personnes vulnérables."
  },
  {
    question: "Quel visa faut-il pour faire l'Omra ?",
    answer: "Pour entrer en Arabie Saoudite et accomplir l'Omra, deux types de visas sont disponibles pour les ressortissants français. Première option : le visa Omra, délivré par une agence de voyage agréée par le Ministère Saoudien des Affaires Religieuses (MSIAR). Il est inclus dans la quasi-totalité des forfaits Omra vendus par les agences françaises. Sa validité est généralement de 30 jours non renouvelables. Deuxième option : le visa touristique saoudien (eVisa), que vous pouvez obtenir vous-même en ligne sur le site officiel visa.visitsaudi.com. Depuis 2019, ce visa permet également d'accomplir les rites de l'Omra. Son coût est d'environ 110 euros, valable 1 an avec entrées multiples. Quelle que soit votre option, votre passeport doit être valide au moins 6 mois après la date de retour prévue et comporter des pages vierges pour les tampons. Notez qu'il n'y a pas de quota annuel pour l'Omra, contrairement au Hajj, ce qui facilite les démarches tout au long de l'année."
  },
  {
    question: "Les non-musulmans peuvent-ils accompagner pour l'Omra ?",
    answer: "Non, il est impossible pour un non-musulman d'entrer dans la ville sainte de La Mecque (Makkah al-Mukarrama). Cette interdiction est inscrite dans la loi saoudienne et s'appuie sur un verset coranique (Sourate at-Tawba, verset 28). Elle est strictement appliquée : des points de contrôle sont installés à toutes les entrées de la ville, et les forces de l'ordre vérifient l'identité et la religion des voyageurs. Toute tentative d'entrée par un non-musulman expose à une expulsion immédiate et à des poursuites judiciaires en Arabie Saoudite. Il est donc impossible de voyager avec un membre de votre famille ou un ami non-musulman si la destination principale est La Mecque. En revanche, les non-musulmans peuvent visiter la plupart des autres villes saoudiennes, notamment Riyad ou Djeddah. Médine accueille des non-musulmans dans ses parties extérieures, mais l'entrée dans la Masjid an-Nabawi (Mosquée du Prophète) leur est interdite dans les zones centrales."
  }
];


export default function ConditionsOmra() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Conditions pour Faire l'Omra 2027 : Qui Peut Partir ? | Omra Bons Plans</title>
        <meta name="description" content="Toutes les conditions pour faire l'Omra en 2026 : conditions religieuses, documents obligatoires, règles pour les femmes seules, vaccins et conditions de santé." />
        <meta name="keywords" content="conditions omra, qui peut faire omra, omra femme seule, mahram omra, vaccin omra, documents omra, visa omra conditions" />
        <link rel="canonical" href="https://omrabonsplans.fr/conditions-omra" />
        <meta property="og:title" content="Conditions pour Faire l'Omra 2027 : Guide Complet" />
        <meta property="og:description" content="Conditions religieuses, documents, vaccins, règles pour les femmes : tout ce qu'il faut savoir pour pouvoir partir en Omra en 2026." />
        <meta property="og:url" content="https://omrabonsplans.fr/conditions-omra" />
        <meta property="og:type" content="article" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta property="og:image" content="https://omrabonsplans.fr/og-omra-debutant.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Conditions pour Faire l'Omra 2027" />
        <meta name="twitter:description" content="Conditions religieuses, documents, vaccins, règles pour les femmes pour partir en Omra." />
        <meta name="twitter:image" content="https://omrabonsplans.fr/og-omra-debutant.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Conditions pour Faire l'Omra 2027 : Qui Peut Partir ?",
          "description": "Guide complet des conditions religieuses, administratives et sanitaires pour partir en Omra en 2026.",
          "url": "https://omrabonsplans.fr/conditions-omra",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie", "jobTitle": "Expert en pèlerinage islamique" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "url": "https://omrabonsplans.fr" },
          "datePublished": "2025-01-01",
          "dateModified": "2026-08-16",
          "image": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/og-omra-debutant.jpg", "width": 1200, "height": 630 },
          "inLanguage": "fr-FR"
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
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://omrabonsplans.fr" },
            { "@type": "ListItem", "position": 2, "name": "Guide Omra", "item": "https://omrabonsplans.fr/definition-omra" },
            { "@type": "ListItem", "position": 3, "name": "Conditions pour l'Omra", "item": "https://omrabonsplans.fr/conditions-omra" }
          ]
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
              <span className="text-foreground">Conditions pour l'Omra</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Conditions pour Faire l'Omra
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Qui peut partir en Omra ? Documents, vaccins, conditions religieuses — tout ce qu'il faut savoir pour 2026
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

          {/* Conditions religieuses */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Conditions religieuses (Chourout)</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Selon le droit islamique, l'Omra est valide si les conditions suivantes sont réunies :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { cond: "Islam", detail: "Être musulman(e). L'Omra est exclusivement réservée aux croyants. La ville de La Mecque est interdite aux non-musulmans." },
                { cond: "Âge de raison", detail: "Être pubère (Bâligh) est une condition pour que l'Omra soit obligatoire, mais les enfants peuvent l'accomplir et en tireront un bénéfice spirituel." },
                { cond: "Liberté", detail: "Être libre (non en état de contrainte). Cette condition concerne principalement les situations d'esclavage — sans pertinence pratique aujourd'hui." },
                { cond: "Capacité physique", detail: "Être capable d'effectuer le voyage. Les malades ou les personnes dans l'incapacité peuvent mandater quelqu'un pour faire l'Omra en leur nom (Omra par procuration)." },
                { cond: "Capacité financière", detail: "Pouvoir financer le voyage sans s'endetter et sans négliger ses obligations envers sa famille." },
                { cond: "Sécurité du chemin", detail: "Que le voyage soit sûr. Condition classique du droit islamique, pleinement applicable aujourd'hui." }
              ].map((c, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <p className="font-bold text-primary mb-1">{c.cond}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Conditions administratives */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Conditions administratives (Arabie Saoudite)</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Passeport valide",
                  detail: "Votre passeport doit être valide au minimum 6 mois après votre date de retour. Assurez-vous d'avoir des pages vierges disponibles pour les tampons.",
                  required: true
                },
                {
                  title: "Visa Omra ou visa touristique",
                  detail: "Un visa est obligatoire pour entrer en Arabie Saoudite. Deux options : le visa Omra, délivré par une agence de voyage agréée (inclus dans la plupart des forfaits), ou le visa touristique (eVisa) que vous pouvez obtenir vous-même en ligne sur visa.visitsaudi.com. Les deux permettent d'accomplir l'Omra.",
                  required: true
                },
                {
                  title: "Vaccin méningocoque ACWY",
                  detail: "Vaccination obligatoire, effectuée au moins 10 jours avant le départ. Votre médecin ou un centre de vaccination internationale peut vous la délivrer. Le certificat de vaccination doit être présenté à l'entrée en Arabie Saoudite.",
                  required: true
                },
                {
                  title: "Mahram pour les femmes",
                  detail: "Selon la loi saoudienne, les femmes n'ont plus besoin de mahram pour effectuer l'Omra depuis 2021, quel que soit leur âge. Elles peuvent voyager en groupe organisé avec une agence agréée. Cependant, d'un point de vue religieux, la majorité des savants considèrent que le mahram (mari, père, frère, oncle paternel, fils majeur) reste obligatoire pour le voyage de la femme.",
                  required: false
                },
                {
                  title: "Acte de mariage (si applicable)",
                  detail: "Si vous voyagez en couple, l'acte de mariage peut être demandé lors des formalités. Une traduction officielle peut être exigée.",
                  required: false
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-card border border-border rounded-xl p-5">
                  <div className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${item.required ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {item.required ? 'OBLIGATOIRE' : 'CAS SPÉCIFIQUE'}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Règles pour les femmes */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Règles spécifiques pour les femmes</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold">Situation</th>
                      <th className="text-left p-4 font-semibold">Condition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { sit: "Femme (tout âge) — Loi saoudienne", cond: "Depuis 2021, la loi saoudienne n'exige plus de mahram pour l'Omra. Les femmes de tout âge peuvent voyager en groupe organisé avec une agence agréée." },
                      { sit: "Femme — Point de vue religieux", cond: "La majorité des savants considèrent que le mahram (mari, père, frère, oncle paternel, fils majeur) reste religieusement obligatoire pour le voyage de la femme." },
                      { sit: "Femme mariée", cond: "Peut partir avec son mari. L'acte de mariage peut être demandé lors des formalités." },
                      { sit: "Femme enceinte", cond: "Aucune interdiction légale, mais un certificat médical d'aptitude au voyage est fortement recommandé." },
                      { sit: "Femme en état de menstruation (Hayd)", cond: "Peut voyager et visiter Médine, mais ne peut pas entrer dans la Masjid al-Haram pour le Tawaf jusqu'à la fin de ses règles." }
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="p-4 font-medium">{row.sit}</td>
                        <td className="p-4 text-muted-foreground">{row.cond}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Santé */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Conditions de santé recommandées</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              L'Omra est un pèlerinage physiquement exigeant. Voici ce que vous devez savoir pour partir en sécurité :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  cat: "Recommandé avant le départ",
                  items: ["Bilan de santé général", "Vaccin méningocoque ACWY (obligatoire)", "Vaccin hépatite A recommandé", "Vaccin grippe saisonnière recommandé", "Emporter les médicaments habituels"]
                },
                {
                  cat: "Personnes vulnérables",
                  items: ["Consultation médicale obligatoire", "Seniors : hôtel proche de la mosquée", "Diabétiques : adapter les repas", "Cardiaques : éviter les heures de pointe", "Personnes à mobilité réduite : services dédiés disponibles"]
                },
                {
                  cat: "Sur place",
                  items: ["Restez hydraté (eau Zamzam gratuite)", "Évitez le soleil entre 12h et 16h", "Portez de la crème solaire", "Emportez un brumisateur", "Des médecins français accompagnent certains groupes"]
                }
              ].map((block, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-semibold mb-3 text-sm">{block.cat}</h3>
                  <ul className="space-y-1">
                    {block.items.map((item, j) => (
                      <li key={j} className="text-muted-foreground text-xs flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Questions fréquentes sur les conditions</h2>
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
            <h2 className="text-2xl font-bold mb-3">Vous remplissez les conditions ? Trouvez votre Omra !</h2>
            <p className="text-muted-foreground mb-6">Comparez les offres d'agences agréées et réservez au meilleur prix</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Comparer les offres Omra
              </Link>
              <Link to="/omra-debutant" className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                Guide pour débutant
              </Link>
            </div>
          </section>

          {/* Avis de l'expert */}
          <section className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">F</div>
              <div>
                <p className="font-bold text-foreground">Farid d'Arabie</p>
                <p className="text-sm text-primary mb-3">Expert en pèlerinage islamique · +10 ans à La Mecque · +5 000 pèlerins accompagnés</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  "Parmi les questions les plus fréquentes que me posent les pèlerins avant leur départ : <strong>'Ai-je le droit de partir ?'</strong> La réponse est presque toujours oui. Les conditions de l'Omra sont accessibles à la grande majorité des musulmans de France. Ce qui bloque le plus souvent, ce n'est pas l'éligibilité — c'est l'hésitation. J'ai accompagné des personnes de 18 à 85 ans, des femmes seules, des familles, des malades chroniques. Avec une bonne préparation et une agence sérieuse, tout le monde peut accomplir ce voyage béni."
                </p>
              </div>
            </div>
          </section>

          {/* Internal links */}
          <InternalLinks currentPage="/conditions-omra" />
        </div>
      </div>
    </ResponsiveLayout>
  );
}