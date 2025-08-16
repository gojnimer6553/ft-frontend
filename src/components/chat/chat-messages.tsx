import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, LayoutGroup } from "motion/react";
import { ChatBubble } from "./chat-bubble";
import type { UIMessage } from "ai";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
}

function AnimatedEllipsis() {
  return (
    <span className="inline-flex w-[3ch] font-bold text-muted-foreground">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[1ch]"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const prevIsLoading = useRef(isLoading);

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

  useEffect(() => {
    prevIsLoading.current = isLoading;
  }, [isLoading]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 20;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    setIsAtBottom(atBottom);
  };

  return (
    <div className="relative flex flex-1 w-full min-h-0">
      <LayoutGroup>
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="chat-scrollbar flex flex-1 min-h-0 flex-col space-y-4 overflow-y-auto overflow-x-hidden py-4"
        >
          {messages.map((m, idx) => {
            const isLast = idx === messages.length - 1;
            const isStreaming = isLoading && isLast && m.role === "assistant";
            if (isStreaming) {
              return null;
            }
            const showMorph = !isLoading && prevIsLoading.current && isLast && m.role === "assistant";
            return (
              <ChatBubble
                key={m.id}
                role={m.role}
                layoutId={showMorph ? "assistant-bubble" : undefined}
              >
                {m.parts.map((p) => (p.type === "text" ? p.text : "")).join("")}
              </ChatBubble>
            );
          })}
          {isLoading && (
            <ChatBubble role="assistant" layoutId="assistant-bubble" key="typing">
              <AnimatedEllipsis />
            </ChatBubble>
          )}
        </div>
      </LayoutGroup>
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
