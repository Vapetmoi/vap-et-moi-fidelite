const CACHE_NAME = 'vap-et-moi-v69-recherche-produit-1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './mascotte-vap-moi.jpg', './accueil-banniere.jpg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('vap-et-moi-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const url = new URL(req.url);
  if (url.pathname.endsWith('/index.html') || url.pathname === new URL(self.registration.scope).pathname) {
    event.respondWith(fetch(req).then(response => { if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(req, response.clone())); return response; }).catch(() => caches.match(req).then(cached => cached || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(response => { if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(req, response.clone())); return response; })));
});
