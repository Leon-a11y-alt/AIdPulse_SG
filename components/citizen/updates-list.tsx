import { ChevronRight, Newspaper } from "lucide-react";
import { getNewsUpdates } from "@/lib/data";

export function UpdatesList() {
  const updates = getNewsUpdates();
  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Latest Updates</h3>
        <button className="text-sm font-medium text-info hover:underline">View All</button>
      </div>

      <ul className="mt-4 divide-y divide-border">
        {updates.map((u) => (
          <li key={u.id}>
            <button className="flex w-full items-center gap-4 py-3 text-left transition-colors hover:bg-secondary/30">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <Newspaper className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {u.live && (
                    <span className="pill bg-danger/15 px-1.5 py-0 text-[10px] text-danger">LIVE</span>
                  )}
                  <p className="truncate font-medium">{u.title}</p>
                </div>
                <p className="truncate text-sm text-muted-foreground">{u.source}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{u.ago}</span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
