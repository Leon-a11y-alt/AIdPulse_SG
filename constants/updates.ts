import type { Alert, NewsUpdate } from "@/types";

export const highRiskAlert: Alert = {
  id: "a1",
  area: "Tanjong Pagar",
  title: "Dengue Cluster Detected in Tanjong Pagar",
  message: "Stay vigilant and take necessary precautions.",
  severity: "critical",
  updatedAgo: "5 min ago",
};

export const newsUpdates: NewsUpdate[] = [
  {
    id: "n1",
    title: "NEA intensifies COVID-19 monitoring in crowded areas",
    source: "Enhanced checks at malls and transport hubs as cases rise.",
    ago: "6 min ago",
    live: true,
  },
  {
    id: "n2",
    title: "New variant under close watch by MOH",
    source: "Health authorities monitoring new variant spread and impact.",
    ago: "18 min ago",
  },
  {
    id: "n3",
    title: "Updated vaccination guidance for at-risk groups",
    source: "Booster recommendations updated for seniors and vulnerable.",
    ago: "1 hr ago",
  },
  {
    id: "n4",
    title: "Flu cases increase amid changing weather",
    source: "Doctors advise precaution and early treatment.",
    ago: "2 hrs ago",
  },
  {
    id: "n5",
    title: "Wastewater surveillance detects rise in virus fragments",
    source: "Early signals prompt proactive public health response.",
    ago: "3 hrs ago",
  },
];
