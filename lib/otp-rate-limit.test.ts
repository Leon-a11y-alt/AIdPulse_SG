// Unit tests for the OTP send throttle (lib/otp-rate-limit.ts).
//
// This is the anti-abuse gate in front of Twilio: every SMS costs money, so a
// bug here is a billing incident, not a cosmetic defect. The rules under test
// are the ones app/api/otp/send/route.ts relies on:
//
//   • at most one code per key every 30 seconds
//   • at most 5 codes per key per rolling hour
//   • the hour window resets once it has elapsed
//   • keys (phone + IP) are independent of each other
//
// Time is driven with the test runner's mock clock, so the whole suite runs in
// milliseconds instead of really waiting an hour. Each test uses its own key so
// the module-level bucket map cannot leak state between tests.

import { test, describe, mock } from "node:test";
import assert from "node:assert/strict";

import { canSend } from "./otp-rate-limit.ts";

const T0 = 1_760_000_000_000; // fixed epoch for the mocked clock
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

/** Reads the refusal reason without relying on control-flow narrowing. */
function reasonOf(g: { ok: true } | { ok: false; reason: string }): string {
  return g.ok ? "" : g.reason;
}

describe("canSend", () => {
  test("the first code for a new key is always allowed", () => {
    assert.equal(canSend("+6591234567:203.0.113.1").ok, true);
  });

  test("a second code within 30s is refused with a wait hint", () => {
    const key = "+6591234500:203.0.113.2";
    assert.equal(canSend(key).ok, true);

    const second = canSend(key);
    assert.equal(second.ok, false, "resend must be throttled");
    assert.match(reasonOf(second), /wait \d+s/i, "the user is told how long to wait");
  });

  test("waiting out the 30s gap allows the next code", () => {
    mock.timers.enable({ apis: ["Date"], now: T0 });
    try {
      const key = "gap-key";
      assert.equal(canSend(key).ok, true);

      mock.timers.tick(29 * SECOND);
      assert.equal(canSend(key).ok, false, "29s is still inside the gap");

      mock.timers.tick(2 * SECOND); // 31s since the send
      assert.equal(canSend(key).ok, true, "past 30s the next code is allowed");
    } finally {
      mock.timers.reset();
    }
  });

  test("at most 5 codes per key per hour, then refused", () => {
    mock.timers.enable({ apis: ["Date"], now: T0 });
    try {
      const key = "quota-key";

      // Five sends, each spaced past the 30s gap so only the hourly cap can bite.
      for (let i = 0; i < 5; i++) {
        assert.equal(canSend(key).ok, true, `send ${i + 1} of 5 should be allowed`);
        mock.timers.tick(31 * SECOND);
      }

      const sixth = canSend(key);
      assert.equal(sixth.ok, false, "the 6th code inside the hour is refused");
      assert.match(reasonOf(sixth), /too many/i);
    } finally {
      mock.timers.reset();
    }
  });

  test("the quota resets once the hour window has elapsed", () => {
    mock.timers.enable({ apis: ["Date"], now: T0 });
    try {
      const key = "window-key";

      for (let i = 0; i < 5; i++) {
        assert.equal(canSend(key).ok, true);
        mock.timers.tick(31 * SECOND);
      }
      assert.equal(canSend(key).ok, false, "quota exhausted inside the window");

      mock.timers.tick(HOUR + MINUTE); // roll past the 1-hour window
      assert.equal(canSend(key).ok, true, "a fresh window starts a fresh quota");
    } finally {
      mock.timers.reset();
    }
  });

  test("one abusive number cannot lock out everyone else", () => {
    mock.timers.enable({ apis: ["Date"], now: T0 });
    try {
      const abuser = "+6590000000:198.51.100.9";
      for (let i = 0; i < 5; i++) {
        canSend(abuser);
        mock.timers.tick(31 * SECOND);
      }
      assert.equal(canSend(abuser).ok, false, "the abusive key is throttled");

      // A different phone / IP pair is unaffected.
      assert.equal(canSend("+6598765432:198.51.100.10").ok, true);
    } finally {
      mock.timers.reset();
    }
  });
});
