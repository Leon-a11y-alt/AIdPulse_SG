import type { Hospital } from "@/types";

export const hospitals: Hospital[] = [
  {
    id: "sgh",
    name: "Singapore General Hospital",
    lat: 1.2796,
    lng: 103.8347,
    departments: [
      { name: "Emergency", total: 60, occupied: 52 },
      { name: "ICU", total: 30, occupied: 27 },
      { name: "General Ward", total: 220, occupied: 168 },
      { name: "Isolation", total: 24, occupied: 21 },
    ],
  },
  {
    id: "ttsh",
    name: "Tan Tock Seng Hospital",
    lat: 1.3214,
    lng: 103.8456,
    departments: [
      { name: "Emergency", total: 55, occupied: 40 },
      { name: "ICU", total: 28, occupied: 19 },
      { name: "General Ward", total: 190, occupied: 132 },
      { name: "Isolation", total: 30, occupied: 14 },
    ],
  },
  {
    id: "nuh",
    name: "National University Hospital",
    lat: 1.2934,
    lng: 103.7836,
    departments: [
      { name: "Emergency", total: 50, occupied: 33 },
      { name: "ICU", total: 26, occupied: 12 },
      { name: "General Ward", total: 180, occupied: 96 },
      { name: "Isolation", total: 22, occupied: 8 },
    ],
  },
  {
    id: "cgh",
    name: "Changi General Hospital",
    lat: 1.3404,
    lng: 103.9496,
    departments: [
      { name: "Emergency", total: 48, occupied: 45 },
      { name: "ICU", total: 24, occupied: 23 },
      { name: "General Ward", total: 160, occupied: 149 },
      { name: "Isolation", total: 18, occupied: 17 },
    ],
  },
  {
    id: "ktph",
    name: "Khoo Teck Puat Hospital",
    lat: 1.4244,
    lng: 103.838,
    departments: [
      { name: "Emergency", total: 45, occupied: 28 },
      { name: "ICU", total: 22, occupied: 11 },
      { name: "General Ward", total: 150, occupied: 84 },
      { name: "Isolation", total: 16, occupied: 6 },
    ],
  },
];
