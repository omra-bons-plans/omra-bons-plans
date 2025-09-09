import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { updatePageSEO, SEO_DATA } from '@/utils/seoUtils';

const About = () => {
  const navigate = useNavigate();
  
  // SEO optimization
  useEffect(() => {
    updatePageSEO(SEO_DATA.about);
  }, []);

  return (
    <ResponsiveLayout>
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
              <CardTitle className="text-3xl font-bold text-center mb-4">Qui sommes-nous ?</CardTitle>
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