"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";
import type { ChatMessage } from "@/types";

export function ChatInterface() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        language === "te"
          ? "నమస్కారం! నేను KrishiMitra. పంట, పథకాలు, మార్కెట్ ధరల గురించి అడగండి."
          : "Hello! I'm KrishiMitra. Ask about crops, AP schemes, or market prices.",
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I couldn't respond. Please try again.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex h-[calc(100vh-12rem)] flex-col p-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                m.role === "user"
                  ? "bg-forest text-white"
                  : "bg-stone-100 text-forest-dark"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-stone-100 px-4 py-2 text-sm text-stone-500">
              ...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={handleSend}
        className="flex gap-2 border-t border-stone-200 p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            language === "te" ? "మీ ప్రశ్న టైప్ చేయండి..." : "Type your question..."
          }
          className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          aria-label="Chat message"
        />
        <Button type="submit" disabled={loading || !input.trim()} size="md">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
