import Link from "next/link";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-danger to-info">
        <Activity className="size-5 text-white" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-bold tracking-tight">
        AidPulse <span className="text-info">SG</span>
      </span>
    </Link>
  );
}
