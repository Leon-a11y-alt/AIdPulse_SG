"use client";

import { createContext, useCallback, useContext, useState } from "react";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface AIContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  messages: AIMessage[];
  sending: boolean;
  send: (text: string) => void;
}

const AIContext = createContext<AIContextValue | null>(null);

let idSeq = 0;
const nextId = () => `m${++idSeq}`;

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [sending, setSending] = useState(false);

  const send = useCallback((text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: clean }]);
    setSending(true);

    // TODO(n8n): replace this canned reply with a POST to the n8n webhook
    // (or stream from the route handler). Keep the same message shape.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          text: "Thanks for reaching out. I'm AidPulse's assistant — I can help with health guidance, nearby services, and safety steps during an emergency. (Live answers are coming soon.)",
        },
      ]);
      setSending(false);
    }, 700);
  }, []);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <AIContext.Provider value={{ open, setOpen, toggle, messages, sending, send }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAI must be used within AIProvider");
  return ctx;
}
