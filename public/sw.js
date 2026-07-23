// CropCare AI - Service Worker for Offline Mode
const CACHE_NAME = 'Tamil Vivasayam-cache-v2';
const API_CACHE_NAME = 'Tamil Vivasayam-api-cache-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline shell');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker] Pre-cache failed (expected in dev mode, caching dynamically):', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Service Worker & clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== API_CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Helper to determine if a request is an API request we want to cache
function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

// Fetch interception
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  // Skip browser extension requests
  if (
    requestUrl.protocol !== 'http:' &&
    requestUrl.protocol !== 'https:'
  ) {
    return;
  }
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle API Requests: Network-First, fallback to Cache
  if (isApiRequest(requestUrl)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If response is valid, clone and save to API Cache
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              if (
                event.request.url.startsWith('http://') ||
                event.request.url.startsWith('https://')
              ) {
                cache.put(event.request, responseClone);
              }
            });
          }
          return response;
        })
        .catch(() => {
          console.log('[Service Worker] API Network failed, serving from cache:', event.request.url);
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // If it's not even in the cache, return an offline-mode specific fallback payload
            // so the application doesn't crash and we can handle it nicely in the UI.
            const emptyFallback = [];
            if (requestUrl.pathname.endsWith('/crops')) {
              console.log('[Service Worker] Serving fallback demo crops');
              return new Response(JSON.stringify([
                {
                  id: 'crop_offline_1',
                  name: 'Paddy (நெல்) [Offline Cache]',
                  variety: 'CR 1009 Sub 1',
                  plantedDate: '2026-05-10',
                  farmName: 'Local Farmer Farm',
                  healthScore: 85,
                  location: 'Thanjavur'
                }
              ]), {
                headers: { 'Content-Type': 'application/json' }
              });
            } else if (requestUrl.pathname.endsWith('/history')) {
              console.log('[Service Worker] Serving fallback demo disease history');
              return new Response(JSON.stringify([
                {
                  id: 'dh_offline_1',
                  cropName: 'Paddy (நெல்) [Offline Cache]',
                  diseaseName: 'Blast Disease (குலை நோய்)',
                  confidence: 0.94,
                  severity: 'High',
                  affectedAreaPct: 35,
                  organicTreatment: 'Spray Pseudomonas fluorescens @ 10g/liter of water.',
                  chemicalTreatment: 'Apply Tricyclazole 75WP @ 1g/liter of water.',
                  recoveryTime: '10-14 Days'
                }
              ]), {
                headers: { 'Content-Type': 'application/json' }
              });
            }

            return new Response(JSON.stringify(emptyFallback), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Handle Static files & Image caching (Stale-While-Revalidate or Network-First)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              if (
                event.request.url.startsWith('http://') ||
                event.request.url.startsWith('https://')
              ) {
                cache.put(event.request, responseClone);
              }
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Swallow fetch error to avoid console noise when offline
          return null;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
