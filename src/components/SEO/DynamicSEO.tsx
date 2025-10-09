import React from 'react';
import { SEOHead } from './SEOHead';
import { generateMetaDescription, generateSEOTitle, generateCleanCanonicalUrl } from '@/utils/seoHelpers';

interface DynamicSEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  type?: 'page' | 'article' | 'product' | 'service';
  image?: string;
  path: string;
  structuredData?: any;
  customMeta?: Array<{ name: string; content: string }>;
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
  structuredData,
  customMeta
}) => {
  const optimizedTitle = generateSEOTitle(title);
  const optimizedDescription = generateMetaDescription(description);
  const canonicalUrl = path.includes('/blog/') 
    ? generateCleanCanonicalUrl('general', path.split('/').pop() || 'default')
    : `https://omrabonsplans.fr${path}`;
  
  const defaultImage = image || 'https://omrabonsplans.fr/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png';
  
  const defaultStructuredData = structuredData || {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : 'WebPage',
    "headline": title,
    "description": optimizedDescription,
    "url": canonicalUrl,
    "image": defaultImage,
    "publisher": {
      "@type": "Organization",
      "name": "Omra Bons Plans",
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
      customMeta={customMeta}
    />
  );
};

export default DynamicSEO;