"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV === "development") return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silent: PWA should not break the app if SW fails.
    });
  }, []);

  return null;
}

