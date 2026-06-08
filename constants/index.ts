import type { ReportType, Volunteer } from "@/types";

export * from "./cases";
export * from "./hospitals";
export * from "./updates";
export * from "./missions";
export * from "./chats";

// The signed-in person (mocked). Role is overridden at runtime by RoleProvider.
export const currentUser: Volunteer = {
  fullName: "Alex Lee",
  role: "citizen",
  initials: "AL",
  stats: { totalMissions: 18, hours: 64, livesSupported: 230 },
};

export const reportTypes: ReportType[] = [
  { id: "symptom", label: "Symptom", description: "Fever, cough, sore throat, loss of taste or smell, etc." },
  { id: "exposure", label: "Exposure", description: "Close contact with a confirmed or suspected case." },
  { id: "positive", label: "Positive Test", description: "Your positive COVID/ART/PCR-confirmed test result." },
  { id: "crowded", label: "Crowded Area", description: "Crowded place where safety measures are not observed." },
  { id: "other", label: "Others", description: "Any other concern related to public health." },
];

// AI Assistant quick-start topics (UI only — wired to n8n later).
export const aiTopics = [
  { id: "general", label: "General Information", icon: "Info" },
  { id: "health", label: "Health & Wellness", icon: "HeartPulse" },
  { id: "community", label: "Community & Services", icon: "Users" },
  { id: "safety", label: "Safety & Preparedness", icon: "ShieldCheck" },
  { id: "talk", label: "Talk to Someone", icon: "MessageCircle" },
] as const;

export const SG_CENTER: [number, number] = [1.3521, 103.8198];
