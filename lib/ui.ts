// Shared mappings from domain enums to Tailwind classes / labels.
import type { MissionStatus, Role, Severity, Urgency } from "@/types";

export const severityClass: Record<Severity, string> = {
  critical: "bg-danger/15 text-danger",
  high: "bg-warning/15 text-warning",
  moderate: "bg-info/15 text-info",
  low: "bg-success/15 text-success",
};

export const severityDot: Record<Severity, string> = {
  critical: "bg-danger",
  high: "bg-warning",
  moderate: "bg-info",
  low: "bg-success",
};

export const statusClass: Record<MissionStatus, string> = {
  assigned: "bg-info/15 text-info",
  ongoing: "bg-warning/15 text-warning",
  completed: "bg-success/15 text-success",
  cancelled: "bg-muted text-muted-foreground",
};

export const urgencyClass: Record<Urgency, string> = {
  urgent: "bg-danger/15 text-danger",
  soon: "bg-warning/15 text-warning",
  flexible: "bg-success/15 text-success",
};

export const roleLabel: Record<Role, string> = {
  citizen: "Citizen",
  volunteer: "Volunteer",
  officer: "Emergency Officer",
};

export const roleAccent: Record<Role, string> = {
  citizen: "text-info",
  volunteer: "text-success",
  officer: "text-gold",
};

export const deltaText = (n: number) =>
  `${n > 0 ? "+" : ""}${n} vs yesterday`;
