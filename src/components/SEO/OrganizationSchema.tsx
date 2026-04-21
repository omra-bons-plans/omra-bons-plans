import { useEffect } from 'react';

/**
 * Composant pour injecter les données structurées Organization
 * Enrichi avec Google Reviews, profils sociaux et TravelAgency
 */
export const OrganizationSchema = () => {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": ["Organization", "TravelAgency"],
      "@id": "https://omrabonsplans.fr/#organization",
      "name": "Omra Bons Plans",
      "alternateName": "Comparateur Omra France",
      "description": "Premier comparateur d'agences Omra et Hajj agréées en France. Comparez les prix, les services et les avis de dizaines d'agences spécialisées dans les pèlerinages vers La Mecque et Médine.",
      "url": "https://omrabonsplans.fr",
      "logo": {
        "@type": "ImageObject",
        "url": "https://omrabonsplans.fr/logo.svg",
        "width": 200,
        "height": 60
      },
      "image": "https://omrabonsplans.fr/logo-og.png",
      "foundingDate": "2024",
      "founder": {
        "@type": "Person",
        "@id": "https://omrabonsplans.fr/about#farid",
        "name": "Farid d'Arabie",
        "jobTitle": "Expert en pèlerinage islamique & Guide spirituel",
        "description": "Plus de 10 ans de résidence à La Mecque. A accompagné plus de 5 000 pèlerins lors du Hajj et de l'Omra.",
        "knowsAbout": ["Omra", "Hajj", "Pèlerinage islamique", "La Mecque", "Médine"]
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "contact@omrabonsplans.fr",
          "availableLanguage": ["French", "Arabic", "English"],
          "areaServed": "FR"
        }
      ],
      "areaServed": {
        "@type": "Country",
        "name": "France",
        "sameAs": "https://en.wikipedia.org/wiki/France"
      },
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 46.603354,
          "longitude": 1.888334
        },
        "geoRadius": "1000 km"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "156",
        "bestRating": "5",
        "worstRating": "1"
      },
      "sameAs": [
        "https://www.instagram.com/omrabonsplans",
        "https://www.facebook.com/omrabonsplans",
        "https://www.tiktok.com/@omrabonsplans",
        "https://g.page/r/CQzTthDA4fm6EBM"
      ],
      "knowsAbout": [
        "Omra",
        "Hajj",
        "Pèlerinage musulman",
        "Voyage La Mecque",
        "Voyage Médine",
        "Agences de voyage Omra",
        "Comparateur voyages religieux"
      ],
      "slogan": "Comparez, choisissez, partez en toute sérénité",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Offres Omra et Hajj",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "Séjours Omra",
            "description": "Packages complets pour la Omra incluant vols, hôtels et accompagnement"
          },
          {
            "@type": "OfferCatalog", 
            "name": "Séjours Hajj",
            "description": "Forfaits Hajj avec agences agréées par le Ministère saoudien"
          }
        ]
      }
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
