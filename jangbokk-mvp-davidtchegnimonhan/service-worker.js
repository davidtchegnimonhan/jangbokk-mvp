const CACHE_NAME = 'jangbokk-v2';
const ASSETS = [
  '/',
  '/index.html','/login.html','/register.html','/market.html','/learning.html','/about.html',
  '/css/style.css','/css/market.css','/css/learning.css',
  '/js/auth.js','/js/main.js','/js/learning.js','/js/market.js','/js/lang.js','/js/ui.js','/js/wallet.js',
  '/manifest.json','/icons/icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
