import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SejourFormMultiStep from "@/components/forms/SejourFormMultiStep";
import PublishLayout from "@/components/ui/PublishLayout";
import RequiredProfileGuard from "@/components/ui/RequiredProfileGuard";

const SejourDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const editAdId = searchParams.get('edit');
  const isEditMode = !!editAdId;

  // Check if user came from previous steps or if in edit mode
  useEffect(() => {
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    const selectedFormula = sessionStorage.getItem('selectedFormula');
    
    // Si on est en mode édition, on peut bypasser la vérification du flow normal
    if (isEditMode) {
      // Forcer la catégorie et formule en session storage pour l'édition
      sessionStorage.setItem('selectedCategory', 'sejours');
      fetchExistingData();
      return;
    }
    
    if (!selectedCategory || selectedCategory !== 'sejours' || !selectedFormula) {
      navigate('/publish');
    }
  }, [navigate, isEditMode]);
  
  // Récupérer les données existantes pour l'édition
  const fetchExistingData = async () => {
    if (!editAdId) return;
    
    try {
      setLoading(true);
      console.log('🔍 Fetching existing ad data for ID:', editAdId);
      
      // Récupérer l'annonce principale
      const { data: adData, error: adError } = await supabase
        .from('ads')
        .select('*')
        .eq('id', editAdId)
        .single();
        
      if (adError) throw adError;
      
      // Récupérer les données spécifiques au séjour
      const { data: sejourData, error: sejourError } = await supabase
        .from('ads_sejours')
        .select('*')
        .eq('ad_id', editAdId)
        .single();
        
      if (sejourError) throw sejourError;
      
      console.log('✅ Ad data retrieved:', adData);
      console.log('✅ Sejour data retrieved:', sejourData);
      
      // Définir la formule dans le sessionStorage pour le composant
      if (sejourData.formula_type) {
        sessionStorage.setItem('selectedFormula', sejourData.formula_type);
      }
      
      // Transformer les données pour le formulaire
      const formData = {
        title: adData.title,
        description: adData.description,
        price: adData.price,
        originalPrice: adData.original_price,
        airline: sejourData.airline,
        departureDate: sejourData.departure_date,
        returnDate: sejourData.return_date,
        nightsMedina: sejourData.nights_medina || 0,
        nightsMecca: sejourData.nights_mecca || 0,
        medinaHotelName: sejourData.medina_hotel_name || '',
        medinaHotelDistance: sejourData.medina_hotel_distance || '',
        meccaHotelName: sejourData.mecca_hotel_name || '',
        meccaHotelDistance: sejourData.mecca_hotel_distance || '',
        publishEndDate: adData.publish_end_date,
        showEmail: adData.show_email,
        showPhone: adData.show_phone,
        showWhatsapp: adData.show_whatsapp,
        showProfessionalPhone: adData.show_professional_phone,
        isPromotion: adData.is_promotion,
        promotionEndDate: adData.promotion_end_date,
        checkedBagsCount: sejourData.checked_bags_count || 0,
        checkedBagsWeight: sejourData.checked_bags_weight || 20,
        coverImage: adData.cover_image,
        images: adData.images || []
      };
      
      setInitialData(formData);
      console.log('✅ Form data prepared:', formData);
      
    } catch (error) {
      console.error('Error fetching existing ad data:', error);
      toast.error('Erreur lors du chargement des données');
      navigate('/my-ads');
    } finally {
      setLoading(false);
    }
  };

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
      navigate('/my-ads');
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

      if (isEditMode && editAdId) {
        // Mode édition - UPDATE
        console.log('🔄 Updating existing ad:', editAdId);
        
        // Mettre à jour l'annonce principale
        const { error: adError } = await supabase
          .from('ads')
          .update({
            title: data.title,
            description: data.description,
            price: data.price,
            original_price: data.originalPrice,
            location: `${data.nightsMedina ? 'Médine' : ''} ${data.nightsMecca ? 'Makkah' : ''}`.trim(),
            show_email: data.showEmail,
            show_phone: data.showPhone,
            show_whatsapp: data.showWhatsapp,
            show_professional_phone: data.showProfessionalPhone,
            is_promotion: data.isPromotion,
            promotion_end_date: data.promotionEndDate || null,
            publish_end_date: data.publishEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours par défaut
            is_published: !saveAsDraft,
            is_draft: saveAsDraft,
          })
          .eq('id', editAdId)
          .eq('user_id', user.id);

        if (adError) throw adError;

        // Gérer les images si elles ont été modifiées
        if (data.images && data.images.length > 0 || data.coverImage) {
          const uploadedImagePaths = await uploadImages(data.images || [], data.coverImage, user.id, editAdId);
          
          if (uploadedImagePaths.length > 0) {
            const { error: updateError } = await supabase
              .from('ads')
              .update({ 
                images: uploadedImagePaths,
                cover_image: uploadedImagePaths[0] || null
              })
              .eq('id', editAdId);
              
            if (updateError) throw updateError;
          }
        }

        // Mettre à jour les détails du séjour
        const { error: sejourError } = await supabase
          .from('ads_sejours')
          .update({
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
          })
          .eq('ad_id', editAdId);

        if (sejourError) throw sejourError;

        toast.success(saveAsDraft ? "Brouillon sauvegardé avec succès !" : "Annonce mise à jour avec succès !");
        
        // Clean up and redirect
        sessionStorage.removeItem('editingAdId');
        if (!saveAsDraft) {
          sessionStorage.removeItem('selectedCategory');
          sessionStorage.removeItem('selectedFormula');
        }
        navigate('/my-ads');
        return;
      }

      // Mode création - logique existante
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
          publish_end_date: data.publishEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours par défaut
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
      navigate('/my-ads');
    } catch (error) {
      console.error('Error creating/updating ad:', error);
      toast.error(isEditMode ? "Erreur lors de la mise à jour" : "Erreur lors de la publication de l'annonce");
    }
  };

  const formulaType = sessionStorage.getItem('selectedFormula') || '';
  const steps = ["Catégorie", "Formule", "Infos de base", "Description", "Dates", "Hôtels", "Photos et prix"];
  const currentStep = 3; // We're on "Détails" which now includes multiple sub-steps

  if (loading) {
    return (
      <RequiredProfileGuard>
        <PublishLayout currentStep={currentStep} totalSteps={7} steps={steps}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </PublishLayout>
      </RequiredProfileGuard>
    );
  }

  return (
    <RequiredProfileGuard>
      <PublishLayout currentStep={currentStep} totalSteps={7} steps={steps}>
        <SejourFormMultiStep 
          formulaType={formulaType}
          onSubmit={handleSejourSubmit}
          onBack={handleBack}
          initialData={initialData}
          isEditMode={isEditMode}
        />
      </PublishLayout>
    </RequiredProfileGuard>
  );
};

export default SejourDetails;