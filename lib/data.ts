// Typed accessors over the mock fixtures. Pages/components import from HERE,
// never from `constants/` directly — so a teammate can replace each function
// body with a Supabase query later without touching the UI.

import {
  areaRanks,
  caseMarkers,
  caseStats,
  conversations,
  currentUser,
  highRiskAlert,
  hospitals,
  missions,
  newsUpdates,
  opportunities,
  reportTypes,
  volunteerStats,
} from "@/constants";
import type {
  Conversation,
  Hospital,
  Mission,
  MissionStatus,
  Opportunity,
} from "@/types";

export const getCaseStats = () => caseStats;
export const getAreaRanks = () => areaRanks;
export const getCaseMarkers = () => caseMarkers;
export const getHighRiskAlert = () => highRiskAlert;
export const getNewsUpdates = () => newsUpdates;
export const getHospitals = (): Hospital[] => hospitals;
export const getHospital = (id: string) => hospitals.find((h) => h.id === id);
export const getReportTypes = () => reportTypes;
export const getCurrentUser = () => currentUser;
export const getVolunteerStats = () => volunteerStats;

export const getMissions = (status?: MissionStatus): Mission[] =>
  status ? missions.filter((m) => m.status === status) : missions;

export const getOpportunities = (): Opportunity[] => opportunities;

export const getConversations = (): Conversation[] => conversations;
export const getConversation = (id: string) =>
  conversations.find((c) => c.id === id);

// Aggregate hospital bed availability across departments.
export const bedSummary = (h: Hospital) => {
  const total = h.departments.reduce((s, d) => s + d.total, 0);
  const occupied = h.departments.reduce((s, d) => s + d.occupied, 0);
  const available = total - occupied;
  const ratio = available / total;
  const status: "available" | "limited" | "full" =
    ratio > 0.3 ? "available" : ratio > 0.1 ? "limited" : "full";
  return { total, occupied, available, ratio, status };
};
