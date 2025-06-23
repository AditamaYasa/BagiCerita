import { subscribeNotification, unsubscribeNotification, VAPID_PUBLIC_KEY } from "../data/api";

export async function activatePushNotification() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Akses notifikasi tidak diberikan.");
    return;
  }

  const swRegistration = await navigator.serviceWorker.ready;
  const currentSubscription = await swRegistration.pushManager.getSubscription();

  if (currentSubscription) {
    alert("Kamu sudah mengaktifkan notifikasi sebelumnya.");
    return;
  }

  const newSubscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUintArray(VAPID_PUBLIC_KEY),
  });

  await subscribeNotification({
    endpoint: newSubscription.endpoint,
    keys: newSubscription.toJSON().keys,
  });

  alert("Notifikasi berhasil diaktifkan!");
}

export async function deactivatePushNotification() {
  const swRegistration = await navigator.serviceWorker.ready;
  const subscription = await swRegistration.pushManager.getSubscription();

  if (!subscription) {
    alert("Belum ada notifikasi yang aktif.");
    return;
  }

  await unsubscribeNotification({ endpoint: subscription.endpoint });
  await subscription.unsubscribe();

  alert("Notifikasi berhasil dimatikan.");
}

function convertBase64ToUintArray(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const binary = window.atob(base64);
  return Uint8Array.from([...binary].map((char) => char.charCodeAt(0)));
}
