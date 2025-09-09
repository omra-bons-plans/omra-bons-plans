/**
 * Utilities for SEO optimization
 */

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

/**
 * Update page SEO metadata dynamically
 */
export const updatePageSEO = (data: SEOData) => {
  // Update title
  document.title = data.title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', data.description);
  } else {
    const newMeta = document.createElement('meta');
    newMeta.name = 'description';
    newMeta.content = data.description;
    document.head.appendChild(newMeta);
  }
  
  // Update keywords if provided
  if (data.keywords) {
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', data.keywords);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'keywords';
      newMeta.content = data.keywords;
      document.head.appendChild(newMeta);
    }
  }
  
  // Update Open Graph title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', data.title);
  }
  
  // Update Open Graph description
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', data.description);
  }
  
  // Update Twitter title
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', data.title);
  }
  
  // Update Twitter description
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute('content', data.description);
  }
  
  // Update canonical URL if provided
  if (data.canonical) {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', data.canonical);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', data.canonical);
      document.head.appendChild(canonicalLink);
    }
  }
};

/**
 * SEO data for different pages
 */
export const SEO_DATA = {
  home: {
    title: "Omra Pas Chère 2025 | Hajj Pèlerinage La Mecque - Omra Bons Plans",
    description: "✅ Trouvez votre Omra pas chère 2025 ! Comparateur N°1 pour omra ramadan, hajj, hébergement Mecque-Médine. Séjours dès 899€. Devis gratuit !",
    keywords: "omra pas chère, hajj 2025, pèlerinage mecque, omra ramadan, séjour mecque médine, hajj pas cher, omra janvier, omra en famille",
    canonical: "https://www.omrabonsplans.fr/"
  },
  
  blog: {
    title: "Blog Omra & Hajj 2025 | Guides Pèlerinage Mecque Médine",
    description: "📖 Guides complets Omra & Hajj 2025 : conseils pratiques, préparation pèlerinage, rituels Mecque Médine. Expertise 28 ans !",
    keywords: "guide omra, conseil hajj, préparation pèlerinage, rituel mecque, blog omra, guide spirituel",
    canonical: "https://www.omrabonsplans.fr/blog"
  },
  
  about: {
    title: "À Propos | Omra Bons Plans - Spécialiste Pèlerinage Depuis 28 ans",
    description: "🕋 Découvrez Omra Bons Plans : 28 ans d'expertise pèlerinage, +46K pèlerins satisfaits. Plateforme de confiance pour votre Omra & Hajj 2025.",
    keywords: "omra bons plans, agence omra, spécialiste hajj, pèlerinage mecque, about omra",
    canonical: "https://www.omrabonsplans.fr/about"
  },
  
  contact: {
    title: "Contact Omra Bons Plans | Devis Gratuit Omra Hajj 2025",
    description: "📞 Contactez nos experts Omra & Hajj ! Devis gratuit, conseil personnalisé, assistance 7j/7. +28 ans d'expérience pèlerinage.",
    keywords: "contact omra, devis hajj gratuit, conseil pèlerinage, assistance omra, contact mecque",
    canonical: "https://www.omrabonsplans.fr/contact"
  }
};