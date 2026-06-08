"use client";

import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from "react-leaflet";
import { bedSummary } from "@/lib/data";
import type { CaseMarker, Hospital } from "@/types";
import { SG_CENTER } from "@/constants";

const SEVERITY_COLOR: Record<string, string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  moderate: "#3b82f6",
  low: "#22c55e",
};

const BED_COLOR: Record<string, string> = {
  available: "#22c55e",
  limited: "#f59e0b",
  full: "#ef4444",
};

export default function MapInner({
  cases,
  hospitals,
  showCases,
  showHospitals,
  onSelectHospital,
}: {
  cases: CaseMarker[];
  hospitals: Hospital[];
  showCases: boolean;
  showHospitals: boolean;
  onSelectHospital: (h: Hospital) => void;
}) {
  return (
    <MapContainer
      center={SG_CENTER}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#0a0b0e" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />

      {showCases &&
        cases.map((c) => (
          <CircleMarker
            key={c.id}
            center={[c.lat, c.lng]}
            radius={10 + Math.min(c.cases / 30, 14)}
            pathOptions={{
              color: SEVERITY_COLOR[c.severity],
              fillColor: SEVERITY_COLOR[c.severity],
              fillOpacity: 0.35,
              weight: 2,
            }}
          >
            <Tooltip direction="top">{c.area}</Tooltip>
            <Popup>
              <strong>{c.area}</strong>
              <br />
              {c.cases} {c.type} cases · {c.severity}
            </Popup>
          </CircleMarker>
        ))}

      {showHospitals &&
        hospitals.map((h) => {
          const b = bedSummary(h);
          return (
            <CircleMarker
              key={h.id}
              center={[h.lat, h.lng]}
              radius={9}
              eventHandlers={{ click: () => onSelectHospital(h) }}
              pathOptions={{
                color: BED_COLOR[b.status],
                fillColor: "#0a0b0e",
                fillOpacity: 1,
                weight: 3,
              }}
            >
              <Tooltip direction="top">{h.name}</Tooltip>
              <Popup>
                <strong>{h.name}</strong>
                <br />
                {b.available} beds available · {b.status}
              </Popup>
            </CircleMarker>
          );
        })}
    </MapContainer>
  );
}
