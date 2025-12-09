import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

interface CanonicalRedirectProps {
  children: React.ReactNode;
}

/**
 * Composant pour rediriger automatiquement vers l'URL canonique
 * Gère les trailing slashes et les URLs dupliquées
 */
export const CanonicalRedirect: React.FC<CanonicalRedirectProps> = ({ children }) => {
  const location = useLocation();
  
  // Retirer les trailing slashes sauf pour la page d'accueil
  const hasTrailingSlash = location.pathname.endsWith('/') && location.pathname !== '/';
  
  // Nettoyer l'URL des slashes multiples (sans changer la casse)
  const cleanPath = location.pathname.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  
  // Si l'URL a besoin d'être nettoyée, rediriger
  if (hasTrailingSlash || location.pathname !== cleanPath) {
    const newPath = cleanPath === '' ? '/' : cleanPath;
    return <Navigate to={`${newPath}${location.search}${location.hash}`} replace />;
  }
  
  return <>{children}</>;
};

export default CanonicalRedirect;