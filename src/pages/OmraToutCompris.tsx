import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { InternalLinks } from '@/components/SEO/InternalLinks';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Check from 'lucide-react/dist/esm/icons/check';
import X from 'lucide-react/dist/esm/icons/x';

export default function OmraToutCompris() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Omra Tout Compris 2026 : Forfaits et Meilleures Offres</title>
        <meta name="description" content="Omra tout compris 2026 : forfaits all-inclusive, comparatif agences, prix (1 200€-4 000€). Vol, hôtel, transport, repas inclus. Réservez le meilleur package." />
        <meta name="keywords" content="omra tout compris, forfait omra, séjour omra tout compris, omra all inclusive, package omra pas cher" />
        <link rel="canonical" href="https://omrabonsplans.fr/omra-tout-compris" />
        <meta property="og:title" content="Omra Tout Compris 2026 : Les Meilleures Offres" />
        <meta property="og:description" content="Omra tout compris : forfaits all-inclusive avec vol + hôtel + repas. Comparatif des meilleures agences et prix." />
        <meta property="og:url" content="https://omrabonsplans.fr/omra-tout-compris" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Qu'est-ce que la Omra tout compris ?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "La Omra tout compris (all-inclusive) est un forfait où tous les frais sont inclus : vol international France-Jeddah, hébergement à La Mecque et Médine, petit-déjeuner et dîner, transport terrestre en bus, encadrement groupe et visa Hajj. Le pèlerin n'a à payer que les repas supplémentaires et dépenses personnelles."
              }
            },
            {
              "@type": "Question",
              "name": "Quel est le prix moyen de la Omra tout compris ?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Le prix moyen de la Omra tout compris 2026 varie de 1 200€ pour les packages économiques 3-étoiles à 4 000€+ pour les forfaits luxury 5-étoiles. La majorité des agences proposent des packages entre 1 800€ et 2 800€ pour un bon rapport qualité-prix."
              }
            },
            {
              "@type": "Question",
              "name": "La Omra tout compris ou à la carte : quel est le mieux ?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Omra tout compris : avantage pour pèlerins tranquilles, groupe soudé, pas de soucis logistiques. À la carte : avantage pour voyageurs indépendants, liberté d'horaires, possibilité de faire des économies. Les couples/familles préfèrent à la carte ; les personnes seules préfèrent tout compris."
              }
            },
            {
              "@type": "Question",
              "name": "Peut-on voyager seul en tout compris ?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui, absolument. La Omra tout compris est même recommandée pour les pèlerins seuls : encadrement groupe dès l'aéroport, transport fourni, repas collectifs, sécurité. L'isolement et l'angoisse sont mineurs. La plupart des pèlerins tout compris sont des personnes seules."
              }
            }
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <SEOBreadcrumb items={[
            { name: 'Accueil', url: '/' },
            { name: 'Omra', url: '/omra' },
            { name: 'Tout Compris', url: '/omra-tout-compris' }
          ]} />

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Omra Tout Compris 2026 : Guide Complet et Meilleures Offres</h1>
            <p className="text-lg text-muted-foreground">
              Découvrez les meilleures offres de Omra tout compris : forfaits all-inclusive avec vol, hôtel, repas et encadrement. Comparatif agences et prix actualisés.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">Vol inclus</Badge>
              <Badge variant="secondary">Hôtel inclus</Badge>
              <Badge variant="secondary">Repas inclus</Badge>
              <Badge variant="outline">1 200€-4 000€</Badge>
            </div>
          </header>

          <section id="definition" className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Qu'est-ce qu'un Forfait Omra Tout Compris ?</h2>
            <p className="text-muted-foreground mb-4">
              Un forfait Omra tout compris (all-inclusive) signifie que <strong>tous les frais principaux sont inclus dans le prix</strong>. Le pèlerin paie un tarif global et ne doit gérer aucune réservation supplémentaire pendant le voyage.
            </p>
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-3">Ce qui est inclus ✅</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Vol international aller-retour</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Hôtel La Mecque & Médine</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Petit-déjeuner & dîner</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Transport terrestre (bus)</li>
                  </ul>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Visa Hajj/Omra</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Encadrement groupe</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Assurance basique</li>
                    <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Transferts aéroport</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-3">À prévoir en plus ❌</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><X className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" /> Repas du midi (libre)</li>
                    <li className="flex gap-2"><X className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" /> Boissons & snacks</li>
                  </ul>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><X className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" /> Shopping & cadeaux</li>
                    <li className="flex gap-2"><X className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" /> Vaccins & frais personnels</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="prix" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Prix Omra Tout Compris 2026</h2>
            <div className="space-y-3">
              {[
                { cat: "Économique (3★)", prix: "1 200€ - 1 500€", hotel: "Hôtel 3 étoiles", dist: "1-2 km du Haram" },
                { cat: "Standard (4★)", prix: "1 800€ - 2 500€", hotel: "Hôtel 4 étoiles", dist: "500m-1 km du Haram" },
                { cat: "Confort (4-5★)", prix: "2 500€ - 3 500€", hotel: "Hôtel 4-5 étoiles", dist: "100-500m du Haram" },
                { cat: "Luxury (5★)", prix: "3 500€ - 4 000€+", hotel: "5 étoiles prestige", dist: "Vue Kaaba/très proche" }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold">{item.cat}</p>
                    <p className="text-primary font-bold text-lg">{item.prix}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.hotel}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.dist}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="comparatif" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Comparatif : Tout Compris vs À la Carte</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="text-left p-3 font-semibold">Critère</th>
                    <th className="text-center p-3 font-semibold">Tout Compris</th>
                    <th className="text-center p-3 font-semibold">À la Carte</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">Prix total</td>
                    <td className="p-3 text-center">1 200€-4 000€</td>
                    <td className="p-3 text-center">800€-2 000€</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3">Facilité organisation</td>
                    <td className="p-3 text-center">⭐⭐⭐⭐⭐</td>
                    <td className="p-3 text-center">⭐⭐</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Flexibilité horaires</td>
                    <td className="p-3 text-center">⭐⭐</td>
                    <td className="p-3 text-center">⭐⭐⭐⭐</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="p-3">Accompagnement</td>
                    <td className="p-3 text-center">Très bon</td>
                    <td className="p-3 text-center">Aucun</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Idéal pour</td>
                    <td className="p-3 text-center">Seul / Couples</td>
                    <td className="p-3 text-center">Groupes / Experts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="agences" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Top Agences pour la Omra Tout Compris</h2>
            <p className="text-muted-foreground mb-4">
              Consultez notre <Link to="/agences-liste" className="text-primary font-semibold hover:underline">liste complète des agences</Link> et notre <Link to="/comparatif-agences" className="text-primary font-semibold hover:underline">comparatif visuel</Link> pour voir les offres actualisées.
            </p>
            <p className="text-sm text-muted-foreground">
              Les meilleurs packages tout compris sont proposés par : <strong>Tawaf, Medinvoyages, Al-Maqam, Omra Discount, Pèlerinhajj, Labbayk, Omra Sounnah, Sabil Voyages</strong>.
            </p>
          </section>

          <section id="conseils" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Conseils pour Bien Choisir votre Forfait</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">✅ À vérifier avant de réserver</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Distance hôtel au Haram</li>
                    <li>• Nombre de nuits</li>
                    <li>• Nombre de repas inclus</li>
                    <li>• Assurance annulation</li>
                    <li>• Qualité des avis Google</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">⚠️ Points d'attention</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Acompte : quelle % ?</li>
                    <li>• Délai remboursement annul.</li>
                    <li>• Guide parlant français ?</li>
                    <li>• Regroupement à quel aéroport ?</li>
                    <li>• Services supplémentaires payants</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <InternalLinks currentPage="/omra-tout-compris" variant="related" className="mt-8" />
        </div>
      </div>
    </ResponsiveLayout>
  );
}
