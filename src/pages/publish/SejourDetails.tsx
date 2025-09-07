import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SejourFormMultiStep from "@/components/forms/SejourFormMultiStep";
import PublishLayout from "@/components/ui/PublishLayout";
import RequiredProfileGuard from "@/components/ui/RequiredProfileGuard";

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

  const uploadImages = async (images: File[], coverImage: File | null, userId: string, adId: string) => {
    const uploadedPaths: string[] = [];
    
    try {
      // Upload cover image first
      if (coverImage) {
        const coverFileName = `cover-${Date.now()}.${coverImage.name.split('.').pop()}`;
        const coverPath = `sejours/${userId}/${coverFileName}`;
        
        const { error: coverError } = await supabase.storage
          .from('ad-images')
          .upload(coverPath, coverImage);
          
        if (coverError) throw coverError;
        uploadedPaths.push(coverPath);
      }
      
      // Upload additional images
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const fileName = `${i}-${Date.now()}.${image.name.split('.').pop()}`;
        const imagePath = `sejours/${userId}/${fileName}`;
        
        const { error: imageError } = await supabase.storage
          .from('ad-images')
          .upload(imagePath, image);
          
        if (imageError) throw imageError;
        uploadedPaths.push(imagePath);
      }
      
      return uploadedPaths;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
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
          images: [], // Initialize empty for drafts, will be updated after upload
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
          checked_bags_count: data.checkedBagsCount || 0,
          checked_bags_weight: data.checkedBagsWeight || 20,
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

      // Upload images if provided
      let uploadedImagePaths: string[] = [];
      if (data.images && data.images.length > 0 || data.coverImage) {
        uploadedImagePaths = await uploadImages(data.images || [], data.coverImage, user.id, ad.id);
      }

      // Update ad with image paths
      if (uploadedImagePaths.length > 0) {
        const { error: updateError } = await supabase
          .from('ads')
          .update({ images: uploadedImagePaths })
          .eq('id', ad.id);
          
        if (updateError) throw updateError;
      }

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
          checked_bags_count: data.checkedBagsCount || 0,
          checked_bags_weight: data.checkedBagsWeight || 20,
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
  const steps = ["Catégorie", "Formule", "Infos de base", "Description", "Dates", "Hôtels", "Photos et prix"];
  const currentStep = 3; // We're on "Détails" which now includes multiple sub-steps

  return (
    <RequiredProfileGuard>
      <PublishLayout currentStep={currentStep} totalSteps={7} steps={steps}>
        <SejourFormMultiStep 
          formulaType={formulaType}
          onSubmit={handleSejourSubmit}
          onBack={handleBack}
        />
      </PublishLayout>
    </RequiredProfileGuard>
  );
};

export default SejourDetails;