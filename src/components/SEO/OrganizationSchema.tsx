import { useEffect } from 'react';

/**
 * Composant pour injecter les données structurées Organization
 * À utiliser sur la page d'accueil, contact et à propos
 */
export const OrganizationSchema = () => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Omra Bons Plans",
      "description": "Première plateforme dédiée aux services Omra et Hajj : séjours, vols, hébergements, guides et plus encore",
      "url": "https://omrabonsplans.fr",
      "logo": "https://omrabonsplans.fr/logo.svg",
      "foundingDate": "2024",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "contact@omrabonsplans.fr",
        "availableLanguage": ["French", "Arabic"]
      },
      "areaServed": {
        "@type": "Place",
        "name": "France"
      },
      "sameAs": [
        "https://www.facebook.com/omrabonsplans",
        "https://www.instagram.com/omrabonsplans"
      ]
    };

    let scriptTag = document.querySelector('script[data-organization-ld]') as HTMLScriptElement;
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-organization-ld', 'true');
      document.head.appendChild(scriptTag);
    }
    
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      const existingScript = document.querySelector('script[data-organization-ld]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};
