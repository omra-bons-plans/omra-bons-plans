import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SejourForm from "@/components/forms/SejourForm";
import PublishLayout from "@/components/ui/PublishLayout";

const SejourDetails = () => {
  const navigate = useNavigate();

  // Check if user came from previous steps
  useEffect(() => {
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    const selectedFormula = sessionStorage.getItem('selectedFormula');
    
    if (!selectedCategory || selectedCategory !== 'sejours' || !selectedFormula) {
      navigate('/publish');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/publish/formula');
  };

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
      if (categoryData) {
        const { error: categoryError } = await supabase
          .from('ads_sejours')
          .insert({ ad_id: ad.id, ...categoryData });

        if (categoryError) throw categoryError;
      }

      toast.success("Brouillon sauvegardé avec succès !");
      // Clear session storage and redirect
      sessionStorage.removeItem('selectedCategory');
      sessionStorage.removeItem('selectedFormula');
      navigate('/');
      return ad.id;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error("Erreur lors de la sauvegarde du brouillon");
    }
  };

  const handleSejourSubmit = async (data: any, saveAsDraft = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour publier une annonce");
        return;
      }

      const selectedFormula = sessionStorage.getItem('selectedFormula');

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
      // Clear session storage and redirect
      sessionStorage.removeItem('selectedCategory');
      sessionStorage.removeItem('selectedFormula');
      navigate('/');
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error("Erreur lors de la publication de l'annonce");
    }
  };

  const formulaType = sessionStorage.getItem('selectedFormula') || '';
  const steps = ["Catégorie", "Formule", "Détails"];

  return (
    <PublishLayout currentStep={3} totalSteps={3} steps={steps}>
      <SejourForm 
        formulaType={formulaType}
        onSubmit={handleSejourSubmit}
        onBack={handleBack}
      />
    </PublishLayout>
  );
};

export default SejourDetails;