const CACHE_NAME = "pmgvc-gold-calculator-v4";
const BASE = "/PMGVC/";
const APP_SHELL = [
  BASE,
  BASE + "index.html",
  BASE + "manifest.json",
  BASE + "service-worker.js",
  BASE + "gold-calculator-logo.jpg",
  BASE + "icon-192.png",
  BASE + "icon-512.png",
  BASE + "favicon-32.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => caches.match(BASE + "index.html"));
  }));
});
