/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'my-app-v10'; // Change version to 'my-app-v2', 'my-app-v3', etc. when updating the app
const urlsToCache = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/manifest.json',
    '/robots.txt',

    '/static/js/bundle.js',
    '/icons/icon-64x64.ico',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/maskable_icon.png',
    '/static/css/6.4ab26698.chunk.css',
    '/static/css/6.4ab26698.chunk.css.map',
    '/static/css/8.9b601359.chunk.css',
    '/static/css/8.9b601359.chunk.css.map',
    '/static/css/70.6ad7d7bd.chunk.css',
    '/static/css/70.6ad7d7bd.chunk.css.map',
    '/static/css/95.7476b240.chunk.css',
    '/static/css/95.7476b240.chunk.css.map',
    '/static/css/318.7e4c746f.chunk.css',
    '/static/css/318.7e4c746f.chunk.css.map',
    '/static/css/392.7e4c746f.chunk.css',
    '/static/css/392.7e4c746f.chunk.css.map',
    '/static/css/414.c8d5ec02.chunk.css',
    '/static/css/414.c8d5ec02.chunk.css.map',
    '/static/css/433.7476b240.chunk.css',
    '/static/css/433.7476b240.chunk.css.map',
    '/static/css/490.c6150c45.chunk.css',
    '/static/css/490.c6150c45.chunk.css.map',
    '/static/css/501.7e4c746f.chunk.css',
    '/static/css/501.7e4c746f.chunk.css.map',
    '/static/css/502.7476b240.chunk.css',
    '/static/css/502.7476b240.chunk.css.map',
    '/static/css/570.0b5db8ab.chunk.css',
    '/static/css/570.0b5db8ab.chunk.css.map',
    '/static/css/587.63248bec.chunk.css',
    '/static/css/587.63248bec.chunk.css.map',
    '/static/css/595.7e4c746f.chunk.css',
    '/static/css/595.7e4c746f.chunk.css.map',
    '/static/css/768.87ca128b.chunk.css',
    '/static/css/768.87ca128b.chunk.css.map',
    '/static/css/771.4ab26698.chunk.css',
    '/static/css/771.4ab26698.chunk.css.map',
    '/static/css/788.7e4c746f.chunk.css',
    '/static/css/788.7e4c746f.chunk.css.map',
    '/static/css/830.f8928425.chunk.css',
    '/static/css/830.f8928425.chunk.css.map',
    '/static/css/main.297c1926.css',
    '/static/css/main.297c1926.css.map',

    '/static/js/6.4551788a.chunk.js',
    '/static/js/6.4551788a.chunk.js.map',
    '/static/js/8.d05e5f91.chunk.js',
    '/static/js/8.d05e5f91.chunk.js.map',
    '/static/js/11.f917dfb2.chunk.js',
    '/static/js/11.f917dfb2.chunk.js.map',
    '/static/js/70.7c117be8.chunk.js',
    '/static/js/70.7c117be8.chunk.js.map',
    '/static/js/84.cb174abf.chunk.js',
    '/static/js/84.cb174abf.chunk.js.map',
    '/static/js/95.8e465b2e.chunk.js',
    '/static/js/95.8e465b2e.chunk.js.map',
    '/static/js/127.1d056ff3.chunk.js',
    '/static/js/127.1d056ff3.chunk.js.map',
    '/static/js/204.4cc81743.chunk.js',
    '/static/js/204.4cc81743.chunk.js.map',
    '/static/js/207.9bb97415.chunk.js',
    '/static/js/207.9bb97415.chunk.js.map',
    '/static/js/294.b1fa6f87.chunk.js',
    '/static/js/294.b1fa6f87.chunk.js.map',
    '/static/js/307.1fef9fc3.chunk.js',
    '/static/js/307.1fef9fc3.chunk.js.map',
    '/static/js/318.bc4ae7ad.chunk.js',
    '/static/js/318.bc4ae7ad.chunk.js.map',
    '/static/js/392.577ae9d8.chunk.js',
    '/static/js/392.577ae9d8.chunk.js.map',
    '/static/js/414.d7a4e3e6.chunk.js',
    '/static/js/414.d7a4e3e6.chunk.js.map',
    '/static/js/421.273ad72c.chunk.js',
    '/static/js/421.273ad72c.chunk.js.map',
    '/static/js/433.e563418c.chunk.js',
    '/static/js/433.e563418c.chunk.js.map',
    '/static/js/490.39c7fb60.chunk.js',
    '/static/js/490.39c7fb60.chunk.js.map',
    '/static/js/501.98dd7d6f.chunk.js',
    '/static/js/501.98dd7d6f.chunk.js.map',
    '/static/js/502.d9554a09.chunk.js',
    '/static/js/502.d9554a09.chunk.js.map',
    '/static/js/570.826b1547.chunk.js',
    '/static/js/570.826b1547.chunk.js.map',
    '/static/js/587.6adbf0dd.chunk.js',
    '/static/js/587.6adbf0dd.chunk.js.map',
    '/static/js/592.4fe352ac.chunk.js',
    '/static/js/592.4fe352ac.chunk.js.map',
    '/static/js/595.04a320ef.chunk.js',
    '/static/js/595.04a320ef.chunk.js.map',
    '/static/js/693.e7bc1572.chunk.js',
    '/static/js/693.e7bc1572.chunk.js.map',
    '/static/js/704.9eaf5008.chunk.js',
    '/static/js/704.9eaf5008.chunk.js.map',
    '/static/js/768.fb6f0d9c.chunk.js',
    '/static/js/768.fb6f0d9c.chunk.js.map',
    '/static/js/771.cdd03e8e.chunk.js',
    '/static/js/771.cdd03e8e.chunk.js.map',
    '/static/js/788.bea9b304.chunk.js',
    '/static/js/788.bea9b304.chunk.js.map',
    '/static/js/798.b9a43dde.chunk.js',
    '/static/js/798.b9a43dde.chunk.js.map',
    '/static/js/805.cefdf9a8.chunk.js',
    '/static/js/805.cefdf9a8.chunk.js.map',
    '/static/js/830.f9106692.chunk.js',
    '/static/js/830.f9106692.chunk.js.map',
    '/static/js/838.b56bff99.chunk.js',
    '/static/js/838.b56bff99.chunk.js.map',
    '/static/js/852.e6d06e85.chunk.js',
    '/static/js/852.e6d06e85.chunk.js.map',
    '/static/js/889.e2298291.chunk.js',
    '/static/js/889.e2298291.chunk.js.map',
    '/static/js/951.06353c78.chunk.js',
    '/static/js/951.06353c78.chunk.js.map',
    '/static/js/955.3eab4b4e.chunk.js',
    '/static/js/955.3eab4b4e.chunk.js.map',
    '/static/js/main.c8860a37.js',
    '/static/js/main.c8860a37.js.LICENSE.txt',
    '/static/js/main.c8860a37.js.map',
    'static/media/Wyld.5f0883f6179123711efa.webp',
    'static/media/beezbee.a3b818d5fcb822c1e7ed.webp',
    'static/media/brandIconSmall.ea7db00256a430bb337f.webp',
    'static/media/cbd.946658447d6cdfd1e38f.webp',
    'static/media/cbdhorizontaltext.2a47c5ed31054df0b2d8.webp',
    'static/media/cbdiconsmall.5f3de9e79b79f7c2f6a4.webp',
    'static/media/cbdtextwicon.2c179c7d0aef61a9c2c2.webp',
    'static/media/koi-logo.e62038ab9e2020a7feae.webp',
    '/static/js/vendors-node_modules_mui_material_ListItem_ListItem_js.chunk.js',
    '/static/js/vendors-node_modules_mui_material_Button_Button_js-node_modules_mui_material_utils_isMuiElement_js.chunk.js',
    '/static/js/node_modules_mui_material_utils_requirePropFactory_js-node_modules_mui_material_utils_unsuppo-a1f2a5.chunk.js',
    '/static/img/Imagecbd.946658447d6cdfd1e38f.webp',
    '/static/img/cbd.946658447d6cdfd1e38f.webp',
    '/static/js/vendors-node_modules_mui_material_Skeleton_Skeleton_js.chunk.js',
    '/static/js/src_components_BestSellersSection_jsx-node_modules_mui_material_utils_requirePropFactory_js.chunk.js',
    '/static/js/src_components_ShopByBrand_jsx-node_modules_mui_material_utils_requirePropFactory_js.chunk.js',
    '/static/img/ImageWyld.5f0883f6179123711efa.webp',
    '/static/js/vendors-node_modules_mui_material_Collapse_Collapse_js.chunk.js',
    '/static/js/src_components_DropDownMenu_jsx.chunk.js',
    '/static/js/vendors-node_modules_mui_material_utils_createSvgIcon_js-node_modules_mui_material_utils_useC-5daa6b.chunk.js',
    '/static/js/vendors-node_modules_mui_icons-material_ThumbUp_js-node_modules_mui_material_Zoom_Zoom_js.chunk.js',
    '/static/js/src_pages_AgeVerification_jsx.chunk.js',
    '/static/js/src_pages_Home_jsx.chunk.js',
    '/static/js/src_pages_Footer_jsx.chunk.js',
    '',
    '/static/js/vendors-node_modules_mui_material_FormControl_FormControl_js-node_modules_mui_material_InputL-0768e8.chunk.js',
    '/static/js/vendors-node_modules_mui_material_Grid_Grid_js.chunk.js',
    '/static/js/vendors-node_modules_mui_material_Tab_Tab_js-node_modules_mui_material_Tabs_Tabs_js.chunk.js',
    '/static/js/src_components_QuickView_jsx.chunk.js',
    '/static/js/vendors-node_modules_mui_material_TextField_TextField_js.chunk.js',
    '/static/js/vendors-node_modules_axios_lib_axios_js.chunk.js',
    '/static/js/src_pages_Shop_jsx.chunk.js',
    '/static/js/node_modules_mui_material_utils_unsupportedProp_js.chunk.js',
    '/static/js/vendors-node_modules_mui_material_Alert_Alert_js-node_modules_mui_material_InputAdornment_Inp-55dcda.chunk.js',
    '/static/js/vendors-node_modules_mui_material_Checkbox_Checkbox_js.chunk.js',
    '/static/js/vendors-node_modules_mui_icons-material_Visibility_js-node_modules_mui_icons-material_Visibil-15265d.chunk.js',
    '/static/js/src_pages_LoginPage_jsx.chunk.js',
    '/static/js/vendors-node_modules_mui_icons-material_Visibility_js-node_modules_mui_icons-material_Visibil-233c6f.chunk.js',
    '/static/js/src_pages_RegistrationPage_jsx.chunk.js',
    '/static/js/src_components_Cart_jsx.chunk.js',

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
    const apiUrl = '/api/';

    if (event.request.url.includes(apiUrl)) {
        // For API requests, fetch from network every time (no caching)
        event.respondWith(fetch(event.request));
    } else {
        // For non-API requests, try to serve from cache, then network as fallback
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request)
                        .then(fetchResponse => {
                            return caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, fetchResponse.clone());
                                    return fetchResponse;
                                });
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
});