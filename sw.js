const CACHE_NAME = 'anmol-portfolio-v6';

const urlsToCache = [
  '/Portfolio/',
  '/Portfolio/index.html',
  '/Portfolio/internships.html',
  '/Portfolio/parttime.html',
  '/Portfolio/ambassador.html',
  '/Portfolio/manifest.json',
  '/Portfolio/Image/photo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Fail-safe caching: if one file fails, the rest still cache and install
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
