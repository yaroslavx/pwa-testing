const staticCacheName = 's-app-v2';
const dynamicCacheName = 'd-app-v2';

const assetsUrls = [
  'index.html',
  '/js/app.js',
  '/css/styles.css',
  'offline.html',
];

self.addEventListener('install', async (event) => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(assetsUrls);
});

self.addEventListener('activate', async (event) => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name !== staticCacheName)
      .filter((name) => name !== dynamicCacheName)
      .map((name) => caches.delete(name))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  return cached ?? (await fetch(req));
}

async function networkFirst(req) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const response = await fetch(req);
    await cache.put(req, response.clone());
    return response;
  } catch (err) {
    console.log(err);
    const cached = await cache.match(req);
    return cached ?? caches.match('/offline.html');
  }
}
