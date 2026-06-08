import { AlertTriangle, Activity } from "lucide-react";
import type { Alert } from "@/types";

export function AlertBanner({ alert }: { alert: Alert }) {
  return (
    <div className="surface glow-danger relative overflow-hidden border-danger/40 p-5">
      <div className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-danger/15 text-danger">
          <AlertTriangle className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="pill bg-danger/15 text-danger">
            <Activity className="size-3" /> HIGH RISK AREA
          </span>
          <h2 className="mt-1.5 truncate text-xl font-bold">{alert.title}</h2>
          <p className="text-sm text-muted-foreground">{alert.message}</p>
        </div>
        <p className="shrink-0 self-start text-xs text-muted-foreground max-md:hidden">
          Updated {alert.updatedAgo}
        </p>
      </div>
    </div>
  );
}
