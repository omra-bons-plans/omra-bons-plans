import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BabysittingFormMultiStep from "@/components/forms/BabysittingFormMultiStep";
import PublishLayout from "@/components/ui/PublishLayout";

const BabysittingDetails = () => {
  const navigate = useNavigate();

  // Check if user came from category selection
  useEffect(() => {
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    if (!selectedCategory || selectedCategory !== 'babysitting') {
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
          .from('ads_babysitting')
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

  const handleBabysittingSubmit = async (data: any, saveAsDraft = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour publier une annonce");
        return;
      }

      if (saveAsDraft) {
        const adData = {
          category: 'babysitting',
          title: data.title || 'Brouillon baby-sitting',
          description: data.description || '',
          price: 0, // Baby-sitting sans prix
          location: 'Lieux saints',
          show_email: data.showEmail,
          show_phone: data.showPhone,
          publish_end_date: data.publishEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };

        const categoryData = {
          gender: data.gender,
          languages: data.languages || [],
        };

        await saveDraft(adData, categoryData);
        return;
      }

      const { data: ad, error: adError } = await supabase
        .from('ads')
        .insert({
          user_id: user.id,
          category: 'babysitting',
          title: data.title,
          description: data.description,
          price: 0, // Baby-sitting sans prix
          location: 'Lieux saints',
          show_email: data.showEmail,
          show_phone: data.showPhone,
          publish_end_date: data.publishEndDate,
          is_published: true,
          is_draft: false,
        })
        .select()
        .single();

      if (adError) throw adError;

      const { error: babysittingError } = await supabase
        .from('ads_babysitting')
        .insert({
          ad_id: ad.id,
          gender: data.gender,
          languages: data.languages,
        });

      if (babysittingError) throw babysittingError;

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
        <BabysittingFormMultiStep 
          onSubmit={handleBabysittingSubmit} 
          onBack={handleBack}
        />
    </PublishLayout>
  );
};

export default BabysittingDetails;