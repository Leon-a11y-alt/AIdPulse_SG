"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Activity, BedDouble, HeartHandshake, Search, Target } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: Search, accent: "text-info bg-info/15", title: "Track Cases", desc: "Real-time health and incident updates" },
  { icon: BedDouble, accent: "text-success bg-success/15", title: "Hospital Beds", desc: "Live bed availability and wait times" },
  { icon: HeartHandshake, accent: "text-gold bg-gold/15", title: "Volunteer Efforts", desc: "Active volunteers and urgent tasks" },
];

export default function LandingPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="glow-danger pointer-events-none absolute inset-x-0 top-0 h-[420px]" />

      <header className="relative z-10 px-8 py-6">
        <Logo />
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-12 px-8 pb-16 lg:grid-cols-[1.3fr_1fr]">
        {/* Hero */}
        <section>
          <h1 className="text-5xl font-bold tracking-tight max-md:text-4xl">
            Welcome to AidPulse SG
          </h1>
          <p className="mt-3 text-xl font-medium text-info">
            All in one place. Faster Response.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="surface p-5">
                <span className={`flex size-11 items-center justify-center rounded-xl ${f.accent}`}>
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3 text-danger">
            <Activity className="size-6" />
            <div className="h-px flex-1 bg-gradient-to-r from-danger/60 to-transparent" />
          </div>
        </section>

        {/* Sign up */}
        <section className="surface w-full max-w-md justify-self-end p-8">
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your account to get started.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/permissions");
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-input bg-input/30 px-3 py-2.5">
                <span className="flex items-center gap-1.5 border-r border-border pr-2 text-sm text-muted-foreground">
                  🇸🇬 +65
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="8123 4567"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="h-12 w-full text-base">
              Sign Up
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2 px-8 py-4 text-sm">
          <Target className="size-4 text-danger" />
          <span className="font-semibold text-danger">Our Mission:</span>
          <span className="text-muted-foreground">
            Empower communities, strengthen response, and protect lives.
          </span>
        </div>
      </footer>
    </div>
  );
}
