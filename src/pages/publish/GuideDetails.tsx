import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import GuideFormMultiStep from "@/components/forms/GuideFormMultiStep";
import PublishLayout from "@/components/ui/PublishLayout";

const GuideDetails = () => {
  const navigate = useNavigate();

  // Check if user came from category selection
  useEffect(() => {
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    if (!selectedCategory || selectedCategory !== 'guides') {
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
          .from('ads_guides')
          .insert({ ad_id: ad.id, ...categoryData });

        if (categoryError) throw categoryError;
      }

      toast.success("Brouillon sauvegardé avec succès !");
      // Clear session storage and redirect
      sessionStorage.removeItem('selectedCategory');
      navigate('/');
      return ad.id;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error("Erreur lors de la sauvegarde du brouillon");
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
          price: 0, // Guides sans prix
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
          price: 0, // Guides sans prix
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
      // Clear session storage and redirect
      sessionStorage.removeItem('selectedCategory');
      navigate('/');
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error("Erreur lors de la publication de l'annonce");
    }
  };

  const steps = ["Catégorie", "Détails"];

  return (
    <PublishLayout currentStep={2} totalSteps={2} steps={steps}>
        <GuideFormMultiStep 
          onSubmit={handleGuideSubmit} 
          onBack={handleBack}
        />
    </PublishLayout>
  );
};

export default GuideDetails;