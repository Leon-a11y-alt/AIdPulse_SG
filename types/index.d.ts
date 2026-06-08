// AidPulse SG domain models.
// Mock fixtures in `constants/` implement these; `lib/data.ts` is the single
// accessor seam that a real Supabase backend will replace later.

export type Role = "citizen" | "volunteer" | "officer";

export type Severity = "critical" | "high" | "moderate" | "low";

export interface Alert {
  id: string;
  area: string;
  title: string;
  message: string;
  severity: Severity;
  updatedAgo: string;
}

export interface NewsUpdate {
  id: string;
  title: string;
  source: string;
  ago: string;
  image?: string;
  live?: boolean;
}

export interface CaseStats {
  activeCases: number;
  activeDelta: number; // vs yesterday
  criticalCases: number;
  criticalDelta: number;
  updatedAgo: string;
}

export interface AreaRank {
  rank: number;
  area: string;
  cases: number;
  severity: Severity;
}

export interface Department {
  name: string;
  total: number;
  occupied: number;
}

export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lng: number;
  departments: Department[];
}

export type CaseType =
  | "dengue"
  | "covid"
  | "flu"
  | "heatstroke"
  | "foodborne"
  | "other";

export interface CaseMarker {
  id: string;
  area: string;
  type: CaseType;
  severity: Severity;
  cases: number;
  lat: number;
  lng: number;
}

export type MissionStatus = "assigned" | "ongoing" | "completed" | "cancelled";

export interface Mission {
  id: string;
  title: string;
  org: string;
  location: string;
  date: string;
  status: MissionStatus;
  hours: number;
}

export interface VolunteerStats {
  totalMissions: number;
  hours: number;
  livesSupported: number;
}

export type Urgency = "urgent" | "soon" | "flexible";

export interface Opportunity {
  id: string;
  title: string;
  org: string;
  location: string;
  date: string;
  distanceKm: number;
  roleType: string;
  skills: string[];
  urgency: Urgency;
  matched?: boolean;
}

export interface ChatMessage {
  id: string;
  author: string;
  initials: string;
  text: string;
  time: string;
  self?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  kind: "direct" | "group";
  members?: number;
  lastMessage: string;
  lastTime: string;
  unread?: number;
  online?: boolean;
  messages: ChatMessage[];
}

export type ReportTypeId =
  | "symptom"
  | "exposure"
  | "positive"
  | "crowded"
  | "other";

export interface ReportType {
  id: ReportTypeId;
  label: string;
  description: string;
}

export interface Volunteer {
  fullName: string;
  role: Role;
  initials: string;
  stats: VolunteerStats;
}
