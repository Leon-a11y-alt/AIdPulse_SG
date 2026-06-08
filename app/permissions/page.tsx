"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Info,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Toggle({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        on ? "bg-danger" : "bg-secondary"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
          on ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function PermissionsPage() {
  const router = useRouter();
  const [location, setLocation] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="relative min-h-dvh">
      <div className="glow-danger pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      <header className="relative z-10 px-8 py-6">
        <Logo />
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-[1300px] items-center gap-12 px-8 py-10 lg:grid-cols-2">
        {/* Illustration side */}
        <section className="text-center">
          <h1 className="text-3xl font-bold">We help keep you safe</h1>
          <div className="surface relative mt-8 grid place-items-center gap-6 p-10">
            <div className="flex size-28 items-center justify-center rounded-3xl bg-gradient-to-br from-danger to-info">
              <ShieldCheck className="size-14 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { icon: MapPin, label: "See Nearby Risks", c: "text-danger bg-danger/15" },
                { icon: Bell, label: "Get Important Alerts", c: "text-gold bg-gold/15" },
                { icon: Building2, label: "Find Nearby Hospitals", c: "text-info bg-info/15" },
                { icon: BadgeCheck, label: "Stay Informed", c: "text-success bg-success/15" },
              ].map((b) => (
                <div key={b.label} className="surface-muted flex items-center gap-2 p-3">
                  <span className={`flex size-8 items-center justify-center rounded-lg ${b.c}`}>
                    <b.icon className="size-4" />
                  </span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              We use these permissions to keep you informed and safe.
            </p>
          </div>
        </section>

        {/* Permissions side */}
        <section>
          <h2 className="text-2xl font-bold">Set up your emergency access</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Allow permissions to get started.
          </p>

          <div className="mt-6 space-y-3">
            <div className="surface flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-danger/15 text-danger">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">Location Access</p>
                  <p className="text-sm text-muted-foreground">
                    See nearby risks, hospitals &amp; volunteers
                  </p>
                </div>
              </div>
              <Toggle on={location} onToggle={() => setLocation((v) => !v)} />
            </div>

            <div className="surface flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <Bell className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get important alerts and updates
                  </p>
                </div>
              </div>
              <Toggle on={notifications} onToggle={() => setNotifications((v) => !v)} />
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => router.push("/dashboard")}
            className="mt-5 h-12 w-full text-base"
          >
            <CheckCircle2 className="size-5" /> Continue
          </Button>

          <p className="mt-3 text-center text-sm text-danger">Privacy Policy</p>

          <div className="surface-muted mt-4 flex items-start gap-3 p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-info" />
            Your information is used only for emergency alerts and nearby support.
          </div>
        </section>
      </main>
    </div>
  );
}
