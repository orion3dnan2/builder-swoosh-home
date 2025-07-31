// Simple service worker for basic caching
const CACHE_NAME = "sudanese-app-cache-v1";
const urlsToCache = [
  "/",
  "/client/main.tsx",
  "/client/global.css",
  "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap&subset=arabic",
  "https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap&subset=arabic",
  "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap&subset=arabic",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", function (event) {
  // Only handle API requests with fallback
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(function () {
        // Return a basic response for failed API calls
        return new Response(
          JSON.stringify({
            error: "Network error",
            offline: true,
            message: "لا يوجد اتصال بالإنترنت",
          }),
          {
            status: 503,
            statusText: "Service Unavailable",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }),
    );
  } else {
    // For other requests, try cache first
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      }),
    );
  }
});
