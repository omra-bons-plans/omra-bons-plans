import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PublishLayout from "@/components/ui/PublishLayout";

const PlaceholderDetails = () => {
  const navigate = useNavigate();

  // Check if user came from previous steps
  useEffect(() => {
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    
    if (!selectedCategory || !['chauffeurs', 'babysitting', 'hebergement'].includes(selectedCategory)) {
      navigate('/publish');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/publish');
  };

  const selectedCategory = sessionStorage.getItem('selectedCategory');
  const categoryNames: { [key: string]: string } = {
    'chauffeurs': 'Chauffeurs',
    'babysitting': 'Baby-sitting',
    'hebergement': 'Hébergement'
  };

  const steps = ["Catégorie", "Formule", "Détails"];

  return (
    <PublishLayout currentStep={3} totalSteps={3} steps={steps}>
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground">
            {selectedCategory ? categoryNames[selectedCategory] : 'Service'} - Bientôt disponible
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Cette fonctionnalité sera bientôt disponible
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">🚧 En cours de développement</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              La publication d'annonces pour cette catégorie est en cours de développement. 
              Nous travaillons activement à l'ajouter prochainement !
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Fonctionnalités à venir :</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Formulaire de création d'annonce détaillé</li>
                <li>• Gestion des photos et documents</li>
                <li>• Système de tarification</li>
                <li>• Notifications automatiques</li>
              </ul>
            </div>

            <p className="text-sm text-primary font-medium">
              Restez connecté pour être informé de la disponibilité !
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button 
            onClick={handleBack}
            variant="outline"
            className="px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-full"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Retour aux catégories
          </Button>
        </div>
      </div>
    </PublishLayout>
  );
};

export default PlaceholderDetails;