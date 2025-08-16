import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChatBubble } from "./chat-bubble";
import type { UIMessage } from "ai";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
}

function AnimatedEllipsis() {
  return (
    <motion.span
      className="inline-block overflow-hidden text-muted-foreground"
      animate={{ width: ["0ch", "1ch", "2ch", "3ch", "0ch"] }}
      transition={{
        duration: 1.5,
        ease: "linear",
        repeat: Infinity,
        times: [0, 0.25, 0.5, 0.75, 1],
      }}
    >
      ...
    </motion.span>
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
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="chat-scrollbar flex flex-1 min-h-0 flex-col space-y-4 overflow-y-auto overflow-x-hidden py-4"
      >
        {messages.map((m, idx) => (
          <ChatBubble
            key={m.id}
            role={m.role}
            layoutId={
              !isLoading && prevIsLoading.current && idx === messages.length - 1 && m.role === "assistant"
                ? "assistant-bubble"
                : undefined
            }
          >
            {m.parts.map((p) => (p.type === "text" ? p.text : "")).join("")}
          </ChatBubble>
        ))}
        {isLoading && (
          <ChatBubble role="assistant" layoutId="assistant-bubble">
            <AnimatedEllipsis />
          </ChatBubble>
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
