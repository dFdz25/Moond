// Service Worker básico para activar la PWA
self.addEventListener('install', (event) => {
  console.log('SW instalado');
});

self.addEventListener('fetch', (event) => {
  // Aquí se manejaría el modo offline en el futuro
});
