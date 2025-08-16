import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/__authenticatedLayout/chat")({
  component: ChatPage,
});

function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "https://ai.laranjito.com/v1/chat/completions",
      credentials: "omit",
      body: { model: "gpt-4o-mini", stream: true },
      prepareSendMessagesRequest({ messages, body }) {
        return {
          body: {
            ...body,
            messages: messages.map((m) => ({
              role: m.role,
              content: m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join(""),
            })),
          },
        };
      },
    }),
  });
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }],
    });
    setInput("");
  }

  const isLoading = status !== "ready";

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
              {m.parts?.map((p) => (p.type === "text" ? p.text : "")).join("")}
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
