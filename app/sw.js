'use strict';

// We use a singlular, versioned cache, as each subsequent version of the SW
// will usually correspond to updates to our set of cached assets.
const currentCacheNames = ['v1'];

// Install is where we cache the static assets belonging to the application.
self.addEventListener('install', function (event) {
  console.log('Installing SW');
  // Wait until SW has finished caching in order for it to be considered installed.
  event.waitUntil(
      // Open the cache and add our static files.
      caches.open(currentCacheNames)
          .then((cache) => {
              return cache.addAll([
                './',
                './scripts/main.js',
                './styles/main.css',
              ]);
          })
  );
});

// Activate is where we clean up the caches of any previous versions of the SW.
self.addEventListener('activate', function (event) {
  console.log('Activating SW');
  event.waitUntil(
      // Get all of the caches by key.
      caches.keys()
          .then((caches) => {
              return Promise.all(
                  caches.map((cacheName) => {
                      // Delete any caches which don't belong to the current version of the SW.
                      if (currentCacheNames.indexOf(cacheName) === -1) {
                          return caches.delete(cacheName);
                      }
                  })
              );
          })
  );
});

// The fetch event is triggered for every request on the page. So for every individual CSS, JS and image file.
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // Return the file from the cache if it exists, otherwise forward the request to the network.
    caches.match(event.request).then((response) => {
        return response || fetch(event.request);
    })
  )
});
