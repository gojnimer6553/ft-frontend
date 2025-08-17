import { ArrowDown, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatBubble } from "./chat-bubble";
import type { UIMessage } from "ai";

interface ChatMessagesProps {
  messages: UIMessage[];
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
    <div className="relative flex flex-1 w-full min-h-0">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="chat-scrollbar flex flex-1 min-h-0 flex-col space-y-4 overflow-y-auto overflow-x-hidden py-4"
      >
        {messages.map((m) => (
          <ChatBubble key={m.id} role={m.role}>
            {m.parts
              .filter((p) => p.type === "file")
              .map((p, i) => (
                <div key={`file-${i}`}>
                  {p.mediaType.startsWith("image/") ? (
                    <img
                      src={p.url}
                      alt={p.filename ?? "image"}
                      className="rounded-lg max-w-full"
                    />
                  ) : (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {p.filename ?? "Download file"}
                    </a>
                  )}
                </div>
              ))}
            {m.parts
              .filter((p) => p.type === "text")
              .map((p, i) => (
                <div key={`text-${i}`}>
                  <span>{p.text}</span>
                </div>
              ))}
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
