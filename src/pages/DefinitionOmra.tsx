import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { InternalLinks } from '@/components/SEO/InternalLinks';

const faqs = [
  {
    question: "L'Omra est-elle obligatoire en Islam ?",
    answer: "Non, l'Omra n'est pas un pilier de l'Islam. Elle est considérée comme une Sunna Mouakada (pratique fortement recommandée). Le Prophète Muhammad (ﷺ) a dit : « L'Omra est une expiation pour les péchés commis entre elle et la précédente. » (Bukhari)"
  },
  {
    question: "Quelle est la différence entre l'Omra et le Hajj ?",
    answer: "Le Hajj est le 5e pilier de l'Islam, obligatoire une fois dans sa vie pour tout musulman qui en a la capacité. L'Omra est un pèlerinage mineur, facultatif, réalisable toute l'année. Le Hajj se pratique uniquement pendant le mois de Dhul Hijja et inclut des rites supplémentaires (station à Arafat, Mina, Muzdalifa)."
  },
  {
    question: "Peut-on faire l'Omra sans parler arabe ?",
    answer: "Oui, parfaitement. Les agences françaises agréées proposent des accompagnateurs francophones qui guident les pèlerins pendant tous les rites. Les invocations (dua) peuvent être récitées en français, seule la Fatiha et quelques formules en arabe sont nécessaires lors du Tawaf et du Sa'i."
  },
  {
    question: "Combien de temps dure une Omra ?",
    answer: "Les rites de l'Omra eux-mêmes durent 3 à 5 heures. Un séjour Omra complet varie de 7 à 14 jours selon les agences. Ce temps permet de visiter Médine, d'accomplir des prières à la Mosquée du Prophète et de profiter pleinement de La Mecque."
  },
  {
    question: "Quel âge minimum pour faire l'Omra ?",
    answer: "Il n'y a pas d'âge minimum officiel. Les enfants sont acceptés et accomplissent l'Omra avec leurs parents. Les bébés en bas âge peuvent accompagner leurs parents. L'important est que l'enfant soit en bonne santé pour supporter le voyage."
  }
];

