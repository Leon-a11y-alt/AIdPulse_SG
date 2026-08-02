// Web Push client plumbing — registers the service worker and subscribes this
// device to broadcast notifications. Called after the user grants notification
// permission (permissions page). Degrades silently where push isn't supported
// (e.g. iPhone Safari tab that isn't installed to the Home Screen).

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

// The Push API wants the VAPID key as a Uint8Array. The explicit
// `<ArrayBuffer>` matters: PushSubscriptionOptions.applicationServerKey is a
// BufferSource, and a plain `Uint8Array` widens to `Uint8Array<ArrayBufferLike>`,
// which is not assignable to it.
function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    window.isSecureContext
  );
}

/**
 * Register the SW and subscribe this device to broadcasts. Returns what
 * happened so the UI can hint accordingly. Safe to call repeatedly — an
 * existing subscription is reused and re-synced to the server.
 */
export async function enableBroadcastPush(): Promise<"subscribed" | "unsupported" | "failed"> {
  if (!pushSupported() || !PUBLIC_KEY) return "unsupported";
  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    const sub =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
      }));
    const res = await fetch("/api/broadcast/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub.toJSON()),
    });
    return res.ok ? "subscribed" : "failed";
  } catch {
    return "failed";
  }
}
