// Minimal service worker - included so old SW get replaced when pushing this repo.
// This SW does nothing but allows registration/unregistration behavior to be consistent.
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => { /* no caching here */ });
