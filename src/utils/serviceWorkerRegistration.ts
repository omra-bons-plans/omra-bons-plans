/**
 * Enregistrement et gestion du Service Worker pour optimiser les performances
 */

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Attendre que la page soit complètement chargée
      await new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve(null);
        } else {
          window.addEventListener('load', resolve);
        }
      });
      
      // CRITICAL: Délai de 3 secondes pour ne pas impacter le LCP
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Enregistrer le service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Toujours vérifier les updates
      });

      console.log('✅ Service Worker enregistré (après délai pour LCP):', registration.scope);

      // Gérer les mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 Nouvelle version du Service Worker disponible');
              
              // Demander au nouveau SW de prendre le contrôle immédiatement
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        }
      });

      // Recharger la page quand un nouveau SW prend le contrôle
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Service Worker mis à jour, rechargement...');
        window.location.reload();
      });

      return registration;
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement du Service Worker:', error);
    }
  } else {
    console.warn('⚠️ Service Workers non supportés par ce navigateur');
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        await registration.unregister();
      }
      
      console.log('✅ Service Worker désenregistré');
    } catch (error) {
      console.error('❌ Erreur lors du désenregistrement du Service Worker:', error);
    }
  }
};

export const clearServiceWorkerCache = async () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    console.log('🗑️ Cache du Service Worker effacé');
  }
};
