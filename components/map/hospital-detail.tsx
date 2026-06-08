import { Building2, X } from "lucide-react";
import { bedSummary } from "@/lib/data";
import type { Hospital } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  limited: "Limited",
  full: "Full",
};
const STATUS_CLASS: Record<string, string> = {
  available: "bg-success/15 text-success",
  limited: "bg-warning/15 text-warning",
  full: "bg-danger/15 text-danger",
};
const BAR_CLASS: Record<string, string> = {
  available: "bg-success",
  limited: "bg-warning",
  full: "bg-danger",
};

export function HospitalDetail({
  hospital,
  onClose,
}: {
  hospital: Hospital;
  onClose: () => void;
}) {
  const b = bedSummary(hospital);
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-info/15 text-info">
            <Building2 className="size-5" />
          </span>
          <div>
            <p className="font-semibold leading-tight">{hospital.name}</p>
            <span className={`pill mt-1 ${STATUS_CLASS[b.status]}`}>
              {STATUS_LABEL[b.status]}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="surface-muted py-3">
          <p className="text-xl font-bold">{b.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="surface-muted py-3">
          <p className="text-xl font-bold text-danger">{b.occupied}</p>
          <p className="text-xs text-muted-foreground">Occupied</p>
        </div>
        <div className="surface-muted py-3">
          <p className="text-xl font-bold text-success">{b.available}</p>
          <p className="text-xs text-muted-foreground">Available</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-sm font-medium">Department Capacity</p>
        {hospital.departments.map((d) => {
          const avail = d.total - d.occupied;
          const ratio = avail / d.total;
          const status = ratio > 0.3 ? "available" : ratio > 0.1 ? "limited" : "full";
          return (
            <div key={d.name}>
              <div className="flex items-center justify-between text-sm">
                <span>{d.name}</span>
                <span className="text-muted-foreground">
                  {avail} / {d.total} free
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full ${BAR_CLASS[status]}`}
                  style={{ width: `${(d.occupied / d.total) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
