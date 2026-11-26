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

export default function ListeBagagesOmra() {
  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Liste Complète Bagages Omra 2027 : Homme & Femme Détaillée</title>
        <meta name="description" content="Liste bagages Omra homme et femme : vêtements ihram, documents, médicaments. Checklist complète à imprimer pour votre pèlerinage 2026." />
        <meta name="keywords" content="liste bagages omra, quoi emporter omra, valise omra, vetements omra, vêtements ihram, liste packing omra" />
        <link rel="canonical" href="https://omrabonsplans.fr/liste-bagages-omra" />
        <meta property="og:title" content="Liste Bagages Omra 2027 : Tout Ce Qu'il Faut Emporter" />
        <meta property="og:description" content="Checklist complète de tous les bagages pour la Omra : documents, vêtements ihram, médicaments, hygiène. Guides homme et femme séparés." />
        <meta property="og:url" content="https://omrabonsplans.fr/liste-bagages-omra" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Liste Complète Bagages Omra 2027 : Homme & Femme Détaillée",
          "description": "Liste bagages Omra homme et femme : vêtements ihram, documents, médicaments. Checklist complète à imprimer pour votre pèlerinage 2026.",
          "url": "https://omrabonsplans.fr/liste-bagages-omra",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie", "jobTitle": "Expert en pèlerinage islamique" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "url": "https://omrabonsplans.fr" },
          "datePublished": "2025-11-01",
          "dateModified": "2026-08-16",
          "image": { "@type": "ImageObject", "url": "https://omrabonsplans.fr/og-omra-debutant.jpg", "width": 1200, "height": 630 },
          "inLanguage": "fr-FR"
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Quel poids de bagage peut-on emporter pour la Omra ?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "La plupart des vols France-Arabie Saoudite autorisent 23 kg de bagage enregistré + 7-10 kg de bagage cabine. Vérifiez auprès de votre agence ou compagnie aérienne car les limites varient. L'ihram seul pèse très léger (< 1 kg)."
              }
            },
            {
              "@type": "Question",
              "name": "Faut-il apporter des vêtements de rechange ihram ?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui, c'est recommandé. Apportez 2-3 sets d'ihram : un pour les rites, les autres pour vous changer si besoin ou pour avoir une réserve propre. Le nettoyage sur place est lent en haute saison."
              }
            },
            {
              "@type": "Question",
              "name": "Les chaussures sont-elles essentielles ?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Les chaussures ne sont pas obligatoires pour le tawaf et le sa'i, mais fortement recommandées. Choisissez des sandales ou tongs légères et confortables. Les sols peuvent être très chauds et les distances longues (sa'i = 450m)."
              }
            },
            {
              "@type": "Question",
              "name": "Puis-je apporter mes médicaments prescrits ?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Oui, les médicaments prescrits avec ordonnance sont autorisés. Gardez l'ordonnance avec vous en cas de contrôle douanier. Pour les médicaments contrôlés, consultez l'ambassade de l'Arabie Saoudite pour les restrictions spécifiques."
              }
            }
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <SEOBreadcrumb items={[
            { name: 'Accueil', url: '/' },
            { name: 'Préparer sa Omra', url: '/guide-omra-pas-chere' },
            { name: 'Liste Bagages', url: '/liste-bagages-omra' }
          ]} />

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Liste Complète des Bagages pour la Omra 2027</h1>
            <p className="text-lg text-muted-foreground">
              Checklist détaillée de tous les bagages à emporter pour votre Omra. Guides séparés pour homme et femme avec des conseils pratiques et une liste à imprimer.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">Homme & Femme</Badge>
              <Badge variant="secondary">23 kg autorisés</Badge>
              <Badge variant="outline">À imprimer</Badge>
            </div>
          </header>

          <section id="documents" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">📄 Documents Essentiels (À ne pas oublier !)</h2>
            <Card className="border-red-300 bg-red-50 dark:bg-red-900/20 mb-6">
              <CardContent className="pt-4">
                <p className="text-sm text-red-800 dark:text-red-200 font-semibold">⚠️ Conseil : Placez ces documents dans une pochette séparée et gardez-les toujours avec vous en cabine. Faire des copies numériques dans le cloud.</p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {[
                { item: "Passeport", detail: "Valide 6+ mois après la Omra (CRUCIAL)" },
                { item: "Visa Omra/Hajj", detail: "Fourni par l'agence ou obtenu en ligne" },
                { item: "Billet d'avion", detail: "Copie papier + version numérique" },
                { item: "Assurance voyage", detail: "Document complet avec numéro contrat" },
                { item: "Ordonnances médicales", detail: "Pour les médicaments prescrits" },
                { item: "Certificat de vaccination", detail: "Méningite ACYW135 obligatoire" },
                { item: "Carnet de santé", detail: "Avec antécédents médicaux importants" },
                { item: "Carte vitale / Couverture sociale", detail: "Pour tout besoin médical urgence" },
                { item: "Coordonnées d'urgence", detail: "Famille et ambassade de France" },
                { item: "Adresse agence/hôtel", detail: "Imprimée et dans téléphone" }
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg border border-border flex gap-3">
                  <Check className="h-5 w-5 text-green-600 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.item}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="vetements-homme" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">👕 Vêtements pour l'Homme</h2>

            <h3 className="text-lg font-semibold mb-3">L'Ihram (Vêtement Sacré)</h3>
            <Card className="mb-4">
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>3 sets d'ihram blanc</strong> (2 pièces de tissu blanc non cousu = izar + rida)</span></li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>1 paire de sandales</strong> (tongs légères, permettant le pied nu)</span></li>
                  <li className="flex gap-2"><X className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" /> <span>❌ PAS de ceinture, de chaussures fermées, ni de chapeau</span></li>
                </ul>
              </CardContent>
            </Card>

            <h3 className="text-lg font-semibold mb-3">Vêtements de Voyage & Quotidien</h3>
            <div className="space-y-2 text-sm">
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 5-6 t-shirts ou chemises légères</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 2 pantalons légers (coton)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 1 short ample (pour la maison/hôtel)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 7 caleçons/boxers</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 7 paires de chaussettes</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 1 pull ou gilet (climatisation forte)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 1 pyjama léger</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 2 paires de chaussures de ville légères</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 1 veste ou imperméable léger (pluie possible en juin)</li>
            </div>
          </section>

          <section id="vetements-femme" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">👗 Vêtements pour la Femme</h2>

            <h3 className="text-lg font-semibold mb-3">L'Ihram (Tenue Islamique)</h3>
            <Card className="mb-4">
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>2-3 abayas ou tenues longues épaisses</strong> (couvrant bras et jambes)</span></li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>1-2 hijabs</strong> (couleur libre, pas niqab obligatoire durant rites)</span></li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> <span><strong>Chaussures confortables</strong> (pas besoin de pieds nus)</span></li>
                  <li className="flex gap-2"><X className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" /> <span>❌ PAS de niqab/gants pendant le tawaf/sa'i (haram)</span></li>
                </ul>
              </CardContent>
            </Card>

            <h3 className="text-lg font-semibold mb-3">Vêtements de Voyage & Quotidien</h3>
            <div className="space-y-2 text-sm">
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 5-6 t-shirts/tops longs (manches 3/4)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 2-3 pantalons longs ou jupes longues</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 1 robe longue légère</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 6-7 sous-vêtements</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 5-6 hijabs (diverses couleurs, tissus légers)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 7 paires de chaussettes/collants fins</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 1 pull léger / cardigan</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 1 pyjama long léger</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 2 paires de chaussures fermées légères</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> 1 imperméable léger</li>
            </div>
          </section>

          <section id="sante" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">💊 Médicaments & Santé</h2>
            <div className="space-y-3">
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Médicaments à emporter</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Vos médicaments habituels (en double dose)</li>
                    <li>• Anti-diarrhéique (imodium ou similaire)</li>
                    <li>• Antibiotique léger (si prescrit)</li>
                    <li>• Anti-douleur (paracétamol, ibuprofène)</li>
                    <li>• Antihistaminique (allergie)</li>
                    <li>• Pommade antibiotique pour plaies</li>
                    <li>• Sparadrap et petits pansements</li>
                    <li>• Crème solaire haute protection (SPF 50)</li>
                    <li>• Baume à lèvres SPF</li>
                    <li>• Collyre/gouttes yeux (poussière)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Vaccins obligatoires</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✅ <strong>Méningite ACYW135</strong> (obligatoire 10 jours avant)</li>
                    <li>📋 Recommandé : Fièvre typhoïde, Hépatite A, ROR</li>
                    <li>🩺 Carnet international de vaccination à présenter</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Hygiène personnelle</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Savon (pains de savon résistants)</li>
                    <li>• Shampooing/conditionneur (petit format)</li>
                    <li>• Déodorant</li>
                    <li>• Brosse à dents + dentifrice</li>
                    <li>• Fil dentaire</li>
                    <li>• Rasoir/mousse à raser (homme)</li>
                    <li>• Serviettes hygiéniques (femme)</li>
                    <li>• Papier toilette/serviettes humides</li>
                    <li>• Gel/spray antibactérien</li>
                    <li>• Mouchoirs jetables</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="electronique" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">📱 Électronique & Technologie</h2>
            <div className="space-y-2 text-sm">
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Téléphone + câble USB + chargeur adaptateur (220V international)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Powerbank (20 000 mAh)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Adaptateur prise électrique (Arabie Saoudite = prises UK/US)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Carte SIM locale ou forfait international (vérifier avec agence)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Application Quran sur téléphone (offline)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Application GPS (offline maps)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Appareil photo (optionnel)</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /> Écouteurs/casque (prière, confort)</li>
            </div>
          </section>

          <section id="divers" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">🎒 Divers & Accessoires</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Card>
                <CardContent className="pt-3">
                  <p className="font-semibold text-sm mb-2">À emporter</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Chapelet (subha)</li>
                    <li>• Petit tapis de prière pliable</li>
                    <li>• Petit Quran/livre d'invocations</li>
                    <li>• Sac à dos/sacoche jour</li>
                    <li>• Parapluie pliable</li>
                    <li>• Lunettes de soleil</li>
                    <li>• Chapeau/casquette léger</li>
                    <li>• Mouchoirs x 2 paquets</li>
                    <li>• Gants coton légers (soleil)</li>
                    <li>• Montre</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-3">
                  <p className="font-semibold text-sm mb-2">Argent & Documents</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Espèces (400-500€ minimum)</li>
                    <li>• Carte bancaire Visa/MC</li>
                    <li>• Numéro urgence assurance</li>
                    <li>• Numéro agence/guide</li>
                    <li>• Email d'hôtel/transport</li>
                    <li>• Photos ID en numérique</li>
                    <li>• Cadeaux petits pour amis (optionnel)</li>
                    <li>• Carnet/stylo</li>
                    <li>• Lampe torche petite</li>
                    <li>• Sachet hermétique (documents)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="interdit" className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-red-600">❌ À NE PAS Emporter</h2>
            <Card className="border-red-300 bg-red-50 dark:bg-red-900/20">
              <CardContent className="pt-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>❌ Alcool (strictement interdit)</li>
                    <li>❌ Porc ou produits porc</li>
                    <li>❌ Drogues/substances illégales</li>
                    <li>❌ Viande non halal</li>
                    <li>❌ Matériel pornographique</li>
                    <li>❌ Littérature religieuse comparée</li>
                  </ul>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>❌ Couteaux/objets tranchants</li>
                    <li>❌ Gaz lacrymogène</li>
                    <li>❌ Clones de cartes bancaires</li>
                    <li>❌ Documents falsifiés</li>
                    <li>❌ Valises trop lourdes (surpoids = frais)</li>
                    <li>❌ Vêtements trop serrés/transparents</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Conseils de Packing Finaux</h2>
            <Card>
              <CardContent className="pt-4 space-y-3 text-sm text-muted-foreground">
                <p>✅ <strong>Faites une liste</strong> 2 semaines avant et cochez au fur et à mesure</p>
                <p>✅ <strong>Vérifiez le poids</strong> à la maison avant de partir (balance)</p>
                <p>✅ <strong>Gardez la légèreté</strong> : vous porterez votre bagage vous-même</p>
                <p>✅ <strong>Mettez les lourds au fond</strong> de la valise (chaussures)</p>
                <p>✅ <strong>Utilisez des sacs de compression</strong> pour gagner de l'espace</p>
                <p>✅ <strong>Laissez de la place</strong> pour les achats (cadeaux, zamzam en poudre)</p>
                <p>✅ <strong>Doucement avec les bougies/parfums</strong> (restrictions transport aérien)</p>
              </CardContent>
            </Card>
          </section>

          <InternalLinks currentPage="/liste-bagages-omra" variant="related" className="mt-8" />
        </div>
      </div>
    </ResponsiveLayout>
  );
}