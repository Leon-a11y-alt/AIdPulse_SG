"use client";

import { useState } from "react";
import { Camera, CheckCircle2, Clock, LogOut, MapPin, QrCode, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CheckinPage() {
  const [code, setCode] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
      {/* Scanner */}
      <section className="surface p-6">
        <h1 className="text-xl font-bold">Check-in / Check-out</h1>
        <p className="text-sm text-muted-foreground">
          Scan the mission QR code or enter the code manually.
        </p>

        <div className="relative mt-6 grid aspect-square place-items-center overflow-hidden rounded-2xl border border-dashed border-border bg-secondary/30">
          <div className="text-center text-muted-foreground">
            <Camera className="mx-auto size-10" />
            <p className="mt-2 text-sm">Camera permission required</p>
            <p className="text-xs">Point your camera at the mission QR code</p>
          </div>
          <ScanLine className="pointer-events-none absolute inset-x-10 top-1/2 size-auto text-info/40" />
          <span className="absolute inset-6 rounded-xl border-2 border-info/40" />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium">Or enter code manually</p>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. AID-4827"
              className="flex-1 rounded-xl border border-input bg-input/30 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button onClick={() => setCheckedIn(true)} disabled={!code.trim()} className="h-auto px-4">
              <QrCode className="size-4" /> Verify
            </Button>
          </div>
        </div>
      </section>

      {/* Active mission */}
      <section className="surface p-6">
        <p className="font-semibold">Current Mission</p>
        <div className="surface-muted mt-3 p-4">
          <p className="font-semibold">Dengue Fogging Support</p>
          <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><MapPin className="size-4" /> Tanjong Pagar CC</p>
            <p className="flex items-center gap-2"><Clock className="size-4" /> 27 May 2026 · 9:00 AM – 1:00 PM</p>
          </div>
        </div>

        <div className={cn(
          "mt-4 flex items-center gap-3 rounded-xl p-4 text-sm",
          checkedIn ? "bg-success/10 text-success" : "bg-secondary/40 text-muted-foreground"
        )}>
          <CheckCircle2 className="size-5" />
          {checkedIn ? "You are checked in. Have a safe mission!" : "Not checked in yet."}
        </div>

        <Button
          onClick={() => setCheckedIn((v) => !v)}
          size="lg"
          className={cn(
            "mt-4 h-12 w-full text-base",
            checkedIn ? "bg-secondary text-foreground hover:bg-secondary/80" : "bg-success text-success-foreground hover:bg-success/90"
          )}
        >
          {checkedIn ? <><LogOut className="size-5" /> Check Out</> : <><CheckCircle2 className="size-5" /> Check In</>}
        </Button>
      </section>
    </div>
  );
}
