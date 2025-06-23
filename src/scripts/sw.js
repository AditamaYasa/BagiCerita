import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  StaleWhileRevalidate,
  NetworkFirst,
  CacheFirst,
} from "workbox-strategies";

precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener("push", (event) => {
  console.log("📬 Notifikasi push diterima:", event);

  let notificationData = {
    title: "✨ Notifikasi Baru!",
    options: {
      body: "Ada info terbaru buat kamu 🎉",
      icon: "/icons/BagiCerita-512.png",
    },
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData.title = payload.title || notificationData.title;
      notificationData.options = {
        ...notificationData.options,
        ...payload.options,
      };
    } catch (err) {
      console.warn("⚠️ Gagal parsing data push:", err);
    }
  }

  if (Notification.permission === "granted") {
    event.waitUntil(
      self.registration.showNotification(
        notificationData.title,
        notificationData.options
      )
    );
  }
});

registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "my-app-html-cache",
    networkTimeoutSeconds: 5,
  })
);

registerRoute(
  ({ request }) =>
    ["style", "script", "worker"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "my-app-static-assets",
  })
);

registerRoute(
  ({ url }) =>
    url.origin.includes("unpkg.com") ||
    url.origin.includes("fonts.googleapis.com") ||
    url.origin.includes("fonts.gstatic.com"),
  new CacheFirst({
    cacheName: "external-lib-cache",
  })
);

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
  })
);
