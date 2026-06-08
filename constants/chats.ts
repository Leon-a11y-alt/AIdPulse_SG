import type { Conversation } from "@/types";

export const conversations: Conversation[] = [
  {
    id: "ops",
    name: "Operations Command",
    kind: "group",
    members: 12,
    online: true,
    lastMessage: "Sarah: Dispatching teams to Hotspot 3 now.",
    lastTime: "10:46 AM",
    unread: 2,
    messages: [
      { id: "1", author: "John Lim (You)", initials: "JL", text: "Dengue cluster detected in Tanjong Pagar. Activating response protocol level 2.", time: "10:40 AM", self: true },
      { id: "2", author: "Sarah Tan", initials: "ST", text: "Acknowledged, EO. Dispatching teams to Hotspot 3 now.", time: "10:42 AM" },
      { id: "3", author: "Daniel Lee", initials: "DL", text: "Road closure at Orchid Rd due to breeding site cleanup.", time: "10:42 AM" },
      { id: "4", author: "Dr. Rachel Ng", initials: "RN", text: "Need more medics at Tanjong Pagar CC. Requesting additional support.", time: "10:43 AM" },
      { id: "5", author: "John Lim (You)", initials: "JL", text: "Noted. Additional support on the way. Keep the updates coming.", time: "10:44 AM", self: true },
    ],
  },
  { id: "dw", name: "Dr. David Wong", kind: "direct", lastMessage: "Acknowledged. Will update shortly.", lastTime: "10:31 AM", online: true, messages: [] },
  { id: "st", name: "Dr. Sarah Tan", kind: "direct", lastMessage: "On standby for further instructions.", lastTime: "10:30 AM", messages: [] },
  { id: "rn", name: "Dr. Rachel Ng", kind: "direct", lastMessage: "Preparing additional resources.", lastTime: "10:18 AM", messages: [] },
  { id: "lj", name: "Dr. Lim Wei Jun", kind: "direct", lastMessage: "Logistics support on the way.", lastTime: "10:05 AM", messages: [] },
  { id: "pn", name: "Dr. Priya Nair", kind: "direct", lastMessage: "Public enquiries being managed.", lastTime: "9:58 AM", messages: [] },
  { id: "hospitals", name: "Hospital Coordination", kind: "group", members: 8, lastMessage: "Bed availability updated for ICU.", lastTime: "9:40 AM", messages: [] },
];
