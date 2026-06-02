self.addEventListener('push', function dkd_anyela_push_received(dkd_event) {
  let dkd_payload = { title: 'Anyela Born', body: 'Yeni bildirim var.', url: '/AnyelaBorn/ChatRoom/' };
  try {
    if (dkd_event.data) {
      dkd_payload = Object.assign(dkd_payload, dkd_event.data.json());
    }
  } catch (dkd_error) {}

  const dkd_title = dkd_payload.title || 'Anyela Born';
  const dkd_options = {
    body: dkd_payload.body || 'Yeni mesaj var.',
    icon: '/AnyelaBorn/assets/dkd_anyela_root_9950_20260530.png',
    badge: '/AnyelaBorn/assets/dkd_anyela_root_9950_20260530.png',
    tag: dkd_payload.tag || 'dkd-anyela-message',
    renotify: true,
    requireInteraction: true,
    data: { url: dkd_payload.url || '/AnyelaBorn/ChatRoom/' },
    actions: [{ action: 'open', title: 'Aç' }]
  };

  dkd_event.waitUntil(self.registration.showNotification(dkd_title, dkd_options));
});

self.addEventListener('notificationclick', function dkd_anyela_push_click(dkd_event) {
  dkd_event.notification.close();
  const dkd_url = dkd_event.notification && dkd_event.notification.data && dkd_event.notification.data.url ? dkd_event.notification.data.url : '/AnyelaBorn/ChatRoom/';
  dkd_event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function dkd_anyela_match(dkd_clients) {
      for (const dkd_client of dkd_clients) {
        if (dkd_client.url.includes('/AnyelaBorn/') && 'focus' in dkd_client) {
          dkd_client.navigate(dkd_url);
          return dkd_client.focus();
        }
      }
      return clients.openWindow(dkd_url);
    })
  );
});
