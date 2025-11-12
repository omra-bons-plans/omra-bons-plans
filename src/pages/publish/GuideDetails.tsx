import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import GuideFormMultiStep from "@/components/forms/GuideFormMultiStep";
import PublishLayout from "@/components/ui/PublishLayout";
import { fetchAdForEdit, convertAdDataToFormData } from "@/utils/editAdHelpers";
import RequiredProfileGuard from "@/components/ui/RequiredProfileGuard";
import { DynamicSEO } from "@/components/SEO/DynamicSEO";

const GuideDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEditing = searchParams.get('edit');

  // Check if user came from category selection or is editing
  useEffect(() => {
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    
    if (!isEditing && (!selectedCategory || selectedCategory !== 'guides')) {
      navigate('/publish');
      return;
    }

    // If editing, fetch the ad data
    if (isEditing) {
      const fetchEditData = async () => {
        setLoading(true);
        const data = await fetchAdForEdit(isEditing);
        if (data) {
          const formData = convertAdDataToFormData(data.adData, data.categoryData, 'guides');
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
      navigate('/my-ads');
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

      console.log('🔍 GUIDE SUBMIT - isEditing:', isEditing, 'saveAsDraft:', saveAsDraft);

      // Handle image uploads if provided
      let imageUrls: string[] = [];
      let coverImageUrl = '';

      // Upload cover image if provided
      if (data.coverImage && typeof data.coverImage === 'object') {
        console.log('Uploading cover image...', data.coverImage.name);
        const coverExt = data.coverImage.name.split('.').pop();
        const coverPath = `guide/${user?.id}/${Date.now()}-cover.${coverExt}`;
        
        const { error: coverError } = await supabase.storage
          .from('ad-images')
          .upload(coverPath, data.coverImage);

        if (coverError) {
          console.error('Error uploading cover image:', coverError);
          throw coverError;
        }

        coverImageUrl = coverPath;
        console.log('Cover image uploaded:', coverPath);
      }

      // Upload additional images if provided
      if (data.images && data.images.length > 0) {
        console.log('Uploading additional images...', data.images.length);
        for (let i = 0; i < data.images.length; i++) {
          const image = data.images[i];
          if (typeof image === 'object') {
            console.log(`Uploading image ${i + 1}:`, image.name);
            const ext = image.name.split('.').pop();
            const imagePath = `guide/${user?.id}/${Date.now()}-${i}.${ext}`;
            
            const { error: uploadError } = await supabase.storage
              .from('ad-images')
              .upload(imagePath, image);

            if (uploadError) {
              console.error(`Error uploading image ${i + 1}:`, uploadError);
              throw uploadError;
            }

            imageUrls.push(imagePath);
            console.log(`Image ${i + 1} uploaded:`, imagePath);
          }
        }
      }

      if (saveAsDraft) {
        const adData = {
          category: 'guides',
          title: data.title || 'Brouillon guide',
          description: data.description || '',
          price: 0, // Guides sans prix
          location: data.city === 'both' ? 'Makkah - Médine' : data.city === 'makkah' ? 'Makkah' : 'Médine',
          images: imageUrls,
          cover_image: coverImageUrl,
          show_email: data.showEmail,
          show_phone: data.showPhone,
          show_whatsapp: data.showWhatsapp,
          show_professional_phone: data.showProfessionalPhone,
          publish_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 an dans le futur
          is_paused: false,
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
          pricing: data.pricing,
        };

        await saveDraft(adData, categoryData);
        return;
      }

      const adPayload = {
        user_id: user.id,
        category: 'guides',
        title: data.title,
        description: data.description,
        price: 0, // Guides sans prix
        location: data.city === 'both' ? 'Makkah - Médine' : data.city === 'makkah' ? 'Makkah' : 'Médine',
        images: imageUrls.length > 0 ? imageUrls : (editData?.existingImages || []),
        cover_image: coverImageUrl || (editData?.coverImageUrl || ''),
        show_email: data.showEmail,
        show_phone: data.showPhone,
        show_whatsapp: data.showWhatsapp,
        show_professional_phone: data.showProfessionalPhone,
        publish_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 an dans le futur
        is_published: true,
        is_draft: false,
        is_paused: false,
      };

      let ad;
      if (isEditing) {
        const { data: updatedAd, error: adError } = await supabase
          .from('ads')
          .update(adPayload)
          .eq('id', isEditing)
          .select()
          .single();
        
        if (adError) throw adError;
        ad = updatedAd;
      } else {
        const { data: newAd, error: adError } = await supabase
          .from('ads')
          .insert(adPayload)
          .select()
          .single();
        
        if (adError) throw adError;
        ad = newAd;
      }

      const guidePayload = {
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
        pricing: data.pricing,
      };

      let guideError;
      if (isEditing) {
        const { error } = await supabase
          .from('ads_guides')
          .update(guidePayload)
          .eq('ad_id', ad.id);
        guideError = error;
      } else {
        const { error } = await supabase
          .from('ads_guides')
          .insert(guidePayload);
        guideError = error;
      }

      if (guideError) throw guideError;

      toast.success(isEditing ? "Annonce modifiée avec succès !" : "Annonce publiée avec succès !");
      // Clear session storage and redirect
      if (isEditing) {
        sessionStorage.removeItem('editingAdId');
      }
      sessionStorage.removeItem('selectedCategory');
      navigate('/my-ads');
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error("Erreur lors de la publication de l'annonce");
    }
  };

  const steps = ["Catégorie", "Détails"];

  return (
    <RequiredProfileGuard>
      <DynamicSEO
        title="Publier Annonce Guide Spirituel Omra & Hajj | Accompagnement"
        description="Proposez vos services de guide spirituel pour accompagner les pèlerins durant leur Omra ou Hajj. Publiez gratuitement votre annonce de guide religieux à La Mecque."
        keywords={['guide omra', 'accompagnateur hajj', 'guide spirituel mecque', 'mourchid omra', 'accompagnement pèlerinage']}
        path="/publish/guides"
      />
      <PublishLayout currentStep={2} totalSteps={2} steps={steps}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement de l'annonce...</p>
            </div>
          </div>
        ) : (
          <GuideFormMultiStep 
            onSubmit={handleGuideSubmit} 
            onBack={handleBack}
            initialData={editData}
          />
        )}
      </PublishLayout>
    </RequiredProfileGuard>
  );
};

export default GuideDetails;