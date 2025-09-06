import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building, Plane, Hotel, BookOpen, Car, Heart, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RequiredProfileGuard from "@/components/ui/RequiredProfileGuard";

const CategorySelection = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll automatique vers le bouton suivant sur mobile quand une catégorie est sélectionnée
  useEffect(() => {
    if (selectedCategory && nextButtonRef.current) {
      // Vérifier si on est sur mobile (largeur d'écran < 768px)
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        // Attendre un peu pour que l'animation de sélection se termine
        setTimeout(() => {
          nextButtonRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }, 300);
      }
    }
  }, [selectedCategory]);

  const categories = [
    { id: "sejours", name: "Séjours", icon: Building, description: "Packages complets" },
    { id: "vols", name: "Vols", icon: Plane, description: "Billets d'avion" },
    { id: "hebergement", name: "Hébergement", icon: Hotel, description: "Hôtels et appartements" },
    { id: "guides", name: "Guides", icon: BookOpen, description: "Guides spirituels" },
    { id: "chauffeurs", name: "Chauffeurs", icon: Car, description: "Transport privé" },
    { id: "babysitting", name: "Baby-sitting", icon: Heart, description: "Garde d'enfants" }
  ];

  const handleNext = () => {
    if (!selectedCategory) return;
    
    // Store selected category in sessionStorage to persist across pages
    sessionStorage.setItem('selectedCategory', selectedCategory);
    
    if (selectedCategory === 'sejours') {
      navigate('/publish/formula');
    } else if (['vols', 'guides', 'chauffeurs', 'babysitting', 'hebergement'].includes(selectedCategory)) {
      navigate(`/publish/${selectedCategory}`);
    } else {
      // For categories not yet implemented
      navigate('/publish/placeholder');
    }
  };

  return (
    <RequiredProfileGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground">
                Que souhaitez-vous publier ?
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Choisissez votre type d'annonce
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {categories.map((category) => (
                <Card 
                  key={category.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-large hover:-translate-y-1 ${
                    selectedCategory === category.id 
                      ? 'ring-4 ring-yellow-500 shadow-xl bg-amber-50/80 border-2 border-yellow-400' 
                      : 'hover:bg-accent/20'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 sm:p-8 text-center space-y-4 sm:space-y-6">
                    <div className="flex justify-center mb-2 sm:mb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                        <category.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold">{category.name}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 sm:pt-8">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="flex items-center space-x-2 px-6 py-3 text-base w-full sm:w-auto order-2 sm:order-1"
              >
                <Home className="w-4 h-4" />
                <span>Retour à l'accueil</span>
              </Button>
              
              <Button 
                ref={nextButtonRef}
                onClick={handleNext}
                disabled={!selectedCategory}
                className="bg-primary hover:bg-primary-dark text-primary-foreground px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-full w-full sm:w-auto max-w-xs order-1 sm:order-2"
              >
                Suivant
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RequiredProfileGuard>
  );
};

export default CategorySelection;