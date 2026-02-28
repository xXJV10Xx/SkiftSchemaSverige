import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (import.meta.env.DEV) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silent: PWA should not break the app if SW fails.
    });
  }, []);

  return null;
}
