import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
}

export const SEOHead = ({
  title,
  description,
  keywords = 'omra, hajj, pèlerinage, arabie saoudite, la mecque, médine, voyage religieux, islam',
  canonical,
  ogImage = 'https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png',
  ogType = 'website',
  structuredData
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Function to update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update or create link tags (remove duplicates first)
    const updateLinkTag = (rel: string, href: string) => {
      // Remove all existing tags with the same rel to avoid duplicates
      const existingLinks = document.querySelectorAll(`link[rel="${rel}"]`);
      existingLinks.forEach(link => link.remove());
      
      // Create new tag
      const link = document.createElement('link');
      link.setAttribute('rel', rel);
      link.setAttribute('href', href);
      document.head.appendChild(link);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Omra Bons Plans');
    updateMetaTag('robots', 'index, follow');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:site_name', 'Omra Bons Plans', true);

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    if (canonical) {
      updateLinkTag('canonical', canonical);
    }

    // Structured data
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, canonical, ogImage, ogType, structuredData]);

  return null;
};

// SEO configuration for each page
export const seoConfig = {
  home: {
    title: 'Annonces Hajj & Omra : logements, chauffeurs, guides...',
    description: 'Trouvez les meilleures offres pour votre Omra et Hajj. Comparez hébergements, vols, guides et services en Arabie Saoudite sur la 1ère plateforme dédiée.',
    keywords: 'omra pas cher, hajj, voyage omra, arabie saoudite, la mecque, médine, pèlerinage islam, hébergement omra, vol omra, guide omra',
    canonical: 'https://omrabonsplans.fr/',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Omra Bons Plans",
      "url": "https://omrabonsplans.fr",
      "description": "Plateforme de comparaison pour services Omra et Hajj en Arabie Saoudite",
      "sameAs": ["https://www.facebook.com/omrabonsplans", "https://www.instagram.com/omrabonsplans"],
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://omrabonsplans.fr/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  },
  about: {
    title: 'À Propos - Omra Bons Plans | Notre Mission & Équipe',
    description: 'Découvrez qui nous sommes : une équipe experte en pèlerinage qui facilite votre voyage religieux en Arabie Saoudite grâce à notre plateforme de confiance.',
    keywords: 'équipe omra bons plans, mission, expérience arabie saoudite, guide omra expert, confiance pèlerinage',
    canonical: 'https://omrabonsplans.fr/a-propos',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "À Propos - Omra Bons Plans",
      "description": "Notre équipe experte facilite l'organisation de votre pèlerinage en Arabie Saoudite"
    }
  },
  contact: {
    title: 'Contact - Omra Bons Plans | Nous Contacter pour votre Omra',
    description: 'Contactez notre équipe experte pour toute question sur votre Omra ou Hajj. Assistance personnalisée pour votre voyage religieux en Arabie Saoudite.',
    keywords: 'contact omra, aide pèlerinage, assistance voyage religieux, question omra hajj, support client',
    canonical: 'https://omrabonsplans.fr/contact',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact - Omra Bons Plans"
    }
  },
  blog: {
    title: 'Blog Omra & Hajj - Conseils et Guides Pèlerinage | Omra Bons Plans',
    description: 'Découvrez nos articles experts sur l\'Omra et le Hajj : conseils pratiques, guides spirituels, préparation voyage Arabie Saoudite. Tout pour réussir votre pèlerinage.',
    keywords: 'blog omra, conseils hajj, guide pèlerinage, préparation omra, spiritualité islam, voyage arabie saoudite',
    canonical: 'https://omrabonsplans.fr/blog',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Blog Omra Bons Plans",
      "description": "Articles et conseils pour votre pèlerinage en Arabie Saoudite"
    }
  },
  prayerTimes: {
    title: 'Heures de Prière - La Mecque & Médine | Omra Bons Plans',
    description: 'Consultez les horaires des 5 prières quotidiennes à La Mecque et Médine en temps réel. Outil essentiel pour votre séjour spiritual en Arabie Saoudite.',
    keywords: 'horaire prière mecque, heures prière médine, qibla, salat, horaires prières arabie saoudite',
    canonical: 'https://omrabonsplans.fr/horaires-prieres',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Heures de Prière - Omra Bons Plans",
      "description": "Horaires des prières pour La Mecque et Médine"
    }
  },
  islamicCalendar: {
    title: 'Calendrier Islamique Hijri 2026 | Omra Bons Plans',
    description: 'Consultez le calendrier islamique (Hijri) complet 2026 avec dates importantes. Planifiez votre Omra aux meilleures périodes spirituelles.',
    keywords: 'calendrier hijri, calendrier islamique 2026, dates importantes islam, calendrier hégirien, planning omra',
    canonical: 'https://omrabonsplans.fr/calendrier-islamique',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Calendrier Islamique - Omra Bons Plans",
      "description": "Calendrier Hijri avec dates importantes pour planifier votre pèlerinage"
    }
  },
  ramadanHajj: {
    title: 'Dates Ramadan & Hajj 2026-2028 | Calendrier Pèlerinage',
    description: 'Dates officielles du Ramadan et Hajj 2026, 2027, 2028. Planifiez votre pèlerinage en Arabie Saoudite avec notre calendrier détaillé des événements religieux.',
    keywords: 'dates ramadan 2026, dates hajj 2026, calendrier pèlerinage, planning ramadan hajj, dates religieuses islam',
    canonical: 'https://omrabonsplans.fr/dates-ramadan-hajj',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EventSeries",
      "name": "Calendrier Ramadan & Hajj 2026-2028",
      "description": "Dates officielles du Ramadan et Hajj pour planifier votre voyage religieux",
      "url": "https://omrabonsplans.fr/dates-ramadan-hajj",
      "image": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png",
      "startDate": "2026-02-18",
      "endDate": "2028-05-15",
      "eventStatus": "EventScheduled",
      "eventAttendanceMode": "MixedEventAttendanceMode",
      "location": {
        "@type": "VirtualLocation",
        "name": "Calendrier en ligne",
        "url": "https://omrabonsplans.fr/dates-ramadan-hajj"
      },
      "organizer": {
        "@type": "Organization",
        "name": "Omra Bons Plans",
        "url": "https://omrabonsplans.fr",
        "logo": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "availability": "InStock",
        "validFrom": "2026-01-01",
        "priceValidUntil": "2028-12-31",
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "FR",
          "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "FR"
          }
        }
      },
      "performer": {
        "@type": "Organization",
        "name": "Omra Bons Plans",
        "url": "https://omrabonsplans.fr"
      }
    }
  }
};

export default SEOHead;