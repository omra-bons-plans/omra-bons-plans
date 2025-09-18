/**
 * Utilitaires pour l'optimisation SEO automatique
 */

/**
 * Génère un titre SEO optimisé
 */
export const generateSEOTitle = (title: string, suffix = " | Omra Bons Plans"): string => {
  return title + suffix;
};

/**
 * Génère un slug URL-friendly à partir d'un titre
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    // Remplacer les caractères accentués
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remplacer les caractères spéciaux et espaces par des tirets
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    // Limiter la longueur
    .substring(0, 100)
    .replace(/-$/, '');
};

/**
 * Génère une URL canonique propre
 */
export const generateCleanCanonicalUrl = (category: string, slug: string): string => {
  return `https://omrabonsplans.fr/blog/${category}/${slug}`;
};

/**
 * Génère une URL canonique pour un article
 */
export const generateCanonicalUrl = (category: string, slug: string): string => {
  return `https://omrabonsplans.fr/blog/${category}/${slug}`;
};

/**
 * Génère une description meta à partir du contenu
 */
export const generateMetaDescription = (content: string, maxLength = 160): string => {
  // Nettoyer le markdown et HTML
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Supprimer les titres markdown
    .replace(/\*\*(.*?)\*\*/g, '$1') // Supprimer le bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Supprimer l'italic markdown
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Supprimer les liens markdown
    .replace(/<[^>]*>/g, '') // Supprimer les tags HTML
    .replace(/\n+/g, ' ') // Remplacer les sauts de ligne par des espaces
    .trim();

  // Tronquer à la longueur maximale
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Couper au dernier mot complet
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
};

/**
 * Génère des mots-clés SEO à partir du contenu
 */
export const extractKeywords = (title: string, content: string, maxKeywords = 10): string[] => {
  // Mots-clés de base liés au site
  const baseKeywords = ['omra', 'hajj', 'musulman', 'islam', 'voyage'];
  
  // Extraire les mots du titre
  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 5);

  // Combiner toutes les sources
  const allKeywords = [...baseKeywords, ...titleWords];
  
  // Supprimer les doublons et limiter au nombre max
  return [...new Set(allKeywords)].slice(0, maxKeywords);
};