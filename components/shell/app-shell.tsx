import { AILauncher } from "@/components/ai-assistant/ai-launcher";
import { AIPanel } from "@/components/ai-assistant/ai-panel";
import { TopNav } from "./top-nav";

/** Shared chrome for every authenticated screen: top nav + global AI assistant. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <TopNav />
      <main className="mx-auto max-w-[1600px] px-6 py-6">{children}</main>
      <AILauncher />
      <AIPanel />
    </div>
  );
}
