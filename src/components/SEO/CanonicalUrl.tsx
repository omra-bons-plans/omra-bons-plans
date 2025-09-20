import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useCanonicalUrl } from '@/hooks/useCanonicalUrl';

interface CanonicalUrlProps {
  /** URL canonique personnalisée (optionnel, sinon utilise l'URL courante) */
  customUrl?: string;
}

/**
 * Composant pour gérer l'URL canonique de manière dynamique
 */
export const CanonicalUrl: React.FC<CanonicalUrlProps> = ({ customUrl }) => {
  const { canonicalUrl } = useCanonicalUrl();
  
  const finalCanonicalUrl = customUrl || canonicalUrl;
  
  return (
    <Helmet>
      <link rel="canonical" href={finalCanonicalUrl} />
    </Helmet>
  );
};

export default CanonicalUrl;