/**
 * Générateur de sitemap dynamique pour SEO
 */

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Routes statiques du site avec URLs canoniques uniquement
const staticRoutes: SitemapUrl[] = [
  {
    loc: 'https://omrabonsplans.fr/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 1.0
  },
  {
    loc: 'https://omrabonsplans.fr/about',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: 'https://omrabonsplans.fr/contact',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://omrabonsplans.fr/blog',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9
  },
  // Catégories principales avec URLs canoniques
  {
    loc: 'https://omrabonsplans.fr/category/sejours',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9
  },
  {
    loc: 'https://omrabonsplans.fr/category/vols',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.9
  },
  {
    loc: 'https://omrabonsplans.fr/category/guides',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: 'https://omrabonsplans.fr/category/chauffeurs',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: 'https://omrabonsplans.fr/category/hebergements',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: 'https://omrabonsplans.fr/category/babysitting',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.7
  },
  // Pages utilitaires
  {
    loc: 'https://omrabonsplans.fr/faq',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    loc: 'https://omrabonsplans.fr/prayer-times',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.8
  },
  {
    loc: 'https://omrabonsplans.fr/islamic-calendar',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://omrabonsplans.fr/ramadan-hajj-dates',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: 0.8
  },
  // Pages agences et comparatifs
  {
    loc: 'https://omrabonsplans.fr/agences-liste',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: 'https://omrabonsplans.fr/comparatif-agences',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    loc: 'https://omrabonsplans.fr/comparatif-visuel',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    loc: 'https://omrabonsplans.fr/discussions',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.6
  }
];

/**
 * Génère le contenu XML du sitemap
 */
export const generateSitemap = async (additionalUrls: SitemapUrl[] = []): Promise<string> => {
  const allUrls = [...staticRoutes, ...additionalUrls];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

/**
 * Met à jour le sitemap avec de nouvelles URLs
 */
export const updateSitemap = async (newUrls: SitemapUrl[] = []): Promise<void> => {
  try {
    const sitemapContent = await generateSitemap(newUrls);
    
    // En production, cela devrait être envoyé à votre serveur/API
    // Pour l'instant, nous stockons dans le localStorage pour la démo
    localStorage.setItem('dynamicSitemap', sitemapContent);
    
    console.log('Sitemap mis à jour avec succès');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du sitemap:', error);
  }
};

/**
 * Ajoute une nouvelle URL au sitemap
 */
export const addUrlToSitemap = (url: SitemapUrl): void => {
  const existingSitemap = localStorage.getItem('dynamicSitemap') || '';
  const newSitemapContent = existingSitemap.replace(
    '</urlset>',
    `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>
</urlset>`
  );
  
  localStorage.setItem('dynamicSitemap', newSitemapContent);
};

/**
 * Génère automatiquement des URLs pour les articles de blog
 */
export const generateBlogUrls = (blogPosts: { id: string; slug?: string; category: string; updatedAt?: string }[]): SitemapUrl[] => {
  return blogPosts.map(post => ({
    loc: `https://omrabonsplans.fr/blog/${post.category}/${post.slug || post.id}`,
    lastmod: post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    changefreq: 'weekly' as const,
    priority: 0.7
  }));
};

/**
 * Génère automatiquement des URLs pour les annonces
 */
export const generateAdUrls = (ads: { id: string; category?: string; updatedAt?: string }[]): SitemapUrl[] => {
  return ads.map(ad => ({
    loc: `https://omrabonsplans.fr/annonce/${ad.id}`,
    lastmod: ad.updatedAt ? new Date(ad.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    changefreq: 'weekly' as const,
    priority: 0.6
  }));
};

/**
 * Supprime les URLs obsolètes du sitemap
 */
export const removeObsoleteUrls = (urlsToRemove: string[]): void => {
  const existingSitemap = localStorage.getItem('dynamicSitemap') || '';
  let newSitemapContent = existingSitemap;
  
  urlsToRemove.forEach(url => {
    const urlPattern = new RegExp(`\\s*<url>\\s*<loc>${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>.*?</url>\\s*`, 'g');
    newSitemapContent = newSitemapContent.replace(urlPattern, '');
  });
  
  localStorage.setItem('dynamicSitemap', newSitemapContent);
};

/**
 * Hook pour initialiser et maintenir le sitemap automatiquement
 */
export const initializeSitemap = async (): Promise<void> => {
  try {
    // Vérifier que toutes les URLs du sitemap existent réellement
    const obsoleteUrls = [
      'https://omrabonsplans.fr/blog/conseils-omra',
      'https://omrabonsplans.fr/blog/preparation-hajj', 
      'https://omrabonsplans.fr/blog/guides-pratiques',
      'https://omrabonsplans.fr/blog/spiritualite'
    ];
    
    removeObsoleteUrls(obsoleteUrls);
    
    // Récupérer les données dynamiques (blog posts, annonces, etc.)
    // const blogPosts = await fetchBlogPosts();
    // const ads = await fetchAds();
    
    const dynamicUrls: SitemapUrl[] = [
      // ...generateBlogUrls(blogPosts),
      // ...generateAdUrls(ads)
    ];
    
    await updateSitemap(dynamicUrls);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du sitemap:', error);
  }
};