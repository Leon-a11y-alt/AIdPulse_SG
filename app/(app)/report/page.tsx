"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Crosshair,
  ImagePlus,
  Lock,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useRole } from "@/components/providers/role-provider";
import { Button } from "@/components/ui/button";
import { getReportTypes } from "@/lib/data";
import { roleLabel } from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { ReportTypeId } from "@/types";

const REMINDERS = [
  { icon: ShieldCheck, title: "Be Accurate", desc: "Provide accurate information to help us respond effectively." },
  { icon: Lock, title: "Stay Private", desc: "Your reports are kept confidential and safe." },
  { icon: AlertCircle, title: "Help Cut Rumors", desc: "Your report can help prevent the spread and save lives." },
];

export default function ReportPage() {
  const { role } = useRole();
  const types = getReportTypes();
  const [selected, setSelected] = useState<ReportTypeId | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mx-auto mt-16 max-w-md text-center">
        <div className="surface p-10">
          <CheckCircle2 className="mx-auto size-14 text-success" />
          <h2 className="mt-4 text-2xl font-bold">Report Submitted</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you for helping protect the community. Responders have been notified.
          </p>
          <Button className="mt-6" onClick={() => { setSubmitted(false); setSelected(null); }}>
            Submit another report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <section className="surface p-6">
        <h1 className="text-2xl font-bold">Report to Help Protect Our Community</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {roleLabel[role]} report · helps us take action and keep everyone safe.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="mt-6 space-y-6"
        >
          <div>
            <p className="mb-2 text-sm font-medium">1. Report Type</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelected(t.id)}
                  className={cn(
                    "surface-muted p-4 text-left transition-colors",
                    selected === t.id ? "border-danger bg-danger/5" : "hover:border-border/80"
                  )}
                >
                  <Stethoscope className="size-5 text-danger" />
                  <p className="mt-2 font-medium">{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">2. Location</p>
            <div className="flex gap-2">
              <input
                placeholder="Enter location or select on map"
                className="flex-1 rounded-xl border border-input bg-input/30 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button type="button" variant="outline" className="h-auto gap-2 px-3">
                <Crosshair className="size-4" /> Use My Location
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">3. Details</p>
            <textarea
              rows={4}
              placeholder="Please provide more details (symptoms, when it started, etc.)"
              className="w-full rounded-xl border border-input bg-input/30 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">4. Add Photos (Optional)</p>
              <div className="surface-muted grid h-24 place-items-center text-sm text-muted-foreground">
                <span className="flex flex-col items-center gap-1">
                  <ImagePlus className="size-5" /> Click to upload photos
                </span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">5. Contact Information (Optional)</p>
              <input
                placeholder="Phone number or email (optional)"
                className="w-full rounded-xl border border-input bg-input/30 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <Button type="submit" size="lg" disabled={!selected} className="h-12 w-full text-base">
            Submit Report
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            All reports are confidential and used for public health purposes only.
          </p>
        </form>
      </section>

      <aside className="space-y-6">
        <div className="surface p-5">
          <h3 className="font-semibold">What to Report</h3>
          <ul className="mt-3 space-y-3">
            {types.map((t) => (
              <li key={t.id} className="flex gap-3">
                <Stethoscope className="mt-0.5 size-4 shrink-0 text-danger" />
                <div>
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface p-5">
          <h3 className="font-semibold">Important Reminders</h3>
          <ul className="mt-3 space-y-3">
            {REMINDERS.map((r) => (
              <li key={r.title} className="flex gap-3">
                <r.icon className="mt-0.5 size-4 shrink-0 text-info" />
                <div>
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
