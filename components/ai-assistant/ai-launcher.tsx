"use client";

import { Sparkles } from "lucide-react";
import { useAI } from "./ai-context";

/** Floating button present on every app screen to open the AI Assistant. */
export function AILauncher() {
  const { toggle, open } = useAI();
  if (open) return null;
  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-30 flex size-14 items-center justify-center rounded-full bg-info text-info-foreground shadow-lg shadow-info/30 transition-transform hover:scale-105"
      aria-label="Open AI Assistant"
    >
      <Sparkles className="size-6" />
    </button>
  );
}
