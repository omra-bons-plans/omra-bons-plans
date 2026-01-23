// ⚡ PERFORMANCE: Extracted constants from ComparateurOmra.tsx to reduce main bundle parsing time

export const MONTHS = [
  'Ramadan', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
] as const;

export const FORMULA_TYPES = ['Essentiel', 'Confort'] as const;

export const CITIES = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 
  'Nantes', 'Strasbourg', 'Bordeaux', 'Lille'
] as const;

export const AGENCY_LOGOS: Record<string, string> = {
  'Medinvoyages': '/lovable-uploads/logomedinvoyages.webp',
  'Medin Voyages': '/lovable-uploads/logomedinvoyages.webp',
  'Almaqam': '/lovable-uploads/logoalmaqam.webp',
  'Al Maqam Voyages': '/lovable-uploads/logoalmaqam.webp',
  'Pelerinhajj': '/lovable-uploads/logopelerinhajj.webp',
  'Pelerin': '/lovable-uploads/logopelerinhajj.webp',
  'Hayat': '/lovable-uploads/logohayat.webp',
  'Al Hayat Voyages': '/lovable-uploads/logohayat.webp',
  'Omra Sounnah': '/lovable-uploads/logoomrasounnah.webp',
  'Omra Du Savoir': '/lovable-uploads/logoomrasounnah.webp',
  'Omra Pour Tous': '/lovable-uploads/logoomrapourtous.webp',
  'Omra Discount': '/lovable-uploads/logoomradiscount.webp',
  'Sabil': '/lovable-uploads/logosabile-new.webp',
  'Sabil Voyages': '/lovable-uploads/logosabile-new.webp',
  'Tawaf': '/lovable-uploads/logotawaf.webp',
  'TAWAF': '/lovable-uploads/logotawaf.webp',
  'Al Sirate Voyage': '/lovable-uploads/logoalsirate.webp',
  'Alsirate Voyage': '/lovable-uploads/logoalsirate.webp',
  'Gateway-travel': '/lovable-uploads/logogatewaytravel-new.webp',
  'Gateway travel': '/lovable-uploads/logogatewaytravel-new.webp',
  'Gatewaytravel': '/lovable-uploads/logogatewaytravel-new.webp',
  'Labbayk': '/lovable-uploads/logo-labayk-optimized.webp',
  'OMRA GATE': '/lovable-uploads/logoomragate-new.webp',
  'Omra Gate': '/lovable-uploads/logoomragate-new.webp',
  'OmraGate': '/lovable-uploads/logoomragate-new.webp',
  // Hajj agencies
  'Haramain Voyages': '/lovable-uploads/logoharamainvoyages-new.webp',
  'Haramain': '/lovable-uploads/logoharamainvoyages-new.webp',
  'MERIDIANIS': '/lovable-uploads/logomeridianis.webp',
  'Meridianis': '/lovable-uploads/logomeridianis.webp',
};

/**
 * Normalize text for comparison (remove accents, whitespace, lowercase)
 */
const normalizeText = (text: string): string => {
  return text?.trim().toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/\s+/g, '') || '';
};

/**
 * Get agency logo URL by name
 */
export const getAgencyLogo = (agencyName: string): string | null => {
  const normalizedName = normalizeText(agencyName);
  
  for (const [key, logo] of Object.entries(AGENCY_LOGOS)) {
    const normalizedKey = normalizeText(key);
    
    if (normalizedName.includes(normalizedKey) || normalizedKey.includes(normalizedName)) {
      return logo;
    }
  }
  return null;
};

/**
 * Extract star rating from hotel name string
 */
export const extractStarsFromHotel = (hotelName: string | null): number => {
  if (!hotelName) return 3;
  
  const starsMatch = hotelName.match(/(\d)\s*(?:étoiles?|\*)/i);
  if (starsMatch) {
    return parseInt(starsMatch[1]);
  }
  
  return 3;
};

/**
 * Remove star rating from hotel name for clean display
 */
export const cleanHotelName = (hotelName: string | null): string => {
  if (!hotelName) return '';
  return hotelName.replace(/\s*\(?\d\s*étoiles?\)?/gi, '').trim();
};
