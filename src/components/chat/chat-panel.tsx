import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Trash } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  status: "sent" | "sending" | "error";
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleSend(text: string) {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
      status: "sent",
    };
    const aiId = `${Date.now()}-ai`;
    const aiMsg: Message = {
      id: aiId,
      role: "ai",
      content: "",
      timestamp: new Date(),
      status: "sending",
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setLoading(true);
    // mock response
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? {
                ...m,
                content: `Resposta simulada para: ${text}`,
                status: "sent",
                timestamp: new Date(),
              }
            : m
        )
      );
      setLoading(false);
    }, 1000);
  }

  function handleClear() {
    setMessages([]);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <h1 className="text-lg font-medium">Chat</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Nova conversa"
            onClick={handleClear}
          >
            <RefreshCcw className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Limpar mensagens"
            onClick={handleClear}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      </header>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 scroll-smooth"
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
            status={msg.status}
          />
        ))}
      </div>
      <ChatInput onSend={handleSend} loading={loading} />
    </div>
  );
}
