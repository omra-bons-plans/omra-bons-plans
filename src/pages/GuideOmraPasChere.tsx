import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { InternalLinks } from '@/components/SEO/InternalLinks';
import { useEffect } from 'react';

const faqs = [
  {
    question: "Quel est le prix moyen d'une Omra pas chère en 2026 ?",
    answer: "En 2026, une Omra économique coûte entre 800€ et 1500€ par personne selon la saison. Hors Ramadan, les prix sont plus bas (800-1200€). Pendant le Ramadan, comptez entre 1800€ et 3000€."
  },
  {
    question: "Quelle est la meilleure période pour une Omra pas chère ?",
    answer: "Les mois les moins chers sont généralement octobre, novembre, janvier et février (hors vacances scolaires). Évitez le Ramadan et les vacances d'été pour des prix plus bas."
  },
  {
    question: "Omra tout compris ou à la carte : que choisir ?",
    answer: "Le tout compris est souvent plus économique car les agences négocient des tarifs de groupe. La formule à la carte peut convenir si vous avez des contacts sur place ou si vous êtes très flexible."
  },
  {
    question: "Comment vérifier la fiabilité d'une agence Omra pas chère ?",
    answer: "Vérifiez que l'agence est agréée par le ministère du Hajj saoudien, consultez les avis Google (minimum 4 étoiles), demandez le numéro de licence ATOUT France, et comparez sur notre comparateur."
  },
  {
    question: "Peut-on faire une Omra pour moins de 1000€ ?",
    answer: "Oui, c'est possible hors saison avec un vol sec + hôtel réservé séparément, ou avec certaines offres flash d'agences. Utilisez notre comparateur pour repérer ces offres."
  }
];

// Inline FAQ Schema component for this page's custom FAQs
function GuidePageFAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  useEffect(() => {
    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer }
      }))
    };
    let scriptTag = document.querySelector('script[data-guide-faq-ld]') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-guide-faq-ld', 'true');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(faqData);
    return () => { document.querySelector('script[data-guide-faq-ld]')?.remove(); };
  }, [faqs]);
  return null;
}

