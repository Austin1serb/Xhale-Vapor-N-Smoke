/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'my-app-v4'; // Change version to 'my-app-v2', 'my-app-v3', etc. when updating the app
const urlsToCache = [
    '/',
    '/static/css/main.chunk.css',  // Adjust this path to point to your main CSS bundle
    '/static/js/main.chunk.js',    // Adjust this path to point to your main JS bundle
    '/static/js/bundle.js',
    '/6.fbc2e775.chunk.js',  // Add the new file paths here
    '/6.fbc2e775.chunk.js.map',
    '/11.f917dfb2.chunk.js',
    '/11.f917dfb2.chunk.js.map',
    '/70.7171ea1b.chunk.js',
    '/70.7171ea1b.chunk.js.map',
    '/84.c5c8ef9e.chunk.js',
    '/84.c5c8ef9e.chunk.js.map',
    '/93.7ce7dda8.chunk.js',
    '/93.7ce7dda8.chunk.js.map',
    '/95.4270a8b5.chunk.js',
    '/95.4270a8b5.chunk.js.map',
    '/127.1d056ff3.chunk.js',
    '/127.1d056ff3.chunk.js.map',
    '/204.4b7fa1d2.chunk.js',
    '/204.4b7fa1d2.chunk.js.map',
    '/207.9bb97415.chunk.js',
    '/207.9bb97415.chunk.js.map',
    '/294.b1fa6f87.chunk.js',
    '/294.b1fa6f87.chunk.js.map',
    '/307.1fef9fc3.chunk.js',
    '/307.1fef9fc3.chunk.js.map',
    '/318.bab9ef5b.chunk.js',
    '/318.bab9ef5b.chunk.js.map',
    '/392.577ae9d8.chunk.js',
    '/392.577ae9d8.chunk.js.map',
    '/414.b83ad413.chunk.js',
    '/414.b83ad413.chunk.js.map',
    '/421.1f083ffc.chunk.js',
    '/421.1f083ffc.chunk.js.map',
    '/433.20451453.chunk.js',
    '/433.20451453.chunk.js.map',
    '/490.41eec61d.chunk.js',
    '/490.41eec61d.chunk.js.map',
    '/494.3fefa6ac.chunk.js',
    '/494.3fefa6ac.chunk.js.map',
    '/501.6f4c583c.chunk.js',
    '/501.6f4c583c.chunk.js.map',
    '/502.6e2efbe6.chunk.js',
    '/502.6e2efbe6.chunk.js.map',
    '/530.9eee1e92.chunk.js',
    '/530.9eee1e92.chunk.js.map',
    '/587.6adbf0dd.chunk.js',
    '/587.6adbf0dd.chunk.js.map',
    '/592.aa29c32b.chunk.js',
    '/592.aa29c32b.chunk.js.map',
    '/595.bcbb7b04.chunk.js',
    '/595.bcbb7b04.chunk.js.map',
    '/693.e7bc1572.chunk.js',
    '/693.e7bc1572.chunk.js.map',
    '/704.9eaf5008.chunk.js',
    '/704.9eaf5008.chunk.js.map',
    '/768.a37583dc.chunk.js',
    '/768.a37583dc.chunk.js.map',
    '/771.995c87ca.chunk.js',
    '/771.995c87ca.chunk.js.map',
    '/788.5a463157.chunk.js',
    '/788.5a463157.chunk.js.map',
    '/798.b9a43dde.chunk.js',
    '/798.b9a43dde.chunk.js.map',
    '/805.cefdf9a8.chunk.js',
    '/805.cefdf9a8.chunk.js.map',
    '/830.4d1c1daa.chunk.js',
    '/830.4d1c1daa.chunk.js.map',
    '/852.e6d06e85.chunk.js',
    '/852.e6d06e85.chunk.js.map',
    '/889.e2298291.chunk.js',
    '/889.e2298291.chunk.js.map',
    '/951.83591d21.chunk.js',
    '/951.83591d21.chunk.js.map',
    '/955.3eab4b4e.chunk.js',
    '/955.3eab4b4e.chunk.js.map',
    '/main.7b788b3e.js',
    '/main.7b788b3e.js.LICENSE.txt',
    '/main.7b788b3e.js.map',
    '/6.4ab26698.chunk.css',
    '/6.4ab26698.chunk.css.map',
    '/70.6ad7d7bd.chunk.css',
    '/70.6ad7d7bd.chunk.css.map',
    '/95.7476b240.chunk.css',
    '/95.7476b240.chunk.css.map',
    '/318.0ea6a17e.chunk.css',
    '/318.0ea6a17e.chunk.css.map',
    '/392.0ea6a17e.chunk.css',
    '/392.0ea6a17e.chunk.css.map',
    '/414.c8d5ec02.chunk.css',
    '/414.c8d5ec02.chunk.css.map',
    '/433.7476b240.chunk.css',
    '/433.7476b240.chunk.css.map',
    '/490.c6150c45.chunk.css',
    '/490.c6150c45.chunk.css.map',
    '/494.fc99da3f.chunk.css',
    '/494.fc99da3f.chunk.css.map',
    '/501.0ea6a17e.chunk.css',
    '/501.0ea6a17e.chunk.css.map',
    '/502.7476b240.chunk.css',
    '/502.7476b240.chunk.css.map',
    '/530.bcaa2334.chunk.css',
    '/530.bcaa2334.chunk.css.map',
    '/587.63248bec.chunk.css',
    '/587.63248bec.chunk.css.map',
    '/595.0ea6a17e.chunk.css',
    '/595.0ea6a17e.chunk.css.map',
    '/768.5cead890.chunk.css',
    '/768.5cead890.chunk.css.map',
    '/771.4ab26698.chunk.css',
    '/771.4ab26698.chunk.css.map',
    '/788.0ea6a17e.chunk.css',
    '/788.0ea6a17e.chunk.css.map',
    '/830.c848c509.chunk.css',
    '/830.c848c509.chunk.css.map',
    '/main.49c64fba.css',
    '/main.49c64fba.css.map',
    '/Wyld.5f0883f6179123711efa.webp',
    '/beezbee.a3b818d5fcb822c1e7ed.webp',
    '/brandIconSmall.ea7db00256a430bb337f.webp',
    '/cbd.946658447d6cdfd1e38f.webp',
    '/cbdhorizontaltext.2a47c5ed31054df0b2d8.webp',
    '/cbdiconsmall.5f3de9e79b79f7c2f6a4.webp',
    '/cbdtextwicon.2c179c7d0aef61a9c2c2.webp',
    '/koi-logo.e62038ab9e2020a7feae.webp',
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
});

// Cache and return requests
self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        // Respond with the cached index.html for navigational requests
        event.respondWith(
            caches.match('/').then(response => {
                return response || fetch(event.request);
            })
        );
    } else {
        // For non-navigation requests, try to serve from cache first, then network as fallback
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
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
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
