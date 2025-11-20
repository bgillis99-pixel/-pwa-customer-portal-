// NorCal CARB Portal Service Worker
// Version 2.0 - Advanced PWA Features

const CACHE_VERSION = 'carb-portal-v2';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_IMAGES = `${CACHE_VERSION}-images`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/pwa-customer-portal/',
];

// =====================================================
// INSTALL - Cache static assets
// =====================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting...');
        return self.skipWaiting(); // Activate immediately
      })
  );
});

// =====================================================
// ACTIVATE - Clean up old caches
// =====================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('carb-portal-') && name !== CACHE_VERSION)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients...');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// =====================================================
// FETCH - Advanced caching strategies
// =====================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Firebase and external API calls (always network)
  if (
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('arb.ca.gov')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // Images: Cache First strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          // Cache successful image responses
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_IMAGES).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // HTML pages: Network First with offline fallback
  if (
    request.destination === 'document' ||
    request.headers.get('accept')?.includes('text/html')
  ) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Cache successful responses
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_DYNAMIC).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline page if available
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Static assets (JS, CSS, fonts): Cache First with network fallback
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_STATIC).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default: Network First
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Cache successful GET responses
        if (networkResponse.ok && request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_DYNAMIC).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// =====================================================
// BACKGROUND SYNC - Offline data submission
// =====================================================
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'sync-logs') {
    event.waitUntil(syncLogEntries());
  }

  if (event.tag === 'sync-forms') {
    event.waitUntil(syncFormData());
  }
});

async function syncLogEntries() {
  try {
    // Get pending log entries from IndexedDB (if implemented)
    console.log('[SW] Syncing log entries...');
    // TODO: Implement IndexedDB queue and sync logic
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Sync failed:', error);
    throw error; // Retry on next sync
  }
}

async function syncFormData() {
  try {
    console.log('[SW] Syncing form data...');
    // TODO: Implement form data sync logic
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Form sync failed:', error);
    throw error;
  }
}

// =====================================================
// PUSH NOTIFICATIONS
// =====================================================
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  let notificationData = {
    title: 'NorCal CARB Portal',
    body: 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: '/',
    },
  };

  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        data: data.data || notificationData.data,
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      vibrate: [200, 100, 200],
      tag: 'carb-notification',
      requireInteraction: false,
    })
  );
});

// =====================================================
// NOTIFICATION CLICK
// =====================================================
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// =====================================================
// MESSAGE HANDLING (from client)
// =====================================================
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }

  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_DYNAMIC).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// =====================================================
// PERIODIC BACKGROUND SYNC (experimental)
// =====================================================
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync triggered:', event.tag);

  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  try {
    console.log('[SW] Updating cached content...');
    // Refresh critical pages
    const cache = await caches.open(CACHE_DYNAMIC);
    await cache.addAll(['/']);
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Content update failed:', error);
  }
}

console.log('[SW] Service Worker loaded successfully');
