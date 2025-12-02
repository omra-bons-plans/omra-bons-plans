// Mapping des agences avec leurs logos
export const agencyLogos: Record<string, string> = {
  "Medin Voyages": "/lovable-uploads/logomedinvoyages.png",
  "Al Sirate Voyage": "/lovable-uploads/logoalsirate.webp",
  "Omra Du Savoir": "/lovable-uploads/logoomrasounnah.png",
  "Omra Sounnah": "/lovable-uploads/logoomrasounnah-favicon.png",
  "Omra Pour Tous": "/lovable-uploads/logoomrapourtous.jpeg",
  "TAWAF": "/lovable-uploads/logotawaf.webp",
  "Sabil Voyages": "/lovable-uploads/logosabile.webp",
  "Al Maqam Voyages": "/lovable-uploads/logoalmaqam.png",
  "Pelerinhajj": "/lovable-uploads/logopelerinhajj.webp",
  "Al Hayat Voyages": "/lovable-uploads/logohayat.webp",
  "Al Bayt": "/lovable-uploads/logoalbayt.webp",
  "Gateway-travel": "/lovable-uploads/logogatewaytravel.png",
  "Omra Discount": "/lovable-uploads/logoomradiscount.png",
  "Labbayk": "/lovable-uploads/logolabbayk.png",
  "OMRA GATE": "/lovable-uploads/logoomragate.webp",
};

export const getAgencyLogo = (agencyName: string): string | null => {
  return agencyLogos[agencyName] || null;
};

export const getAgencyNames = (): string[] => {
  return Object.keys(agencyLogos).sort();
};
