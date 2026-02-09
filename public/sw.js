// BITACORA Service Worker v3
// Cache-First: static assets (HTML, CSS, JS, images)
// Network-First: Supabase API requests
// Stale-While-Revalidate: page navigations

const CACHE_VERSION = 'v3';
const STATIC_CACHE = `bitacora-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `bitacora-dynamic-${CACHE_VERSION}`;
const API_CACHE = `bitacora-api-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
];

// ===============================
// INSTALL
// ===============================
self.addEventListener('install', (event) => {
  console.log('[SW] BITACORA v3 installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ===============================
// ACTIVATE
// ===============================
self.addEventListener('activate', (event) => {
  console.log('[SW] BITACORA v3 activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !key.includes(CACHE_VERSION))
          .map((key) => {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// ===============================
// FETCH
// ===============================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // Supabase API: Network-First with cache fallback
  if (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.in')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Internal API routes: Network-First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Static assets: Cache-First
  if (
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    url.pathname.includes('/_next/static/') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Pages: Stale-While-Revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// ===============================
// STRATEGIES
// ===============================

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (_error) {
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#0F1419" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="#A0AEC0" font-size="10">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (_error) {
    const cached = await caches.match(request);
    if (cached) {
      console.log('[SW] Serving cached response for:', request.url);
      return cached;
    }
    return new Response(
      JSON.stringify({ offline: true, error: 'Sin conexión' }),
      { headers: { 'Content-Type': 'application/json' }, status: 503 }
    );
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || networkPromise || caches.match('/');
}

// ===============================
// MESSAGE HANDLING
// ===============================
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] BITACORA Service Worker v3 loaded');
