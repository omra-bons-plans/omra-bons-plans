import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import HebergementFormMultiStep from "@/components/forms/HebergementFormMultiStep";
import PublishLayout from "@/components/ui/PublishLayout";
import { fetchAdForEdit, convertAdDataToFormData } from "@/utils/editAdHelpers";
import RequiredProfileGuard from "@/components/ui/RequiredProfileGuard";
import { DynamicSEO } from "@/components/SEO/DynamicSEO";

const HebergementDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEditing = searchParams.get('edit');

  // Check if user came from category selection or is editing
  useEffect(() => {
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    if (!isEditing && (!selectedCategory || selectedCategory !== 'hebergement')) {
      navigate('/publish');
      return;
    }

    // If editing, fetch the ad data
    if (isEditing) {
      const fetchEditData = async () => {
        setLoading(true);
        const data = await fetchAdForEdit(isEditing);
        if (data) {
          const formData = convertAdDataToFormData(data.adData, data.categoryData, 'hebergement');
          setEditData(formData);
        } else {
          toast.error("Erreur lors du chargement de l'annonce");
          navigate('/my-ads');
        }
        setLoading(false);
      };
      fetchEditData();
    }
  }, [navigate, isEditing]);

  const handleBack = () => {
    if (isEditing) {
      navigate('/my-ads');
    } else {
      navigate('/publish');
    }
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
          .from('ads_hebergements')
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

  const updateExistingAd = async (data: any, saveAsDraft = false) => {
    try {
      // Handle image uploads if new images are provided
      let imageUrls: string[] = [...(data.existingImages || [])];
      let coverImageUrl = data.coverImageUrl || '';

      // Upload new cover image if provided
      if (data.coverImage && typeof data.coverImage === 'object') {
        const { data: { user } } = await supabase.auth.getUser();
        const coverExt = data.coverImage.name.split('.').pop();
        const coverPath = `hebergement/${user?.id}/${Date.now()}-cover.${coverExt}`;
        
        const { error: coverError } = await supabase.storage
          .from('ad-images')
          .upload(coverPath, data.coverImage);

        if (coverError) {
          console.error('Error uploading new cover image:', coverError);
          throw coverError;
        }

        coverImageUrl = coverPath;
      }

      // Upload new additional images if provided
      if (data.images && data.images.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        for (let i = 0; i < data.images.length; i++) {
          const image = data.images[i];
          if (typeof image === 'object') {
            const ext = image.name.split('.').pop();
            const imagePath = `hebergement/${user?.id}/${Date.now()}-${i}.${ext}`;
            
            const { error: uploadError } = await supabase.storage
              .from('ad-images')
              .upload(imagePath, image);

            if (uploadError) {
              console.error(`Error uploading new image ${i + 1}:`, uploadError);
              throw uploadError;
            }

            imageUrls.push(imagePath);
          }
        }
      }

      // Update the main ad
      const adData = {
        title: data.title,
        description: data.description,
        price: data.price ? Number(data.price) : 0,
        original_price: data.originalPrice ? Number(data.originalPrice) : null,
        location: `${data.city} - ${data.name}`,
        cover_image: coverImageUrl,
        images: imageUrls,
        show_email: data.showEmail,
        show_phone: data.showPhone,
        show_whatsapp: data.showWhatsapp,
        show_professional_phone: data.showProfessionalPhone,
        is_promotion: data.isPromotion,
        promotion_end_date: data.promotionEndDate || null,
        publish_end_date: data.publishEndDate ? new Date(data.publishEndDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_published: !saveAsDraft,
        is_draft: saveAsDraft,
        updated_at: new Date().toISOString(),
      };

      const { error: adError } = await supabase
        .from('ads')
        .update(adData)
        .eq('id', isEditing);

      if (adError) throw adError;

      // Update category-specific data
      // Convert French values to English for database
      const accommodationTypeMap: Record<string, string> = {
        'appartement': 'apartment',
        'hotel': 'hotel'
      };
      
      const { error: categoryError } = await supabase
        .from('ads_hebergements')
        .update({
          city: data.city,
          accommodation_type: accommodationTypeMap[data.accommodationType] || 'apartment',
          name: data.name,
          distance_to_mosque: data.distanceToMosque || null,
          walking_minutes: data.walkingMinutes || null,
          available_from: data.availableFrom,
          available_to: data.availableTo,
          rooms_count: data.roomsCount ? Number(data.roomsCount) : null,
          beds_count: data.bedsCount ? Number(data.bedsCount) : null,
          has_living_room: data.hasLivingRoom,
          has_wifi: data.hasWifi,
          has_ac: data.hasAc,
          has_tv: data.hasTv,
          has_fridge: data.hasFridge,
          has_washing_machine: data.hasWashingMachine,
          video_url: data.videoUrl,
        })
        .eq('ad_id', isEditing);

      if (categoryError) throw categoryError;

      toast.success(saveAsDraft ? "Brouillon mis à jour avec succès !" : "Annonce mise à jour avec succès !");
      sessionStorage.removeItem('selectedCategory');
      sessionStorage.removeItem('editingAdId');
      navigate('/my-ads');
    } catch (error) {
      console.error('Error updating ad:', error);
      toast.error("Erreur lors de la mise à jour de l'annonce");
    }
  };

  const handleHebergementSubmit = async (data: any, saveAsDraft = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour publier une annonce");
        return;
      }

      console.log('🔍 HEBERGEMENT SUBMIT - isEditing:', isEditing, 'saveAsDraft:', saveAsDraft);

      console.log('🔍 handleHebergementSubmit - isEditing:', isEditing, 'saveAsDraft:', saveAsDraft);

      if (isEditing) {
        // Update existing ad
        console.log('📝 Updating existing ad');
        await updateExistingAd(data, saveAsDraft);
        return; // Important: return here to avoid falling through to create new ad
      } 
      
      if (saveAsDraft) {
        const adData = {
          category: 'hebergement',
          title: data.title || 'Brouillon hébergement',
          description: data.description || '',
          price: data.price ? Number(data.price) : 0,
          original_price: data.originalPrice ? Number(data.originalPrice) : null,
          location: `${data.city || 'Non spécifié'} - ${data.name || 'Brouillon hébergement'}`,
          show_email: data.showEmail,
          show_phone: data.showPhone,
          show_whatsapp: data.showWhatsapp,
          show_professional_phone: data.showProfessionalPhone,
          is_promotion: data.isPromotion,
          promotion_end_date: data.promotionEndDate || null,
          publish_end_date: data.publishEndDate ? new Date(data.publishEndDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };

        // Convert French values to English for database
        const accommodationTypeMap: Record<string, string> = {
          'appartement': 'apartment',
          'hotel': 'hotel'
        };

        const categoryData = {
          city: data.city || 'Non spécifié',
          accommodation_type: accommodationTypeMap[data.accommodationType] || 'apartment',
          name: data.name || 'Brouillon hébergement',
          distance_to_mosque: data.distanceToMosque || null,
          walking_minutes: data.walkingMinutes || null,
          available_from: data.availableFrom,
          available_to: data.availableTo,
          rooms_count: data.roomsCount ? Number(data.roomsCount) : null,
          beds_count: data.bedsCount ? Number(data.bedsCount) : null,
          has_living_room: data.hasLivingRoom,
          has_wifi: data.hasWifi,
          has_ac: data.hasAc,
          has_tv: data.hasTv,
          has_fridge: data.hasFridge,
          has_washing_machine: data.hasWashingMachine,
          video_url: data.videoUrl,
        };

        await saveDraft(adData, categoryData);
        return;
      }

      console.log('✨ Creating new published ad');
      // Handle image uploads for published ad
      let imageUrls: string[] = [];
      let coverImageUrl = '';

      // Upload cover image
      if (data.coverImage) {
        const coverExt = data.coverImage.name.split('.').pop();
        const coverPath = `hebergement/${user.id}/${Date.now()}-cover.${coverExt}`;
        
        const { error: coverError } = await supabase.storage
          .from('ad-images')
          .upload(coverPath, data.coverImage);

        if (coverError) {
          console.error('Error uploading cover image:', coverError);
          throw coverError;
        }

        coverImageUrl = coverPath;
      }

      // Upload additional images
      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          const image = data.images[i];
          const ext = image.name.split('.').pop();
          const imagePath = `hebergement/${user.id}/${Date.now()}-${i}.${ext}`;
          
          const { error: uploadError } = await supabase.storage
            .from('ad-images')
            .upload(imagePath, image);

          if (uploadError) {
            console.error(`Error uploading image ${i + 1}:`, uploadError);
            throw uploadError;
          }

          imageUrls.push(imagePath);
        }
      }

      // Create the main ad
      const adData = {
        category: 'hebergement',
        title: data.title,
        description: data.description,
        price: data.price ? Number(data.price) : 0,
        original_price: data.originalPrice ? Number(data.originalPrice) : null,
        location: `${data.city} - ${data.name}`,
        cover_image: coverImageUrl,
        images: imageUrls,
        user_id: user.id,
        show_email: data.showEmail,
        show_phone: data.showPhone,
        show_whatsapp: data.showWhatsapp,
        show_professional_phone: data.showProfessionalPhone,
        is_promotion: data.isPromotion,
        promotion_end_date: data.promotionEndDate || null,
        publish_end_date: data.publishEndDate ? new Date(data.publishEndDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_published: true,
        is_draft: false,
      };

      const { data: ad, error: adError } = await supabase
        .from('ads')
        .insert(adData)
        .select()
        .single();

      if (adError) throw adError;

      // Create the hebergement-specific data
      // Convert French values to English for database
      const accommodationTypeMap: Record<string, string> = {
        'appartement': 'apartment',
        'hotel': 'hotel'
      };
      
      const { error: hebergementError } = await supabase
        .from('ads_hebergements')
        .insert({
          ad_id: ad.id,
          city: data.city,
          accommodation_type: accommodationTypeMap[data.accommodationType] || 'apartment',
          name: data.name,
          distance_to_mosque: data.distanceToMosque || null,
          walking_minutes: data.walkingMinutes || null,
          available_from: data.availableFrom,
          available_to: data.availableTo,
          rooms_count: data.roomsCount ? Number(data.roomsCount) : null,
          beds_count: data.bedsCount ? Number(data.bedsCount) : null,
          has_living_room: data.hasLivingRoom,
          has_wifi: data.hasWifi,
          has_ac: data.hasAc,
          has_tv: data.hasTv,
          has_fridge: data.hasFridge,
          has_washing_machine: data.hasWashingMachine,
          video_url: data.videoUrl,
        });

      if (hebergementError) throw hebergementError;

      toast.success("Annonce publiée avec succès !");
      
      // Clear session storage and redirect
      sessionStorage.removeItem('selectedCategory');
      navigate('/my-ads');
    } catch (error) {
      console.error('Error publishing hebergement ad:', error);
      toast.error("Erreur lors de la publication de l'annonce");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const steps = ["Catégorie", "Détails"];
  
  return (
    <RequiredProfileGuard>
      <DynamicSEO
        title="Publier Annonce Hébergement Mecque & Médine | Hôtel Appartement"
        description="Proposez votre hébergement, hôtel, appartement ou chambre à La Mecque ou Médine pour les pèlerins. Publiez gratuitement votre annonce de logement Omra et Hajj."
        keywords={['hébergement omra', 'hôtel mecque', 'appartement médine', 'location pèlerinage', 'logement hajj']}
        path="/publish/hebergement"
      />
      <PublishLayout
        currentStep={2} 
        totalSteps={2} 
        steps={steps}
        onClose={() => navigate('/my-ads')}
      >
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {isEditing ? "Modifier l'hébergement" : "Publier un hébergement"}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? "Modifiez les détails de votre hébergement" : "Partagez votre hébergement à La Mecque ou Médine"}
              </p>
            </div>

            <HebergementFormMultiStep 
              onSubmit={handleHebergementSubmit}
              onBack={handleBack}
              initialData={editData}
              isEditing={!!isEditing}
            />
          </div>
        </div>
      </PublishLayout>
    </RequiredProfileGuard>
  );
};

export default HebergementDetails;