export default function DefinitionOmra() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Qu'est-ce que l'Omra ? Définition, Conditions & Étapes — Guide 2027</title>
        <meta name="description" content="Définition complète de l'Omra en Islam : signification du mot, différence avec le Hajj, conditions requises, les 4 étapes des rites. Guide 2027 pour musulmans français." />
        <meta name="keywords" content="définition omra, qu'est-ce que l'omra, omra signification, omra islam, différence omra hajj, rites omra explication, pèlerinage mineur islam" />
        <link rel="canonical" href="https://omrabonsplans.fr/definition-omra" />
        <meta property="og:title" content="Qu'est-ce que l'Omra ? Définition complète 2026" />
        <meta property="og:description" content="Définition complète de l'Omra : signification, différence avec le Hajj, conditions et étapes des rites. Guide pour musulmans en France." />
        <meta property="og:url" content="https://omrabonsplans.fr/definition-omra" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/hero-kaaba-optimized.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Qu'est-ce que l'Omra ? Définition complète 2026" />
        <meta name="twitter:description" content="Définition de l'Omra, différence avec le Hajj, conditions et rites expliqués." />
        <meta name="twitter:image" content="https://omrabonsplans.fr/hero-kaaba-optimized.webp" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Qu'est-ce que l'Omra ? Définition, Conditions & Étapes — Guide 2027",
          "description": "Définition complète de l'Omra en Islam pour les musulmans français.",
          "url": "https://omrabonsplans.fr/definition-omra",
          "datePublished": "2026-04-03",
          "dateModified": "2026-08-16",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie", "jobTitle": "Expert en pèlerinage islamique" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "url": "https://omrabonsplans.fr" },
          "image": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/hero-kaaba-optimized.webp" }
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
            { "@type": "ListItem", "position": 2, "name": "Définition Omra", "item": "https://omrabonsplans.fr/definition-omra" }
          ]
        })}</script>
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap gap-1">
            <li>
              <Link to="/" className="hover:text-primary">Accueil</Link>
              <span className="mx-1">/</span>
            </li>
            <li>
              <span className="text-foreground">Définition Omra</span>
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-tight">
          Qu'est-ce que l'Omra ? Définition complète
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          L'Omra est le pèlerinage mineur à La Mecque, réalisable tout au long de l'année par les musulmans du monde entier. Contrairement au Hajj, elle n'est pas obligatoire mais fortement recommandée. Voici tout ce qu'il faut savoir sur sa signification, ses conditions et ses rites.
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
          <p className="text-base font-medium text-foreground italic">
            « Faites se succéder le Hajj et l'Omra, car ils suppriment la pauvreté et les péchés comme le soufflet de forge supprime les impuretés du fer, de l'or et de l'argent. »
          </p>
          <p className="text-sm text-muted-foreground mt-2">— Hadith du Prophète Muhammad ﷺ (Tirmidhi)</p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Définition de l'Omra en Islam</h2>
          <p className="text-base text-muted-foreground mb-4 leading-relaxed">
            Le mot « Omra » (en arabe : عُمْرَة) signifie littéralement « visite » ou « fréquentation d'un lieu peuplé ». En termes islamiques, il désigne le <strong>pèlerinage mineur à La Mecque</strong>, consistant à se rendre à la Masjid al-Haram (la Grande Mosquée de La Mecque) pour accomplir un ensemble de rites spirituels.
          </p>
          <p className="text-base text-muted-foreground mb-4 leading-relaxed">
            L'Omra est classée comme <strong>Sunna Mouakada</strong> (pratique prophétique fortement recommandée) selon la majorité des savants musulmans. Elle n'est pas l'un des cinq piliers de l'Islam, contrairement au Hajj, mais sa valeur spirituelle est immense.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Chaque année, plus de <strong>10 millions de musulmans</strong> accomplissent l'Omra depuis le monde entier, dont environ 50 000 depuis la France. Les agences françaises agréées par le ministère saoudien organisent des séjours encadrés permettant aux pèlerins francophones de réaliser ce voyage dans les meilleures conditions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Omra vs Hajj : quelles différences ?</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm mb-4">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border border-border p-3 text-left font-semibold">Critère</th>
                  <th className="border border-border p-3 text-left font-semibold">Omra</th>
                  <th className="border border-border p-3 text-left font-semibold">Hajj</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-border p-3">Obligation</td><td className="border border-border p-3">Sunna (recommandée)</td><td className="border border-border p-3">Obligatoire (5e pilier)</td></tr>
                <tr className="bg-muted/30"><td className="border border-border p-3">Période</td><td className="border border-border p-3">Toute l'année</td><td className="border border-border p-3">Dhul Hijja uniquement</td></tr>
                <tr><td className="border border-border p-3">Durée des rites</td><td className="border border-border p-3">3 à 5 heures</td><td className="border border-border p-3">5 à 6 jours</td></tr>
                <tr className="bg-muted/30"><td className="border border-border p-3">Lieux visités</td><td className="border border-border p-3">La Mecque uniquement</td><td className="border border-border p-3">Mecque, Mina, Arafat, Muzdalifa</td></tr>
                <tr><td className="border border-border p-3">Prix moyen</td><td className="border border-border p-3">900€ – 3 500€</td><td className="border border-border p-3">6 000€ – 15 000€</td></tr>
                <tr className="bg-muted/30"><td className="border border-border p-3">Répétition</td><td className="border border-border p-3">Autant de fois que souhaité</td><td className="border border-border p-3">Une fois dans sa vie (obligatoire)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Conditions requises pour faire l'Omra</h2>
          <p className="text-base text-muted-foreground mb-4 leading-relaxed">
            Pour accomplir l'Omra, plusieurs conditions islamiques et pratiques doivent être réunies :
          </p>
          <ul className="space-y-3 mb-4">
            {[
              { titre: "Être musulman", desc: "L'Omra est un acte d'adoration exclusivement islamique. Les non-musulmans n'ont pas accès à La Mecque." },
              { titre: "Être en bonne santé", desc: "L'Omra nécessite une capacité physique minimale. Les personnes en situation de handicap sont acceptées, des fauteuils roulants sont disponibles." },
              { titre: "Avoir les ressources financières", desc: "L'Omra ne doit pas être financée par des dettes. Il est recommandé d'attendre d'avoir épargné suffisamment." },
              { titre: "Le Mahram pour les femmes", desc: "Selon la loi saoudienne, les femmes n'ont plus besoin de mahram pour effectuer l'Omra depuis 2021, quel que soit leur âge. Cependant, d'un point de vue religieux, la majorité des savants considèrent que le mahram (mari, père, fils, frère) reste obligatoire." },
              { titre: "Documents officiels", desc: "Passeport valide 6 mois, visa Omra, et vaccin contre la méningite (ACWY) obligatoire." }
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-primary font-bold mt-0.5">✓</span>
                <span className="text-muted-foreground"><strong className="text-foreground">{item.titre} :</strong> {item.desc}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Pour en savoir plus : <Link to="/conditions-omra" className="text-primary hover:underline">Guide complet des conditions Omra 2026</Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Les 4 étapes des rites de l'Omra</h2>
          <div className="space-y-6">
            {[
              {
                num: "1", titre: "L'Ihram — L'état de consécration",
                desc: "Avant d'entrer à La Mecque, le pèlerin revêt l'ihram : deux pièces de tissu blanc non cousu pour l'homme, une tenue blanche modeste pour la femme. Il prononce le Talbiyah : « Labbayk Allahumma Labbayk... » Il entre ainsi dans un état sacré de pureté spirituelle."
              },
              {
                num: "2", titre: "Le Tawaf — Les 7 circumambulations",
                desc: "Le pèlerin effectue 7 tours autour de la Kaaba dans le sens inverse des aiguilles d'une montre. Il s'efforce de toucher ou d'embrasser la Pierre Noire (Hajar al-Aswad) si possible, et récite des invocations (dua) à chaque tour."
              },
              {
                num: "3", titre: "Le Sa'i — Les 7 allers-retours",
                desc: "Le pèlerin fait 7 fois la navette entre les collines de Safa et Marwa, en souvenir de la quête d'eau de Hajar (la femme d'Ibrahim). Cette distance est d'environ 450 mètres, soit 3,15 km au total."
              },
              {
                num: "4", titre: "Le Taqsir ou Halq — La coupe de cheveux",
                desc: "Pour sortir de l'état d'ihram, l'homme se rase le crâne (Halq) ou se coupe les cheveux (Taqsir, au moins 2,5 cm). La femme coupe uniquement une mèche. L'Omra est alors accomplie."
              }
            ].map(step => (
              <div key={step.num} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{step.titre}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            ➜ Guide détaillé : <Link to="/rites-omra" className="text-primary hover:underline">Les rites de l'Omra expliqués étape par étape</Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Quand peut-on faire l'Omra ?</h2>
          <p className="text-base text-muted-foreground mb-4 leading-relaxed">
            L'Omra peut être accomplie <strong>toute l'année</strong>, à l'exception des 5 jours du Hajj (du 8 au 13 Dhul Hijja), pendant lesquels l'entrée à La Mecque est réservée aux pèlerins du Hajj.
          </p>
          <p className="text-base text-muted-foreground mb-4 leading-relaxed">
            La période la plus spirituellement chargée est le <strong>mois de Ramadan</strong>, notamment les 10 derniers jours. Le Prophète ﷺ a dit qu'une Omra pendant le Ramadan équivaut en récompense à un Hajj. Les prix y sont cependant plus élevés.
          </p>
          <p className="text-sm text-muted-foreground">
            ➜ <Link to="/quand-partir-omra" className="text-primary hover:underline">Guide : Quelle est la meilleure période pour partir en Omra ?</Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Combien coûte l'Omra en 2026 ?</h2>
          <p className="text-base text-muted-foreground mb-4 leading-relaxed">
            Le prix d'un séjour Omra depuis la France varie selon la période et la formule choisie :
          </p>
          <ul className="space-y-2 mb-4 text-muted-foreground">
            <li>🟢 <strong>Hors saison</strong> (octobre – février) : 900€ – 1 800€ par personne</li>
            <li>🟡 <strong>Pendant les vacances scolaires</strong> : 1 500€ – 2 500€</li>
            <li>🔴 <strong>Omra Ramadan 2027</strong> : 2 000€ – 4 500€</li>
            <li>🔴 <strong>10 derniers jours Ramadan</strong> : 3 000€ – 6 000€</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-center hover:bg-primary/90 transition-colors">
              Comparer les prix maintenant →
            </Link>
            <Link to="/prix-omra-2026" className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold text-center hover:bg-primary/5 transition-colors">
              Guide des prix Omra 2026
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Questions fréquentes sur l'Omra</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="border border-border rounded-xl p-5 group">
                <summary className="font-semibold text-foreground cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  <span className="text-primary ml-2">+</span>
                </summary>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">F</div>
            <div>
              <p className="font-bold text-foreground">Farid d'Arabie</p>
              <p className="text-sm text-primary mb-3">Expert en pèlerinage islamique</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                "Vivre à La Mecque pendant dix ans m'a permis de voir l'Omra sous un angle rare. <strong>Chaque pèlerin qui accomplit le Tawaf porte une intention unique</strong> — certains pleurent dès le premier regard sur la Kaaba, d'autres ressentent une paix profonde qu'ils n'avaient jamais connue. L'Omra n'est pas un voyage touristique, c'est un retour à l'essentiel. Si vous hésitez encore à partir, sachez que le Prophète ﷺ a dit : 'L'Omra est une expiation des péchés commis entre elle et la suivante.' Il n'existe pas de meilleur moment que maintenant."
              </p>
            </div>
          </div>
        </section>

        <InternalLinks currentPage="/definition-omra" />
      </article>
    </ResponsiveLayout>
  );
}