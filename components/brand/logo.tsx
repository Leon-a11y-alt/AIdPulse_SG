import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand lockup. Renders the AidPulse SG SVG (icon + wordmark + tagline) from
 * public/images/aidpulse_logo.svg. The asset is a 4:1 vector with white text,
 * so it sits on the dark theme as-is. Control size via `className` height.
 */
export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className="inline-flex items-center" aria-label="AidPulse SG">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/aidpulse_logo.svg"
        alt="AidPulse SG — One App. Faster Response."
        className={cn("h-9 w-auto", className)}
      />
    </Link>
  );
}
