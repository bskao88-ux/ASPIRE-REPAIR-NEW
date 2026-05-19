importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB6_AsJKdJgJz6K051dF55gsNh1KPxXJB8",
  authDomain: "aspire-9990e.firebaseapp.com",
  projectId: "aspire-9990e",
  storageBucket: "aspire-9990e.firebasestorage.app",
  messagingSenderId: "390644024179",
  appId: "1:390644024179:web:a2a32d589f15f4b3d1fb06"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/ASPIRE-REPAIR-NEW/icon-192x192.png',
    badge: '/ASPIRE-REPAIR-NEW/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: { url: '/ASPIRE-REPAIR-NEW/' }
  });
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
