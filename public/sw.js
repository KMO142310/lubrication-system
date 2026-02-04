// AISA Lubrication PWA Service Worker v2
// Estrategias: Cache-First (assets), Network-First (API), Stale-While-Revalidate (pages)

const CACHE_VERSION = 'v2';
const STATIC_CACHE = `aisa-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `aisa-dynamic-${CACHE_VERSION}`;
const API_CACHE = `aisa-api-${CACHE_VERSION}`;

// Assets para pre-cache
const STATIC_ASSETS = [
  '/',
  '/login',
  '/tasks',
  '/metrics',
  '/anomalies',
  '/schedule',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
];

// ===============================
// INSTALL: Pre-cache static assets
// ===============================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v2...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ===============================
// ACTIVATE: Clean old caches
// ===============================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v2...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !key.includes(CACHE_VERSION))
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// ===============================
// FETCH: Cache strategies
// ===============================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) return;

  // API calls: Network-First
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
    url.pathname.includes('/_next/static/')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Pages: Stale-While-Revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// Strategy: Cache-First (images, CSS, JS)
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
  } catch (error) {
    // Return placeholder for images
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#1e3654" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="#94a3b8" font-size="10">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    return new Response('Offline', { status: 503 });
  }
}

// Strategy: Network-First (APIs)
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      console.log('[SW] Returning cached API response');
      return cached;
    }
    return new Response(
      JSON.stringify({ offline: true, error: 'Sin conexión' }),
      { headers: { 'Content-Type': 'application/json' }, status: 503 }
    );
  }
}

// Strategy: Stale-While-Revalidate (pages)
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
// BACKGROUND SYNC
// ===============================
self.addEventListener('sync', (event) => {
  console.log('[SW] Background Sync:', event.tag);

  if (event.tag === 'sync-completed-tasks') {
    event.waitUntil(syncCompletedTasks());
  }
});

async function syncCompletedTasks() {
  // Get pending tasks from IndexedDB
  // This would connect to the offline database
  console.log('[SW] Syncing completed tasks to server...');

  // Notify clients that sync completed
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: 'SYNC_COMPLETE', timestamp: Date.now() });
  });
}

// ===============================
// PUSH NOTIFICATIONS
// ===============================
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  const options = {
    body: data.body || 'Tienes tareas pendientes',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-192x192.svg',
    vibrate: [200, 100, 200],
    tag: data.tag || 'aisa-notification',
    renotify: true,
    data: {
      url: data.url || '/tasks',
      taskId: data.taskId,
    },
    actions: [
      { action: 'open', title: 'Ver Tarea' },
      { action: 'dismiss', title: 'Cerrar' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'AISA Lubricación', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window or open new
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(event.notification.data.url);
          return client.focus();
        }
      }
      return clients.openWindow(event.notification.data.url);
    })
  );
});

// ===============================
// MESSAGE HANDLING
// ===============================
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'CACHE_TASK') {
    // Pre-cache specific task data
    const taskUrl = event.data.url;
    caches.open(API_CACHE).then(cache => {
      fetch(taskUrl).then(response => {
        if (response.ok) cache.put(taskUrl, response);
      });
    });
  }
});

console.log('[SW] AISA Service Worker v2 loaded');
