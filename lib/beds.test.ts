// Unit tests for the officer → map bed-availability bridge (lib/beds.ts).
//
// When an Emergency Officer edits ward occupancy on /officer/beds, the map has
// to show the same numbers immediately: marker colour, occupancy %, available
// beds and the per-department bars are all derived here. A rounding or clamping
// bug in this file is a wrong bed count on an emergency map, so the arithmetic
// is pinned explicitly.
//
// localStorage is stubbed, so the browser seam is covered without a browser.

import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import type { Hospital } from "@/types";

import { applyBedOverride, applyBedOverrides, bedOverrideKey, readBedOverride } from "./beds.ts";

interface FakeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const globalWithWindow = globalThis as unknown as {
  window?: { localStorage: FakeStorage };
};

function useStorage(seed: Record<string, string> = {}): void {
  const map = new Map(Object.entries(seed));
  globalWithWindow.window = {
    localStorage: {
      getItem: (k) => map.get(k) ?? null,
      setItem: (k, v) => void map.set(k, v),
      removeItem: (k) => void map.delete(k),
    },
  };
}

/** Ng Teng Fong-shaped fixture: 30 beds, 15 occupied → 50% occupancy. */
function hospital(): Hospital {
  return {
    id: "ntfgh",
    name: "Ng Teng Fong General Hospital",
    lat: 1.3339,
    lng: 103.7436,
    occupancy: 50,
    totalBeds: 30,
    occupied: 15,
    available: 15,
    departments: [
      { name: "Emergency", total: 10, occupied: 5 },
      { name: "ICU", total: 20, occupied: 10 },
    ],
  };
}

describe("bedOverrideKey", () => {
  test("namespaces the key per hospital", () => {
    assert.equal(bedOverrideKey("ntfgh"), "aidpulse:beds:ntfgh");
    assert.notEqual(bedOverrideKey("ntfgh"), bedOverrideKey("sgh"));
  });
});

describe("readBedOverride", () => {
  afterEach(() => {
    delete globalWithWindow.window;
  });

  test("returns null when there is no window (server render)", () => {
    delete globalWithWindow.window;
    assert.equal(readBedOverride("ntfgh"), null);
  });

  test("returns null when the officer has not edited this hospital", () => {
    useStorage();
    assert.equal(readBedOverride("ntfgh"), null);
  });

  test("reads back the officer's saved counts", () => {
    useStorage({ "aidpulse:beds:ntfgh": JSON.stringify({ Emergency: 8 }) });
    assert.deepEqual(readBedOverride("ntfgh"), { Emergency: 8 });
  });

  test("corrupted storage returns null instead of throwing", () => {
    useStorage({ "aidpulse:beds:ntfgh": "{not-json" });
    assert.equal(readBedOverride("ntfgh"), null);
  });
});

describe("applyBedOverride", () => {
  beforeEach(() => useStorage());
  afterEach(() => {
    delete globalWithWindow.window;
  });

  test("a hospital with no officer edits is returned untouched", () => {
    const h = hospital();
    assert.equal(applyBedOverride(h), h, "no edits must not clone or recompute");
  });

  test("an edited ward recomputes totals, availability and occupancy", () => {
    useStorage({ "aidpulse:beds:ntfgh": JSON.stringify({ Emergency: 8 }) });

    const out = applyBedOverride(hospital());

    assert.equal(out.departments[0].occupied, 8, "the edited ward takes the new count");
    assert.equal(out.departments[1].occupied, 10, "untouched wards keep their count");
    assert.equal(out.totalBeds, 30);
    assert.equal(out.occupied, 18);
    assert.equal(out.available, 12);
    assert.equal(out.occupancy, 60);
  });

  test("occupancy is rounded to a whole percent", () => {
    useStorage({ "aidpulse:beds:ntfgh": JSON.stringify({ Emergency: 9 }) });

    // 19 of 30 beds = 63.33% → 63
    assert.equal(applyBedOverride(hospital()).occupancy, 63);
  });

  test("a count above capacity is clamped to the ward total", () => {
    useStorage({ "aidpulse:beds:ntfgh": JSON.stringify({ Emergency: 999 }) });

    const out = applyBedOverride(hospital());
    assert.equal(out.departments[0].occupied, 10, "never more occupied than beds exist");
    assert.equal(out.available, 10);
    assert.ok(out.occupancy <= 100);
  });

  test("a negative count is clamped to zero", () => {
    useStorage({ "aidpulse:beds:ntfgh": JSON.stringify({ Emergency: -4 }) });

    const out = applyBedOverride(hospital());
    assert.equal(out.departments[0].occupied, 0);
    assert.equal(out.occupied, 10);
    assert.equal(out.available, 20);
  });

  test("an override for a ward that no longer exists is ignored", () => {
    useStorage({ "aidpulse:beds:ntfgh": JSON.stringify({ Maternity: 3 }) });

    const out = applyBedOverride(hospital());
    assert.equal(out.departments.length, 2);
    assert.equal(out.occupied, 15, "the original counts are preserved");
  });

  test("the input hospital is never mutated", () => {
    useStorage({ "aidpulse:beds:ntfgh": JSON.stringify({ Emergency: 1 }) });

    const input = hospital();
    applyBedOverride(input);

    assert.equal(input.departments[0].occupied, 5);
    assert.equal(input.occupied, 15);
  });

  test("a hospital with no beds at all reports 0% instead of NaN", () => {
    useStorage({ "aidpulse:beds:empty": JSON.stringify({ Ward: 0 }) });

    const out = applyBedOverride({ ...hospital(), id: "empty", departments: [] });
    assert.equal(out.totalBeds, 0);
    assert.equal(out.occupancy, 0);
  });
});

describe("applyBedOverrides", () => {
  afterEach(() => {
    delete globalWithWindow.window;
  });

  test("applies edits across a list, leaving unedited hospitals alone", () => {
    useStorage({ "aidpulse:beds:ntfgh": JSON.stringify({ ICU: 20 }) });

    const other: Hospital = { ...hospital(), id: "sgh", name: "Singapore General Hospital" };
    const [edited, untouched] = applyBedOverrides([hospital(), other]);

    assert.equal(edited.occupied, 25);
    assert.equal(edited.occupancy, 83);
    assert.equal(untouched, other, "hospitals without edits pass straight through");
  });
});
