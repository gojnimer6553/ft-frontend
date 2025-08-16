import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/__authenticatedLayout/chat")({
  component: ChatPage,
});

function ChatPage() {
  const { messages, setMessages } = useChat();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      parts: [{ type: "text" as const, text: input }],
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch(
        "https://ai.laranjito.com/v1/chat/completions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: nextMessages.map((m) => ({
              role: m.role,
              content: m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join(""),
            })),
          }),
        }
      );
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "";
      setMessages([
        ...nextMessages,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          parts: [{ type: "text" as const, text: reply }],
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {m.parts.map((p) => (p.type === "text" ? p.text : "")).join("")}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t bg-background p-4"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
