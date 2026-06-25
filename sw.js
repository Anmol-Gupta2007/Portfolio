const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './internship.html',
  './parttime.html',
  './ambassador.html',
  './photo.png'
];

// Install the service worker and cache the files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached response if found, otherwise fetch from network
        return response || fetch(event.request);
      })
  );
});
