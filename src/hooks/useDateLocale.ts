import { useState, useEffect } from 'react';
import type { Locale } from 'date-fns';

/**
 * Hook pour charger le locale date-fns de manière asynchrone
 * Évite de bloquer le bundle initial avec le locale (~50KB)
 */
export const useDateLocale = () => {
  const [locale, setLocale] = useState<Locale | undefined>(undefined);

  useEffect(() => {
    // Charger le locale de manière asynchrone après le rendu initial
    import('date-fns/locale/fr').then((module) => {
      setLocale(module.fr);
    });
  }, []);

  return locale;
};

export default useDateLocale;
