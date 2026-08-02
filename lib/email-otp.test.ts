// Unit tests for the stateless email-OTP token (lib/email-otp.ts).
//
// This module is the security seam of the volunteer e-mail verification flow:
// the 6-digit code is never stored and never leaves the server, so the ONLY
// thing standing between a user and a forged verification is the HMAC token.
// These tests pin that contract:
//
//   • a correct code + its own token verifies
//   • a wrong code, a foreign e-mail, or a tampered token does not
//   • the token is opaque (the code is not recoverable from it)
//   • codes expire after the 10-minute TTL
//   • malformed input returns an error instead of throwing (no 500s)
//
// Zero-dependency: Node's built-in test runner + native TypeScript type
// stripping. Run with `npm test`.

import { test, describe, mock } from "node:test";
import assert from "node:assert/strict";

// Must be set before the first call (the module reads it lazily, per call).
process.env.EMAIL_OTP_SECRET = "ci-test-secret-0123456789abcdef";

import {
  generateCode,
  isEmailOtpConfigured,
  makeToken,
  verifyToken,
} from "./email-otp.ts";

const EMAIL = "volunteer@example.com";
const CODE = "042317";

/** Reads the failure reason without relying on control-flow narrowing. */
function reasonOf(r: { ok: true } | { ok: false; reason: string }): string {
  return r.ok ? "" : r.reason;
}

describe("isEmailOtpConfigured", () => {
  test("true only when a long-enough secret is present", () => {
    const saved = process.env.EMAIL_OTP_SECRET;
    try {
      process.env.EMAIL_OTP_SECRET = saved;
      assert.equal(isEmailOtpConfigured(), true);

      process.env.EMAIL_OTP_SECRET = "too-short";
      assert.equal(isEmailOtpConfigured(), false, "a <16 char secret is not usable");

      delete process.env.EMAIL_OTP_SECRET;
      assert.equal(isEmailOtpConfigured(), false, "no secret means no e-mail OTP");
    } finally {
      process.env.EMAIL_OTP_SECRET = saved;
    }
  });
});

describe("generateCode", () => {
  test("always returns exactly six digits, leading zeros kept", () => {
    for (let i = 0; i < 500; i++) {
      const code = generateCode();
      assert.match(code, /^\d{6}$/, `bad code: ${code}`);
    }
  });

  test("is not a constant (CSPRNG, not a fixed demo code)", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 50; i++) seen.add(generateCode());
    assert.ok(seen.size > 1, "generateCode must not return the same code every time");
  });
});

describe("verifyToken — the happy path", () => {
  test("the code we issued the token for is accepted", () => {
    const token = makeToken(EMAIL, CODE);
    assert.equal(verifyToken(EMAIL, CODE, token).ok, true);
  });

  test("the same token can be presented twice (stateless by design)", () => {
    const token = makeToken(EMAIL, CODE);
    assert.equal(verifyToken(EMAIL, CODE, token).ok, true);
    assert.equal(verifyToken(EMAIL, CODE, token).ok, true);
  });
});

describe("verifyToken — rejection paths", () => {
  test("a wrong code is rejected", () => {
    const token = makeToken(EMAIL, CODE);
    const res = verifyToken(EMAIL, "000000", token);
    assert.equal(res.ok, false);
    assert.equal(reasonOf(res), "Incorrect code.");
  });

  test("a token issued for another e-mail does not verify", () => {
    const token = makeToken("attacker@example.com", CODE);
    const res = verifyToken(EMAIL, CODE, token);
    assert.equal(res.ok, false);
    assert.equal(reasonOf(res), "Incorrect code.");
  });

  test("a tampered signature is rejected", () => {
    const token = makeToken(EMAIL, CODE);
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    // Flip the last hex character of the signature (keeps the length identical,
    // so this also exercises the timingSafeEqual path rather than the guard).
    const flipped = decoded.slice(0, -1) + (decoded.endsWith("a") ? "b" : "a");
    const tampered = Buffer.from(flipped).toString("base64url");

    const res = verifyToken(EMAIL, CODE, tampered);
    assert.equal(res.ok, false);
    assert.equal(reasonOf(res), "Incorrect code.");
  });

  test("a token with no separator is reported as malformed, not a crash", () => {
    const noDot = Buffer.from("definitely-not-a-token").toString("base64url");
    const res = verifyToken(EMAIL, CODE, noDot);
    assert.equal(res.ok, false);
    assert.equal(reasonOf(res), "Malformed token.");
  });

  test("a non-numeric expiry is reported as malformed", () => {
    const junk = Buffer.from("not-a-number.deadbeef").toString("base64url");
    const res = verifyToken(EMAIL, CODE, junk);
    assert.equal(res.ok, false);
    assert.equal(reasonOf(res), "Malformed token.");
  });

  test("a signature of the wrong length cannot crash timingSafeEqual", () => {
    const short = Buffer.from(`${Date.now() + 60_000}.abc`).toString("base64url");
    const res = verifyToken(EMAIL, CODE, short);
    assert.equal(res.ok, false);
    assert.equal(reasonOf(res), "Incorrect code.");
  });
});

describe("verifyToken — the token is opaque", () => {
  test("the 6-digit code is not recoverable from the token", () => {
    const token = makeToken(EMAIL, CODE);
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    assert.ok(!token.includes(CODE), "the raw token must not contain the code");
    assert.ok(!decoded.includes(CODE), "the decoded token must not contain the code");
    assert.ok(!decoded.includes(EMAIL), "the decoded token must not contain the e-mail");
  });
});

describe("verifyToken — expiry", () => {
  test("valid inside the 10-minute TTL, expired after it", () => {
    mock.timers.enable({ apis: ["Date"], now: 1_760_000_000_000 });
    try {
      const token = makeToken(EMAIL, CODE);

      mock.timers.tick(9 * 60 * 1000); // 9 minutes later — still inside the TTL
      assert.equal(verifyToken(EMAIL, CODE, token).ok, true);

      mock.timers.tick(2 * 60 * 1000); // 11 minutes total — past the TTL
      const res = verifyToken(EMAIL, CODE, token);
      assert.equal(res.ok, false);
      assert.match(reasonOf(res), /expired/i);
    } finally {
      mock.timers.reset();
    }
  });
});
