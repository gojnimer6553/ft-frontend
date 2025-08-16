import { useEffect, useRef, useState } from "react";
import { Message } from "@ai-sdk/react";
import { Loader2, ArrowDown } from "lucide-react";
import { ChatBubble } from "./chat-bubble";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
      setAtBottom(isAtBottom);
    };
    el.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (atBottom) {
      const el = containerRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }
  }, [messages, isLoading, atBottom]);

  return (
    <div className="relative flex-1 w-full max-w-2xl min-h-0">
      <div
        ref={containerRef}
        className="h-full space-y-4 overflow-y-auto overflow-x-hidden px-4 py-4"
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
      {!atBottom && (
        <button
          onClick={() => {
            const el = containerRef.current;
            if (el) {
              el.scrollTop = el.scrollHeight;
            }
          }}
          className="absolute bottom-4 right-4 rounded-full bg-primary p-2 text-primary-foreground shadow"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
