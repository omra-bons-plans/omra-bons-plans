import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { InternalLinks } from '@/components/SEO/InternalLinks';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';

const faqItems = [
  {
    question: "Quelle est la date du Hajj 2027 ?",
    answer: "Le Hajj 2027 aura lieu du 24 au 29 mai 2027 environ (dates sujettes à confirmation lunaire). Le 9 Dhul Hijja (Jour d'Arafat) sera le 25 mai 2027. Les dates officielles sont annoncées par le Royaume d'Arabie Saoudite avant le mois de Dhul Hijja."
  },
  {
    question: "Quel est le prix du Hajj 2027 ?",
    answer: "Le prix du Hajj 2027 en France varie de 4 500€ à 15 000€+ selon le type de Hajj (Ifrad, Tamattu, Qiran), la durée du séjour, la catégorie d'hôtel et les services inclus. Notre comparateur affiche les prix à jour de plus de 20 agences françaises."
  },
  {
    question: "Quelle est la différence entre Ifrad, Tamattu et Qiran ?",
    answer: "Ifrad : faire le Hajj uniquement sans Omra au préalable. Tamattu : faire d'abord la Omra, puis le Hajj (option la plus populaire). Qiran : faire l'Omra et le Hajj avec une seule intention et un seul ihram. Tous les trois sont valides ; Tamattu est le plus courant et généralement moins cher."
  },
  {
    question: "Comment s'inscrire au Hajj 2027 en France ?",
    answer: "Contactez une agence de voyage agréée (ministère français) spécialisée dans le Hajj. Elle gérera l'inscription via le portail Nusuk du gouvernement saoudien. Vous devez avoir un passeport valide 6+ mois après le Hajj et recevoir une convocation officielle."
  },
  {
    question: "Le Hajj est-il obligatoire pour tous les musulmans ?",
    answer: "Oui, le Hajj est l'un des 5 piliers de l'Islam. Il est obligatoire une fois dans la vie pour tout musulman(e) qui en a les moyens physiquement et financièrement. Les conditions : santé suffisante, ressources financières et sécurité du voyage."
  },
  {
    question: "Peut-on faire le Hajj en groupe sans agence ?",
    answer: "C'est théoriquement possible mais très compliqué : inscription Nusuk, hôtel, transport interne en Arabie Saoudite, accompagnement dans les rites. 99% des pèlerins passent par une agence agréée qui gère tous les détails logistiques."
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

export default function Hajj2027() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Hajj 2027 : Dates, Prix, Inscription et Guide Complet</title>
        <meta name="description" content="Hajj 2027 : dates (24-29 mai), prix (4 500€-15 000€+), inscription Nusuk, types Ifrad/Tamattu/Qiran. Guide et comparateur des meilleures agences françaises." />
        <meta name="keywords" content="hajj 2027, date hajj 2027, prix hajj 2027, inscription hajj, agence hajj france, nusuk, types hajj" />
        <link rel="canonical" href="https://omrabonsplans.fr/hajj-2027" />
        <meta property="og:title" content="Hajj 2027 : Dates, Prix et Guide d'Inscription" />
        <meta property="og:description" content="Tout ce qu'il faut savoir sur le Hajj 2027 : dates, prix, types de Hajj, inscription Nusuk et meilleures agences." />
        <meta property="og:url" content="https://omrabonsplans.fr/hajj-2027" />
        <meta property="og:type" content="article" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Hajj 2027 : Dates, Prix, Inscription et Guide Complet",
          "description": "Hajj 2027 : dates (24-29 mai), prix (4 500€-15 000€+), inscription Nusuk, types Ifrad/Tamattu/Qiran. Guide et comparateur des meilleures agences françaises.",
          "url": "https://omrabonsplans.fr/hajj-2027",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie", "jobTitle": "Expert en pèlerinage islamique" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "url": "https://omrabonsplans.fr" },
          "datePublished": "2025-10-01",
          "dateModified": "2027-04-14",
          "image": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp", "width": 1200, "height": 630 },
          "inLanguage": "fr-FR"
        })}</script>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <SEOBreadcrumb items={[
            { name: 'Accueil', url: '/' },
            { name: 'Hajj', url: '/hajj' },
            { name: 'Hajj 2027', url: '/hajj-2027' }
          ]} />

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Hajj 2027 : Dates, Prix et Guide Complet d'Inscription
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Le Hajj 2027 approche. Découvrez les dates officielles, le comparateur des prix par agence, les types de Hajj, et tout ce que vous devez savoir pour bien vous préparer au plus grand pèlerinage islamique.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Obligatoire</Badge>
              <Badge variant="secondary">Mai 2027</Badge>
              <Badge variant="secondary">10 jours environ</Badge>
              <Badge variant="outline">5e Pilier de l'Islam</Badge>
            </div>
          </header>

          <Alert className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200 ml-2">
              Les dates du Hajj 2027 sont <strong>provisoires</strong> et dépendent de la confirmation lunaire par les autorités saoudiennes. Les dates officielles seront annoncées dans le courant du mois de Dhul Qi'dah 1448 (environ avril 2027).
            </AlertDescription>
          </Alert>

          {/* Dates principales */}
          <section id="dates" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Dates du Hajj 2027</h2>
            <Card className="border-2 border-primary/30 mb-6">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Période estimée :</p>
                    <p className="text-2xl font-bold text-primary">24 - 29 mai 2027</p>
                    <p className="text-xs text-muted-foreground mt-2">(8-13 Dhul Hijja 1448 AH)</p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold text-sm">Jour d'Arafat (Jour crucial)</p>
                      <p className="text-base">≈ 25 mai 2027</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Eid al-Adha</p>
                      <p className="text-base">≈ 26 mai 2027</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-lg font-semibold mb-4">Chronologie des rites (Tamattu)</h3>
            <div className="space-y-3">
              {[
                { jour: "Jour 1", date: "~24 mai", rite: "Ihram à Mina, intention de Hajj" },
                { jour: "Jour 2", date: "~25 mai", rite: "Station à Arafat (Jour d'Arafat) - OBLIGATOIRE", highlight: true },
                { jour: "Jour 3", date: "~26 mai", rite: "Muzdalifah, lapidation début, sacrifice (Eid)" },
                { jour: "Jours 4-5", date: "~27-28 mai", rite: "Lapidation (Jamarat) les autres jours" },
                { jour: "Jour 6", date: "~29 mai", rite: "Tawaf d'adieu (Al-Wada')" }
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-lg border-2 ${item.highlight ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' : 'border-border'}`}>
                  <div className="flex gap-4">
                    <div className="font-bold text-primary">{item.jour}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.rite}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Types de Hajj */}
          <section id="types" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Les 3 Types de Hajj 2027</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-bold mb-3 text-primary">Tamattu (+ populaire)</h3>
                  <p className="text-sm text-muted-foreground mb-3">Faire la Omra d'abord, puis le Hajj.</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✅ Plus facile à organiser</li>
                    <li>✅ Moins cher</li>
                    <li>✅ Moins fatigant</li>
                    <li className="mt-2">Durée : 10-14 jours</li>
                    <li>Prix : 5 000€-12 000€</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-bold mb-3 text-primary">Ifrad</h3>
                  <p className="text-sm text-muted-foreground mb-3">Hajj uniquement, sans Omra.</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✅ Un seul ihram</li>
                    <li>✅ Moins de rituel</li>
                    <li>⚠️ Rituels différents</li>
                    <li className="mt-2">Durée : 7-10 jours</li>
                    <li>Prix : 4 500€-10 000€</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-bold mb-3 text-primary">Qiran</h3>
                  <p className="text-sm text-muted-foreground mb-3">Omra + Hajj en un seul ihram.</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✅ Très spirituel</li>
                    <li>⚠️ Très exigeant</li>
                    <li>⚠️ Plus cher</li>
                    <li className="mt-2">Durée : 10-14 jours</li>
                    <li>Prix : 6 000€-13 000€</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Prix 2027 */}
          <section id="prix" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Prix du Hajj 2027 en France</h2>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Fourchette de prix par catégorie</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span className="font-medium">Hajj Économique (Tamattu)</span>
                    <span className="text-primary font-bold">5 000€ - 7 000€</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span className="font-medium">Hajj Standard (Tamattu)</span>
                    <span className="text-primary font-bold">7 000€ - 10 000€</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span className="font-medium">Hajj Confort (Tamattu)</span>
                    <span className="text-primary font-bold">10 000€ - 15 000€</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span className="font-medium">Hajj Luxe</span>
                    <span className="text-primary font-bold">15 000€+</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-lg font-semibold mb-3">Ce qui est généralement inclus</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="pt-4">
                  <p className="font-semibold text-sm mb-2">Inclus ✅</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Vol France ↔ Jeddah</li>
                    <li>• Hébergement à La Mecque & Médine</li>
                    <li>• Transport terrestre en Arabie</li>
                    <li>• Encadrement groupe</li>
                    <li>• Visa Hajj</li>
                    <li>• Assurance basique</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="font-semibold text-sm mb-2">Souvent non inclus ❌</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Vaccins/frais médicaux</li>
                    <li>• Repas supplémentaires</li>
                    <li>• Excursions optionnelles</li>
                    <li>• Assurance annulation</li>
                    <li>• Primes de guide privé</li>
                    <li>• Transport aéroport</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Comment s'inscrire */}
          <section id="inscription" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Comment S'inscrire au Hajj 2027</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">1</span>
                <div>
                  <p className="font-semibold">Choisir une agence agréée</p>
                  <p className="text-sm text-muted-foreground">Vérifiez l'agrément ATOUT FRANCE et la réputation. Consultez notre comparateur pour voir les avis et prix.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">2</span>
                <div>
                  <p className="font-semibold">Vérifier votre passeport</p>
                  <p className="text-sm text-muted-foreground">Passeport valide 6+ mois après le Hajj. Si expiration prévue, faites renouveler avant de vous inscrire.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">3</span>
                <div>
                  <p className="font-semibold">Inscrire auprès de l'agence</p>
                  <p className="text-sm text-muted-foreground">Versement acompte (généralement 1 500-2 000€). L'agence gère l'inscription Nusuk auprès du gouvernement saoudien.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">4</span>
                <div>
                  <p className="font-semibold">Recevoir la convocation officielle</p>
                  <p className="text-sm text-muted-foreground">L'Arabie Saoudite envoie une convocation officielle avec dates, hôtel et groupe. Cette étape peut prendre plusieurs mois.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">5</span>
                <div>
                  <p className="font-semibold">Acquitter le solde</p>
                  <p className="text-sm text-muted-foreground">Versement complet 2-3 mois avant le Hajj. Les détails finaux (vols exacts, horaires) sont confirmés à ce moment.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0">6</span>
                <div>
                  <p className="font-semibold">Se préparer et partir</p>
                  <p className="text-sm text-muted-foreground">Vaccination méningite ACYW135 obligatoire. Préparation spirituelle et physique. Décollage fin mai 2027.</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Hajj vs Omra */}
          <section id="difference" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Différence entre Hajj et Omra</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="text-left p-3 font-semibold">Critère</th>
                    <th className="text-left p-3 font-semibold">Omra</th>
                    <th className="text-left p-3 font-semibold">Hajj</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3 font-medium">Obligatoire</td>
                    <td className="p-3">Non (recommandé)</td>
                    <td className="p-3 text-red-600 font-semibold">Oui (5e pilier)</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3 font-medium">Période</td>
                    <td className="p-3">Toute l'année</td>
                    <td className="p-3">Dhul Hijja uniquement</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 font-medium">Durée</td>
                    <td className="p-3">3-5 heures rituels</td>
                    <td className="p-3">10 jours complets</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3 font-medium">Rituel principal</td>
                    <td className="p-3">Tawaf + Sa'i</td>
                    <td className="p-3">Arafat + Mina + Muzdalifah</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 font-medium">Prix moyen</td>
                    <td className="p-3">800€ - 2 500€</td>
                    <td className="p-3">5 000€ - 15 000€+</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3 font-medium">Difficulté</td>
                    <td className="p-3">Facile</td>
                    <td className="p-3">Très difficile physiquement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Questions Fréquentes sur le Hajj 2027</h2>
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
            <h2 className="text-xl font-bold mb-4">Pour préparer votre Hajj</h2>
            <div className="grid md:grid-cols-3 gap-3">
              <Link to="/" className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <p className="font-semibold text-sm">Comparateur Hajj 2027</p>
                <p className="text-xs text-muted-foreground mt-1">Voir toutes les offres</p>
              </Link>
              <Link to="/meilleure-agence-omra" className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <p className="font-semibold text-sm">Meilleures Agences</p>
                <p className="text-xs text-muted-foreground mt-1">Classement et critères</p>
              </Link>
              <Link to="/liste-bagages-omra" className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <p className="font-semibold text-sm">Liste Bagages</p>
                <p className="text-xs text-muted-foreground mt-1">Quoi emporter</p>
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
                  "Le Hajj est une expérience qui dépasse toute description — la station à Arafat, les millions de pèlerins en ihram blanc, c'est l'image la plus puissante de l'unité de l'Islam. <strong>Ma recommandation pour les Français : ne partez jamais au Hajj sans une agence agréée fiable</strong>. L'inscription Nusuk, les hôtels à Mina, les transports vers Muzdalifah — c'est une logistique colossale que vous ne pouvez pas gérer seul. Choisissez votre agence sur la qualité de l'accompagnement, pas sur le prix. Un Hajj bien encadré change une vie."
                </p>
              </div>
            </div>
          </section>

          <InternalLinks currentPage="/hajj-2027" variant="related" className="mt-8" />
        </div>
      </div>
    </ResponsiveLayout>
  );
}
