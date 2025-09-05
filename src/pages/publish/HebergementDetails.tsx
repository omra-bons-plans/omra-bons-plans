import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import HebergementFormMultiStep from "@/components/forms/HebergementFormMultiStep";
import PublishLayout from "@/components/ui/PublishLayout";

const HebergementDetails = () => {
  const navigate = useNavigate();

  // Check if user came from category selection
  useEffect(() => {
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    if (!selectedCategory || selectedCategory !== 'hebergement') {
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
          .from('ads_hebergements')
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

  const handleHebergementSubmit = async (data: any, saveAsDraft = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour publier une annonce");
        return;
      }

      if (saveAsDraft) {
        const adData = {
          category: 'hebergement',
          title: data.title || 'Brouillon hébergement',
          description: data.description || '',
          price: data.price || 0,
          original_price: data.originalPrice,
          location: `${data.city} - ${data.name}`,
          show_email: data.showEmail,
          show_phone: data.showPhone,
          is_promotion: data.isPromotion,
          promotion_end_date: data.promotionEndDate || null,
          publish_end_date: data.publishEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };

        const categoryData = {
          city: data.city,
          accommodation_type: data.accommodationType,
          name: data.name,
          distance_to_mosque: data.distanceToMosque,
          available_from: data.availableFrom,
          available_to: data.availableTo,
          rooms_count: data.roomsCount,
          beds_count: data.bedsCount,
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

      // Handle image uploads for published ad
      let imageUrls: string[] = [];
      let coverImageUrl = '';

      // Upload cover image
      if (data.coverImage) {
        const coverExt = data.coverImage.name.split('.').pop();
        const coverPath = `hebergement/${user.id}/${Date.now()}-cover.${coverExt}`;
        
        const { error: coverError } = await supabase.storage
          .from('ads-images')
          .upload(coverPath, data.coverImage);

        if (coverError) throw coverError;

        const { data: { publicUrl: coverUrl } } = supabase.storage
          .from('ads-images')
          .getPublicUrl(coverPath);

        coverImageUrl = coverUrl;
      }

      // Upload additional images
      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          const image = data.images[i];
          const ext = image.name.split('.').pop();
          const imagePath = `hebergement/${user.id}/${Date.now()}-${i}.${ext}`;
          
          const { error: uploadError } = await supabase.storage
            .from('ads-images')
            .upload(imagePath, image);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('ads-images')
            .getPublicUrl(imagePath);

          imageUrls.push(publicUrl);
        }
      }

      // Create the main ad
      const { data: ad, error: adError } = await supabase
        .from('ads')
        .insert({
          category: 'hebergement',
          title: data.title,
          description: data.description,
          price: data.price,
          original_price: data.originalPrice,
          location: `${data.city} - ${data.name}`,
          cover_image: coverImageUrl,
          images: imageUrls,
          show_email: data.showEmail,
          show_phone: data.showPhone,
          is_promotion: data.isPromotion,
          promotion_end_date: data.promotionEndDate || null,
          publish_end_date: data.publishEndDate,
          is_published: true,
          is_draft: false,
          user_id: user.id,
        })
        .select()
        .single();

      if (adError) throw adError;

      // Create the hebergement-specific data
      const { error: hebergementError } = await supabase
        .from('ads_hebergements')
        .insert({
          ad_id: ad.id,
          city: data.city,
          accommodation_type: data.accommodationType,
          name: data.name,
          distance_to_mosque: data.distanceToMosque,
          available_from: data.availableFrom,
          available_to: data.availableTo,
          rooms_count: data.roomsCount,
          beds_count: data.bedsCount,
          has_living_room: data.hasLivingRoom,
          has_wifi: data.hasWifi,
          has_ac: data.hasAc,
          has_tv: data.hasTv,
          has_fridge: data.hasFridge,
          has_washing_machine: data.hasWashingMachine,
          video_url: data.videoUrl,
        });

      if (hebergementError) throw hebergementError;

      toast.success("Annonce d'hébergement publiée avec succès !");
      
      // Clear session storage and redirect
      sessionStorage.removeItem('selectedCategory');
      navigate('/');
      
    } catch (error) {
      console.error('Error publishing hebergement ad:', error);
      toast.error("Erreur lors de la publication de l'annonce");
    }
  };

  const steps = ["Catégorie", "Détails"];
  
  return (
    <PublishLayout 
      currentStep={2} 
      totalSteps={2} 
      steps={steps}
      onClose={() => navigate('/')}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Publier un hébergement
            </h1>
            <p className="text-muted-foreground">
              Partagez votre hébergement à La Mecque ou Médine
            </p>
          </div>

          <HebergementFormMultiStep 
            onSubmit={handleHebergementSubmit}
            onBack={handleBack}
          />
        </div>
      </div>
    </PublishLayout>
  );
};

export default HebergementDetails;