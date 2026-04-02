import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { InternalLinks } from '@/components/SEO/InternalLinks';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const faqItems = [
  {
    question: "Combien de fois faut-il faire le tawaf pendant la Omra ?",
    answer: "Pendant la Omra, le tawaf (circumambulation autour de la Kaaba) s'effectue 7 fois dans le sens antihoraire en partant de la Pierre Noire (Hajar al-Aswad). Ce tawaf est obligatoire et fait partie des rites essentiels de la Omra."
  },
  {
    question: "Peut-on faire la Omra sans ihram ?",
    answer: "Non. L'ihram est un pilier de la Omra. Il consiste en une intention (niyya) prononcée au miqat, accompagnée du port de vêtements spécifiques : deux pièces de tissu blanc non cousu pour l'homme, et une tenue islamique couvrante pour la femme. Sans ihram, la Omra n'est pas valide."
  },
  {
    question: "Quelle est la durée minimale pour accomplir la Omra ?",
    answer: "Les rites de la Omra peuvent être accomplis en 3 à 5 heures pour quelqu'un en bonne santé. Cela inclut le tawaf (30-60 min), la prière en 2 rakats, le sa'i entre Safa et Marwa (45-90 min) et le tahallul. La plupart des pèlerins prévoient une journée complète pour prendre leur temps."
  },
  {
    question: "Où est le miqat pour les pèlerins partant de France ?",
    answer: "Pour les pèlerins venant de France par avion, le miqat est Qarn al-Manazil (également appelé As-Sayl al-Kabir), situé à environ 94 km de La Mecque. Les compagnies aériennes annoncent généralement l'approche du miqat pendant le vol pour que les passagers puissent se mettre en état d'ihram à bord."
  },
  {
    question: "Peut-on faire le tawaf en fauteuil roulant ?",
    answer: "Oui, absolument. La Masjid al-Haram dispose d'un niveau supérieur accessible aux personnes à mobilité réduite. Des fauteuils roulants sont disponibles à la location sur place. Le tawaf effectué en fauteuil roulant est tout aussi valide."
  },
  {
    question: "Quelle est la différence entre Omra et Hajj ?",
    answer: "La Omra est un petit pèlerinage réalisable tout au long de l'année. Le Hajj est le grand pèlerinage obligatoire pour tout musulman qui en a les moyens, il ne se tient qu'une fois par an (de Dhu al-Hijja 8 à 13) et comporte des rites supplémentaires : séjour à Mina, station sur la plaine d'Arafat, passage à Muzdalifah, lapidation des djamarat et sacrifice."
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Guide Complet des Rites de la Omra 2026 : Ihram, Tawaf, Sa'i et Tahallul",
  "description": "Guide complet des rites de la Omra : comment se mettre en ihram, effectuer le tawaf, le sa'i entre Safa et Marwa et le tahallul. Étapes détaillées avec conseils pratiques.",
  "url": "https://omrabonsplans.fr/rites-omra",
  "dateModified": "2026-04-01",
  "author": { "@type": "Organization", "name": "Omra Bons Plans" },
  "publisher": {
    "@type": "Organization",
    "name": "Omra Bons Plans",
    "logo": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png"
  }
};

export default function RitesOmra() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Rites de la Omra 2026 : Guide Complet Ihram, Tawaf, Sa'i, Tahallul</title>
        <meta name="description" content="Guide complet des rites de la Omra : ihram au miqat, tawaf autour de la Kaaba, sa'i entre Safa et Marwa, tahallul. Toutes les étapes expliquées pour réussir votre pèlerinage." />
        <meta name="keywords" content="rites omra, comment faire la omra, étapes omra, ihram omra, tawaf kaaba, sai safa marwa, tahallul omra, guide omra 2026" />
        <link rel="canonical" href="https://omrabonsplans.fr/rites-omra" />
        <meta property="og:title" content="Rites de la Omra 2026 : Guide Complet Étapes" />
        <meta property="og:description" content="Toutes les étapes de la Omra expliquées : ihram, tawaf, sa'i et tahallul. Guide pratique pour bien préparer votre pèlerinage." />
        <meta property="og:url" content="https://omrabonsplans.fr/rites-omra" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <SEOBreadcrumb items={[
            { name: 'Accueil', url: '/' },
            { name: 'Guide Omra', url: '/guide-omra-pas-chere' },
            { name: 'Rites de la Omra', url: '/rites-omra' }
          ]} />

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Rites de la Omra 2026 : Guide Complet des Étapes
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              La Omra est composée de 4 rites essentiels à accomplir dans l'ordre. Ce guide détaillé explique chaque étape — de l'ihram au miqat jusqu'au tahallul — pour que vous puissiez accomplir votre pèlerinage en toute sérénité.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">Ihram</Badge>
              <Badge variant="secondary">Tawaf</Badge>
              <Badge variant="secondary">Sa'i</Badge>
              <Badge variant="secondary">Tahallul</Badge>
              <Badge variant="outline">Durée : 3 à 5 heures</Badge>
            </div>
          </header>

          {/* Tableau récapitulatif */}
          <Card className="mb-8 border-primary/20">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Résumé des 4 Rites de la Omra</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary/10">
                      <th className="text-left p-3 font-semibold">Étape</th>
                      <th className="text-left p-3 font-semibold">Lieu</th>
                      <th className="text-left p-3 font-semibold">Durée estimée</th>
                      <th className="text-left p-3 font-semibold">Obligatoire</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-3 font-medium">1. Ihram</td>
                      <td className="p-3">Miqat (avant La Mecque)</td>
                      <td className="p-3">15-30 min</td>
                      <td className="p-3"><span className="text-green-600 font-semibold">Oui (pilier)</span></td>
                    </tr>
                    <tr className="border-t bg-muted/30">
                      <td className="p-3 font-medium">2. Tawaf</td>
                      <td className="p-3">Masjid al-Haram</td>
                      <td className="p-3">45-90 min</td>
                      <td className="p-3"><span className="text-green-600 font-semibold">Oui (pilier)</span></td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-3 font-medium">3. Sa'i</td>
                      <td className="p-3">Entre Safa et Marwa</td>
                      <td className="p-3">45-90 min</td>
                      <td className="p-3"><span className="text-green-600 font-semibold">Oui (pilier)</span></td>
                    </tr>
                    <tr className="border-t bg-muted/30">
                      <td className="p-3 font-medium">4. Tahallul</td>
                      <td className="p-3">N'importe où à La Mecque</td>
                      <td className="p-3">5 min</td>
                      <td className="p-3"><span className="text-green-600 font-semibold">Oui (pilier)</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Étape 1 : Ihram */}
          <section id="ihram" className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">1</span>
              L'Ihram : Entrer dans l'État de Pureté
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              L'ihram est le premier rite de la Omra. Il consiste à entrer dans un état de sacralisation spirituelle et physique avant de franchir le miqat (frontière sacrée autour de La Mecque).
            </p>

            <h3 className="text-lg font-semibold mb-3">Le vêtement d'ihram</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">Pour l'homme</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 2 pièces de tissu blanc non cousu</li>
                    <li>• Izar : tissu enroulé autour de la taille</li>
                    <li>• Rida : tissu drapé sur les épaules</li>
                    <li>• Sandales laissant le dessus du pied nu</li>
                    <li>• Aucune couture ni vêtement cousu</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">Pour la femme</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Tenue islamique couvrante (couleur libre)</li>
                    <li>• Visage et mains doivent rester découverts</li>
                    <li>• Pas de niqab ni de gants pendant les rites</li>
                    <li>• Pas d'interdiction de coutures</li>
                    <li>• Chaussures normales acceptées</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-semibold mb-3">Où prononcer l'intention (niyya) ?</h3>
            <p className="text-muted-foreground mb-3 leading-relaxed">
              L'intention doit être formulée avant ou au niveau du <strong>miqat</strong>. Pour les pèlerins de France arrivant en avion, c'est généralement au niveau de <strong>Qarn al-Manazil (As-Sayl)</strong>, à environ 94 km de La Mecque. Le personnel de bord annonce l'approche du miqat.
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">La formule de l'intention :</p>
              <p className="text-base font-semibold mt-1 text-amber-900 dark:text-amber-100 italic">"Labbayk Allahumma Omratan"</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">"Me voilà, ô Allah, pour accomplir la Omra"</p>
            </div>

            <h3 className="text-lg font-semibold mb-3">Les interdictions pendant l'ihram</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>🚫 Se couper les cheveux ou les ongles</li>
                <li>🚫 Utiliser des parfums</li>
                <li>🚫 Avoir des rapports intimes</li>
                <li>🚫 Contracter un mariage</li>
              </ul>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>🚫 Chasser ou tuer des animaux</li>
                <li>🚫 (Homme) Couvrir la tête</li>
                <li>🚫 (Homme) Porter des vêtements cousus</li>
                <li>🚫 Se disputer ou proférer des paroles obscènes</li>
              </ul>
            </div>
          </section>

          {/* Étape 2 : Tawaf */}
          <section id="tawaf" className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">2</span>
              Le Tawaf : 7 Tours autour de la Kaaba
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Le tawaf consiste à effectuer <strong>7 circumambulations</strong> autour de la Kaaba, dans le sens antihoraire, en commençant et terminant au niveau de la Pierre Noire (Hajar al-Aswad).
            </p>

            <h3 className="text-lg font-semibold mb-3">Conditions du tawaf</h3>
            <ul className="text-sm text-muted-foreground space-y-2 mb-4">
              <li>✅ Être en état de pureté rituelle (wudu)</li>
              <li>✅ Avoir l'intention de faire le tawaf</li>
              <li>✅ Tourner dans le sens antihoraire (la Kaaba toujours à votre gauche)</li>
              <li>✅ Commencer chaque tour au niveau de la Pierre Noire</li>
              <li>✅ Faire les 7 tours de manière continue</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3">La raml et l'idtiba (hommes seulement)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Pour les 3 premiers tours, les hommes sont encouragés à marcher d'un pas vif (<em>raml</em>) et à dégager l'épaule droite (<em>idtiba</em>) en faisant passer le rida sous l'aisselle droite.
            </p>

            <h3 className="text-lg font-semibold mb-3">Toucher ou embrasser la Pierre Noire</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Si vous pouvez vous approcher sans bousculade, touchez ou embrassez la Pierre Noire au début de chaque tour. Si c'est impossible (affluence), pointez-la du doigt et dites : <em>"Bismillah, Allahu Akbar"</em>. Ne forcez jamais le passage : c'est déconseillé et potentiellement dangereux.
            </p>

            <h3 className="text-lg font-semibold mb-3">Prière de 2 rakats après le tawaf</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Après les 7 tours, effectuez 2 rakats derrière le Maqam Ibrahim (si possible) ou n'importe où dans la mosquée. Récitez Sourate Al-Kafiroun (1ère rakat) et Sourate Al-Ikhlas (2ème rakat).
              </p>
            </div>
          </section>

          {/* Étape 3 : Sa'i */}
          <section id="sai" className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">3</span>
              Le Sa'i : Entre Safa et Marwa
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Le sa'i commémore la course de Hajar (Hagar), épouse du prophète Ibrahim (Abraham), entre les collines de Safa et Marwa à la recherche d'eau pour son fils Ismaïl. Il consiste à <strong>parcourir 7 fois</strong> la distance entre les deux collines.
            </p>

            <h3 className="text-lg font-semibold mb-3">Comment effectuer le sa'i</h3>
            <ol className="text-sm text-muted-foreground space-y-3 mb-4">
              <li className="flex gap-2">
                <span className="font-bold text-primary shrink-0">1.</span>
                <span>Commencez par la colline de <strong>Safa</strong>. Montez dessus (ou approchez-vous) et faites face à la Kaaba. Récitez : <em>"Inna as-Safa wal-Marwata min sha'a'irillah"</em> puis faites du dhikr et de la du'a.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary shrink-0">2.</span>
                <span>Marchez vers <strong>Marwa</strong> (environ 450m). Les hommes courent entre les deux panneaux verts lumineux (les femmes marchent normalement).</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary shrink-0">3.</span>
                <span>À <strong>Marwa</strong>, montez dessus et faites face à la Kaaba. Récitez du dhikr et des du'as.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary shrink-0">4.</span>
                <span>Retournez vers Safa. Cela compte pour 2 passages. Répétez jusqu'à 7 passages. Le 7ème se termine à Marwa.</span>
              </li>
            </ol>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Comptage des passages :</p>
              <p className="text-sm text-green-700 dark:text-green-300">Safa→Marwa = 1, Marwa→Safa = 2, Safa→Marwa = 3... jusqu'au 7ème (Safa→Marwa). Vous terminez toujours à Marwa.</p>
            </div>
          </section>

          {/* Étape 4 : Tahallul */}
          <section id="tahallul" className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">4</span>
              Le Tahallul : Sortir de l'État d'Ihram
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Le tahallul est le dernier rite de la Omra. Il marque la fin de l'état d'ihram et consiste à couper ou raser les cheveux.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">Pour l'homme</p>
                  <p className="text-sm text-muted-foreground">Il est recommandé (sunna) de se <strong>raser entièrement la tête</strong>. Couper les cheveux est également valide mais moins méritoire. Un coiffeur est disponible sur place à La Mecque.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">Pour la femme</p>
                  <p className="text-sm text-muted-foreground">La femme ne doit <strong>pas se raser</strong>. Elle coupe une petite mèche de cheveux de la longueur d'un bout du doigt (environ 1 cm) de chaque côté.</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-semibold mb-1">Après le tahallul</p>
              <p className="text-sm text-muted-foreground">
                Votre Omra est accomplie ! Toutes les interdictions de l'ihram sont levées. Vous pouvez reprendre vos vêtements normaux, utiliser du parfum et manger normalement.
              </p>
            </div>
          </section>

          {/* Conseils pratiques */}
          <section id="conseils" className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Conseils Pratiques pour Réussir votre Omra</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Meilleur moment pour les rites</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Nuit (23h-5h) : moins de monde</li>
                    <li>• Évitez vendredi après jumu'a</li>
                    <li>• Évitez les heures de prière obligatoire</li>
                    <li>• Ramadan = très chargé mais très spirituel</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Matériel à emporter</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Bouteille d'eau Zamzam</li>
                    <li>• Tapis de prière petit format</li>
                    <li>• Chapelet (subha) pour le dhikr</li>
                    <li>• Crème solaire et chaussures confortables</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Santé et sécurité</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Hydratez-vous toutes les 30 min</li>
                    <li>• Évitez les heures chaudes (12h-16h)</li>
                    <li>• Restez avec votre groupe</li>
                    <li>• Vaccin méningite ACYW135 obligatoire</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Préparation spirituelle</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Apprendre les du'as essentielles</li>
                    <li>• Lire les rites avant le départ</li>
                    <li>• Choisir une agence avec encadrement</li>
                    <li>• Renouer avec ses proches avant le voyage</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Questions Fréquentes sur les Rites de la Omra</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold mb-2 text-foreground">{item.question}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Liens connexes */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Pour préparer votre Omra</h2>
            <div className="grid md:grid-cols-3 gap-3">
              <Link to="/prix-omra-2026" className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <p className="font-semibold text-sm">Prix Omra 2026</p>
                <p className="text-xs text-muted-foreground mt-1">Combien coûte une Omra ?</p>
              </Link>
              <Link to="/visa-omra-france" className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <p className="font-semibold text-sm">Visa Omra France</p>
                <p className="text-xs text-muted-foreground mt-1">eVisa, documents requis</p>
              </Link>
              <Link to="/liste-bagages-omra" className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <p className="font-semibold text-sm">Liste Bagages Omra</p>
                <p className="text-xs text-muted-foreground mt-1">Tout ce qu'il faut emporter</p>
              </Link>
            </div>
          </section>

          <InternalLinks currentPage="/rites-omra" variant="related" className="mt-8" />
        </div>
      </div>
    </ResponsiveLayout>
  );
}
