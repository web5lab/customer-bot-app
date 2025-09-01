// Firebase messaging service worker for web push notifications
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyAuT8Sq8C3eBATne5HyaBc07NKyqWcHUNE",
  authDomain: "yu-gi-no.firebaseapp.com",
  projectId: "yu-gi-no",
  storageBucket: "yu-gi-no.firebasestorage.app",
  messagingSenderId: "433766135979",
  appId: "1:433766135979:android:de5dc3c61ee6273b2c1fee"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  const notificationTitle = payload.notification.title || 'CustomerBot';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'customerbot-notification',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked: ', event);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Open the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise, open a new window
      if (clients.openWindow) {
        const urlToOpen = event.notification.data?.url || '/';
        return clients.openWindow(self.location.origin + urlToOpen);
      }
    })
  );
});