import { getAreaRanks } from "@/lib/data";
import { severityDot } from "@/lib/ui";

export function AreaRanking() {
  const ranks = getAreaRanks();
  const max = Math.max(...ranks.map((r) => r.cases));
  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Areas by Active Cases</h3>
        <button className="text-sm font-medium text-info hover:underline">View All</button>
      </div>

      <ul className="mt-4 space-y-3">
        {ranks.map((r) => (
          <li key={r.area} className="flex items-center gap-3">
            <span className="w-4 text-sm font-semibold text-muted-foreground">{r.rank}</span>
            <span className="w-28 truncate text-sm">{r.area}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full ${severityDot[r.severity]}`}
                style={{ width: `${(r.cases / max) * 100}%` }}
              />
            </div>
            <span className="w-10 text-right text-sm font-medium">{r.cases}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">Ranking updated 5 min ago</p>
    </div>
  );
}
