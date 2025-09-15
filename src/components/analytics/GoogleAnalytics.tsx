import React from 'react';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';

interface GoogleAnalyticsProps {
  measurementId: string;
}

/**
 * Composant Google Analytics pour le tracking des pages et événements
 */
export const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ measurementId }) => {
  useGoogleAnalytics(measurementId);
  return null;
};

export default GoogleAnalytics;