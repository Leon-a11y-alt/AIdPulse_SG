"use client";

import { useState } from "react";
import { Building2, Layers, MapPin } from "lucide-react";
import { AidMap } from "@/components/map/aid-map";
import { HospitalDetail } from "@/components/map/hospital-detail";
import { useRole } from "@/components/providers/role-provider";
import { bedSummary, getCaseMarkers, getHospitals } from "@/lib/data";
import { roleLabel, severityDot } from "@/lib/ui";
import type { Hospital } from "@/types";
import { cn } from "@/lib/utils";

const BED_DOT: Record<string, string> = {
  available: "bg-success",
  limited: "bg-warning",
  full: "bg-danger",
};

function Check({
  label,
  checked,
  onChange,
  dot,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  dot?: string;
}) {
  return (
    <button
      onClick={onChange}
      className="flex w-full items-center gap-2.5 py-1.5 text-left text-sm"
    >
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded border",
          checked ? "border-info bg-info" : "border-border"
        )}
      >
        {checked && <span className="size-1.5 rounded-sm bg-white" />}
      </span>
      {dot && <span className={cn("size-2 rounded-full", dot)} />}
      {label}
    </button>
  );
}

export default function MapPage() {
  const { role } = useRole();
  const cases = getCaseMarkers();
  const hospitals = getHospitals();
  const [showCases, setShowCases] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [selected, setSelected] = useState<Hospital | null>(null);

  return (
    <div className="grid h-[calc(100dvh-7rem)] grid-cols-[280px_1fr_320px] gap-4 max-lg:grid-cols-1 max-lg:h-auto">
      {/* Filters */}
      <aside className="surface flex flex-col gap-5 overflow-y-auto p-5 no-scrollbar">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">View</p>
          <p className="mt-1 text-sm">{roleLabel[role]} map</p>
        </div>

        <div>
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
            <Layers className="size-4" /> Map Layers
          </p>
          <Check label="Active Cases" checked={showCases} onChange={() => setShowCases((v) => !v)} />
          <Check label="Hospital Beds" checked={showHospitals} onChange={() => setShowHospitals((v) => !v)} />
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold">Case Severity</p>
          {(["critical", "high", "moderate", "low"] as const).map((s) => (
            <Check key={s} label={s[0].toUpperCase() + s.slice(1)} checked dot={severityDot[s]} onChange={() => {}} />
          ))}
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold">Hospital Status</p>
          {(["available", "limited", "full"] as const).map((s) => (
            <Check key={s} label={s[0].toUpperCase() + s.slice(1)} checked dot={BED_DOT[s]} onChange={() => {}} />
          ))}
        </div>
      </aside>

      {/* Map */}
      <div className="surface overflow-hidden p-0 max-lg:h-[60vh]">
        <AidMap
          cases={cases}
          hospitals={hospitals}
          showCases={showCases}
          showHospitals={showHospitals}
          onSelectHospital={setSelected}
        />
      </div>

      {/* Right: hospital list / detail */}
      <aside className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
        {selected ? (
          <HospitalDetail hospital={selected} onClose={() => setSelected(null)} />
        ) : (
          <div className="surface p-5">
            <p className="flex items-center gap-2 font-semibold">
              <Building2 className="size-4" /> Hospitals
            </p>
            <ul className="mt-3 space-y-2">
              {hospitals.map((h) => {
                const b = bedSummary(h);
                return (
                  <li key={h.id}>
                    <button
                      onClick={() => setSelected(h)}
                      className="surface-muted flex w-full items-center justify-between p-3 text-left transition-colors hover:border-info/50"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <MapPin className="size-4 text-muted-foreground" />
                        {h.name}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className={cn("size-2 rounded-full", BED_DOT[b.status])} />
                        {b.available}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
