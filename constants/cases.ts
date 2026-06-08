import type { AreaRank, CaseMarker, CaseStats } from "@/types";

export const caseStats: CaseStats = {
  activeCases: 342,
  activeDelta: 23,
  criticalCases: 11,
  criticalDelta: 3,
  updatedAgo: "5 min ago",
};

export const areaRanks: AreaRank[] = [
  { rank: 1, area: "Tanjong Pagar", cases: 342, severity: "critical" },
  { rank: 2, area: "Geylang", cases: 256, severity: "high" },
  { rank: 3, area: "Queenstown", cases: 198, severity: "high" },
  { rank: 4, area: "Hougang", cases: 143, severity: "moderate" },
  { rank: 5, area: "Woodlands", cases: 96, severity: "moderate" },
];

// Approximate real Singapore coordinates so the Leaflet map lands correctly.
export const caseMarkers: CaseMarker[] = [
  { id: "c1", area: "Tanjong Pagar", type: "dengue", severity: "critical", cases: 342, lat: 1.2767, lng: 103.8456 },
  { id: "c2", area: "Geylang", type: "dengue", severity: "high", cases: 256, lat: 1.3186, lng: 103.887 },
  { id: "c3", area: "Queenstown", type: "covid", severity: "high", cases: 198, lat: 1.2942, lng: 103.7861 },
  { id: "c4", area: "Hougang", type: "flu", severity: "moderate", cases: 143, lat: 1.3712, lng: 103.8924 },
  { id: "c5", area: "Woodlands", type: "foodborne", severity: "moderate", cases: 96, lat: 1.4382, lng: 103.789 },
  { id: "c6", area: "Jurong East", type: "heatstroke", severity: "low", cases: 41, lat: 1.3331, lng: 103.7422 },
  { id: "c7", area: "Bedok", type: "dengue", severity: "moderate", cases: 88, lat: 1.3236, lng: 103.9273 },
];
