// Service Worker for البيت السوداني PWA
const CACHE_NAME = 'sudanese-house-v1.0.0';
const STATIC_CACHE = 'static-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/global.css',
  // Add key pages
  '/marketplace',
  '/companies',
  '/jobs',
  '/products',
  '/services',
  '/ads',
  // Offline fallback page
  '/offline.html'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^\/api\//,
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error('❌ Service Worker: Failed to cache static files:', error);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;

  // Only handle GET requests
  if (method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    handleFetchRequest(request)
  );
});

async function handleFetchRequest(request) {
  const { url } = request;

  try {
    // Check if request is for static files
    if (STATIC_FILES.some(file => url.endsWith(file) || url.includes(file))) {
      return await cacheFirstStrategy(request, STATIC_CACHE);
    }

    // Check if request is for API or external resources
    if (API_CACHE_PATTERNS.some(pattern => pattern.test(url))) {
      return await networkFirstStrategy(request, DYNAMIC_CACHE);
    }

    // For HTML pages, use stale-while-revalidate
    if (request.destination === 'document') {
      return await staleWhileRevalidateStrategy(request, DYNAMIC_CACHE);
    }

    // For other resources (images, scripts, etc.), use cache first
    return await cacheFirstStrategy(request, DYNAMIC_CACHE);

  } catch (error) {
    console.error('❌ Service Worker: Fetch failed:', error);
    return await handleOfflineFallback(request);
  }
}

// Cache First Strategy - good for static assets
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return await handleOfflineFallback(request);
  }
}

// Network First Strategy - good for API calls
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    return await handleOfflineFallback(request);
  }
}

// Stale While Revalidate Strategy - good for HTML pages
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Always try to fetch and update cache in background
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  // Return cached version immediately if available
  if (cached) {
    fetchPromise; // Update cache in background
    return cached;
  }

  // Wait for network if no cached version
  const response = await fetchPromise;
  return response || await handleOfflineFallback(request);
}

// Handle offline scenarios
async function handleOfflineFallback(request) {
  if (request.destination === 'document') {
    // Return offline page for HTML requests
    const cache = await caches.open(STATIC_CACHE);
    const offlinePage = await cache.match('/offline.html');
    return offlinePage || new Response('تطبيق البيت السوداني غير متاح حالياً دون اتصال بالإنترنت', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/html; charset=utf-8'
      })
    });
  }

  // Return a basic offline response for other requests
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Handle background sync for posting data when back online
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any background sync tasks here
      handleBackgroundSync()
    );
  }
});

async function handleBackgroundSync() {
  // Sync any cached data that needs to be sent to server
  console.log('🔄 Service Worker: Performing background sync');
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('🔔 Service Worker: Push notification received');
  
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || 'رسالة جديدة من البيت السوداني',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: data.image,
    dir: 'rtl',
    lang: 'ar',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: [
      {
        action: 'open',
        title: 'فتح',
        icon: '/icons/action-open.png'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/icons/action-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'البيت السوداني', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Service Worker: Notification clicked');
  
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'close') {
    return;
  }

  // Open the app
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if app is already open
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if app is not open
      if (clients.openWindow) {
        const url = data?.url || '/';
        return clients.openWindow(url);
      }
    })
  );
});

// Handle app installation
self.addEventListener('beforeinstallprompt', (event) => {
  console.log('📱 Service Worker: App installation prompt');
  
  // Store the event for later use
  self.deferredPrompt = event;
  
  // Prevent the default install prompt
  event.preventDefault();
});

// Handle successful app installation
self.addEventListener('appinstalled', (event) => {
  console.log('✅ Service Worker: App installed successfully');
  
  // Track installation analytics
  if (self.gtag) {
    self.gtag('event', 'pwa_install', {
      event_category: 'PWA',
      event_label: 'App Installed'
    });
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('⏰ Service Worker: Periodic sync triggered');
  
  if (event.tag === 'content-sync') {
    event.waitUntil(
      // Sync content periodically
      handlePeriodicSync()
    );
  }
});

async function handlePeriodicSync() {
  console.log('⏰ Service Worker: Performing periodic sync');
  
  // Update cached content
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = [
      '/',
      '/marketplace',
      '/companies',
      '/jobs'
    ];
    
    for (const url of requests) {
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.log(`Failed to sync ${url}:`, error);
      }
    }
  } catch (error) {
    console.error('Periodic sync failed:', error);
  }
}

console.log('🚀 Service Worker: البيت السوداني PWA Service Worker loaded');
