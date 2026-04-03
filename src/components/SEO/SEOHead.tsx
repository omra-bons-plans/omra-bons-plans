import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  noindex?: boolean;
}

export const SEOHead = ({
  title,
  description,
  keywords = 'omra 2026, hajj 2026, omra ramadan, 10 derniers jours ramadan, pèlerinage, arabie saoudite, la mecque, médine, omra pas chère',
  canonical,
  ogImage = 'https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp',
  ogType = 'website',
  structuredData,
  noindex = false
}: SEOHeadProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="Omra Bons Plans" />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Omra Bons Plans" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@omrabonsplans" />

      {/* Structured Data */}
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
    title: 'Comparateur Omra 2026 & Hajj 2026 | Omra Ramadan, 10 Derniers Jours - Omra Bons Plans',
    description: 'Comparez les meilleures offres Omra 2026 et Hajj 2026. Trouvez votre Omra Ramadan, 10 derniers jours du Ramadan, séjours pas chers depuis la France.',
    keywords: 'omra 2026, omra2026, hajj 2026, omra ramadan, 10 derniers jours ramadan, omra pas chère, séjour omra tout compris, agence omra France',
    canonical: 'https://omrabonsplans.fr/omra',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Omra Bons Plans",
      "url": "https://omrabonsplans.fr",
      "description": "Comparateur Omra 2026 & Hajj 2026 - Omra Ramadan et 10 derniers jours du Ramadan",
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
    canonical: 'https://omrabonsplans.fr/about'
  },
  contact: {
    title: 'Contact - Omra Bons Plans | Nous Contacter pour votre Omra',
    description: 'Contactez notre équipe experte pour toute question sur votre Omra ou Hajj. Assistance personnalisée pour votre voyage religieux en Arabie Saoudite.',
    keywords: 'contact omra, aide pèlerinage, assistance voyage religieux, question omra hajj, support client',
    canonical: 'https://omrabonsplans.fr/contact'
  },
  blog: {
    title: 'Blog Omra & Hajj 2026 | Guides, Conseils et Actualités Pèlerinage',
    description: 'Guides complets sur l\'Omra et le Hajj : rites, préparation, visa, bagages, prix. Conseils d\'experts pour réussir votre pèlerinage en Arabie Saoudite.',
    keywords: 'blog omra, conseils hajj, guide pèlerinage, préparation omra, spiritualité islam, voyage arabie saoudite',
    canonical: 'https://omrabonsplans.fr/blog'
  },
  prayerTimes: {
    title: 'Heures de Prière - La Mecque & Médine | Omra Bons Plans',
    description: 'Trouvez les horaires de prière musulmane précis pour votre ville. Fajr, Dhuhr, Asr, Maghrib, Isha. Calendrier islamique et direction de la Qibla.',
    keywords: 'horaire prière mecque, heures prière médine, qibla, salat, horaires prières arabie saoudite',
    canonical: 'https://omrabonsplans.fr/prayer-times'
  },
  islamicCalendar: {
    title: 'Calendrier Islamique Hijri 2026 | Omra Bons Plans',
    description: 'Consultez le calendrier islamique (Hijri) complet 2026 avec dates importantes. Planifiez votre Omra aux meilleures périodes spirituelles.',
    keywords: 'calendrier hijri, calendrier islamique 2026, dates importantes islam, calendrier hégirien, planning omra',
    canonical: 'https://omrabonsplans.fr/islamic-calendar'
  },
  ramadanHajj: {
    title: 'Dates Ramadan & Hajj 2026-2028 | Calendrier Pèlerinage',
    description: 'Dates officielles du Ramadan et Hajj 2026, 2027, 2028. Planifiez votre pèlerinage en Arabie Saoudite avec notre calendrier détaillé.',
    keywords: 'dates ramadan 2026, dates hajj 2026, calendrier pèlerinage, planning ramadan hajj, dates religieuses islam',
    canonical: 'https://omrabonsplans.fr/ramadan-hajj-dates',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EventSeries",
      "name": "Calendrier Ramadan & Hajj 2026-2028",
      "description": "Dates officielles du Ramadan et Hajj pour planifier votre voyage religieux",
      "url": "https://omrabonsplans.fr/dates-ramadan-hajj",
      "image": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp",
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
        "logo": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.webp"
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
