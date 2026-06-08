"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { useRole } from "@/components/providers/role-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3;
const STEP_LABELS = ["Identity", "Verification", "Authenticate"];

export default function OfficerAccessPage() {
  const router = useRouter();
  const { setRole } = useRole();
  const [step, setStep] = useState<Step>(0);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => setStep(3), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <ShieldAlert className="size-6" />
        </span>
        <h1 className="mt-3 text-2xl font-bold">Emergency Officer Access</h1>
        <p className="text-sm text-muted-foreground">
          Secure, multi-step verification for authorized responders.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span className={cn(
              "flex size-7 items-center justify-center rounded-full text-xs font-semibold",
              i < step || step === 3 ? "bg-gold text-black" : i === step ? "bg-gold/20 text-gold ring-2 ring-gold" : "bg-secondary text-muted-foreground"
            )}>
              {i < step || step === 3 ? <CheckCircle2 className="size-4" /> : i + 1}
            </span>
            <span className={cn("text-sm", i === step ? "font-medium" : "text-muted-foreground")}>{label}</span>
            {i < STEP_LABELS.length - 1 && <span className="h-px w-6 bg-border" />}
          </div>
        ))}
      </div>

      <div className="surface p-6">
        {step === 0 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(1); }} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Officer ID</span>
              <input required placeholder="e.g. EO-SG-0481" className="mt-1.5 w-full rounded-xl border border-input bg-input/30 px-3 py-2.5 text-sm outline-none" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Organization</span>
              <select className="mt-1.5 w-full rounded-xl border border-input bg-input/30 px-3 py-2.5 text-sm outline-none">
                <option>Ministry of Health (MOH)</option>
                <option>Singapore Civil Defence Force (SCDF)</option>
                <option>National Environment Agency (NEA)</option>
                <option>Hospital Emergency Department</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium">Access Passphrase</span>
              <input required type="password" placeholder="Enter your secure passphrase" className="mt-1.5 w-full rounded-xl border border-input bg-input/30 px-3 py-2.5 text-sm outline-none" />
            </label>
            <Button type="submit" size="lg" className="h-12 w-full bg-gold text-black text-base hover:bg-gold/90">
              Continue <ArrowRight className="size-5" />
            </Button>
          </form>
        )}

        {step === 1 && (
          <div className="space-y-5 text-center">
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit verification code sent to your registered device.
            </p>
            <div className="flex justify-center gap-2">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  value={d}
                  inputMode="numeric"
                  maxLength={1}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/, "");
                    setOtp((prev) => prev.map((x, j) => (j === i ? v : x)));
                    if (v && i < 5) otpRefs.current[i + 1]?.focus();
                  }}
                  className="size-12 rounded-xl border border-input bg-input/30 text-center text-lg font-semibold outline-none focus-visible:border-gold"
                />
              ))}
            </div>
            <Button
              size="lg"
              onClick={() => setStep(2)}
              disabled={otp.join("").length < 6}
              className="h-12 w-full bg-gold text-black text-base hover:bg-gold/90"
            >
              Verify Code
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Loader2 className="size-10 animate-spin text-gold" />
            <p className="font-medium">Authenticating…</p>
            <p className="text-sm text-muted-foreground">Verifying credentials and clearance level.</p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <ShieldCheck className="size-14 text-success" />
            <h2 className="text-xl font-bold">Access Granted</h2>
            <p className="text-sm text-muted-foreground">
              Welcome, Officer. You now have access to emergency management features.
            </p>
            <Button
              size="lg"
              onClick={() => { setRole("officer"); router.push("/officer/dashboard"); }}
              className="mt-2 h-12 w-full bg-gold text-black text-base hover:bg-gold/90"
            >
              Go to Officer Dashboard <ArrowRight className="size-5" />
            </Button>
          </div>
        )}

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3" /> All access is logged and monitored for security.
        </p>
      </div>
    </div>
  );
}
