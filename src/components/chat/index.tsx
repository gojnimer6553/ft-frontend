import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { useTranslate } from "@tolgee/react";
import { motion } from "motion/react";
import { OpenAIChatTransport } from "@/lib/openai-chat-transport";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatFooter } from "./chat-footer";
import { Portal } from "@/components/portal";
import { cn } from "@/lib/utils";

export function Chat() {
  const { t } = useTranslate();
  const transport = useMemo(() => new OpenAIChatTransport(), []);
  const { messages, sendMessage, status } = useChat({ transport });
  const hasMessages = messages.length > 0;

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
    <>
      <Portal containerId="page-header-portal">
        <ChatHeader />
      </Portal>
      <div className="flex flex-1 min-h-0 flex-col items-center px-4 overflow-x-hidden overflow-y-auto">
        <div
          className={cn(
            "flex w-full max-w-2xl flex-1 min-h-0 flex-col overflow-x-hidden overflow-y-auto",
            !hasMessages && "justify-center"
          )}
        >
          {hasMessages && (
            <ChatMessages messages={messages} isLoading={status !== "ready"} />
          )}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
          >
            <ChatFooter
              onSubmit={handleSubmit}
              disabled={status !== "ready"}
              placeholders={placeholders}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Chat;
