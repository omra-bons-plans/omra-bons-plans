import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CategorySelection = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const categories = [
    { id: "sejours", name: "Séjours", icon: "🕌", description: "Packages complets" },
    { id: "vols", name: "Vols", icon: "✈️", description: "Billets d'avion" },
    { id: "hebergement", name: "Hébergement", icon: "🏨", description: "Hôtels et appartements" },
    { id: "guides", name: "Guides", icon: "👨‍🏫", description: "Guides spirituels" },
    { id: "chauffeurs", name: "Chauffeurs", icon: "🚗", description: "Transport privé" },
    { id: "babysitting", name: "Baby-sitting", icon: "👶", description: "Garde d'enfants" }
  ];

  const handleNext = () => {
    if (!selectedCategory) return;
    
    // Store selected category in sessionStorage to persist across pages
    sessionStorage.setItem('selectedCategory', selectedCategory);
    
    if (selectedCategory === 'sejours') {
      navigate('/publish/formula');
    } else if (['vols', 'guides', 'chauffeurs', 'babysitting'].includes(selectedCategory)) {
      navigate(`/publish/${selectedCategory}`);
    } else {
      // For categories not yet implemented (like hebergement)
      navigate('/publish/placeholder');
    }
  };

  return (
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
                    ? 'ring-2 ring-primary bg-accent/50 shadow-large' 
                    : 'hover:bg-accent/20'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 sm:p-8 text-center space-y-4 sm:space-y-6">
                  <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">{category.icon}</div>
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold">{category.name}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-6 sm:pt-8">
            <Button 
              onClick={handleNext}
              disabled={!selectedCategory}
              className="bg-primary hover:bg-primary-dark text-primary-foreground px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-full w-full sm:w-auto max-w-xs"
            >
              Suivant
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;