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
    <span className="inline-flex w-[3ch] justify-center font-bold text-muted-foreground">
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
  }, [messages, isLoading, isAtBottom]);
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

  const displayedMessages: UIMessage[] = [...messages];
  if (isLoading && displayedMessages[displayedMessages.length - 1]?.role === "assistant") {
    displayedMessages.pop();
  }
  if (isLoading) {
    displayedMessages.push({ id: "__loading__", role: "assistant", parts: [{ type: "text", text: "" }] });
  }
  const justFinishedLoading = !isLoading && prevIsLoading.current;

  return (
    <div className="relative flex flex-1 w-full min-h-0">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="chat-scrollbar flex flex-1 min-h-0 flex-col space-y-4 overflow-y-auto overflow-x-hidden py-4"
      >
        {displayedMessages.map((m, idx) => {
          const isLoadingBubble = m.id === "__loading__";
          const isLatestAssistant = m.role === "assistant" && idx === displayedMessages.length - 1;
          return (
            <ChatBubble
              key={m.id}
              role={m.role}
              layoutId={
                isLoadingBubble || (isLatestAssistant && justFinishedLoading)
                  ? "assistant-bubble"
                  : undefined
              }
            >
              {isLoadingBubble
                ? <AnimatedEllipsis />
                : m.parts.map((p) => (p.type === "text" ? p.text : "")).join("")}
            </ChatBubble>
          );
        })}
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
