"use client";

import { useState } from "react";
import {
  HeartPulse,
  Info,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { aiTopics } from "@/constants";
import { cn } from "@/lib/utils";
import { useAI } from "./ai-context";

const ICONS = { Info, HeartPulse, Users, ShieldCheck, MessageCircle } as const;

export function AIPanel() {
  const { open, setOpen, messages, sending, send } = useAI();
  const [draft, setDraft] = useState("");

  const submit = () => {
    send(draft);
    setDraft("");
  };

  return (
    <>
      {/* Scrim */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      {/* Slide-in panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-border bg-popover shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-info/15 text-info">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Assistant</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-success" /> Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close assistant"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 no-scrollbar">
          {messages.length === 0 ? (
            <>
              <div>
                <h3 className="text-lg font-semibold">Hello! 👋</h3>
                <p className="text-sm text-muted-foreground">
                  How can I help you today? Pick a topic or ask anything.
                </p>
              </div>
              <div className="space-y-2">
                {aiTopics.map((t) => {
                  const Icon = ICONS[t.icon as keyof typeof ICONS] ?? Info;
                  return (
                    <button
                      key={t.id}
                      onClick={() => send(t.label)}
                      className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm font-medium transition-colors hover:border-info/50 hover:bg-info/5"
                    >
                      <span className="flex size-8 items-center justify-center rounded-lg bg-info/15 text-info">
                        <Icon className="size-4" />
                      </span>
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))
          )}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground">
                Typing…
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="flex size-8 items-center justify-center rounded-full bg-info text-info-foreground disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
