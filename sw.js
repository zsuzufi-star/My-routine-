// Service Worker – Daily Routine PWA
const CACHE = 'routine-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./index.html'])));
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// Listen for notification schedule messages from the page
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFICATIONS') {
    scheduleAll(e.data.prayers, e.data.reminders);
  }
});

function scheduleAll(prayers, reminders) {
  // Clear old timers by storing in a simple array approach
  const now = Date.now();
  const today = new Date();

  const allAlerts = [...prayers, ...reminders];

  allAlerts.forEach(item => {
    const [h, m] = item.time24.split(':').map(Number);
    const fireTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m, 0).getTime();
    const delay = fireTime - now;

    if (delay > 0 && delay < 86400000) { // only future times today
      setTimeout(() => {
        self.registration.showNotification(item.title, {
          body: item.body,
          icon: './icon.png',
          badge: './icon.png',
          tag: item.tag || item.title,
          renotify: true,
          vibrate: [200, 100, 200],
          data: { url: './' }
        });
      }, delay);
    }
  });
}

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(cs => {
    if (cs.length) return cs[0].focus();
    return clients.openWindow('./');
  }));
});
