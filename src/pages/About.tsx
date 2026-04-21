import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { OrganizationSchema } from '@/components/SEO/OrganizationSchema';
import { useSEOOptimizations } from '@/hooks/useSEOOptimizations';
import { Helmet } from "react-helmet-async";
import { InternalLinks } from '@/components/SEO/InternalLinks';

const About = () => {
  const navigate = useNavigate();
  // Initialiser les optimisations SEO
  useSEOOptimizations();

  return (
    <ResponsiveLayout>
      <Helmet>
        <title>À Propos - Omra Bons Plans | Notre Histoire et Mission</title>
        <meta name="description" content="Découvrez l'équipe passionnée derrière Omra Bons Plans. Première plateforme au monde dédiée aux services Omra et Hajj. Notre mission, nos valeurs et notre expertise." />
        <meta name="keywords" content="à propos omra bons plans, équipe omra, mission hajj, plateforme pèlerinage, expertise arabie saoudite" />
        <link rel="canonical" href="https://omrabonsplans.fr/about" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="À Propos - Omra Bons Plans | Notre Histoire" />
        <meta property="og:description" content="Découvrez l'équipe passionnée derrière Omra Bons Plans. Première plateforme au monde dédiée aux services Omra et Hajj." />
        <meta property="og:url" content="https://omrabonsplans.fr/about" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="À Propos - Omra Bons Plans | Notre Histoire" />
        <meta name="twitter:description" content="Découvrez l'équipe passionnée derrière Omra Bons Plans. Première plateforme au monde dédiée aux services Omra et Hajj." />
        <meta name="twitter:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "À Propos - Omra Bons Plans",
            "url": "https://omrabonsplans.fr/about",
            "description": "Découvrez l'équipe passionnée derrière Omra Bons Plans",
            "mainEntity": {
              "@type": "Organization",
              "name": "Omra Bons Plans",
              "url": "https://omrabonsplans.fr",
              "logo": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp",
              "description": "Première plateforme au monde dédiée aux services Omra et Hajj",
              "founder": {
                "@type": "Person",
                "name": "Farid d'Arabie",
                "jobTitle": "Expert en pèlerinage islamique & Fondateur",
                "description": "Plus de 10 ans de résidence à La Mecque. A accompagné plus de 5 000 pèlerins lors du Hajj et de l'Omra.",
                "knowsAbout": ["Omra", "Hajj", "La Mecque", "Médine", "Pèlerinage islamique", "Agences de voyage halal"]
              }
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://omrabonsplans.fr/about#farid",
            "name": "Farid d'Arabie",
            "jobTitle": "Expert en pèlerinage islamique & Fondateur d'Omra Bons Plans",
            "description": "Plus de 10 ans de résidence à La Mecque (Makkah). Guide spirituel ayant accompagné plus de 5 000 pèlerins lors du Hajj et de l'Omra. Fondateur du premier comparateur d'agences Omra en France.",
            "url": "https://omrabonsplans.fr/about",
            "worksFor": {
              "@type": "Organization",
              "name": "Omra Bons Plans",
              "url": "https://omrabonsplans.fr"
            },
            "knowsAbout": ["Omra", "Hajj", "La Mecque", "Médine", "Rites islamiques", "Agences de voyage Omra", "Calendrier islamique"],
            "hasCredential": [
              { "@type": "EducationalOccupationalCredential", "credentialCategory": "Guide spirituel agréé", "description": "Plus de 5 000 pèlerins accompagnés lors du Hajj et de l'Omra" },
              { "@type": "EducationalOccupationalCredential", "credentialCategory": "Résident de Makkah", "description": "Plus de 10 années de résidence à La Mecque" }
            ]
          })}
        </script>
      </Helmet>
      <OrganizationSchema />
      <SEOBreadcrumb className="container mx-auto px-6 pt-4" />
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Retour
            </Button>
          </div>

          {/* Fondateur */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                  F
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Farid d'Arabie</h2>
                  <p className="text-primary font-semibold mb-3">Expert en pèlerinage islamique · Fondateur d'Omra Bons Plans</p>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">🕌 +10 ans à La Mecque</span>
                    <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">🤲 +5 000 pèlerins accompagnés</span>
                    <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">✈️ Hajj & Omra</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    J&apos;ai vécu plus de <strong>10 années à Makkah (La Mecque)</strong>, au cœur des lieux les plus sacrés de l&apos;Islam.
                    Durant cette période, j&apos;ai eu l&apos;honneur d&apos;accompagner personnellement <strong>plus de 5 000 pèlerins</strong> francophones
                    lors du Hajj et de l&apos;Omra — des familles, des seniors, des femmes seules, des personnes à mobilité réduite.
                    Cette expérience unique sur le terrain m&apos;a permis de comprendre de l&apos;intérieur les défis que rencontrent
                    les pèlerins français pour trouver une agence fiable et une offre adaptée. C&apos;est de ce constat qu&apos;est né
                    <strong className="text-primary"> Omra Bons Plans</strong>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h1 className="text-3xl font-bold text-center mb-4">À Propos d'Omra Bons Plans</h1>
              <p className="text-xl text-muted-foreground text-center">Le premier comparateur d&apos;agences Omra et Hajj agréées en France, fondé par un expert du terrain</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <h3 className="text-xl font-semibold text-foreground mt-4 mb-4">Pourquoi Omra Bons Plans ?</h3>
                <p>
                  Après des années passées à La Mecque et des milliers de pèlerins accompagnés, j&apos;ai observé une réalité
                  difficile : de nombreux fidèles francophones payaient trop cher, ou pire, se retrouvaient avec des agences
                  peu sérieuses. Le manque de transparence sur les prix, les hôtels et les services inclus était flagrant.
                </p>
                <p>
                  C&apos;est précisément de cette expérience terrain qu&apos;est née <strong className="text-primary font-bold">omrabonsplans.fr</strong> —
                  la première plateforme francophone permettant de comparer en temps réel les offres de plus de 20 agences
                  françaises agréées, avec des prix transparents, des avis vérifiés et des informations détaillées sur
                  chaque séjour.
                </p>

                <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Notre Mission</h3>
                <p>
                  Notre mission est simple : <strong className="text-foreground">que chaque pèlerin français puisse partir
                  en Omra ou Hajj en toute confiance</strong>, avec la certitude d&apos;avoir trouvé la meilleure offre
                  pour son budget et ses besoins. La préparation d&apos;un pèlerinage ne devrait pas être source de stress —
                  elle devrait être une étape sereine et joyeuse du voyage spirituel.
                </p>

                <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Ce que vous trouverez ici</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Comparatif en temps réel de 20+ agences agréées (prix, hôtels, vols, services)</li>
                  <li>Guides pratiques rédigés par un expert ayant vécu sur les terres saintes</li>
                  <li>Informations vérifiées sur les conditions d&apos;entrée, les rites, les dates</li>
                  <li>Horaires de prière, calendrier islamique, dates du Ramadan et Hajj</li>
                  <li>Forum communautaire pour échanger avec d&apos;autres pèlerins</li>
                </ul>

                <p className="mt-8 text-primary font-semibold text-center text-lg">
                  Qu&apos;Allah accepte votre pèlerinage et facilite votre voyage spirituel. Amin.
                </p>
                <p className="text-right text-sm text-muted-foreground italic">— Farid d&apos;Arabie, fondateur</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Liens internes SEO */}
          <InternalLinks currentPage="/about" variant="related" className="mt-8" />
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default About;