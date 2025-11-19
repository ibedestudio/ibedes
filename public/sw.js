const CACHE_NAME = 'ibedes-v2.0.0';
const STATIC_CACHE = 'ibedes-static-v2';
const DYNAMIC_CACHE = 'ibedes-dynamic-v2';
const IMAGE_CACHE = 'ibedes-images-v2';
const DB_NAME = 'ibedes-store';
const DB_VERSION = 1;
const ANALYTICS_STORE = 'analytics';
const OFFLINE_ACTIONS_STORE = 'offline-actions';

// URLs to cache for offline functionality
const urlsToCache = [
  '/',
  '/blog',
  '/rekomendasi',
  '/projects',
  '/services',
  '/swag',
  '/manifest.json',
  '/favicon.svg',
  '/ibedes.jpg',
  // Add some common routes
  '/blog/index',
  '/services/index',
  '/projects/index'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static resources');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Static resources cached successfully');
        // Force activation of new service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.log('[SW] Cache install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== IMAGE_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service worker activated');
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with fallback strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin or http(s) requests. Skip chrome-extension, file, etc.
  if (request.method !== 'GET') return;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Cache strategy for different types of content
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request));
  } else if (isImage(request)) {
    event.respondWith(cacheFirstWithNetworkUpdate(request));
  } else if (isApiRequest(request)) {
    event.respondWith(networkFirstStrategy(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Background sync for analytics and offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  if (event.tag === 'background-analytics') {
    event.waitUntil(syncAnalytics());
  } else if (event.tag === 'offline-actions') {
    event.waitUntil(processOfflineActions());
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Ada pembaruan terbaru di ibedes',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Baca Sekarang',
        icon: '/favicon.svg'
      },
      {
        action: 'close',
        title: 'Nanti Saja',
        icon: '/favicon.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ibedes', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/blog')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Cache strategies
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache first strategy failed:', error);
    return new Response('Offline - Content not available', { status: 503 });
  }
}

async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline - Network unavailable', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.log('[SW] Stale while revalidate network failed:', error);
    return cachedResponse;
  });

  return cachedResponse || fetchPromise;
}

async function cacheFirstWithNetworkUpdate(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse);
      }
    }).catch(() => {});
    
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Offline - Image not available', { status: 503 });
  }
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/);
}

function isImage(request) {
  const url = new URL(request.url);
  return request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/);
}

function isApiRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

// Background sync functions
async function syncAnalytics() {
  try {
    console.log('[SW] Syncing analytics data...');
    const analyticsEntries = await readAllFromStore(ANALYTICS_STORE);
    if (analyticsEntries.length > 0) {
      console.log('[SW] Analytics data ready for sync', analyticsEntries.length);
      // TODO: send analyticsEntries to your analytics endpoint
      await clearStore(ANALYTICS_STORE);
    }
  } catch (error) {
    console.log('[SW] Background sync failed:', error);
  }
}

async function processOfflineActions() {
  try {
    console.log('[SW] Processing offline actions...');
    const offlineActions = await readAllFromStore(OFFLINE_ACTIONS_STORE);
    if (offlineActions.length > 0) {
      console.log('[SW] Found offline actions to process');
      // TODO: send offline actions to API or handle accordingly
      await clearStore(OFFLINE_ACTIONS_STORE);
    }
  } catch (error) {
    console.log('[SW] Offline actions processing failed:', error);
  }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports?.[0]?.postMessage({ version: CACHE_NAME });
  }

  if (event.data && event.data.type === 'STORE_ANALYTICS') {
    const records = Array.isArray(event.data.payload)
      ? event.data.payload
      : [event.data.payload].filter(Boolean);
    if (records.length > 0) {
      event.waitUntil(storeRecords(ANALYTICS_STORE, records));
    }
  }

  if (event.data && event.data.type === 'QUEUE_OFFLINE_ACTION') {
    const payload = {
      action: event.data.action,
      data: event.data.payload,
      timestamp: Date.now()
    };
    event.waitUntil(storeRecords(OFFLINE_ACTIONS_STORE, [payload]));
  }
});

// IndexedDB helpers
function openDatabase() {
  if (!self.indexedDB) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(ANALYTICS_STORE)) {
        db.createObjectStore(ANALYTICS_STORE, { autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(OFFLINE_ACTIONS_STORE)) {
        db.createObjectStore(OFFLINE_ACTIONS_STORE, { autoIncrement: true });
      }
    };
  });
}

async function readAllFromStore(storeName) {
  const db = await openDatabase();
  if (!db) return [];

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function storeRecords(storeName, records) {
  const db = await openDatabase();
  const sanitizedRecords = (records || []).filter((record) => record !== undefined && record !== null);
  if (!db || sanitizedRecords.length === 0) return;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    sanitizedRecords.forEach((record) => store.add(record));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function clearStore(storeName) {
  const db = await openDatabase();
  if (!db) return;

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
