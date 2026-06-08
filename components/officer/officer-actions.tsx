import Link from "next/link";
import { BedDouble, MessagesSquare, Radio } from "lucide-react";

const ACTIONS = [
  { href: "/officer/broadcast", icon: Radio, title: "Broadcast Alert", desc: "Send emergency alerts to citizens in affected areas." },
  { href: "/officer/broadcast", icon: BedDouble, title: "Hospital Beds", desc: "Update real-time hospital bed availability." },
  { href: "/officer/chat", icon: MessagesSquare, title: "Responder Chat", desc: "Coordinate securely with hospitals and response teams." },
];

export function OfficerActions() {
  return (
    <div className="surface p-5">
      <p className="flex items-center gap-2 font-semibold">
        Command Center
        <span className="pill bg-gold/15 text-gold">Authorized Officer</span>
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {ACTIONS.map((a) => (
          <Link key={a.title} href={a.href} className="surface-muted p-4 transition-colors hover:border-gold/50">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
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
