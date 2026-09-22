/* Harper Learning — offline cache. Bump VERSION whenever files change. */
const VERSION = 'hl-v21';
const ASSETS = ['./', './index.html', './science.html', './manifest.webmanifest', './manifest-science.webmanifest', './icons/icon-science.svg', './icons/icon-science-180.png', './icons/icon-science-512.png', './js/art/animals-science.js', './js/art/jar-images.js', './js/art/candy.js', './js/art/piggy-image.js', './js/art/piggy.js', './js/art/sound.js', './css/app.css', './icons/icon.svg', './icons/icon-180.png', './icons/icon-512.png',
  './js/core/rng.js', './js/core/num.js', './js/core/registry.js', './js/core/mark.js', './js/core/store.js', './js/core/engine.js', './js/core/sync-config.js', './js/core/sync.js', './js/art/animal-images.js', './js/art/animals.js', './js/ui.js'];
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    // topic files are discovered from index.html so this list never goes stale
    const pages = await Promise.all(['./index.html', './science.html'].map(async (p) => (await fetch(p)).text()));
    const topicFiles = pages.flatMap((html) => Array.from(html.matchAll(/src="(js\/(?:maths|science)\/topics\/[^"]+)"/g)).map((m) => './' + m[1]));
    await c.addAll(ASSETS.concat(topicFiles));
    self.skipWaiting();
  })());
});
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // fonts: let the browser handle (fallback stack works offline)
  e.respondWith((async () => {
    const cached = await caches.match(e.request, { ignoreSearch: true });
    const network = fetch(e.request).then((r) => { if (r.ok) caches.open(VERSION).then((c) => c.put(e.request, r.clone())); return r; }).catch(() => cached);
    return cached || network;
  })());
});
