// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
// under application cache I am cache all assets

// http://localhost:8887/sw.js you can see the ouput of the sw code.
console.log('are you loading sw.js?');
self.addEventListener('fetch', function(event) {
  console.log(event.request+'fetching happening?');
});

const staticCacheName = 'restaurant-reviews-static-v1';
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(
        [
          '../css/styles.css',
          '../js/dbhelper.js',
          '../js/main.js',
          '../js/restaurant_info.js',
          '../index.html',
          '../restaurant.html',
          'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
          'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js'
        ]
      );
    })
  );
});

// self.addEventListener('fetch', function(event) {
//   console.log(event.request.url);

// });

// https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading
// Cache falling back to the network

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function(cache) {
      console.log(event.request);
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});