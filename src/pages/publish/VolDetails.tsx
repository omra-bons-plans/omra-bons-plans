import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import VolFormMultiStep from "@/components/forms/VolFormMultiStep";
import PublishLayout from "@/components/ui/PublishLayout";
import RequiredProfileGuard from "@/components/ui/RequiredProfileGuard";

const VolDetails = () => {
  const navigate = useNavigate();

  // Check if user came from category selection
  useEffect(() => {
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    if (!selectedCategory || selectedCategory !== 'vols') {
      navigate('/publish');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/publish');
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
          .from('ads_vols')
          .insert({ ad_id: ad.id, ...categoryData });

        if (categoryError) throw categoryError;
      }

      toast.success("Brouillon sauvegardé avec succès !");
      // Clear session storage and redirect
      sessionStorage.removeItem('selectedCategory');
      navigate('/my-ads');
      return ad.id;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error("Erreur lors de la sauvegarde du brouillon");
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
          has_stopover: data.hasOutboundStopover || data.hasReturnStopover,
          stopover_details: [
            data.hasOutboundStopover ? `Aller: ${data.outboundStopoverDetails}` : '',
            data.hasReturnStopover ? `Retour: ${data.returnStopoverDetails}` : ''
          ].filter(Boolean).join(' | ') || null,
          checked_bags_count: data.checkedBagsCount || 0,
          checked_bags_weight: data.checkedBagsWeight || 20,
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
          publish_end_date: data.publishEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours par défaut
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
          has_stopover: data.hasOutboundStopover || data.hasReturnStopover,
          stopover_details: [
            data.hasOutboundStopover ? `Aller: ${data.outboundStopoverDetails}` : '',
            data.hasReturnStopover ? `Retour: ${data.returnStopoverDetails}` : ''
          ].filter(Boolean).join(' | ') || null,
          checked_bags_count: data.checkedBagsCount || 0,
          checked_bags_weight: data.checkedBagsWeight || 20,
        });

      if (volError) throw volError;

      toast.success("Annonce publiée avec succès !");
      // Clear session storage and redirect
      sessionStorage.removeItem('selectedCategory');
      navigate('/my-ads');
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error("Erreur lors de la publication de l'annonce");
    }
  };

  const steps = ["Catégorie", "Infos générales", "Compagnie", "Dates", "Photos/Prix", "Publication", "Récapitulatif"];

  return (
    <RequiredProfileGuard>
      <PublishLayout currentStep={2} totalSteps={7} steps={steps}>
          <VolFormMultiStep 
            onSubmit={handleVolSubmit} 
            onBack={handleBack}
          />
      </PublishLayout>
    </RequiredProfileGuard>
  );
};

export default VolDetails;