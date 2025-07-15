const CACHE_NAME = 'interactive-map-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/map-icon.svg',
    'https://unpkg.com/maplibre-gl@4.1.1/dist/maplibre-gl.css',
    'https://unpkg.com/maplibre-gl@4.1.1/dist/maplibre-gl.js',
    'https://unpkg.com/supercluster@8.0.1/dist/supercluster.min.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Handle map tiles separately for better caching
    if (event.request.url.includes('api.maptiler.com')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((response) => {
                    if (response) {
                        // Serve from cache
                        return response;
                    }
                    
                    // Fetch from network and cache
                    return fetch(event.request).then((response) => {
                        // Only cache successful responses
                        if (response.status === 200) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    }).catch(() => {
                        // Return a fallback for failed tile requests
                        return new Response('', {
                            status: 408,
                            statusText: 'Request timeout - offline'
                        });
                    });
                });
            })
        );
    } else {
        // Handle other requests
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    // Return cached version or fetch from network
                    return response || fetch(event.request);
                })
                .catch(() => {
                    // Fallback for offline scenarios
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                })
        );
    }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline actions (if supported)
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Handle background sync tasks
            console.log('Background sync triggered')
        );
    }
});

// Push notifications (if needed)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/map-icon.svg',
            badge: '/map-icon.svg',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});