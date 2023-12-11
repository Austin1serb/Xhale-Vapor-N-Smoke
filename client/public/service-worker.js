/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'my-app-v11'; // Change version to 'my-app-v2', 'my-app-v3', etc. when updating the app
const urlsToCache = [
    '/',
    '/cbd.webp',
    '/index.html',
    '/favicon.ico',
    '/manifest.json',
    '/robots.txt',
    '/static/js/bundle.js',
    '/icons/icon-64x64.ico',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/maskable_icon.png',
    '/static/',



];

// Install a service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
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