import { Activity, TrendingUp } from "lucide-react";
import { getCaseStats } from "@/lib/data";
import { deltaText } from "@/lib/ui";

export function CaseTracking() {
  const s = getCaseStats();
  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Real-time Case Tracking</h3>
        <span className="pill bg-success/15 text-success">
          <span className="size-1.5 animate-pulse rounded-full bg-success" /> Live
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="surface-muted p-4">
          <div className="flex items-center gap-2 text-success">
            <Activity className="size-4" />
            <span className="text-xs font-medium text-muted-foreground">Active Cases</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{s.activeCases}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-success">
            <TrendingUp className="size-3" /> {deltaText(s.activeDelta)}
          </p>
        </div>
        <div className="surface-muted p-4">
          <div className="flex items-center gap-2 text-danger">
            <Activity className="size-4" />
            <span className="text-xs font-medium text-muted-foreground">Critical Cases</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{s.criticalCases}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-danger">
            <TrendingUp className="size-3" /> {deltaText(s.criticalDelta)}
          </p>
        </div>
      </div>
    </div>
  );
}
