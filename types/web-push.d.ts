// Ambient types for the `web-push` package, which ships no type declarations.
//
// Without this, `import webpush from "web-push"` is an implicit `any`, which
// meant the whole project could not be type-checked — the reason
// next.config.ts had to disable type gating for the production build. Declaring
// only the surface the app actually uses (app/api/broadcast/send/route.ts)
// keeps the CI type-check gate honest without adding a dependency.

declare module "web-push" {
  /** The browser PushSubscription as stored in app/api/broadcast/store.ts. */
  export interface PushSubscription {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  }

  export interface SendResult {
    statusCode: number;
    body: string;
    headers: Record<string, string>;
  }

  /** Thrown/rejected by sendNotification; 404/410 means the device is gone. */
  export interface WebPushError extends Error {
    statusCode: number;
    body: string;
    endpoint: string;
  }

  export interface RequestOptions {
    TTL?: number;
    urgency?: "very-low" | "low" | "normal" | "high";
    topic?: string;
    headers?: Record<string, string>;
  }

  export function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string,
  ): void;

  export function sendNotification(
    subscription: PushSubscription,
    payload?: string | Buffer | null,
    options?: RequestOptions,
  ): Promise<SendResult>;

  export function generateVAPIDKeys(): { publicKey: string; privateKey: string };

  const webpush: {
    setVapidDetails: typeof setVapidDetails;
    sendNotification: typeof sendNotification;
    generateVAPIDKeys: typeof generateVAPIDKeys;
  };

  export default webpush;
}
