importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase 設定由主頁面透過 postMessage 傳入
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'FIREBASE_CONFIG') {
    firebase.initializeApp(e.data.config);
    firebase.messaging().onBackgroundMessage(payload => {
      const { title, body } = payload.notification;
      self.registration.showNotification(title, {
        body,
        icon: '/ASPIRE-REPAIR-NEW/icon-192x192.png',
        badge: '/ASPIRE-REPAIR-NEW/icon-72x72.png',
        vibrate: [200, 100, 200]
      });
    });
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('ASPIRE-REPAIR-NEW') && 'focus' in client) return client.focus();
      }
      return clients.openWindow('/ASPIRE-REPAIR-NEW/');
    })
  );
});

const CACHE_NAME = 'aspire-repair-v2';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(['/ASPIRE-REPAIR-NEW/', '/ASPIRE-REPAIR-NEW/index.html'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
