import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { AlertBanner } from "@/components/citizen/alert-banner";
import { AreaRanking } from "@/components/citizen/area-ranking";
import { CaseTracking } from "@/components/citizen/case-tracking";
import { UpdatesList } from "@/components/citizen/updates-list";
import { VolunteerActions } from "@/components/volunteer/volunteer-actions";
import { getHighRiskAlert } from "@/lib/data";

export default function VolunteerDashboard() {
  return (
    <div className="space-y-6">
      <AlertBanner alert={getHighRiskAlert()} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <UpdatesList />
        <div className="space-y-6">
          <CaseTracking />
          <AreaRanking />
        </div>
      </div>

      <VolunteerActions />

      <Link href="/officer/access" className="surface flex items-center gap-4 p-5 transition-colors hover:border-gold/50">
        <span className="flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
          <ShieldAlert className="size-6" />
        </span>
        <div>
          <p className="font-semibold">Emergency Officer</p>
          <p className="text-sm text-muted-foreground">Register to access officer features</p>
        </div>
      </Link>
    </div>
  );
}
