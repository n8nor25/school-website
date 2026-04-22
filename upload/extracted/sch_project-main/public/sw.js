const CACHE_NAME = 'alsharq-academia-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add other static assets
  '/images/slider/slide1.jpg',
  '/images/slider/slide2.jpg',
  '/images/slider/slide3.jpg',
  '/images/slider/slide4.jpg',
  '/images/slider/slide5.jpg',
  '/images/slider/slide6.jpg',
  '/images/slider/slide7.jpg',
  '/images/slider/slide8.jpg',
  '/images/slider/slide9.jpg',
  '/images/slider/slide10.jpg',
  '/images/slider/slide40.jpg',
  '/images/slider/slide42.jpg',
  '/images/slider/7.jpg',
  '/images/gallery/gallery1.jpg',
  '/images/gallery/gallery2.jpg',
  '/images/gallery/gallery3.jpg',
  '/images/gallery/gallery4.jpg',
  '/images/gallery/gallery5.jpg',
  '/images/gallery/gallery6.jpg',
  '/images/gallery/gallery7.jpg',
  '/images/gallery/gallery8.jpg',
  '/images/tutor/tutor1.jpg',
  '/images/tutor/tutor2.jpg',
  '/images/tutor/tutor3.jpg',
  '/images/tutor/tutor4.jpg',
  '/images/tutor/tutor5.jpg',
  '/images/tutor/tutor6.jpg',
  '/images/tutor/tutor7.jpg',
  '/images/tutor/tutor8.jpg',
  '/images/tutor/tutor9.jpg',
  '/images/events/event1.jpg',
  '/images/events/event2.jpg',
  '/images/events/event3.jpg',
  '/images/events/event4.jpg',
  '/images/events/event5.jpg',
  '/images/events/event6.jpg',
  '/images/events/event8.jpg',
  '/images/events/event12.jpg',
  '/images/events/event13.3jpg',
  '/images/events/event14.jpg',
  '/images/events/event15.jpg',
  '/images/events/event16.jpg',
  '/images/events/event96.jpg',
  '/videos/v1.mp4',
  '/schedule/فصول.pdf',
  '/schedule/معلمين.pdf'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Service Worker: Cache failed', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }
        
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // If both cache and network fail, show offline page
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync');
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event received');
  
  const options = {
    body: event.data ? event.data.text() : 'إشعار جديد من أكاديمية الشرق',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'عرض',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('أكاديمية الشرق', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Implement background sync logic here
    console.log('Service Worker: Background sync completed');
  } catch (error) {
    console.log('Service Worker: Background sync failed', error);
  }
}
