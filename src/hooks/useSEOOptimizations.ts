import { useEffect } from 'react';
import { initializeSitemap, addUrlToSitemap } from '@/utils/sitemapGenerator';
import { convertToWebP } from '@/utils/imageCompression';

/**
 * Hook pour initialiser et maintenir les optimisations SEO automatiquement
 */
export const useSEOOptimizations = () => {
  useEffect(() => {
    // Initialiser le sitemap dynamique au chargement de l'application
    initializeSitemap().catch(console.error);
  }, []);

  /**
   * Ajoute automatiquement une nouvelle page au sitemap
   */
  const addPageToSitemap = (url: string, changefreq: 'daily' | 'weekly' | 'monthly' = 'weekly', priority = 0.7) => {
    addUrlToSitemap({
      loc: `https://omrabonsplans.fr${url}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq,
      priority
    });
  };

  /**
   * Optimise automatiquement les images uploadées
   */
  const optimizeImage = async (file: File, options?: { quality?: number }) => {
    try {
      // Convertir en WebP si possible pour une meilleure compression
      return await convertToWebP(file, options?.quality || 0.8);
    } catch (error) {
      console.error('Erreur lors de l\'optimisation de l\'image:', error);
      return file;
    }
  };

  return {
    addPageToSitemap,
    optimizeImage
  };
};