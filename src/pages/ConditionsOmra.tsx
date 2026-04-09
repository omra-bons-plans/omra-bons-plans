import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { InternalLinks } from '@/components/SEO/InternalLinks';

const faqs = [
  {
    question: "Quelles sont les conditions pour faire l'Omra ?",
    answer: "Les conditions principales pour faire l'Omra sont : (1) Être musulman(e), (2) Avoir un passeport valide, (3) Être en bonne santé physique, (4) Avoir le vaccin méningocoque ACWY. Concernant le mahram : selon la loi saoudienne, les femmes n'ont plus besoin de mahram pour effectuer l'Omra depuis 2021. Cependant, d'un point de vue religieux, le mahram reste obligatoire selon la majorité des savants."
  },
  {
    question: "Une femme seule peut-elle faire l'Omra ?",
    answer: "Selon la loi saoudienne, oui : depuis 2021, les femmes de tout âge peuvent partir en Omra sans mahram, en groupe organisé avec une agence agréée. Il n'y a plus de restriction d'âge. Toutefois, d'un point de vue religieux, la majorité des savants considèrent que le mahram (mari, père, frère, oncle) reste obligatoire pour le voyage de la femme. Renseignez-vous auprès de votre agence et de votre référent religieux."
  },
  {
    question: "Faut-il être en bonne santé pour faire l'Omra ?",
    answer: "L'Omra implique beaucoup de marche (5 à 15 km par jour) dans un environnement souvent chaud et bondé. Une bonne condition physique est recommandée. Les personnes âgées, les femmes enceintes et les personnes avec des problèmes de mobilité peuvent partir mais doivent consulter leur médecin au préalable et choisir un hébergement proche de la mosquée."
  },
  {
    question: "Peut-on faire l'Omra avec un visa touriste ?",
    answer: "Non. Vous devez obligatoirement disposer d'un visa Omra spécifique, délivré par une agence agréée par le Ministère Saoudien des Affaires Religieuses. Depuis 2019, l'Arabie Saoudite délivre aussi des e-visas touristiques qui permettent de visiter les lieux non-sacrés, mais les rites de l'Omra nécessitent un visa Omra officiel."
  },
  {
    question: "Les non-musulmans peuvent-ils accompagner pour l'Omra ?",
    answer: "Non. La ville de La Mecque est interdite aux non-musulmans. Seuls les musulmans peuvent entrer dans le périmètre de La Mecque et accomplir l'Omra. Cette règle est strictement appliquée par les autorités saoudiennes avec des contrôles aux entrées de la ville."
  }
];


export default function ConditionsOmra() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Conditions pour Faire l'Omra 2026 : Qui Peut Partir ? | Omra Bons Plans</title>
        <meta name="description" content="Toutes les conditions pour faire l'Omra en 2026 : conditions religieuses, documents obligatoires, règles pour les femmes seules, vaccins et conditions de santé." />
        <meta name="keywords" content="conditions omra, qui peut faire omra, omra femme seule, mahram omra, vaccin omra, documents omra, visa omra conditions" />
        <link rel="canonical" href="https://omrabonsplans.fr/conditions-omra" />
        <meta property="og:title" content="Conditions pour Faire l'Omra 2026 : Guide Complet" />
        <meta property="og:description" content="Conditions religieuses, documents, vaccins, règles pour les femmes : tout ce qu'il faut savoir pour pouvoir partir en Omra en 2026." />
        <meta property="og:url" content="https://omrabonsplans.fr/conditions-omra" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Conditions pour Faire l'Omra 2026 : Qui Peut Partir ?",
          "description": "Guide complet des conditions religieuses, administratives et sanitaires pour partir en Omra en 2026.",
          "url": "https://omrabonsplans.fr/conditions-omra",
          "publisher": {
            "@type": "Organization",
            "name": "Omra Bons Plans",
            "url": "https://omrabonsplans.fr"
          },
          "datePublished": "2025-01-01",
          "dateModified": "2026-01-01",
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
                  title: "Visa Omra",
                  detail: "Le visa Omra est obligatoire. Il est délivré exclusivement par les agences de voyage agréées par le Ministère Saoudien des Affaires Religieuses. Ne tentez pas d'entrer en Arabie Saoudite sans visa Omra valide.",
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
              <Link to="/omra" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Comparer les offres Omra
              </Link>
              <Link to="/omra-debutant" className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
                Guide pour débutant
              </Link>
            </div>
          </section>

          {/* Internal links */}
          <InternalLinks currentPage="/conditions-omra" />
        </div>
      </div>
    </ResponsiveLayout>
  );
}