export default function GuideOmraPasChere() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Guide Omra Pas Chère 2026 : Prix, Astuces & Comparatif | Omra Bons Plans</title>
        <meta name="description" content="Guide complet pour organiser une Omra pas chère en 2026. Comparez les prix, découvrez 10 astuces pour économiser, choisissez entre tout compris et à la carte. Conseils d'experts." />
        <meta name="keywords" content="omra pas chère, omra pas cher 2026, prix omra, omra économique, omra budget, omra tout compris pas cher, comparateur omra prix" />
        <link rel="canonical" href="https://omrabonsplans.fr/guide-omra-pas-chere" />
        <meta property="og:title" content="Guide Omra Pas Chère 2026 : Prix, Astuces & Comparatif" />
        <meta property="og:description" content="Guide complet pour organiser une Omra pas chère en 2026. Comparez les prix, découvrez nos astuces pour économiser." />
        <meta property="og:url" content="https://omrabonsplans.fr/guide-omra-pas-chere" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/hero-kaaba-optimized.webp" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Guide Omra Pas Chère 2026 : Prix, Astuces & Comparatif Complet",
            "description": "Guide complet pour organiser une Omra pas chère en 2026.",
            "url": "https://omrabonsplans.fr/guide-omra-pas-chere",
            "datePublished": "2026-01-15",
            "dateModified": "2026-02-20",
            "author": { "@type": "Organization", "name": "Omra Bons Plans" },
            "publisher": {
              "@type": "Organization",
              "name": "Omra Bons Plans",
              "logo": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/logo.svg" }
            },
            "image": {
              "@type": "ImageObject",
              "url": "https://omrabonsplans.fr/hero-kaaba-optimized.webp"
            },
            "mainEntityOfPage": "https://omrabonsplans.fr/guide-omra-pas-chere"
          })}
        </script>
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link to="/omra" itemProp="item" className="hover:text-primary"><span itemProp="name">Accueil</span></Link>
              <meta itemProp="position" content="1" />
              <span className="mx-1">/</span>
            </li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name" className="text-foreground font-medium">Guide Omra Pas Chère</span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
            Guide Complet : Omra Pas Chère en 2026
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Tout ce que vous devez savoir pour organiser une <strong className="text-foreground">Omra pas chère</strong> sans compromis sur la qualité. 
            Prix moyens, astuces d'économie, comparatif tout compris vs à la carte, et erreurs à éviter.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime="2026-02-20">Mis à jour : 20 février 2026</time>
            <span>•</span>
            <span>Temps de lecture : 12 min</span>
          </div>
        </header>

        {/* Table des matières */}
        <nav className="bg-muted/50 rounded-xl p-6 mb-10 border border-border">
          <h2 className="text-lg font-semibold mb-3">📋 Sommaire</h2>
          <ol className="space-y-2 text-sm md:text-base">
            <li><a href="#prix-omra-2026" className="text-primary hover:underline">1. Prix d'une Omra en 2026 : combien ça coûte vraiment ?</a></li>
            <li><a href="#meilleure-periode" className="text-primary hover:underline">2. Quelle est la meilleure période pour une Omra pas chère ?</a></li>
            <li><a href="#10-astuces" className="text-primary hover:underline">3. 10 astuces pour économiser sur votre Omra</a></li>
            <li><a href="#tout-compris-vs-carte" className="text-primary hover:underline">4. Omra tout compris ou à la carte : le comparatif</a></li>
            <li><a href="#choisir-agence" className="text-primary hover:underline">5. Comment choisir une agence fiable et pas chère</a></li>
            <li><a href="#erreurs-eviter" className="text-primary hover:underline">6. Les 5 erreurs qui font exploser le budget</a></li>
            <li><a href="#comparateur" className="text-primary hover:underline">7. Utilisez notre comparateur pour trouver le meilleur prix</a></li>
            <li><a href="#faq" className="text-primary hover:underline">8. Questions fréquentes</a></li>
          </ol>
        </nav>

        <div className="prose prose-lg max-w-none space-y-10">
          {/* Section 1 */}
          <section id="prix-omra-2026">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">1. Prix d'une Omra en 2026 : combien ça coûte vraiment ?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Le prix d'une <strong className="text-foreground">Omra</strong> varie considérablement selon la saison, la formule choisie et la proximité de votre hôtel au Haram. 
              Voici un tableau récapitulatif des prix moyens constatés sur notre comparateur en 2026 :
            </p>
            
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-card rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-primary/10">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-foreground">Période</th>
                    <th className="p-3 text-left text-sm font-semibold text-foreground">Formule Économique</th>
                    <th className="p-3 text-left text-sm font-semibold text-foreground">Formule Confort</th>
                    <th className="p-3 text-left text-sm font-semibold text-foreground">Formule Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="p-3 text-sm">Hors saison (oct-jan)</td><td className="p-3 text-sm font-semibold text-green-600">800€ - 1200€</td><td className="p-3 text-sm">1500€ - 2000€</td><td className="p-3 text-sm">2500€ - 4000€</td></tr>
                  <tr><td className="p-3 text-sm">Vacances scolaires</td><td className="p-3 text-sm">1200€ - 1600€</td><td className="p-3 text-sm">1800€ - 2500€</td><td className="p-3 text-sm">3000€ - 5000€</td></tr>
                  <tr><td className="p-3 text-sm">Ramadan (début)</td><td className="p-3 text-sm">1500€ - 2000€</td><td className="p-3 text-sm">2500€ - 3500€</td><td className="p-3 text-sm">4000€ - 6000€</td></tr>
                  <tr><td className="p-3 text-sm">Ramadan (10 derniers jours)</td><td className="p-3 text-sm">1800€ - 2500€</td><td className="p-3 text-sm">3000€ - 4500€</td><td className="p-3 text-sm">5000€ - 8000€</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Ces prix incluent généralement le <strong className="text-foreground">vol aller-retour</strong>, l'<strong className="text-foreground">hébergement à La Mecque et Médine</strong>, 
              le <strong className="text-foreground">visa Omra</strong> et les transferts. La différence de prix entre économique et premium tient principalement à la distance de l'hôtel au Haram 
              et au nombre d'étoiles. Un hôtel 3 étoiles à 800m du Haram sera nettement moins cher qu'un 5 étoiles avec vue sur la Kaaba.
            </p>
          </section>

          {/* Section 2 */}
          <section id="meilleure-periode">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">2. Quelle est la meilleure période pour une Omra pas chère ?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              La période de voyage est le facteur n°1 qui influence le prix de votre Omra. Voici les périodes classées du moins cher au plus cher :
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">🟢 Moins cher : Octobre à Janvier (hors vacances)</h3>
                <p className="text-sm text-green-700 dark:text-green-400">Prix les plus bas de l'année. Moins de monde au Haram, climat agréable. Idéal pour une première Omra sereine et économique.</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">🟡 Modéré : Février, Mars (hors Ramadan), Avril</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">Prix intermédiaires. La demande augmente à l'approche du Ramadan. Réservez 3 mois à l'avance pour les meilleurs tarifs.</p>
              </div>
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">🔴 Plus cher : Ramadan, été, vacances scolaires</h3>
                <p className="text-sm text-red-700 dark:text-red-400">Prix les plus élevés. Si vous partez pendant le Ramadan, réservez 6 mois à l'avance minimum pour obtenir un bon prix.</p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Astuce :</strong> les offres "last minute" (2-3 semaines avant le départ) peuvent offrir des réductions de 20 à 40%, 
              mais elles sont rares et comportent un risque d'indisponibilité. Préférez une réservation anticipée avec un acompte modéré.
            </p>
          </section>

          {/* Section 3 */}
          <section id="10-astuces">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">3. 10 astuces pour économiser sur votre Omra</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">1</span>
                <div>
                  <h3 className="font-semibold text-foreground">Comparez systématiquement avec un comparateur</h3>
                  <p className="text-muted-foreground text-sm">Les écarts de prix entre agences pour une même prestation peuvent atteindre 30%. Notre <Link to="/omra" className="text-primary hover:underline">comparateur Omra</Link> vous fait gagner du temps et de l'argent.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">2</span>
                <div>
                  <h3 className="font-semibold text-foreground">Partez hors saison</h3>
                  <p className="text-muted-foreground text-sm">Octobre à janvier, vous économisez entre 500€ et 1500€ par rapport au Ramadan, tout en profitant d'un Haram moins bondé.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">3</span>
                <div>
                  <h3 className="font-semibold text-foreground">Optez pour un hôtel à 500-800m du Haram</h3>
                  <p className="text-muted-foreground text-sm">Les hôtels "au pied du Haram" coûtent 2 à 3 fois plus cher. Un hôtel à 10 minutes à pied reste très confortable et vous fait économiser des centaines d'euros.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">4</span>
                <div>
                  <h3 className="font-semibold text-foreground">Réservez en groupe (4 personnes par chambre)</h3>
                  <p className="text-muted-foreground text-sm">Le prix "par personne en chambre quadruple" est toujours le moins cher. En famille ou entre amis, vous pouvez économiser 200 à 400€ par personne.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">5</span>
                <div>
                  <h3 className="font-semibold text-foreground">Réservez 3 à 6 mois à l'avance</h3>
                  <p className="text-muted-foreground text-sm">Les prix augmentent à mesure que la date approche. Les agences offrent souvent des "tarifs early bird" avec des remises de 10 à 15%.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">6</span>
                <div>
                  <h3 className="font-semibold text-foreground">Choisissez un vol avec escale</h3>
                  <p className="text-muted-foreground text-sm">Un vol avec escale à Istanbul ou au Caire peut coûter 150 à 300€ de moins qu'un vol direct. La différence de temps est souvent de seulement 2-3 heures.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">7</span>
                <div>
                  <h3 className="font-semibold text-foreground">Négociez le nombre de nuits</h3>
                  <p className="text-muted-foreground text-sm">Un séjour de 10 nuits au lieu de 14 peut réduire le coût de 20%. Concentrez-vous sur l'essentiel : les rituels et la spiritualité.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">8</span>
                <div>
                  <h3 className="font-semibold text-foreground">Vérifiez ce qui est inclus dans le prix</h3>
                  <p className="text-muted-foreground text-sm">Certains forfaits "pas chers" n'incluent ni le visa, ni les transferts, ni les repas. Comparez le prix total, pas seulement l'affichage.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">9</span>
                <div>
                  <h3 className="font-semibold text-foreground">Partez depuis une ville secondaire</h3>
                  <p className="text-muted-foreground text-sm">Les départs depuis Lyon, Marseille ou Bruxelles sont parfois moins chers que depuis Paris. Comparez les villes de départ sur notre comparateur.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">10</span>
                <div>
                  <h3 className="font-semibold text-foreground">Surveillez les offres flash</h3>
                  <p className="text-muted-foreground text-sm">Les agences publient régulièrement des offres promotionnelles. Activez les alertes sur notre site pour ne rien manquer.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="tout-compris-vs-carte">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">4. Omra tout compris ou à la carte : le comparatif</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              C'est LA grande question que se posent tous les futurs pèlerins. Voici un comparatif objectif pour vous aider à choisir :
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-xl font-bold text-foreground mb-3">✅ Omra Tout Compris</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="text-green-500">+</span> Prix négocié en volume (souvent 15-20% moins cher)</li>
                  <li className="flex gap-2"><span className="text-green-500">+</span> Zéro stress logistique (transferts, visa, guide)</li>
                  <li className="flex gap-2"><span className="text-green-500">+</span> Accompagnement religieux (guide francophone)</li>
                  <li className="flex gap-2"><span className="text-green-500">+</span> Protection juridique (agence agréée)</li>
                  <li className="flex gap-2"><span className="text-red-500">-</span> Moins de flexibilité sur les dates</li>
                  <li className="flex gap-2"><span className="text-red-500">-</span> Programme imposé parfois</li>
                </ul>
                <p className="mt-4 text-sm font-semibold text-foreground">💡 Idéal pour : première Omra, familles, personnes âgées</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-xl font-bold text-foreground mb-3">🔧 Omra À la Carte</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="text-green-500">+</span> Liberté totale sur les dates et la durée</li>
                  <li className="flex gap-2"><span className="text-green-500">+</span> Choix précis de chaque hôtel</li>
                  <li className="flex gap-2"><span className="text-green-500">+</span> Peut être moins cher si vous avez des contacts</li>
                  <li className="flex gap-2"><span className="text-red-500">-</span> Gestion du visa vous-même</li>
                  <li className="flex gap-2"><span className="text-red-500">-</span> Pas de guide religieux inclus</li>
                  <li className="flex gap-2"><span className="text-red-500">-</span> Risque de mauvaises surprises (hôtel, transferts)</li>
                </ul>
                <p className="mt-4 text-sm font-semibold text-foreground">💡 Idéal pour : pèlerins expérimentés, voyageurs autonomes</p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Notre recommandation :</strong> pour une première Omra ou si vous cherchez le meilleur rapport qualité-prix, 
              le <strong className="text-foreground">tout compris reste le choix le plus sûr et souvent le plus économique</strong>. Les agences de notre comparateur 
              sont toutes vérifiées et agréées.
            </p>
          </section>

          {/* Section 5 */}
          <section id="choisir-agence">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">5. Comment choisir une agence fiable et pas chère</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Le choix de l'agence est crucial. Une agence peu scrupuleuse peut transformer votre pèlerinage en cauchemar. Voici les 6 critères à vérifier absolument :
            </p>

            <ol className="space-y-3 mb-6">
              <li className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">1. Licence ATOUT France :</strong> obligatoire pour toute agence de voyage en France. Vérifiez sur le registre officiel des opérateurs de voyage.
              </li>
              <li className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">2. Agrément du ministère du Hajj saoudien :</strong> sans ce numéro, l'agence ne peut pas légalement organiser des Omras. Demandez-le systématiquement.
              </li>
              <li className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">3. Avis Google vérifiés :</strong> minimum 4 étoiles avec plus de 50 avis. Lisez les avis négatifs pour identifier les points faibles récurrents. Consultez notre <Link to="/comparatif-agences" className="text-primary hover:underline">comparatif d'agences</Link>.
              </li>
              <li className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">4. Transparence des prix :</strong> méfiez-vous des prix trop bas sans détail. Une bonne agence détaille vol, hôtel, visa, transferts et assurance.
              </li>
              <li className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">5. Contrat écrit détaillé :</strong> nom des hôtels, compagnie aérienne, nombre de nuits dans chaque ville. Aucune zone de flou.
              </li>
              <li className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">6. Garantie financière :</strong> vérifiez que l'agence dispose d'une garantie financière en cas de faillite (obligatoire en France via l'APST ou un assureur).
              </li>
            </ol>
            
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <p className="text-sm text-foreground">
                📊 <strong>Bon à savoir :</strong> toutes les agences listées sur notre <Link to="/agences-liste" className="text-primary hover:underline">annuaire d'agences</Link> ont été 
                vérifiées par notre équipe. Nous affichons les avis Google réels, les forces et faiblesses de chaque agence.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="erreurs-eviter">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">6. Les 5 erreurs qui font exploser le budget</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-red-400 pl-4">
                <h3 className="font-semibold text-foreground">❌ Erreur n°1 : Réserver au dernier moment</h3>
                <p className="text-muted-foreground text-sm">Les prix peuvent doubler dans les 4 dernières semaines. Réservez 3 à 6 mois à l'avance, surtout pour le Ramadan.</p>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <h3 className="font-semibold text-foreground">❌ Erreur n°2 : Ne pas comparer les agences</h3>
                <p className="text-muted-foreground text-sm">Pour une même prestation (même hôtel, même vol), les écarts de prix entre agences peuvent atteindre 500€. Utilisez toujours un comparateur.</p>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <h3 className="font-semibold text-foreground">❌ Erreur n°3 : Oublier les frais cachés</h3>
                <p className="text-muted-foreground text-sm">Visa non inclus (+100€), assurance (+50€), bagages supplémentaires (+80€), repas non inclus… Ces extras peuvent ajouter 300 à 500€ au prix annoncé.</p>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <h3 className="font-semibold text-foreground">❌ Erreur n°4 : Choisir uniquement sur le prix</h3>
                <p className="text-muted-foreground text-sm">Un prix anormalement bas cache souvent un hôtel loin du Haram, pas de guide, ou une compagnie aérienne peu fiable. Le rapport qualité-prix compte plus que le prix brut.</p>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <h3 className="font-semibold text-foreground">❌ Erreur n°5 : Ne pas lire le contrat</h3>
                <p className="text-muted-foreground text-sm">Vérifiez les conditions d'annulation, le nom exact des hôtels, et les conditions de remboursement. Un bon contrat vous protège en cas de problème.</p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="comparateur">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">7. Utilisez notre comparateur pour trouver le meilleur prix</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Notre <Link to="/omra" className="text-primary font-semibold hover:underline">comparateur Omra</Link> agrège les offres de plus de 15 agences agréées en France. 
              Il est mis à jour quotidiennement et vous permet de filtrer par ville de départ, période, budget et formule. 
              C'est l'outil idéal pour trouver votre <strong className="text-foreground">Omra pas chère</strong> en toute sérénité.
            </p>

            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">🔍 Comparez maintenant</h3>
              <p className="text-muted-foreground mb-4">Plus de 200 offres mises à jour quotidiennement</p>
              <Link 
                to="/omra" 
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Voir les offres Omra
              </Link>
            </div>
          </section>

          {/* Section 8 - FAQ */}
          <section id="faq">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">8. Questions fréquentes sur l'Omra pas chère</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group bg-card border border-border rounded-lg">
                  <summary className="p-4 cursor-pointer font-semibold text-foreground flex justify-between items-center">
                    {faq.question}
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* FAQ Schema - custom for this page */}
        <GuidePageFAQSchema faqs={faqs} />

        {/* Internal Links */}
        <div className="mt-12">
          <InternalLinks />
        </div>
      </article>
    </ResponsiveLayout>
  );
}
