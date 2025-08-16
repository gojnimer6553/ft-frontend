import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useTranslate } from "@tolgee/react";
import { OpenAIChatTransport } from "@/lib/openai-chat-transport";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatFooter } from "./chat-footer";
import { ArrowDown } from "lucide-react";

export function Chat() {
  const { t } = useTranslate();
  const transport = useMemo(() => new OpenAIChatTransport(), []);
  const { messages, sendMessage, status } = useChat({ transport });

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

  async function handleSubmit(value: string) {
    if (!value.trim()) return;
    await sendMessage({
      role: "user",
      parts: [{ type: "text", text: value }],
    });
  }

  const placeholders = [
    t("chat.placeholder.typeYourMessage"),
    t("chat.placeholder.askQuestion"),
    t("chat.placeholder.shareThoughts"),
  ];

  return (
    <div className="flex flex-1 min-h-0 flex-col items-center px-4">
      <ChatHeader />
      <div className="flex w-full max-w-2xl flex-1 min-h-0 flex-col">
        <div className="relative flex flex-1 w-full min-h-0">
          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="chat-scrollbar flex flex-1 min-h-0 flex-col overflow-y-auto overflow-x-hidden py-4"
          >
            <ChatMessages messages={messages} isLoading={status !== "ready"} />
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
        <ChatFooter
          onSubmit={handleSubmit}
          disabled={status !== "ready"}
          placeholders={placeholders}
        />
      </div>
    </div>
  );
}

export default Chat;
