const CACHE_NAME = 'anmol-portfolio-v-new'; 

const urlsToCache = [
  './',
  './index.html',
  './internships.html',
  './parttime.html',
  './ambassador.html',
  './manifest.json',
  './Image/photo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        urlsToCache.map(url => {
          return cache.add(url).catch(err => {
            console.warn('Non-critical failure to cache:', url, err);
          });
        })
      );
    })
  );
  self.skipWaiting(); 
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
  self.clients.claim();
});

// --- THE NEW MAGIC: NETWORK-FIRST STRATEGY ---
self.addEventListener('fetch', event => {
  // Ignore non-http requests (like Chrome extensions)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    // 1. Try to fetch the fresh file from GitHub (The Network)
    fetch(event.request)
      .then(networkResponse => {
        // 2. If successful, update the cache with this new fresh version
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse; // Show the fresh website
        });
      })
      .catch(() => {
        // 3. If the user is offline (fetch fails), show them the saved PWA cache
        return caches.match(event.request);
      })
  );
});
