// ==========================
// TravelAI Deals Service Worker
// ==========================

// Versiunea cache-ului (schimb-o dacă modifici fișierele statice)
const CACHE_NAME = "travelai-cache-v1";

// Fișierele care vor fi păstrate offline
const URLS_TO_CACHE = ["/", "/index.html", "/manifest.json", "/favicon.ico"];

// Instalează și cache-uiește fișierele de bază
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Cache instalat:", CACHE_NAME);
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activează noua versiune și șterge cache-urile vechi
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  console.log("⚡ Service Worker activat");
});

// Interceptează cererile și răspunde din cache dacă e offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // dacă e în cache, returnează
      if (response) return response;

      // altfel, cere din rețea și salvează pentru data viitoare
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => caches.match("/index.html"));
    })
  );
});
