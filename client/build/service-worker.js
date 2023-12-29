/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'my-app-v15';
const urlsToCache = [
    '/',
    '/cbd.webp',
    '/index.html',
    '/favicon.ico',
    '/manifest.json',
    '/robots.txt',
    '/icons/icon-16x16.ico',
    '/icons/icon-32x32.ico',
    '/icons/icon-48x48.ico',
    '/icons/icon-64x64.ico',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/maskable_icon.png',
    '/icons/facebook-logo-1200x630.png',
    '/icons/apple-touch-icon.png',
    'https://fonts.googleapis.com/css2?family=Playfair+Display&family=Poppins:wght@200;400&family=Source+Sans+3:wght@400&display=swap',
    'https://fonts.googleapis.com/css2?family=Cormorant:wght@500&display=swap',



];

// Install a service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});// Cache and return requests
self.addEventListener('fetch', (event) => {
    const apiUrl = '/api/';

    if (event.request.url.includes(apiUrl)) {
        // Handle API requests separately
        event.respondWith(fetch(event.request));
    } else if (event.request.url.startsWith(self.location.origin + '/static/')) {
        // Cache everything in the /static/ folder and its subfolders
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    } else {
        // For non-API requests, try to serve from cache, then network as fallback
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request)
                        .then(async fetchResponse => {
                            const cache = await caches.open(CACHE_NAME);
                            cache.put(event.request, fetchResponse.clone());
                            return fetchResponse;
                        });
                })
        );
    }
});


// Update a service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Ensure the new service worker becomes active immediately
    self.clients.claim();
});