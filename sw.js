const CACHE_NAME = 'depositpro-v12';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon.png',
    './css/styles.css',
    './js/app.js',
    './js/calculations.js',
    './lib/ionicons.js',
    './lib/ionicons.esm.js',
    './lib/jspdf.umd.min.js',
    './lib/jspdf.plugin.autotable.min.js',
    './lib/xlsx.full.min.js',
    './lib/svg/menu-outline.svg',
    './lib/svg/grid-outline.svg',
    './lib/svg/add-circle-outline.svg',
    './lib/svg/list-outline.svg',
    './lib/svg/notifications-outline.svg',
    './lib/svg/trending-up-outline.svg',
    './lib/svg/people-outline.svg',
    './lib/svg/calendar-outline.svg',
    './lib/svg/pie-chart-outline.svg',
    './lib/svg/bookmarks-outline.svg',
    './lib/svg/settings-outline.svg',
    './lib/svg/download-outline.svg',
    './lib/svg/document-text-outline.svg',
    './lib/svg/call-outline.svg',
    './lib/svg/arrow-back-outline.svg',
    './lib/svg/cloud-download-outline.svg',
    './lib/svg/cloud-upload-outline.svg',
    './lib/svg/lock-closed-outline.svg',
    './lib/svg/close-outline.svg'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    // Network-first for CSS & JS to ensure fresh styles apply immediately
    if (e.request.url.includes('.css') || e.request.url.includes('.js')) {
        e.respondWith(
            fetch(e.request).then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
                return response;
            }).catch(() => caches.match(e.request))
        );
    } else {
        e.respondWith(
            caches.match(e.request).then((response) => {
                return response || fetch(e.request);
            })
        );
    }
});
