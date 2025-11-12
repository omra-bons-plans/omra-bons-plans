import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ChauffeurFormMultiStep from "@/components/forms/ChauffeurFormMultiStep";
import PublishLayout from "@/components/ui/PublishLayout";
import { fetchAdForEdit, convertAdDataToFormData } from "@/utils/editAdHelpers";
import RequiredProfileGuard from "@/components/ui/RequiredProfileGuard";
import { DynamicSEO } from "@/components/SEO/DynamicSEO";

const ChauffeurDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEditing = searchParams.get('edit');

  // Check if user came from category selection or is editing
  useEffect(() => {
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    
    if (!isEditing && (!selectedCategory || selectedCategory !== 'chauffeurs')) {
      navigate('/publish');
      return;
    }

    // If editing, fetch the ad data
    if (isEditing) {
      const fetchEditData = async () => {
        setLoading(true);
        const data = await fetchAdForEdit(isEditing);
        if (data) {
          const formData = convertAdDataToFormData(data.adData, data.categoryData, 'chauffeurs');
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
          .from('ads_chauffeurs')
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

  const handleChauffeurSubmit = async (data: any, saveAsDraft = false) => {
    const toastId = toast.loading(saveAsDraft ? "Sauvegarde en cours..." : "Publication en cours...");
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.dismiss(toastId);
        toast.error("Vous devez être connecté pour publier une annonce");
        return;
      }

      console.log('🔍 CHAUFFEUR SUBMIT - isEditing:', isEditing, 'saveAsDraft:', saveAsDraft);

      // Helper function to get primary city for location display
      const getPrimaryCity = (cities: string[]) => {
        if (!cities || cities.length === 0) return 'Ville non spécifiée';
        // Use the first selected city as primary location
        const cityMap: Record<string, string> = {
          'makkah': 'Makkah',
          'medina': 'Médine', 
          'jeddah': 'Jeddah'
        };
        return cityMap[cities[0]] || 'Ville non spécifiée';
      };

      // Handle image uploads if provided
      let imageUrls: string[] = [];
      let coverImageUrl = '';

      // Upload cover image if provided
      if (data.coverImage && typeof data.coverImage === 'object') {
        console.log('Uploading cover image...', data.coverImage.name);
        const coverExt = data.coverImage.name.split('.').pop();
        const coverPath = `chauffeur/${user?.id}/${Date.now()}-cover.${coverExt}`;
        
        const { error: coverError } = await supabase.storage
          .from('ad-images')
          .upload(coverPath, data.coverImage);

        if (coverError) {
          console.error('Error uploading cover image:', coverError);
          toast.dismiss(toastId);
          toast.error("Erreur lors de l'upload de l'image de couverture");
          return;
        }

        coverImageUrl = coverPath;
        console.log('Cover image uploaded:', coverPath);
      }

      // Upload additional images if provided
      if (data.images && data.images.length > 0) {
        console.log('Uploading additional images...', data.images.length);
        try {
          for (let i = 0; i < data.images.length; i++) {
            const image = data.images[i];
            if (typeof image === 'object') {
              console.log(`Uploading image ${i + 1}:`, image.name);
              const ext = image.name.split('.').pop();
              const imagePath = `chauffeur/${user?.id}/${Date.now()}-${i}.${ext}`;
              
              const { error: uploadError } = await supabase.storage
                .from('ad-images')
                .upload(imagePath, image);

              if (uploadError) {
                console.error(`Error uploading image ${i + 1}:`, uploadError);
                toast.dismiss(toastId);
                toast.error(`Erreur lors de l'upload de l'image ${i + 1}`);
                return;
              }

              imageUrls.push(imagePath);
              console.log(`Image ${i + 1} uploaded:`, imagePath);
            }
          }
        } catch (uploadError) {
          console.error('Error during image uploads:', uploadError);
          toast.dismiss(toastId);
          toast.error("Erreur lors de l'upload des images");
          return;
        }
      }

      if (saveAsDraft) {
        const adData = {
          category: 'chauffeurs',
          title: data.title || 'Brouillon chauffeur',
          description: data.description || '',
          price: 0, // Chauffeurs sans prix
          location: getPrimaryCity(data.city),
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
          vehicle_seats: data.vehicleSeats || 4,
          languages: data.languages || [],
          pricing: data.pricing,
        };

        await saveDraft(adData, categoryData);
        toast.dismiss(toastId);
        return;
      }

      console.log(isEditing ? '🔄 UPDATING existing ad:' : '🆕 CREATING new ad:', isEditing);
      console.log('Cities selected:', data.city);
      console.log('Primary city:', getPrimaryCity(data.city));
      
      const adPayload = {
        user_id: user.id,
        category: 'chauffeurs',
        title: data.title,
        description: data.description,
        price: 0, // Chauffeurs sans prix
        location: getPrimaryCity(data.city),
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

      console.log(isEditing ? 'Updating chauffeur details...' : 'Creating chauffeur details...');
      const chauffeurPayload = {
        ad_id: ad.id,
        gender: data.gender,
        city: data.city,
        vehicle_seats: data.vehicleSeats,
        languages: data.languages,
        pricing: data.pricing,
      };

      let chauffeurError;
      if (isEditing) {
        const { error } = await supabase
          .from('ads_chauffeurs')
          .update(chauffeurPayload)
          .eq('ad_id', ad.id);
        chauffeurError = error;
      } else {
        const { error } = await supabase
          .from('ads_chauffeurs')
          .insert(chauffeurPayload);
        chauffeurError = error;
      }

      if (chauffeurError) {
        console.error('Error creating chauffeur details:', chauffeurError);
        toast.dismiss(toastId);
        toast.error("Erreur lors de la création des détails chauffeur");
        return;
      }

      toast.dismiss(toastId);
      toast.success(isEditing ? "Annonce modifiée avec succès !" : "Annonce publiée avec succès !");
      // Clear session storage and redirect
      if (isEditing) {
        sessionStorage.removeItem('editingAdId');
      }
      sessionStorage.removeItem('selectedCategory');
      navigate('/my-ads');
    } catch (error) {
      console.error('Error creating ad:', error);
      toast.dismiss(toastId);
      toast.error("Erreur lors de la publication de l'annonce");
    }
  };

  const steps = ["Catégorie", "Détails"];

  return (
    <RequiredProfileGuard>
      <DynamicSEO
        title="Publier Service Chauffeur Omra & Hajj | Transport Privé Mecque"
        description="Proposez vos services de chauffeur privé pour pèlerins à La Mecque, Médine et Djeddah. Publiez gratuitement votre annonce de transport pour Omra et Hajj."
        keywords={['chauffeur omra', 'transport privé mecque', 'taxi hajj', 'chauffeur médine', 'voiture pèlerinage']}
        path="/publish/chauffeurs"
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
          <ChauffeurFormMultiStep 
            onSubmit={handleChauffeurSubmit} 
            onBack={handleBack}
            initialData={editData}
          />
        )}
      </PublishLayout>
    </RequiredProfileGuard>
  );
};

export default ChauffeurDetails;