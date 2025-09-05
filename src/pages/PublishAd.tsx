import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PublishAd = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFormula, setSelectedFormula] = useState("");

  const categories = [
    { id: "sejours", name: "Séjours", icon: "🕌", description: "Packages complets" },
    { id: "vols", name: "Vols", icon: "✈️", description: "Billets d'avion" },
    { id: "hebergement", name: "Hébergement", icon: "🏨", description: "Hôtels et appartements" },
    { id: "guides", name: "Guides", icon: "👨‍🏫", description: "Guides spirituels" },
    { id: "chauffeurs", name: "Chauffeurs", icon: "🚗", description: "Transport privé" },
    { id: "babysitting", name: "Baby-sitting", icon: "👶", description: "Garde d'enfants" }
  ];

  const formulas = [
    { id: "confort", name: "Confort", rating: "5★", description: "Séjour premium avec services haut de gamme" },
    { id: "essentiel", name: "Essentiel", rating: "4★", description: "Séjour équilibré qualité-prix" },
    { id: "eco", name: "Éco", rating: "3★", description: "Séjour économique et accessible" }
  ];

  const handleNext = () => {
    if (currentStep === 1 && selectedCategory) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-primary-foreground font-bold text-lg">O</span>
              </div>
              <span className="text-xl font-bold text-foreground">omrabonsplans.fr</span>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center space-x-2 bg-accent/30 rounded-full px-4 py-2">
              <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-primary' : 'bg-muted'} transition-colors`}></div>
              <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'} transition-colors`}></div>
              <div className={`w-3 h-3 rounded-full ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'} transition-colors`}></div>
            </div>
            
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              ✕ Fermer
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          
          {/* Step 1: Category Selection */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-foreground">
                  Que souhaitez-vous publier ?
                </h1>
                <p className="text-lg text-muted-foreground">
                  Choisissez votre type d'annonce
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {categories.map((category) => (
                  <Card 
                    key={category.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-large hover:-translate-y-1 ${
                      selectedCategory === category.id 
                        ? 'ring-2 ring-primary bg-accent/50 shadow-large' 
                        : 'hover:bg-accent/20'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardContent className="p-8 text-center space-y-6">
                      <div className="text-6xl mb-4">{category.icon}</div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">{category.name}</h3>
                        <p className="text-muted-foreground text-sm">{category.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center pt-8">
                <Button 
                  onClick={handleNext}
                  disabled={!selectedCategory}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-3 text-lg rounded-full"
                >
                  Suivant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Formula Selection (for Séjours) */}
          {currentStep === 2 && selectedCategory === 'sejours' && (
            <div className="space-y-8">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retour
                </Button>
              </div>

              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-foreground">
                  De quelle type de formule s'agit-il ?
                </h1>
                <p className="text-lg text-muted-foreground">
                  Sélectionnez le niveau de confort de votre séjour
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {formulas.map((formula) => (
                  <Card 
                    key={formula.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-large hover:-translate-y-1 ${
                      selectedFormula === formula.id 
                        ? 'ring-2 ring-primary bg-accent/50 shadow-large' 
                        : 'hover:bg-accent/20'
                    }`}
                    onClick={() => setSelectedFormula(formula.id)}
                  >
                    <CardContent className="p-8 text-center space-y-6">
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center shadow-soft">
                          <span className="text-2xl text-primary-foreground font-bold">
                            {formula.rating.charAt(0)}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">{formula.name}</h3>
                          <div className="text-secondary text-lg font-semibold">{formula.rating}</div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {formula.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center pt-8">
                <Button 
                  disabled={!selectedFormula}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-3 text-lg rounded-full"
                >
                  Continuer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Other categories (direct to form) */}
          {currentStep === 2 && selectedCategory !== 'sejours' && (
            <div className="space-y-8">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Retour
                </Button>
              </div>

              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-foreground">
                  Créer votre annonce {categories.find(c => c.id === selectedCategory)?.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Remplissez les informations de votre annonce
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="text-6xl">
                      {categories.find(c => c.id === selectedCategory)?.icon}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">Formulaire en construction</h3>
                      <p className="text-muted-foreground">
                        Le formulaire détaillé pour les annonces {categories.find(c => c.id === selectedCategory)?.name} sera bientôt disponible.
                      </p>
                    </div>
                    
                    <Button className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-3 rounded-full">
                      Commencer à créer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublishAd;