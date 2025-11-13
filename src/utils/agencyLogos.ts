// Mapping des agences avec leurs logos
export const agencyLogos: Record<string, string> = {
  "Medin Voyages": "/lovable-uploads/logomedinvoyages.webp",
  "Al Sirate Voyage": "/lovable-uploads/logoalsiratevoyage.png",
  "Omra Du Savoir": "/lovable-uploads/logoomrasounnah.webp",
  "Omra Sounnah": "/lovable-uploads/logoomrasounnah-favicon.png",
  "Omra Pour Tous": "/lovable-uploads/logoomrapourtous.webp",
  "TAWAF": "/lovable-uploads/logotawaf.webp",
  "Sabil Voyages": "/lovable-uploads/logosabile-new.png",
  "Al Maqam Voyages": "/lovable-uploads/logoalmaqam.webp",
  "Pèlerin Hajj": "/lovable-uploads/logopelrinhajj.webp",
  "Al Hayat Voyages": "/lovable-uploads/logohayat.png",
  "Al Bayt": "/lovable-uploads/logoalbayt.png",
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
