import React from 'react';
import { SEOHead } from './SEOHead';
import { generateMetaDescription, generateCleanCanonicalUrl } from '@/utils/seoHelpers';

interface DynamicSEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  type?: 'page' | 'article' | 'product' | 'service';
  image?: string;
  path: string;
  structuredData?: object;
}

/**
 * Composant SEO dynamique — utilise react-helmet-async via SEOHead
 */
export const DynamicSEO: React.FC<DynamicSEOProps> = ({
  title,
  description = '',
  keywords = [],
  type = 'page',
  image,
  path,
  structuredData
}) => {
  // Ne pas ajouter de préfixe — le titre passé est déjà complet et optimisé
  const optimizedDescription = generateMetaDescription(description);

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `https://omrabonsplans.fr${normalizedPath}`;

  const defaultImage = image || 'https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png';

  const defaultStructuredData = structuredData || {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : 'WebPage',
    "headline": title,
    "description": optimizedDescription,
    "url": canonicalUrl,
    "image": {
      "@type": "ImageObject",
      "url": defaultImage
    },
    "dateModified": new Date().toISOString(),
    "inLanguage": "fr-FR",
    "author": {
      "@type": "Organization",
      "name": "Omra Bons Plans",
      "url": "https://omrabonsplans.fr"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Omra Bons Plans",
      "url": "https://omrabonsplans.fr",
      "logo": {
        "@type": "ImageObject",
        "url": "https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png"
      }
    }
  };

  return (
    <SEOHead
      title={title}
      description={optimizedDescription}
      keywords={keywords.join(', ')}
      canonical={canonicalUrl}
      ogImage={defaultImage}
      ogType={type === 'article' ? 'article' : 'website'}
      structuredData={defaultStructuredData}
    />
  );
};

export default DynamicSEO;
