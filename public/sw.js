const CACHE_VERSION = 'v1.0.2';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// CRITICAL: Images hero à ne JAMAIS intercepter (chargement direct)
const CRITICAL_HERO_IMAGES = [
  '/lovable-uploads/81c64f5d-d94b-4e16-9f68-3b2b5689f9cf-optimized.png',
  '/lovable-uploads/d5128689-bda3-4612-9ae8-6910ed21a8c8-optimized.png'
];

// Ressources à mettre en cache lors de l'installation (SANS les hero images)
const STATIC_ASSETS = [
  '/critical.css',
  '/lovable-uploads/d506d5c2-ddc8-446e-84b9-f2254d23d35a.png' // Logo uniquement
];

// Durées de cache (en millisecondes)
const CACHE_DURATIONS = {
  images: 30 * 24 * 60 * 60 * 1000, // 30 jours pour les images
  static: 7 * 24 * 60 * 60 * 1000,  // 7 jours pour les assets statiques
  dynamic: 24 * 60 * 60 * 1000      // 1 jour pour le contenu dynamique
};

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Cache des ressources statiques');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE)
            .map((name) => {
              console.log('[SW] Suppression ancien cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Stratégie de cache pour les images Supabase
function cacheSupabaseImage(request, response) {
  // Cloner la réponse car elle ne peut être utilisée qu'une fois
  const responseToCache = response.clone();
  
  caches.open(IMAGE_CACHE).then((cache) => {
    // Modifier les en-têtes pour forcer un cache long
    const headers = new Headers(responseToCache.headers);
    headers.set('Cache-Control', 'public, max-age=2592000, immutable'); // 30 jours
    headers.append('sw-cached-at', Date.now().toString());
    
    const modifiedResponse = new Response(responseToCache.body, {
      status: responseToCache.status,
      statusText: responseToCache.statusText,
      headers: headers
    });
    
    cache.put(request, modifiedResponse);
  });
  
  // Retourner une réponse modifiée avec les bons en-têtes de cache
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'public, max-age=2592000, immutable');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

// Vérifier si une réponse en cache est encore valide
function isCacheValid(response, maxAge) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return false;
  
  const age = Date.now() - parseInt(cachedAt, 10);
  return age < maxAge;
}

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // CRITICAL: Ne JAMAIS intercepter les images hero critiques
  if (CRITICAL_HERO_IMAGES.some(img => url.pathname.includes(img))) {
    console.log('[SW] Hero image - chargement direct (pas de cache)');
    return; // Laisser passer sans interception
  }

  // Stratégie pour les images Supabase
  if (url.hostname.includes('supabase.co') && 
      (url.pathname.includes('/storage/v1/object/') || 
       url.pathname.includes('/cover.webp') ||
       url.pathname.match(/\.(jpg|jpeg|png|webp|avif)$/i))) {
    
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          // Si en cache et valide, retourner
          if (cachedResponse && isCacheValid(cachedResponse, CACHE_DURATIONS.images)) {
            console.log('[SW] Image depuis cache:', url.pathname);
            return cachedResponse;
          }
          
          // Sinon, fetch depuis le réseau
          return fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                return cacheSupabaseImage(request, response);
              }
              return response;
            })
            .catch(() => {
              // En cas d'erreur réseau, retourner le cache même expiré si disponible
              return cachedResponse || new Response('Image non disponible', { status: 503 });
            });
        });
      })
    );
    return;
  }

  // Stratégie pour les ressources statiques locales
  if (url.origin === location.origin && 
      (url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|woff2?)$/i) || 
       url.pathname === '/' || 
       url.pathname.includes('/assets/'))) {
    
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Asset depuis cache:', url.pathname);
          return cachedResponse;
        }
        
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Stratégie pour les API calls (cache puis network)
  if (url.hostname.includes('supabase.co') && url.pathname.includes('/rest/')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Fallback vers cache en cas d'erreur réseau
            return cache.match(request);
          });
      })
    );
    return;
  }

  // Par défaut, network first
  event.respondWith(fetch(request));
});

// Gestion des messages depuis l'app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      })
    );
  }
});
