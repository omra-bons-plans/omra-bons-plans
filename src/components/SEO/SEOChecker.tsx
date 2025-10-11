import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant pour vérifier et signaler les problèmes SEO en développement
 * Aide à identifier les pages sans H1, H2, canonical, etc.
 */
export const SEOChecker = () => {
  const location = useLocation();

  useEffect(() => {
    // Only run in development
    if (import.meta.env.PROD) return;

    const checkSEO = () => {
      const issues: string[] = [];

      // Check for H1
      const h1Elements = document.querySelectorAll('h1');
      if (h1Elements.length === 0) {
        issues.push('❌ Aucun H1 trouvé sur cette page');
      } else if (h1Elements.length > 1) {
        issues.push(`⚠️ Multiple H1 trouvés (${h1Elements.length}) - il ne devrait y en avoir qu'un seul`);
      }

      // Check for H2
      const h2Elements = document.querySelectorAll('h2');
      if (h2Elements.length === 0) {
        issues.push('⚠️ Aucun H2 trouvé - la structure des titres est importante pour le SEO');
      }

      // Check for canonical
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        issues.push('❌ URL canonique manquante');
      }

      // Check for meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        issues.push('❌ Meta description manquante');
      } else {
        const content = metaDescription.getAttribute('content');
        if (!content || content.length < 120) {
          issues.push('⚠️ Meta description trop courte (minimum 120 caractères recommandé)');
        } else if (content.length > 160) {
          issues.push('⚠️ Meta description trop longue (maximum 160 caractères recommandé)');
        }
      }

      // Check for Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');

      if (!ogTitle) issues.push('❌ og:title manquant');
      if (!ogDescription) issues.push('❌ og:description manquant');
      if (!ogImage) issues.push('❌ og:image manquant');
      if (!ogUrl) issues.push('❌ og:url manquant');

      // Check for title
      if (!document.title || document.title === 'Vite App') {
        issues.push('❌ Title de page invalide ou manquant');
      } else if (document.title.length > 60) {
        issues.push('⚠️ Title trop long (maximum 60 caractères recommandé)');
      }

      // Check content length
      const mainContent = document.querySelector('main') || document.body;
      const textContent = mainContent.textContent || '';
      const wordCount = textContent.trim().split(/\s+/).length;
      
      if (wordCount < 300) {
        issues.push(`⚠️ Contenu textuel insuffisant (${wordCount} mots - minimum 300 recommandé)`);
      }

      // Log results
      if (issues.length > 0) {
        console.group(`🔍 Vérification SEO - ${location.pathname}`);
        issues.forEach(issue => console.warn(issue));
        console.groupEnd();
      } else {
        console.log(`✅ SEO OK pour ${location.pathname}`);
      }
    };

    // Wait for DOM to be fully loaded
    const timer = setTimeout(checkSEO, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

export default SEOChecker;
