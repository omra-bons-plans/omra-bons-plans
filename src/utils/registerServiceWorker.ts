export function registerServiceWorker() {
  // ⚠️ Service Worker temporarily disabled to fix PageSpeed issues
  // Will be re-enabled after testing
  console.log('⚠️ Service Worker disabled temporarily');
  return;
  
  /* DISABLED
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.log('❌ Service Worker registration failed:', error);
        });
    });
  }
  */
}
