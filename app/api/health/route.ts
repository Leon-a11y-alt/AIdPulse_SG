// Health / readiness probe — the endpoint the CI pipeline and the post-deploy
// verification job call to prove the app really boots and serves traffic.
//
// A green unit-test run only proves the pieces work; this proves the assembled
// application answers over HTTP. CI starts the production server after
// `next build` and polls this route, and the CD workflow calls it again against
// the live URL after a deploy, so a broken deploy is caught by the pipeline
// rather than by a user.
//
// It deliberately reports only booleans about configuration — never a secret
// value — so it is safe to expose publicly.

import { NextResponse } from "next/server";

// Never prerender or cache: a cached "ok" would defeat the purpose.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const startedAt = Date.now();

const configured = (...vars: (string | undefined)[]) => vars.every((v) => Boolean(v && v.trim()));

export async function GET() {
  const body = {
    status: "ok" as const,
    service: "aidpulse-sg",
    // Set automatically by Vercel; the CI smoke test passes it in explicitly.
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_COMMIT_SHA ?? "unknown",
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    checkedAt: new Date().toISOString(),
    // Which integrations this instance is wired up for. Booleans only.
    integrations: {
      supabase: configured(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      ),
      twilioVerify: configured(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
        process.env.TWILIO_VERIFY_SERVICE_SID,
      ),
      emailOtp: configured(process.env.EMAIL_OTP_SECRET, process.env.N8N_EMAIL_WEBHOOK_URL),
      chatAssistant: configured(process.env.N8N_WEBHOOK_URL),
      certificateAi: configured(process.env.N8N_CERT_WEBHOOK_URL),
      webPush: configured(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY,
      ),
    },
  };

  return NextResponse.json(body, {
    status: 200,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
