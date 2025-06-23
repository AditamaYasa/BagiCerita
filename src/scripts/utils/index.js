export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      await new Promise((resolve) => {
        if (document.readyState === "complete") {
          resolve();
        } else {
          window.addEventListener("load", resolve);
        }
      });

      console.log("Mendaftarkan service worker...");
      const reg = await navigator.serviceWorker.register("/sw.bundle.js", {
        type: "module",
      });

      console.log("Service worker registered:", reg);
    } catch (err) {
      console.error("Service worker registration failed:", err);
    }
  }
}

