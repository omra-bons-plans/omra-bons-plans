import React from 'react';
import { SEOHead } from './SEOHead';
import { generateMetaDescription, generateSEOTitle } from '@/utils/seoHelpers';

interface DynamicSEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  type?: 'page' | 'article' | 'product' | 'service';
  image?: string;
  path: string;
  structuredData?: any;
}

/**
 * Composant SEO dynamique qui optimise automatiquement les meta tags
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
  const optimizedTitle = generateSEOTitle(title);
  const optimizedDescription = generateMetaDescription(description);
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Generate canonical URL directly from the normalized path
  const canonicalUrl = `https://omrabonsplans.fr${normalizedPath}`;
  
  const defaultImage = image || 'https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png';
  
  const defaultStructuredData = structuredData || {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : 'WebPage',
    "headline": title,
    "description": optimizedDescription,
    "url": canonicalUrl,
    "image": defaultImage,
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "inLanguage": "fr-FR",
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
      title={optimizedTitle}
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