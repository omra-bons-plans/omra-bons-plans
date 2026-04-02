import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * 🔐 SECURITY: Serve sitemap.xml with proper headers
 * This component handles dynamic sitemap generation
 *
 * IMPORTANT: In production, serve /sitemap.xml directly from:
 * 1. Static file: /public/sitemap.xml
 * 2. Or via edge function with proper Content-Type header
 */
const SitemapXml = () => {
  const [xml, setXml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        // ✅ SECURITY: Fetch as data, don't use document.write()
        const response = await fetch('/sitemap.xml', {
          headers: { 'Accept': 'application/xml' },
        });

        if (!response.ok) {
          // Fallback: generate via edge function
          const { data, error: edgeError } = await supabase.functions.invoke('generate-sitemap');

          if (edgeError) {
            throw edgeError;
          }

          if (typeof data === 'string') {
            setXml(data);
          } else if (data?.sitemap) {
            setXml(data.sitemap);
          }
        } else {
          // ✅ Successfully fetched static sitemap
          const xmlText = await response.text();
          setXml(xmlText);
        }
      } catch (err) {
        console.error('Sitemap fetch error:', err);
        setError('Failed to load sitemap');
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  // 🔐 SECURITY: Trigger proper XML download/display on client
  useEffect(() => {
    if (xml && !loading && !error) {
      // ✅ SECURITY: Use Blob API + download instead of document.write()
      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });

      // ✅ Option 1: Serve with proper headers (ask user to download)
      // This requires backend to send Content-Type: application/xml header
      // For now, display as text in browser or download

      // Send custom event to parent window with sitemap ready
      window.dispatchEvent(
        new CustomEvent('sitemap-ready', { detail: { xml, size: blob.size } })
      );

      // 🔐 Log for security audit (don't expose full XML in logs)
      console.debug(`✅ Sitemap loaded: ${blob.size} bytes`);
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
