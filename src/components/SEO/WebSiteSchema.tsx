import { useEffect } from 'react';

/**
 * Composant pour injecter les données structurées WebSite
 * Permet d'afficher la barre de recherche Sitelinks dans Google
 */
export const WebSiteSchema = () => {
  useEffect(() => {
    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Omra Bons Plans",
      "alternateName": ["Comparateur Omra", "Omra Bons Plans France"],
      "url": "https://omrabonsplans.fr",
      "description": "Premier comparateur d'agences Omra et Hajj agréées en France. Comparez les prix, les avis et réservez votre pèlerinage.",
      "inLanguage": "fr-FR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://omrabonsplans.fr/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Omra Bons Plans",
        "url": "https://omrabonsplans.fr",
        "logo": {
          "@type": "ImageObject",
          "url": "https://omrabonsplans.fr/logo.svg",
          "width": 200,
          "height": 60
        }
      }
    };

    let scriptTag = document.querySelector('script[data-website-ld]') as HTMLScriptElement;
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-website-ld', 'true');
      document.head.appendChild(scriptTag);
    }
    
    scriptTag.textContent = JSON.stringify(websiteData);

    return () => {
      const existingScript = document.querySelector('script[data-website-ld]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};
