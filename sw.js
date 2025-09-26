const CACHE_NAME = 'scancarnet-v4';
const CORE = ['/','/index.html'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => { event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request))); });
