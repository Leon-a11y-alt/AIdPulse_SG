// Unit tests for the certificate analyser + opportunity matcher
// (lib/certificate-ai.ts).
//
// Two things are pinned here:
//
//  1. analyzeLocally — the on-device fallback that runs whenever the Gemini
//     vision webhook is not configured or errors. It is what keeps volunteer
//     registration working in the demo, so its output shape and confidence
//     scale are a contract the UI depends on.
//  2. matchOpportunities — the ranking that powers the "Certificate Match" tab.
//     Ordering and the "why this matches you" reasons are user-visible.
//
// The skill store is exercised against a stubbed localStorage so the pure
// browser seam is covered without a browser.

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import type { Opportunity } from "@/types";

import {
  analyzeLocally,
  loadVolunteerSkills,
  matchOpportunities,
  saveVolunteerSkills,
} from "./certificate-ai.ts";

// ── A minimal localStorage stand-in ─────────────────────────────────────────

interface FakeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const globalWithWindow = globalThis as unknown as {
  window?: { localStorage: FakeStorage };
};

function makeStorage(seed: Record<string, string> = {}): FakeStorage {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

// ── Opportunity fixtures ────────────────────────────────────────────────────

function opportunity(over: Partial<Opportunity> & { id: string }): Opportunity {
  return {
    title: "Shift",
    org: "AidPulse SG",
    location: "Singapore",
    date: "Sat, 12 Jul",
    distanceKm: 8,
    roleType: "General Volunteer",
    skills: [],
    urgency: "flexible",
    ...over,
  };
}

const MEDICAL = opportunity({
  id: "opp-medical",
  title: "Hospital triage support",
  roleType: "Hospital Role",
  skills: ["First Aid", "Healthcare Support"],
  urgency: "urgent",
  distanceKm: 1.5,
});

const LOGISTICS = opportunity({
  id: "opp-logistics",
  title: "Supply depot packing",
  roleType: "Logistics",
  skills: ["Logistics"],
  urgency: "soon",
  distanceKm: 12,
});

const TEACHING = opportunity({
  id: "opp-teaching",
  title: "After-school tutoring",
  roleType: "Teaching",
  skills: ["Teaching"],
  distanceKm: 20,
});

const CERT_GATED = opportunity({
  id: "opp-cert",
  title: "Community health screening",
  roleType: "Healthcare Support",
  skills: ["Certificate required"],
  distanceKm: 30,
});

// ── analyzeLocally ──────────────────────────────────────────────────────────

describe("analyzeLocally", () => {
  test("recognises a First Aid / CPR certificate from the file name", () => {
    const result = analyzeLocally("First_Aid_CPR_AED_Certificate.pdf");

    assert.equal(result.file, "First_Aid_CPR_AED_Certificate.pdf");
    assert.equal(result.certification, "Standard First Aid Certificate");
    assert.deepEqual(result.skills, ["First Aid", "Healthcare Support"]);
    assert.equal(result.source, "on-device", "the fallback must label itself honestly");
    // Two rules matched (first aid + CPR/AED) → 0.6 + 2 × 0.15.
    assert.ok(
      Math.abs(result.confidence - 0.9) < 1e-9,
      `expected ~0.9 confidence, got ${result.confidence}`,
    );
  });

  test("skills are de-duplicated across overlapping rules", () => {
    const result = analyzeLocally("cpr_and_first_aid_and_first-aid.pdf");
    assert.deepEqual([...new Set(result.skills)], result.skills);
  });

  test("free-text hints are analysed alongside the file name", () => {
    const result = analyzeLocally("scan-0001.pdf", "5 years of warehouse and forklift work");

    assert.equal(result.certification, "Logistics / Operations Certification");
    assert.deepEqual(result.skills, ["Logistics"]);
  });

  test("an unrecognised certificate degrades to a low-confidence general result", () => {
    const result = analyzeLocally("holiday-photo.png");

    assert.equal(result.certification, "General certificate");
    assert.deepEqual(result.skills, ["General Volunteer"]);
    assert.equal(result.confidence, 0.4);
    assert.equal(result.source, "on-device");
  });

  test("confidence never exceeds the 0.95 ceiling", () => {
    const result = analyzeLocally("first_aid_nursing_logistics_teaching_food_hygiene.pdf");
    assert.equal(result.confidence, 0.95);
    assert.ok(result.skills.length > 1);
  });

  test("the reported file name is always the one that was analysed", () => {
    for (const name of ["a.pdf", "First Aid.png", "unknown-thing"]) {
      assert.equal(analyzeLocally(name).file, name);
    }
  });
});

// ── matchOpportunities ──────────────────────────────────────────────────────

describe("matchOpportunities", () => {
  const ALL = [MEDICAL, LOGISTICS, TEACHING, CERT_GATED];

  // Skill overlap is worth 3 points; urgency and proximity are worth 1 each,
  // and they score independently of skills. So an unrelated volunteer still
  // sees the urgent shift next door — just without a skill-match reason.
  test("an unrelated skill set surfaces only the urgent, nearby shift", () => {
    const matches = matchOpportunities(["Underwater Basket Weaving"], ALL, false);

    assert.deepEqual(matches.map((m) => m.opportunity.id), ["opp-medical"]);
    assert.equal(matches[0].score, 2, "urgency (1) + within 2 km (1), no skill points");
    assert.ok(
      !matches[0].reasons.some((r) => /Matches your/.test(r)),
      "nothing is claimed to match a skill the volunteer does not have",
    );
  });

  test("ranks the strongest skill overlap first", () => {
    const matches = matchOpportunities(["First Aid", "Healthcare Support", "Logistics"], ALL, false);

    assert.equal(matches[0].opportunity.id, "opp-medical");
    assert.ok(
      matches[0].score > matches[1].score,
      "a two-skill + urgent + nearby match must outrank a single-skill one",
    );
    assert.ok(
      !matches.some((m) => m.opportunity.id === "opp-teaching"),
      "unrelated opportunities are filtered out entirely",
    );
  });

  test("matching is case- and whitespace-insensitive", () => {
    const matches = matchOpportunities(["  logistics  "], [LOGISTICS], false);
    assert.equal(matches.length, 1);
    assert.equal(matches[0].opportunity.id, "opp-logistics");
  });

  test("the role type counts as a matchable skill", () => {
    const matches = matchOpportunities(["Hospital Role"], [MEDICAL], false);
    assert.equal(matches.length, 1);
    assert.match(matches[0].reasons[0], /Hospital Role/);
  });

  test("an uploaded certificate unlocks certificate-gated roles", () => {
    const without = matchOpportunities(["Healthcare Support"], [CERT_GATED], false);
    const with_ = matchOpportunities(["Healthcare Support"], [CERT_GATED], true);

    assert.ok(with_[0].score > without[0].score);
    assert.ok(
      with_[0].reasons.some((r) => /certificate unlocks/i.test(r)),
      "the volunteer is told why the role opened up",
    );
  });

  test("urgency and distance are surfaced as reasons", () => {
    const [top] = matchOpportunities(["First Aid"], [MEDICAL], false);

    assert.ok(top.reasons.some((r) => /urgently/i.test(r)), "urgent shifts say so");
    assert.ok(top.reasons.some((r) => /1\.5 km away/.test(r)), "nearby shifts show the distance");
  });

  test("a far, non-urgent match carries no distance or urgency reason", () => {
    const [only] = matchOpportunities(["Teaching"], [TEACHING], false);

    assert.equal(only.reasons.length, 1);
    assert.match(only.reasons[0], /Matches your Teaching skills/);
  });

  test("a brand-new volunteer with no skills still sees the urgent shift", () => {
    const matches = matchOpportunities([], ALL, false);

    assert.deepEqual(matches.map((m) => m.opportunity.id), ["opp-medical"]);
    assert.deepEqual(matches[0].reasons, [
      "Urgently needs volunteers today",
      "Only 1.5 km away",
    ]);
  });

  test("a far, non-urgent opportunity with no skill overlap is dropped", () => {
    assert.deepEqual(matchOpportunities([], [TEACHING, LOGISTICS, CERT_GATED], false), []);
  });
});

// ── The persisted skill profile ─────────────────────────────────────────────

describe("volunteer skill store", () => {
  beforeEach(() => {
    globalWithWindow.window = { localStorage: makeStorage() };
  });

  afterEach(() => {
    delete globalWithWindow.window;
  });

  test("skills survive a save → load round-trip", () => {
    saveVolunteerSkills(["First Aid", "Logistics"]);
    assert.deepEqual(loadVolunteerSkills(), ["First Aid", "Logistics"]);
  });

  test("duplicates are collapsed on save", () => {
    saveVolunteerSkills(["First Aid", "First Aid", "Logistics", "First Aid"]);
    assert.deepEqual(loadVolunteerSkills(), ["First Aid", "Logistics"]);
  });

  test("an empty store loads as an empty list, not a crash", () => {
    assert.deepEqual(loadVolunteerSkills(), []);
  });

  test("a corrupted store loads as an empty list, not a crash", () => {
    globalWithWindow.window = {
      localStorage: makeStorage({ "aidpulse:volunteer-skills": "{not json" }),
    };
    assert.deepEqual(loadVolunteerSkills(), []);
  });

  test("a blocked localStorage does not break registration", () => {
    globalWithWindow.window = {
      localStorage: {
        getItem: () => null,
        setItem: () => {
          throw new Error("QuotaExceededError");
        },
        removeItem: () => {},
      },
    };
    assert.doesNotThrow(() => saveVolunteerSkills(["First Aid"]));
    assert.deepEqual(loadVolunteerSkills(), []);
  });
});
