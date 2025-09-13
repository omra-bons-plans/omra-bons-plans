/**
 * Utilitaires SEO pour optimiser automatiquement le contenu
 */

/**
 * Génère des meta descriptions optimisées
 */
export const generateMetaDescription = (
  content: string, 
  keywords: string[] = [], 
  maxLength: number = 160
): string => {
  const keywordText = keywords.length > 0 ? ` ${keywords.join(', ')}` : '';
  const description = `${content}${keywordText}`;
  
  if (description.length <= maxLength) {
    return description;
  }
  
  return description.substring(0, maxLength - 3) + '...';
};

/**
 * Génère des titres SEO optimisés
 */
export const generateSEOTitle = (
  title: string, 
  suffix: string = 'Omra Bons Plans', 
  maxLength: number = 60
): string => {
  const fullTitle = `${title} - ${suffix}`;
  
  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }
  
  // Raccourcir le titre principal si nécessaire
  const availableLength = maxLength - suffix.length - 3; // 3 pour " - "
  const shortTitle = title.substring(0, availableLength);
  return `${shortTitle} - ${suffix}`;
};

/**
 * Génère du structured data pour les annonces
 */
export const generateAdStructuredData = (ad: any) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": ad.title,
    "description": ad.subtitle || ad.description,
    "provider": {
      "@type": "Organization",
      "name": "Omra Bons Plans"
    },
    "areaServed": ad.location,
    "url": `https://omrabonsplans.fr/ad/${ad.id}`
  };

  // Ajouter le prix si disponible
  if (ad.price && ['sejours', 'vols', 'hebergement'].includes(ad.type)) {
    return {
      ...baseData,
      "@type": "Product",
      "offers": {
        "@type": "Offer",
        "price": ad.price.toString().replace(/[€\s]/g, ''),
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      }
    };
  }

  return baseData;
};

/**
 * Optimise les images pour le SEO
 */
export const generateImageAlt = (
  context: string, 
  title: string, 
  index?: number
): string => {
  const baseAlt = `${title} - ${context}`;
  return index !== undefined ? `${baseAlt} ${index + 1}` : baseAlt;
};

/**
 * Génère des URLs canoniques
 */
export const generateCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://omrabonsplans.fr';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

/**
 * Valide et optimise les mots-clés
 */
export const optimizeKeywords = (keywords: string[]): string[] => {
  return keywords
    .map(keyword => keyword.toLowerCase().trim())
    .filter((keyword, index, array) => array.indexOf(keyword) === index) // Supprimer les doublons
    .slice(0, 10); // Limiter à 10 mots-clés max
};