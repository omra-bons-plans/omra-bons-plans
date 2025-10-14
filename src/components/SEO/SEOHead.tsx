import { Helmet } from 'react-helmet-async';

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
  return (
    <Helmet>
      {/* Title */}
      <title>{title}</title>
      
      {/* Basic meta tags */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Omra Bons Plans" />
      <meta name="robots" content="index, follow" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Omra Bons Plans" />
      <meta property="og:locale" content="fr_FR" />
      {canonical && <meta property="og:url" content={canonical} />}
      
      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@omrabonsplans" />
      
      {/* Structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
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
    canonical: 'https://omrabonsplans.fr/about',
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
    canonical: 'https://omrabonsplans.fr/prayer-times',
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
    canonical: 'https://omrabonsplans.fr/islamic-calendar',
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
    canonical: 'https://omrabonsplans.fr/ramadan-hajj-dates',
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