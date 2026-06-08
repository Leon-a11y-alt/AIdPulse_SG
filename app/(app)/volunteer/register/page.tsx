"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  HeartHandshake,
  Lock,
  RefreshCw,
  Sparkles,
  Upload,
} from "lucide-react";
import { useRole } from "@/components/providers/role-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Stage = "form" | "review" | "success";

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-input bg-input/30 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring"
      />
    </label>
  );
}

export default function VolunteerRegisterPage() {
  const router = useRouter();
  const { setRole } = useRole();
  const [stage, setStage] = useState<Stage>("form");

  return (
    <div className="mx-auto max-w-2xl">
      {stage === "form" && (
        <div className="surface p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-success/15 text-success">
              <HeartHandshake className="size-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold">Volunteer Registration</h1>
              <p className="text-sm text-muted-foreground">
                Join our volunteer network and make a difference.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setStage("review"); }}
            className="mt-6 space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" placeholder="Enter your full name" required />
              <Field label="NRIC / FIN" placeholder="e.g. S1234567A" required />
              <Field label="Email Address" type="email" placeholder="Enter your email address" required />
              <Field label="Phone Number" placeholder="+65 your phone number" required />
              <Field label="Date of Birth" type="date" />
              <label className="block">
                <span className="text-sm font-medium">Gender</span>
                <select className="mt-1.5 w-full rounded-xl border border-input bg-input/30 px-3 py-2.5 text-sm outline-none">
                  <option>Select gender</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Prefer not to say</option>
                </select>
              </label>
            </div>

            <Field label="Address" placeholder="Enter your residential address" />

            <label className="block">
              <span className="text-sm font-medium">Skills &amp; Expertise (Optional)</span>
              <input
                placeholder="e.g. First Aid, Healthcare, Logistics, Teaching"
                className="mt-1.5 w-full rounded-xl border border-input bg-input/30 px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>

            <div>
              <span className="text-sm font-medium">Upload Certificates (Optional)</span>
              <div className="surface-muted mt-1.5 grid h-24 place-items-center text-sm text-muted-foreground">
                <span className="flex flex-col items-center gap-1">
                  <Upload className="size-5" /> Upload certificate(s)
                </span>
              </div>
            </div>

            <Button type="submit" size="lg" className="h-12 w-full text-base">
              <HeartHandshake className="size-5" /> Register as a Volunteer
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3" /> Your information is secure and only used for verification.
            </p>
          </form>
        </div>
      )}

      {stage === "review" && <AIReview onDone={() => setStage("success")} />}

      {stage === "success" && (
        <div className="surface p-8 text-center">
          <CheckCircle2 className="mx-auto size-16 text-success" />
          <h2 className="mt-4 text-2xl font-bold text-success">Registration Successful!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome to the AidPulse SG volunteer network.
          </p>

          <div className="mt-6 space-y-2 text-left">
            {[
              { t: "Access volunteer features", d: "Explore available opportunities and start contributing." },
              { t: "Stay updated", d: "We'll notify you about opportunities that match your skills." },
              { t: "Make an impact", d: "Your time and skills can help build a safer community." },
            ].map((x) => (
              <div key={x.t} className="surface-muted flex items-center gap-3 p-3 text-left">
                <CheckCircle2 className="size-5 shrink-0 text-success" />
                <div>
                  <p className="text-sm font-medium">{x.t}</p>
                  <p className="text-xs text-muted-foreground">{x.d}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            onClick={() => { setRole("volunteer"); router.push("/volunteer/dashboard"); }}
            className="mt-6 h-12 w-full bg-success text-success-foreground text-base hover:bg-success/90"
          >
            Go to Volunteer Dashboard <ArrowRight className="size-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

function AIReview({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => {
        if (p >= 100) {
          clearInterval(id);
          setTimeout(onDone, 600);
          return 100;
        }
        return p + 4;
      });
    }, 80);
    return () => clearInterval(id);
  }, [onDone]);

  const steps = ["Submitted", "Reviewing", "Approved"];
  const activeStep = pct >= 100 ? 2 : pct > 20 ? 1 : 0;

  return (
    <div className="surface p-8 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-info/15 text-info">
        <Sparkles className="size-6" />
      </span>
      <h2 className="mt-4 text-xl font-bold">Application Received!</h2>
      <p className="text-sm text-muted-foreground">
        AI Automated Review in Progress
      </p>

      {/* Progress ring */}
      <div className="relative mx-auto mt-6 size-28">
        <svg className="size-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" className="fill-none stroke-secondary" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="44"
            className="fill-none stroke-info transition-all"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-2xl font-bold">{pct}%</span>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                i <= activeStep ? "bg-info/15 text-info" : "bg-secondary text-muted-foreground"
              )}
            >
              {i < activeStep ? <CheckCircle2 className="size-3" /> : i === 1 ? <RefreshCw className="size-3 animate-spin" /> : <Bot className="size-3" />}
              {s}
            </span>
            {i < steps.length - 1 && <span className="h-px w-5 bg-border" />}
          </div>
        ))}
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3" /> Secure &amp; Private · AI-Powered Review · Fast &amp; Automated
      </p>
    </div>
  );
}
