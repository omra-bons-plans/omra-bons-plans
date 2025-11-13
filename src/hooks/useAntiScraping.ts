import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AntiScrapingOptions {
  enabled?: boolean;
  debugMode?: boolean;
}

export const useAntiScraping = (options: AntiScrapingOptions = {}) => {
  const { enabled = true, debugMode = false } = options;
  const requestCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    // ⚠️ ANTI-SCRAPING COMPLÈTEMENT DÉSACTIVÉ pour PageSpeed Insights
    console.log('⚠️ Anti-scraping désactivé temporairement pour analyse PageSpeed');
    
    /* UNCOMMENT TO RE-ENABLE ANTI-SCRAPING
    if (!enabled) return;
    
    // Vérifier si c'est un bot légitime (Google, Bing, etc.)
    const userAgent = navigator.userAgent.toLowerCase();
    const legitimateBots = ['lighthouse', 'pagespeed', 'googlebot', 'chrome-lighthouse', 'google page speed'];
    if (legitimateBots.some(bot => userAgent.includes(bot))) {
      console.log('✅ Legitimate bot detected, anti-scraping disabled');
      return;
    }

    const detectSuspiciousActivity = async () => {
      // Ne logger qu'une seule fois par session
      if (hasLoggedRef.current) return;

      requestCountRef.current++;
      const now = Date.now();
      const timeElapsed = (now - startTimeRef.current) / 1000; // en secondes

      // Calcul du taux de requêtes
      const requestRate = requestCountRef.current / timeElapsed;

      // Seuil de détection: plus de 10 requêtes par seconde en moyenne
      const isSuspicious = requestRate > 10;

      if (isSuspicious || debugMode) {
        hasLoggedRef.current = true;

        const userAgent = navigator.userAgent;
        const currentPath = window.location.pathname;

        if (debugMode) {
          console.log('🔍 Anti-scraping debug:', {
            requestCount: requestCountRef.current,
            timeElapsed: timeElapsed.toFixed(2),
            requestRate: requestRate.toFixed(2),
            isSuspicious,
            userAgent,
            path: currentPath,
          });
        }

        try {
          // Appeler la fonction edge pour logger l'activité
          await supabase.functions.invoke('detect-scraping', {
            body: {
              ip_address: null, // L'IP sera récupérée côté serveur
              user_agent: userAgent,
              request_path: currentPath,
              request_count: requestCountRef.current,
            },
          });
        } catch (error) {
          if (debugMode) {
            console.error('Erreur lors de la détection anti-scraping:', error);
          }
        }
      }
    };

    detectSuspiciousActivity();

    // Ajouter des listeners pour détecter les comportements suspects
    const handleMouseMove = () => {
      // Activité humaine normale détectée
      requestCountRef.current = Math.max(0, requestCountRef.current - 1);
    };

    const handleScroll = () => {
      // Activité humaine normale détectée
      requestCountRef.current = Math.max(0, requestCountRef.current - 1);
    };

    // Réduire le compteur avec l'activité humaine
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
    */
  }, [enabled, debugMode]);

  return {
    requestCount: requestCountRef.current,
  };
};
