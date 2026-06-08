import type { Mission, Opportunity, VolunteerStats } from "@/types";

export const volunteerStats: VolunteerStats = {
  totalMissions: 18,
  hours: 64,
  livesSupported: 230,
};

export const missions: Mission[] = [
  { id: "m1", title: "Dengue Fogging Support", org: "NEA", location: "Tanjong Pagar", date: "27 May 2026", status: "ongoing", hours: 4 },
  { id: "m2", title: "Vaccination Drive Assistant", org: "MOH", location: "Queenstown", date: "26 May 2026", status: "assigned", hours: 6 },
  { id: "m3", title: "Emergency Department Support", org: "SGH", location: "Outram", date: "24 May 2026", status: "completed", hours: 8 },
  { id: "m4", title: "Blood Donation Registration", org: "Red Cross", location: "Dhoby Ghaut", date: "22 May 2026", status: "completed", hours: 5 },
  { id: "m5", title: "Community Meal Distribution", org: "Willing Hearts", location: "Geylang", date: "20 May 2026", status: "cancelled", hours: 0 },
  { id: "m6", title: "Ward Assistance Volunteer", org: "TTSH", location: "Novena", date: "18 May 2026", status: "completed", hours: 7 },
];

export const opportunities: Opportunity[] = [
  {
    id: "o1",
    title: "Hospital Wayfinding Support",
    org: "SGH",
    location: "Outram",
    date: "27 May 2026 · 9:00 AM",
    distanceKm: 1,
    roleType: "General Volunteer",
    skills: ["General Volunteer"],
    urgency: "soon",
    matched: true,
  },
  {
    id: "o2",
    title: "Emergency Department Support",
    org: "Tan Tock Seng",
    location: "Novena",
    date: "27 May 2026 · 1:00 PM",
    distanceKm: 1.8,
    roleType: "Healthcare Support",
    skills: ["Certificate Required", "Hospital Role"],
    urgency: "urgent",
    matched: true,
  },
  {
    id: "o3",
    title: "Blood Donation Registration Assistant",
    org: "Red Cross",
    location: "Dhoby Ghaut",
    date: "28 May 2026 · 10:00 AM",
    distanceKm: 2.4,
    roleType: "General Volunteer",
    skills: ["General Volunteer"],
    urgency: "flexible",
  },
  {
    id: "o4",
    title: "Ward Assistance Volunteer",
    org: "NUH",
    location: "Kent Ridge",
    date: "28 May 2026 · 2:00 PM",
    distanceKm: 3.1,
    roleType: "Healthcare Support",
    skills: ["Healthcare Support", "Expert Role"],
    urgency: "soon",
    matched: true,
  },
  {
    id: "o5",
    title: "Medical Supply Sorting",
    org: "Red Cross Warehouse",
    location: "Jurong",
    date: "29 May 2026 · 9:00 AM",
    distanceKm: 4.8,
    roleType: "Logistics Support",
    skills: ["Logistics Support"],
    urgency: "flexible",
  },
];
