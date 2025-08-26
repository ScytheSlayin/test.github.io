// Simple service worker for offline caching
const CACHE = 'launchpad-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/favicon.svg',
  '/manifest.webmanifest',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  e.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(request, copy));
      return resp;
    }).catch(() => caches.match('/index.html')))
  );
});
