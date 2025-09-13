import { supabase } from '@/integrations/supabase/client';

export interface EditAdData {
  adData: any;
  categoryData: any;
}

export const fetchAdForEdit = async (adId: string): Promise<EditAdData | null> => {
  try {
    // Fetch the main ad data
    const { data: adData, error: adError } = await supabase
      .from('ads')
      .select('*')
      .eq('id', adId)
      .single();

    if (adError) throw adError;

    // Fetch category-specific data
    let categoryData = null;
    let categoryTable = '';

    switch (adData.category) {
      case 'sejours':
        categoryTable = 'ads_sejours';
        break;
      case 'vols':
        categoryTable = 'ads_vols';
        break;
      case 'guides':
        categoryTable = 'ads_guides';
        break;
      case 'chauffeurs':
        categoryTable = 'ads_chauffeurs';
        break;
      case 'babysitting':
        categoryTable = 'ads_babysitting';
        break;
      case 'hebergement':
        categoryTable = 'ads_hebergements';
        break;
    }

    if (categoryTable) {
      const { data, error } = await supabase
        .from(categoryTable as any)
        .select('*')
        .eq('ad_id', adId)
        .single();

      if (error) {
        console.warn(`No category data found for ${adData.category}:`, error);
      } else {
        categoryData = data;
      }
    }

    return {
      adData,
      categoryData
    };
  } catch (error) {
    console.error('Error fetching ad for edit:', error);
    return null;
  }
};

export const convertAdDataToFormData = (adData: any, categoryData: any, category: string) => {
  const baseFormData = {
    title: adData.title || '',
    description: adData.description || '',
    price: adData.price || 0,
    originalPrice: adData.original_price || null,
    location: adData.location || '',
    showEmail: adData.show_email || true,
    showPhone: adData.show_phone || false,
    showWhatsapp: adData.show_whatsapp || false,
    showProfessionalPhone: adData.show_professional_phone || false,
    isPromotion: adData.is_promotion || false,
    promotionEndDate: adData.promotion_end_date || null,
    publishEndDate: adData.publish_end_date || null,
    coverImageUrl: adData.cover_image || '',
    existingImages: adData.images || [],
  };

  // Add category-specific fields
  switch (category) {
    case 'hebergement':
      return {
        ...baseFormData,
        city: categoryData?.city || '',
        accommodationType: categoryData?.accommodation_type || 'hotel',
        name: categoryData?.name || '',
        distanceToMosque: categoryData?.distance_to_mosque || '',
        availableFrom: categoryData?.available_from || '',
        availableTo: categoryData?.available_to || '',
        roomsCount: categoryData?.rooms_count || 1,
        bedsCount: categoryData?.beds_count || 1,
        hasLivingRoom: categoryData?.has_living_room || false,
        hasWifi: categoryData?.has_wifi || false,
        hasAc: categoryData?.has_ac || false,
        hasTv: categoryData?.has_tv || false,
        hasFridge: categoryData?.has_fridge || false,
        hasWashingMachine: categoryData?.has_washing_machine || false,
        videoUrl: categoryData?.video_url || '',
      };

    case 'sejours':
      return {
        ...baseFormData,
        airline: categoryData?.airline || '',
        departureAirport: categoryData?.departure_airport || '',
        arrivalAirport: categoryData?.arrival_airport || '',
        departureDate: categoryData?.departure_date || '',
        returnDate: categoryData?.return_date || '',
        nightsMedina: categoryData?.nights_medina || 0,
        nightsMecca: categoryData?.nights_mecca || 0,
        medinaHotelName: categoryData?.medina_hotel_name || '',
        medinaHotelDistance: categoryData?.medina_hotel_distance || '',
        meccaHotelName: categoryData?.mecca_hotel_name || '',
        meccaHotelDistance: categoryData?.mecca_hotel_distance || '',
        formulaType: categoryData?.formula_type || 'economique',
        checkedBagsCount: categoryData?.checked_bags_count || 0,
        checkedBagsWeight: categoryData?.checked_bags_weight || 20,
        carryOnBagsCount: categoryData?.carry_on_bags_count || 1,
        carryOnBagsWeight: categoryData?.carry_on_bags_weight || 10,
      };

    case 'vols':
      return {
        ...baseFormData,
        airline: categoryData?.airline || '',
        departureAirport: categoryData?.departure_airport || '',
        arrivalAirport: categoryData?.arrival_airport || '',
        departureDate: categoryData?.departure_date || '',
        returnDate: categoryData?.return_date || '',
        checkedBagsCount: categoryData?.checked_bags_count || 0,
        checkedBagsWeight: categoryData?.checked_bags_weight || 20,
        carryOnBagsCount: categoryData?.carry_on_bags_count || 1,
        carryOnBagsWeight: categoryData?.carry_on_bags_weight || 10,
        hasStopover: categoryData?.has_stopover || false,
        stopoverDetails: categoryData?.stopover_details || '',
      };

    case 'guides':
      return {
        ...baseFormData,
        gender: categoryData?.gender || 'male',
        city: categoryData?.city || '',
        yearsExperience: categoryData?.years_experience || 1,
        languages: categoryData?.languages || ['français'],
        offersOmraGuidance: categoryData?.offers_omra_guidance || false,
        offersVisits: categoryData?.offers_visits || false,
        offersCourses: categoryData?.offers_courses || false,
        offersWheelchairHelp: categoryData?.offers_wheelchair_help || false,
        offersOmraBadal: categoryData?.offers_omra_badal || false,
        offersOther: categoryData?.offers_other || false,
        otherServicesDescription: categoryData?.other_services_description || '',
      };

    case 'chauffeurs':
      return {
        ...baseFormData,
        gender: categoryData?.gender || 'male',
        city: categoryData?.city || '',
        vehicleSeats: categoryData?.vehicle_seats || 4,
        languages: categoryData?.languages || ['français'],
      };

      case 'babysitting':
        return {
          ...baseFormData,
          gender: categoryData?.gender || 'female',
          city: categoryData?.city || '',
          languages: categoryData?.languages || ['français'],
        };

    default:
      return baseFormData;
  }
};