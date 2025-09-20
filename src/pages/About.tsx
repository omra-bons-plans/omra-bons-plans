import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { SEOHead, seoConfig } from '@/components/SEO/SEOHead';
import { SEOBreadcrumb } from '@/components/SEO/SEOBreadcrumb';
import { useSEOOptimizations } from '@/hooks/useSEOOptimizations';
import { Helmet } from "react-helmet-async";

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
        <link rel="canonical" href="https://omrabonsplans.fr/a-propos" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="À Propos - Omra Bons Plans | Notre Histoire" />
        <meta property="og:description" content="Découvrez l'équipe passionnée derrière Omra Bons Plans. Première plateforme au monde dédiée aux services Omra et Hajj." />
        <meta property="og:url" content="https://omrabonsplans.fr/a-propos" />
        <meta property="og:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="À Propos - Omra Bons Plans | Notre Histoire" />
        <meta name="twitter:description" content="Découvrez l'équipe passionnée derrière Omra Bons Plans. Première plateforme au monde dédiée aux services Omra et Hajj." />
        <meta name="twitter:image" content="https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "À Propos - Omra Bons Plans",
            "url": "https://omrabonsplans.fr/a-propos",
            "description": "Découvrez l'équipe passionnée derrière Omra Bons Plans",
            "mainEntity": {
              "@type": "Organization",
              "name": "Omra Bons Plans",
              "url": "https://omrabonsplans.fr",
              "logo": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png",
              "description": "Première plateforme au monde dédiée aux services Omra et Hajj"
            }
          })}
        </script>
      </Helmet>
      <SEOHead {...seoConfig.about} />
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
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Nous sommes une équipe passionnée qui a eu le privilège de vivre de nombreuses années en Arabie saoudite et d'accompagner des milliers de pèlerins en tant que guides.
                </p>
                
                <p>
                  Au fil du temps, nous avons constaté une réalité : beaucoup de pèlerins recherchent des services fiables et adaptés à leurs besoins, mais peinent à trouver les bons prestataires. De l'autre côté, de nombreux prestataires souhaitent proposer leurs services, sans toujours avoir la visibilité nécessaire pour atteindre les futurs pèlerins.
                </p>

                <p>
                  C'est de ce constat qu'est née <strong className="text-primary font-bold">omrabonsplans.fr</strong>, la première plateforme au monde dédiée à mettre en relation les futurs pèlerins avec des prestataires de confiance.
                </p>

                <p>
                  Notre mission est simple : <strong className="text-foreground">faciliter l'organisation du voyage religieux</strong> en offrant un espace sécurisé, transparent et accessible où chacun peut trouver ou proposer les services qui correspondent à ses attentes.
                </p>

                <p>
                  Avec omrabonsplans.fr, nous souhaitons apporter plus de sérénité et de clarté dans la préparation de la Omra, afin que chaque pèlerin puisse se concentrer sur l'essentiel : son adoration et sa spiritualité.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default About;