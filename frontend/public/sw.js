self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/canaccesible_fav_icon.png',
      badge: '/canaccesible_fav_icon.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: data.url
      }
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      const url = event.notification.data.url || '/';
      // Check if there's an open client for our app
      // We look for any window client that is controlled by this SW or is in the same scope
      const openClient = clientList.find(client => 
        client.url.startsWith(self.location.origin) && 'focus' in client
      );
      
      if (openClient) {
        // Send message to navigate
        openClient.postMessage({ action: 'navigate', url: url });
        return openClient.focus();
      } else {
        // Open new window
        return clients.openWindow(url);
      }
    })
  );
});
