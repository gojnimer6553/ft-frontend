import { ArrowDown, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ChatBubble } from "./chat-bubble";
import type { CoreMessage } from "ai";

interface ChatMessagesProps {
  messages: CoreMessage[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 20;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    setIsAtBottom(atBottom);
  };

  return (
    <div className="relative flex-1 w-full max-w-2xl">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex h-full flex-col space-y-4 overflow-y-auto overflow-x-hidden py-4"
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} role={m.role}>
            {m.parts?.map((p) => (p.type === "text" ? p.text : "")).join("")}
          </ChatBubble>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 rounded-full bg-primary p-2 text-primary-foreground shadow"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
