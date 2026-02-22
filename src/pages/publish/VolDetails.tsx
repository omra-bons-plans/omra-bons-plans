import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import VolFormMultiStep from "@/components/forms/VolFormMultiStep";
import PublishLayout from "@/components/ui/PublishLayout";
import { fetchAdForEdit, convertAdDataToFormData } from "@/utils/editAdHelpers";
import RequiredProfileGuard from "@/components/ui/RequiredProfileGuard";
import { DynamicSEO } from "@/components/SEO/DynamicSEO";

const VolDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEditing = searchParams.get('edit');

  // Check if user came from category selection or is editing
  useEffect(() => {
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    
    if (!isEditing && (!selectedCategory || selectedCategory !== 'vols')) {
      navigate('/publish');
      return;
    }

    // If editing, fetch the ad data
    if (isEditing) {
      const fetchEditData = async () => {
        setLoading(true);
        const data = await fetchAdForEdit(isEditing);
        if (data) {
          const formData = convertAdDataToFormData(data.adData, data.categoryData, 'vols');
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

      let ad;
      if (isEditing) {
        // Update existing ad as draft
        const { data: updatedAd, error: adError } = await supabase
          .from('ads')
          .update({
            ...adData,
            is_published: false,
            is_draft: true,
          })
          .eq('id', isEditing)
          .select()
          .single();

        if (adError) throw adError;
        ad = updatedAd;
      } else {
        // Create new ad as draft
        const { data: newAd, error: adError } = await supabase
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
        ad = newAd;
      }

      // Save or update category-specific data if provided
      if (categoryData) {
        if (isEditing) {
          const { error: categoryError } = await supabase
            .from('ads_vols')
            .update(categoryData)
            .eq('ad_id', ad.id);

          if (categoryError) throw categoryError;
        } else {
          const { error: categoryError } = await supabase
            .from('ads_vols')
            .insert({ ad_id: ad.id, ...categoryData });

          if (categoryError) throw categoryError;
        }
      }

      toast.success("Brouillon sauvegardé avec succès !");
      // Clear session storage and redirect
      sessionStorage.removeItem('selectedCategory');
      if (isEditing) {
        sessionStorage.removeItem('editingAdId');
      }
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

      console.log('🔍 VOL SUBMIT - isEditing:', isEditing, 'saveAsDraft:', saveAsDraft);

      if (saveAsDraft) {
        const adData = {
          category: 'vols',
          title: data.title || 'Brouillon vol',
          description: data.description || '',
          price: Number(data.price) || 0,
          original_price: data.originalPrice ? Number(data.originalPrice) : null,
          location: `${data.departureAirport} → ${data.arrivalAirport}`,
          images: data.images || [],
          cover_image: data.coverImageUrl || null,
          show_email: data.showEmail,
          show_phone: data.showPhone,
          show_whatsapp: data.showWhatsapp,
          is_promotion: data.isPromotion,
          promotion_end_date: data.promotionEndDate || null,
          publish_end_date: data.publishEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };

        const categoryData = {
          airline: data.airline,
          departure_airport: data.departureAirport,
          arrival_airport: data.arrivalAirport,
          departure_date: data.departureDate?.toISOString ? data.departureDate.toISOString().split('T')[0] : data.departureDate,
          return_date: data.returnDate?.toISOString ? data.returnDate.toISOString().split('T')[0] : data.returnDate,
          has_stopover: data.hasOutboundStopover || data.hasReturnStopover,
          stopover_details: [
            data.hasOutboundStopover ? `Aller: ${data.outboundStopoverDetails}` : '',
            data.hasReturnStopover ? `Retour: ${data.returnStopoverDetails}` : ''
          ].filter(Boolean).join(' | ') || null,
          checked_bags_count: data.checkedBagsCount || 0,
          checked_bags_weight: data.checkedBagsWeight || 20,
          carry_on_bags_count: data.carryOnBagsCount || 1,
          carry_on_bags_weight: data.carryOnBagsWeight || 10,
        };

        await saveDraft(adData, categoryData);
        return;
      }

      const adPayload = {
        user_id: user.id,
        category: 'vols',
        title: data.title,
        description: data.description,
        price: Number(data.price) || 0,
        original_price: data.originalPrice ? Number(data.originalPrice) : null,
        location: `${data.departureAirport} → ${data.arrivalAirport}`,
        images: data.images || [],
        cover_image: data.coverImageUrl || null,
        show_email: data.showEmail,
        show_phone: data.showPhone,
        show_whatsapp: data.showWhatsapp,
        is_promotion: data.isPromotion,
        promotion_end_date: data.promotionEndDate || null,
        publish_end_date: data.publishEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours par défaut
        is_published: true,
        is_draft: false,
      };

      let ad;
      if (isEditing) {
        // Remove user_id from update payload
        const { user_id, ...updatePayload } = adPayload;
        const { data: updatedAd, error: adError } = await supabase
          .from('ads')
          .update(updatePayload)
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

      const volPayload = {
        ad_id: ad.id,
        airline: data.airline,
        departure_airport: data.departureAirport,
        arrival_airport: data.arrivalAirport,
        departure_date: data.departureDate?.toISOString ? data.departureDate.toISOString().split('T')[0] : data.departureDate,
        return_date: data.returnDate?.toISOString ? data.returnDate.toISOString().split('T')[0] : data.returnDate,
        has_stopover: data.hasOutboundStopover || data.hasReturnStopover,
        stopover_details: [
          data.hasOutboundStopover ? `Aller: ${data.outboundStopoverDetails}` : '',
          data.hasReturnStopover ? `Retour: ${data.returnStopoverDetails}` : ''
        ].filter(Boolean).join(' | ') || null,
        checked_bags_count: data.checkedBagsCount || 0,
        checked_bags_weight: data.checkedBagsWeight || 20,
        carry_on_bags_count: data.carryOnBagsCount || 1,
        carry_on_bags_weight: data.carryOnBagsWeight || 10,
      };

      let volError;
      if (isEditing) {
        // For updates, remove ad_id from payload
        const { ad_id, ...updateVolPayload } = volPayload;
        const { error } = await supabase
          .from('ads_vols')
          .update(updateVolPayload)
          .eq('ad_id', ad.id);
        volError = error;
      } else {
        const { error } = await supabase
          .from('ads_vols')
          .insert(volPayload);
        volError = error;
      }

      if (volError) throw volError;

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

  const steps = ["Catégorie", "Infos générales", "Compagnie", "Dates", "Photos/Prix", "Publication", "Récapitulatif"];

  return (
    <RequiredProfileGuard>
      <DynamicSEO
        title="Publier Billet d'Avion Omra & Hajj | Vol Paris Djeddah Médine"
        description="Proposez des billets d'avion pour l'Omra et le Hajj depuis la France vers Djeddah, Médine ou La Mecque. Publiez gratuitement vos offres de vols pour pèlerins."
        keywords={['vol omra', 'billet avion hajj', 'vol paris djeddah', 'vol médine', 'billet pèlerinage']}
        path="/publish/vols"
      />
      <PublishLayout currentStep={2} totalSteps={7} steps={steps}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement de l'annonce...</p>
            </div>
          </div>
        ) : (
          <VolFormMultiStep 
            onSubmit={handleVolSubmit} 
            onBack={handleBack}
            initialData={editData}
          />
        )}
      </PublishLayout>
    </RequiredProfileGuard>
  );
};

export default VolDetails;