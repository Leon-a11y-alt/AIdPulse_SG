"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, FileText, Map as MapIcon, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useAI } from "@/components/ai-assistant/ai-context";
import { useRole } from "@/components/providers/role-provider";
import { getCurrentUser } from "@/lib/data";
import { roleAccent, roleLabel } from "@/lib/ui";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Alerts", icon: Bell },
  { href: "/map", label: "Map", icon: MapIcon },
  { href: "/report", label: "Report", icon: FileText },
];

export function TopNav() {
  const pathname = usePathname();
  const { toggle } = useAI();
  const { role } = useRole();
  const user = getCurrentUser();

  // Role-aware home tab: each role has its own dashboard.
  const homeHref =
    role === "volunteer"
      ? "/volunteer/dashboard"
      : role === "officer"
        ? "/officer/dashboard"
        : "/dashboard";

  const tabs = [{ ...TABS[0], href: homeHref }, TABS[1], TABS[2]];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">
        <Logo href={homeHref} />

        <nav className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1">
          {tabs.map((t) => {
            const active = pathname === t.href || pathname.startsWith(t.href + "/");
            return (
              <Link
                key={t.label}
                href={t.href}
                className={cn("nav-tab", active && "nav-tab-active")}
              >
                <t.icon className="size-4" />
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="flex items-center gap-2 rounded-full border border-info/40 bg-info/10 px-3 py-2 text-sm font-medium text-info transition-colors hover:bg-info/20"
          >
            <Sparkles className="size-4" />
            <span className="max-sm:hidden">AI Assistant</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
              {user.initials}
            </div>
            <div className="leading-tight max-md:hidden">
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className={cn("text-xs", roleAccent[role])}>{roleLabel[role]}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
