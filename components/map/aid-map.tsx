"use client";

import dynamic from "next/dynamic";
import type { CaseMarker, Hospital } from "@/types";

// Leaflet touches `window` at import time, so the map must never render on the
// server. ssr:false dynamic import is only allowed inside a client component.
const MapInner = dynamic(() => import("./map-inner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-background text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export function AidMap(props: {
  cases: CaseMarker[];
  hospitals: Hospital[];
  showCases: boolean;
  showHospitals: boolean;
  onSelectHospital: (h: Hospital) => void;
}) {
  return <MapInner {...props} />;
}
