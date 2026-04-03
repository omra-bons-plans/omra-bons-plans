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
              "description": "Première plateforme au monde dédiée aux services Omra et Hajj"
            }
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

          <Card>
            <CardHeader>
              <h1 className="text-3xl font-bold text-center mb-4">À Propos de Nous</h1>
              <h2 className="text-xl text-muted-foreground text-center">Découvrez l'histoire et la mission de la première plateforme dédiée aux services Omra et Hajj</h2>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Bienvenue sur Omra Bons Plans, la première plateforme francophone entièrement dédiée au pèlerinage musulman. 
                  Nous sommes une équipe passionnée composée d&apos;anciens guides spirituels ayant vécu de nombreuses années 
                  en Arabie saoudite et accompagné des milliers de pèlerins dans leur voyage sacré vers La Mecque et Médine.
                </p>
                
                <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Notre Histoire</h3>
                <p>
                  Au fil des années passées sur les terres saintes, nous avons été témoins d&apos;une problématique récurrente : 
                  de nombreux pèlerins francophones recherchent désespérément des services fiables, transparents et adaptés 
                  à leurs besoins spécifiques, mais peinent à trouver les bons prestataires dans la multitude d&apos;offres disponibles. 
                  Parallèlement, de nombreux prestataires sérieux et professionnels souhaitent proposer leurs services de qualité, 
                  sans toujours disposer de la visibilité nécessaire pour atteindre efficacement les futurs pèlerins.
                </p>

                <p>
                  C&apos;est précisément de ce double constat, fruit de notre expérience terrain et de notre proximité avec 
                  la communauté musulmane francophone, qu&apos;est née <strong className="text-primary font-bold">omrabonsplans.fr</strong>. 
                  Nous avons créé la première plateforme au monde spécialement conçue pour mettre en relation directe les futurs 
                  pèlerins avec des prestataires de confiance vérifiés, dans un environnement sécurisé et transparent.
                </p>

                <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Notre Mission</h3>
                <p>
                  Notre mission est claire et ambitieuse : <strong className="text-foreground">faciliter l&apos;organisation complète 
                  du voyage religieux</strong> en offrant un espace digital sécurisé, transparent et accessible où chacun peut 
                  facilement trouver ou proposer les services qui correspondent précisément à ses attentes et à son budget. 
                  Nous croyons fermement que la préparation d&apos;un pèlerinage ne devrait pas être source de stress ou d&apos;inquiétude, 
                  mais plutôt une étape sereine et joyeuse du voyage spirituel.
                </p>

                <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Nos Services</h3>
                <p>
                  Sur Omra Bons Plans, vous trouverez une gamme complète de services pour votre pèlerinage :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Comparaison détaillée des agences de voyage Omra et Hajj certifiées</li>
                  <li>Annonces de vols directs et avec escale vers Jeddah et Médine</li>
                  <li>Hébergements variés : hôtels face au Haram, appartements familiaux, résidences</li>
                  <li>Services de guides spirituels francophones expérimentés</li>
                  <li>Transport privé avec chauffeurs professionnels</li>
                  <li>Services de garde d&apos;enfants certifiés</li>
                  <li>Forum communautaire pour échanger avec d&apos;autres pèlerins</li>
                  <li>Blog avec guides pratiques et conseils d&apos;experts</li>
                  <li>Outils religieux : horaires de prière, calendrier islamique, dates du Ramadan et Hajj</li>
                </ul>

                <p className="mt-6">
                  Avec omrabonsplans.fr, nous souhaitons apporter plus de sérénité, de clarté et de confiance dans la préparation 
                  de la Omra et du Hajj, afin que chaque pèlerin puisse se concentrer sur l&apos;essentiel : son adoration, 
                  sa spiritualité et sa connexion avec Allah dans les lieux les plus sacrés de l&apos;Islam.
                </p>

                <p className="mt-6 text-primary font-semibold">
                  Qu&apos;Allah accepte votre pèlerinage et facilite votre voyage spirituel. Amin.
                </p>
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