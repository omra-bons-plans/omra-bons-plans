import { useLocation } from 'react-router-dom';

/**
 * Hook pour générer automatiquement l'URL canonique basée sur la route actuelle
 */
export const useCanonicalUrl = () => {
  const location = useLocation();
  
  // Nettoyer l'URL : enlever les paramètres de query et hash
  const cleanPath = location.pathname.replace(/\/$/, '') || '';
  
  // Générer l'URL canonique complète
  const canonicalUrl = `https://omrabonsplans.fr${cleanPath}`;
  
  return {
    canonicalUrl,
    currentPath: location.pathname,
    currentSearch: location.search,
    currentHash: location.hash
  };
};

/**
 * Fonction utilitaire pour générer l'URL canonique d'une page spécifique
 */
export const generateCanonicalUrl = (path: string): string => {
  // Nettoyer le path
  const cleanPath = path.replace(/\/$/, '') || '';
  return `https://omrabonsplans.fr${cleanPath}`;
};