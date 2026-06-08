"use client";

import Link from "next/link";
import { HeartHandshake, ShieldAlert } from "lucide-react";

/** "Register to access" cards on the citizen dashboard that lead into the
 *  volunteer / officer onboarding flows. */
export function RoleSwitchCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/volunteer/register"
        className="surface flex items-center gap-4 p-5 transition-colors hover:border-success/50"
      >
        <span className="flex size-12 items-center justify-center rounded-xl bg-success/15 text-success">
          <HeartHandshake className="size-6" />
        </span>
        <div>
          <p className="font-semibold">Volunteer</p>
          <p className="text-sm text-muted-foreground">
            Register to access volunteer features
          </p>
        </div>
      </Link>

      <Link
        href="/officer/access"
        className="surface flex items-center gap-4 p-5 transition-colors hover:border-gold/50"
      >
        <span className="flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <ShieldAlert className="size-6" />
        </span>
        <div>
          <p className="font-semibold">Emergency Officer</p>
          <p className="text-sm text-muted-foreground">
            Register to access officer features
          </p>
        </div>
      </Link>
    </div>
  );
}
