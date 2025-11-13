// Mapping des agences avec leurs logos
export const agencyLogos: Record<string, string> = {
  "Medin Voyages": "/lovable-uploads/logomedinvoyages.webp",
  "Al Sirate Voyage": "/lovable-uploads/logoalsiratevoyage.webp",
  "Omra Du Savoir": "/lovable-uploads/logoomrasounnah.webp",
  "Omra Sounnah": "/lovable-uploads/logoomrasounnah-favicon.webp",
  "Omra Pour Tous": "/lovable-uploads/logoomrapourtous.webp",
  "TAWAF": "/lovable-uploads/logotawaf.webp",
  "Sabil Voyages": "/lovable-uploads/logosabile-new.webp",
  "Al Maqam Voyages": "/lovable-uploads/logoalmaqam.webp",
  "Pèlerin Hajj": "/lovable-uploads/logopelrinhajj.webp",
  "Al Hayat Voyages": "/lovable-uploads/logohayat.webp",
  "Al Bayt": "/lovable-uploads/logoalbayt.webp",
  "Gateway-travel": "/lovable-uploads/logogatewaytravel.webp",
  "Omra Discount": "/lovable-uploads/logoomradiscount.webp",
  "Labbayk": "/lovable-uploads/logolabbayk.webp",
  "OMRA GATE": "/lovable-uploads/logoomragate.webp",
};

export const getAgencyLogo = (agencyName: string): string | null => {
  return agencyLogos[agencyName] || null;
};

export const getAgencyNames = (): string[] => {
  return Object.keys(agencyLogos).sort();
};
