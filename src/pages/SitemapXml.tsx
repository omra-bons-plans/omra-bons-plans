import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Page dynamique qui génère le sitemap XML en temps réel
 * Appelle la edge function generate-sitemap et affiche le XML brut
 */
const SitemapXml = () => {
  const [xml, setXml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-sitemap');
        
        if (error) {
          console.error('Error fetching sitemap:', error);
          setError('Erreur lors de la génération du sitemap');
          return;
        }

        // La edge function retourne du XML directement
        if (typeof data === 'string') {
          setXml(data);
        } else if (data) {
          // Si c'est un objet, on le stringify
          setXml(JSON.stringify(data));
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  // Afficher le XML brut avec le bon content-type
  useEffect(() => {
    if (xml && !loading && !error) {
      // Créer un nouveau document avec le contenu XML
      document.open('text/xml');
      document.write(xml);
      document.close();
    }
  }, [xml, loading, error]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  // Le contenu XML sera affiché par le useEffect ci-dessus
  return null;
};

export default SitemapXml;
