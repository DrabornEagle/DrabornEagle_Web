const dkdAnyelaCacheName = 'dkd-anyela-push-v1';

self.addEventListener('install', function dkdAnyelaServiceWorkerInstall(dkdEvent) {
  self.skipWaiting();
});

self.addEventListener('activate', function dkdAnyelaServiceWorkerActivate(dkdEvent) {
  dkdEvent.waitUntil(self.clients.claim());
});

self.addEventListener('push', function dkdAnyelaPushEvent(dkdEvent) {
  let dkdPayload = {};
  try {
    dkdPayload = dkdEvent.data ? dkdEvent.data.json() : {};
  } catch (dkdError) {
    dkdPayload = { title: 'Anyela Born Chat', body: 'Yeni mesaj geldi.' };
  }

  const dkdTitle = dkdPayload.title || 'Anyela Born Chat';
  const dkdOptions = {
    body: dkdPayload.body || 'Yeni mesaj geldi.',
    icon: dkdPayload.icon || '/AnyelaBorn/assets/dkd_anyela_push_icon.svg',
    badge: dkdPayload.badge || '/AnyelaBorn/assets/dkd_anyela_push_badge.svg',
    tag: dkdPayload.tag || 'dkd-anyela-chat',
    renotify: true,
    requireInteraction: false,
    silent: false,
    data: {
      url: dkdPayload.url || '/AnyelaBorn/ChatRoom/?v=push',
    },
    actions: [
      { action: 'dkd_open_chat', title: 'Sohbeti Aç' },
    ],
  };

  dkdEvent.waitUntil(self.registration.showNotification(dkdTitle, dkdOptions));
});

self.addEventListener('notificationclick', function dkdAnyelaNotificationClick(dkdEvent) {
  dkdEvent.notification.close();
  const dkdTargetUrl = new URL((dkdEvent.notification.data && dkdEvent.notification.data.url) || '/AnyelaBorn/ChatRoom/?v=push', self.location.origin).href;

  dkdEvent.waitUntil((async function dkdOpenClient() {
    const dkdClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const dkdClient of dkdClients) {
      if (dkdClient.url.includes('/AnyelaBorn/') && 'focus' in dkdClient) {
        await dkdClient.focus();
        if ('navigate' in dkdClient) {
          return dkdClient.navigate(dkdTargetUrl);
        }
        return;
      }
    }
    return self.clients.openWindow(dkdTargetUrl);
  })());
});
