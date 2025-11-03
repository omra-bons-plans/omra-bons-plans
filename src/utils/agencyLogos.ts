// Mapping des agences avec leurs logos
export const agencyLogos: Record<string, string> = {
  "Medin Voyages": "/lovable-uploads/logomedinvoyages.png",
  "Al Sirate Voyage": "/lovable-uploads/logoalsiratevoyage.png",
  "Omra Du Savoir": "/lovable-uploads/logoomrasounnah.png",
  "Omra Sounnah": "/lovable-uploads/logoomrasounnah-favicon.png",
  "Omra Pour Tous": "/lovable-uploads/logoomrapourtous.jpeg",
  "TAWAF": "/lovable-uploads/logotawaf.webp",
  "Sabil Voyages": "/lovable-uploads/logosabile-new.png",
  "Al Maqam Voyages": "/lovable-uploads/logoalmaqam.png",
  "Pèlerin Hajj": "/lovable-uploads/logopelrinhajj.webp",
  "Al Hayat Voyages": "/lovable-uploads/logohayat.png",
  "Al Bayt": "/lovable-uploads/logoalbayt.png",
  "Gateway-travel": "/lovable-uploads/logogatewaytravel.png",
};

export const getAgencyLogo = (agencyName: string): string | null => {
  return agencyLogos[agencyName] || null;
};

export const getAgencyNames = (): string[] => {
  return Object.keys(agencyLogos).sort();
};
