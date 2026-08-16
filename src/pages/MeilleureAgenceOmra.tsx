import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { InternalLinks } from '@/components/SEO/InternalLinks';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Star from 'lucide-react/dist/esm/icons/star';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';

export default function MeilleureAgenceOmra() {
  const agences = [
    {
      rank: 1,
      nom: "Tawaf",
      note: 4.8,
      avis: 520,
      prix: "1 500€-3 500€",
      forces: ["Sérieux reconnu", "Encadrement excellent", "Hôtels proches Haram"]
    },
    {
      rank: 2,
      nom: "Medinvoyages",
      note: 4.7,
      avis: 380,
      prix: "1 400€-3 200€",
      forces: ["Prix compétitifs", "Service relation client", "Facilités paiement"]
    },
    {
      rank: 3,
      nom: "Al-Maqam",
      note: 4.6,
      avis: 310,
      prix: "1 600€-3 800€",
      forces: ["Hôtels 4-5 étoiles", "Groupes moins chargés", "Visites optionnelles"]
    },
    {
      rank: 4,
      nom: "Omra Discount",
      note: 4.5,
      avis: 290,
      prix: "999€-2 500€",
      forces: ["Prix les plus bas", "Omra pas chère", "Paiement flexible"]
    },
    {
      rank: 5,
      nom: "Pèlerinhajj",
      note: 4.6,
      avis: 340,
      prix: "1 700€-4 000€",
      forces: ["Expertise Hajj", "Séjours longs", "Qualité premium"]
    }
  ];

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>Meilleure Agence Omra 2026 : Classement et Guide de Choix</title>
        <meta name="description" content="Meilleure agence omra 2026 : classement des 5 meilleures (Tawaf, Medinvoyages, Al-Maqam), critères de sélection et questions essentielles à poser." />
        <meta name="keywords" content="meilleure agence omra, quelle agence omra choisir, agence omra fiable, classement agences omra france, comparatif agences" />
        <link rel="canonical" href="https://omrabonsplans.fr/meilleure-agence-omra" />
        <meta property="og:title" content="Meilleure Agence Omra : Top 5 2026" />
        <meta property="og:description" content="Classement des meilleures agences Omra avec critères de sélection et guide complet de choix." />
        <meta property="og:url" content="https://omrabonsplans.fr/meilleure-agence-omra" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Meilleure Agence Omra 2026 : Classement et Guide de Choix",
          "description": "Classement des 5 meilleures agences Omra en France basé sur les avis Google, critères de fiabilité et guide complet pour bien choisir.",
          "url": "https://omrabonsplans.fr/meilleure-agence-omra",
          "author": { "@type": "Person", "@id": "https://omrabonsplans.fr/about#farid", "name": "Farid d'Arabie", "jobTitle": "Expert en pèlerinage islamique" },
          "publisher": { "@type": "Organization", "name": "Omra Bons Plans", "url": "https://omrabonsplans.fr" },
          "datePublished": "2025-01-01",
          "dateModified": "2026-08-16",
          "inLanguage": "fr-FR"
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Quelle est la meilleure agence Omra en France ?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "La question de la meilleure agence Omra n'a pas de réponse universelle — tout dépend de vos priorités et de votre budget. D'après les avis Google de milliers de pèlerins français, Tawaf se distingue avec une note de 4,8/5 sur plus de 520 avis, notamment pour la qualité de son encadrement. Medinvoyages (4,7/5) est souvent citée pour son excellent rapport qualité-prix et sa flexibilité de paiement. Al-Maqam (4,6/5) est la référence pour les hôtels 4-5 étoiles proches de la Masjid al-Haram. Pour les petits budgets, Omra Discount propose les tarifs les plus accessibles. La vraie méthode : comparez au minimum 3 devis pour les mêmes dates, vérifiez l'agrément ATOUT FRANCE, lisez les 10 derniers avis Google et appelez directement l'agence pour tester la qualité de leur service client avant tout engagement."
              }
            },
            {
              "@type": "Question",
              "name": "Comment vérifier qu'une agence Omra est fiable ?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "La fiabilité d'une agence Omra se vérifie sur plusieurs critères concrets. L'agrément ATOUT FRANCE est obligatoire pour toute agence de voyages en France — vérifiez le numéro de licence sur le site officiel atout-france.fr. Ensuite, examinez les avis Google : une agence sérieuse doit avoir au minimum 200 à 300 avis récents avec une note d'au moins 4,3/5. Méfiez-vous des agences avec très peu d'avis ou des avis suspects (tous postés le même jour, très courts). Vérifiez que l'agence dispose d'une adresse physique en France, d'un numéro de téléphone fixe (pas uniquement WhatsApp) et de mentions légales complètes. L'assurance annulation est cruciale : demandez le document d'assurance avant de signer. Enfin, appelez et posez des questions précises — une agence sérieuse prend le temps de répondre clairement sans pression à la vente."
              }
            },
            {
              "@type": "Question",
              "name": "Quel budget prévoir pour une Omra de qualité ?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Le budget minimum pour une Omra de qualité raisonnable en 2026 se situe autour de 1 500 euros par personne, hors Ramadan, en hôtel 3 à 4 étoiles avec vol inclus depuis Paris pour 10 nuits. En dessous de 1 200 euros, les compromis sont souvent importants : hôtel très éloigné du Haram, vols avec longues correspondances, groupes très chargés et guide peu expérimenté. Pour un bon rapport qualité-prix, la fourchette 1 800 à 2 500 euros correspond à un hôtel 4 étoiles à moins d'un kilomètre du Haram, avec un groupe de taille raisonnable. Au-delà de 3 000 euros, vous entrez dans le segment premium avec des hôtels vue sur la Kaaba et des groupes de moins de 30 personnes. Pendant le Ramadan, multipliez tous ces tarifs par 1,5 à 2 selon la période."
              }
            }
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <SEOBreadcrumb items={[
            { name: 'Accueil', url: '/' },
            { name: 'Agences', url: '/agences-liste' },
            { name: 'Meilleure Agence', url: '/meilleure-agence-omra' }
          ]} />

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Meilleure Agence Omra 2026 : Guide de Choix et Classement</h1>
            <p className="text-lg text-muted-foreground">
              Découvrez notre classement des 5 meilleures agences Omra en France, les critères de sélection essentiels, et les questions à poser avant de vous engager.
            </p>
          </header>

          <section id="classement" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Top 5 Meilleures Agences Omra 2026</h2>
            <div className="space-y-4">
              {agences.map((agence) => (
                <Card key={agence.rank} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                          {agence.rank}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{agence.nom}</h3>
                        <div className="flex gap-3 mb-2 flex-wrap">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" /> {agence.note}/5 ({agence.avis})
                          </Badge>
                          <Badge variant="outline">{agence.prix}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1 font-semibold">Points forts :</p>
                        <ul className="text-sm text-muted-foreground space-y-0.5">
                          {agence.forces.map((force, i) => (
                            <li key={i} className="flex gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
                              {force}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-6 italic">
              Classement basé sur les avis Google authenticifiés (300+ avis minimum), la notation moyenne, et les retours de pèlerins français.
            </p>
          </section>

          <section id="criteres" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Critères de Sélection d'une Bonne Agence Omra</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Agrément & Légalité
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✅ Enregistrement ATOUT FRANCE (obligatoire)</li>
                    <li>✅ Siège social en France</li>
                    <li>✅ Numéro SIRET visible</li>
                    <li>✅ Assurance annulation fournie</li>
                    <li>✅ Mentions légales claires</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Réputation & Avis
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✅ 300+ avis Google (minimum)</li>
                    <li>✅ Note moyenne ≥ 4.4/5</li>
                    <li>✅ Avis détaillés récents</li>
                    <li>✅ Réponse aux avis négatifs</li>
                    <li>✅ Photos clients authentiques</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Offres & Prix
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✅ Plusieurs packages (économique/confort/luxury)</li>
                    <li>✅ Prix transparents (rien caché)</li>
                    <li>✅ Détail des hôtels avec notes</li>
                    <li>✅ Dates multiples disponibles</li>
                    <li>✅ Flexibilité paiement</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Service & Accompagnement
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✅ Guide francophone expérimenté</li>
                    <li>✅ Numéro d'urgence 24h/24</li>
                    <li>✅ Groupes limités (25-50 max)</li>
                    <li>✅ Coordination aéroport France</li>
                    <li>✅ Support pré/post voyage</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Hôtels & Logistique
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✅ Hôtels de 3★ minimum</li>
                    <li>✅ Distance Haram spécifiée</li>
                    <li>✅ Transport climatisé inclus</li>
                    <li>✅ Repas réguliers et halal</li>
                    <li>✅ WiFi dans hôtels</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Transparence
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✅ Conditions d'annulation claires</li>
                    <li>✅ Frais cachés = zéro</li>
                    <li>✅ Critiques négatives visibles</li>
                    <li>✅ Changements programme annoncés</li>
                    <li>✅ Contact facile par téléphone</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="questions" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">20 Questions Essentielles Avant de Réserver</h2>
            <div className="space-y-3">
              {[
                "Êtes-vous agréé ATOUT FRANCE ?",
                "Quelle est votre note Google et combien d'avis avez-vous ?",
                "Quels hôtels proposez-vous et quelle est leur distance au Haram ?",
                "Le vol inclus est-il direct ou avec correspondance ?",
                "Quel est le prix TTC exact (rien d'autre à payer) ?",
                "Pouvez-vous changer de date ou d'hôtel après paiement ?",
                "Comment se déroule l'annulation si je suis malade ?",
                "Vous fournissez une assurance annulation ? Laquelle ?",
                "Combien de personnes par groupe et qui est le guide ?",
                "Le guide parle français couramment ?",
                "Y a-t-il un numéro d'urgence 24h/24 sur place ?",
                "Combien d'avis clients positifs avez-vous eu l'année dernière ?",
                "Avez-vous un siège physique en France ? Adresse et téléphone ?",
                "Les repas sont-ils halal certifiés ?",
                "Le transport inclut une climatisation ?",
                "Y a-t-il WiFi dans les hôtels ?",
                "Proposez-vous plusieurs options d'hôtel pour le même prix ?",
                "Quel est l'acompte demandé et les conditions de paiement ?",
                "Avez-vous eu des réclamations ou problèmes majeurs ?",
                "Offrez-vous une formation avant le départ sur les rites ?"
              ].map((q, i) => (
                <div key={i} className="p-3 rounded-lg border border-border flex gap-2">
                  <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                  <span className="text-sm text-muted-foreground">{q}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="prix-guide" className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Guide des Prix Omra 2026</h2>
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <span className="text-sm">❌ Sous 1 000€</span>
                    <span className="text-sm font-semibold">À éviter (qualité médiocre)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <span className="text-sm">⚠️ 1 000€-1 500€</span>
                    <span className="text-sm font-semibold">Basique (acceptable)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <span className="text-sm">✅ 1 500€-2 500€</span>
                    <span className="text-sm font-semibold">Bon (équilibre)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span className="text-sm">⭐ 2 500€-3 500€</span>
                    <span className="text-sm font-semibold">Excellent (5★)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <span className="text-sm">👑 3 500€+</span>
                    <span className="text-sm font-semibold">Luxury (prestige)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Voir toutes les agences</h2>
            <Link to="/agences-liste" className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <p className="font-semibold">Liste Complète des Agences Omra & Hajj</p>
              <p className="text-xs text-muted-foreground mt-1">Comparateur avec avis, notes et tarifs à jour</p>
            </Link>
          </section>

          {/* Avis de l'expert */}
          <section className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">F</div>
              <div>
                <p className="font-bold text-foreground">Farid d'Arabie</p>
                <p className="text-sm text-primary mb-3">Expert en pèlerinage islamique · +10 ans à La Mecque · +5 000 pèlerins accompagnés</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  "Après des années à accompagner des pèlerins francophones sur les terres saintes, mon conseil numéro un : <strong>ne choisissez jamais une agence uniquement sur le prix</strong>. J'ai vu trop de pèlerins arriver à La Mecque avec un hôtel à 3 km du Haram, sans guide compétent, pour avoir voulu économiser 200 euros. Le pèlerinage est l'un des actes les plus importants de votre vie — investissez dans une agence qui vous accompagnera vraiment. Vérifiez les avis Google récents, appelez l'agence et posez des questions précises sur l'hôtel et le guide. Une bonne agence ne fuit pas ces questions."
                </p>
              </div>
            </div>
          </section>

          <InternalLinks currentPage="/meilleure-agence-omra" variant="related" className="mt-8" />
        </div>
      </div>
    </ResponsiveLayout>
  );
}
