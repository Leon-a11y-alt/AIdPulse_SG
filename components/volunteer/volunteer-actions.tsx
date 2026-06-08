import Link from "next/link";
import { ClipboardList, MapPinned, QrCode } from "lucide-react";

const ACTIONS = [
  { href: "/volunteer/missions", icon: ClipboardList, title: "My Missions", desc: "View and track the volunteering jobs or missions you've taken." },
  { href: "/volunteer/opportunities", icon: MapPinned, title: "Nearby Opportunities", desc: "Find and join nearby volunteer opportunities in your area." },
  { href: "/volunteer/checkin", icon: QrCode, title: "Check-in / Check-out", desc: "Check in to missions and update your participation." },
];

export function VolunteerActions() {
  return (
    <div className="surface p-5">
      <p className="flex items-center gap-2 font-semibold">
        Volunteer Dashboard
        <span className="pill bg-success/15 text-success">Active Volunteer</span>
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {ACTIONS.map((a) => (
          <Link key={a.href} href={a.href} className="surface-muted p-4 transition-colors hover:border-success/50">
            <span className="flex size-10 items-center justify-center rounded-xl bg-success/15 text-success">
              <a.icon className="size-5" />
            </span>
            <p className="mt-3 font-medium">{a.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
