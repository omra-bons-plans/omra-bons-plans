import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublishLayout from "@/components/ui/PublishLayout";
import RequiredProfileGuard from "@/components/ui/RequiredProfileGuard";

const FormulaSelection = () => {
  const [selectedFormula, setSelectedFormula] = useState("");
  const navigate = useNavigate();

  const formulas = [
    { id: "confort", name: "Confort", rating: "5★", description: "Séjour premium avec services haut de gamme" },
    { id: "essentiel", name: "Essentiel", rating: "4★", description: "Séjour équilibré qualité-prix" },
    { id: "eco", name: "Éco", rating: "3★", description: "Séjour économique et accessible" }
  ];

  // Check if user came from category selection
  useEffect(() => {
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    if (!selectedCategory || selectedCategory !== 'sejours') {
      navigate('/publish');
    }
  }, [navigate]);

  const handleNext = () => {
    if (!selectedFormula) return;
    
    // Store selected formula in sessionStorage
    sessionStorage.setItem('selectedFormula', selectedFormula);
    navigate('/publish/sejours');
  };

  const handleBack = () => {
    navigate('/publish');
  };

  const steps = ["Catégorie", "Formule", "Détails"];

  return (
    <RequiredProfileGuard>
      <PublishLayout currentStep={2} totalSteps={3} steps={steps}>
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center justify-center space-x-4 mb-6 sm:mb-8">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
          </div>

          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground">
              De quelle type de formule s'agit-il ?
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Sélectionnez le niveau de confort de votre séjour
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {formulas.map((formula) => (
              <Card 
                key={formula.id}
                className={`cursor-pointer transition-all duration-150 hover:shadow-large hover:-translate-y-1 ${
                  selectedFormula === formula.id 
                    ? 'ring-2 ring-primary bg-accent/50 shadow-large transform-gpu' 
                    : 'hover:bg-accent/20'
                }`}
                onClick={() => setSelectedFormula(formula.id)}
              >
                <CardContent className="p-4 sm:p-8 text-center space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center shadow-soft">
                      <span className="text-lg sm:text-2xl text-primary-foreground font-bold">
                        {formula.rating && typeof formula.rating === 'string' ? formula.rating.charAt(0) : '★'}
                      </span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold">{formula.name}</h3>
                      <div className="text-secondary text-base sm:text-lg font-semibold">{formula.rating}</div>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                        {formula.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-6 sm:pt-8">
            <Button 
              onClick={handleNext}
              disabled={!selectedFormula}
              className="bg-primary hover:bg-primary-dark text-primary-foreground px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-full w-full sm:w-auto max-w-xs"
            >
              Continuer
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </div>
      </PublishLayout>
    </RequiredProfileGuard>
  );
};

export default FormulaSelection;