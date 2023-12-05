///* eslint-disable no-restricted-globals */
//const CACHE_NAME = 'my-app-v2'; // Change version to 'my-app-v2', 'my-app-v3', etc. when updating the app
//const urlsToCache = [
//    '/',
//    '/static/css/main.chunk.css',  // Adjust this path to point to your main CSS bundle
//    '/static/js/main.chunk.js',    // Adjust this path to point to your main JS bundle
//    '/static/js/bundle.js'
//];

//// Install a service worker
//self.addEventListener('install', event => {
//    event.waitUntil(
//        caches.open(CACHE_NAME)
//            .then(cache => {
//                console.log('Opened cache');
//                return cache.addAll(urlsToCache);
//            })
//    );
//});

//// Cache and return requests
//self.addEventListener('fetch', event => {
//    if (event.request.mode === 'navigate') {
//        // Respond with the cached index.html for navigational requests
//        event.respondWith(
//            caches.match('/').then(response => {
//                return response || fetch(event.request);
//            })
//        );
//    } else {
//        // For non-navigation requests, try to serve from cache first, then network as fallback
//        event.respondWith(
//            caches.match(event.request)
//                .then(response => {
//                    return response || fetch(event.request);
//                })
//        );
//    }
//});


//// Update a service worker
//self.addEventListener('activate', event => {
//    const cacheWhitelist = [CACHE_NAME];
//    event.waitUntil(
//        caches.keys().then(cacheNames => {
//            return Promise.all(
//                cacheNames.map(cacheName => {
//                    if (cacheWhitelist.indexOf(cacheName) === -1) {
//                        return caches.delete(cacheName);
//                    }
//                })
//            );
//        })
//    );
//});
