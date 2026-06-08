"use client";

import { useState } from "react";
import { BedDouble, Minus, Plus, Radio, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bedSummary, getHospitals } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types";

const SEVERITIES: Severity[] = ["critical", "high", "moderate", "low"];
const SEV_CLASS: Record<Severity, string> = {
  critical: "border-danger bg-danger/10 text-danger",
  high: "border-warning bg-warning/10 text-warning",
  moderate: "border-info bg-info/10 text-info",
  low: "border-success bg-success/10 text-success",
};

export default function BroadcastPage() {
  const hospitals = getHospitals();
  const [severity, setSeverity] = useState<Severity>("high");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [beds, setBeds] = useState<Record<string, number>>(
    Object.fromEntries(hospitals.map((h) => [h.id, bedSummary(h).available]))
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Broadcast */}
      <section className="surface p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-danger/15 text-danger">
            <Radio className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold">Broadcast Alert</h1>
            <p className="text-sm text-muted-foreground">Notify citizens in affected areas instantly.</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setSent(true); setMessage(""); }} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Target Area</span>
            <select className="mt-1.5 w-full rounded-xl border border-input bg-input/30 px-3 py-2.5 text-sm outline-none">
              <option>Tanjong Pagar</option>
              <option>Geylang</option>
              <option>Queenstown</option>
              <option>All Singapore</option>
            </select>
          </label>

          <div>
            <span className="text-sm font-medium">Severity</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                    severity === s ? SEV_CLASS[s] : "border-border text-muted-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Compose the alert citizens will receive…"
              className="mt-1.5 w-full rounded-xl border border-input bg-input/30 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>

          {sent && (
            <p className="rounded-xl bg-success/10 px-4 py-3 text-sm text-success">
              ✓ Broadcast sent to citizens in the selected area.
            </p>
          )}

          <Button type="submit" size="lg" disabled={!message.trim()} className="h-12 w-full text-base">
            <Send className="size-5" /> Send Broadcast
          </Button>
        </form>
      </section>

      {/* Bed management */}
      <section className="surface p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-info/15 text-info">
            <BedDouble className="size-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold">Hospital Bed Availability</h2>
            <p className="text-sm text-muted-foreground">Update real-time capacity for responders.</p>
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          {hospitals.map((h) => {
            const total = bedSummary(h).total;
            const available = beds[h.id];
            const adjust = (delta: number) =>
              setBeds((prev) => ({ ...prev, [h.id]: Math.max(0, Math.min(total, prev[h.id] + delta)) }));
            return (
              <li key={h.id} className="surface-muted flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{available} of {total} beds available</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => adjust(-1)} className="flex size-8 items-center justify-center rounded-lg border border-border hover:bg-secondary" aria-label="Decrease">
                    <Minus className="size-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{available}</span>
                  <button onClick={() => adjust(1)} className="flex size-8 items-center justify-center rounded-lg border border-border hover:bg-secondary" aria-label="Increase">
                    <Plus className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
