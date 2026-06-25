const CACHE_NAME = 'anmol-portfolio-v2';

// Using relative paths ensures it works perfectly on GitHub Pages
const urlsToCache = [
  './',
  './index.html',
  './internships.html',
  './parttime.html',
  './ambassador.html',
  './manifest.json',
  './photo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // This fail-safe approach caches files individually. 
      // If one file 404s, it won't crash the entire Service Worker installation.
      return Promise.all(
        urlsToCache.map(url => {
          return cache.add(url).catch(err => {
            console.warn('Non-critical failure to cache:', url, err);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
