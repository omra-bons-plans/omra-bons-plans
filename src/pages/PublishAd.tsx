import { useState } from "react";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SejourForm from "@/components/forms/SejourForm";
import VolForm from "@/components/forms/VolForm";
import GuideForm from "@/components/forms/GuideForm";
import ProgressBar from "@/components/ui/ProgressBar";

const PublishAd = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFormula, setSelectedFormula] = useState("");
  
  const totalSteps = 3;
  const steps = ["Catégorie", "Formule", "Détails"];

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

  const saveDraft = async (adData: any, categoryData?: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour sauvegarder");
        return;
      }

      // Create the main ad as draft
      const { data: ad, error: adError } = await supabase
        .from('ads')
        .insert({
          ...adData,
          user_id: user.id,
          is_published: false,
          is_draft: true,
        })
        .select()
        .single();

      if (adError) throw adError;

      // Save category-specific data if provided
      if (categoryData && selectedCategory) {
        let categoryError;
        switch (selectedCategory) {
          case 'sejours':
            const { error: sejourError } = await supabase
              .from('ads_sejours')
              .insert({ ad_id: ad.id, ...categoryData });
            categoryError = sejourError;
            break;
          case 'vols':
            const { error: volError } = await supabase
              .from('ads_vols')
              .insert({ ad_id: ad.id, ...categoryData });
            categoryError = volError;
            break;
          case 'guides':
            const { error: guideError } = await supabase
              .from('ads_guides')
              .insert({ ad_id: ad.id, ...categoryData });
            categoryError = guideError;
            break;
        }
        
        if (categoryError) throw categoryError;
      }

      toast.success("Brouillon sauvegardé avec succès !");
      return ad.id;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error("Erreur lors de la sauvegarde du brouillon");
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedCategory) {
      setCurrentStep(selectedCategory === 'sejours' ? 2 : 3);
    } else if (currentStep === 2 && selectedFormula) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep === 3 && selectedCategory === 'sejours') {
      setCurrentStep(2);
    } else if (currentStep === 3 || currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSejourSubmit = async (data: any, saveAsDraft = false) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour publier une annonce");
        return;
      }

      if (saveAsDraft) {
        const adData = {
          category: 'sejours',
          title: data.title || 'Brouillon séjour',
          description: data.description || '',
          price: data.price || 0,
          original_price: data.originalPrice,
          location: `${data.nightsMedina ? 'Médine' : ''} ${data.nightsMecca ? 'Makkah' : ''}`.trim(),
          show_email: data.showEmail,
          show_phone: data.showPhone,
          is_promotion: data.isPromotion,
          promotion_end_date: data.promotionEndDate || null,
          publish_end_date: data.publishEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };

        const categoryData = {
          formula_type: selectedFormula,
          airline: data.airline,
          departure_date: data.departureDate,
          return_date: data.returnDate,
          nights_medina: data.nightsMedina || 0,
          nights_mecca: data.nightsMecca || 0,
          medina_hotel_name: data.medinaHotelName,
          medina_hotel_distance: data.medinaHotelDistance,
          mecca_hotel_name: data.meccaHotelName,
          mecca_hotel_distance: data.meccaHotelDistance,
        };

        await saveDraft(adData, categoryData);
        return;
      }

      // Create the main ad
      const { data: ad, error: adError } = await supabase
        .from('ads')
        .insert({
          user_id: user.id,
          category: 'sejours',
          title: data.title,
          description: data.description,
          price: data.price,
          original_price: data.originalPrice,
          location: `${data.nightsMedina ? 'Médine' : ''} ${data.nightsMecca ? 'Makkah' : ''}`.trim(),
          show_email: data.showEmail,
          show_phone: data.showPhone,
          is_promotion: data.isPromotion,
          promotion_end_date: data.promotionEndDate || null,
          publish_end_date: data.publishEndDate,
          is_published: true,
          is_draft: false,
        })
        .select()
        .single();

      if (adError) throw adError;

      // Create the sejour details
      const { error: sejourError } = await supabase
        .from('ads_sejours')
        .insert({
          ad_id: ad.id,
          formula_type: selectedFormula,
          airline: data.airline,
          departure_date: data.departureDate,
          return_date: data.returnDate,
          nights_medina: data.nightsMedina || 0,
          nights_mecca: data.nightsMecca || 0,
          medina_hotel_name: data.medinaHotelName,
          medina_hotel_distance: data.medinaHotelDistance,
          mecca_hotel_name: data.meccaHotelName,
          mecca_hotel_distance: data.meccaHotelDistance,
        });

      if (sejourError) throw sejourError;

      toast.success("Annonce publiée avec succès !");
      // Redirect to home or user dashboard
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error("Erreur lors de la publication de l'annonce");
    }
  };

  const handleVolSubmit = async (data: any, saveAsDraft = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour publier une annonce");
        return;
      }

      if (saveAsDraft) {
        const adData = {
          category: 'vols',
          title: data.title || 'Brouillon vol',
          description: data.description || '',
          price: data.price || 0,
          original_price: data.originalPrice,
          location: `${data.departureAirport} → ${data.arrivalAirport}`,
          show_email: data.showEmail,
          show_phone: data.showPhone,
          is_promotion: data.isPromotion,
          promotion_end_date: data.promotionEndDate || null,
          publish_end_date: data.publishEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };

        const categoryData = {
          airline: data.airline,
          departure_airport: data.departureAirport,
          arrival_airport: data.arrivalAirport,
          departure_date: data.departureDate,
          return_date: data.returnDate,
          has_stopover: data.hasStopover,
          stopover_details: data.stopoverDetails,
        };

        await saveDraft(adData, categoryData);
        return;
      }

      const { data: ad, error: adError } = await supabase
        .from('ads')
        .insert({
          user_id: user.id,
          category: 'vols',
          title: data.title,
          description: data.description,
          price: data.price,
          original_price: data.originalPrice,
          location: `${data.departureAirport} → ${data.arrivalAirport}`,
          show_email: data.showEmail,
          show_phone: data.showPhone,
          is_promotion: data.isPromotion,
          promotion_end_date: data.promotionEndDate || null,
          publish_end_date: data.publishEndDate,
          is_published: true,
          is_draft: false,
        })
        .select()
        .single();

      if (adError) throw adError;

      const { error: volError } = await supabase
        .from('ads_vols')
        .insert({
          ad_id: ad.id,
          airline: data.airline,
          departure_airport: data.departureAirport,
          arrival_airport: data.arrivalAirport,
          departure_date: data.departureDate,
          return_date: data.returnDate,
          has_stopover: data.hasStopover,
          stopover_details: data.stopoverDetails,
        });

      if (volError) throw volError;

      toast.success("Annonce publiée avec succès !");
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error("Erreur lors de la publication de l'annonce");
    }
  };

  const handleGuideSubmit = async (data: any, saveAsDraft = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour publier une annonce");
        return;
      }

      if (saveAsDraft) {
        const adData = {
          category: 'guides',
          title: data.title || 'Brouillon guide',
          description: data.description || '',
          price: data.price || 0,
          location: data.city === 'both' ? 'Makkah - Médine' : data.city === 'makkah' ? 'Makkah' : 'Médine',
          show_email: data.showEmail,
          show_phone: data.showPhone,
          publish_end_date: data.publishEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };

        const categoryData = {
          gender: data.gender,
          city: data.city,
          years_experience: data.yearsExperience || 0,
          languages: data.languages || [],
          offers_omra_guidance: data.offersOmraGuidance,
          offers_visits: data.offersVisits,
          offers_courses: data.offersCourses,
          offers_omra_badal: data.offersOmraBadal,
          offers_wheelchair_help: data.offersWheelchairHelp,
          offers_other: data.offersOther,
          other_services_description: data.otherServicesDescription,
        };

        await saveDraft(adData, categoryData);
        return;
      }

      const { data: ad, error: adError } = await supabase
        .from('ads')
        .insert({
          user_id: user.id,
          category: 'guides',
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.city === 'both' ? 'Makkah - Médine' : data.city === 'makkah' ? 'Makkah' : 'Médine',
          show_email: data.showEmail,
          show_phone: data.showPhone,
          publish_end_date: data.publishEndDate,
          is_published: true,
          is_draft: false,
        })
        .select()
        .single();

      if (adError) throw adError;

      const { error: guideError } = await supabase
        .from('ads_guides')
        .insert({
          ad_id: ad.id,
          gender: data.gender,
          city: data.city,
          years_experience: data.yearsExperience,
          languages: data.languages,
          offers_omra_guidance: data.offersOmraGuidance,
          offers_visits: data.offersVisits,
          offers_courses: data.offersCourses,
          offers_omra_badal: data.offersOmraBadal,
          offers_wheelchair_help: data.offersWheelchairHelp,
          offers_other: data.offersOther,
          other_services_description: data.otherServicesDescription,
        });

      if (guideError) throw guideError;

      toast.success("Annonce publiée avec succès !");
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error("Erreur lors de la publication de l'annonce");
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

      <main className="flex-1 py-12 px-6 pb-32">
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
                  onClick={handleNext}
                  disabled={!selectedFormula}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-3 text-lg rounded-full"
                >
                  Continuer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Forms for each category */}
          {currentStep === 3 && selectedCategory === 'sejours' && (
            <SejourForm 
              formulaType={selectedFormula}
              onSubmit={handleSejourSubmit}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && selectedCategory === 'vols' && (
            <VolForm 
              onSubmit={handleVolSubmit}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && selectedCategory === 'guides' && (
            <GuideForm 
              onSubmit={handleGuideSubmit}
              onBack={handleBack}
            />
          )}

          {/* Step 3: Other categories (placeholder) */}
          {currentStep === 3 && !['sejours', 'vols', 'guides'].includes(selectedCategory) && (
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
                  Cette catégorie sera bientôt disponible
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="text-6xl">
                      {categories.find(c => c.id === selectedCategory)?.icon}
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">Formulaire en développement</h3>
                      <p className="text-muted-foreground">
                        Le formulaire détaillé pour les annonces {categories.find(c => c.id === selectedCategory)?.name} sera bientôt disponible.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => window.location.href = '/'}
                      className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-3 rounded-full"
                    >
                      Retour à l'accueil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      {/* Progress Bar */}
      <ProgressBar 
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={steps}
      />
    </div>
  );
};

export default PublishAd;